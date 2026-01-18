"use client";

import { useState, useCallback, useEffect } from "react";
import { api, ApiError, NetworkError } from "@/lib/api";
import { StepIndicator } from "./StepIndicator";
import { InputStep } from "./InputStep";
import { QuestionsStep } from "./QuestionsStep";
import { TemplatesStep } from "./TemplatesStep";
import { ResultStep } from "./ResultStep";
import { CompletedStep } from "./CompletedStep";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, WifiOff } from "lucide-react";
import type { WizardState, Answer } from "@/types";

const initialState: WizardState = {
  currentStep: "input",
  sessionId: null,
  rawInput: "",
  programBrief: null,
  questions: [],
  answers: [],
  matchedTemplates: [],
  selectedTemplateId: null,
  generateNew: false,
  lfaDocument: null,
  mermaidCode: "",
  allVisualizations: null,
  isLoading: false,
  error: null,
};

/**
 * Get user-friendly error message from error object
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.userMessage;
  }
  if (error instanceof NetworkError) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

/**
 * Check if error is a network error
 */
function isNetworkError(error: unknown): boolean {
  return error instanceof NetworkError;
}

export function Wizard() {
  const [state, setState] = useState<WizardState>(initialState);
  const [isOnline, setIsOnline] = useState(true);
  const [lastAction, setLastAction] = useState<(() => void) | null>(null);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check API availability on mount
    api.isAvailable().then(setIsOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading, error: null }));
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Retry last action
  const handleRetry = useCallback(() => {
    if (lastAction) {
      clearError();
      lastAction();
    }
  }, [lastAction]);

  // Step 1: Submit initial input
  const handleInputSubmit = useCallback(async (rawInput: string) => {
    const action = async () => {
      setLoading(true);
      try {
        const response = await api.startSession(rawInput);
        setState((prev) => ({
          ...prev,
          currentStep: "questions",
          sessionId: response.session_id,
          rawInput,
          programBrief: response.program_brief,
          questions: response.questions,
          isLoading: false,
        }));
        setLastAction(null);
      } catch (err) {
        setError(getErrorMessage(err));
        setLastAction(() => () => handleInputSubmit(rawInput));
      }
    };
    action();
  }, []);

  // Step 2: Submit answers to questions
  const handleAnswersSubmit = useCallback(
    async (answers: Answer[]) => {
      if (!state.sessionId) return;

      const action = async () => {
        setLoading(true);
        try {
          const response = await api.submitAnswers(state.sessionId!, answers);
          setState((prev) => ({
            ...prev,
            currentStep: "templates",
            answers,
            matchedTemplates: response.matched_templates,
            isLoading: false,
          }));
          setLastAction(null);
        } catch (err) {
          setError(getErrorMessage(err));
          setLastAction(() => () => handleAnswersSubmit(answers));
        }
      };
      action();
    },
    [state.sessionId]
  );

  // Step 3: Select template or generate new
  const handleTemplateSelect = useCallback(
    async (templateId: string | null, generateNew: boolean) => {
      if (!state.sessionId) return;

      const action = async () => {
        setLoading(true);
        try {
          const response = await api.finalize(
            state.sessionId!,
            templateId,
            generateNew
          );
          setState((prev) => ({
            ...prev,
            currentStep: "result",
            selectedTemplateId: templateId,
            generateNew,
            lfaDocument: response.lfa_document,
            mermaidCode: response.mermaid_code,
            allVisualizations: response.all_visualizations || null,
            isLoading: false,
          }));
          setLastAction(null);
        } catch (err) {
          setError(getErrorMessage(err));
          setLastAction(() => () => handleTemplateSelect(templateId, generateNew));
        }
      };
      action();
    },
    [state.sessionId]
  );

  // Handle finish - transition to completed state
  const handleFinish = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: "completed" }));
  }, []);

  // Reset wizard
  const handleReset = useCallback(() => {
    setState(initialState);
    setLastAction(null);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={state.currentStep} />

      {/* Offline warning */}
      {!isOnline && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-center gap-3 py-4">
            <WifiOff className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-700">
              You appear to be offline. Please check your internet connection.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error display with retry option */}
      {state.error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="flex items-center justify-between gap-3 py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-600">{state.error}</p>
            </div>
            {lastAction && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-100"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {state.currentStep === "input" && (
        <InputStep
          onSubmit={handleInputSubmit}
          isLoading={state.isLoading}
        />
      )}

      {state.currentStep === "questions" && state.programBrief && (
        <QuestionsStep
          programBrief={state.programBrief}
          questions={state.questions}
          onSubmit={handleAnswersSubmit}
          isLoading={state.isLoading}
        />
      )}

      {state.currentStep === "templates" && (
        <TemplatesStep
          templates={state.matchedTemplates}
          onSelect={handleTemplateSelect}
          isLoading={state.isLoading}
        />
      )}

      {state.currentStep === "result" && state.lfaDocument && (
        <ResultStep
          lfaDocument={state.lfaDocument}
          mermaidCode={state.mermaidCode}
          allVisualizations={state.allVisualizations || undefined}
          onReset={handleReset}
          onFinish={handleFinish}
          sessionId={state.sessionId || undefined}
        />
      )}

      {state.currentStep === "completed" && state.lfaDocument && (
        <CompletedStep
          lfaDocument={state.lfaDocument}
          onReset={handleReset}
          sessionId={state.sessionId || undefined}
        />
      )}
    </div>
  );
}
