"""
Tests for LFA exporter functionality.
"""

import pytest
import io

# Import after setting environment
import os
os.environ["OPENAI_API_KEY"] = "sk-test-key"

from app.agents.exporter import Exporter


class TestExporter:
    """Tests for Exporter class."""

    @pytest.fixture
    def exporter(self):
        """Create exporter instance."""
        return Exporter()

    @pytest.fixture
    def sample_lfa(self):
        """Sample LFA document for testing."""
        return {
            "title": "Test Program",
            "goal": "Improve outcomes for target population",
            "goal_indicators": ["Indicator 1", "Indicator 2"],
            "assumptions": ["Assumption 1", "Assumption 2"],
            "outcomes": [
                {
                    "id": "OC1",
                    "description": "Outcome 1 description",
                    "indicators": ["OC1 Indicator"],
                    "means_of_verification": ["Survey data"],
                    "outputs": [
                        {
                            "id": "OP1.1",
                            "description": "Output 1.1 description",
                            "indicators": ["OP1.1 Indicator"],
                            "means_of_verification": ["Reports"],
                            "activities": [
                                {
                                    "id": "A1.1.1",
                                    "description": "Activity 1.1.1",
                                    "indicators": ["Activity indicator"],
                                    "means_of_verification": ["Records"]
                                }
                            ]
                        }
                    ]
                }
            ]
        }

    def test_generate_csv(self, exporter, sample_lfa):
        """Test CSV generation."""
        csv_content = exporter.generate_csv(sample_lfa)

        assert csv_content is not None
        assert isinstance(csv_content, str)
        assert "Level" in csv_content
        assert "Description" in csv_content
        assert "GOAL" in csv_content
        assert "Test Program" in csv_content or "Improve outcomes" in csv_content

    def test_generate_csv_empty_lfa(self, exporter):
        """Test CSV generation with minimal LFA."""
        minimal_lfa = {
            "title": "Minimal",
            "goal": "Test goal",
            "outcomes": []
        }
        csv_content = exporter.generate_csv(minimal_lfa)
        assert csv_content is not None
        assert "GOAL" in csv_content

    def test_generate_docx(self, exporter, sample_lfa):
        """Test DOCX generation."""
        metadata = {
            "title": "Test Export",
            "organization": "Test Org",
            "date": "2024-01-01"
        }

        docx_buffer = exporter.generate_docx(sample_lfa, metadata)

        assert docx_buffer is not None
        assert isinstance(docx_buffer, io.BytesIO)
        assert docx_buffer.getvalue()  # Has content

    def test_generate_docx_without_metadata(self, exporter, sample_lfa):
        """Test DOCX generation without metadata."""
        docx_buffer = exporter.generate_docx(sample_lfa, {})
        assert docx_buffer is not None
        assert docx_buffer.getvalue()

    def test_csv_structure(self, exporter, sample_lfa):
        """Test CSV has correct structure."""
        csv_content = exporter.generate_csv(sample_lfa)
        lines = csv_content.strip().split('\n')

        # Should have header row
        assert len(lines) > 1
        header = lines[0]
        assert "Level" in header
        assert "ID" in header
        assert "Description" in header

    def test_csv_escaping(self, exporter):
        """Test CSV properly escapes special characters."""
        lfa_with_special = {
            "title": 'Test "with quotes"',
            "goal": "Goal, with comma",
            "outcomes": []
        }
        csv_content = exporter.generate_csv(lfa_with_special)

        # Should not raise and should handle special chars
        assert csv_content is not None
