// API Types for LFA Builder

export interface ProgramBrief {
  summary: string;
  goal: string;
  target_audience: string;
  context?: string;
  challenges?: string[];
  // Shikshagraha-specific fields
  program_theme?: string;
  system_level?: string;
  geographic_scope?: string;
  key_stakeholders?: {
    school?: string[];
    cluster?: string[];
    block?: string[];
    district?: string[];
  };
  student_level_change?: string;
}

export interface Question {
  id: string;
  question: string;
  category: string;
  required: boolean;
  stakeholder_level?: string; // school|cluster|block|district|all
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
  responsible_stakeholder?: string; // CRP|BRP|DIET|Teacher|HM
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

export interface StakeholderPracticeChanges {
  teachers?: string[];
  head_masters?: string[];
  crp_crcc?: string[];
  brp_beo?: string[];
  deo_diet?: string[];
}

export interface LFADocument {
  title: string;
  goal: string;
  goal_indicators: string[];
  assumptions: string[];
  outcomes: Outcome[];
  // Shikshagraha-specific fields
  student_level_change?: string;
  program_theme?: string;
  system_level?: string;
  stakeholder_practice_changes?: StakeholderPracticeChanges;
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
  | "result"
  | "completed";

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

// =============================================================================
// STAKEHOLDER INTERVIEW TYPES - "Interview Your LFA" Feature
// =============================================================================

export interface StakeholderPersona {
  id: string;
  name: string;
  hindi_name: string;
  level: "school" | "cluster" | "block" | "district" | "community";
  icon: string;
  color: string;
  description: string;
}

export interface StakeholderFeedbackItem {
  type: "gap" | "risk" | "concern" | "suggestion";
  severity: "critical" | "important" | "minor";
  title: string;
  message: string;
  lfa_reference?: string;
  recommendation?: string;
}

export interface StakeholderIssueSummary {
  critical: number;
  important: number;
  minor: number;
  gaps: number;
  risks: number;
  concerns: number;
  suggestions: number;
  total: number;
}

export interface StakeholderFeedback {
  stakeholder_id: string;
  stakeholder_name: string;
  stakeholder_level: string;
  stakeholder_icon: string;
  stakeholder_color: string;
  greeting: string;
  feedback_items: StakeholderFeedbackItem[];
  overall_sentiment: "supportive" | "cautious" | "skeptical" | "concerned";
  closing_remark: string;
  issue_summary: StakeholderIssueSummary;
  error?: string;
}

export interface StakeholderInterviewRequest {
  session_id?: string;
  stakeholder_id: string;
  lfa_document?: LFADocument;
  conversation_history?: { role: string; content: string }[];
}

export interface AggregatedStakeholderFeedback {
  stakeholder_feedback: Record<string, StakeholderFeedback>;
  aggregated_summary: {
    critical: number;
    important: number;
    minor: number;
    total: number;
  };
  stakeholders_consulted: string[];
}

// ============== Logic Challenger Types ==============

export interface LogicChallengeItem {
  id: string;
  category: "logic_gap" | "unrealistic_assumption" | "missing_activity" | "indicator_weakness" | "stakeholder_blindspot";
  severity: "critical" | "important" | "minor";
  title: string;
  description: string;
  lfa_element?: string;
  logic_break?: string;
  recommendation: string;
  effort_to_fix: "low" | "medium" | "high";
}

export interface LogicAnalysis {
  overall_score: number;
  overall_assessment: string;
  logic_chain_analysis?: {
    strongest_chain?: string;
    weakest_chain?: string;
  };
  challenges: LogicChallengeItem[];
  quick_wins?: Array<{
    action: string;
    impact: string;
  }>;
  summary_stats: {
    critical_issues: number;
    important_issues: number;
    minor_issues: number;
    logic_gaps: number;
    unrealistic_assumptions: number;
    missing_activities: number;
    indicator_weaknesses: number;
    stakeholder_blindspots: number;
  };
  lfa_title?: string;
  analyzed_at?: string;
}

export interface QuickValidation {
  is_valid: boolean;
  critical_issues: Array<{
    issue: string;
    fix: string;
  }>;
  confidence_score: number;
  error?: string;
}

// ============== Scenario Analysis Types ==============

export interface ScenarioTemplate {
  id: string;
  name: string;
  description: string;
  parameters: string[];
}

export interface ScenarioAnalysis {
  scenario_summary: string;
  overall_impact: "critical" | "significant" | "moderate" | "minimal";
  impact_score: number;
  affected_elements: Array<{
    element_type: string;
    element_id: string;
    element_description: string;
    impact_severity: string;
    impact_description: string;
    cascade_effects: string[];
  }>;
  logic_chain_breaks: Array<{
    from_element: string;
    to_element: string;
    break_description: string;
  }>;
  mitigation_strategies: Array<{
    strategy: string;
    priority: "immediate" | "short_term" | "medium_term";
    feasibility: "high" | "medium" | "low";
    responsible_stakeholder: string;
  }>;
  modified_recommendations: Array<{
    original_element: string;
    recommended_change: string;
    reason: string;
  }>;
  assumptions_invalidated: string[];
  resilience_score: number;
  analysis_summary: string;
  scenario_input?: string;
  scenario_type?: string;
  lfa_title?: string;
}
