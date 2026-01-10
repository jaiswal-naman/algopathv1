# LFA Builder - Quick Reference Guide

## Project Structure at a Glance

```
algopathv3/
├── backend/                      # Python FastAPI Backend
│   ├── app/
│   │   ├── agents/              # 5 AI Worker Agents
│   │   ├── graph/               # LangGraph Orchestration
│   │   ├── api/                 # REST API Endpoints
│   │   ├── db/                  # Database Connections
│   │   └── data/                # Seed Data
│   └── requirements.txt
│
├── frontend/                     # Next.js 14 Frontend
│   ├── app/                     # Pages (App Router)
│   ├── components/
│   │   ├── ui/                  # Shadcn Components
│   │   └── wizard/              # LFA Builder Wizard
│   ├── lib/                     # Utilities & API Client
│   └── types/                   # TypeScript Types
│
└── docs/                         # Documentation
    ├── ARCHITECTURE.md          # Full Technical Docs
    └── QUICK_REFERENCE.md       # This File
```

---

## Key Files by Function

### Backend Entry Points
| File | Purpose |
|------|---------|
| `api/server.py` | FastAPI app initialization |
| `api/routes.py` | API endpoint handlers |
| `graph/orchestrator.py` | LangGraph workflow |

### Agent Files
| Agent | File | Job |
|-------|------|-----|
| ProfileBuilder | `agents/profile_builder.py` | Parse user input |
| Interviewer | `agents/interviewer.py` | Generate questions |
| Retriever | `agents/retriever.py` | Search templates |
| Generator | `agents/generator.py` | Create LFA |
| Visualizer | `agents/visualizer.py` | Make diagrams |

### Frontend Entry Points
| File | Purpose |
|------|---------|
| `app/page.tsx` | Home page |
| `components/wizard/Wizard.tsx` | Main controller |
| `lib/api.ts` | Backend API client |

---

## Data Flow Summary

```
USER INPUT
    │
    ▼
┌─────────────────┐     ┌─────────────────┐
│ ProfileBuilder  │ ──► │   Interviewer   │
│ (Parse Input)   │     │ (Ask Questions) │
└─────────────────┘     └─────────────────┘
                              │
                    USER ANSWERS QUESTIONS
                              │
                              ▼
                    ┌─────────────────┐
                    │    Retriever    │
                    │ (Find Templates)│
                    └─────────────────┘
                              │
                    USER SELECTS / GENERATES
                              │
                              ▼
┌─────────────────┐     ┌─────────────────┐
│   Generator     │ ──► │   Visualizer    │
│ (Create LFA)    │     │ (Make Diagram)  │
└─────────────────┘     └─────────────────┘
                              │
                              ▼
                        FINAL LFA + DIAGRAM
```

---

## API Endpoints

| Method | Endpoint | Input | Output |
|--------|----------|-------|--------|
| POST | `/api/start` | raw_input | session_id, brief, questions |
| POST | `/api/answers` | session_id, answers | matched_templates |
| POST | `/api/finalize` | session_id, template_id | lfa_document, mermaid |
| GET | `/api/session/{id}` | - | session status |
| GET | `/api/health` | - | health status |

---

## State Flow

```
INGESTION ──► INQUIRY ──► WAITING_FOR_ANSWERS ──► SYNTHESIS
                                                      │
                                                      ▼
COMPLETED ◄── FINALIZATION ◄── WAITING_FOR_SELECTION ◄┘
```

---

## Quick Commands

### Run Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.api.server:app --reload
# API: http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:3000
```

### Seed Database
```bash
cd backend
python -m app.data.seed_db
```

---

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=sk-...          # Required
DATABASE_URL=postgresql://...   # Required (PostgreSQL)
PINECONE_API_KEY=...           # Optional (enables search)
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## LFA Document Structure

```
LFADocument
├── title: string
├── goal: string
├── goal_indicators: string[]
├── assumptions: string[]
└── outcomes: Outcome[]
    ├── id: string
    ├── description: string
    ├── indicators: string[]
    ├── means_of_verification: string[]
    └── outputs: Output[]
        ├── id: string
        ├── description: string
        ├── indicators: string[]
        ├── means_of_verification: string[]
        └── activities: Activity[]
            ├── id: string
            ├── description: string
            ├── indicators: string[]
            └── means_of_verification: string[]
```

---

## Component Hierarchy

```
layout.tsx
└── page.tsx
    └── Wizard.tsx
        ├── StepIndicator.tsx
        ├── InputStep.tsx
        ├── QuestionsStep.tsx
        ├── TemplatesStep.tsx
        └── ResultStep.tsx
            └── MermaidDiagram.tsx
```

---

## Visualization Types

| Type | Mermaid Syntax | Use Case |
|------|----------------|----------|
| Flowchart | `flowchart TD` | Hierarchical view |
| Mindmap | `mindmap` | Radial expansion |
| Journey | `journey` | Timeline view |

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, Tailwind, Shadcn, Mermaid |
| Backend | FastAPI, LangGraph, Pydantic |
| AI | OpenAI GPT-4o, text-embedding-3-small |
| Database | PostgreSQL, Pinecone |

---

*Version 1.0 - Shikshagraha LFA Builder*
