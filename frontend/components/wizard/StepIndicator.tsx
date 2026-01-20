"use client";

import { cn } from "@/lib/utils";
import { Check, Target, Search, FileText, Trophy } from "lucide-react";
import type { WizardStep } from "@/types";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

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
  const progress = currentStep === "completed" ? 100 : Math.round((currentIndex / steps.length) * 100);

  return (
    <nav aria-label="Progress" className="mb-6 md:mb-8">
      {/* Progress percentage */}
      <motion.div
        className="flex justify-between items-center mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-xs md:text-sm font-medium text-slate-400">
          Progress
        </span>
        <motion.span
          className="text-xs md:text-sm font-bold text-emerald-400"
          key={progress}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {progress}% Complete
        </motion.span>
      </motion.div>

      <div className="h-2 bg-slate-700 rounded-full mb-4 md:mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
                  <motion.div
                    className={cn(
                      "h-0.5 flex-1 transition-colors duration-300 hidden sm:block"
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: 1,
                      backgroundColor: index - 1 < currentIndex ? "#10b981" : "#334155"
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    style={{ originX: 0 }}
                  />
                )}
                <motion.div
                  className={cn(
                    "flex items-center justify-center rounded-full border-2 transition-all duration-300 flex-shrink-0",
                    "h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12",
                    isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : isCurrent
                        ? "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 ring-2 ring-emerald-500/30"
                        : "border-slate-600 bg-slate-800 text-slate-500"
                  )}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={isCurrent ? {
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: isCurrent ? Infinity : 0,
                        ease: "easeInOut"
                      }}
                    >
                      <StepIcon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    </motion.div>
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <motion.div
                    className={cn(
                      "h-0.5 flex-1 transition-colors duration-300 hidden sm:block"
                    )}
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: 1,
                      backgroundColor: isCompleted ? "#10b981" : "#334155"
                    }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    style={{ originX: 0 }}
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
              <motion.div
                key={step.id}
                className="flex-1 text-center px-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 + 0.3 }}
              >
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
