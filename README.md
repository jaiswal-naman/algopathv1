# LFA Builder Platform - Shikshagraha

A Multi-Agent System for creating Logical Framework Approach (LFA) documents using AI.

## Architecture

```
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │    (Port 3000)      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │    (Port 8000)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ LangGraph    │  │  PostgreSQL  │  │   Pinecone   │
    │ Orchestrator │  │  (Sessions)  │  │  (Vectors)   │
    └──────────────┘  └──────────────┘  └──────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌────────┐         ┌────────┐
│ Agents │         │ Agents │
│ Profile│◄───────►│Interview│
│ Builder│         │   er   │
└────────┘         └────────┘
    │
    ▼
┌────────┐         ┌────────┐         ┌────────┐
│Retriev │────────►│Generat │────────►│Visuali │
│   er   │         │   or   │         │   zer  │
└────────┘         └────────┘         └────────┘
```

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- OpenAI API Key

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run the server
uvicorn app.api.server:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local

# Run the development server
npm run dev
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure

```
/backend
  /app
    /agents           # AI Worker Agents
      profile_builder.py
      interviewer.py
      retriever.py
      generator.py
      visualizer.py
    /graph            # LangGraph Orchestration
      orchestrator.py
      state.py
    /api              # FastAPI Routes
      server.py
      routes.py
    /db               # Database Connections
      postgres.py
      vector.py
    /data             # Seed Data
      seed_templates.json
      seed_db.py

/frontend
  /app               # Next.js App Router
    page.tsx
    layout.tsx
  /components
    /ui              # Shadcn UI Components
    /wizard          # LFA Builder Wizard
  /lib               # Utilities & API Client
  /types             # TypeScript Types
```

## Workflow

1. **Describe** - User describes their program
2. **Clarify** - AI generates clarifying questions
3. **Choose** - Select from matched templates or generate new
4. **View** - See the complete LFA with visualizations

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/start | Start new session |
| POST | /api/answers | Submit answers |
| POST | /api/finalize | Generate final LFA |
| GET | /api/session/{id} | Get session status |
| GET | /api/health | Health check |

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_key
DATABASE_URL=postgresql://...
PINECONE_API_KEY=your_key (optional)
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## License

MIT License - Shikshagraha Foundation
