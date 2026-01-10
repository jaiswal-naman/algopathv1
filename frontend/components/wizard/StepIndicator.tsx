"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { WizardStep } from "@/types";

interface Step {
  id: WizardStep;
  label: string;
  description: string;
}

const steps: Step[] = [
  { id: "input", label: "Describe", description: "Tell us about your program" },
  { id: "questions", label: "Clarify", description: "Answer key questions" },
  { id: "templates", label: "Choose", description: "Select a template" },
  { id: "result", label: "View", description: "See your LFA" },
];

const stepOrder: WizardStep[] = ["input", "questions", "templates", "result"];

interface StepIndicatorProps {
  currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li key={step.id} className="flex-1">
              <div className="flex flex-col items-center">
                <div className="flex items-center w-full">
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary bg-background text-primary"
                        : "border-muted bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
