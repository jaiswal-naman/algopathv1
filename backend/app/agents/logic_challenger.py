"""
LogicChallenger Agent - AI Devil's Advocate for LFA Documents
Proactively identifies logic gaps, unrealistic assumptions, and missing links
in generated LFA documents.
"""

import json
import logging
from typing import Dict, Any, List, Optional
from openai import OpenAI
from .base import BaseAgent, AgentAPIError

logger = logging.getLogger("lfa_builder.agents.logic_challenger")


# Prompt for the logic challenger
LOGIC_CHALLENGER_PROMPT = """You are an expert LFA (Logical Framework Approach) reviewer acting as a "Devil's Advocate."

Your job is to critically analyze this LFA document and identify:

1. LOGIC GAPS - Missing links in the causal chain
   - Does Activity A actually lead to Output B?
   - Does Output B actually contribute to Outcome C?
   - Are there missing intermediate steps?

2. UNREALISTIC ASSUMPTIONS - Things assumed that may not hold
   - External dependencies not accounted for
   - Resource assumptions that may fail
   - Behavioral change assumptions without enabling activities

3. MISSING ACTIVITIES - Actions needed but not specified
   - Training for expected behavior changes
   - Resources/materials needed but not procured
   - Coordination mechanisms not established

4. INDICATOR WEAKNESSES - Measurement problems
   - Indicators that can't actually be measured
   - No baseline data available
   - Targets not SMART (Specific, Measurable, Achievable, Relevant, Time-bound)

5. STAKEHOLDER BLINDSPOTS - Who's been forgotten?
   - Activities without clear ownership
   - Stakeholders affected but not engaged
   - Missing accountability linkages

CONTEXT - Shikshagraha Education Hierarchy:
- District: DEO (District Education Officer), DIET (training institute)
- Block: BRP (Block Resource Person), BEO (Block Education Officer)
- Cluster: CRP (Cluster Resource Person), CRCC
- School: Head Master (HM), Teachers
- Community: Parents (SMC), Students

LFA DOCUMENT TO ANALYZE:
{lfa_json}

ANALYSIS SUMMARY:
Title: {title}
Goal: {goal}
Number of Outcomes: {num_outcomes}
Number of Outputs: {num_outputs}
Number of Activities: {num_activities}
Key Assumptions: {assumptions}

YOUR TASK:
1. Trace each logic chain from Activity → Output → Outcome → Goal
2. Identify SPECIFIC weaknesses with EXACT references to LFA elements
3. Rate each issue by severity: critical (blocks success), important (reduces effectiveness), or minor (improvement opportunity)
4. Provide ACTIONABLE recommendations for each issue

RESPONSE FORMAT (JSON):
{{
    "overall_score": 0-100,
    "overall_assessment": "Brief 2-sentence assessment of LFA quality",
    "logic_chain_analysis": {{
        "strongest_chain": "Brief description of the most solid logic path",
        "weakest_chain": "Brief description of the most problematic logic path"
    }},
    "challenges": [
        {{
            "id": "CHG-001",
            "category": "logic_gap|unrealistic_assumption|missing_activity|indicator_weakness|stakeholder_blindspot",
            "severity": "critical|important|minor",
            "title": "Brief title (5-7 words)",
            "description": "Detailed explanation of the issue",
            "lfa_element": "Specific outcome/output/activity ID this relates to",
            "logic_break": "What the LFA assumes vs what might actually happen",
            "recommendation": "Specific action to address this issue",
            "effort_to_fix": "low|medium|high"
        }}
    ],
    "quick_wins": [
        {{
            "action": "Simple improvement that can be made quickly",
            "impact": "Expected benefit"
        }}
    ],
    "summary_stats": {{
        "critical_issues": 0,
        "important_issues": 0,
        "minor_issues": 0,
        "logic_gaps": 0,
        "unrealistic_assumptions": 0,
        "missing_activities": 0,
        "indicator_weaknesses": 0,
        "stakeholder_blindspots": 0
    }}
}}

Be thorough but constructive. Your goal is to strengthen the LFA, not destroy it.
Aim for 5-8 specific, actionable challenges.
"""


class LogicChallenger(BaseAgent):
    """
    AI Devil's Advocate that proactively challenges LFA logic.
    Identifies gaps, unrealistic assumptions, and missing links.
    """

    def __init__(self, client: OpenAI):
        super().__init__(client)

    def analyze_lfa(self, lfa_document: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform comprehensive logic analysis on an LFA document.

        Args:
            lfa_document: The complete LFA document to analyze

        Returns:
            Analysis results with challenges and recommendations
        """
        try:
            # Calculate summary statistics
            outcomes = lfa_document.get("outcomes", [])
            num_outcomes = len(outcomes)
            num_outputs = sum(len(oc.get("outputs", [])) for oc in outcomes)
            num_activities = sum(
                len(op.get("activities", []))
                for oc in outcomes
                for op in oc.get("outputs", [])
            )

            # Build the prompt
            prompt = LOGIC_CHALLENGER_PROMPT.format(
                lfa_json=json.dumps(lfa_document, indent=2),
                title=lfa_document.get("title", "Untitled Program"),
                goal=lfa_document.get("goal", "Not specified"),
                num_outcomes=num_outcomes,
                num_outputs=num_outputs,
                num_activities=num_activities,
                assumptions=", ".join(lfa_document.get("assumptions", [])[:5]) or "None specified"
            )

            messages = [
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Please analyze this LFA and identify all logic weaknesses."}
            ]

            # Call LLM
            content = self._call_openai(messages, temperature=0.3)
            analysis = json.loads(content)

            # Enrich with metadata
            analysis["lfa_title"] = lfa_document.get("title", "Untitled")
            analysis["analyzed_at"] = self._get_timestamp()

            logger.info(f"Logic analysis completed: {analysis.get('summary_stats', {}).get('critical_issues', 0)} critical issues found")

            return analysis

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error in logic analysis: {e}")
            return {
                "error": "Failed to parse analysis results",
                "overall_score": 0,
                "challenges": []
            }

        except AgentAPIError as e:
            logger.error(f"API error in logic analysis: {e}")
            return {
                "error": str(e),
                "retryable": e.retryable,
                "overall_score": 0,
                "challenges": []
            }

        except Exception as e:
            logger.exception(f"Unexpected error in logic analysis: {e}")
            return {
                "error": f"Unexpected error: {str(e)}",
                "overall_score": 0,
                "challenges": []
            }

    def _get_timestamp(self) -> str:
        """Get current timestamp for metadata."""
        from datetime import datetime
        return datetime.utcnow().isoformat()

    def get_challenge_by_category(
        self,
        analysis: Dict[str, Any],
        category: str
    ) -> List[Dict[str, Any]]:
        """
        Filter challenges by category.

        Args:
            analysis: The analysis results
            category: Category to filter by

        Returns:
            List of challenges in that category
        """
        challenges = analysis.get("challenges", [])
        return [c for c in challenges if c.get("category") == category]

    def get_critical_issues(self, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Get only critical severity issues."""
        challenges = analysis.get("challenges", [])
        return [c for c in challenges if c.get("severity") == "critical"]

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process method for compatibility with BaseAgent interface.
        """
        lfa_document = state.get("lfa_document")

        if not lfa_document:
            state["error"] = "No LFA document available for logic analysis"
            return state

        analysis = self.analyze_lfa(lfa_document)
        state["logic_analysis"] = analysis

        return state


# Specialized prompt for quick validation (lighter analysis)
QUICK_VALIDATION_PROMPT = """Quickly validate this LFA for the 3 most critical issues:

LFA: {lfa_json}

Return JSON:
{{
    "is_valid": true/false,
    "critical_issues": [
        {{
            "issue": "Brief description",
            "fix": "How to address it"
        }}
    ],
    "confidence_score": 0-100
}}

Limit to top 3 most important issues only. Be concise.
"""


class QuickValidator(BaseAgent):
    """
    Lightweight LFA validator for quick checks.
    Use this for real-time validation during editing.
    """

    def __init__(self, client: OpenAI):
        super().__init__(client)

    def validate(self, lfa_document: Dict[str, Any]) -> Dict[str, Any]:
        """
        Perform quick validation on an LFA document.

        Args:
            lfa_document: The LFA document to validate

        Returns:
            Quick validation results
        """
        try:
            prompt = QUICK_VALIDATION_PROMPT.format(
                lfa_json=json.dumps(lfa_document, indent=2)
            )

            messages = [
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Validate this LFA quickly."}
            ]

            content = self._call_openai(messages, temperature=0.2)
            return json.loads(content)

        except Exception as e:
            logger.error(f"Quick validation failed: {e}")
            return {
                "is_valid": True,  # Don't block on errors
                "critical_issues": [],
                "confidence_score": 0,
                "error": str(e)
            }

    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process method for compatibility."""
        lfa_document = state.get("lfa_document")
        if lfa_document:
            state["quick_validation"] = self.validate(lfa_document)
        return state
