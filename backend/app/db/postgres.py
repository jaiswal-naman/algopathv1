"""
PostgreSQL Database Connection
Manages session state for the LFA Builder.
"""

import os
from typing import Generator, Optional
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./lfa_builder.db")

# Create engine (SQLite for development, PostgreSQL for production)
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class LFASession(Base):
    """Store session state for the LFA building workflow."""
    __tablename__ = "lfa_sessions"

    id = Column(String(36), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    phase = Column(String(50), default="ingestion")
    raw_input = Column(Text)
    program_brief = Column(JSON)
    questions = Column(JSON)
    answers = Column(JSON)
    final_profile = Column(JSON)
    lfa_document = Column(JSON)
    mermaid_code = Column(Text)
    error = Column(Text)


def init_db():
    """Initialize database tables."""
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class SessionStore:
    """Helper class for managing LFA sessions."""

    @staticmethod
    def create_session(db: Session, session_id: str, raw_input: str) -> LFASession:
        """Create a new session."""
        session = LFASession(
            id=session_id,
            raw_input=raw_input,
            phase="ingestion"
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    @staticmethod
    def get_session(db: Session, session_id: str) -> Optional[LFASession]:
        """Get session by ID."""
        return db.query(LFASession).filter(LFASession.id == session_id).first()

    @staticmethod
    def update_session(db: Session, session_id: str, **kwargs) -> Optional[LFASession]:
        """Update session fields."""
        session = db.query(LFASession).filter(LFASession.id == session_id).first()
        if session:
            for key, value in kwargs.items():
                if hasattr(session, key):
                    setattr(session, key, value)
            db.commit()
            db.refresh(session)
        return session

    @staticmethod
    def delete_session(db: Session, session_id: str) -> bool:
        """Delete a session."""
        session = db.query(LFASession).filter(LFASession.id == session_id).first()
        if session:
            db.delete(session)
            db.commit()
            return True
        return False
