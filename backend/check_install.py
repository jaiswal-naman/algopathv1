try:
    import fastapi
    import pydantic
    import uvicorn
    import langgraph
    import pinecone
    print("SUCCESS: Core packages found")
except ImportError as e:
    print(f"MISSING: {e.name}")
