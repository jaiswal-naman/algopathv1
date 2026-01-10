"""
Shared State Definitions for the LFA Builder Multi-Agent System.
This module defines the data structures passed between agents.
"""

from typing import TypedDict, List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class WorkflowPhase(str, Enum):
    """Current phase of the workflow."""
    INGESTION = "ingestion"
    INQUIRY = "inquiry"
    WAITING_FOR_ANSWERS = "waiting_for_answers"
    SYNTHESIS = "synthesis"
    WAITING_FOR_SELECTION = "waiting_for_selection"
    FINALIZATION = "finalization"
    COMPLETED = "completed"


class ProgramBrief(BaseModel):
    """Structured output from ProfileBuilder agent."""
    summary: str = Field(description="Concise summary of the program")
    goal: str = Field(description="Primary goal of the program")
    target_audience: str = Field(description="Who the program serves")
    context: Optional[str] = Field(default=None, description="Additional context")
    challenges: Optional[List[str]] = Field(default=None, description="Key challenges identified")


class Question(BaseModel):
    """A single interview question."""
    id: str = Field(description="Unique identifier for the question")
    question: str = Field(description="The question text")
    category: str = Field(description="Category: scope, resources, timeline, risks, etc.")
    required: bool = Field(default=True, description="Whether the question must be answered")


class Questionnaire(BaseModel):
    """Collection of interview questions."""
    questions: List[Question] = Field(description="List of questions to ask")


class Answer(BaseModel):
    """User's answer to a question."""
    question_id: str
    answer: str


class MatchedTemplate(BaseModel):
    """A template matched from vector search."""
    id: str = Field(description="Template ID in database")
    title: str = Field(description="Template title")
    score: float = Field(description="Similarity score (0-1)")
    preview: Optional[str] = Field(default=None, description="Short preview of content")


class Activity(BaseModel):
    """An activity in the LFA."""
    id: str
    description: str
    indicators: List[str] = Field(default_factory=list)
    means_of_verification: List[str] = Field(default_factory=list)


class Output(BaseModel):
    """An output in the LFA."""
    id: str
    description: str
    indicators: List[str] = Field(default_factory=list)
    means_of_verification: List[str] = Field(default_factory=list)
    activities: List[Activity] = Field(default_factory=list)


class Outcome(BaseModel):
    """An outcome in the LFA."""
    id: str
    description: str
    indicators: List[str] = Field(default_factory=list)
    means_of_verification: List[str] = Field(default_factory=list)
    outputs: List[Output] = Field(default_factory=list)


class LFADocument(BaseModel):
    """Complete Logical Framework Approach document."""
    title: str
    goal: str
    goal_indicators: List[str] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    outcomes: List[Outcome] = Field(default_factory=list)


class AgentState(TypedDict, total=False):
    """
    Global state shared across all agents in the workflow.
    This is the "skeleton" that synchronizes the multi-agent system.
    """
    # Session info
    session_id: str
    phase: str

    # Phase 1: Ingestion
    raw_input: str
    program_brief: Optional[Dict[str, Any]]

    # Phase 2: Inquiry
    questions: Optional[List[Dict[str, Any]]]

    # Phase 3: Synthesis & Search
    answers: Optional[List[Dict[str, Any]]]
    final_profile: Optional[Dict[str, Any]]
    matched_templates: Optional[List[Dict[str, Any]]]

    # Phase 4: Finalization
    selected_template_id: Optional[str]
    generate_new: bool
    lfa_document: Optional[Dict[str, Any]]
    mermaid_code: Optional[str]

    # Metadata
    error: Optional[str]
    messages: List[str]


def create_initial_state(session_id: str, raw_input: str) -> AgentState:
    """Create the initial state for a new session."""
    return AgentState(
        session_id=session_id,
        phase=WorkflowPhase.INGESTION.value,
        raw_input=raw_input,
        program_brief=None,
        questions=None,
        answers=None,
        final_profile=None,
        matched_templates=None,
        selected_template_id=None,
        generate_new=False,
        lfa_document=None,
        mermaid_code=None,
        error=None,
        messages=[],
    )
