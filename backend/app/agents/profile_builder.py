"""
ProfileBuilderAgent - First Responder
Takes raw brain dumps and structures them into a queryable profile.
Aligned with Shikshagraha's education ecosystem terminology.
"""

import json
import logging
from typing import Dict, Any
from openai import OpenAI
from .base import BaseAgent, AgentAPIError
from ..graph.state import AgentState, ProgramBrief, WorkflowPhase

logger = logging.getLogger("lfa_builder.agents.profile_builder")


PROFILE_BUILDER_PROMPT = """You are an expert program analyst specializing in India's public education system and the Shikshagraha network of education organizations.

Your task is to analyze the program description and extract a structured program brief that maps to India's education ecosystem.

EDUCATION SYSTEM HIERARCHY (Shikshagraha Framework):
- SCHOOL LEVEL: Students, Teachers, Head Masters (HM)
- CLUSTER LEVEL: Cluster Resource Persons (CRP), Cluster Resource Centre Coordinator (CRCC)
- BLOCK LEVEL: Block Resource Persons (BRP), Block Resource Centre Coordinator (BRCC), Block Education Officer (BEO)
- DISTRICT LEVEL: District Education Officer (DEO), District Institute of Education and Training (DIET), District Magistrate (DM)

COMMON PROGRAM THEMES:
- FLN (Foundational Literacy & Numeracy) / NIPUN Bharat
- Teacher Professional Development (TPD)
- School Leadership Development
- Academic Mentoring
- Assessment & Learning Outcomes
- Career Readiness & Life Skills
- EdTech Integration
- Community & SMC (School Management Committee) Engagement

Extract the following from the user's description:

1. SUMMARY: A 2-3 sentence summary of the program
2. GOAL: The primary goal (what student-level change is expected?)
3. TARGET AUDIENCE: Primary beneficiaries (students in which grades/schools?)
4. PROGRAM THEME: Identify the theme (FLN, TPD, Leadership, etc.)
5. SYSTEM LEVEL: Which levels of the system will be engaged?
6. GEOGRAPHIC SCOPE: State(s), district(s), number of schools
7. KEY STAKEHOLDERS: Who at each system level will be involved?
8. STUDENT LEVEL CHANGE: What specific change do we expect for students?
9. CHALLENGES: Key problems being addressed

Respond ONLY with a valid JSON object:
{
    "summary": "A 2-3 sentence summary of the program",
    "goal": "The primary goal - what change at student level",
    "target_audience": "Students in grades X-Y in Z type of schools",
    "program_theme": "FLN|Teacher Development|Leadership|Assessment|Career Readiness|EdTech|Community|Mentoring|Other",
    "system_level": "School|Cluster|Block|District|State",
    "geographic_scope": "State/district/number of schools",
    "key_stakeholders": {
        "school": ["Students", "Teachers", "HM"],
        "cluster": ["CRP"],
        "block": ["BRP", "BEO"],
        "district": ["DEO", "DIET"]
    },
    "student_level_change": "Specific measurable change expected at student level",
    "context": "Additional context about the program",
    "challenges": ["Challenge 1", "Challenge 2"]
}

Be specific. If the user mentions "teachers", identify what type (primary, upper primary, secondary). If they mention a state or district, include it. Infer the program theme from context.
"""


class ProfileBuilder(BaseAgent):
    """
    First responder agent that structures raw user input into a ProgramBrief.
    Aligned with Shikshagraha education ecosystem terminology.
    """

    def __init__(self, client: OpenAI):
        super().__init__(client)
        # Profile building uses slightly lower temperature for consistency
        self.temperature = 0.3

    def process(self, state: AgentState) -> AgentState:
        """
        Process raw input and create a structured program brief.

        Args:
            state: Current agent state with raw_input

        Returns:
            Updated state with program_brief
        """
        raw_input = state.get("raw_input", "")
        session_id = state.get("session_id", "unknown")

        if not raw_input:
            state["error"] = "No input provided"
            return state

        logger.info(f"Building profile for session {session_id}")

        try:
            messages = [
                {"role": "system", "content": PROFILE_BUILDER_PROMPT},
                {"role": "user", "content": f"Please analyze this education program description:\n\n{raw_input}"}
            ]

            content = self._call_openai(messages, temperature=self.temperature)
            brief_data = json.loads(content)

            # Ensure backward compatibility - map new fields
            brief_data = self._ensure_backward_compatibility(brief_data)

            # Validate with Pydantic
            program_brief = ProgramBrief(**brief_data)

            state["program_brief"] = program_brief.model_dump()
            state["phase"] = WorkflowPhase.INQUIRY.value
            state["messages"] = state.get("messages", []) + [
                "Profile built successfully"
            ]

            logger.info(f"Profile built successfully for session {session_id}")
            logger.info(f"Identified theme: {brief_data.get('program_theme', 'Not identified')}")

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error for session {session_id}: {e}")
            state["error"] = "Failed to analyze program description. Please try rephrasing."

        except AgentAPIError as e:
            logger.error(f"API error for session {session_id}: {e}")
            if e.retryable:
                state["error"] = str(e)
            else:
                state["error"] = "Unable to process your request. Please try again later."

        except Exception as e:
            logger.exception(f"Unexpected error for session {session_id}: {e}")
            state["error"] = "An unexpected error occurred. Please try again."

        return state

    def _ensure_backward_compatibility(self, brief_data: Dict[str, Any]) -> Dict[str, Any]:
        """Ensure the brief data has all required fields with defaults."""
        # Set defaults for optional Shikshagraha fields
        brief_data.setdefault("program_theme", "Other")
        brief_data.setdefault("system_level", "School")
        brief_data.setdefault("geographic_scope", None)
        brief_data.setdefault("key_stakeholders", {
            "school": ["Students", "Teachers", "HM"],
            "cluster": ["CRP"],
            "block": ["BRP", "BEO"],
            "district": ["DEO", "DIET"]
        })
        brief_data.setdefault("student_level_change", None)
        brief_data.setdefault("context", None)
        brief_data.setdefault("challenges", [])

        return brief_data
