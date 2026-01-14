"""
GeneratorAgent - The Creator
Creates a brand new LFA document from scratch when no templates match.
"""

import json
import logging
from typing import Dict, Any
from openai import OpenAI
from .base import BaseAgent, AgentAPIError
from ..graph.state import AgentState, LFADocument, Outcome, Output, Activity, WorkflowPhase

logger = logging.getLogger("lfa_builder.agents.generator")


GENERATOR_PROMPT = """You are an expert in creating Logical Framework Approach (LFA) documents for India's public education system, aligned with the Shikshagraha network of education organizations.

SHIKSHAGRAHA EDUCATION HIERARCHY:
- SCHOOL LEVEL: Students, Teachers, Head Masters (HM)
- CLUSTER LEVEL: Cluster Resource Persons (CRP), CRCC
- BLOCK LEVEL: Block Resource Persons (BRP), BRCC, Block Education Officer (BEO)
- DISTRICT LEVEL: District Education Officer (DEO), DIET, District Magistrate (DM)

Based on the program profile provided, create a complete LFA document with:

1. GOAL: The high-level impact at student level (what changes for students)
2. STUDENT_LEVEL_CHANGE: Specific measurable change expected for students
3. GOAL INDICATORS: How student-level change will be measured (2-3 SMART indicators)
4. ASSUMPTIONS: External factors that must hold true for success
5. STAKEHOLDER PRACTICE CHANGES: What each stakeholder level should do differently:
   - Teachers: New classroom practices they will adopt
   - Head Masters: How they will support and monitor teachers
   - CRPs/CRCC: How they will mentor and observe at cluster level
   - BRPs/BEO: How they will support program at block level
   - DEO/DIET: How they will institutionalize changes at district level
6. OUTCOMES: 2-3 medium-term changes (aligned with stakeholder hierarchy)
   - Each outcome needs indicators and means of verification
7. OUTPUTS: 3-4 deliverables per outcome (tangible products/services)
   - Each output needs indicators and means of verification
8. ACTIVITIES: 2-3 specific actions per output
   - Include responsible stakeholder for each activity

For INDICATORS, use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound).
For MEANS OF VERIFICATION, specify data sources (classroom observations, CRP visit reports, DIET records, etc.).

Respond ONLY with a valid JSON object in this exact format:
{
    "title": "Program Title",
    "goal": "The overarching goal statement (student-level impact)",
    "student_level_change": "Specific measurable change at student level",
    "program_theme": "FLN|Teacher Development|Leadership|Assessment|Career Readiness|EdTech|Community|Mentoring",
    "system_level": "School|Cluster|Block|District",
    "goal_indicators": ["Student outcome indicator 1", "Student outcome indicator 2"],
    "assumptions": ["Assumption 1", "Assumption 2"],
    "stakeholder_practice_changes": {
        "teachers": ["Practice change 1", "Practice change 2"],
        "head_masters": ["HM support action 1", "HM support action 2"],
        "crp_crcc": ["CRP mentoring action 1", "CRP observation focus 1"],
        "brp_beo": ["Block support action 1", "BEO monitoring action 1"],
        "deo_diet": ["DIET institutionalization action 1", "DEO policy action 1"]
    },
    "outcomes": [
        {
            "id": "OC1",
            "description": "Outcome description (stakeholder behavior change)",
            "indicators": ["Outcome indicator 1"],
            "means_of_verification": ["CRP visit reports", "Classroom observations"],
            "outputs": [
                {
                    "id": "OP1.1",
                    "description": "Output description",
                    "indicators": ["Output indicator 1"],
                    "means_of_verification": ["Training records", "DIET reports"],
                    "activities": [
                        {
                            "id": "A1.1.1",
                            "description": "Activity description",
                            "indicators": ["# of sessions conducted"],
                            "means_of_verification": ["Attendance sheets"],
                            "responsible_stakeholder": "CRP|BRP|DIET|Teacher|HM"
                        }
                    ]
                }
            ]
        }
    ]
}

Be specific and realistic. Reference the Shikshagraha stakeholder hierarchy. Ensure outcomes cascade from district to school level.
"""


class LFAGenerator(BaseAgent):
    """
    Creator agent that generates complete LFA documents from scratch.
    """

    def __init__(self, client: OpenAI):
        super().__init__(client)

    def process(self, state: AgentState) -> AgentState:
        """
        Generate a complete LFA document based on the final profile.

        Args:
            state: Current state with final_profile

        Returns:
            Updated state with lfa_document
        """
        session_id = state.get("session_id", "unknown")
        final_profile = state.get("final_profile")

        if not final_profile:
            # Fall back to program_brief if final_profile not available
            final_profile = state.get("program_brief", {})

        if not final_profile:
            state["error"] = "No profile available for LFA generation"
            return state

        logger.info(f"Generating LFA for session {session_id}")

        try:
            profile_text = json.dumps(final_profile, indent=2)

            messages = [
                {"role": "system", "content": GENERATOR_PROMPT},
                {"role": "user", "content": f"Please create a complete LFA document for this program:\n\n{profile_text}"}
            ]

            content = self._call_openai(messages)
            lfa_data = json.loads(content)

            # Validate structure
            lfa_document = self._validate_and_fix_structure(lfa_data)

            state["lfa_document"] = lfa_document
            state["phase"] = WorkflowPhase.FINALIZATION.value
            state["messages"] = state.get("messages", []) + [
                "LFA document generated successfully"
            ]

            logger.info(f"LFA generated successfully for session {session_id}")

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error for session {session_id}: {e}")
            state["error"] = "Failed to generate LFA. Please try again."

        except AgentAPIError as e:
            logger.error(f"API error for session {session_id}: {e}")
            if e.retryable:
                state["error"] = str(e)
            else:
                state["error"] = "Unable to generate LFA. Please try again later."

        except Exception as e:
            logger.exception(f"Unexpected error for session {session_id}: {e}")
            state["error"] = "An unexpected error occurred. Please try again."

        return state

    def _validate_and_fix_structure(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and fix the LFA structure to ensure completeness."""
        # Ensure required fields
        data.setdefault("title", "Untitled Program")
        data.setdefault("goal", "")
        data.setdefault("goal_indicators", [])
        data.setdefault("assumptions", [])
        data.setdefault("outcomes", [])

        # Shikshagraha-specific fields
        data.setdefault("student_level_change", None)
        data.setdefault("program_theme", None)
        data.setdefault("system_level", None)
        data.setdefault("stakeholder_practice_changes", {
            "teachers": [],
            "head_masters": [],
            "crp_crcc": [],
            "brp_beo": [],
            "deo_diet": []
        })

        # Ensure stakeholder_practice_changes has all keys
        spc = data.get("stakeholder_practice_changes", {})
        spc.setdefault("teachers", [])
        spc.setdefault("head_masters", [])
        spc.setdefault("crp_crcc", [])
        spc.setdefault("brp_beo", [])
        spc.setdefault("deo_diet", [])
        data["stakeholder_practice_changes"] = spc

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
                    activity.setdefault("responsible_stakeholder", None)

        return data
