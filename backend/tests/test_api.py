"""
Tests for API endpoints.
"""

import pytest
import uuid


class TestHealthEndpoint:
    """Tests for health check endpoint."""

    def test_health_check(self, client):
        """Test health endpoint returns healthy status."""
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "LFA Builder API"

    def test_stats_endpoint(self, client):
        """Test stats endpoint returns session count."""
        response = client.get("/api/stats")
        assert response.status_code == 200
        data = response.json()
        assert "active_sessions" in data
        assert "session_ttl_hours" in data


class TestValidation:
    """Tests for input validation."""

    def test_start_session_empty_input(self, client):
        """Test that empty input is rejected."""
        response = client.post("/api/start", json={"raw_input": ""})
        assert response.status_code == 422  # Validation error

    def test_start_session_short_input(self, client):
        """Test that input shorter than 10 chars is rejected."""
        response = client.post("/api/start", json={"raw_input": "short"})
        assert response.status_code == 422

    def test_submit_answers_invalid_session_id(self, client):
        """Test that invalid session ID format is rejected."""
        response = client.post("/api/answers", json={
            "session_id": "not-a-uuid",
            "answers": [{"question_id": "q1", "answer": "test"}]
        })
        assert response.status_code == 422

    def test_submit_answers_missing_answers(self, client):
        """Test that missing answers are rejected."""
        valid_uuid = str(uuid.uuid4())
        response = client.post("/api/answers", json={
            "session_id": valid_uuid,
            "answers": []
        })
        assert response.status_code == 422

    def test_finalize_invalid_session_id(self, client):
        """Test finalize with invalid session ID."""
        response = client.post("/api/finalize", json={
            "session_id": "invalid",
            "generate_new": True
        })
        assert response.status_code == 422

    def test_get_session_invalid_id(self, client):
        """Test get session with invalid ID format."""
        response = client.get("/api/session/invalid-id")
        assert response.status_code == 400

    def test_get_session_not_found(self, client):
        """Test get session that doesn't exist."""
        valid_uuid = str(uuid.uuid4())
        response = client.get(f"/api/session/{valid_uuid}")
        assert response.status_code == 404

    def test_delete_session_invalid_id(self, client):
        """Test delete with invalid session ID."""
        response = client.delete("/api/session/invalid")
        assert response.status_code == 400


class TestExportValidation:
    """Tests for export endpoint validation."""

    def test_export_invalid_format(self, client):
        """Test that invalid export format is rejected."""
        valid_uuid = str(uuid.uuid4())
        response = client.post("/api/export", json={
            "session_id": valid_uuid,
            "format": "invalid"
        })
        assert response.status_code == 422

    def test_export_invalid_session_id(self, client):
        """Test export with invalid session ID."""
        response = client.post("/api/export", json={
            "session_id": "not-a-uuid",
            "format": "csv"
        })
        assert response.status_code == 422

    def test_export_session_not_found(self, client):
        """Test export for non-existent session."""
        valid_uuid = str(uuid.uuid4())
        response = client.post("/api/export", json={
            "session_id": valid_uuid,
            "format": "csv"
        })
        assert response.status_code == 404

    def test_export_formats_endpoint(self, client):
        """Test export formats endpoint."""
        response = client.get("/api/export/formats")
        assert response.status_code == 200
        data = response.json()
        assert "formats" in data
        assert len(data["formats"]) == 2


class TestRootEndpoint:
    """Tests for root endpoint."""

    def test_root_returns_api_info(self, client):
        """Test root endpoint returns API information."""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "LFA Builder API"
        assert "endpoints" in data
