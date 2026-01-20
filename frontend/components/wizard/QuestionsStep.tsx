"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { StakeholderPyramid } from "./StakeholderPyramid";
import type { Question, Answer, ProgramBrief } from "@/types";
import { CheckCircle, Circle, HelpCircle } from "lucide-react";

interface QuestionsStepProps {
  programBrief: ProgramBrief;
  questions: Question[];
  onSubmit: (answers: Answer[]) => Promise<void>;
  isLoading: boolean;
}

// Shikshagraha-aligned category colors
const categoryColors: Record<string, string> = {
  // Original categories
  scope: "bg-blue-500",
  resources: "bg-green-500",
  timeline: "bg-yellow-500",
  measurement: "bg-purple-500",
  risks: "bg-red-500",
  stakeholders: "bg-orange-500",
  sustainability: "bg-teal-500",
  // Shikshagraha stakeholder categories
  student_outcomes: "bg-orange-500",
  teacher_practice: "bg-green-500",
  hm_practice: "bg-emerald-500",
  crp_role: "bg-blue-500",
  block_support: "bg-indigo-500",
  district_alignment: "bg-purple-500",
};

// Map question category to stakeholder level for highlighting
const categoryToLevel: Record<string, string> = {
  student_outcomes: "school",
  teacher_practice: "school",
  hm_practice: "school",
  crp_role: "cluster",
  block_support: "block",
  district_alignment: "district",
};

export function QuestionsStep({
  programBrief,
  questions,
  onSubmit,
  isLoading,
}: QuestionsStepProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Initialize answers object
    const initial: Record<string, string> = {};
    questions.forEach((q) => {
      initial[q.id] = "";
    });
    setAnswers(initial);
  }, [questions]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const answerList: Answer[] = Object.entries(answers).map(([id, answer]) => ({
      question_id: id,
      answer,
    }));
    await onSubmit(answerList);
  };

  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length;
  const requiredCount = questions.filter((q) => q.required).length;
  const requiredAnswered = questions
    .filter((q) => q.required)
    .every((q) => answers[q.id]?.trim().length > 0);

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-6">
      {/* Program Summary */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Your Program Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{programBrief.summary}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{programBrief.target_audience}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {answeredCount} of {questions.length} questions answered
        </span>
        <span>
          {requiredCount} required
        </span>
      </div>

      {/* Questions Navigator */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {questions.map((q, index) => {
          const isAnswered = answers[q.id]?.trim().length > 0;
          const isCurrent = index === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 p-2 rounded-md border transition-colors ${
                isCurrent
                  ? "border-primary bg-primary/10"
                  : isAnswered
                  ? "border-green-500 bg-green-500/10"
                  : "border-muted hover:border-muted-foreground"
              }`}
            >
              {isAnswered ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          );
        })}
      </div>

      {/* Current Question with Stakeholder Pyramid */}
      {currentQuestion && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge
                      className={categoryColors[currentQuestion.category] || "bg-gray-500"}
                    >
                      {currentQuestion.category.replace(/_/g, " ")}
                    </Badge>
                    {currentQuestion.required && (
                      <Badge variant="destructive" className="ml-2">
                        Required
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentIndex + 1} / {questions.length}
                  </span>
                </div>
                <CardTitle className="text-lg mt-2">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Type your answer here..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                  rows={4}
                  disabled={isLoading}
                />
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </Button>
                  {currentIndex < questions.length - 1 ? (
                    <Button
                      onClick={() =>
                        setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
                      }
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={!requiredAnswered || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : (
                        "Find Templates"
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stakeholder Pyramid - shows on larger screens */}
          <div className="hidden lg:block">
            <StakeholderPyramid
              highlightLevel={categoryToLevel[currentQuestion.category]}
            />
          </div>
        </div>
      )}

      {/* Quick Submit */}
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={!requiredAnswered || isLoading}
          variant="outline"
          className="text-sm"
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          Skip remaining and continue
        </Button>
      </div>
    </div>
  );
}
