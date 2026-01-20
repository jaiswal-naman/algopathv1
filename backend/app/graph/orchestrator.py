"""
Orchestrator - The Manager
LangGraph-based state machine that coordinates all worker agents.
"""

import os
import logging
from typing import Dict, Any, Literal, Optional
from langgraph.graph import StateGraph, END
from openai import OpenAI

from .state import AgentState, WorkflowPhase, create_initial_state
from ..agents import ProfileBuilder, Interviewer, LFAGenerator, GraphVisualizer

logger = logging.getLogger("lfa_builder.orchestrator")


def create_workflow(openai_client: OpenAI):
    """
    Create the LangGraph workflow that orchestrates all agents.

    The workflow follows this path:
    1. INGESTION: ProfileBuilder processes raw input
    2. INQUIRY: Interviewer generates questions
    3. (PAUSE for user answers)
    4. FINALIZATION: Generator creates LFA -> Visualizer creates diagram

    Returns:
        Compiled LangGraph workflow
    """

    # Initialize agents
    profile_builder = ProfileBuilder(openai_client)
    interviewer = Interviewer(openai_client)
    generator = LFAGenerator(openai_client)
    visualizer = GraphVisualizer()

    # Define node functions
    def build_profile(state: AgentState) -> AgentState:
        """Node: Process raw input into structured profile."""
        return profile_builder.process(state)

    def generate_questions(state: AgentState) -> AgentState:
        """Node: Generate clarifying questions."""
        return interviewer.process(state)

    def generate_lfa(state: AgentState) -> AgentState:
        """Node: Generate LFA from scratch."""
        return generator.process(state)

    def visualize_lfa(state: AgentState) -> AgentState:
        """Node: Convert LFA to Mermaid diagram."""
        return visualizer.process(state)

    # Define conditional edges
    def should_continue_after_profile(state: AgentState) -> Literal["generate_questions", "end"]:
        """Decide whether to continue after profiling."""
        if state.get("error"):
            return "end"
        return "generate_questions"

    # Build the graph
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("build_profile", build_profile)
    workflow.add_node("generate_questions", generate_questions)
    workflow.add_node("generate_lfa", generate_lfa)
    workflow.add_node("visualize_lfa", visualize_lfa)

    # Set entry point
    workflow.set_entry_point("build_profile")

    # Add edges
    workflow.add_conditional_edges(
        "build_profile",
        should_continue_after_profile,
        {
            "generate_questions": "generate_questions",
            "end": END
        }
    )

    workflow.add_edge("generate_questions", END)  # Pause for user input
    workflow.add_edge("generate_lfa", "visualize_lfa")
    workflow.add_edge("visualize_lfa", END)

    return workflow.compile()


class LFAOrchestrator:
    """
    High-level orchestrator that manages the entire LFA building session.
    Handles pauses for user input and resumption of workflow.
    """

    def __init__(self, openai_api_key: str):
        self.client = OpenAI(
            api_key=openai_api_key,
            timeout=float(os.getenv("LLM_TIMEOUT", "90"))
        )
        self.workflow = create_workflow(self.client)

        # Agent instances for manual invocation
        self.generator = LFAGenerator(self.client)
        self.visualizer = GraphVisualizer()

    def start_session(self, session_id: str, raw_input: str) -> AgentState:
        """
        Start a new LFA building session.
        Runs through Phase 1 (Ingestion) and Phase 2 (Inquiry).

        Returns state with questions for user to answer.
        """
        logger.info(f"Starting session {session_id}")
        initial_state = create_initial_state(session_id, raw_input)
        result = self.workflow.invoke(initial_state)
        logger.info(f"Session {session_id} completed initial phases")
        return result

    def submit_answers_and_generate(self, state: AgentState, answers: list) -> AgentState:
        """
        Continue session after user submits answers.
        Directly generates the custom LFA and visualization.

        Args:
            state: Current state with program_brief and questions
            answers: User's answers to the questions

        Returns state with final LFA document and Mermaid visualization.
        """
        session_id = state.get("session_id", "unknown")
        logger.info(f"Processing answers and generating LFA for session {session_id}")

        # Store answers and create final profile
        state["answers"] = answers

        # Create final profile by merging brief and answers
        program_brief = state.get("program_brief", {})
        final_profile = {
            **program_brief,
            "answers": answers
        }
        state["final_profile"] = final_profile
        state["phase"] = WorkflowPhase.FINALIZATION.value

        # Generate LFA directly
        logger.info(f"Generating custom LFA for session {session_id}")
        state = self.generator.process(state)

        if not state.get("error"):
            # Generate visualization
            state = self.visualizer.process(state)
            logger.info(f"Visualization generated for session {session_id}")

        return state

    def get_all_visualizations(self, state: AgentState) -> Dict[str, str]:
        """Get all visualization types for the LFA."""
        lfa_document = state.get("lfa_document")
        if not lfa_document:
            return {}
        return self.visualizer.generate_all_views(lfa_document)
