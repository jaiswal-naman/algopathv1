"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { StakeholderPyramid } from "./StakeholderPyramid";
import type { Question, Answer, ProgramBrief } from "@/types";
import { CheckCircle, Circle } from "lucide-react";

interface QuestionsStepProps {
  programBrief: ProgramBrief;
  questions: Question[];
  onSubmit: (answers: Answer[]) => Promise<void>;
  isLoading: boolean;
}

// Shikshagraha-aligned category colors
const categoryColors: Record<string, string> = {
  scope: "bg-blue-500",
  resources: "bg-green-500",
  timeline: "bg-yellow-500",
  measurement: "bg-purple-500",
  risks: "bg-red-500",
  stakeholders: "bg-orange-500",
  sustainability: "bg-teal-500",
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
      {/* Progress Indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-400">
            {answeredCount} of {questions.length} questions answered
          </span>
          <span className="text-slate-400">
            {requiredCount} required
          </span>
        </div>

        {/* Circular Progress Indicators */}
        <div className="flex gap-2 flex-wrap">
          {questions.map((q, index) => {
            const isAnswered = answers[q.id]?.trim().length > 0;
            const isCurrent = index === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${isCurrent
                  ? "border-emerald-500 bg-emerald-500"
                  : isAnswered
                    ? "border-emerald-500 bg-transparent"
                    : "border-slate-600 bg-transparent"
                  }`}
                aria-label={`Question ${index + 1}`}
              >
                {isCurrent ? (
                  <Circle className="h-5 w-5 text-white fill-white" />
                ) : isAnswered ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content: Question at top, Hierarchy below */}
      {currentQuestion && (
        <div className="space-y-6">
          {/* Question Card - Full width at top */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                  <Badge
                    className={`${categoryColors[currentQuestion.category] || "bg-gray-500"} text-white`}
                  >
                    {currentQuestion.category.replace(/_/g, " ")}
                  </Badge>
                  {currentQuestion.required && (
                    <Badge variant="destructive">
                      Required
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-slate-400">
                  {currentIndex + 1} / {questions.length}
                </span>
              </div>
              <CardTitle className="text-xl text-white font-normal leading-relaxed">
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
                rows={6}
                disabled={isLoading}
                className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
              />
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                >
                  Previous
                </Button>
                {currentIndex < questions.length - 1 ? (
                  <Button
                    onClick={() =>
                      setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))
                    }
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!requiredAnswered || isLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : (
                      "Submit Answers"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stakeholder Pyramid - Full width below question */}
          <div>
            <StakeholderPyramid
              highlightLevel={categoryToLevel[currentQuestion.category]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
