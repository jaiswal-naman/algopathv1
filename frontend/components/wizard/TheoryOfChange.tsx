"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { LFADocument } from "@/types";
import {
  Play,
  Pause,
  RotateCcw,
  Target,
  Package,
  Activity,
  TrendingUp,
  Star,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";

interface TheoryOfChangeProps {
  lfaDocument: LFADocument;
}

// Color scheme for different chain levels
const LEVEL_COLORS = {
  activities: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-300 dark:border-amber-700",
    text: "text-amber-700 dark:text-amber-300",
    glow: "shadow-amber-500/50",
  },
  outputs: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-700 dark:text-blue-300",
    glow: "shadow-blue-500/50",
  },
  outcomes: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    border: "border-purple-300 dark:border-purple-700",
    text: "text-purple-700 dark:text-purple-300",
    glow: "shadow-purple-500/50",
  },
  goal: {
    bg: "bg-green-100 dark:bg-green-900/30",
    border: "border-green-300 dark:border-green-700",
    text: "text-green-700 dark:text-green-300",
    glow: "shadow-green-500/50",
  },
};

export function TheoryOfChange({ lfaDocument }: TheoryOfChangeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showParticles, setShowParticles] = useState(true);

  // Build the chain data
  const chainData = useMemo(() => {
    const activities: string[] = [];
    const outputs: string[] = [];
    const outcomes: string[] = [];

    lfaDocument.outcomes.forEach((outcome) => {
      outcomes.push(outcome.description);
      outcome.outputs.forEach((output) => {
        outputs.push(output.description);
        output.activities.forEach((activity) => {
          activities.push(activity.description);
        });
      });
    });

    return {
      activities: activities.slice(0, 4),
      outputs: outputs.slice(0, 3),
      outcomes: outcomes.slice(0, 2),
      goal: lfaDocument.goal,
    };
  }, [lfaDocument]);

  // Total steps: activities -> outputs -> outcomes -> goal
  const totalSteps =
    chainData.activities.length +
    chainData.outputs.length +
    chainData.outcomes.length +
    1;

  // Animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }

    return () => clearInterval(interval);
  }, [isPlaying, totalSteps]);

  const resetAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (currentStep >= totalSteps - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Determine which items are active
  const getActiveState = (
    level: "activities" | "outputs" | "outcomes" | "goal",
    index: number
  ) => {
    let threshold = 0;

    if (level === "activities") {
      threshold = index;
    } else if (level === "outputs") {
      threshold = chainData.activities.length + index;
    } else if (level === "outcomes") {
      threshold =
        chainData.activities.length + chainData.outputs.length + index;
    } else {
      threshold =
        chainData.activities.length +
        chainData.outputs.length +
        chainData.outcomes.length;
    }

    return currentStep >= threshold;
  };

  // Get connector state
  const getConnectorState = (fromLevel: string, toLevel: string) => {
    if (fromLevel === "activities" && toLevel === "outputs") {
      return currentStep >= chainData.activities.length;
    }
    if (fromLevel === "outputs" && toLevel === "outcomes") {
      return (
        currentStep >= chainData.activities.length + chainData.outputs.length
      );
    }
    if (fromLevel === "outcomes" && toLevel === "goal") {
      return (
        currentStep >=
        chainData.activities.length +
          chainData.outputs.length +
          chainData.outcomes.length
      );
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Theory of Change
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Watch how your activities lead to impact
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetAnimation}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button onClick={togglePlay} size="sm">
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Play
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 via-blue-500 via-purple-500 to-green-500 transition-all duration-500"
          style={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        />
        {showParticles && isPlaying && (
          <div
            className="absolute h-4 w-4 -top-1 rounded-full bg-white shadow-lg animate-pulse"
            style={{ left: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          >
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>

      {/* Main Visualization */}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <div className="flex items-stretch gap-4 min-w-[900px]">
            {/* Activities Column */}
            <div className="flex-1 space-y-3">
              <div
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  getActiveState("activities", 0)
                    ? `${LEVEL_COLORS.activities.bg} ${LEVEL_COLORS.activities.border} border-2`
                    : "bg-muted/50"
                }`}
              >
                <Activity
                  className={`h-5 w-5 ${
                    getActiveState("activities", 0)
                      ? LEVEL_COLORS.activities.text
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-medium text-sm">Activities</span>
              </div>
              {chainData.activities.map((activity, idx) => (
                <div
                  key={idx}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-500
                    ${
                      getActiveState("activities", idx)
                        ? `${LEVEL_COLORS.activities.bg} ${LEVEL_COLORS.activities.border} scale-[1.02] shadow-lg ${LEVEL_COLORS.activities.glow}`
                        : "bg-muted/30 border-muted opacity-50"
                    }
                  `}
                >
                  <p className="text-sm line-clamp-2">{activity}</p>
                  {getActiveState("activities", idx) && (
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${LEVEL_COLORS.activities.text}`}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Connector 1 */}
            <div className="flex items-center justify-center w-12">
              <div
                className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                  getConnectorState("activities", "outputs")
                    ? "opacity-100"
                    : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-1 rounded-full ${
                    getConnectorState("activities", "outputs")
                      ? "bg-gradient-to-r from-amber-500 to-blue-500"
                      : "bg-muted"
                  }`}
                />
                <ArrowRight
                  className={`h-6 w-6 ${
                    getConnectorState("activities", "outputs")
                      ? "text-blue-500 animate-pulse"
                      : "text-muted"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground">
                  produces
                </span>
              </div>
            </div>

            {/* Outputs Column */}
            <div className="flex-1 space-y-3">
              <div
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  getConnectorState("activities", "outputs")
                    ? `${LEVEL_COLORS.outputs.bg} ${LEVEL_COLORS.outputs.border} border-2`
                    : "bg-muted/50"
                }`}
              >
                <Package
                  className={`h-5 w-5 ${
                    getConnectorState("activities", "outputs")
                      ? LEVEL_COLORS.outputs.text
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-medium text-sm">Outputs</span>
              </div>
              {chainData.outputs.map((output, idx) => (
                <div
                  key={idx}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-500
                    ${
                      getActiveState("outputs", idx)
                        ? `${LEVEL_COLORS.outputs.bg} ${LEVEL_COLORS.outputs.border} scale-[1.02] shadow-lg ${LEVEL_COLORS.outputs.glow}`
                        : "bg-muted/30 border-muted opacity-50"
                    }
                  `}
                >
                  <p className="text-sm line-clamp-2">{output}</p>
                  {getActiveState("outputs", idx) && (
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${LEVEL_COLORS.outputs.text}`}
                    >
                      <Package className="h-3 w-3 mr-1" />
                      Delivered
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Connector 2 */}
            <div className="flex items-center justify-center w-12">
              <div
                className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                  getConnectorState("outputs", "outcomes")
                    ? "opacity-100"
                    : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-1 rounded-full ${
                    getConnectorState("outputs", "outcomes")
                      ? "bg-gradient-to-r from-blue-500 to-purple-500"
                      : "bg-muted"
                  }`}
                />
                <ArrowRight
                  className={`h-6 w-6 ${
                    getConnectorState("outputs", "outcomes")
                      ? "text-purple-500 animate-pulse"
                      : "text-muted"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground">
                  achieves
                </span>
              </div>
            </div>

            {/* Outcomes Column */}
            <div className="flex-1 space-y-3">
              <div
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  getConnectorState("outputs", "outcomes")
                    ? `${LEVEL_COLORS.outcomes.bg} ${LEVEL_COLORS.outcomes.border} border-2`
                    : "bg-muted/50"
                }`}
              >
                <TrendingUp
                  className={`h-5 w-5 ${
                    getConnectorState("outputs", "outcomes")
                      ? LEVEL_COLORS.outcomes.text
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-medium text-sm">Outcomes</span>
              </div>
              {chainData.outcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className={`
                    p-3 rounded-lg border-2 transition-all duration-500
                    ${
                      getActiveState("outcomes", idx)
                        ? `${LEVEL_COLORS.outcomes.bg} ${LEVEL_COLORS.outcomes.border} scale-[1.02] shadow-lg ${LEVEL_COLORS.outcomes.glow}`
                        : "bg-muted/30 border-muted opacity-50"
                    }
                  `}
                >
                  <p className="text-sm line-clamp-2">{outcome}</p>
                  {getActiveState("outcomes", idx) && (
                    <Badge
                      variant="outline"
                      className={`mt-2 text-xs ${LEVEL_COLORS.outcomes.text}`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Achieved
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Connector 3 */}
            <div className="flex items-center justify-center w-12">
              <div
                className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                  getConnectorState("outcomes", "goal")
                    ? "opacity-100"
                    : "opacity-30"
                }`}
              >
                <div
                  className={`w-8 h-1 rounded-full ${
                    getConnectorState("outcomes", "goal")
                      ? "bg-gradient-to-r from-purple-500 to-green-500"
                      : "bg-muted"
                  }`}
                />
                <ArrowRight
                  className={`h-6 w-6 ${
                    getConnectorState("outcomes", "goal")
                      ? "text-green-500 animate-pulse"
                      : "text-muted"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground">
                  creates
                </span>
              </div>
            </div>

            {/* Goal Column */}
            <div className="flex-1 space-y-3">
              <div
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  getConnectorState("outcomes", "goal")
                    ? `${LEVEL_COLORS.goal.bg} ${LEVEL_COLORS.goal.border} border-2`
                    : "bg-muted/50"
                }`}
              >
                <Target
                  className={`h-5 w-5 ${
                    getConnectorState("outcomes", "goal")
                      ? LEVEL_COLORS.goal.text
                      : "text-muted-foreground"
                  }`}
                />
                <span className="font-medium text-sm">Impact / Goal</span>
              </div>
              <div
                className={`
                  p-4 rounded-lg border-2 transition-all duration-500
                  ${
                    getActiveState("goal", 0)
                      ? `${LEVEL_COLORS.goal.bg} ${LEVEL_COLORS.goal.border} scale-[1.02] shadow-xl ${LEVEL_COLORS.goal.glow}`
                      : "bg-muted/30 border-muted opacity-50"
                  }
                `}
              >
                <p className="text-sm font-medium">{chainData.goal}</p>
                {getActiveState("goal", 0) && (
                  <div className="mt-3 flex items-center gap-2">
                    <Badge className="bg-green-500">
                      <Star className="h-3 w-3 mr-1" />
                      Impact Achieved!
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span>Activities</span>
        </div>
        <ChevronRight className="h-4 w-4" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Outputs</span>
        </div>
        <ChevronRight className="h-4 w-4" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Outcomes</span>
        </div>
        <ChevronRight className="h-4 w-4" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Goal</span>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <Activity className="h-6 w-6 mx-auto text-amber-500 mb-2" />
              <p className="text-2xl font-bold">{chainData.activities.length}</p>
              <p className="text-xs text-muted-foreground">Activities</p>
            </div>
            <div>
              <Package className="h-6 w-6 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold">{chainData.outputs.length}</p>
              <p className="text-xs text-muted-foreground">Outputs</p>
            </div>
            <div>
              <TrendingUp className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold">{chainData.outcomes.length}</p>
              <p className="text-xs text-muted-foreground">Outcomes</p>
            </div>
            <div>
              <Target className="h-6 w-6 mx-auto text-green-500 mb-2" />
              <p className="text-2xl font-bold">1</p>
              <p className="text-xs text-muted-foreground">Goal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
