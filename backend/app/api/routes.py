"""
API Routes for the LFA Builder Platform
Connects the frontend to the LangGraph orchestrator.
"""

import uuid
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..graph.orchestrator import LFAOrchestrator
from ..graph.state import AgentState, WorkflowPhase
from ..db.postgres import get_db, SessionStore, init_db
from ..db.vector import create_vector_store

router = APIRouter(prefix="/api", tags=["LFA Builder"])


# Request/Response Models
class StartSessionRequest(BaseModel):
    """Request to start a new LFA building session."""
    raw_input: str = Field(..., min_length=10, description="Program description")


class StartSessionResponse(BaseModel):
    """Response after starting session with questions."""
    session_id: str
    phase: str
    program_brief: dict
    questions: List[dict]
    message: str


class SubmitAnswersRequest(BaseModel):
    """Request to submit answers to clarifying questions."""
    session_id: str
    answers: List[dict] = Field(..., description="List of {question_id, answer}")


class SubmitAnswersResponse(BaseModel):
    """Response after submitting answers with template matches."""
    session_id: str
    phase: str
    matched_templates: List[dict]
    message: str


class FinalizeRequest(BaseModel):
    """Request to finalize the LFA."""
    session_id: str
    selected_template_id: Optional[str] = None
    generate_new: bool = False


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


# In-memory session store (replace with Redis in production)
_sessions: dict = {}
_orchestrator: Optional[LFAOrchestrator] = None


def get_orchestrator() -> LFAOrchestrator:
    """Get or create the orchestrator instance."""
    global _orchestrator
    if _orchestrator is None:
        import os
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail="OPENAI_API_KEY not configured"
            )
        vector_store = create_vector_store()
        _orchestrator = LFAOrchestrator(api_key, vector_store)
    return _orchestrator


@router.post("/start", response_model=StartSessionResponse)
async def start_session(
    request: StartSessionRequest,
    db: Session = Depends(get_db)
):
    """
    Start a new LFA building session.

    Phase 1: Ingestion - Process raw input into structured profile
    Phase 2: Inquiry - Generate clarifying questions

    Returns session with questions for user to answer.
    """
    try:
        orchestrator = get_orchestrator()
        session_id = str(uuid.uuid4())

        # Run through profile building and question generation
        state = orchestrator.start_session(session_id, request.raw_input)

        if state.get("error"):
            raise HTTPException(status_code=400, detail=state["error"])

        # Store session state
        _sessions[session_id] = state

        # Also persist to database
        SessionStore.create_session(db, session_id, request.raw_input)
        SessionStore.update_session(
            db, session_id,
            phase=state.get("phase"),
            program_brief=state.get("program_brief"),
            questions=state.get("questions")
        )

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
        raise HTTPException(status_code=500, detail=str(e))


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
        orchestrator = get_orchestrator()

        # Get session state
        state = _sessions.get(request.session_id)
        if not state:
            raise HTTPException(status_code=404, detail="Session not found")

        # Submit answers and search for templates
        state = orchestrator.submit_answers(state, request.answers)

        if state.get("error"):
            raise HTTPException(status_code=400, detail=state["error"])

        # Update session
        _sessions[request.session_id] = state
        SessionStore.update_session(
            db, request.session_id,
            phase=state.get("phase"),
            answers=state.get("answers"),
            final_profile=state.get("final_profile"),
            matched_templates=state.get("matched_templates")
        )

        return SubmitAnswersResponse(
            session_id=request.session_id,
            phase=state.get("phase", ""),
            matched_templates=state.get("matched_templates", []),
            message="Templates found. Select one or generate a new LFA."
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
        orchestrator = get_orchestrator()

        # Get session state
        state = _sessions.get(request.session_id)
        if not state:
            raise HTTPException(status_code=404, detail="Session not found")

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
        _sessions[request.session_id] = state
        SessionStore.update_session(
            db, request.session_id,
            phase=state.get("phase"),
            selected_template_id=request.selected_template_id,
            lfa_document=state.get("lfa_document"),
            mermaid_code=state.get("mermaid_code")
        )

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
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/session/{session_id}", response_model=SessionStatusResponse)
async def get_session_status(session_id: str, db: Session = Depends(get_db)):
    """Get the current status of a session."""
    state = _sessions.get(session_id)

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
    state = _sessions.get(session_id)

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
    if session_id in _sessions:
        del _sessions[session_id]

    SessionStore.delete_session(db, session_id)

    return {"message": "Session deleted", "session_id": session_id}


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "LFA Builder API",
        "version": "1.0.0"
    }
