"""
FastAPI Server - Main Entry Point
LFA Builder Platform Backend
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .routes import router
from ..db.postgres import init_db

# Load environment variables
load_dotenv()

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger("lfa_builder")


def get_allowed_origins() -> list:
    """
    Get allowed CORS origins from environment.
    Supports comma-separated values for multiple origins.
    """
    frontend_url = os.getenv("FRONTEND_URL", "")

    # Default development origins
    dev_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    # Parse FRONTEND_URL (can be comma-separated)
    if frontend_url:
        custom_origins = [url.strip() for url in frontend_url.split(",") if url.strip()]
        # In production, only use explicitly configured origins
        if os.getenv("ENV", "development") == "production":
            if custom_origins:
                return custom_origins
            else:
                logger.warning("FRONTEND_URL not set in production! Using restrictive defaults.")
                return []
        else:
            # In development, combine both
            return list(set(dev_origins + custom_origins))

    return dev_origins


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    # Startup
    logger.info("Starting LFA Builder API...")
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down LFA Builder API...")


# Create FastAPI application
app = FastAPI(
    title="LFA Builder API",
    description="Multi-Agent System for creating Logical Framework Approach documents",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS with secure settings
allowed_origins = get_allowed_origins()
logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Accept",
        "Origin",
        "X-Requested-With",
    ],
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
            "get_full_session": "GET /api/session/{session_id}/full",
            "delete_session": "DELETE /api/session/{session_id}",
            "export": "POST /api/export",
            "health": "GET /api/health",
            "docs": "GET /docs"
        }
    }


def main():
    """Run the server."""
    import uvicorn

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))

    logger.info(f"Starting server on {host}:{port}")

    uvicorn.run(
        "app.api.server:app",
        host=host,
        port=port,
        reload=True
    )


if __name__ == "__main__":
    main()
