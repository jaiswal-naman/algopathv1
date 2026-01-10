from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import os
import uuid
from ..agents.exporter import Exporter
from ..db.postgres import SessionLocal, SessionStore

router = APIRouter()
exporter = Exporter()

class ExportRequest(BaseModel):
    session_id: str
    format: str  # "csv" or "docx"
    lfa_data: Optional[Dict[str, Any]] = None # Optional override

@router.post("/export")
async def export_lfa(request: ExportRequest, background_tasks: BackgroundTasks):
    """
    Export LFA to DOCX or CSV.
    """
    try:
        # Get session data
        db = SessionLocal()
        session = SessionStore.get_session(db, request.session_id)
        db.close()

        if not session:
            # For testing/dev, allow data pass-through if no session
            if not request.lfa_data:
                raise HTTPException(status_code=404, detail="Session not found")
            lfa_data = request.lfa_data
            metadata = {"title": "LFA Export", "organization": "N/A"}
        else:
            lfa_data = session.lfa_document
            if not lfa_data:
                raise HTTPException(status_code=400, detail="No LFA document in session to export")
            
            # Extract metadata from brief if available
            brief = session.program_brief or {}
            metadata = {
                "title": brief.get("goal", "Logical Framework"),
                "organization": brief.get("organization", "N/A"),
                "donor": brief.get("donor", "N/A"),
                "date": str(session.updated_at)
            }

        # Generate file
        filename = f"lfa_export_{uuid.uuid4().hex[:8]}"
        
        if request.format.lower() == "csv":
            csv_content = exporter.generate_csv(lfa_data)
            # In a real app we might upload to S3. Here we'll return as downloadable.
            # For simplicity in this API, we'll write to temp and return file.
            filepath = f"/tmp/{filename}.csv"
            # Ensure tmp exists - simple hack for windows/linux compat in dev
            os.makedirs(os.path.dirname(filepath) if os.path.dirname(filepath) else ".", exist_ok=True)
            if os.name == 'nt': # Windows handling
                 filepath = f"{filename}.csv"
            
            with open(filepath, "w", newline="", encoding="utf-8") as f:
                f.write(csv_content)
                
            return FileResponse(filepath, filename=f"{filename}.csv", media_type="text/csv")

        elif request.format.lower() == "docx":
            docx_buffer = exporter.generate_docx(lfa_data, metadata)
            filepath = f"{filename}.docx"
            
            with open(filepath, "wb") as f:
                f.write(docx_buffer.getvalue())
                
            return FileResponse(
                filepath, 
                filename=f"{filename}.docx", 
                media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
        
        else:
            raise HTTPException(status_code=400, detail="Invalid format. Use 'csv' or 'docx'.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
