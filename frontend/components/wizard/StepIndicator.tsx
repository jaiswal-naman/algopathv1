"use client";

import { cn } from "@/lib/utils";
import { Check, Target, Search, FileText, Trophy } from "lucide-react";
import type { WizardStep } from "@/types";
import type { LucideIcon } from "lucide-react";

interface Step {
  id: WizardStep;
  label: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const steps: Step[] = [
  { id: "input", label: "Level 1", title: "Define", description: "Define the Challenge", icon: Target },
  { id: "questions", label: "Level 2", title: "Deep Dive", description: "Answer Key Questions", icon: Search },
  { id: "templates", label: "Level 3", title: "Match", description: "Find Your Pattern", icon: FileText },
  { id: "result", label: "Level 4", title: "Framework", description: "Your LFA Ready!", icon: Trophy },
];

const stepOrder: WizardStep[] = ["input", "questions", "templates", "result"];

interface StepIndicatorProps {
  currentStep: WizardStep;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = stepOrder.indexOf(currentStep);
  const progress = Math.round(((currentIndex + 1) / steps.length) * 100);

  return (
    <nav aria-label="Progress" className="mb-8">
      {/* Progress percentage */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Progress
        </span>
        <span className="text-sm font-bold text-primary">
          {progress}% Complete
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = step.icon;

          return (
            <li key={step.id} className="flex-1">
              <div className="flex flex-col items-center">
                <div className="flex items-center w-full">
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors duration-300",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : isCurrent
                        ? "border-primary bg-primary/10 text-primary animate-pulse"
                        : "border-muted bg-background text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <StepIcon className="h-5 w-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 transition-colors duration-300",
                        isCompleted ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-xs font-bold uppercase tracking-wider",
                      isCurrent ? "text-primary" : isCompleted ? "text-primary/70" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-medium mt-0.5",
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground hidden sm:block mt-0.5">
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
