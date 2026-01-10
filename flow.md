● Complete LFA Generator Flow

  ┌─────────────────────────────────────────────────────────────────────────────────────┐
  │                                    USER JOURNEY                                      │
  └─────────────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
     │  STEP 1  │ ───► │  STEP 2  │ ───► │  STEP 3  │ ───► │  STEP 4  │
     │  Input   │      │ Questions│      │ Templates│      │  Result  │
     └──────────┘      └──────────┘      └──────────┘      └──────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
     User types        User answers      User picks        User views/
     program           AI questions      template OR       edits/exports
     description                         "Generate New"    final LFA

  ---
  Detailed Flow

  STEP 1: Input (Phase: INGESTION + INQUIRY)

  ┌─────────────────────────────────────────────────────────────────┐
  │  USER ACTION                                                    │
  │  Types program description in textarea                          │
  │  Example: "We want to train 500 teachers in rural schools       │
  │           to use digital tools for better student outcomes"     │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  FRONTEND (InputStep.tsx)                                       │
  │  onClick → api.startSession(rawInput)                           │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  API ENDPOINT                                                   │
  │  POST /api/start                                                │
  │  Body: { raw_input: "We want to train 500 teachers..." }        │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  ORCHESTRATOR.start_session()                                   │
  │  Creates session_id (UUID)                                      │
  │  Runs LangGraph workflow                                        │
  └─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
  ┌─────────────────────────┐     ┌─────────────────────────┐
  │  AGENT 1: ProfileBuilder│     │  AGENT 2: Interviewer   │
  │                         │     │                         │
  │  Input: Raw text        │ ──► │  Input: ProgramBrief    │
  │  Output: ProgramBrief   │     │  Output: Questions[]    │
  │                         │     │                         │
  │  Uses GPT-4o to extract:│     │  Uses GPT-4o to find    │
  │  - summary              │     │  gaps and generate      │
  │  - goal                 │     │  10-15 questions in     │
  │  - target_audience      │     │  categories:            │
  │  - context              │     │  - scope                │
  │  - challenges           │     │  - resources            │
  └─────────────────────────┘     │  - timeline             │
                                  │  - measurement          │
                                  │  - risks                │
                                  │  - stakeholders         │
                                  └─────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  RESPONSE TO FRONTEND                                           │
  │  {                                                              │
  │    session_id: "abc-123",                                       │
  │    program_brief: { summary, goal, target_audience, ... },      │
  │    questions: [                                                 │
  │      { id: "q1", question: "How many schools?", category: "scope" },
  │      { id: "q2", question: "What's the budget?", category: "resources" },
  │      ...                                                        │
  │    ]                                                            │
  │  }                                                              │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                      ⏸️ PAUSE - Wait for user

  ---
  STEP 2: Questions (Phase: WAITING_FOR_ANSWERS)

  ┌─────────────────────────────────────────────────────────────────┐
  │  USER ACTION                                                    │
  │  Fills in answers to each question                              │
  │  Q1: "How many schools?" → "150 schools across 5 districts"     │
  │  Q2: "What's the budget?" → "$500,000 over 2 years"             │
  │  ...                                                            │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  FRONTEND (QuestionsStep.tsx)                                   │
  │  onClick → api.submitAnswers(session_id, answers)               │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  API ENDPOINT                                                   │
  │  POST /api/answers                                              │
  │  Body: {                                                        │
  │    session_id: "abc-123",                                       │
  │    answers: [                                                   │
  │      { question_id: "q1", answer: "150 schools..." },           │
  │      { question_id: "q2", answer: "$500,000..." },              │
  │    ]                                                            │
  │  }                                                              │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  ORCHESTRATOR.submit_answers()                                  │
  │  Merges: ProgramBrief + Answers → FinalProfile                  │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  AGENT 3: Retriever (The Librarian)                             │
  │                                                                 │
  │  1. Creates semantic search query from FinalProfile             │
  │  2. Generates embedding using text-embedding-3-small            │
  │  3. Searches Pinecone vector database                           │
  │  4. Returns top 5 matching templates with similarity scores     │
  │                                                                 │
  │  Output: MatchedTemplate[]                                      │
  │  [                                                              │
  │    { id: "tpl-1", title: "Teacher Training", score: 0.89 },     │
  │    { id: "tpl-2", title: "Education Program", score: 0.76 },    │
  │    ...                                                          │
  │  ]                                                              │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  RESPONSE TO FRONTEND                                           │
  │  {                                                              │
  │    matched_templates: [                                         │
  │      { id: "tpl-1", title: "Teacher Training LFA", score: 0.89 },│
  │      ...                                                        │
  │    ]                                                            │
  │  }                                                              │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                      ⏸️ PAUSE - Wait for user selection

  ---
  STEP 3: Templates (Phase: WAITING_FOR_SELECTION)

  ┌─────────────────────────────────────────────────────────────────┐
  │  USER ACTION                                                    │
  │  Either:                                                        │
  │  A) Clicks on a template card to use it                         │
  │  B) Clicks "Generate New LFA" button                            │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  FRONTEND (TemplatesStep.tsx)                                   │
  │  onClick → api.finalize(session_id, template_id, generate_new)  │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  API ENDPOINT                                                   │
  │  POST /api/finalize                                             │
  │  Body: {                                                        │
  │    session_id: "abc-123",                                       │
  │    selected_template_id: "tpl-1" | null,                        │
  │    generate_new: false | true                                   │
  │  }                                                              │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  ORCHESTRATOR.finalize()                                        │
  │  Decision: generate_new OR use template                         │
  └─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
  ┌─────────────────────────┐     ┌─────────────────────────┐
  │  AGENT 4: Generator     │     │  Load Template from DB  │
  │  (If generate_new=true) │     │  (If template selected) │
  │                         │     │                         │
  │  Uses GPT-4o to create  │     │  Fetch full LFA content │
  │  complete LFA:          │     │  from PostgreSQL        │
  │                         │     │                         │
  │  - title                │     │                         │
  │  - goal                 │     │                         │
  │  - goal_indicators      │     │                         │
  │  - assumptions          │     │                         │
  │  - outcomes[] ──────────┼─────┼─────────────────────────┤
  │    - outputs[] ─────────┼─────┼─────────────────────────┤
  │      - activities[]     │     │                         │
  └─────────────────────────┘     └─────────────────────────┘
                │                               │
                └───────────────┬───────────────┘
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  AGENT 5: Visualizer (The Artist)                               │
  │                                                                 │
  │  Input: LFADocument JSON                                        │
  │  Output: Mermaid.js code strings                                │
  │                                                                 │
  │  Generates 3 diagram types:                                     │
  │  1. Flowchart (hierarchical top-down)                           │
  │  2. Mindmap (radial tree)                                       │
  │  3. Journey (timeline view)                                     │
  │                                                                 │
  │  Color coding:                                                  │
  │  - Goal: Blue                                                   │
  │  - Outcomes: Green                                              │
  │  - Outputs: Orange                                              │
  │  - Activities: Purple                                           │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
  ┌─────────────────────────────────────────────────────────────────┐
  │  RESPONSE TO FRONTEND                                           │
  │  {                                                              │
  │    lfa_document: {                                              │
  │      title: "Teacher Digital Skills Program",                   │
  │      goal: "Improve student outcomes through...",               │
  │      goal_indicators: ["80% teachers certified", ...],          │
  │      assumptions: ["Schools have internet", ...],               │
  │      outcomes: [                                                │
  │        {                                                        │
  │          id: "OC1",                                             │
  │          description: "Teachers competent in digital tools",    │
  │          indicators: [...],                                     │
  │          means_of_verification: [...],                          │
  │          outputs: [                                             │
  │            {                                                    │
  │              id: "OP1.1",                                       │
  │              description: "Training modules developed",         │
  │              activities: [...]                                  │
  │            }                                                    │
  │          ]                                                      │
  │        }                                                        │
  │      ]                                                          │
  │    },                                                           │
  │    mermaid_code: "flowchart TD\n  G[Goal]-->OC1...",            │
  │    all_visualizations: {                                        │
  │      flowchart: "...",                                          │
  │      mindmap: "...",                                            │
  │      journey: "..."                                             │
  │    }                                                            │
  │  }                                                              │
  └─────────────────────────────────────────────────────────────────┘

  ---
  STEP 4: Result (Phase: COMPLETED)

  ┌─────────────────────────────────────────────────────────────────┐
  │  FRONTEND (ResultStep.tsx)                                      │
  │                                                                 │
  │  4 TABS:                                                        │
  │  ┌─────────┬─────────┬─────────┬─────────┐                      │
  │  │ Diagram │Document │ Editor  │  Code   │                      │
  │  └─────────┴─────────┴─────────┴─────────┘                      │
  │                                                                 │
  │  DIAGRAM TAB:                                                   │
  │  - Toggle: Flowchart | Mindmap | Journey                        │
  │  - Renders Mermaid.js diagram                                   │
  │                                                                 │
  │  DOCUMENT TAB:                                                  │
  │  - Expandable cards showing Goal → Outcomes → Outputs           │
  │  - Shows indicators and assumptions                             │
  │                                                                 │
  │  EDITOR TAB (ManualGrid.tsx):                                   │
  │  - Full CRUD interface to edit any part of LFA                  │
  │  - Add/remove outcomes, outputs, activities                     │
  │  - Edit indicators inline                                       │
  │                                                                 │
  │  CODE TAB:                                                      │
  │  - Raw JSON view of LFA document                                │
  │                                                                 │
  │  EXPORT BUTTONS:                                                │
  │  ┌─────┬──────┬──────┬───────────┐                              │
  │  │Copy │ CSV  │ Word │Start Over │                              │
  │  └─────┴──────┴──────┴───────────┘                              │
  └─────────────────────────────────────────────────────────────────┘
                                │
                                ▼ (on export click)
  ┌─────────────────────────────────────────────────────────────────┐
  │  AGENT 6: Exporter (The Scribe)                                 │
  │                                                                 │
  │  POST /api/export                                               │
  │  Body: { session_id, format: "csv"|"docx", lfa_data }           │
  │                                                                 │
  │  CSV Output:                                                    │
  │  Level, ID, Description, Indicators, Verification, Assumptions  │
  │  Goal, "", "Improve student...", "80% certified", "", "..."     │
  │  Outcome, OC1, "Teachers competent...", "...", "...", ""        │
  │  Output, OP1.1, "Training modules...", "...", "...", ""         │
  │  Activity, A1.1.1, "Develop curriculum", "...", "...", ""       │
  │                                                                 │
  │  DOCX Output:                                                   │
  │  Professional Word document with:                               │
  │  - Title heading                                                │
  │  - Metadata (org, donor, date)                                  │
  │  - LFA Matrix table (4 columns)                                 │
  └─────────────────────────────────────────────────────────────────┘

  ---
  Summary: The 6 Agents
  ┌─────┬────────────────┬─────────────────┬──────────────┬───────────────────────────┐
  │  #  │     Agent      │      Role       │    Input     │          Output           │
  ├─────┼────────────────┼─────────────────┼──────────────┼───────────────────────────┤
  │ 1   │ ProfileBuilder │ First Responder │ Raw text     │ ProgramBrief              │
  ├─────┼────────────────┼─────────────────┼──────────────┼───────────────────────────┤
  │ 2   │ Interviewer    │ The Critic      │ ProgramBrief │ Question[] (10-15)        │
  ├─────┼────────────────┼─────────────────┼──────────────┼───────────────────────────┤
  │ 3   │ Retriever      │ The Librarian   │ FinalProfile │ MatchedTemplate[] (top 5) │
  ├─────┼────────────────┼─────────────────┼──────────────┼───────────────────────────┤
  │ 4   │ Generator      │ The Creator     │ FinalProfile │ LFADocument               │
  ├─────┼────────────────┼─────────────────┼──────────────┼───────────────────────────┤
  │ 5   │ Visualizer     │ The Artist      │ LFADocument  │ Mermaid code (3 types)    │
  ├─────┼────────────────┼─────────────────┼──────────────┼───────────────────────────┤
  │ 6   │ Exporter       │ The Scribe      │ LFADocument  │ CSV / DOCX files          │
  └─────┴────────────────┴─────────────────┴──────────────┴───────────────────────────┘
  ---
  State Flow

  INGESTION → INQUIRY → WAITING_FOR_ANSWERS → SYNTHESIS → WAITING_FOR_SELECTION → FINALIZATION → COMPLETED
      │          │              ⏸️                │                 ⏸️                  │            │
      └──────────┴──────────────────────────────┴─────────────────────────────────────┴────────────┘
                                      AgentState (shared across all)

  That's the complete flow. Want me to set up the environment so you can run and test it?

✻ Cogitated for 1m 19s