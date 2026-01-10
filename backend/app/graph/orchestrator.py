"""
Orchestrator - The Manager
LangGraph-based state machine that coordinates all worker agents.
"""

from typing import Dict, Any, Literal
from langgraph.graph import StateGraph, END
from openai import OpenAI

from .state import AgentState, WorkflowPhase, create_initial_state
from ..agents import ProfileBuilder, Interviewer, Retriever, LFAGenerator, GraphVisualizer


def create_workflow(openai_client: OpenAI, vector_store=None):
    """
    Create the LangGraph workflow that orchestrates all agents.

    The workflow follows this path:
    1. INGESTION: ProfileBuilder processes raw input
    2. INQUIRY: Interviewer generates questions
    3. (PAUSE for user answers)
    4. SYNTHESIS: Retriever searches for templates
    5. (PAUSE for user selection)
    6. FINALIZATION: Generator creates LFA (if needed) -> Visualizer creates diagram

    Returns:
        Compiled LangGraph workflow
    """

    # Initialize agents
    profile_builder = ProfileBuilder(openai_client)
    interviewer = Interviewer(openai_client)
    retriever = Retriever(openai_client, vector_store)
    generator = LFAGenerator(openai_client)
    visualizer = GraphVisualizer()

    # Define node functions
    def build_profile(state: AgentState) -> AgentState:
        """Node: Process raw input into structured profile."""
        return profile_builder.process(state)

    def generate_questions(state: AgentState) -> AgentState:
        """Node: Generate clarifying questions."""
        return interviewer.process(state)

    def search_templates(state: AgentState) -> AgentState:
        """Node: Search for matching templates."""
        return retriever.process(state)

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

    def should_continue_after_questions(state: AgentState) -> Literal["wait_for_answers", "end"]:
        """Decide whether to wait for answers or end."""
        if state.get("error"):
            return "end"
        return "wait_for_answers"

    def should_continue_after_search(state: AgentState) -> Literal["wait_for_selection", "end"]:
        """Decide whether to wait for selection or end."""
        if state.get("error"):
            return "end"
        return "wait_for_selection"

    def should_generate_or_use_template(state: AgentState) -> Literal["generate_lfa", "visualize_lfa"]:
        """Decide whether to generate new LFA or use selected template."""
        if state.get("generate_new", False):
            return "generate_lfa"

        # If template selected, LFA should already be loaded
        if state.get("lfa_document"):
            return "visualize_lfa"

        # Default to generating new
        return "generate_lfa"

    # Build the graph
    workflow = StateGraph(AgentState)

    # Add nodes
    workflow.add_node("build_profile", build_profile)
    workflow.add_node("generate_questions", generate_questions)
    workflow.add_node("search_templates", search_templates)
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
    workflow.add_edge("search_templates", END)     # Pause for user selection
    workflow.add_edge("generate_lfa", "visualize_lfa")
    workflow.add_edge("visualize_lfa", END)

    return workflow.compile()


class LFAOrchestrator:
    """
    High-level orchestrator that manages the entire LFA building session.
    Handles pauses for user input and resumption of workflow.
    """

    def __init__(self, openai_api_key: str, vector_store=None):
        self.client = OpenAI(api_key=openai_api_key)
        self.vector_store = vector_store
        self.workflow = create_workflow(self.client, vector_store)

        # Agent instances for manual invocation
        self.retriever = Retriever(self.client, vector_store)
        self.generator = LFAGenerator(self.client)
        self.visualizer = GraphVisualizer()

    def start_session(self, session_id: str, raw_input: str) -> AgentState:
        """
        Start a new LFA building session.
        Runs through Phase 1 (Ingestion) and Phase 2 (Inquiry).

        Returns state with questions for user to answer.
        """
        initial_state = create_initial_state(session_id, raw_input)
        result = self.workflow.invoke(initial_state)
        return result

    def submit_answers(self, state: AgentState, answers: list) -> AgentState:
        """
        Continue session after user submits answers.
        Runs Phase 3 (Synthesis & Search).

        Returns state with matched templates for user to select.
        """
        state["answers"] = answers
        state["phase"] = WorkflowPhase.SYNTHESIS.value

        # Run retriever
        state = self.retriever.process(state)
        return state

    def finalize(self, state: AgentState, selected_template_id: str = None, generate_new: bool = False) -> AgentState:
        """
        Finalize the LFA after user selection.
        Runs Phase 4 (Finalization).

        Args:
            state: Current state
            selected_template_id: ID of selected template (if any)
            generate_new: Whether to generate a new LFA

        Returns state with final LFA document and Mermaid visualization.
        """
        state["selected_template_id"] = selected_template_id
        state["generate_new"] = generate_new

        if generate_new or not selected_template_id:
            # Generate new LFA
            state = self.generator.process(state)
        else:
            # Load template (would fetch from database in production)
            # For now, we'll generate based on the template match
            state = self.generator.process(state)

        if not state.get("error"):
            # Generate visualization
            state = self.visualizer.process(state)

        return state

    def get_all_visualizations(self, state: AgentState) -> Dict[str, str]:
        """Get all visualization types for the LFA."""
        lfa_document = state.get("lfa_document")
        if not lfa_document:
            return {}
        return self.visualizer.generate_all_views(lfa_document)
