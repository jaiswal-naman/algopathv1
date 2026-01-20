"""
Script to initialize the database with all tables
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.postgres import Base, engine, init_db
from app.db.models import User, EmailVerificationToken, PasswordResetToken

def create_tables():
    """Create all database tables."""
    print("Creating database tables...")
    
    # Drop all tables first (for clean slate)
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    
    # Create all tables
    print("Creating new tables...")
    Base.metadata.create_all(bind=engine)
    
    print("✓ Database tables created successfully!")
    print(f"✓ Tables: {list(Base.metadata.tables.keys())}")

if __name__ == "__main__":
    create_tables()
