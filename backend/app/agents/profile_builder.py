"""
ProfileBuilderAgent - First Responder
Takes raw brain dumps and structures them into a queryable profile.
"""

import json
from typing import Dict, Any
from openai import OpenAI
from ..graph.state import AgentState, ProgramBrief, WorkflowPhase


PROFILE_BUILDER_PROMPT = """You are an expert program analyst for educational and social development initiatives.

Your task is to analyze the raw input provided by the user and extract a structured program brief.

The user will describe their program, initiative, or idea in an unstructured way. You need to:
1. Identify the core GOAL of the program
2. Summarize the program concisely
3. Identify the TARGET AUDIENCE (who benefits)
4. Note any context or background information
5. Identify key CHALLENGES or problems being addressed

Respond ONLY with a valid JSON object in this exact format:
{
    "summary": "A 2-3 sentence summary of the program",
    "goal": "The primary goal in one clear sentence",
    "target_audience": "Who the program is designed to help",
    "context": "Any relevant background or context (optional)",
    "challenges": ["Challenge 1", "Challenge 2", ...]
}

Be specific and actionable. Extract meaningful information even from vague inputs.
"""


class ProfileBuilder:
    """
    First responder agent that structures raw user input into a ProgramBrief.
    """

    def __init__(self, client: OpenAI):
        self.client = client
        self.model = "gpt-4o"

    def process(self, state: AgentState) -> AgentState:
        """
        Process raw input and create a structured program brief.

        Args:
            state: Current agent state with raw_input

        Returns:
            Updated state with program_brief
        """
        raw_input = state.get("raw_input", "")

        if not raw_input:
            state["error"] = "No input provided"
            return state

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": PROFILE_BUILDER_PROMPT},
                    {"role": "user", "content": f"Please analyze this program description:\n\n{raw_input}"}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            brief_data = json.loads(content)

            # Validate with Pydantic
            program_brief = ProgramBrief(**brief_data)

            state["program_brief"] = program_brief.model_dump()
            state["phase"] = WorkflowPhase.INQUIRY.value
            state["messages"] = state.get("messages", []) + [
                "Profile built successfully"
            ]

        except json.JSONDecodeError as e:
            state["error"] = f"Failed to parse AI response: {str(e)}"
        except Exception as e:
            state["error"] = f"Profile building failed: {str(e)}"

        return state

    async def aprocess(self, state: AgentState) -> AgentState:
        """Async version of process."""
        return self.process(state)
