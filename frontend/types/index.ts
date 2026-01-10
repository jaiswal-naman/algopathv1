// API Types for LFA Builder

export interface ProgramBrief {
  summary: string;
  goal: string;
  target_audience: string;
  context?: string;
  challenges?: string[];
}

export interface Question {
  id: string;
  question: string;
  category: string;
  required: boolean;
}

export interface Answer {
  question_id: string;
  answer: string;
}

export interface MatchedTemplate {
  id: string;
  title: string;
  score: number;
  preview?: string;
}

export interface Activity {
  id: string;
  description: string;
  indicators: string[];
  means_of_verification: string[];
}

export interface Output {
  id: string;
  description: string;
  indicators: string[];
  means_of_verification: string[];
  activities: Activity[];
}

export interface Outcome {
  id: string;
  description: string;
  indicators: string[];
  means_of_verification: string[];
  outputs: Output[];
}

export interface LFADocument {
  title: string;
  goal: string;
  goal_indicators: string[];
  assumptions: string[];
  outcomes: Outcome[];
}

// API Response Types
export interface StartSessionResponse {
  session_id: string;
  phase: string;
  program_brief: ProgramBrief;
  questions: Question[];
  message: string;
}

export interface SubmitAnswersResponse {
  session_id: string;
  phase: string;
  matched_templates: MatchedTemplate[];
  message: string;
}

export interface FinalizeResponse {
  session_id: string;
  phase: string;
  lfa_document: LFADocument;
  mermaid_code: string;
  all_visualizations?: {
    flowchart: string;
    mindmap: string;
    journey: string;
  };
  message: string;
}

// Wizard State
export type WizardStep =
  | "input"
  | "questions"
  | "templates"
  | "result";

export interface WizardState {
  currentStep: WizardStep;
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
  allVisualizations: {
    flowchart: string;
    mindmap: string;
    journey: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}
