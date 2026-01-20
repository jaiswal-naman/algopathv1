"""
Tests for session management functionality.
"""

import pytest
import time
from datetime import datetime, timedelta

# Import after setting environment
import os
os.environ["OPENAI_API_KEY"] = "sk-test-key"
os.environ["SESSION_TTL_HOURS"] = "1"

from app.api.routes import SessionManager, SessionEntry


class TestSessionEntry:
    """Tests for SessionEntry class."""

    def test_session_entry_creation(self):
        """Test session entry is created with timestamps."""
        state = {"session_id": "test", "phase": "ingestion"}
        entry = SessionEntry(state)

        assert entry.state == state
        assert entry.created_at is not None
        assert entry.last_accessed is not None
        assert entry.created_at == entry.last_accessed

    def test_session_entry_touch(self):
        """Test touch updates last_accessed."""
        state = {"session_id": "test"}
        entry = SessionEntry(state)
        original_time = entry.last_accessed

        time.sleep(0.01)  # Small delay
        entry.touch()

        assert entry.last_accessed > original_time

    def test_session_entry_expiration(self):
        """Test session expiration check."""
        state = {"session_id": "test"}
        entry = SessionEntry(state)

        # Not expired immediately
        assert not entry.is_expired(ttl_hours=1)

        # Manually set old timestamp
        entry.last_accessed = datetime.utcnow() - timedelta(hours=2)
        assert entry.is_expired(ttl_hours=1)


class TestSessionManager:
    """Tests for SessionManager class."""

    def test_session_manager_set_get(self):
        """Test basic set and get operations."""
        manager = SessionManager()
        state = {"session_id": "test-123", "phase": "ingestion"}

        manager.set("test-123", state)
        result = manager.get("test-123")

        assert result == state

    def test_session_manager_get_nonexistent(self):
        """Test getting non-existent session returns None."""
        manager = SessionManager()
        result = manager.get("nonexistent")
        assert result is None

    def test_session_manager_delete(self):
        """Test deleting a session."""
        manager = SessionManager()
        state = {"session_id": "test-123"}

        manager.set("test-123", state)
        assert manager.get("test-123") is not None

        result = manager.delete("test-123")
        assert result is True
        assert manager.get("test-123") is None

    def test_session_manager_delete_nonexistent(self):
        """Test deleting non-existent session returns False."""
        manager = SessionManager()
        result = manager.delete("nonexistent")
        assert result is False

    def test_session_manager_count(self):
        """Test session count."""
        manager = SessionManager()
        assert manager.count() == 0

        manager.set("session-1", {"id": "1"})
        assert manager.count() == 1

        manager.set("session-2", {"id": "2"})
        assert manager.count() == 2

        manager.delete("session-1")
        assert manager.count() == 1

    def test_session_manager_update_existing(self):
        """Test updating an existing session."""
        manager = SessionManager()
        state1 = {"session_id": "test", "phase": "ingestion"}
        state2 = {"session_id": "test", "phase": "inquiry"}

        manager.set("test", state1)
        manager.set("test", state2)

        result = manager.get("test")
        assert result["phase"] == "inquiry"

    def test_session_manager_cleanup(self):
        """Test cleanup of expired sessions."""
        manager = SessionManager()

        # Add sessions
        manager.set("active", {"id": "active"})
        manager.set("expired", {"id": "expired"})

        # Manually expire one session
        manager._sessions["expired"].last_accessed = datetime.utcnow() - timedelta(hours=48)

        # Cleanup
        manager.cleanup_expired()

        # Check results
        assert manager.get("active") is not None
        assert manager.get("expired") is None

    def test_session_manager_thread_safety(self):
        """Test that operations are thread-safe."""
        import threading

        manager = SessionManager()
        errors = []

        def set_sessions(start, count):
            try:
                for i in range(start, start + count):
                    manager.set(f"session-{i}", {"id": i})
            except Exception as e:
                errors.append(e)

        # Create multiple threads
        threads = [
            threading.Thread(target=set_sessions, args=(i * 100, 100))
            for i in range(5)
        ]

        # Start all threads
        for t in threads:
            t.start()

        # Wait for completion
        for t in threads:
            t.join()

        # Check no errors occurred
        assert len(errors) == 0
        assert manager.count() == 500
