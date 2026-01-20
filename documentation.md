# AlgoPath LFA Builder - Comprehensive Technical Documentation

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [System Architecture](#3-system-architecture)
4. [High-Level Design (HLD)](#4-high-level-design-hld)
5. [Low-Level Design (LLD)](#5-low-level-design-lld)
6. [Logic Flow & Data Flow](#6-logic-flow--data-flow)
7. [Backend Architecture](#7-backend-architecture)
8. [Multi-Agent System](#8-multi-agent-system)
9. [API Documentation](#9-api-documentation)
10. [Database Schema](#10-database-schema)
11. [Frontend Architecture](#11-frontend-architecture)
12. [Shikshagraha Integration](#12-shikshagraha-integration)
13. [Dependencies & Libraries](#13-dependencies--libraries)
14. [Configuration](#14-configuration)
15. [Deployment Guide](#15-deployment-guide)

---

## 1. Executive Summary

**AlgoPath LFA Builder** is an AI-powered platform designed to transform program design in India's education ecosystem. It enables NGOs/CSOs working with Shikshagraha's network of 150+ organizations to create Logical Framework Approach (LFA) documents through an intelligent, guided process.

### Key Capabilities

- **AI-Powered Generation**: Transforms raw program descriptions into structured LFA documents
- **Shikshagraha-Aligned**: Specifically designed for India's education system hierarchy
- **Multi-Agent Architecture**: 7 specialized AI agents working in orchestrated workflow
- **Advanced Analysis Tools**: Stakeholder simulation, logic challenging, scenario analysis
- **Export Ready**: Generate professional Word documents and spreadsheets

### Technology Stack

```
Backend:  Python 3.x | FastAPI | LangGraph | OpenAI GPT-4o | SQLAlchemy
Frontend: Next.js 14 | React 18 | TypeScript | Tailwind CSS | Mermaid.js
Database: PostgreSQL (production) | SQLite (development)
```

---

## 2. Problem Statement

### The Challenge

Many organizations working in public education struggle to design clear programs before starting or scaling their work. The current process is:

- **Time-consuming**: Requires multiple one-on-one conversations and reviews
- **Expert-dependent**: Needs external consultants or design agencies
- **Expensive**: Organizations spend large amounts just for basic frameworks
- **Inconsistent**: Quality varies significantly across organizations

### What Organizations Need

A simple, guided way to think through these core questions:

1. What is the core problem we're trying to solve?
2. What change do we want to see at the student level?
3. How will we know this change is happening?
4. What intervention will create this change?
5. Who are the key stakeholders needed?
6. What practice changes are expected from each stakeholder?
7. How will these changes be tracked?

### The Solution

AlgoPath LFA Builder provides a structured, AI-assisted approach that:

- Reduces program design effort by ~60%
- Makes design a widely available skill
- Enables organizations to arrive at clear starting points independently
- Produces review-ready logical frameworks suitable for funders and partners

---

## 3. System Architecture

### 3.1 Architecture Overview Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Next.js Web Application]
        WZ[Wizard Component]
        VZ[Visualizations]
    end

    subgraph "API Layer"
        API[FastAPI Server]
        CORS[CORS Middleware]
        VAL[Request Validation]
    end

    subgraph "Orchestration Layer"
        ORCH[LangGraph Orchestrator]
        SM[Session Manager]
    end

    subgraph "Agent Layer"
        PB[ProfileBuilder Agent]
        INT[Interviewer Agent]
        GEN[LFAGenerator Agent]
        VIS[Visualizer Agent]
        SS[StakeholderSimulator]
        LC[LogicChallenger]
        SA[ScenarioAnalyzer]
        EXP[Exporter Agent]
    end

    subgraph "External Services"
        OAI[OpenAI GPT-4o API]
    end

    subgraph "Data Layer"
        MEM[In-Memory Session Store]
        DB[(PostgreSQL/SQLite)]
    end

    UI --> API
    API --> CORS --> VAL
    VAL --> ORCH
    ORCH --> SM
    ORCH --> PB & INT & GEN & VIS
    ORCH --> SS & LC & SA & EXP

    PB & INT & GEN --> OAI
    SS & LC & SA --> OAI

    SM --> MEM
    SM --> DB

    GEN --> VIS
    VIS --> VZ
```

### 3.2 Component Interaction Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as FastAPI
    participant O as Orchestrator
    participant PB as ProfileBuilder
    participant I as Interviewer
    participant G as Generator
    participant V as Visualizer
    participant AI as OpenAI
    participant DB as Database

    U->>F: Enter program description
    F->>A: POST /api/start
    A->>O: start_session()
    O->>PB: process(state)
    PB->>AI: Generate program brief
    AI-->>PB: Structured brief
    PB-->>O: Updated state
    O->>I: process(state)
    I->>AI: Generate questions
    AI-->>I: 10-15 questions
    I-->>O: Updated state
    O->>DB: Save session
    O-->>A: State with questions
    A-->>F: Questions response
    F-->>U: Display questions

    U->>F: Submit answers
    F->>A: POST /api/answers
    A->>O: submit_answers_and_generate()
    O->>G: process(state)
    G->>AI: Generate LFA
    AI-->>G: Complete LFA
    G-->>O: Updated state
    O->>V: process(state)
    V-->>O: Mermaid diagrams
    O->>DB: Save final state
    O-->>A: Complete LFA
    A-->>F: LFA + visualizations
    F-->>U: Display results
```

---

## 4. High-Level Design (HLD)

### 4.1 System Components

```mermaid
graph LR
    subgraph "Presentation Tier"
        A[Web Browser]
        B[Next.js App]
    end

    subgraph "Application Tier"
        C[FastAPI Server]
        D[LangGraph Engine]
        E[Agent Pool]
    end

    subgraph "Data Tier"
        F[Session Store]
        G[Database]
    end

    subgraph "External Tier"
        H[OpenAI API]
    end

    A --> B
    B --> C
    C --> D
    D --> E
    E --> H
    C --> F
    F --> G
```

### 4.2 Core Modules

| Module | Responsibility | Key Technologies |
|--------|---------------|------------------|
| **Web Frontend** | User interface, form handling, visualization | Next.js, React, TypeScript, Mermaid.js |
| **API Server** | Request handling, validation, routing | FastAPI, Pydantic, CORS |
| **Orchestrator** | Workflow management, agent coordination | LangGraph, StateGraph |
| **Agent System** | AI-powered content generation | OpenAI GPT-4o, Custom prompts |
| **Session Manager** | State persistence, TTL management | In-memory store, SQLAlchemy |
| **Database** | Persistent storage | PostgreSQL/SQLite |

### 4.3 User Journey Flow

```mermaid
journey
    title LFA Building Journey
    section Input Phase
      Enter program description: 5: User
      Review extracted brief: 4: System
    section Questions Phase
      Answer clarifying questions: 4: User
      Navigate between questions: 3: User
      See stakeholder context: 4: System
    section Results Phase
      View generated LFA: 5: System
      Explore visualizations: 4: User
      Export documents: 5: User
    section Analysis Phase
      Interview stakeholders: 4: User
      Challenge logic: 4: System
      Run scenarios: 4: User
```

### 4.4 High-Level Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER INPUT                                     │
│  "We want to improve literacy through teacher training in rural UP..."   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASE 1: INGESTION                                 │
│  ProfileBuilder Agent extracts:                                          │
│  • Summary: "Teacher training program for FLN improvement"               │
│  • Goal: "Improve Grade 1-3 literacy outcomes"                          │
│  • Theme: FLN (Foundational Literacy & Numeracy)                        │
│  • System Level: School + Cluster                                        │
│  • Stakeholders: Teachers, HM, CRP                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASE 2: INQUIRY                                   │
│  Interviewer Agent generates questions:                                  │
│  Q1: "What specific literacy skills should students demonstrate?"        │
│  Q2: "How should teachers modify their classroom practice?"              │
│  Q3: "What support will CRPs provide to teachers?"                       │
│  Q4: "How will progress be measured?"                                    │
│  ... (10-15 questions total)                                             │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       USER ANSWERS                                       │
│  A1: "Students should read 30 words/minute with comprehension"          │
│  A2: "Teachers should use activity-based pedagogy daily"                │
│  A3: "CRPs will conduct 2 visits/month per school"                      │
│  A4: "ASER-style assessments quarterly"                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       PHASE 3: FINALIZATION                              │
│  LFAGenerator creates complete framework:                                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ GOAL: 80% Grade 1-3 students achieve grade-level literacy         │  │
│  │ INDICATORS: Reading fluency, comprehension scores                  │  │
│  │ OUTCOMES:                                                          │  │
│  │   └─ OC1: Teachers practice activity-based pedagogy               │  │
│  │       └─ OP1.1: Teachers trained on FLN methodology               │  │
│  │           └─ A1.1.1: Conduct 5-day training workshop              │  │
│  │           └─ A1.1.2: Provide TLM kits to each teacher             │  │
│  │       └─ OP1.2: CRPs provide regular mentoring                    │  │
│  │           └─ A1.2.1: CRP school visits (2/month)                  │  │
│  │           └─ A1.2.2: Demo lessons by CRPs                         │  │
│  │ ASSUMPTIONS: Teacher attendance, TLM availability, CRP capacity   │  │
│  │ STAKEHOLDER PRACTICE CHANGES:                                      │  │
│  │   • Teachers: Use activity-based methods, track student progress  │  │
│  │   • HMs: Monitor classroom practices, support teachers            │  │
│  │   • CRPs: Shift from inspection to mentoring                      │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Visualizer creates Mermaid diagrams:                                    │
│  • Flowchart: Goal → Outcomes → Outputs → Activities                    │
│  • Mindmap: Hierarchical tree view                                       │
│  • Journey: Implementation pathway                                       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Low-Level Design (LLD)

### 5.1 Class Diagram

```mermaid
classDiagram
    class BaseAgent {
        <<abstract>>
        -client: OpenAI
        -model: str
        -temperature: float
        -timeout: float
        -max_retries: int
        +_call_openai(messages, temperature, json_response)
        +_clean_json_response(content)
        +process(state)*
        +aprocess(state)
    }

    class ProfileBuilder {
        +process(state): AgentState
        -_extract_brief(raw_input): ProgramBrief
    }

    class Interviewer {
        +process(state): AgentState
        -_generate_questions(brief): List~Question~
    }

    class LFAGenerator {
        +process(state): AgentState
        -_validate_and_fix_structure(data): dict
        -_generate_lfa(profile): LFADocument
    }

    class GraphVisualizer {
        +process(state): AgentState
        +generate_all_views(lfa): dict
        -_generate_flowchart(lfa): str
        -_generate_mindmap(lfa): str
        -_generate_journey(lfa): str
        -_sanitize_text(text, max_length): str
    }

    class StakeholderSimulator {
        -stakeholders: dict
        +get_available_stakeholders(): List
        +simulate_interview(stakeholder_id, lfa, history): Feedback
        +get_all_stakeholder_feedback(lfa, ids): AggregatedFeedback
    }

    class LogicChallenger {
        +analyze_lfa(lfa_document): LogicAnalysis
    }

    class QuickValidator {
        +validate(lfa_document): QuickValidation
    }

    class ScenarioAnalyzer {
        -scenario_templates: List
        +get_scenario_templates(): List
        +analyze_scenario(lfa, description, type, params): ScenarioAnalysis
        +compare_scenarios(lfa, scenarios): List
    }

    class Exporter {
        +export_to_csv(lfa, metadata): str
        +export_to_docx(lfa, metadata): str
    }

    BaseAgent <|-- ProfileBuilder
    BaseAgent <|-- Interviewer
    BaseAgent <|-- LFAGenerator
    BaseAgent <|-- StakeholderSimulator
    BaseAgent <|-- LogicChallenger
    BaseAgent <|-- QuickValidator
    BaseAgent <|-- ScenarioAnalyzer

    class LFAOrchestrator {
        -client: OpenAI
        -workflow: StateGraph
        -generator: LFAGenerator
        -visualizer: GraphVisualizer
        +start_session(session_id, raw_input): AgentState
        +submit_answers_and_generate(state, answers): AgentState
        +get_all_visualizations(state): dict
    }

    LFAOrchestrator --> ProfileBuilder
    LFAOrchestrator --> Interviewer
    LFAOrchestrator --> LFAGenerator
    LFAOrchestrator --> GraphVisualizer
```

### 5.2 State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> INGESTION: start_session()

    INGESTION --> INQUIRY: ProfileBuilder completes
    INGESTION --> ERROR: ProfileBuilder fails

    INQUIRY --> WAITING_FOR_ANSWERS: Interviewer completes
    INQUIRY --> ERROR: Interviewer fails

    WAITING_FOR_ANSWERS --> FINALIZATION: submit_answers()

    FINALIZATION --> COMPLETED: LFA generated successfully
    FINALIZATION --> ERROR: Generation fails

    ERROR --> [*]: Return error to user
    COMPLETED --> [*]: Return LFA to user

    note right of INGESTION
        ProfileBuilder processes
        raw input into brief
    end note

    note right of INQUIRY
        Interviewer generates
        10-15 questions
    end note

    note right of FINALIZATION
        Generator creates LFA
        Visualizer creates diagrams
    end note
```

### 5.3 Database Entity Relationship

```mermaid
erDiagram
    LFA_SESSION {
        string id PK "UUID (36 chars)"
        datetime created_at "Creation timestamp"
        datetime updated_at "Last update"
        string phase "Workflow phase"
        text raw_input "Program description"
        json program_brief "Structured brief"
        json questions "Generated questions"
        json answers "User answers"
        json final_profile "Brief + answers merged"
        json lfa_document "Complete LFA"
        text mermaid_code "Visualization code"
        text error "Error message"
    }
```

### 5.4 AgentState Type Definition

```python
class AgentState(TypedDict, total=False):
    """Global state shared across all agents"""

    # Session info
    session_id: str                           # UUID
    phase: str                                # WorkflowPhase enum value

    # Phase 1: Ingestion
    raw_input: str                            # User's program description
    program_brief: Optional[Dict[str, Any]]   # Structured brief

    # Phase 2: Inquiry
    questions: Optional[List[Dict[str, Any]]] # Generated questions

    # Phase 3: Finalization
    answers: Optional[List[Dict[str, Any]]]   # User's answers
    final_profile: Optional[Dict[str, Any]]   # Merged brief + answers
    lfa_document: Optional[Dict[str, Any]]    # Complete LFA
    mermaid_code: Optional[str]               # Visualization

    # Metadata
    error: Optional[str]                      # Error message
    messages: List[str]                       # Log messages
```

---

## 6. Logic Flow & Data Flow

### 6.1 Complete Request Flow

```mermaid
flowchart TD
    subgraph "Step 1: Session Start"
        A1[User enters description] --> A2[POST /api/start]
        A2 --> A3{Validate input}
        A3 -->|Valid| A4[Create session UUID]
        A3 -->|Invalid| A5[Return 400 error]
        A4 --> A6[Initialize AgentState]
        A6 --> A7[Run ProfileBuilder]
        A7 --> A8[Run Interviewer]
        A8 --> A9[Save to memory + DB]
        A9 --> A10[Return questions]
    end

    subgraph "Step 2: Answer Submission"
        B1[User submits answers] --> B2[POST /api/answers]
        B2 --> B3{Session exists?}
        B3 -->|No| B4[Check database]
        B4 -->|Found| B5[Restore session]
        B4 -->|Not found| B6[Return 404 error]
        B3 -->|Yes| B5
        B5 --> B7{All required answered?}
        B7 -->|No| B8[Return 400 error]
        B7 -->|Yes| B9[Merge answers with brief]
        B9 --> B10[Run LFAGenerator]
        B10 --> B11[Run Visualizer]
        B11 --> B12[Save final state]
        B12 --> B13[Return LFA + visualizations]
    end

    subgraph "Step 3: Advanced Analysis"
        C1[User requests analysis]
        C1 --> C2{Analysis type}
        C2 -->|Stakeholder| C3[StakeholderSimulator]
        C2 -->|Logic| C4[LogicChallenger]
        C2 -->|Scenario| C5[ScenarioAnalyzer]
        C3 --> C6[Return feedback]
        C4 --> C6
        C5 --> C6
    end

    A10 --> B1
    B13 --> C1
```

### 6.2 Agent Processing Pipeline

```mermaid
flowchart LR
    subgraph "ProfileBuilder"
        PB1[Receive raw_input]
        PB2[Call OpenAI with extraction prompt]
        PB3[Parse JSON response]
        PB4[Update state.program_brief]
        PB1 --> PB2 --> PB3 --> PB4
    end

    subgraph "Interviewer"
        I1[Receive program_brief]
        I2[Analyze gaps & needs]
        I3[Generate 10-15 questions]
        I4[Categorize by stakeholder level]
        I5[Update state.questions]
        I1 --> I2 --> I3 --> I4 --> I5
    end

    subgraph "LFAGenerator"
        G1[Receive final_profile]
        G2[Build comprehensive prompt]
        G3[Generate complete LFA structure]
        G4[Validate & fix hierarchy]
        G5[Update state.lfa_document]
        G1 --> G2 --> G3 --> G4 --> G5
    end

    subgraph "Visualizer"
        V1[Receive lfa_document]
        V2[Generate flowchart Mermaid]
        V3[Generate mindmap Mermaid]
        V4[Generate journey Mermaid]
        V5[Update state.mermaid_code]
        V1 --> V2 --> V3 --> V4 --> V5
    end

    PB4 --> I1
    I5 -->|User answers| G1
    G5 --> V1
```

### 6.3 Error Handling Flow

```mermaid
flowchart TD
    A[API Request] --> B{Try processing}
    B -->|Success| C[Return result]
    B -->|Error| D{Error type}

    D -->|AuthenticationError| E[Return 500 - API key issue]
    D -->|RateLimitError| F{Retries left?}
    F -->|Yes| G[Exponential backoff]
    G --> B
    F -->|No| H[Return 429 - Rate limited]

    D -->|TimeoutError| I{Retries left?}
    I -->|Yes| J[Retry immediately]
    J --> B
    I -->|No| K[Return 500 - Timeout]

    D -->|ValidationError| L[Return 400 - Bad input]
    D -->|SessionNotFound| M[Return 404 - Session expired]
    D -->|Unexpected| N[Log & Return 500]
```

---

## 7. Backend Architecture

### 7.1 Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── server.py          # FastAPI app setup, CORS, lifespan
│   │   ├── routes.py          # Core API endpoints
│   │   └── export_routes.py   # Export functionality
│   ├── agents/
│   │   ├── __init__.py        # Agent exports
│   │   ├── base.py            # BaseAgent abstract class
│   │   ├── profile_builder.py # Phase 1 agent
│   │   ├── interviewer.py     # Phase 2 agent
│   │   ├── generator.py       # Phase 3 LFA generation
│   │   ├── visualizer.py      # Mermaid diagram generation
│   │   ├── exporter.py        # CSV/DOCX export
│   │   ├── stakeholder_simulator.py  # Interview Your LFA
│   │   ├── logic_challenger.py       # AI Devil's Advocate
│   │   └── scenario_analyzer.py      # What-If Engine
│   ├── graph/
│   │   ├── __init__.py
│   │   ├── state.py           # AgentState, enums, models
│   │   └── orchestrator.py    # LangGraph workflow
│   ├── db/
│   │   ├── __init__.py
│   │   └── postgres.py        # SQLAlchemy models, SessionStore
│   └── data/
│       └── seed_db.py         # Database initialization
├── requirements.txt
└── .env
```

### 7.2 Server Configuration (`server.py`)

```python
# Key configurations
ALLOWED_ORIGINS = [
    "http://localhost:3000",    # Development
    "http://localhost:3001",    # Alternative dev port
    os.getenv("FRONTEND_URL")   # Production URL
]

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lifespan management
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("Application shutting down")
```

### 7.3 Request Validation Models

```python
class StartSessionRequest(BaseModel):
    """Request to start a new LFA building session"""
    raw_input: str = Field(
        ...,
        min_length=10,
        max_length=10000,
        description="Program description (10-10000 characters)"
    )

    @field_validator('raw_input')
    @classmethod
    def validate_raw_input(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Program description cannot be empty")
        return v.strip()


class SubmitAnswersRequest(BaseModel):
    """Request to submit answers to clarifying questions"""
    session_id: str = Field(..., min_length=36, max_length=36)
    answers: List[AnswerItem] = Field(..., min_length=1)

    @field_validator('session_id')
    @classmethod
    def validate_session_id(cls, v: str) -> str:
        try:
            uuid.UUID(v)
        except ValueError:
            raise ValueError("Invalid session ID format")
        return v
```

### 7.4 Session Management

```python
class SessionManager:
    """Thread-safe session manager with TTL support"""

    def __init__(self):
        self._sessions: Dict[str, SessionEntry] = {}
        self._lock = threading.RLock()

    def get(self, session_id: str) -> Optional[AgentState]:
        """Get session state, checking TTL"""
        with self._lock:
            entry = self._sessions.get(session_id)
            if entry:
                if entry.is_expired():
                    del self._sessions[session_id]
                    return None
                entry.touch()
                return entry.state
            return None

    def set(self, session_id: str, state: AgentState):
        """Store or update session state"""
        with self._lock:
            if session_id in self._sessions:
                self._sessions[session_id].state = state
                self._sessions[session_id].touch()
            else:
                self._sessions[session_id] = SessionEntry(state)


class SessionEntry:
    """Session entry with timestamp for TTL"""

    def __init__(self, state: AgentState):
        self.state = state
        self.created_at = datetime.utcnow()
        self.last_accessed = datetime.utcnow()

    def is_expired(self, ttl_hours: int = 24) -> bool:
        return datetime.utcnow() - self.last_accessed > timedelta(hours=ttl_hours)
```

---

## 8. Multi-Agent System

### 8.1 Agent Architecture Overview

```mermaid
graph TB
    subgraph "BaseAgent Foundation"
        BA[BaseAgent ABC]
        BA --> |provides| OAI[OpenAI API calls]
        BA --> |provides| RET[Retry logic]
        BA --> |provides| ERR[Error handling]
        BA --> |provides| JSON[JSON cleaning]
    end

    subgraph "Core Workflow Agents"
        PB[ProfileBuilder]
        INT[Interviewer]
        GEN[LFAGenerator]
        VIS[GraphVisualizer]
    end

    subgraph "Advanced Analysis Agents"
        SS[StakeholderSimulator]
        LC[LogicChallenger]
        SA[ScenarioAnalyzer]
        EXP[Exporter]
    end

    BA --> PB & INT & GEN
    BA --> SS & LC & SA
```

### 8.2 BaseAgent Implementation

```python
class BaseAgent(ABC):
    """Abstract base class for all LFA agents"""

    def __init__(self, client: OpenAI):
        self.client = client
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.4"))
        self.timeout = float(os.getenv("LLM_TIMEOUT", "90"))
        self.max_retries = int(os.getenv("LLM_MAX_RETRIES", "2"))

    def _call_openai(
        self,
        messages: List[Dict[str, str]],
        temperature: float = None,
        json_response: bool = True
    ) -> str:
        """Make OpenAI API call with retry logic"""
        retries = 0
        while retries <= self.max_retries:
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature or self.temperature,
                    timeout=self.timeout,
                    response_format={"type": "json_object"} if json_response else None
                )
                return response.choices[0].message.content

            except RateLimitError as e:
                if retries < self.max_retries:
                    retries += 1
                    time.sleep(2 ** retries)  # Exponential backoff
                    continue
                raise AgentAPIError(str(e), retryable=True)

            except (APITimeoutError, APIConnectionError) as e:
                if retries < self.max_retries:
                    retries += 1
                    time.sleep(1)
                    continue
                raise AgentAPIError(str(e), retryable=True)

            except AuthenticationError as e:
                raise AgentAPIError(str(e), retryable=False)

    @abstractmethod
    def process(self, state: AgentState) -> AgentState:
        """Process the current state and return updated state"""
        pass
```

### 8.3 ProfileBuilder Agent

**Purpose**: Transform raw program description into structured brief

**Prompt Strategy**:
```python
PROFILE_BUILDER_PROMPT = """
You are an expert education program analyst for the Shikshagraha ecosystem in India.

Analyze the following program description and extract key information.
Focus on identifying:
- Program theme (FLN, Teacher Development, Leadership, etc.)
- Target beneficiaries and stakeholders
- System level (School, Cluster, Block, District)
- Expected student-level changes
- Key challenges mentioned

Return a JSON object with:
{
    "summary": "Concise 1-2 sentence summary",
    "goal": "Primary goal of the program",
    "target_audience": "Who the program serves",
    "context": "Additional context if any",
    "challenges": ["challenge1", "challenge2"],
    "program_theme": "FLN|Teacher Development|Leadership|...",
    "system_level": "School|Cluster|Block|District",
    "geographic_scope": "State/district coverage",
    "key_stakeholders": {
        "school": ["Teachers", "HM"],
        "cluster": ["CRP"],
        "block": [],
        "district": []
    },
    "student_level_change": "Expected change at student level"
}
"""
```

**Processing Flow**:
```mermaid
flowchart LR
    A[raw_input] --> B[Build prompt]
    B --> C[Call OpenAI]
    C --> D[Parse JSON]
    D --> E[Validate fields]
    E --> F[Update state.program_brief]
    F --> G[Set phase = INQUIRY]
```

### 8.4 Interviewer Agent

**Purpose**: Generate contextual clarifying questions based on brief

**Question Categories**:
| Category | Focus Area | Stakeholder Level |
|----------|------------|-------------------|
| STUDENT_OUTCOMES | Learning changes, measurable goals | School |
| TEACHER_PRACTICE | Classroom behavior changes | School |
| HM_PRACTICE | Head Master support activities | School |
| CRP_ROLE | Cluster mentoring approach | Cluster |
| BLOCK_SUPPORT | Block-level coordination | Block |
| DISTRICT_ALIGNMENT | DIET institutionalization | District |
| MEASUREMENT | Progress tracking methods | All |
| SUSTAINABILITY | Post-program continuity | All |

**Prompt Strategy**:
```python
INTERVIEWER_PROMPT = """
You are a program design consultant for education NGOs in India.

Based on this program brief, generate 10-15 clarifying questions that will help
complete the Logical Framework. Focus on gaps in:
- Student-level outcomes (specific and measurable)
- Teacher practice changes (what should they do differently?)
- School leadership support (HM role)
- Cluster-level mentoring (CRP activities)
- Block-level support (BRP coordination)
- District-level alignment (DIET involvement)
- Measurement approach (how to track changes)
- Sustainability (how to maintain after program ends)

Return JSON:
{
    "questions": [
        {
            "id": "q_1",
            "question": "Question text",
            "category": "STUDENT_OUTCOMES|TEACHER_PRACTICE|...",
            "required": true,
            "stakeholder_level": "school|cluster|block|district|all"
        }
    ]
}
"""
```

### 8.5 LFAGenerator Agent

**Purpose**: Create complete LFA document from profile and answers

**Output Structure**:
```json
{
    "title": "Program Title",
    "goal": "Student-level impact statement",
    "goal_indicators": [
        "SMART indicator 1",
        "SMART indicator 2"
    ],
    "assumptions": [
        "External dependency 1",
        "External dependency 2"
    ],
    "outcomes": [
        {
            "id": "OC1",
            "description": "Outcome description",
            "indicators": ["Indicator 1"],
            "means_of_verification": ["MOV 1"],
            "outputs": [
                {
                    "id": "OP1.1",
                    "description": "Output description",
                    "indicators": ["Indicator"],
                    "means_of_verification": ["MOV"],
                    "activities": [
                        {
                            "id": "A1.1.1",
                            "description": "Activity description",
                            "indicators": ["Indicator"],
                            "means_of_verification": ["MOV"],
                            "responsible_stakeholder": "Teacher|CRP|BRP|DIET"
                        }
                    ]
                }
            ]
        }
    ],
    "stakeholder_practice_changes": {
        "teachers": ["Practice change 1"],
        "head_masters": ["Practice change 1"],
        "crp_crcc": ["Practice change 1"],
        "brp_beo": ["Practice change 1"],
        "deo_diet": ["Practice change 1"]
    }
}
```

**Validation Logic**:
```python
def _validate_and_fix_structure(self, data: Dict) -> Dict:
    """Ensure LFA structure is complete and valid"""

    # Ensure required top-level fields
    data.setdefault("title", "Education Program")
    data.setdefault("goal", "")
    data.setdefault("goal_indicators", [])
    data.setdefault("assumptions", [])
    data.setdefault("outcomes", [])

    # Auto-generate IDs if missing
    for oc_idx, outcome in enumerate(data["outcomes"], 1):
        outcome.setdefault("id", f"OC{oc_idx}")
        outcome.setdefault("outputs", [])

        for op_idx, output in enumerate(outcome["outputs"], 1):
            output.setdefault("id", f"OP{oc_idx}.{op_idx}")
            output.setdefault("activities", [])

            for act_idx, activity in enumerate(output["activities"], 1):
                activity.setdefault("id", f"A{oc_idx}.{op_idx}.{act_idx}")

    # Ensure stakeholder_practice_changes
    data.setdefault("stakeholder_practice_changes", {
        "teachers": [],
        "head_masters": [],
        "crp_crcc": [],
        "brp_beo": [],
        "deo_diet": []
    })

    return data
```

### 8.6 GraphVisualizer Agent

**Purpose**: Convert LFA JSON to Mermaid.js diagram code

**Diagram Types**:

1. **Flowchart (Primary View)**:
```
graph TD
    G[Goal: Improve literacy] --> OC1[Outcome: Teachers practice new methods]
    OC1 --> OP1_1[Output: Teachers trained]
    OP1_1 --> A1_1_1[Activity: Training workshop]
    OP1_1 --> A1_1_2[Activity: TLM distribution]
```

2. **Mindmap**:
```
mindmap
    root((LFA))
        Goal
            Indicator 1
            Indicator 2
        Outcomes
            Outcome 1
                Output 1.1
                    Activity 1.1.1
```

3. **Journey**:
```
journey
    title LFA Implementation Journey
    section Goal Achievement
        Goal statement: 5: System
    section Outcome 1
        Output 1.1: 4: Implementer
            Activity 1.1.1: 3: Stakeholder
```

**Text Sanitization**:
```python
def _sanitize_text(self, text: str, max_length: int = 50) -> str:
    """Clean text for Mermaid compatibility"""
    if not text:
        return "No description"

    # Remove problematic characters
    text = text.replace('"', "'")
    text = text.replace('\n', ' ')
    text = text.replace('\r', '')

    # Truncate with ellipsis
    if len(text) > max_length:
        text = text[:max_length-3] + "..."

    return text
```

### 8.7 StakeholderSimulator Agent

**Purpose**: Provide authentic stakeholder feedback on LFA

**8 Stakeholder Personas**:

```python
STAKEHOLDERS = {
    "teacher": {
        "name": "Teacher",
        "hindi_name": "शिक्षक",
        "level": "school",
        "icon": "GraduationCap",
        "color": "#F97316",  # Orange
        "description": "Government school teacher with 10+ years experience",
        "pain_points": [
            "Large class sizes (40-60 students)",
            "Lack of TLM and learning materials",
            "Administrative burden and CCE documentation",
            "Multiple programs running simultaneously"
        ],
        "typical_concerns": [
            "workload", "time", "materials", "class_size", "training"
        ]
    },
    "head_master": {
        "name": "Head Master",
        "hindi_name": "प्रधानाध्यापक",
        "level": "school",
        "icon": "School",
        "color": "#F97316",
        "description": "School leader managing 5-10 teachers",
        "pain_points": [
            "Balancing administrative and academic responsibilities",
            "Budget constraints for school improvement",
            "Managing teacher resistance to change"
        ],
        "typical_concerns": [
            "teacher_buy_in", "resources", "accountability", "sustainability"
        ]
    },
    "crp": {
        "name": "Cluster Resource Person",
        "hindi_name": "संकुल स्रोत व्यक्ति",
        "level": "cluster",
        "icon": "Users",
        "color": "#22C55E",  # Green
        "description": "Mentors 15-20 schools in a cluster",
        "pain_points": [
            "Too many schools to cover effectively",
            "Travel and logistics challenges",
            "Being seen as inspector rather than mentor"
        ],
        "typical_concerns": [
            "visit_frequency", "travel", "mentoring_capacity", "teacher_relationships"
        ]
    },
    # ... (BRP, DEO, Parent, Student, DIET personas)
}
```

**Interview Simulation Prompt**:
```python
INTERVIEW_PROMPT = """
You are {stakeholder_name} ({hindi_name}), a {description}.

You are reviewing the following LFA document. Provide authentic, in-character feedback
based on your perspective and experience.

Your pain points:
{pain_points}

LFA Document:
{lfa_json}

Respond with JSON:
{
    "greeting": "In-character greeting",
    "feedback_items": [
        {
            "type": "gap|risk|concern|suggestion",
            "severity": "critical|important|minor",
            "title": "Brief title",
            "message": "Detailed feedback in your voice",
            "lfa_reference": "Which part of LFA this relates to",
            "recommendation": "Your suggestion to address this"
        }
    ],
    "overall_sentiment": "supportive|cautious|skeptical|concerned",
    "closing_remark": "In-character closing"
}
"""
```

### 8.8 LogicChallenger Agent

**Purpose**: Identify weaknesses and gaps in LFA logic

**Challenge Categories**:

```python
CHALLENGE_CATEGORIES = {
    "logic_gap": {
        "description": "Missing links in causal chain",
        "examples": [
            "Activity doesn't lead to output",
            "Output doesn't contribute to outcome",
            "Missing intermediate steps"
        ]
    },
    "unrealistic_assumption": {
        "description": "Assumptions that may not hold",
        "examples": [
            "Resources always available",
            "Stakeholders always cooperative",
            "External conditions stable"
        ]
    },
    "missing_activity": {
        "description": "Actions needed but not specified",
        "examples": [
            "Training for behavior changes",
            "Resource procurement",
            "Communication to stakeholders"
        ]
    },
    "indicator_weakness": {
        "description": "Measurement problems",
        "examples": [
            "Indicator can't be measured",
            "No clear target",
            "Not SMART"
        ]
    },
    "stakeholder_blindspot": {
        "description": "Missing accountability",
        "examples": [
            "No clear responsibility",
            "Missing stakeholder",
            "Unclear handoff"
        ]
    }
}
```

**Analysis Prompt**:
```python
LOGIC_CHALLENGER_PROMPT = """
You are a critical reviewer of Logical Framework documents.
Act as a "devil's advocate" and identify weaknesses.

Analyze this LFA for:
1. Logic Gaps: Are there missing links in Goal → Outcome → Output → Activity chain?
2. Unrealistic Assumptions: What's assumed that may not hold?
3. Missing Activities: What actions are needed but not specified?
4. Indicator Weaknesses: Which indicators can't be properly measured?
5. Stakeholder Blindspots: Who's responsibility is unclear?

LFA Document:
{lfa_json}

Return JSON:
{
    "overall_score": 0-100,
    "overall_assessment": "Summary of LFA quality",
    "logic_chain_analysis": {
        "strongest_chain": "Best connected logic path",
        "weakest_chain": "Most problematic logic path"
    },
    "challenges": [
        {
            "id": "LC1",
            "category": "logic_gap|unrealistic_assumption|...",
            "severity": "critical|important|minor",
            "title": "Brief issue title",
            "description": "Detailed explanation",
            "lfa_element": "Which part has the issue",
            "logic_break": "What's broken in the logic",
            "recommendation": "How to fix",
            "effort_to_fix": "low|medium|high"
        }
    ],
    "quick_wins": [
        {"action": "Simple fix", "impact": "Expected improvement"}
    ],
    "summary_stats": {
        "critical_issues": 0,
        "important_issues": 0,
        "minor_issues": 0,
        "logic_gaps": 0,
        "unrealistic_assumptions": 0,
        "missing_activities": 0,
        "indicator_weaknesses": 0,
        "stakeholder_blindspots": 0
    }
}
"""
```

### 8.9 ScenarioAnalyzer Agent

**Purpose**: Analyze "what-if" scenario impacts on LFA

**Scenario Templates**:

```python
SCENARIO_TEMPLATES = [
    {
        "id": "budget_cut",
        "name": "Budget Reduction",
        "description": "What if budget is reduced by X%?",
        "parameters": ["reduction_percentage"]
    },
    {
        "id": "timeline_delay",
        "name": "Implementation Delay",
        "description": "What if implementation is delayed by X months?",
        "parameters": ["delay_months"]
    },
    {
        "id": "stakeholder_resistance",
        "name": "Stakeholder Resistance",
        "description": "What if a key stakeholder resists?",
        "parameters": ["stakeholder_type", "resistance_level"]
    },
    {
        "id": "scale_change",
        "name": "Scale Change",
        "description": "What if program scale changes by X%?",
        "parameters": ["scale_change_percentage", "direction"]
    },
    {
        "id": "resource_shortage",
        "name": "Resource Shortage",
        "description": "What if a critical resource becomes unavailable?",
        "parameters": ["resource_type"]
    },
    {
        "id": "external_shock",
        "name": "External Disruption",
        "description": "What if an external event disrupts implementation?",
        "parameters": ["event_type", "duration"]
    }
]
```

**Analysis Output Structure**:
```json
{
    "scenario_summary": "Brief description of scenario analyzed",
    "overall_impact": "critical|significant|moderate|minimal",
    "impact_score": 75,
    "affected_elements": [
        {
            "element_type": "activity|output|outcome",
            "element_id": "A1.1.1",
            "element_description": "Training workshop",
            "impact_severity": "high|medium|low",
            "impact_description": "How this element is affected",
            "cascade_effects": ["Effect 1", "Effect 2"]
        }
    ],
    "logic_chain_breaks": [
        {
            "from_element": "A1.1.1",
            "to_element": "OP1.1",
            "break_description": "Why the chain breaks"
        }
    ],
    "mitigation_strategies": [
        {
            "strategy": "Description of mitigation",
            "priority": "immediate|short_term|medium_term",
            "feasibility": "high|medium|low",
            "responsible_stakeholder": "Who should implement"
        }
    ],
    "assumptions_invalidated": ["Assumption 1", "Assumption 2"],
    "resilience_score": 65,
    "analysis_summary": "Overall assessment of scenario impact"
}
```

---

## 9. API Documentation

### 9.1 Endpoint Summary

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/start` | Start new LFA session | None |
| POST | `/api/answers` | Submit answers & generate LFA | None |
| GET | `/api/session/{id}` | Get session status | None |
| GET | `/api/session/{id}/full` | Get complete session data | None |
| DELETE | `/api/session/{id}` | Delete session | None |
| GET | `/api/health` | Health check | None |
| GET | `/api/stats` | API statistics | None |
| GET | `/api/stakeholders` | List stakeholder personas | None |
| POST | `/api/stakeholder/interview` | Interview single stakeholder | None |
| POST | `/api/stakeholder/interview-all` | Interview all stakeholders | None |
| POST | `/api/lfa/analyze` | Logic analysis | None |
| POST | `/api/lfa/quick-validate` | Quick validation | None |
| GET | `/api/scenarios/templates` | Get scenario templates | None |
| POST | `/api/scenarios/analyze` | Analyze scenario | None |
| POST | `/api/export` | Export LFA | None |
| GET | `/api/export/formats` | Get export formats | None |

### 9.2 Core Endpoints

#### POST /api/start

**Description**: Start a new LFA building session

**Request Body**:
```json
{
    "raw_input": "We want to improve literacy outcomes in rural UP through teacher training..."
}
```

**Validation**:
- `raw_input`: Required, 10-10000 characters

**Response** (200 OK):
```json
{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "phase": "waiting_for_answers",
    "program_brief": {
        "summary": "Teacher training program for literacy improvement",
        "goal": "Improve Grade 1-3 literacy outcomes",
        "target_audience": "Primary school students in rural UP",
        "program_theme": "FLN",
        "system_level": "School",
        "key_stakeholders": {
            "school": ["Teachers", "HM"],
            "cluster": ["CRP"],
            "block": [],
            "district": []
        }
    },
    "questions": [
        {
            "id": "q_1",
            "question": "What specific literacy skills should students demonstrate by the end of the program?",
            "category": "STUDENT_OUTCOMES",
            "required": true,
            "stakeholder_level": "school"
        }
    ],
    "message": "Session started. Please answer the questions to continue."
}
```

**Error Responses**:
- 400: Invalid input (too short, empty, etc.)
- 500: Server error (API key issue, OpenAI failure)

#### POST /api/answers

**Description**: Submit answers and generate complete LFA

**Request Body**:
```json
{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "answers": [
        {
            "question_id": "q_1",
            "answer": "Students should be able to read 30 words per minute with comprehension"
        },
        {
            "question_id": "q_2",
            "answer": "Teachers will use activity-based pedagogy with TLM materials daily"
        }
    ]
}
```

**Validation**:
- `session_id`: Valid UUID
- `answers`: At least 1 answer, all required questions answered

**Response** (200 OK):
```json
{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "phase": "completed",
    "lfa_document": {
        "title": "Literacy Improvement Through Teacher Training",
        "goal": "80% of Grade 1-3 students achieve grade-level literacy",
        "goal_indicators": [
            "Reading fluency (words per minute)",
            "Reading comprehension score"
        ],
        "assumptions": [
            "Teachers attend training sessions",
            "TLM materials are available"
        ],
        "outcomes": [...],
        "stakeholder_practice_changes": {...}
    },
    "mermaid_code": "graph TD\n  G[Goal: Improve literacy]...",
    "all_visualizations": {
        "flowchart": "graph TD...",
        "mindmap": "mindmap...",
        "journey": "journey..."
    },
    "message": "LFA document generated successfully!"
}
```

**Error Responses**:
- 400: Missing required answers, invalid session
- 404: Session not found or expired
- 500: Generation failure

### 9.3 Advanced Analysis Endpoints

#### POST /api/stakeholder/interview

**Description**: Get feedback from a stakeholder persona

**Request Body**:
```json
{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "stakeholder_id": "teacher"
}
```

OR

```json
{
    "stakeholder_id": "crp",
    "lfa_document": {...}
}
```

**Response** (200 OK):
```json
{
    "stakeholder_id": "teacher",
    "stakeholder_name": "Teacher",
    "stakeholder_level": "school",
    "stakeholder_icon": "GraduationCap",
    "stakeholder_color": "#F97316",
    "greeting": "Namaskar! I've been teaching for 15 years in a government school...",
    "feedback_items": [
        {
            "type": "concern",
            "severity": "important",
            "title": "Large Class Size Challenge",
            "message": "With 50 students in my class, implementing individual activity-based learning will be very difficult...",
            "lfa_reference": "Activity A1.1.1 - Activity-based pedagogy",
            "recommendation": "Include provisions for group-based activities and peer learning"
        }
    ],
    "overall_sentiment": "cautious",
    "closing_remark": "I want this program to succeed, but please consider our ground realities.",
    "issue_summary": {
        "critical": 0,
        "important": 2,
        "minor": 1,
        "gaps": 1,
        "risks": 1,
        "concerns": 2,
        "suggestions": 1,
        "total": 4
    }
}
```

#### POST /api/lfa/analyze

**Description**: Get AI devil's advocate analysis

**Request Body**:
```json
{
    "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response** (200 OK):
```json
{
    "overall_score": 72,
    "overall_assessment": "This LFA has a solid foundation but needs strengthening in measurement and stakeholder accountability.",
    "logic_chain_analysis": {
        "strongest_chain": "Training → Teacher Practice → Student Outcomes",
        "weakest_chain": "CRP Support → Teacher Sustainability"
    },
    "challenges": [
        {
            "id": "LC1",
            "category": "indicator_weakness",
            "severity": "important",
            "title": "Reading Fluency Measurement Gap",
            "description": "The indicator 'reading fluency' needs standardized assessment tools specified.",
            "lfa_element": "Goal Indicator 1",
            "logic_break": "Cannot measure progress without defined assessment protocol",
            "recommendation": "Specify ASER or similar standardized tool with frequency",
            "effort_to_fix": "low"
        }
    ],
    "quick_wins": [
        {
            "action": "Add assessment frequency to indicators",
            "impact": "Enables progress tracking"
        }
    ],
    "summary_stats": {
        "critical_issues": 0,
        "important_issues": 3,
        "minor_issues": 2,
        "logic_gaps": 1,
        "unrealistic_assumptions": 1,
        "missing_activities": 1,
        "indicator_weaknesses": 2,
        "stakeholder_blindspots": 0
    }
}
```

#### POST /api/scenarios/analyze

**Description**: Analyze what-if scenario impact

**Request Body**:
```json
{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "scenario_description": "Budget is reduced by 40%",
    "scenario_type": "budget_cut",
    "parameters": {
        "reduction_percentage": 40
    }
}
```

**Response** (200 OK):
```json
{
    "scenario_summary": "40% budget reduction scenario analyzed",
    "overall_impact": "significant",
    "impact_score": 72,
    "affected_elements": [
        {
            "element_type": "activity",
            "element_id": "A1.1.2",
            "element_description": "TLM Kit Distribution",
            "impact_severity": "high",
            "impact_description": "Cannot provide complete TLM kits to all teachers",
            "cascade_effects": [
                "Teachers lack materials for activity-based pedagogy",
                "Student engagement decreases"
            ]
        }
    ],
    "logic_chain_breaks": [
        {
            "from_element": "A1.1.2 - TLM Distribution",
            "to_element": "OP1.1 - Teachers practice new methods",
            "break_description": "Without materials, teachers cannot implement methodology"
        }
    ],
    "mitigation_strategies": [
        {
            "strategy": "Use low-cost, locally-sourced TLM materials",
            "priority": "immediate",
            "feasibility": "high",
            "responsible_stakeholder": "CRP"
        },
        {
            "strategy": "Prioritize high-impact activities, defer others",
            "priority": "short_term",
            "feasibility": "medium",
            "responsible_stakeholder": "Program Manager"
        }
    ],
    "assumptions_invalidated": [
        "TLM materials are available for all teachers"
    ],
    "resilience_score": 58,
    "analysis_summary": "The program can survive 40% budget cut with modifications, but TLM procurement and training scale need immediate attention."
}
```

### 9.4 Export Endpoints

#### POST /api/export

**Description**: Export LFA to file format

**Request Body**:
```json
{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "format": "docx"
}
```

**Response**: Binary file download with headers:
- `Content-Type`: `application/vnd.openxmlformats-officedocument.wordprocessingml.document` (DOCX) or `text/csv` (CSV)
- `Content-Disposition`: `attachment; filename=lfa_export_20240120_143022.docx`

---

## 10. Database Schema

### 10.1 Table: lfa_sessions

```sql
CREATE TABLE lfa_sessions (
    id VARCHAR(36) PRIMARY KEY,           -- UUID
    created_at TIMESTAMP DEFAULT NOW(),   -- Creation time
    updated_at TIMESTAMP DEFAULT NOW(),   -- Last update
    phase VARCHAR(50) DEFAULT 'ingestion', -- Workflow phase
    raw_input TEXT,                        -- User's program description
    program_brief JSON,                    -- Structured brief
    questions JSON,                        -- Generated questions
    answers JSON,                          -- User's answers
    final_profile JSON,                    -- Merged brief + answers
    lfa_document JSON,                     -- Complete LFA
    mermaid_code TEXT,                     -- Visualization code
    error TEXT                             -- Error message if any
);
```

### 10.2 Session Data Flow

```mermaid
flowchart TD
    subgraph "Phase 1: Start"
        A1[id] --> |UUID generated| D1[(Database)]
        A2[raw_input] --> D1
        A3[phase = ingestion] --> D1
    end

    subgraph "Phase 2: Profile Built"
        B1[program_brief] --> D1
        B2[phase = inquiry] --> D1
    end

    subgraph "Phase 3: Questions Ready"
        C1[questions] --> D1
        C2[phase = waiting_for_answers] --> D1
    end

    subgraph "Phase 4: Answers Submitted"
        E1[answers] --> D1
        E2[final_profile] --> D1
        E3[phase = finalization] --> D1
    end

    subgraph "Phase 5: Complete"
        F1[lfa_document] --> D1
        F2[mermaid_code] --> D1
        F3[phase = completed] --> D1
    end
```

### 10.3 SQLAlchemy Model

```python
class LFASession(Base):
    """Store session state for the LFA building workflow"""
    __tablename__ = "lfa_sessions"

    id = Column(String(36), primary_key=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    phase = Column(String(50), default="ingestion")
    raw_input = Column(Text)
    program_brief = Column(JSON)
    questions = Column(JSON)
    answers = Column(JSON)
    final_profile = Column(JSON)
    lfa_document = Column(JSON)
    mermaid_code = Column(Text)
    error = Column(Text)
```

---

## 11. Frontend Architecture

### 11.1 Directory Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main wizard component
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── badge.tsx
│   │   ├── checkbox.tsx
│   │   ├── progress.tsx
│   │   ├── separator.tsx
│   │   └── spinner.tsx
│   └── wizard/             # LFA-specific components
│       ├── Wizard.tsx              # Main orchestrator
│       ├── StepIndicator.tsx       # Progress display
│       ├── InputStep.tsx           # Step 1: Program description
│       ├── QuestionsStep.tsx       # Step 2: Answer questions
│       ├── ResultStep.tsx          # Step 3: View LFA
│       ├── LogframeMatrix.tsx      # Tabular LFA view
│       ├── MermaidDiagram.tsx      # Diagram renderer
│       ├── StakeholderPyramid.tsx  # Hierarchy visualization
│       ├── StakeholderInterviewPanel.tsx
│       ├── LogicChallengerPanel.tsx
│       ├── WhatIfEngine.tsx
│       ├── HealthScoreDashboard.tsx
│       ├── ManualGrid.tsx          # LFA editor
│       ├── TheoryOfChange.tsx
│       └── ExportControlsPanel.tsx
├── lib/
│   ├── api.ts              # API client
│   └── utils.ts            # Utilities
├── types/
│   └── index.ts            # TypeScript definitions
└── tailwind.config.ts      # Tailwind configuration
```

### 11.2 State Management

```mermaid
stateDiagram-v2
    [*] --> Input: Initial load

    Input --> Questions: POST /api/start success
    Input --> Input: Validation error

    Questions --> Result: POST /api/answers success
    Questions --> Questions: Answer change

    Result --> Input: Reset clicked
    Result --> Result: Analysis tool used

    state Input {
        [*] --> Editing
        Editing --> Submitting: Submit
        Submitting --> [*]: Success
        Submitting --> Editing: Error
    }

    state Questions {
        [*] --> Answering
        Answering --> NavigatingQuestions
        NavigatingQuestions --> Answering
        Answering --> Submitting
        Submitting --> [*]: Success
    }

    state Result {
        [*] --> ViewingLFA
        ViewingLFA --> InterviewingStakeholder
        ViewingLFA --> ChallengingLogic
        ViewingLFA --> AnalyzingScenario
        ViewingLFA --> Exporting
    }
```

### 11.3 Wizard State Interface

```typescript
export type WizardStep = "input" | "questions" | "result";

export interface WizardState {
    // Navigation
    currentStep: WizardStep;

    // Session
    sessionId: string | null;

    // Phase 1: Input
    rawInput: string;
    programBrief: ProgramBrief | null;

    // Phase 2: Questions
    questions: Question[];
    answers: Answer[];

    // Phase 3: Results
    lfaDocument: LFADocument | null;
    mermaidCode: string;
    allVisualizations: {
        flowchart: string;
        mindmap: string;
        journey: string;
    } | null;

    // UI State
    isLoading: boolean;
    error: string | null;
}
```

### 11.4 API Client

```typescript
// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

class ApiError extends Error {
    public userMessage: string;

    constructor(public status: number, message: string, userMessage?: string) {
        super(message);
        this.name = "ApiError";
        this.userMessage = userMessage || this.getDefaultUserMessage(status, message);
    }
}

class NetworkError extends Error {
    public userMessage: string = "Unable to connect to the server.";
}

async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = MAX_RETRIES
): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new ApiError(response.status, await response.text());
            }

            return response.json();
        } catch (error) {
            lastError = error;

            if (isRetryableError(error) && attempt < retries) {
                await sleep(RETRY_DELAY_MS * Math.pow(2, attempt));
                continue;
            }

            throw error;
        }
    }

    throw lastError;
}

export const api = {
    startSession: (rawInput: string) =>
        fetchApi<StartSessionResponse>("/api/start", {
            method: "POST",
            body: JSON.stringify({ raw_input: rawInput }),
        }),

    submitAnswers: (sessionId: string, answers: Answer[]) =>
        fetchApi<SubmitAnswersResponse>("/api/answers", {
            method: "POST",
            body: JSON.stringify({ session_id: sessionId, answers }),
        }),

    // ... other methods
};
```

---

## 12. Shikshagraha Integration

### 12.1 Education System Hierarchy

```mermaid
graph TB
    subgraph "State Level"
        STATE[State Education Department]
    end

    subgraph "District Level"
        DEO[District Education Officer - DEO]
        DIET[DIET - Training Institute]
        DM[District Magistrate]
    end

    subgraph "Block Level"
        BRP[Block Resource Person - BRP]
        BRCC[Block Resource Centre Coordinator]
        BEO[Block Education Officer]
    end

    subgraph "Cluster Level"
        CRP[Cluster Resource Person - CRP]
        CRCC[Cluster Resource Centre Coordinator]
    end

    subgraph "School Level"
        HM[Head Master - HM]
        TEACHER[Teachers]
        STUDENT[Students]
        SMC[School Management Committee]
    end

    STATE --> DEO & DIET & DM
    DEO --> BRP & BRCC & BEO
    DIET -.-> BRP
    BRP --> CRP & CRCC
    CRP --> HM
    HM --> TEACHER
    TEACHER --> STUDENT
    SMC -.-> HM
```

### 12.2 Stakeholder Mapping in LFA

| Level | Stakeholders | Typical Responsibilities | LFA Focus |
|-------|-------------|-------------------------|-----------|
| **School** | Students, Teachers, HM | Direct implementation | Activities, Outputs |
| **Cluster** | CRP, CRCC | Mentoring, support | Output monitoring |
| **Block** | BRP, BRCC, BEO | Coordination, training | Outcome tracking |
| **District** | DEO, DIET, DM | Policy, institutionalization | Goal alignment |
| **Community** | Parents, SMC | Support, accountability | Sustainability |

### 12.3 Common LFA Structure

The platform implements the Shikshagraha Common LFA structure:

```
GOAL (Student-Level Impact)
├── What change do we want to see at the student level?
├── How will we know this change is happening?
│
├── OUTCOMES (Stakeholder Practice Changes)
│   ├── What changes are expected from Teachers?
│   ├── What changes are expected from Head Masters?
│   ├── What changes are expected from CRPs?
│   ├── What changes are expected from BRPs?
│   └── What changes are expected from DEO/DIET?
│
├── OUTPUTS (Deliverables)
│   ├── Training programs conducted
│   ├── Materials developed and distributed
│   ├── Support systems established
│   └── Monitoring mechanisms in place
│
└── ACTIVITIES (Implementation Actions)
    ├── Workshops and training sessions
    ├── Mentoring visits
    ├── Data collection and review
    └── Feedback and iteration
```

### 12.4 Program Themes Supported

| Theme | Description | Key Focus Areas |
|-------|-------------|-----------------|
| **FLN** | Foundational Literacy & Numeracy | Grade 1-3 reading, math skills |
| **Teacher Development** | Teacher Professional Development | Pedagogy, content knowledge |
| **Leadership** | School Leadership Development | HM capacity, school management |
| **Assessment** | Assessment & Learning Outcomes | Testing, tracking, data use |
| **Career Readiness** | Career Readiness & Life Skills | Skill development, employability |
| **EdTech** | EdTech Integration | Technology in classrooms |
| **Community** | Community & SMC Engagement | Parent involvement, governance |
| **Mentoring** | Academic Mentoring | CRP/BRP support systems |
| **Infrastructure** | School Infrastructure | Facilities, resources |
| **Governance** | Education Governance | System efficiency, accountability |

---

## 13. Dependencies & Libraries

### 13.1 Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | Latest | Web framework for API |
| `uvicorn` | Latest | ASGI server |
| `pydantic` | Latest | Data validation |
| `sqlalchemy` | Latest | ORM for database |
| `langgraph` | Latest | Agent orchestration |
| `openai` | Latest | GPT-4o API client |
| `python-dotenv` | Latest | Environment variables |
| `python-docx` | Latest | DOCX export |

### 13.2 Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 14.1.0 | React framework |
| `react` | ^18.2.0 | UI library |
| `typescript` | 5.3.3 | Type safety |
| `tailwindcss` | 3.4.1 | Styling |
| `mermaid` | ^10.7.0 | Diagram rendering |
| `lucide-react` | ^0.312.0 | Icons |
| `class-variance-authority` | ^0.7.0 | Component variants |
| `clsx` | ^2.1.0 | Class utilities |

### 13.3 Library Call Hierarchy

```mermaid
graph TD
    subgraph "API Layer"
        FASTAPI[FastAPI]
        PYDANTIC[Pydantic]
    end

    subgraph "Orchestration Layer"
        LANGGRAPH[LangGraph]
        STATEGRAPH[StateGraph]
    end

    subgraph "Agent Layer"
        OPENAI[OpenAI Client]
    end

    subgraph "Data Layer"
        SQLALCHEMY[SQLAlchemy]
        DOCX[python-docx]
    end

    FASTAPI --> PYDANTIC
    FASTAPI --> LANGGRAPH
    LANGGRAPH --> STATEGRAPH
    STATEGRAPH --> OPENAI
    FASTAPI --> SQLALCHEMY
    FASTAPI --> DOCX
```

---

## 14. Configuration

### 14.1 Backend Environment Variables

```env
# Server Configuration
HOST=0.0.0.0
PORT=8000
ENV=development

# CORS (Frontend URLs)
FRONTEND_URL=http://localhost:3000,http://localhost:3001

# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
LLM_TEMPERATURE=0.4
LLM_TIMEOUT=90
LLM_MAX_RETRIES=2

# Database
DATABASE_URL=sqlite:///./lfa_builder.db  # Development
# DATABASE_URL=postgresql://user:pass@host:5432/dbname  # Production

# Session Management
SESSION_TTL_HOURS=24

# Input Validation
MAX_INPUT_LENGTH=10000
MAX_ANSWER_LENGTH=2000
```

### 14.2 Frontend Environment Variables

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 14.3 Configuration Loading

```python
# Backend configuration loading (base.py)
class BaseAgent:
    def __init__(self, client: OpenAI):
        self.client = client
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o")
        self.temperature = float(os.getenv("LLM_TEMPERATURE", "0.4"))
        self.timeout = float(os.getenv("LLM_TIMEOUT", "90"))
        self.max_retries = int(os.getenv("LLM_MAX_RETRIES", "2"))
```

---

## 15. Deployment Guide

### 15.1 Local Development Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your OPENAI_API_KEY
uvicorn app.api.server:app --reload --port 8000

# Frontend
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL
npm run dev
```

### 15.2 Production Deployment

```mermaid
graph LR
    subgraph "Frontend Hosting"
        VERCEL[Vercel / Netlify]
    end

    subgraph "Backend Hosting"
        RAILWAY[Railway / Render / AWS]
        UVICORN[Uvicorn Server]
    end

    subgraph "Database"
        POSTGRES[(PostgreSQL)]
    end

    subgraph "External Services"
        OPENAI[OpenAI API]
    end

    VERCEL --> RAILWAY
    RAILWAY --> UVICORN
    UVICORN --> POSTGRES
    UVICORN --> OPENAI
```

### 15.3 Production Checklist

- [ ] Set `ENV=production` in backend
- [ ] Configure production `DATABASE_URL` (PostgreSQL)
- [ ] Set production `FRONTEND_URL` for CORS
- [ ] Enable HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup for database
- [ ] Set appropriate `SESSION_TTL_HOURS`

---

## Appendix A: Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| 400 | Bad Request | Check input validation requirements |
| 404 | Not Found | Session expired, start new session |
| 429 | Rate Limited | Wait and retry |
| 500 | Server Error | Check logs, contact support |
| 503 | Service Unavailable | API or database down |

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **LFA** | Logical Framework Approach - structured program design methodology |
| **CRP** | Cluster Resource Person - mentors schools in a cluster |
| **BRP** | Block Resource Person - coordinates at block level |
| **DEO** | District Education Officer - district education head |
| **DIET** | District Institute of Education and Training |
| **FLN** | Foundational Literacy and Numeracy |
| **TLM** | Teaching Learning Materials |
| **MOV** | Means of Verification |
| **SMART** | Specific, Measurable, Achievable, Relevant, Time-bound |

---

*Documentation Version: 1.0*
*Last Updated: January 2024*
*Platform: AlgoPath LFA Builder for Shikshagraha*
