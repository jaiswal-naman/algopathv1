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
from ..agents import ProfileBuilder, Interviewer, Retriever, LFAGenerator, GraphVisualizer
from ..db.postgres import TemplateStore

logger = logging.getLogger("lfa_builder.orchestrator")


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

    def __init__(self, openai_api_key: str, vector_store=None, db_session=None):
        self.client = OpenAI(
            api_key=openai_api_key,
            timeout=float(os.getenv("LLM_TIMEOUT", "90"))
        )
        self.vector_store = vector_store
        self.db_session = db_session
        self.workflow = create_workflow(self.client, vector_store)

        # Agent instances for manual invocation
        self.retriever = Retriever(self.client, vector_store)
        self.generator = LFAGenerator(self.client)
        self.visualizer = GraphVisualizer()

    def set_db_session(self, db_session):
        """Set the database session for template loading."""
        self.db_session = db_session

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

    def submit_answers(self, state: AgentState, answers: list) -> AgentState:
        """
        Continue session after user submits answers.
        Runs Phase 3 (Synthesis & Search).

        Returns state with matched templates for user to select.
        """
        session_id = state.get("session_id", "unknown")
        logger.info(f"Processing answers for session {session_id}")

        state["answers"] = answers
        state["phase"] = WorkflowPhase.SYNTHESIS.value

        # Run retriever
        state = self.retriever.process(state)
        logger.info(f"Found {len(state.get('matched_templates', []))} templates for session {session_id}")
        return state

    def _load_template_from_db(self, template_id: str) -> Optional[Dict[str, Any]]:
        """
        Load a template from the database by ID.

        Returns the template content or None if not found.
        """
        if not self.db_session:
            logger.warning("No database session available for template loading")
            return None

        try:
            template = TemplateStore.get_template(self.db_session, template_id)

            if template:
                logger.info(f"Loaded template: {template_id}")
                return {
                    "id": template.id,
                    "title": template.title,
                    "description": template.description,
                    "category": template.category,
                    "tags": template.tags or [],
                    "content": template.content,
                    "preview": template.preview
                }
            else:
                logger.warning(f"Template not found: {template_id}")
                return None

        except Exception as e:
            logger.error(f"Error loading template {template_id}: {e}")
            return None

    def _adapt_template_to_profile(self, template: Dict[str, Any], final_profile: Dict[str, Any]) -> Dict[str, Any]:
        """
        Adapt a template's content to the user's specific program profile.
        Preserves the template structure but updates context-specific details.
        """
        content = template.get("content", {})

        # Create adapted LFA document
        adapted_lfa = {
            "title": final_profile.get("summary", content.get("title", "Program")),
            "goal": content.get("goal", ""),
            "goal_indicators": content.get("goal_indicators", []),
            "assumptions": content.get("assumptions", []),
            "outcomes": content.get("outcomes", [])
        }

        # If user has specific goal info, incorporate it
        if final_profile.get("goal"):
            # Keep template structure but update the main goal text
            user_goal = final_profile["goal"]
            if user_goal and len(user_goal) > 20:
                adapted_lfa["goal"] = user_goal

        # Add user's target audience context to assumptions if available
        if final_profile.get("target_audience"):
            target_assumption = f"Target beneficiaries ({final_profile['target_audience']}) are accessible and willing to participate"
            if target_assumption not in adapted_lfa["assumptions"]:
                adapted_lfa["assumptions"].insert(0, target_assumption)

        return adapted_lfa

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
        session_id = state.get("session_id", "unknown")
        state["selected_template_id"] = selected_template_id
        state["generate_new"] = generate_new

        if generate_new or not selected_template_id:
            # Generate new LFA from scratch
            logger.info(f"Generating new LFA for session {session_id}")
            state = self.generator.process(state)
        else:
            # Load and use selected template
            logger.info(f"Loading template {selected_template_id} for session {session_id}")
            template = self._load_template_from_db(selected_template_id)

            if template and template.get("content"):
                # Adapt template to user's profile
                final_profile = state.get("final_profile", state.get("program_brief", {}))
                adapted_lfa = self._adapt_template_to_profile(template, final_profile)
                state["lfa_document"] = adapted_lfa
                state["phase"] = WorkflowPhase.FINALIZATION.value
                logger.info(f"Template {selected_template_id} loaded and adapted")
            else:
                # Fallback: generate new if template not found
                logger.warning(f"Template {selected_template_id} not found, generating new LFA")
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
