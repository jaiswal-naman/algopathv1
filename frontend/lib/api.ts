import type {
  StartSessionResponse,
  SubmitAnswersResponse,
  FinalizeResponse,
  Answer,
  StakeholderPersona,
  StakeholderFeedback,
  StakeholderInterviewRequest,
  AggregatedStakeholderFeedback,
  LFADocument,
  LogicAnalysis,
  QuickValidation,
  ScenarioAnalysis,
  ScenarioTemplate,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

/**
 * Custom API error with status code and user-friendly message
 */
class ApiError extends Error {
  public userMessage: string;

  constructor(public status: number, message: string, userMessage?: string) {
    super(message);
    this.name = "ApiError";
    this.userMessage = userMessage || this.getDefaultUserMessage(status, message);
  }

  private getDefaultUserMessage(status: number, message: string): string {
    switch (status) {
      case 400:
        return message || "Invalid request. Please check your input.";
      case 401:
        return "Authentication failed. Please try again.";
      case 404:
        return "Session not found or expired. Please start a new session.";
      case 429:
        return "Too many requests. Please wait a moment and try again.";
      case 500:
        return "Server error. Please try again later.";
      case 503:
        return "Service temporarily unavailable. Please try again later.";
      default:
        if (status >= 500) {
          return "An unexpected error occurred. Please try again.";
        }
        return message || "Something went wrong. Please try again.";
    }
  }
}

/**
 * Network error for connection failures
 */
class NetworkError extends Error {
  public userMessage: string;

  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
    this.userMessage = "Unable to connect to the server. Please check your internet connection.";
  }
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 429 || error.status >= 500;
  }
  if (error instanceof NetworkError) {
    return true;
  }
  return false;
}

/**
 * Fetch with retry logic and proper error handling
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = MAX_RETRIES
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new ApiError(response.status, errorData.detail || "Request failed");
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        // Network error (no connection, DNS failure, etc.)
        lastError = new NetworkError(error.message);
      } else if (error instanceof ApiError) {
        lastError = error;
      } else {
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      // Check if we should retry
      if (attempt < retries && isRetryableError(lastError)) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt); // Exponential backoff
        console.warn(`Request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${retries})`);
        await sleep(delay);
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new Error("Request failed after retries");
}

/**
 * API client for LFA Builder
 */
export const api = {
  /**
   * Check if API is available
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      await fetchApi("/api/health", {}, 0); // No retries for health check
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Start a new LFA building session
   */
  startSession: async (rawInput: string): Promise<StartSessionResponse> => {
    if (!rawInput || rawInput.trim().length < 10) {
      throw new ApiError(400, "Input too short", "Please provide a more detailed program description (at least 10 characters).");
    }

    return fetchApi<StartSessionResponse>("/api/start", {
      method: "POST",
      body: JSON.stringify({ raw_input: rawInput.trim() }),
    });
  },

  /**
   * Submit answers to clarifying questions
   */
  submitAnswers: async (
    sessionId: string,
    answers: Answer[]
  ): Promise<SubmitAnswersResponse> => {
    if (!sessionId) {
      throw new ApiError(400, "Missing session ID", "Session not found. Please start a new session.");
    }

    if (!answers || answers.length === 0) {
      throw new ApiError(400, "No answers provided", "Please answer at least one question.");
    }

    return fetchApi<SubmitAnswersResponse>("/api/answers", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        answers: answers.map(a => ({
          question_id: a.question_id,
          answer: a.answer.trim()
        })),
      }),
    });
  },

  /**
   * Finalize the LFA document
   */
  finalize: async (
    sessionId: string,
    selectedTemplateId: string | null,
    generateNew: boolean
  ): Promise<FinalizeResponse> => {
    if (!sessionId) {
      throw new ApiError(400, "Missing session ID", "Session not found. Please start a new session.");
    }

    return fetchApi<FinalizeResponse>("/api/finalize", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        selected_template_id: selectedTemplateId,
        generate_new: generateNew,
      }),
    });
  },

  /**
   * Get session status
   */
  getSessionStatus: async (sessionId: string) => {
    return fetchApi(`/api/session/${sessionId}`);
  },

  /**
   * Get full session data
   */
  getFullSession: async (sessionId: string) => {
    return fetchApi(`/api/session/${sessionId}/full`);
  },

  /**
   * Export LFA to file
   */
  exportLFA: async (sessionId: string, format: "csv" | "docx"): Promise<Blob> => {
    const url = `${API_BASE_URL}/api/export`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        format: format,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Export failed" }));
      throw new ApiError(response.status, error.detail);
    }

    return response.blob();
  },

  /**
   * Health check
   */
  healthCheck: async () => {
    return fetchApi("/api/health", {}, 0);
  },

  /**
   * Get API statistics
   */
  getStats: async () => {
    return fetchApi("/api/stats");
  },

  // ==========================================================================
  // STAKEHOLDER INTERVIEW APIs - "Interview Your LFA" Feature
  // ==========================================================================

  /**
   * Get available stakeholder personas
   */
  getStakeholders: async (): Promise<{ stakeholders: StakeholderPersona[] }> => {
    return fetchApi<{ stakeholders: StakeholderPersona[] }>("/api/stakeholders");
  },

  /**
   * Interview a single stakeholder about an LFA
   */
  interviewStakeholder: async (
    request: StakeholderInterviewRequest
  ): Promise<StakeholderFeedback> => {
    if (!request.stakeholder_id) {
      throw new ApiError(400, "Missing stakeholder ID", "Please select a stakeholder to interview.");
    }

    if (!request.session_id && !request.lfa_document) {
      throw new ApiError(
        400,
        "Missing LFA data",
        "No LFA document available for stakeholder review."
      );
    }

    return fetchApi<StakeholderFeedback>("/api/stakeholder/interview", {
      method: "POST",
      body: JSON.stringify({
        session_id: request.session_id,
        stakeholder_id: request.stakeholder_id,
        lfa_document: request.lfa_document,
        conversation_history: request.conversation_history,
      }),
    });
  },

  /**
   * Interview multiple stakeholders at once
   */
  interviewAllStakeholders: async (
    sessionId?: string,
    lfaDocument?: LFADocument,
    stakeholderIds?: string[]
  ): Promise<AggregatedStakeholderFeedback> => {
    return fetchApi<AggregatedStakeholderFeedback>("/api/stakeholder/interview-all", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        lfa_document: lfaDocument,
        stakeholder_ids: stakeholderIds,
      }),
    });
  },

  // ============== Logic Challenger (AI Devil's Advocate) ==============

  /**
   * Analyze LFA for logic gaps and weaknesses
   */
  analyzeLFALogic: async (request: {
    session_id?: string;
    lfa_document?: LFADocument;
  }): Promise<LogicAnalysis> => {
    return fetchApi<LogicAnalysis>("/api/lfa/analyze", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  /**
   * Quick validation of LFA (lightweight check)
   */
  quickValidateLFA: async (request: {
    session_id?: string;
    lfa_document?: LFADocument;
  }): Promise<QuickValidation> => {
    return fetchApi<QuickValidation>("/api/lfa/quick-validate", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  // ============== Scenario Analyzer (What-If Engine) ==============

  /**
   * Get available scenario templates
   */
  getScenarioTemplates: async (): Promise<{ templates: ScenarioTemplate[] }> => {
    return fetchApi("/api/scenarios/templates");
  },

  /**
   * Analyze what-if scenario impact on LFA
   */
  analyzeScenario: async (request: {
    session_id?: string;
    lfa_document?: LFADocument;
    scenario_description: string;
    scenario_type?: string;
    parameters?: Record<string, unknown>;
  }): Promise<ScenarioAnalysis> => {
    return fetchApi<ScenarioAnalysis>("/api/scenarios/analyze", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },
};

export { ApiError, NetworkError };
