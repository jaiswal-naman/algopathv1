"""
FastAPI Server - Main Entry Point
LFA Builder Platform Backend
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routes import router
from ..db.postgres import init_db

# Load environment variables
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    # Startup
    print("Starting LFA Builder API...")
    init_db()
    print("Database initialized")
    yield
    # Shutdown
    print("Shutting down LFA Builder API...")


# Create FastAPI application
app = FastAPI(
    title="LFA Builder API",
    description="Multi-Agent System for creating Logical Framework Approach documents",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)
from .export_routes import router as export_router
app.include_router(export_router, prefix="/api", tags=["Export"])


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "LFA Builder API",
        "version": "1.0.0",
        "description": "Multi-Agent System for creating LFA documents",
        "endpoints": {
            "start_session": "POST /api/start",
            "submit_answers": "POST /api/answers",
            "finalize": "POST /api/finalize",
            "get_session": "GET /api/session/{session_id}",
            "health": "GET /api/health",
            "docs": "GET /docs"
        }
    }


def main():
    """Run the server."""
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))

    uvicorn.run(
        "app.api.server:app",
        host=host,
        port=port,
        reload=True
    )


if __name__ == "__main__":
    main()
