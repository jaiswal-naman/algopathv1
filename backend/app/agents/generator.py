"""
GeneratorAgent - The Creator
Creates a brand new LFA document from scratch when no templates match.
"""

import json
from typing import Dict, Any
from openai import OpenAI
from ..graph.state import AgentState, LFADocument, Outcome, Output, Activity, WorkflowPhase


GENERATOR_PROMPT = """You are an expert in creating Logical Framework Approach (LFA) documents for educational and social development programs.

Based on the program profile provided, create a complete LFA document with:

1. GOAL: The high-level impact the program aims to achieve
2. GOAL INDICATORS: How goal achievement will be measured (2-3 indicators)
3. ASSUMPTIONS: External factors that must hold true for success
4. OUTCOMES: 2-3 medium-term changes (what changes in behavior/capacity)
   - Each outcome needs indicators and means of verification
5. OUTPUTS: 3-4 deliverables per outcome (tangible products/services)
   - Each output needs indicators and means of verification
6. ACTIVITIES: 2-3 specific actions per output

For INDICATORS, use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound).
For MEANS OF VERIFICATION, specify data sources (surveys, reports, observations, etc.).

Respond ONLY with a valid JSON object in this exact format:
{
    "title": "Program Title",
    "goal": "The overarching goal statement",
    "goal_indicators": ["Indicator 1", "Indicator 2"],
    "assumptions": ["Assumption 1", "Assumption 2"],
    "outcomes": [
        {
            "id": "OC1",
            "description": "Outcome description",
            "indicators": ["Outcome indicator 1"],
            "means_of_verification": ["Survey data", "Reports"],
            "outputs": [
                {
                    "id": "OP1.1",
                    "description": "Output description",
                    "indicators": ["Output indicator 1"],
                    "means_of_verification": ["Training records"],
                    "activities": [
                        {
                            "id": "A1.1.1",
                            "description": "Activity description",
                            "indicators": ["# of sessions conducted"],
                            "means_of_verification": ["Attendance sheets"]
                        }
                    ]
                }
            ]
        }
    ]
}

Be specific and realistic. Tailor everything to the actual program described.
"""


class LFAGenerator:
    """
    Creator agent that generates complete LFA documents from scratch.
    """

    def __init__(self, client: OpenAI):
        self.client = client
        self.model = "gpt-4o"

    def process(self, state: AgentState) -> AgentState:
        """
        Generate a complete LFA document based on the final profile.

        Args:
            state: Current state with final_profile

        Returns:
            Updated state with lfa_document
        """
        final_profile = state.get("final_profile")

        if not final_profile:
            # Fall back to program_brief if final_profile not available
            final_profile = state.get("program_brief", {})

        if not final_profile:
            state["error"] = "No profile available for LFA generation"
            return state

        try:
            profile_text = json.dumps(final_profile, indent=2)

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": GENERATOR_PROMPT},
                    {"role": "user", "content": f"Please create a complete LFA document for this program:\n\n{profile_text}"}
                ],
                temperature=0.4,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            lfa_data = json.loads(content)

            # Validate structure
            lfa_document = self._validate_and_fix_structure(lfa_data)

            state["lfa_document"] = lfa_document
            state["phase"] = WorkflowPhase.FINALIZATION.value
            state["messages"] = state.get("messages", []) + [
                "LFA document generated successfully"
            ]

        except json.JSONDecodeError as e:
            state["error"] = f"Failed to parse AI response: {str(e)}"
        except Exception as e:
            state["error"] = f"LFA generation failed: {str(e)}"

        return state

    def _validate_and_fix_structure(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and fix the LFA structure to ensure completeness."""
        # Ensure required fields
        data.setdefault("title", "Untitled Program")
        data.setdefault("goal", "")
        data.setdefault("goal_indicators", [])
        data.setdefault("assumptions", [])
        data.setdefault("outcomes", [])

        # Fix outcomes structure
        for i, outcome in enumerate(data.get("outcomes", [])):
            outcome.setdefault("id", f"OC{i+1}")
            outcome.setdefault("description", "")
            outcome.setdefault("indicators", [])
            outcome.setdefault("means_of_verification", [])
            outcome.setdefault("outputs", [])

            # Fix outputs structure
            for j, output in enumerate(outcome.get("outputs", [])):
                output.setdefault("id", f"OP{i+1}.{j+1}")
                output.setdefault("description", "")
                output.setdefault("indicators", [])
                output.setdefault("means_of_verification", [])
                output.setdefault("activities", [])

                # Fix activities structure
                for k, activity in enumerate(output.get("activities", [])):
                    activity.setdefault("id", f"A{i+1}.{j+1}.{k+1}")
                    activity.setdefault("description", "")
                    activity.setdefault("indicators", [])
                    activity.setdefault("means_of_verification", [])

        return data

    async def aprocess(self, state: AgentState) -> AgentState:
        """Async version of process."""
        return self.process(state)
