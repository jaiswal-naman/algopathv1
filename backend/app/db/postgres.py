"""
PostgreSQL Database Connection
Manages session state and template storage.
"""

import os
from typing import Generator, Optional
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Text, DateTime, JSON, Float
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
    matched_templates = Column(JSON)
    selected_template_id = Column(String(100))
    lfa_document = Column(JSON)
    mermaid_code = Column(Text)
    error = Column(Text)


class LFATemplate(Base):
    """Store LFA templates for retrieval."""
    __tablename__ = "lfa_templates"

    id = Column(String(100), primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    tags = Column(JSON)  # List of tags
    content = Column(JSON)  # Full LFA structure
    preview = Column(Text)  # Short preview for search results
    created_at = Column(DateTime, default=datetime.utcnow)


def init_db():
    """Initialize database tables."""
    # Import models to ensure they're registered with Base
    from app.db.models import User, EmailVerificationToken, PasswordResetToken
    Base.metadata.create_all(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Get database session."""
    print("DEBUG: original get_db called")
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


class TemplateStore:
    """Helper class for managing LFA templates."""

    @staticmethod
    def create_template(db: Session, template_data: dict) -> LFATemplate:
        """Create a new template."""
        template = LFATemplate(**template_data)
        db.add(template)
        db.commit()
        db.refresh(template)
        return template

    @staticmethod
    def get_template(db: Session, template_id: str) -> Optional[LFATemplate]:
        """Get template by ID."""
        return db.query(LFATemplate).filter(LFATemplate.id == template_id).first()

    @staticmethod
    def get_all_templates(db: Session) -> list:
        """Get all templates."""
        return db.query(LFATemplate).all()

    @staticmethod
    def search_templates(db: Session, query: str, limit: int = 10) -> list:
        """Basic text search on templates."""
        return db.query(LFATemplate).filter(
            LFATemplate.title.ilike(f"%{query}%") |
            LFATemplate.description.ilike(f"%{query}%")
        ).limit(limit).all()
