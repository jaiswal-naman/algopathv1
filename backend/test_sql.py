import sys
import os

# Add parent directory to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from app.data.seed_db import seed_postgres

if __name__ == "__main__":
    print("DEBUG: Starting SQL Seed")
    try:
        seed_postgres()
        print("DEBUG: SQL Seed Finished")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
