# Implementation Plan: Shikshagraha LFA Builder Platform

## 1. Project Overview
Shikshagraha works to transform public schools in India. The **LFA Builder Platform** is a Multi-Agent System (MAS) designed to assist organizations in creating Logical Framework Approach (LFA) documents. It uses a parallel agent architecture where specialized AI agents handle profiling, interviewing, retrieval, generation, and visualization, synchronized by a central State Machine.

## 2. Technology Stack
*   **Frontend:** Next.js 14, Tailwind, Shadcn/UI, React-Mermaid2.
*   **Backend:** FastAPI (Python 3.10+).
*   **Orchestration:** **LangGraph** (State Machine).
*   **AI:** OpenAI GPT-4o.
*   **Data:** PostgreSQL (State/Templates), Pinecone (Vector Search).

---

## 3. Multi-Agent System Architecture

The backend is divided into 5 specialized "Worker Agents" and 1 "Orchestrator".

### A. The Orchestrator (The Manager)
*   **Role:** Manages the entire session lifecycle. It holds the "Global State" (User Input, Answers, Selected Template).
*   **Logic:** A Finite State Machine (FSM) defined in LangGraph.
*   **File:** `backend/app/graph/orchestrator.py`
*   **Sync Mechanism:** It passes a shared `AgentState` TypedDict to workers.

### B. Worker Agents (The Specialists)

#### 1. ProfileBuilderAgent
*   **Role:** First responder. Takes raw brain dumps and structures them into a queryable profile.
*   **Input:** Raw Text (from User).
*   **Output:** `ProgramBrief` (Summary, Goal, Target Audience).
*   **File:** `backend/app/agents/profile_builder.py`

#### 2. InterviewerAgent
*   **Role:** The Critic. Looks for gaps in the `ProgramBrief`.
*   **Task:** Generates a list of 10-15 edge-case questions.
*   **Input:** `ProgramBrief`.
*   **Output:** `Questionnaire` (JSON List).
*   **File:** `backend/app/agents/interviewer.py`

#### 3. RetrievalAgent (The "Librarian")
*   **Role:** Semantic Searcher.
*   **Task:** Converts the "Final Profile" (Brief + Answers) into a Vector Query. Searches Pinecone.
*   **Input:** `FinalProfile`.
*   **Output:** `List[MatchedTemplate]` (IDs + Similarity Scores).
*   **File:** `backend/app/agents/retriever.py`

#### 4. GeneratorAgent (The "Creator")
*   **Role:** Fallback Architect.
*   **Task:** If no templates match, it writes a brand new LFA from scratch using the Profile.
*   **Input:** `FinalProfile`.
*   **Output:** `LFA_JSON` (Goal -> Outcomes -> Outputs -> Activities).
*   **File:** `backend/app/agents/generator.py`

#### 5. VisualizerAgent (The "Artist")
*   **Role:** Translator.
*   **Task:** Converts `LFA_JSON` into a Mermaid.js syntax string.
*   **Input:** `LFA_JSON`.
*   **Output:** `MermaidCode` (String).
*   **File:** `backend/app/agents/visualizer.py`

#### 6. ExporterAgent (The "Scribe")
*   **Role:** Document Generator.
*   **Task:** Converts `LFA_JSON` into downloadable .docx and .csv files.
*   **Input:** `LFA_JSON`.
*   **Output:** `FilePaths` (doc, csv).
*   **File:** `backend/app/agents/exporter.py`

---

## 4. File Structure & Responsibilities

```text
/backend
  /app
    /agents                 # The Worker Agents
      __init__.py
      profile_builder.py    # Class ProfileBuilder
      interviewer.py        # Class Interviewer
      retriever.py          # Class Retriever
      generator.py          # Class LFAGenerator
      visualizer.py         # Class GraphVisualizer
    /graph                  # The Orchestration
      __init__.py
      orchestrator.py       # LangGraph definitions (Nodes & Edges)
      state.py              # Shared State definitions (Pydantic)
    /api                    # FastAPI Routes
      server.py             # Main entry point
      routes.py             # Endpoints (connect Frontend to Graph)
    /db                     # Database Access
      postgres.py           # SQLAlchemy/Supabase connection
      vector.py             # Pinecone connection
    /data                   # Seed Data
      seed_templates.json   # The 100+ Master Templates
```

---

## 5. Synchronization & Data Flow (The "Sync Plan")

The **Orchestrator** ensures agents don't step on each other.

1.  **Phase 1: Ingestion**
    *   Frontend sends text to `/api/start`.
    *   Orchestrator triggers `ProfileBuilder`.
    *   *Sync Point:* Wait for Summary. Save to DB.

2.  **Phase 2: Inquiry**
    *   Orchestrator passes Summary to `Interviewer`.
    *   Interviewer returns JSON.
    *   *Sync Point:* Frontend polls status, gets Questions. **PAUSE** (Wait for User IO).

3.  **Phase 3: Synthesis & Search**
    *   User submits Answers.
    *   Orchestrator merges (Summary + Answers) -> `FinalProfile`.
    *   Orchestrator triggers `RetrievalAgent`.
    *   *Sync Point:* Return Matches to Frontend. **PAUSE** (Wait for Selection).

4.  **Phase 4: Finalization**
    *   **Branch A:** User selects Template -> Fetch full content.
    *   **Branch B:** User rejects -> Trigger `GeneratorAgent`.
    *   *Final Sync:* Orchestrator sends logic to `VisualizerAgent`.
    *   *Export:* User requests download -> `ExporterAgent` generates files.
    *   Orchestrator saves final artifact to DB.

---

## 6. Implementation Checklist

### Step 1: The "Skeleton" (Shared State)
*   [ ] Define `AgentState` in `backend/app/graph/state.py`.
    *   Must contain keys: `input`, `summary`, `questions`, `answers`, `matches`, `final_product`.

### Step 2: The Workers (Independent Modules)
*   [ ] Build `profile_builder.py` (Prompt Engineering).
*   [ ] Build `interviewer.py` (JSON Output Parser).
*   [ ] Build `seed_db.py` (Ingest `seed_templates.json` to Pinecone).
*   [ ] Build `retriever.py` (Pinecone Query Logic).

### Step 3: The Manager (LangGraph)
*   [ ] Wire the nodes in `orchestrator.py`.
*   [ ] Define the Conditional Edge: `if matches_found -> End else -> Generator`.

### Step 4: The Interface (Next.js)
*   [ ] Build `Wizard.tsx` (consumes the Orchestrator's step-by-step output).
*   [ ] Build `ManualGrid.tsx` (Editable Table for Feature Parity).
*   [ ] Implement `Export` buttons (DOCX/CSV).

