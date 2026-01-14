"""
API Routes for the LFA Builder Platform
Connects the frontend to the LangGraph orchestrator.
"""

import os
import uuid
import logging
import threading
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field, field_validator, UUID4
from sqlalchemy.orm import Session

from ..graph.orchestrator import LFAOrchestrator
from ..graph.state import AgentState, WorkflowPhase
from ..db.postgres import get_db, SessionStore, init_db
from ..db.vector import create_vector_store

router = APIRouter(prefix="/api", tags=["LFA Builder"])
logger = logging.getLogger("lfa_builder.routes")

# Configuration
MAX_INPUT_LENGTH = int(os.getenv("MAX_INPUT_LENGTH", "10000"))
MAX_ANSWER_LENGTH = int(os.getenv("MAX_ANSWER_LENGTH", "2000"))
SESSION_TTL_HOURS = int(os.getenv("SESSION_TTL_HOURS", "24"))


# Request/Response Models with Validation
class StartSessionRequest(BaseModel):
    """Request to start a new LFA building session."""
    raw_input: str = Field(
        ...,
        min_length=10,
        max_length=MAX_INPUT_LENGTH,
        description="Program description (10-10000 characters)"
    )

    @field_validator('raw_input')
    @classmethod
    def validate_raw_input(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Program description cannot be empty")
        return v.strip()


class AnswerItem(BaseModel):
    """Individual answer to a question."""
    question_id: str = Field(..., min_length=1, max_length=100)
    answer: str = Field(..., min_length=1, max_length=MAX_ANSWER_LENGTH)


class StartSessionResponse(BaseModel):
    """Response after starting session with questions."""
    session_id: str
    phase: str
    program_brief: dict
    questions: List[dict]
    message: str


class SubmitAnswersRequest(BaseModel):
    """Request to submit answers to clarifying questions."""
    session_id: str = Field(..., min_length=36, max_length=36)
    answers: List[AnswerItem] = Field(..., min_length=1, description="List of answers")

    @field_validator('session_id')
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        try:
            uuid.UUID(v)
        except ValueError:
            raise ValueError("Invalid session ID format")
        return v


class SubmitAnswersResponse(BaseModel):
    """Response after submitting answers with template matches."""
    session_id: str
    phase: str
    matched_templates: List[dict]
    message: str


class FinalizeRequest(BaseModel):
    """Request to finalize the LFA."""
    session_id: str = Field(..., min_length=36, max_length=36)
    selected_template_id: Optional[str] = Field(None, max_length=100)
    generate_new: bool = False

    @field_validator('session_id')
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        try:
            uuid.UUID(v)
        except ValueError:
            raise ValueError("Invalid session ID format")
        return v


class FinalizeResponse(BaseModel):
    """Response with final LFA and visualization."""
    session_id: str
    phase: str
    lfa_document: dict
    mermaid_code: str
    all_visualizations: Optional[dict] = None
    message: str


class SessionStatusResponse(BaseModel):
    """Response for session status check."""
    session_id: str
    phase: str
    has_brief: bool
    has_questions: bool
    has_answers: bool
    has_templates: bool
    has_lfa: bool
    error: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response model."""
    error: str
    detail: Optional[str] = None


# Session storage with TTL support
class SessionEntry:
    """Session entry with timestamp for TTL."""
    def __init__(self, state: AgentState):
        self.state = state
        self.created_at = datetime.utcnow()
        self.last_accessed = datetime.utcnow()

    def touch(self):
        """Update last accessed time."""
        self.last_accessed = datetime.utcnow()

    def is_expired(self, ttl_hours: int = SESSION_TTL_HOURS) -> bool:
        """Check if session has expired."""
        return datetime.utcnow() - self.last_accessed > timedelta(hours=ttl_hours)


class SessionManager:
    """Thread-safe session manager with TTL support."""

    def __init__(self):
        self._sessions: Dict[str, SessionEntry] = {}
        self._lock = threading.RLock()

    def get(self, session_id: str) -> Optional[AgentState]:
        """Get session state by ID."""
        with self._lock:
            entry = self._sessions.get(session_id)
            if entry:
                if entry.is_expired():
                    del self._sessions[session_id]
                    return None
                entry.touch()
                return entry.state
            return None

    def set(self, session_id: str, state: AgentState):
        """Store session state."""
        with self._lock:
            if session_id in self._sessions:
                self._sessions[session_id].state = state
                self._sessions[session_id].touch()
            else:
                self._sessions[session_id] = SessionEntry(state)

    def delete(self, session_id: str) -> bool:
        """Delete a session."""
        with self._lock:
            if session_id in self._sessions:
                del self._sessions[session_id]
                return True
            return False

    def cleanup_expired(self):
        """Remove all expired sessions."""
        with self._lock:
            expired = [
                sid for sid, entry in self._sessions.items()
                if entry.is_expired()
            ]
            for sid in expired:
                del self._sessions[sid]
            if expired:
                logger.info(f"Cleaned up {len(expired)} expired sessions")

    def count(self) -> int:
        """Get number of active sessions."""
        with self._lock:
            return len(self._sessions)


# Thread-safe orchestrator manager
class OrchestratorManager:
    """Thread-safe orchestrator singleton."""

    def __init__(self):
        self._orchestrator: Optional[LFAOrchestrator] = None
        self._lock = threading.Lock()

    def get(self, db: Session = None) -> LFAOrchestrator:
        """Get or create the orchestrator instance."""
        if self._orchestrator is None:
            with self._lock:
                # Double-check locking
                if self._orchestrator is None:
                    api_key = os.getenv("OPENAI_API_KEY")
                    if not api_key:
                        raise HTTPException(
                            status_code=500,
                            detail="OPENAI_API_KEY not configured"
                        )
                    vector_store = create_vector_store()
                    self._orchestrator = LFAOrchestrator(api_key, vector_store)
                    logger.info("Orchestrator initialized")

        # Set db session for template loading
        if db and self._orchestrator:
            self._orchestrator.set_db_session(db)

        return self._orchestrator


# Initialize managers
_session_manager = SessionManager()
_orchestrator_manager = OrchestratorManager()


def get_orchestrator(db: Session = None) -> LFAOrchestrator:
    """Get the orchestrator instance."""
    return _orchestrator_manager.get(db)


async def cleanup_sessions():
    """Background task to clean up expired sessions."""
    _session_manager.cleanup_expired()


@router.post("/start", response_model=StartSessionResponse)
async def start_session(
    request: StartSessionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Start a new LFA building session.

    Phase 1: Ingestion - Process raw input into structured profile
    Phase 2: Inquiry - Generate clarifying questions

    Returns session with questions for user to answer.
    """
    try:
        orchestrator = get_orchestrator(db)
        session_id = str(uuid.uuid4())

        logger.info(f"Starting new session: {session_id}")

        # Run through profile building and question generation
        state = orchestrator.start_session(session_id, request.raw_input)

        if state.get("error"):
            logger.error(f"Session {session_id} failed: {state['error']}")
            raise HTTPException(status_code=400, detail=state["error"])

        # Store session state
        _session_manager.set(session_id, state)

        # Also persist to database
        try:
            SessionStore.create_session(db, session_id, request.raw_input)
            SessionStore.update_session(
                db, session_id,
                phase=state.get("phase"),
                program_brief=state.get("program_brief"),
                questions=state.get("questions")
            )
        except Exception as e:
            logger.error(f"Database error for session {session_id}: {e}")
            # Continue even if DB fails - in-memory is primary

        # Schedule cleanup in background
        background_tasks.add_task(cleanup_sessions)

        return StartSessionResponse(
            session_id=session_id,
            phase=state.get("phase", ""),
            program_brief=state.get("program_brief", {}),
            questions=state.get("questions", []),
            message="Session started. Please answer the questions to continue."
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Unexpected error starting session: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request. Please try again."
        )


@router.post("/answers", response_model=SubmitAnswersResponse)
async def submit_answers(
    request: SubmitAnswersRequest,
    db: Session = Depends(get_db)
):
    """
    Submit answers to clarifying questions.

    Phase 3: Synthesis & Search - Merge answers and search for templates

    Returns matched templates for user to select.
    """
    try:
        orchestrator = get_orchestrator(db)

        # Get session state
        state = _session_manager.get(request.session_id)
        if not state:
            # Try to recover from database
            db_session = SessionStore.get_session(db, request.session_id)
            if db_session:
                state = {
                    "session_id": request.session_id,
                    "phase": db_session.phase,
                    "raw_input": db_session.raw_input,
                    "program_brief": db_session.program_brief,
                    "questions": db_session.questions,
                }
                _session_manager.set(request.session_id, state)
            else:
                raise HTTPException(status_code=404, detail="Session not found or expired")

        # Validate answers against questions
        questions = state.get("questions", [])
        question_ids = {q.get("id") for q in questions}
        submitted_ids = {a.question_id for a in request.answers}

        # Check all required questions are answered
        required_ids = {q.get("id") for q in questions if q.get("required", True)}
        missing = required_ids - submitted_ids
        if missing:
            raise HTTPException(
                status_code=400,
                detail=f"Missing answers for required questions: {', '.join(missing)}"
            )

        # Convert to dict format
        answers_list = [{"question_id": a.question_id, "answer": a.answer} for a in request.answers]

        # Submit answers and search for templates
        state = orchestrator.submit_answers(state, answers_list)

        if state.get("error"):
            raise HTTPException(status_code=400, detail=state["error"])

        # Update session
        _session_manager.set(request.session_id, state)
        try:
            SessionStore.update_session(
                db, request.session_id,
                phase=state.get("phase"),
                answers=state.get("answers"),
                final_profile=state.get("final_profile"),
                matched_templates=state.get("matched_templates")
            )
        except Exception as e:
            logger.error(f"Database error updating session {request.session_id}: {e}")

        return SubmitAnswersResponse(
            session_id=request.session_id,
            phase=state.get("phase", ""),
            matched_templates=state.get("matched_templates", []),
            message="Templates found. Select one or generate a new LFA."
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Unexpected error submitting answers: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your answers. Please try again."
        )


@router.post("/finalize", response_model=FinalizeResponse)
async def finalize_lfa(
    request: FinalizeRequest,
    db: Session = Depends(get_db)
):
    """
    Finalize the LFA document.

    Phase 4: Finalization - Generate or use template, create visualization

    Returns final LFA document and Mermaid diagram.
    """
    try:
        orchestrator = get_orchestrator(db)

        # Get session state
        state = _session_manager.get(request.session_id)
        if not state:
            raise HTTPException(status_code=404, detail="Session not found or expired")

        logger.info(f"Finalizing session {request.session_id}, template: {request.selected_template_id}, generate_new: {request.generate_new}")

        # Finalize LFA
        state = orchestrator.finalize(
            state,
            selected_template_id=request.selected_template_id,
            generate_new=request.generate_new
        )

        if state.get("error"):
            raise HTTPException(status_code=400, detail=state["error"])

        # Get all visualizations
        all_viz = orchestrator.get_all_visualizations(state)

        # Update session
        _session_manager.set(request.session_id, state)
        try:
            SessionStore.update_session(
                db, request.session_id,
                phase=state.get("phase"),
                selected_template_id=request.selected_template_id,
                lfa_document=state.get("lfa_document"),
                mermaid_code=state.get("mermaid_code")
            )
        except Exception as e:
            logger.error(f"Database error updating session {request.session_id}: {e}")

        return FinalizeResponse(
            session_id=request.session_id,
            phase=state.get("phase", ""),
            lfa_document=state.get("lfa_document", {}),
            mermaid_code=state.get("mermaid_code", ""),
            all_visualizations=all_viz,
            message="LFA document generated successfully!"
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Unexpected error finalizing LFA: {e}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while generating your LFA. Please try again."
        )


@router.get("/session/{session_id}", response_model=SessionStatusResponse)
async def get_session_status(session_id: str, db: Session = Depends(get_db)):
    """Get the current status of a session."""
    # Validate UUID format
    try:
        uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID format")

    state = _session_manager.get(session_id)

    if not state:
        # Try to load from database
        db_session = SessionStore.get_session(db, session_id)
        if not db_session:
            raise HTTPException(status_code=404, detail="Session not found")

        return SessionStatusResponse(
            session_id=session_id,
            phase=db_session.phase or "",
            has_brief=db_session.program_brief is not None,
            has_questions=db_session.questions is not None,
            has_answers=db_session.answers is not None,
            has_templates=db_session.matched_templates is not None,
            has_lfa=db_session.lfa_document is not None,
            error=db_session.error
        )

    return SessionStatusResponse(
        session_id=session_id,
        phase=state.get("phase", ""),
        has_brief=state.get("program_brief") is not None,
        has_questions=state.get("questions") is not None,
        has_answers=state.get("answers") is not None,
        has_templates=state.get("matched_templates") is not None,
        has_lfa=state.get("lfa_document") is not None,
        error=state.get("error")
    )


@router.get("/session/{session_id}/full")
async def get_full_session(session_id: str, db: Session = Depends(get_db)):
    """Get the full session state."""
    # Validate UUID format
    try:
        uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID format")

    state = _session_manager.get(session_id)

    if not state:
        db_session = SessionStore.get_session(db, session_id)
        if not db_session:
            raise HTTPException(status_code=404, detail="Session not found")

        return {
            "session_id": session_id,
            "phase": db_session.phase,
            "program_brief": db_session.program_brief,
            "questions": db_session.questions,
            "answers": db_session.answers,
            "matched_templates": db_session.matched_templates,
            "lfa_document": db_session.lfa_document,
            "mermaid_code": db_session.mermaid_code,
            "error": db_session.error
        }

    return {
        "session_id": session_id,
        "phase": state.get("phase"),
        "program_brief": state.get("program_brief"),
        "questions": state.get("questions"),
        "answers": state.get("answers"),
        "matched_templates": state.get("matched_templates"),
        "lfa_document": state.get("lfa_document"),
        "mermaid_code": state.get("mermaid_code"),
        "error": state.get("error")
    }


@router.delete("/session/{session_id}")
async def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a session."""
    # Validate UUID format
    try:
        uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID format")

    _session_manager.delete(session_id)
    SessionStore.delete_session(db, session_id)

    logger.info(f"Session {session_id} deleted")
    return {"message": "Session deleted", "session_id": session_id}


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "LFA Builder API",
        "version": "1.0.0",
        "active_sessions": _session_manager.count()
    }


@router.get("/stats")
async def get_stats():
    """Get API statistics."""
    return {
        "active_sessions": _session_manager.count(),
        "session_ttl_hours": SESSION_TTL_HOURS
    }


# =============================================================================
# STAKEHOLDER INTERVIEW ENDPOINTS - "Interview Your LFA" Feature
# =============================================================================

class StakeholderInterviewRequest(BaseModel):
    """Request to interview a stakeholder about an LFA."""
    session_id: Optional[str] = Field(None, max_length=36)
    stakeholder_id: str = Field(..., min_length=1, max_length=50)
    lfa_document: Optional[dict] = Field(None, description="LFA document to analyze (if not using session)")
    conversation_history: Optional[List[dict]] = Field(None, description="Previous messages for follow-up")

    @field_validator('stakeholder_id')
    @classmethod
    def validate_stakeholder_id(cls, v: str) -> str:
        valid_stakeholders = [
            "teacher", "head_master", "crp", "brp", "deo", "parent", "student", "diet"
        ]
        if v not in valid_stakeholders:
            raise ValueError(f"Invalid stakeholder. Must be one of: {', '.join(valid_stakeholders)}")
        return v


class StakeholderFeedbackItem(BaseModel):
    """Individual feedback item from stakeholder."""
    type: str
    severity: str
    title: str
    message: str
    lfa_reference: Optional[str] = None
    recommendation: Optional[str] = None


class StakeholderInterviewResponse(BaseModel):
    """Response from stakeholder interview."""
    stakeholder_id: str
    stakeholder_name: str
    stakeholder_level: str
    stakeholder_icon: str
    stakeholder_color: str
    greeting: str
    feedback_items: List[StakeholderFeedbackItem]
    overall_sentiment: str
    closing_remark: str
    issue_summary: dict


class StakeholderListResponse(BaseModel):
    """Response with available stakeholders."""
    stakeholders: List[dict]


# Lazy-loaded stakeholder simulator
_stakeholder_simulator = None
_simulator_lock = threading.Lock()


def get_stakeholder_simulator() -> "StakeholderSimulator":
    """Get or create the stakeholder simulator instance."""
    global _stakeholder_simulator
    if _stakeholder_simulator is None:
        with _simulator_lock:
            if _stakeholder_simulator is None:
                from openai import OpenAI
                from ..agents.stakeholder_simulator import StakeholderSimulator
                api_key = os.getenv("OPENAI_API_KEY")
                if not api_key:
                    raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")
                client = OpenAI(api_key=api_key)
                _stakeholder_simulator = StakeholderSimulator(client)
                logger.info("StakeholderSimulator initialized")
    return _stakeholder_simulator


@router.get("/stakeholders", response_model=StakeholderListResponse)
async def get_available_stakeholders():
    """
    Get list of available stakeholder personas for the Interview Your LFA feature.

    Returns stakeholder avatars with their metadata for UI display.
    """
    try:
        simulator = get_stakeholder_simulator()
        stakeholders = simulator.get_available_stakeholders()
        return StakeholderListResponse(stakeholders=stakeholders)
    except Exception as e:
        logger.exception(f"Error getting stakeholders: {e}")
        raise HTTPException(status_code=500, detail="Failed to load stakeholder personas")


@router.post("/stakeholder/interview")
async def interview_stakeholder(
    request: StakeholderInterviewRequest,
    db: Session = Depends(get_db)
):
    """
    Interview a stakeholder persona about an LFA document.

    The stakeholder will provide authentic, in-character feedback about
    the LFA from their perspective, identifying gaps, risks, and suggestions.

    Can be used with:
    - session_id: Uses LFA from an existing session
    - lfa_document: Uses provided LFA document directly
    """
    try:
        simulator = get_stakeholder_simulator()

        # Get LFA document from session or request
        lfa_document = request.lfa_document

        if not lfa_document and request.session_id:
            # Try to get from session
            state = _session_manager.get(request.session_id)
            if state:
                lfa_document = state.get("lfa_document")
            else:
                # Try database
                db_session = SessionStore.get_session(db, request.session_id)
                if db_session and db_session.lfa_document:
                    lfa_document = db_session.lfa_document

        if not lfa_document:
            raise HTTPException(
                status_code=400,
                detail="No LFA document available. Provide either session_id or lfa_document."
            )

        # Run stakeholder simulation
        feedback = simulator.simulate_interview(
            stakeholder_id=request.stakeholder_id,
            lfa_document=lfa_document,
            conversation_history=request.conversation_history
        )

        if "error" in feedback:
            raise HTTPException(status_code=400, detail=feedback["error"])

        logger.info(f"Stakeholder interview completed: {request.stakeholder_id}")
        return feedback

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error in stakeholder interview: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to complete stakeholder interview. Please try again."
        )


@router.post("/stakeholder/interview-all")
async def interview_all_stakeholders(
    session_id: Optional[str] = None,
    lfa_document: Optional[dict] = None,
    stakeholder_ids: Optional[List[str]] = None,
    db: Session = Depends(get_db)
):
    """
    Interview multiple stakeholders at once.

    Useful for getting a comprehensive review from all stakeholder levels.
    Returns aggregated feedback with issue summaries.
    """
    try:
        simulator = get_stakeholder_simulator()

        # Get LFA document
        lfa_doc = lfa_document
        if not lfa_doc and session_id:
            state = _session_manager.get(session_id)
            if state:
                lfa_doc = state.get("lfa_document")

        if not lfa_doc:
            raise HTTPException(
                status_code=400,
                detail="No LFA document available"
            )

        # Get feedback from all stakeholders
        result = simulator.get_all_stakeholder_feedback(
            lfa_document=lfa_doc,
            stakeholder_ids=stakeholder_ids
        )

        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error in multi-stakeholder interview: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to complete stakeholder interviews"
        )


# ============== Logic Challenger (AI Devil's Advocate) ==============

# Lazy-loaded logic challenger
_logic_challenger = None
_logic_challenger_lock = threading.Lock()


def get_logic_challenger() -> "LogicChallenger":
    """Get or create the logic challenger instance."""
    global _logic_challenger
    if _logic_challenger is None:
        with _logic_challenger_lock:
            if _logic_challenger is None:
                from openai import OpenAI
                from ..agents.logic_challenger import LogicChallenger

                client = OpenAI(
                    api_key=os.getenv("OPENAI_API_KEY"),
                    timeout=float(os.getenv("LLM_TIMEOUT", "90"))
                )
                _logic_challenger = LogicChallenger(client)
    return _logic_challenger


class LogicChallengeItem(BaseModel):
    """Individual logic challenge."""
    id: str
    category: str
    severity: str
    title: str
    description: str
    lfa_element: Optional[str] = None
    logic_break: Optional[str] = None
    recommendation: str
    effort_to_fix: str


class LogicAnalysisResponse(BaseModel):
    """Response from logic analysis."""
    overall_score: int
    overall_assessment: str
    logic_chain_analysis: Optional[Dict[str, str]] = None
    challenges: List[LogicChallengeItem]
    quick_wins: Optional[List[Dict[str, str]]] = None
    summary_stats: Dict[str, int]
    lfa_title: Optional[str] = None
    analyzed_at: Optional[str] = None


class AnalyzeLFARequest(BaseModel):
    """Request to analyze an LFA for logic issues."""
    session_id: Optional[str] = None
    lfa_document: Optional[Dict[str, Any]] = None


@router.post("/lfa/analyze", response_model=LogicAnalysisResponse)
async def analyze_lfa_logic(
    request: AnalyzeLFARequest
):
    """
    Analyze an LFA document for logic gaps and weaknesses.

    This is the "AI Devil's Advocate" feature that proactively
    identifies issues with the LFA logic chain.

    Provide either session_id (to use the LFA from that session)
    or lfa_document directly.
    """
    try:
        challenger = get_logic_challenger()

        # Get LFA document from request or session
        lfa_document = request.lfa_document

        if not lfa_document and request.session_id:
            session_data = SessionManager.get(request.session_id)
            if session_data:
                state = session_data.get("state", {})
                lfa_document = state.get("lfa_document")

        if not lfa_document:
            raise HTTPException(
                status_code=400,
                detail="No LFA document provided. Supply session_id or lfa_document."
            )

        # Run logic analysis
        analysis = challenger.analyze_lfa(lfa_document)

        if "error" in analysis:
            raise HTTPException(
                status_code=500,
                detail=analysis.get("error", "Analysis failed")
            )

        logger.info(f"Logic analysis completed with score: {analysis.get('overall_score', 0)}")

        return analysis

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error in logic analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze LFA logic. Please try again."
        )


@router.post("/lfa/quick-validate")
async def quick_validate_lfa(
    request: AnalyzeLFARequest
):
    """
    Perform quick validation on an LFA document.

    Lighter-weight than full analysis, suitable for real-time
    validation during editing.
    """
    try:
        from ..agents.logic_challenger import QuickValidator
        from openai import OpenAI

        client = OpenAI(
            api_key=os.getenv("OPENAI_API_KEY"),
            timeout=float(os.getenv("LLM_TIMEOUT", "30"))
        )
        validator = QuickValidator(client)

        # Get LFA document
        lfa_document = request.lfa_document

        if not lfa_document and request.session_id:
            session_data = SessionManager.get(request.session_id)
            if session_data:
                state = session_data.get("state", {})
                lfa_document = state.get("lfa_document")

        if not lfa_document:
            raise HTTPException(
                status_code=400,
                detail="No LFA document provided."
            )

        result = validator.validate(lfa_document)
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error in quick validation: {e}")
        raise HTTPException(
            status_code=500,
            detail="Validation failed"
        )


# ============== Scenario Analyzer (What-If Engine) ==============

# Lazy-loaded scenario analyzer
_scenario_analyzer = None
_scenario_analyzer_lock = threading.Lock()


def get_scenario_analyzer() -> "ScenarioAnalyzer":
    """Get or create the scenario analyzer instance."""
    global _scenario_analyzer
    if _scenario_analyzer is None:
        with _scenario_analyzer_lock:
            if _scenario_analyzer is None:
                from openai import OpenAI
                from ..agents.scenario_analyzer import ScenarioAnalyzer

                client = OpenAI(
                    api_key=os.getenv("OPENAI_API_KEY"),
                    timeout=float(os.getenv("LLM_TIMEOUT", "90"))
                )
                _scenario_analyzer = ScenarioAnalyzer(client)
    return _scenario_analyzer


class ScenarioAnalysisRequest(BaseModel):
    """Request to analyze a what-if scenario."""
    session_id: Optional[str] = None
    lfa_document: Optional[Dict[str, Any]] = None
    scenario_description: str = Field(..., min_length=5, max_length=500)
    scenario_type: Optional[str] = None
    parameters: Optional[Dict[str, Any]] = None


@router.get("/scenarios/templates")
async def get_scenario_templates():
    """
    Get available scenario templates for the What-If engine.
    """
    try:
        analyzer = get_scenario_analyzer()
        templates = analyzer.get_scenario_templates()
        return {"templates": templates}
    except Exception as e:
        logger.exception(f"Error getting scenario templates: {e}")
        raise HTTPException(status_code=500, detail="Failed to load templates")


@router.post("/scenarios/analyze")
async def analyze_scenario(
    request: ScenarioAnalysisRequest
):
    """
    Analyze the impact of a what-if scenario on an LFA.

    Example scenarios:
    - "Budget is reduced by 40%"
    - "Teachers resist the new pedagogy"
    - "Implementation is delayed by 6 months"
    - "CRP positions remain vacant"
    """
    try:
        analyzer = get_scenario_analyzer()

        # Get LFA document
        lfa_document = request.lfa_document

        if not lfa_document and request.session_id:
            session_data = SessionManager.get(request.session_id)
            if session_data:
                state = session_data.get("state", {})
                lfa_document = state.get("lfa_document")

        if not lfa_document:
            raise HTTPException(
                status_code=400,
                detail="No LFA document provided. Supply session_id or lfa_document."
            )

        # Run scenario analysis
        analysis = analyzer.analyze_scenario(
            lfa_document=lfa_document,
            scenario_description=request.scenario_description,
            scenario_type=request.scenario_type,
            parameters=request.parameters
        )

        if "error" in analysis:
            raise HTTPException(
                status_code=500,
                detail=analysis.get("error", "Analysis failed")
            )

        logger.info(f"Scenario analysis completed: {analysis.get('overall_impact', 'unknown')}")

        return analysis

    except HTTPException:
        raise
    except Exception as e:
        logger.exception(f"Error in scenario analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze scenario. Please try again."
        )
