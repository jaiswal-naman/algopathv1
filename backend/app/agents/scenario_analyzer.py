"""
ScenarioAnalyzer Agent - What-If Scenario Engine
Analyzes the impact of hypothetical scenarios on LFA implementation.
"""

import json
import logging
from typing import Dict, Any, List, Optional
from openai import OpenAI
from .base import BaseAgent, AgentAPIError

logger = logging.getLogger("lfa_builder.agents.scenario_analyzer")


# Predefined scenario templates
SCENARIO_TEMPLATES = {
    "budget_cut": {
        "name": "Budget Cut",
        "description": "What if the budget is reduced?",
        "parameters": ["percentage"],
        "default_prompt": "Budget is reduced by {percentage}%",
    },
    "timeline_delay": {
        "name": "Timeline Delay",
        "description": "What if implementation is delayed?",
        "parameters": ["months"],
        "default_prompt": "Implementation is delayed by {months} months",
    },
    "stakeholder_resistance": {
        "name": "Stakeholder Resistance",
        "description": "What if key stakeholders resist the program?",
        "parameters": ["stakeholder_type"],
        "default_prompt": "{stakeholder_type} resist adoption of the program",
    },
    "scale_change": {
        "name": "Scale Change",
        "description": "What if the program scale changes?",
        "parameters": ["direction", "percentage"],
        "default_prompt": "Program scale is {direction} by {percentage}%",
    },
    "resource_shortage": {
        "name": "Resource Shortage",
        "description": "What if key resources are unavailable?",
        "parameters": ["resource_type"],
        "default_prompt": "{resource_type} becomes unavailable or limited",
    },
    "external_shock": {
        "name": "External Shock",
        "description": "What if an external event disrupts implementation?",
        "parameters": ["event_type"],
        "default_prompt": "External disruption: {event_type}",
    },
}


SCENARIO_ANALYSIS_PROMPT = """You are an expert LFA (Logical Framework Approach) analyst specializing in risk assessment and scenario planning.

SCENARIO TO ANALYZE:
{scenario_description}

LFA DOCUMENT:
{lfa_json}

YOUR TASK:
Analyze how this scenario would impact the LFA implementation. For each impact:
1. Identify which LFA elements (activities, outputs, outcomes) would be affected
2. Assess the severity of impact (critical, significant, moderate, minimal)
3. Describe the cascading effects through the logic chain
4. Suggest mitigation strategies

CONTEXT:
This is for India's Shikshagraha education system with hierarchy:
- District: DEO, DIET
- Block: BRP, BEO
- Cluster: CRP, CRCC
- School: HM, Teachers
- Community: Parents, Students

RESPONSE FORMAT (JSON):
{{
    "scenario_summary": "Brief description of the scenario analyzed",
    "overall_impact": "critical|significant|moderate|minimal",
    "impact_score": 0-100,
    "affected_elements": [
        {{
            "element_type": "activity|output|outcome|goal",
            "element_id": "ID from LFA",
            "element_description": "Brief description",
            "impact_severity": "critical|significant|moderate|minimal",
            "impact_description": "How this element is affected",
            "cascade_effects": ["List of downstream effects"]
        }}
    ],
    "logic_chain_breaks": [
        {{
            "from_element": "Element ID",
            "to_element": "Element ID",
            "break_description": "Why this link is broken or weakened"
        }}
    ],
    "mitigation_strategies": [
        {{
            "strategy": "Specific action to mitigate",
            "priority": "immediate|short_term|medium_term",
            "feasibility": "high|medium|low",
            "responsible_stakeholder": "Who should implement"
        }}
    ],
    "modified_recommendations": [
        {{
            "original_element": "Original activity/output description",
            "recommended_change": "How to modify to adapt to scenario",
            "reason": "Why this change helps"
        }}
    ],
    "assumptions_invalidated": [
        "List of original assumptions that no longer hold under this scenario"
    ],
    "resilience_score": 0-100,
    "analysis_summary": "2-3 sentence summary of overall impact and key recommendations"
}}

Be specific and reference actual LFA elements. Provide actionable mitigation strategies.
"""


class ScenarioAnalyzer(BaseAgent):
    """
    Analyzes hypothetical scenarios and their impact on LFA implementation.
    """

    def __init__(self, client: OpenAI):
        super().__init__(client)
        self.templates = SCENARIO_TEMPLATES

    def get_scenario_templates(self) -> List[Dict[str, Any]]:
        """Return available scenario templates."""
        return [
            {
                "id": key,
                "name": template["name"],
                "description": template["description"],
                "parameters": template["parameters"],
            }
            for key, template in self.templates.items()
        ]

    def analyze_scenario(
        self,
        lfa_document: Dict[str, Any],
        scenario_description: str,
        scenario_type: Optional[str] = None,
        parameters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Analyze the impact of a scenario on the LFA.

        Args:
            lfa_document: The LFA document to analyze
            scenario_description: Free-text description of the scenario
            scenario_type: Optional predefined scenario type
            parameters: Optional parameters for templated scenarios

        Returns:
            Detailed impact analysis
        """
        try:
            # Build scenario description from template if provided
            if scenario_type and scenario_type in self.templates:
                template = self.templates[scenario_type]
                if parameters:
                    scenario_description = template["default_prompt"].format(**parameters)

            # Build the prompt
            prompt = SCENARIO_ANALYSIS_PROMPT.format(
                scenario_description=scenario_description,
                lfa_json=json.dumps(lfa_document, indent=2)
            )

            messages = [
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Analyze this scenario: {scenario_description}"}
            ]

            # Call LLM
            content = self._call_openai(messages, temperature=0.4)
            analysis = json.loads(content)

            # Enrich with metadata
            analysis["scenario_input"] = scenario_description
            analysis["scenario_type"] = scenario_type
            analysis["lfa_title"] = lfa_document.get("title", "Untitled")

            logger.info(f"Scenario analysis completed: {analysis.get('overall_impact', 'unknown')} impact")

            return analysis

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error in scenario analysis: {e}")
            return {
                "error": "Failed to parse analysis results",
                "scenario_input": scenario_description,
            }

        except AgentAPIError as e:
            logger.error(f"API error in scenario analysis: {e}")
            return {
                "error": str(e),
                "retryable": e.retryable,
                "scenario_input": scenario_description,
            }

        except Exception as e:
            logger.exception(f"Unexpected error in scenario analysis: {e}")
            return {
                "error": f"Unexpected error: {str(e)}",
                "scenario_input": scenario_description,
            }

    def compare_scenarios(
        self,
        lfa_document: Dict[str, Any],
        scenarios: List[str]
    ) -> Dict[str, Any]:
        """
        Compare multiple scenarios side by side.

        Args:
            lfa_document: The LFA document
            scenarios: List of scenario descriptions

        Returns:
            Comparative analysis of all scenarios
        """
        results = {}
        for scenario in scenarios:
            results[scenario] = self.analyze_scenario(lfa_document, scenario)

        # Sort by impact severity
        impact_order = {"critical": 0, "significant": 1, "moderate": 2, "minimal": 3}
        sorted_scenarios = sorted(
            results.items(),
            key=lambda x: impact_order.get(x[1].get("overall_impact", "minimal"), 4)
        )

        return {
            "scenarios_analyzed": len(scenarios),
            "results": dict(sorted_scenarios),
            "highest_risk_scenario": sorted_scenarios[0][0] if sorted_scenarios else None,
        }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process method for compatibility with BaseAgent interface."""
        lfa_document = state.get("lfa_document")
        scenario = state.get("scenario_description", "Budget cut by 30%")

        if not lfa_document:
            state["error"] = "No LFA document available for scenario analysis"
            return state

        analysis = self.analyze_scenario(lfa_document, scenario)
        state["scenario_analysis"] = analysis

        return state
