"""
Seed Database Script
Initializes the database for the LFA Builder.
"""

from dotenv import load_dotenv

load_dotenv()


def main():
    """Initialize the database."""
    from ..db.postgres import init_db

    print("=" * 50)
    print("LFA Builder - Database Initialization")
    print("=" * 50)

    print("\nInitializing database...")
    init_db()
    print("Database initialization complete!")

    print("\n" + "=" * 50)
    print("Setup complete!")
    print("=" * 50)


if __name__ == "__main__":
    main()
