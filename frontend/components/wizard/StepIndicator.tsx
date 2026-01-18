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
  // Progress shows completed steps only (0%, 25%, 50%, 75%, 100%)
  // If currentStep is "completed", show 100%
  const progress = currentStep === "completed" ? 100 : Math.round((currentIndex / steps.length) * 100);

  return (
    <nav aria-label="Progress" className="mb-6 md:mb-8">
      {/* Progress percentage */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs md:text-sm font-medium text-slate-400">
          Progress
        </span>
        <span className="text-xs md:text-sm font-bold text-emerald-400">
          {progress}% Complete
        </span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full mb-4 md:mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Icons and connecting lines */}
        <div className="flex items-center justify-between mb-2 md:mb-3">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {index > 0 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors duration-300 hidden sm:block",
                      // Line is filled if previous step is completed
                      index - 1 < currentIndex ? "bg-emerald-500" : "bg-slate-700"
                    )}
                  />
                )}
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0",
                    "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : isCurrent
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-500/30"
                        : "border-slate-600 bg-slate-800 text-slate-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  ) : (
                    <StepIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 transition-colors duration-300 hidden sm:block",
                      // Line is filled only if current step is completed
                      isCompleted ? "bg-emerald-500" : "bg-slate-700"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Text labels centered below icons */}
        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.id} className="flex-1 text-center px-1">
                <p
                  className={cn(
                    "text-xs sm:text-sm font-medium",
                    isCurrent ? "text-white font-bold" : isCompleted ? "text-emerald-500/70" : "text-slate-400"
                  )}
                >
                  {step.title}
                </p>
                <p
                  className={cn(
                    "text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-0.5",
                    isCurrent ? "text-emerald-400" : isCompleted ? "text-emerald-500/70" : "text-slate-500"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-500 hidden md:block mt-0.5">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
