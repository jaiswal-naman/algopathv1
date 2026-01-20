"""
Shared State Definitions for the LFA Builder Multi-Agent System.
This module defines the data structures passed between agents.

Aligned with Shikshagraha's education ecosystem hierarchy:
- School Level: Students, Teachers, Head Masters (HM)
- Cluster Level: Cluster Resource Persons (CRP), CRCC
- Block Level: Block Resource Persons (BRP), BRCC, Block Education Officer (BEO)
- District Level: District Education Officer (DEO), DIET, District Magistrate (DM)
"""

from typing import TypedDict, List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class WorkflowPhase(str, Enum):
    """Current phase of the workflow."""
    INGESTION = "ingestion"
    INQUIRY = "inquiry"
    WAITING_FOR_ANSWERS = "waiting_for_answers"
    FINALIZATION = "finalization"
    COMPLETED = "completed"


class ProgramTheme(str, Enum):
    """Common program themes in education sector."""
    FLN = "Foundational Literacy & Numeracy"
    TEACHER_DEVELOPMENT = "Teacher Professional Development"
    LEADERSHIP = "School Leadership"
    ASSESSMENT = "Assessment & Learning Outcomes"
    CAREER_READINESS = "Career Readiness & Life Skills"
    EDTECH = "EdTech Integration"
    COMMUNITY = "Community & SMC Engagement"
    MENTORING = "Academic Mentoring"
    INFRASTRUCTURE = "School Infrastructure"
    GOVERNANCE = "Education Governance"
    OTHER = "Other"


class SystemLevel(str, Enum):
    """Education system levels."""
    SCHOOL = "School"
    CLUSTER = "Cluster"
    BLOCK = "Block"
    DISTRICT = "District"
    STATE = "State"


class StakeholderMap(BaseModel):
    """
    Shikshagraha education ecosystem stakeholder mapping.
    Maps stakeholders at each level of the system.
    """
    school_level: List[str] = Field(
        default_factory=lambda: ["Students", "Teachers", "Head Master (HM)"],
        description="School-level stakeholders"
    )
    cluster_level: List[str] = Field(
        default_factory=lambda: ["Cluster Resource Person (CRP)", "CRCC"],
        description="Cluster-level stakeholders"
    )
    block_level: List[str] = Field(
        default_factory=lambda: ["Block Resource Person (BRP)", "BRCC", "Block Education Officer (BEO)"],
        description="Block-level stakeholders"
    )
    district_level: List[str] = Field(
        default_factory=lambda: ["District Education Officer (DEO)", "DIET", "District Magistrate (DM)"],
        description="District-level stakeholders"
    )


class ProgramBrief(BaseModel):
    """
    Structured output from ProfileBuilder agent.
    Extended for Shikshagraha education ecosystem context.
    """
    summary: str = Field(description="Concise summary of the program")
    goal: str = Field(description="Primary goal of the program")
    target_audience: str = Field(description="Who the program serves")
    context: Optional[str] = Field(default=None, description="Additional context")
    challenges: Optional[List[str]] = Field(default=None, description="Key challenges identified")

    # Shikshagraha-specific fields
    program_theme: Optional[str] = Field(
        default=None,
        description="Program theme: FLN, Teacher Development, Leadership, etc."
    )
    system_level: Optional[str] = Field(
        default=None,
        description="Primary system level: School, Cluster, Block, District"
    )
    geographic_scope: Optional[str] = Field(
        default=None,
        description="Geographic scope: state, district names, number of schools"
    )
    key_stakeholders: Optional[Dict[str, List[str]]] = Field(
        default=None,
        description="Stakeholders at each system level"
    )
    student_level_change: Optional[str] = Field(
        default=None,
        description="Expected change at student level"
    )


class Question(BaseModel):
    """A single interview question."""
    id: str = Field(description="Unique identifier for the question")
    question: str = Field(description="The question text")
    category: str = Field(description="Category: student_outcomes, teacher_practice, stakeholders, etc.")
    required: bool = Field(default=True, description="Whether the question must be answered")
    stakeholder_level: Optional[str] = Field(
        default=None,
        description="Which stakeholder level this question addresses"
    )


class Questionnaire(BaseModel):
    """Collection of interview questions."""
    questions: List[Question] = Field(description="List of questions to ask")


class Answer(BaseModel):
    """User's answer to a question."""
    question_id: str
    answer: str


class Activity(BaseModel):
    """An activity in the LFA."""
    id: str
    description: str
    indicators: List[str] = Field(default_factory=list)
    means_of_verification: List[str] = Field(default_factory=list)
    responsible_stakeholder: Optional[str] = Field(default=None, description="Who is responsible")


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


class StakeholderPracticeChanges(BaseModel):
    """Expected practice changes at each stakeholder level."""
    teachers: List[str] = Field(default_factory=list, description="What teachers should do differently")
    head_masters: List[str] = Field(default_factory=list, description="What HMs should do differently")
    crp_crcc: List[str] = Field(default_factory=list, description="What CRPs should do differently")
    brp_beo: List[str] = Field(default_factory=list, description="What BRPs/BEOs should do differently")
    deo_diet: List[str] = Field(default_factory=list, description="What DEO/DIET should do differently")


class LFADocument(BaseModel):
    """
    Complete Logical Framework Approach document.
    Extended with Shikshagraha stakeholder practice changes.
    """
    title: str
    goal: str
    student_level_change: Optional[str] = Field(
        default=None,
        description="What changes at student level"
    )
    goal_indicators: List[str] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    outcomes: List[Outcome] = Field(default_factory=list)

    # Shikshagraha-specific
    stakeholder_practice_changes: Optional[Dict[str, List[str]]] = Field(
        default=None,
        description="Practice changes expected at each stakeholder level"
    )
    program_theme: Optional[str] = Field(default=None, description="Program theme")
    system_level: Optional[str] = Field(default=None, description="Primary system level")


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

    # Phase 3: Finalization
    answers: Optional[List[Dict[str, Any]]]
    final_profile: Optional[Dict[str, Any]]
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
        lfa_document=None,
        mermaid_code=None,
        error=None,
        messages=[],
    )
