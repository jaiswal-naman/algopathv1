"""
Seed Database Script
Loads templates into PostgreSQL and Pinecone for the LFA Builder.
"""

import json
import os
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Get paths
SCRIPT_DIR = Path(__file__).parent
TEMPLATES_FILE = SCRIPT_DIR / "seed_templates.json"


def load_templates():
    """Load templates from JSON file."""
    with open(TEMPLATES_FILE, "r") as f:
        data = json.load(f)
    return data.get("templates", [])


def seed_postgres():
    """Seed templates into PostgreSQL."""
    from ..db.postgres import SessionLocal, TemplateStore, init_db

    init_db()
    db = SessionLocal()

    try:
        templates = load_templates()
        print(f"Loading {len(templates)} templates into PostgreSQL...")

        for template in templates:
            existing = TemplateStore.get_template(db, template["id"])
            if not existing:
                TemplateStore.create_template(db, template)
                print(f"  Added: {template['title']}")
            else:
                print(f"  Skipped (exists): {template['title']}")

        print("PostgreSQL seeding complete!")

    finally:
        db.close()


def seed_pinecone():
    """Seed templates into Pinecone with embeddings."""
    from ..db.vector import VectorStore

    api_key = os.getenv("PINECONE_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        print("PINECONE_API_KEY not set. Skipping Pinecone seeding.")
        return

    if not openai_key:
        print("OPENAI_API_KEY not set. Cannot generate embeddings.")
        return

    # Initialize clients
    openai_client = OpenAI(api_key=openai_key)
    vector_store = VectorStore(api_key=api_key)

    if not vector_store.is_available():
        print("Pinecone not available. Skipping seeding.")
        return

    templates = load_templates()
    print(f"Loading {len(templates)} templates into Pinecone...")

    vectors = []
    for template in templates:
        # Create embedding text from template content
        embed_text = f"""
        Title: {template['title']}
        Description: {template['description']}
        Category: {template['category']}
        Tags: {', '.join(template.get('tags', []))}
        Goal: {template['content'].get('goal', '')}
        """

        # Generate embedding
        response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=embed_text
        )
        embedding = response.data[0].embedding

        vectors.append({
            "id": template["id"],
            "values": embedding,
            "metadata": {
                "title": template["title"],
                "description": template["description"],
                "category": template["category"],
                "tags": template.get("tags", []),
                "preview": template.get("preview", "")
            }
        })
        print(f"  Embedded: {template['title']}")

    # Upsert all vectors
    count = vector_store.upsert_batch(vectors)
    print(f"Pinecone seeding complete! {count} vectors added.")


def main():
    """Run all seeding operations."""
    print("=" * 50)
    print("LFA Builder - Database Seeding")
    print("=" * 50)

    print("\n1. Seeding PostgreSQL...")
    seed_postgres()

    print("\n2. Seeding Pinecone...")
    seed_pinecone()

    print("\n" + "=" * 50)
    print("Seeding complete!")
    print("=" * 50)


if __name__ == "__main__":
    main()
