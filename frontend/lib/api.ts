import type {
  StartSessionResponse,
  SubmitAnswersResponse,
  FinalizeResponse,
  Answer,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    throw new ApiError(response.status, error.detail || "Request failed");
  }

  return response.json();
}

export const api = {
  /**
   * Start a new LFA building session
   */
  startSession: async (rawInput: string): Promise<StartSessionResponse> => {
    return fetchApi<StartSessionResponse>("/api/start", {
      method: "POST",
      body: JSON.stringify({ raw_input: rawInput }),
    });
  },

  /**
   * Submit answers to clarifying questions
   */
  submitAnswers: async (
    sessionId: string,
    answers: Answer[]
  ): Promise<SubmitAnswersResponse> => {
    return fetchApi<SubmitAnswersResponse>("/api/answers", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        answers: answers,
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
   * Health check
   */
  healthCheck: async () => {
    return fetchApi("/api/health");
  },
};

export { ApiError };
