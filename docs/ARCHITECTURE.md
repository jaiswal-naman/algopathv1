# LFA Builder Platform - Version 1.0
## Complete Technical Documentation

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Technology Stack](#3-technology-stack)
4. [Backend Architecture](#4-backend-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Data Flow & Workflow](#6-data-flow--workflow)
7. [File Structure & Interconnections](#7-file-structure--interconnections)
8. [API Reference](#8-api-reference)
9. [State Management](#9-state-management)
10. [Agent Details](#10-agent-details)
11. [Database Schema](#11-database-schema)
12. [Deployment Guide](#12-deployment-guide)

---

## 1. System Overview

The **LFA Builder Platform** is a Multi-Agent System (MAS) designed to help organizations create Logical Framework Approach (LFA) documents using AI. It transforms unstructured program descriptions into structured, professional LFA documents with visualizations.

### Key Features
- AI-powered program analysis
- Intelligent question generation
- Template matching via semantic search
- Custom LFA generation
- Multiple visualization formats (Flowchart, Mindmap, Journey)

### Core Workflow
```
User Input → Profile Building → Interview → Template Search → LFA Generation → Visualization
```

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     Next.js 14 Frontend (Port 3000)                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │  Input   │→ │ Questions│→ │ Templates│→ │  Result  │            │    │
│  │  │  Step    │  │   Step   │  │   Step   │  │   Step   │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  │                         ↓                                            │    │
│  │                   Wizard.tsx (State Controller)                      │    │
│  │                         ↓                                            │    │
│  │                    lib/api.ts (API Client)                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP/REST
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   FastAPI Backend (Port 8000)                        │    │
│  │                                                                      │    │
│  │   POST /api/start    →  Start Session, Build Profile, Get Questions │    │
│  │   POST /api/answers  →  Submit Answers, Search Templates            │    │
│  │   POST /api/finalize →  Generate LFA, Create Visualization          │    │
│  │   GET  /api/session  →  Get Session Status                          │    │
│  │                                                                      │    │
│  │                    routes.py (Request Handlers)                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ORCHESTRATION LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                  LangGraph State Machine                             │    │
│  │                                                                      │    │
│  │   ┌─────────────┐                                                   │    │
│  │   │ AgentState  │  ← Shared State (TypedDict)                       │    │
│  │   │ - session_id│                                                   │    │
│  │   │ - phase     │                                                   │    │
│  │   │ - raw_input │                                                   │    │
│  │   │ - brief     │                                                   │    │
│  │   │ - questions │                                                   │    │
│  │   │ - answers   │                                                   │    │
│  │   │ - templates │                                                   │    │
│  │   │ - lfa_doc   │                                                   │    │
│  │   │ - mermaid   │                                                   │    │
│  │   └─────────────┘                                                   │    │
│  │                                                                      │    │
│  │              orchestrator.py (Workflow Definition)                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            AGENT LAYER                                       │
│                                                                              │
│   Phase 1: INGESTION          Phase 2: INQUIRY                              │
│   ┌──────────────────┐        ┌──────────────────┐                          │
│   │  ProfileBuilder  │───────→│   Interviewer    │                          │
│   │                  │        │                  │                          │
│   │ • Parse raw text │        │ • Analyze gaps   │                          │
│   │ • Extract goal   │        │ • Generate Qs    │                          │
│   │ • ID audience    │        │ • Categorize     │                          │
│   │ • Find challenges│        │ • 10-15 questions│                          │
│   └──────────────────┘        └──────────────────┘                          │
│            │                           │                                     │
│            └───────────┬───────────────┘                                     │
│                        ▼                                                     │
│   Phase 3: SYNTHESIS & SEARCH                                               │
│   ┌──────────────────┐                                                      │
│   │    Retriever     │                                                      │
│   │                  │                                                      │
│   │ • Merge profile  │                                                      │
│   │ • Create embedding│                                                     │
│   │ • Search Pinecone│                                                      │
│   │ • Return matches │                                                      │
│   └──────────────────┘                                                      │
│            │                                                                 │
│            ▼                                                                 │
│   Phase 4: FINALIZATION                                                     │
│   ┌──────────────────┐        ┌──────────────────┐                          │
│   │   LFAGenerator   │───────→│  GraphVisualizer │                          │
│   │                  │        │                  │                          │
│   │ • Build LFA JSON │        │ • Parse LFA      │                          │
│   │ • Goals/Outcomes │        │ • Generate Mermaid│                         │
│   │ • Outputs/Acts   │        │ • Multiple views │                          │
│   │ • Indicators     │        │ • Flowchart/Mind │                          │
│   └──────────────────┘        └──────────────────┘                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
│                                                                              │
│   ┌──────────────────┐        ┌──────────────────┐        ┌──────────────┐  │
│   │    PostgreSQL    │        │     Pinecone     │        │   OpenAI     │  │
│   │                  │        │                  │        │              │  │
│   │ • LFA Sessions   │        │ • Template       │        │ • GPT-4o     │  │
│   │ • LFA Templates  │        │   Embeddings     │        │ • Embeddings │  │
│   │ • User Data      │        │ • Semantic Search│        │ • Completions│  │
│   └──────────────────┘        └──────────────────┘        └──────────────┘  │
│                                                                              │
│          postgres.py                vector.py              (via agents)      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Backend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | FastAPI | REST API server |
| Orchestration | LangGraph | Multi-agent workflow |
| AI | OpenAI GPT-4o | Text generation |
| Embeddings | text-embedding-3-small | Semantic search |
| Database | PostgreSQL/SQLite | Session & template storage |
| Vector DB | Pinecone | Semantic template search |
| Validation | Pydantic | Data validation |

### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 14 | React framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Components | Shadcn/UI | UI component library |
| Diagrams | Mermaid.js | LFA visualization |
| Icons | Lucide React | Icon library |
| Language | TypeScript | Type safety |

---

## 4. Backend Architecture

### 4.1 Directory Structure

```
backend/
├── app/
│   ├── __init__.py              # Package initialization
│   ├── agents/                   # AI Worker Agents
│   │   ├── __init__.py          # Agent exports
│   │   ├── profile_builder.py   # ProfileBuilder class
│   │   ├── interviewer.py       # Interviewer class
│   │   ├── retriever.py         # Retriever class
│   │   ├── generator.py         # LFAGenerator class
│   │   └── visualizer.py        # GraphVisualizer class
│   ├── graph/                    # LangGraph Orchestration
│   │   ├── __init__.py          # Graph exports
│   │   ├── state.py             # AgentState & Pydantic models
│   │   └── orchestrator.py      # Workflow definition
│   ├── api/                      # FastAPI Layer
│   │   ├── __init__.py          # API exports
│   │   ├── server.py            # FastAPI app & CORS
│   │   └── routes.py            # API endpoints
│   ├── db/                       # Database Layer
│   │   ├── __init__.py          # DB exports
│   │   ├── postgres.py          # SQLAlchemy models
│   │   └── vector.py            # Pinecone client
│   └── data/                     # Seed Data
│       ├── seed_templates.json  # Sample LFA templates
│       └── seed_db.py           # Database seeding script
├── requirements.txt              # Python dependencies
└── .env.example                  # Environment template
```

### 4.2 File Interconnections

```
                    ┌─────────────────┐
                    │   server.py     │
                    │   (Entry Point) │
                    └────────┬────────┘
                             │ imports
                             ▼
                    ┌─────────────────┐
                    │   routes.py     │
                    │  (API Handlers) │
                    └────────┬────────┘
                             │ uses
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌─────────────┐  ┌────────────┐  ┌──────────┐
     │orchestrator │  │ postgres   │  │ vector   │
     │    .py      │  │   .py      │  │   .py    │
     └──────┬──────┘  └────────────┘  └──────────┘
            │ imports
            ▼
     ┌─────────────┐
     │  state.py   │
     │ (AgentState)│
     └──────┬──────┘
            │ used by
            ▼
┌───────────────────────────────────────────────┐
│                  agents/                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ profile_ │ │interview │ │retriever │       │
│  │ builder  │ │   er     │ │   .py    │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐                    │
│  │generator │ │visualizer│                    │
│  │   .py    │ │   .py    │                    │
│  └──────────┘ └──────────┘                    │
└───────────────────────────────────────────────┘
```

### 4.3 Import Chain

```python
# server.py
from .routes import router
from ..db.postgres import init_db

# routes.py
from ..graph.orchestrator import LFAOrchestrator
from ..db.postgres import get_db, SessionStore
from ..db.vector import create_vector_store

# orchestrator.py
from .state import AgentState, WorkflowPhase, create_initial_state
from ..agents import ProfileBuilder, Interviewer, Retriever, LFAGenerator, GraphVisualizer

# Each agent imports:
from ..graph.state import AgentState, [relevant Pydantic models]
```

---

## 5. Frontend Architecture

### 5.1 Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles & CSS variables
│   ├── layout.tsx               # Root layout with header/footer
│   └── page.tsx                 # Home page with Wizard
├── components/
│   ├── ui/                       # Shadcn UI Components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card components
│   │   ├── textarea.tsx         # Textarea component
│   │   ├── input.tsx            # Input component
│   │   ├── badge.tsx            # Badge component
│   │   ├── progress.tsx         # Progress bar
│   │   └── spinner.tsx          # Loading spinner
│   └── wizard/                   # LFA Builder Wizard
│       ├── index.ts             # Wizard exports
│       ├── Wizard.tsx           # Main wizard controller
│       ├── StepIndicator.tsx    # Progress indicator
│       ├── InputStep.tsx        # Step 1: Program input
│       ├── QuestionsStep.tsx    # Step 2: Answer questions
│       ├── TemplatesStep.tsx    # Step 3: Select template
│       ├── ResultStep.tsx       # Step 4: View results
│       └── MermaidDiagram.tsx   # Mermaid renderer
├── lib/
│   ├── utils.ts                 # Utility functions (cn)
│   └── api.ts                   # API client
├── types/
│   └── index.ts                 # TypeScript interfaces
├── hooks/                        # Custom React hooks
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
└── next.config.js               # Next.js config
```

### 5.2 Component Hierarchy

```
layout.tsx
└── page.tsx
    └── Wizard.tsx (State Management)
        ├── StepIndicator.tsx
        └── [Current Step Component]
            ├── InputStep.tsx
            │   ├── Card, Textarea, Button (ui/)
            │   └── Example prompts
            ├── QuestionsStep.tsx
            │   ├── Card, Badge, Textarea, Button (ui/)
            │   └── Question navigator
            ├── TemplatesStep.tsx
            │   ├── Card, Badge, Button (ui/)
            │   └── Template cards
            └── ResultStep.tsx
                ├── Card, Badge, Button (ui/)
                ├── MermaidDiagram.tsx
                │   └── mermaid.js library
                └── LFA document view
```

### 5.3 Data Flow in Frontend

```
┌─────────────────────────────────────────────────────────────┐
│                        Wizard.tsx                            │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   WizardState                        │    │
│  │  {                                                   │    │
│  │    currentStep: "input" | "questions" | ...         │    │
│  │    sessionId: string | null                         │    │
│  │    rawInput: string                                 │    │
│  │    programBrief: ProgramBrief | null               │    │
│  │    questions: Question[]                            │    │
│  │    answers: Answer[]                                │    │
│  │    matchedTemplates: MatchedTemplate[]             │    │
│  │    lfaDocument: LFADocument | null                 │    │
│  │    mermaidCode: string                             │    │
│  │    isLoading: boolean                              │    │
│  │    error: string | null                            │    │
│  │  }                                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                           │                                  │
│           ┌───────────────┼───────────────┐                 │
│           ▼               ▼               ▼                 │
│   handleInputSubmit  handleAnswers  handleTemplateSelect    │
│           │               │               │                 │
│           └───────────────┼───────────────┘                 │
│                           ▼                                  │
│                      lib/api.ts                             │
│                           │                                  │
│                           ▼                                  │
│                    Backend API                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Data Flow & Workflow

### 6.1 Complete Request Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 1: START SESSION                                                     │
│                                                                           │
│ User types program description                                            │
│         │                                                                 │
│         ▼                                                                 │
│ InputStep.tsx                                                             │
│         │ onSubmit(rawInput)                                              │
│         ▼                                                                 │
│ Wizard.tsx::handleInputSubmit()                                           │
│         │ api.startSession(rawInput)                                      │
│         ▼                                                                 │
│ lib/api.ts                                                                │
│         │ POST /api/start { raw_input }                                   │
│         ▼                                                                 │
│ routes.py::start_session()                                                │
│         │ orchestrator.start_session(session_id, raw_input)               │
│         ▼                                                                 │
│ orchestrator.py::start_session()                                          │
│         │ workflow.invoke(initial_state)                                  │
│         ▼                                                                 │
│ LangGraph Workflow                                                        │
│         │                                                                 │
│         ├──→ ProfileBuilder.process(state)                                │
│         │         │ OpenAI GPT-4o call                                    │
│         │         │ Parse response → ProgramBrief                         │
│         │         │ Update state.program_brief                            │
│         │         ▼                                                       │
│         └──→ Interviewer.process(state)                                   │
│                   │ OpenAI GPT-4o call                                    │
│                   │ Generate 10-15 questions                              │
│                   │ Update state.questions                                │
│                   ▼                                                       │
│ Return state with { program_brief, questions }                            │
│         │                                                                 │
│         ▼                                                                 │
│ Frontend receives StartSessionResponse                                    │
│ Wizard updates state, moves to "questions" step                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 2: SUBMIT ANSWERS                                                    │
│                                                                           │
│ User answers questions                                                    │
│         │                                                                 │
│         ▼                                                                 │
│ QuestionsStep.tsx                                                         │
│         │ onSubmit(answers)                                               │
│         ▼                                                                 │
│ Wizard.tsx::handleAnswersSubmit()                                         │
│         │ api.submitAnswers(sessionId, answers)                           │
│         ▼                                                                 │
│ routes.py::submit_answers()                                               │
│         │ orchestrator.submit_answers(state, answers)                     │
│         ▼                                                                 │
│ orchestrator.py::submit_answers()                                         │
│         │                                                                 │
│         └──→ Retriever.process(state)                                     │
│                   │ Merge brief + answers → final_profile                 │
│                   │ Create search query                                   │
│                   │ Generate embedding (OpenAI)                           │
│                   │ Search Pinecone (or demo templates)                   │
│                   │ Update state.matched_templates                        │
│                   ▼                                                       │
│ Return state with { matched_templates }                                   │
│         │                                                                 │
│         ▼                                                                 │
│ Frontend receives SubmitAnswersResponse                                   │
│ Wizard updates state, moves to "templates" step                           │
└──────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│ STEP 3: FINALIZE LFA                                                      │
│                                                                           │
│ User selects template OR clicks "Generate New"                            │
│         │                                                                 │
│         ▼                                                                 │
│ TemplatesStep.tsx                                                         │
│         │ onSelect(templateId, generateNew)                               │
│         ▼                                                                 │
│ Wizard.tsx::handleTemplateSelect()                                        │
│         │ api.finalize(sessionId, templateId, generateNew)                │
│         ▼                                                                 │
│ routes.py::finalize_lfa()                                                 │
│         │ orchestrator.finalize(state, ...)                               │
│         ▼                                                                 │
│ orchestrator.py::finalize()                                               │
│         │                                                                 │
│         ├──→ LFAGenerator.process(state)                                  │
│         │         │ OpenAI GPT-4o call                                    │
│         │         │ Generate complete LFA structure                       │
│         │         │ Update state.lfa_document                             │
│         │         ▼                                                       │
│         └──→ GraphVisualizer.process(state)                               │
│                   │ Parse LFA JSON                                        │
│                   │ Generate Mermaid syntax                               │
│                   │ Update state.mermaid_code                             │
│                   ▼                                                       │
│ Return state with { lfa_document, mermaid_code, all_visualizations }      │
│         │                                                                 │
│         ▼                                                                 │
│ Frontend receives FinalizeResponse                                        │
│ Wizard updates state, moves to "result" step                              │
│ ResultStep renders LFA + MermaidDiagram                                   │
└──────────────────────────────────────────────────────────────────────────┘
```

### 6.2 State Transitions

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │ User provides input
                           ▼
                    ┌─────────────┐
                    │  INGESTION  │ ← ProfileBuilder runs
                    │             │
                    └──────┬──────┘
                           │ Profile built
                           ▼
                    ┌─────────────┐
                    │   INQUIRY   │ ← Interviewer runs
                    │             │
                    └──────┬──────┘
                           │ Questions generated
                           ▼
                    ┌─────────────┐
                    │  WAITING_   │ ← PAUSE: User answers
                    │ FOR_ANSWERS │
                    └──────┬──────┘
                           │ Answers submitted
                           ▼
                    ┌─────────────┐
                    │  SYNTHESIS  │ ← Retriever runs
                    │             │
                    └──────┬──────┘
                           │ Templates found
                           ▼
                    ┌─────────────┐
                    │  WAITING_   │ ← PAUSE: User selects
                    │FOR_SELECTION│
                    └──────┬──────┘
                           │ Selection made
                           ▼
                    ┌─────────────┐
                    │FINALIZATION │ ← Generator + Visualizer
                    │             │
                    └──────┬──────┘
                           │ LFA complete
                           ▼
                    ┌─────────────┐
                    │  COMPLETED  │
                    └─────────────┘
```

---

## 7. File Structure & Interconnections

### 7.1 Backend File Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ENTRY POINT                                    │
│                                                                          │
│  server.py ─────────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: routes.py                                          │   │
│      ├── imports: postgres.py (init_db)                              │   │
│      └── creates: FastAPI app with CORS                              │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           API LAYER                                      │
│                                                                          │
│  routes.py ─────────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: orchestrator.py (LFAOrchestrator)                  │   │
│      ├── imports: state.py (AgentState, WorkflowPhase)               │   │
│      ├── imports: postgres.py (get_db, SessionStore)                 │   │
│      ├── imports: vector.py (create_vector_store)                    │   │
│      │                                                               │   │
│      ├── defines: Request/Response Pydantic models                   │   │
│      ├── defines: In-memory session cache (_sessions)                │   │
│      └── defines: API endpoints (/start, /answers, /finalize, etc.)  │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        ORCHESTRATION LAYER                               │
│                                                                          │
│  orchestrator.py ───────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: state.py (AgentState, WorkflowPhase, etc.)         │   │
│      ├── imports: All agents from agents/__init__.py                 │   │
│      ├── imports: langgraph (StateGraph, END)                        │   │
│      ├── imports: openai (OpenAI client)                             │   │
│      │                                                               │   │
│      ├── defines: create_workflow() - LangGraph definition           │   │
│      └── defines: LFAOrchestrator class                              │   │
│           ├── start_session() - Phases 1-2                           │   │
│           ├── submit_answers() - Phase 3                             │   │
│           ├── finalize() - Phase 4                                   │   │
│           └── get_all_visualizations()                               │   │
│                                                                       │   │
│  state.py ──────────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── defines: WorkflowPhase (Enum)                               │   │
│      ├── defines: Pydantic models                                    │   │
│      │     ├── ProgramBrief                                          │   │
│      │     ├── Question, Questionnaire                               │   │
│      │     ├── Answer                                                │   │
│      │     ├── MatchedTemplate                                       │   │
│      │     ├── Activity, Output, Outcome                             │   │
│      │     └── LFADocument                                           │   │
│      ├── defines: AgentState (TypedDict)                             │   │
│      └── defines: create_initial_state()                             │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           AGENT LAYER                                    │
│                                                                          │
│  agents/__init__.py ────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      └── exports: ProfileBuilder, Interviewer, Retriever,            │   │
│                   LFAGenerator, GraphVisualizer                      │   │
│                                                                       │   │
│  profile_builder.py ────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: state.py (AgentState, ProgramBrief, WorkflowPhase) │   │
│      ├── imports: openai                                             │   │
│      ├── defines: PROFILE_BUILDER_PROMPT (system prompt)             │   │
│      └── defines: ProfileBuilder.process(state) → state              │   │
│                                                                       │   │
│  interviewer.py ────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: state.py (AgentState, Question, Questionnaire)     │   │
│      ├── imports: openai                                             │   │
│      ├── defines: INTERVIEWER_PROMPT (system prompt)                 │   │
│      └── defines: Interviewer.process(state) → state                 │   │
│                                                                       │   │
│  retriever.py ──────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: state.py (AgentState, MatchedTemplate)             │   │
│      ├── imports: openai (for embeddings)                            │   │
│      ├── uses: vector_store (Pinecone) if available                  │   │
│      ├── defines: _create_search_query()                             │   │
│      ├── defines: _get_embedding()                                   │   │
│      ├── defines: _get_demo_templates() (fallback)                   │   │
│      └── defines: Retriever.process(state) → state                   │   │
│                                                                       │   │
│  generator.py ──────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: state.py (AgentState, LFADocument, etc.)           │   │
│      ├── imports: openai                                             │   │
│      ├── defines: GENERATOR_PROMPT (system prompt)                   │   │
│      ├── defines: _validate_and_fix_structure()                      │   │
│      └── defines: LFAGenerator.process(state) → state                │   │
│                                                                       │   │
│  visualizer.py ─────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: state.py (AgentState, WorkflowPhase)               │   │
│      ├── defines: _sanitize_text()                                   │   │
│      ├── defines: _generate_flowchart()                              │   │
│      ├── defines: _generate_mindmap()                                │   │
│      ├── defines: _generate_lfa_table()                              │   │
│      ├── defines: generate_all_views()                               │   │
│      └── defines: GraphVisualizer.process(state) → state             │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                     │
│                                                                          │
│  postgres.py ───────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: sqlalchemy                                         │   │
│      ├── defines: DATABASE_URL, engine, SessionLocal                 │   │
│      ├── defines: LFASession (SQLAlchemy model)                      │   │
│      ├── defines: LFATemplate (SQLAlchemy model)                     │   │
│      ├── defines: init_db()                                          │   │
│      ├── defines: get_db() (dependency injection)                    │   │
│      ├── defines: SessionStore (CRUD operations)                     │   │
│      └── defines: TemplateStore (CRUD operations)                    │   │
│                                                                       │   │
│  vector.py ─────────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: pinecone                                           │   │
│      ├── defines: VectorStore class                                  │   │
│      │     ├── _initialize() - Create/connect index                  │   │
│      │     ├── is_available() - Check connection                     │   │
│      │     ├── upsert() - Add single vector                          │   │
│      │     ├── upsert_batch() - Batch insert                         │   │
│      │     ├── search() - Semantic search                            │   │
│      │     ├── delete() - Remove vectors                             │   │
│      │     └── get_stats() - Index statistics                        │   │
│      └── defines: create_vector_store() factory                      │   │
│                                                                       │   │
│  seed_templates.json ───────────────────────────────────────────────┐   │
│      │                                                               │   │
│      └── contains: 10 sample LFA templates                           │   │
│           ├── Education (Primary, Digital, Infrastructure)          │   │
│           ├── Health (Community Health)                              │   │
│           ├── Youth (Skills Development)                             │   │
│           ├── Gender (Women's Empowerment)                           │   │
│           ├── Environment (Forest Conservation)                      │   │
│           ├── WASH (Water & Sanitation)                              │   │
│           ├── Nutrition (School Nutrition)                           │   │
│           └── Governance (Local Strengthening)                       │   │
│                                                                       │   │
│  seed_db.py ────────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: postgres.py, vector.py, openai                     │   │
│      ├── defines: load_templates()                                   │   │
│      ├── defines: seed_postgres()                                    │   │
│      ├── defines: seed_pinecone()                                    │   │
│      └── defines: main() - Run all seeding                           │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘
```

### 7.2 Frontend File Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           ENTRY POINTS                                   │
│                                                                          │
│  app/layout.tsx ────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: globals.css                                        │   │
│      ├── imports: Inter font (next/font)                             │   │
│      └── renders: Header + {children} + Footer                       │   │
│                                                                       │   │
│  app/page.tsx ──────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: components/wizard/Wizard                           │   │
│      └── renders: Hero section + Wizard component                    │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        WIZARD COMPONENTS                                 │
│                                                                          │
│  wizard/Wizard.tsx ─────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: lib/api (api client)                               │   │
│      ├── imports: types (WizardState, Answer)                        │   │
│      ├── imports: All step components                                │   │
│      ├── imports: ui/card, ui/spinner (for error display)            │   │
│      │                                                               │   │
│      ├── manages: WizardState (useState)                             │   │
│      │     - currentStep, sessionId, rawInput                        │   │
│      │     - programBrief, questions, answers                        │   │
│      │     - matchedTemplates, lfaDocument, mermaidCode              │   │
│      │     - isLoading, error                                        │   │
│      │                                                               │   │
│      ├── defines: handleInputSubmit() → api.startSession()          │   │
│      ├── defines: handleAnswersSubmit() → api.submitAnswers()       │   │
│      ├── defines: handleTemplateSelect() → api.finalize()           │   │
│      ├── defines: handleReset() → reset state                        │   │
│      │                                                               │   │
│      └── renders: StepIndicator + [CurrentStep]                      │   │
│                                                                       │   │
│  wizard/StepIndicator.tsx ──────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: lib/utils (cn)                                     │   │
│      ├── imports: lucide-react (Check icon)                          │   │
│      ├── imports: types (WizardStep)                                 │   │
│      └── renders: Step circles with labels                           │   │
│                                                                       │   │
│  wizard/InputStep.tsx ──────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: ui/button, ui/textarea, ui/card, ui/spinner        │   │
│      ├── imports: lucide-react (Lightbulb)                           │   │
│      ├── defines: example prompts array                              │   │
│      └── renders: Textarea + example buttons                         │   │
│                                                                       │   │
│  wizard/QuestionsStep.tsx ──────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: ui/button, ui/textarea, ui/card, ui/badge, ui/spinner│  │
│      ├── imports: types (Question, Answer, ProgramBrief)             │   │
│      ├── imports: lucide-react (CheckCircle, Circle, HelpCircle)     │   │
│      ├── manages: answers state, currentIndex                        │   │
│      └── renders: Question navigator + current question form         │   │
│                                                                       │   │
│  wizard/TemplatesStep.tsx ──────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: ui/button, ui/card, ui/badge, ui/spinner           │   │
│      ├── imports: types (MatchedTemplate)                            │   │
│      ├── imports: lucide-react (Check, Sparkles, FileText)           │   │
│      ├── manages: selectedId state                                   │   │
│      └── renders: Template cards + Generate new option               │   │
│                                                                       │   │
│  wizard/ResultStep.tsx ─────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: ui/button, ui/card, ui/badge                       │   │
│      ├── imports: wizard/MermaidDiagram                              │   │
│      ├── imports: types (LFADocument)                                │   │
│      ├── imports: lucide-react (many icons)                          │   │
│      ├── manages: activeTab, diagramType, expandedOutcomes           │   │
│      └── renders: Tabs (diagram/document/code) + content             │   │
│                                                                       │   │
│  wizard/MermaidDiagram.tsx ─────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: mermaid library                                    │   │
│      ├── manages: svg state, error state                             │   │
│      ├── uses: useEffect for mermaid.render()                        │   │
│      └── renders: SVG or error message                               │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         UTILITY LAYER                                    │
│                                                                          │
│  lib/api.ts ────────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: types (all API types)                              │   │
│      ├── defines: API_BASE_URL                                       │   │
│      ├── defines: ApiError class                                     │   │
│      ├── defines: fetchApi<T>() - generic fetch wrapper              │   │
│      └── exports: api object                                         │   │
│           ├── startSession(rawInput) → StartSessionResponse          │   │
│           ├── submitAnswers(sessionId, answers) → SubmitAnswersResponse│  │
│           ├── finalize(sessionId, templateId, generateNew) → FinalizeResponse│
│           ├── getSessionStatus(sessionId) → SessionStatus            │   │
│           ├── getFullSession(sessionId) → FullSession                │   │
│           └── healthCheck() → HealthResponse                         │   │
│                                                                       │   │
│  lib/utils.ts ──────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      ├── imports: clsx, tailwind-merge                               │   │
│      └── exports: cn() - className utility                           │   │
│                                                                       │   │
│  types/index.ts ────────────────────────────────────────────────────┐   │
│      │                                                               │   │
│      └── exports: All TypeScript interfaces                          │   │
│           ├── ProgramBrief, Question, Answer                         │   │
│           ├── MatchedTemplate                                        │   │
│           ├── Activity, Output, Outcome, LFADocument                 │   │
│           ├── StartSessionResponse, SubmitAnswersResponse            │   │
│           ├── FinalizeResponse                                       │   │
│           ├── WizardStep (type union)                                │   │
│           └── WizardState                                            │   │
│                                                                       │   │
└───────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        UI COMPONENTS                                     │
│                                                                          │
│  All ui/ components follow the same pattern:                             │
│      ├── imports: lib/utils (cn)                                        │
│      ├── imports: class-variance-authority (for variants)               │
│      ├── uses: React.forwardRef for ref forwarding                      │
│      └── exports: Component + variants (if applicable)                  │
│                                                                          │
│  ui/button.tsx   → Button, buttonVariants                               │
│  ui/card.tsx     → Card, CardHeader, CardTitle, CardDescription,        │
│                    CardContent, CardFooter                              │
│  ui/textarea.tsx → Textarea                                             │
│  ui/input.tsx    → Input                                                │
│  ui/badge.tsx    → Badge, badgeVariants                                 │
│  ui/progress.tsx → Progress                                             │
│  ui/spinner.tsx  → Spinner                                              │
│                                                                          │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 8. API Reference

### 8.1 Endpoints

#### POST /api/start
Start a new LFA building session.

**Request:**
```json
{
  "raw_input": "We want to improve literacy rates in rural primary schools..."
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "phase": "waiting_for_answers",
  "program_brief": {
    "summary": "...",
    "goal": "...",
    "target_audience": "...",
    "context": "...",
    "challenges": ["...", "..."]
  },
  "questions": [
    {
      "id": "q1",
      "question": "What is the target number of schools?",
      "category": "scope",
      "required": true
    }
  ],
  "message": "Session started. Please answer the questions to continue."
}
```

#### POST /api/answers
Submit answers to clarifying questions.

**Request:**
```json
{
  "session_id": "uuid-string",
  "answers": [
    {"question_id": "q1", "answer": "50 schools"},
    {"question_id": "q2", "answer": "2 years"}
  ]
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "phase": "waiting_for_selection",
  "matched_templates": [
    {
      "id": "tmpl_education_001",
      "title": "Primary Education Quality Improvement",
      "score": 0.92,
      "preview": "Goal: Improve learning outcomes..."
    }
  ],
  "message": "Templates found. Select one or generate a new LFA."
}
```

#### POST /api/finalize
Generate the final LFA document.

**Request:**
```json
{
  "session_id": "uuid-string",
  "selected_template_id": "tmpl_education_001",  // or null
  "generate_new": false  // or true
}
```

**Response:**
```json
{
  "session_id": "uuid-string",
  "phase": "completed",
  "lfa_document": {
    "title": "...",
    "goal": "...",
    "goal_indicators": ["..."],
    "assumptions": ["..."],
    "outcomes": [
      {
        "id": "OC1",
        "description": "...",
        "indicators": ["..."],
        "means_of_verification": ["..."],
        "outputs": [
          {
            "id": "OP1.1",
            "description": "...",
            "activities": [...]
          }
        ]
      }
    ]
  },
  "mermaid_code": "flowchart TD\n...",
  "all_visualizations": {
    "flowchart": "...",
    "mindmap": "...",
    "journey": "..."
  },
  "message": "LFA document generated successfully!"
}
```

---

## 9. State Management

### 9.1 Backend State (AgentState)

```python
class AgentState(TypedDict, total=False):
    # Session
    session_id: str
    phase: str  # WorkflowPhase enum value

    # Phase 1: Ingestion
    raw_input: str
    program_brief: Optional[Dict[str, Any]]

    # Phase 2: Inquiry
    questions: Optional[List[Dict[str, Any]]]

    # Phase 3: Synthesis
    answers: Optional[List[Dict[str, Any]]]
    final_profile: Optional[Dict[str, Any]]
    matched_templates: Optional[List[Dict[str, Any]]]

    # Phase 4: Finalization
    selected_template_id: Optional[str]
    generate_new: bool
    lfa_document: Optional[Dict[str, Any]]
    mermaid_code: Optional[str]

    # Metadata
    error: Optional[str]
    messages: List[str]
```

### 9.2 Frontend State (WizardState)

```typescript
interface WizardState {
  currentStep: WizardStep;  // "input" | "questions" | "templates" | "result"
  sessionId: string | null;
  rawInput: string;
  programBrief: ProgramBrief | null;
  questions: Question[];
  answers: Answer[];
  matchedTemplates: MatchedTemplate[];
  selectedTemplateId: string | null;
  generateNew: boolean;
  lfaDocument: LFADocument | null;
  mermaidCode: string;
  allVisualizations: {...} | null;
  isLoading: boolean;
  error: string | null;
}
```

---

## 10. Agent Details

### 10.1 ProfileBuilder

**Purpose:** Transform unstructured text into a structured program brief.

**Input:** `raw_input` (string)
**Output:** `program_brief` (ProgramBrief)

**Process:**
1. Receive raw user input
2. Send to GPT-4o with PROFILE_BUILDER_PROMPT
3. Request JSON response format
4. Parse and validate with Pydantic
5. Update state with program_brief

**Prompt Strategy:**
- Role: "Expert program analyst for educational initiatives"
- Task: Extract goal, summary, target audience, context, challenges
- Format: Strict JSON output

### 10.2 Interviewer

**Purpose:** Identify gaps and generate clarifying questions.

**Input:** `program_brief` (ProgramBrief)
**Output:** `questions` (List[Question])

**Process:**
1. Receive program brief
2. Analyze for gaps in LFA requirements
3. Generate 10-15 targeted questions
4. Categorize by: scope, resources, timeline, measurement, risks, stakeholders, sustainability
5. Mark required vs optional

**Prompt Strategy:**
- Role: "Expert program evaluator and critical analyst"
- Task: Find gaps needed for complete LFA
- Categories: 7 distinct categories for comprehensive coverage

### 10.3 Retriever

**Purpose:** Find matching LFA templates using semantic search.

**Input:** `program_brief`, `answers`
**Output:** `matched_templates` (List[MatchedTemplate])

**Process:**
1. Merge brief + answers into final_profile
2. Create search query from profile
3. Generate embedding via OpenAI
4. Search Pinecone for similar templates
5. Return top 5 matches with scores

**Fallback:** Demo templates if Pinecone not configured

### 10.4 LFAGenerator

**Purpose:** Create complete LFA documents from scratch.

**Input:** `final_profile`
**Output:** `lfa_document` (LFADocument)

**Process:**
1. Receive final profile (brief + answers)
2. Send to GPT-4o with GENERATOR_PROMPT
3. Request complete LFA structure
4. Validate and fix structure
5. Ensure all required fields present

**Output Structure:**
```
LFADocument
├── title
├── goal
├── goal_indicators[]
├── assumptions[]
└── outcomes[]
    ├── id, description, indicators[], means_of_verification[]
    └── outputs[]
        ├── id, description, indicators[], means_of_verification[]
        └── activities[]
            ├── id, description, indicators[], means_of_verification[]
```

### 10.5 GraphVisualizer

**Purpose:** Convert LFA JSON to Mermaid diagrams.

**Input:** `lfa_document` (LFADocument)
**Output:** `mermaid_code` (string)

**Process:**
1. Parse LFA document
2. Sanitize text for Mermaid compatibility
3. Generate diagram syntax
4. Apply styling (colors per level)

**Diagram Types:**
- **Flowchart:** Hierarchical top-down view
- **Mindmap:** Radial expansion view
- **Journey:** Timeline/section view

---

## 11. Database Schema

### 11.1 PostgreSQL Tables

#### lfa_sessions
```sql
CREATE TABLE lfa_sessions (
    id VARCHAR(36) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    phase VARCHAR(50) DEFAULT 'ingestion',
    raw_input TEXT,
    program_brief JSON,
    questions JSON,
    answers JSON,
    final_profile JSON,
    matched_templates JSON,
    selected_template_id VARCHAR(100),
    lfa_document JSON,
    mermaid_code TEXT,
    error TEXT
);
```

#### lfa_templates
```sql
CREATE TABLE lfa_templates (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    tags JSON,
    content JSON,
    preview TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 11.2 Pinecone Index

**Index Name:** `lfa-templates`
**Dimension:** 1536 (text-embedding-3-small)
**Metric:** Cosine similarity

**Vector Metadata:**
```json
{
  "title": "Template Title",
  "description": "Template description",
  "category": "education",
  "tags": ["tag1", "tag2"],
  "preview": "Short preview text"
}
```

---

## 12. Deployment Guide

### 12.1 Environment Variables

**Backend (.env):**
```bash
# Required
OPENAI_API_KEY=sk-...

# Optional - defaults to SQLite
DATABASE_URL=postgresql://user:pass@host:5432/lfa_builder

# Optional - enables semantic search
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=lfa-templates

# Server config
HOST=0.0.0.0
PORT=8000
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 12.2 Local Development

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.api.server:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

### 12.3 Production Deployment

**Backend Options:**
- Docker container
- AWS Lambda + API Gateway
- Google Cloud Run
- Railway / Render

**Frontend Options:**
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial release with full MAS architecture |

---

*Documentation generated for LFA Builder Platform v1.0*
*Shikshagraha Foundation*
