"""
Pytest configuration and fixtures for LFA Builder tests.
"""

import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Set test environment before imports
os.environ["OPENAI_API_KEY"] = "sk-test-key"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["ENV"] = "test"

from app.db.postgres import Base, get_db
from app.api.server import app


# Create test database
TEST_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for tests."""
    print("DEBUG: override_get_db called")
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database override."""
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_program_description():
    """Sample program description for testing."""
    return """
    We want to improve literacy rates among rural children in India.
    The program will train teachers and provide educational materials.
    Target audience is children aged 6-12 in government schools.
    Main challenges include lack of resources and teacher training.
    """


@pytest.fixture
def sample_lfa_document():
    """Sample LFA document for testing."""
    return {
        "title": "Rural Literacy Improvement Program",
        "goal": "Improve literacy rates among rural children by 30% within 3 years",
        "goal_indicators": [
            "30% increase in literacy test scores",
            "90% school attendance rate"
        ],
        "assumptions": [
            "Government support continues",
            "Community engagement remains high"
        ],
        "outcomes": [
            {
                "id": "OC1",
                "description": "Teachers have improved teaching skills",
                "indicators": ["80% teachers complete training"],
                "means_of_verification": ["Training certificates"],
                "outputs": [
                    {
                        "id": "OP1.1",
                        "description": "Teacher training program developed",
                        "indicators": ["Training curriculum approved"],
                        "means_of_verification": ["Curriculum document"],
                        "activities": [
                            {
                                "id": "A1.1.1",
                                "description": "Conduct training workshops",
                                "indicators": ["10 workshops conducted"],
                                "means_of_verification": ["Workshop reports"]
                            }
                        ]
                    }
                ]
            }
        ]
    }


@pytest.fixture
def sample_answers():
    """Sample answers for testing."""
    return [
        {"question_id": "q1", "answer": "Primary schools in rural Maharashtra"},
        {"question_id": "q2", "answer": "3 years"},
        {"question_id": "q3", "answer": "Government grants and NGO partnerships"}
    ]
