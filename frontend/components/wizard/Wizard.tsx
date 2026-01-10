"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { StepIndicator } from "./StepIndicator";
import { InputStep } from "./InputStep";
import { QuestionsStep } from "./QuestionsStep";
import { TemplatesStep } from "./TemplatesStep";
import { ResultStep } from "./ResultStep";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
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

export function Wizard() {
  const [state, setState] = useState<WizardState>(initialState);

  const setLoading = (isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading, error: null }));
  };

  const setError = (error: string) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  };

  // Step 1: Submit initial input
  const handleInputSubmit = useCallback(async (rawInput: string) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start session");
    }
  }, []);

  // Step 2: Submit answers to questions
  const handleAnswersSubmit = useCallback(
    async (answers: Answer[]) => {
      if (!state.sessionId) return;
      setLoading(true);
      try {
        const response = await api.submitAnswers(state.sessionId, answers);
        setState((prev) => ({
          ...prev,
          currentStep: "templates",
          answers,
          matchedTemplates: response.matched_templates,
          isLoading: false,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit answers");
      }
    },
    [state.sessionId]
  );

  // Step 3: Select template or generate new
  const handleTemplateSelect = useCallback(
    async (templateId: string | null, generateNew: boolean) => {
      if (!state.sessionId) return;
      setLoading(true);
      try {
        const response = await api.finalize(
          state.sessionId,
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate LFA");
      }
    },
    [state.sessionId]
  );

  // Reset wizard
  const handleReset = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={state.currentStep} />

      {state.error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-600">{state.error}</p>
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
        />
      )}
    </div>
  );
}
