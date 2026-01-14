"""
InterviewerAgent - The Critic
Analyzes the ProgramBrief and generates clarifying questions to fill gaps.
"""

import json
import logging

logger = logging.getLogger("lfa_builder.agents.interviewer")
from typing import Dict, Any, List
from openai import OpenAI
from ..graph.state import AgentState, Question, Questionnaire, WorkflowPhase


INTERVIEWER_PROMPT = """You are an expert program evaluator specializing in India's public education system and the Shikshagraha network of education organizations.

Your task is to analyze a program brief and identify GAPS, AMBIGUITIES, or MISSING INFORMATION needed to create a complete Logical Framework Approach (LFA) document aligned with Shikshagraha's education ecosystem.

SHIKSHAGRAHA EDUCATION HIERARCHY:
- SCHOOL LEVEL: Students, Teachers, Head Masters (HM)
- CLUSTER LEVEL: Cluster Resource Persons (CRP), CRCC
- BLOCK LEVEL: Block Resource Persons (BRP), BRCC, Block Education Officer (BEO)
- DISTRICT LEVEL: District Education Officer (DEO), DIET, District Magistrate (DM)

An LFA requires clear:
- Goals with measurable indicators (student-level changes)
- Outcomes (medium-term changes at each stakeholder level)
- Outputs (deliverables)
- Activities (specific actions)
- Assumptions and risks
- Means of verification
- Practice changes expected at each stakeholder level

Based on the program brief provided, generate 10-15 probing questions that will help fill in the gaps. Questions MUST cover these categories:

1. STUDENT_OUTCOMES: What specific learning outcome changes are expected for students?
   - Example: "What measurable improvement in FLN skills do you expect?"

2. TEACHER_PRACTICE: What should teachers start doing differently in classrooms?
   - Example: "What new teaching practices will teachers adopt?"

3. HM_PRACTICE: How will Head Masters support this intervention?
   - Example: "How will HMs monitor and support teacher practice changes?"

4. CRP_ROLE: How will Cluster Resource Persons (CRPs) monitor and mentor teachers?
   - Example: "What will CRPs observe during school visits?"

5. BLOCK_SUPPORT: What role will BRPs and BEOs play in sustaining this program?
   - Example: "How will block-level officials ensure program continuity?"

6. DISTRICT_ALIGNMENT: How will DEO/DIET institutionalize this approach?
   - Example: "What systems will DIET put in place for ongoing capacity building?"

7. MEASUREMENT: How will you track practice changes at each stakeholder level?
   - Example: "What data will be collected to verify behavior changes?"

8. SUSTAINABILITY: How will changes be sustained after the program ends?
   - Example: "What mechanisms will ensure continued practice after intervention?"

Respond ONLY with a valid JSON object:
{
    "questions": [
        {
            "id": "q1",
            "question": "The question text",
            "category": "student_outcomes|teacher_practice|hm_practice|crp_role|block_support|district_alignment|measurement|sustainability",
            "required": true,
            "stakeholder_level": "school|cluster|block|district|all"
        }
    ]
}

Make questions specific to the program described. Reference the specific stakeholder levels and program theme identified in the brief.
"""


from .base import BaseAgent, AgentAPIError

class Interviewer(BaseAgent):
    """
    Critic agent that generates clarifying questions based on the ProgramBrief.
    """

    def __init__(self, client: OpenAI):
        super().__init__(client)
        self.temperature = 0.5

    def process(self, state: AgentState) -> AgentState:
        """
        Analyze program brief and generate clarifying questions.

        Args:
            state: Current state with program_brief

        Returns:
            Updated state with questions
        """
        program_brief = state.get("program_brief")
        session_id = state.get("session_id", "unknown")

        if not program_brief:
            state["error"] = "No program brief available"
            return state

        try:
            brief_text = json.dumps(program_brief, indent=2)

            messages=[
                {"role": "system", "content": INTERVIEWER_PROMPT},
                {"role": "user", "content": f"Please analyze this program brief and generate clarifying questions:\n\n{brief_text}"}
            ]

            content = self._call_openai(messages, temperature=self.temperature)
            questions_data = json.loads(content)

            # Ensure unique IDs
            questions = []
            for i, q in enumerate(questions_data.get("questions", [])):
                q["id"] = q.get("id", f"q{i+1}")
                questions.append(q)

            # Validate with Pydantic
            questionnaire = Questionnaire(
                questions=[Question(**q) for q in questions]
            )

            state["questions"] = [q.model_dump() for q in questionnaire.questions]
            state["phase"] = WorkflowPhase.WAITING_FOR_ANSWERS.value
            state["messages"] = state.get("messages", []) + [
                f"Generated {len(questions)} clarifying questions"
            ]
            
            logger.info(f"Generated questions for session {session_id}")

        except json.JSONDecodeError as e:
            logger.error(f"JSON parse error for session {session_id}: {e}")
            state["error"] = f"Failed to parse AI response: {str(e)}"
            
        except AgentAPIError as e:
            logger.error(f"API error for session {session_id}: {e}")
            if e.retryable:
                state["error"] = str(e)
            else:
                state["error"] = "Unable to generate questions. Please try again later."
                
        except Exception as e:
            logger.exception(f"Unexpected error for session {session_id}: {e}")
            state["error"] = f"Interview generation failed: {str(e)}"

        return state

    async def aprocess(self, state: AgentState) -> AgentState:
        """Async version of process."""
        return self.process(state)
