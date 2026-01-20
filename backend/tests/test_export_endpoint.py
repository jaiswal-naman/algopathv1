
import pytest
import uuid
import os
from unittest.mock import MagicMock
from app.db.postgres import SessionStore

# Mock session data
SAMPLE_LFA = {
    "goal": "Test Goal",
    "goal_indicators": ["Ind 1"],
    "assumptions": ["Assump 1"],
    "outcomes": [
        {
            "id": "OC1",
            "description": "Outcome 1",
            "indicators": ["Oc Ind 1"],
            "means_of_verification": ["MoV 1"],
            "outputs": []
        }
    ]
}

SAMPLE_BRIEF = {
    "goal": "Test Program",
    "organization": "Test Org"
}

class TestExportEndpoint:
    
    def test_export_csv_success(self, client, db_session):
        """Test successful CSV export via API."""
        # Create a session
        session_id = str(uuid.uuid4())
        
        # We need to inject this session into the SessionStore or SessionManager
        # Since SessionStore uses the DB, and we have db_session fixture...
        
        # Create session in DB
        SessionStore.create_session(db_session, session_id, "test input")
        SessionStore.update_session(
            db_session, 
            session_id, 
            lfa_document=SAMPLE_LFA,
            program_brief=SAMPLE_BRIEF
        )
        
        # Request export
        response = client.post("/api/export", json={
            "session_id": session_id,
            "format": "csv"
        })
        
        assert response.status_code == 200
        assert response.headers["content-type"] == "text/csv"
        assert "attachment" in response.headers["content-disposition"]
        assert "GOAL" in response.text  # Verify our fix is applied

    def test_export_docx_success(self, client, db_session):
        """Test successful DOCX export via API."""
        session_id = str(uuid.uuid4())
        
        SessionStore.create_session(db_session, session_id, "test input")
        SessionStore.update_session(
            db_session, 
            session_id, 
            lfa_document=SAMPLE_LFA,
            program_brief=SAMPLE_BRIEF
        )
        
        response = client.post("/api/export", json={
            "session_id": session_id,
            "format": "docx"
        })
        
        # If python-docx is missing or fails, this will be 500
        assert response.status_code == 200
        assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        assert len(response.content) > 0
