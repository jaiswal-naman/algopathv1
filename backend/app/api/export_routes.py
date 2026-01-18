"""
Export Routes for LFA Builder
Handles CSV and DOCX export with proper file cleanup.
"""

import os
import uuid
import logging
import tempfile
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, field_validator

from app.agents.exporter import Exporter
from app.db.postgres import SessionStore, get_db
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter()
logger = logging.getLogger("lfa_builder.export")

# Track files to clean up
_temp_files: set = set()


def cleanup_file(filepath: str):
    """Background task to clean up temporary files."""
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
            logger.debug(f"Cleaned up temp file: {filepath}")
            _temp_files.discard(filepath)
    except Exception as e:
        logger.error(f"Failed to cleanup file {filepath}: {e}")


class ExportRequest(BaseModel):
    """Export request model with validation."""
    session_id: str = Field(..., min_length=36, max_length=36)
    format: str = Field(..., pattern="^(csv|docx)$", description="Export format: 'csv' or 'docx'")
    lfa_data: Optional[Dict[str, Any]] = None

    @field_validator('session_id')
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        try:
            uuid.UUID(v)
        except ValueError:
            raise ValueError("Invalid session ID format")
        return v

    @field_validator('format')
    @classmethod
    def validate_format(cls, v: str) -> str:
        v = v.lower()
        if v not in ('csv', 'docx'):
            raise ValueError("Format must be 'csv' or 'docx'")
        return v


@router.post("/export")
async def export_lfa(
    request: ExportRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Export LFA to CSV or DOCX format.

    The file is generated, returned to the client, and cleaned up after response.
    """
    filepath = None

    exporter = Exporter()

    # Get session data
    # db = SessionLocal() # Removed manual session creation
    session = SessionStore.get_session(db, request.session_id)

    if not session:
        if not request.lfa_data:
            raise HTTPException(status_code=404, detail="Session not found")
        lfa_data = request.lfa_data
        metadata = {"title": "LFA Export", "organization": "N/A"}
    else:
        lfa_data = session.lfa_document
        if not lfa_data:
            raise HTTPException(
                status_code=400,
                detail="No LFA document in session to export"
            )

        brief = session.program_brief or {}
        metadata = {
            "title": brief.get("goal", "Logical Framework"),
            "organization": brief.get("organization", "N/A"),
            "donor": brief.get("donor", "N/A"),
            "date": str(session.updated_at) if session.updated_at else "N/A"
        }

    # Generate unique filename
    file_id = uuid.uuid4().hex[:8]
    filename = f"lfa_export_{file_id}"

    try:
        if request.format == "csv":
            csv_content = exporter.generate_csv(lfa_data)

            # Create temp file
            fd, filepath = tempfile.mkstemp(suffix=".csv", prefix=filename)
            try:
                with os.fdopen(fd, 'w', encoding='utf-8', newline='') as f:
                    f.write(csv_content)
            except Exception:
                os.close(fd)
                raise

            _temp_files.add(filepath)
            background_tasks.add_task(cleanup_file, filepath)

            logger.info(f"Generated CSV export: {filename}.csv")

            return FileResponse(
                filepath,
                filename=f"{filename}.csv",
                media_type="text/csv",
                headers={"Content-Disposition": f"attachment; filename={filename}.csv"}
            )

        elif request.format == "docx":
            docx_buffer = exporter.generate_docx(lfa_data, metadata)

            # Create temp file
            fd, filepath = tempfile.mkstemp(suffix=".docx", prefix=filename)
            try:
                with os.fdopen(fd, 'wb') as f:
                    f.write(docx_buffer.getvalue())
            except Exception:
                os.close(fd)
                raise

            _temp_files.add(filepath)
            background_tasks.add_task(cleanup_file, filepath)

            logger.info(f"Generated DOCX export: {filename}.docx")

            return FileResponse(
                filepath,
                filename=f"{filename}.docx",
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                headers={"Content-Disposition": f"attachment; filename={filename}.docx"}
            )

        else:
            raise HTTPException(status_code=400, detail="Invalid format. Use 'csv' or 'docx'.")

    except HTTPException:
        raise
    except ImportError as e:
        logger.error(f"Missing dependency for export: {e}")
        raise HTTPException(
            status_code=500,
            detail="Export functionality not available. Missing required library."
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        logger.exception(f"Export failed: {e}")
        # Clean up file if created
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception:
                pass
        raise HTTPException(
            status_code=500,
            detail="Failed to generate export. Please try again."
        )
    finally:
        pass


@router.get("/export/formats")
async def get_export_formats():
    """Get available export formats."""
    return {
        "formats": [
            {"id": "csv", "name": "CSV", "description": "Comma-separated values for spreadsheets"},
            {"id": "docx", "name": "Word Document", "description": "Microsoft Word format"}
        ]
    }
