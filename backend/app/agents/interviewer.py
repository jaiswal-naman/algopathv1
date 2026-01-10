"""
InterviewerAgent - The Critic
Analyzes the ProgramBrief and generates clarifying questions to fill gaps.
"""

import json
import uuid
from typing import Dict, Any, List
from openai import OpenAI
from ..graph.state import AgentState, Question, Questionnaire, WorkflowPhase


INTERVIEWER_PROMPT = """You are an expert program evaluator and critical analyst for educational and social development initiatives.

Your task is to analyze a program brief and identify GAPS, AMBIGUITIES, or MISSING INFORMATION that would be needed to create a complete Logical Framework Approach (LFA) document.

An LFA requires clear:
- Goals with measurable indicators
- Outcomes (medium-term changes)
- Outputs (deliverables)
- Activities (specific actions)
- Assumptions and risks
- Means of verification
- Resource requirements

Based on the program brief provided, generate 10-15 probing questions that will help fill in the gaps. Questions should cover:

1. SCOPE: What exactly is included/excluded?
2. RESOURCES: Budget, staff, partnerships needed?
3. TIMELINE: Key milestones and duration?
4. MEASUREMENT: How will success be measured?
5. RISKS: What could go wrong?
6. STAKEHOLDERS: Who else is involved?
7. SUSTAINABILITY: How will impact be maintained?

Respond ONLY with a valid JSON object:
{
    "questions": [
        {
            "id": "q1",
            "question": "The question text",
            "category": "scope|resources|timeline|measurement|risks|stakeholders|sustainability",
            "required": true
        }
    ]
}

Make questions specific to the program described. Avoid generic questions.
"""


class Interviewer:
    """
    Critic agent that generates clarifying questions based on the ProgramBrief.
    """

    def __init__(self, client: OpenAI):
        self.client = client
        self.model = "gpt-4o"

    def process(self, state: AgentState) -> AgentState:
        """
        Analyze program brief and generate clarifying questions.

        Args:
            state: Current state with program_brief

        Returns:
            Updated state with questions
        """
        program_brief = state.get("program_brief")

        if not program_brief:
            state["error"] = "No program brief available"
            return state

        try:
            brief_text = json.dumps(program_brief, indent=2)

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": INTERVIEWER_PROMPT},
                    {"role": "user", "content": f"Please analyze this program brief and generate clarifying questions:\n\n{brief_text}"}
                ],
                temperature=0.5,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
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

        except json.JSONDecodeError as e:
            state["error"] = f"Failed to parse AI response: {str(e)}"
        except Exception as e:
            state["error"] = f"Interview generation failed: {str(e)}"

        return state

    async def aprocess(self, state: AgentState) -> AgentState:
        """Async version of process."""
        return self.process(state)
