"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { LFADocument } from "@/types";
import {
  Target,
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Award,
  Star,
  Zap,
  ArrowUp,
  ArrowDown,
  Activity,
  Clock,
  FileText,
} from "lucide-react";

// Scoring dimensions with weights
const SCORING_DIMENSIONS = [
  {
    id: "smart_indicators",
    name: "SMART Indicators",
    description: "Indicators that are Specific, Measurable, Achievable, Relevant, Time-bound",
    icon: Target,
    weight: 20,
    color: "blue",
  },
  {
    id: "stakeholder_coverage",
    name: "Stakeholder Coverage",
    description: "Activities distributed across all education hierarchy levels",
    icon: Users,
    weight: 20,
    color: "green",
  },
  {
    id: "logic_chain",
    name: "Logic Chain Strength",
    description: "Clear causal links from Activities to Outputs to Outcomes to Goal",
    icon: TrendingUp,
    weight: 25,
    color: "purple",
  },
  {
    id: "assumption_risk",
    name: "Assumption Risk",
    description: "Realistic assumptions with mitigation strategies",
    icon: Shield,
    weight: 15,
    color: "orange",
  },
  {
    id: "measurability",
    name: "Measurability",
    description: "Indicators with baselines, targets, and data sources",
    icon: BarChart3,
    weight: 20,
    color: "teal",
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; fill: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600", fill: "bg-blue-500" },
  green: { bg: "bg-green-100", text: "text-green-600", fill: "bg-green-500" },
  purple: { bg: "bg-purple-100", text: "text-purple-600", fill: "bg-purple-500" },
  orange: { bg: "bg-orange-100", text: "text-orange-600", fill: "bg-orange-500" },
  teal: { bg: "bg-teal-100", text: "text-teal-600", fill: "bg-teal-500" },
};

interface DimensionScore {
  id: string;
  score: number;
  maxScore: number;
  percentage: number;
  issues: string[];
  suggestions: string[];
}

interface HealthScoreDashboardProps {
  lfaDocument: LFADocument;
}

export function HealthScoreDashboard({ lfaDocument }: HealthScoreDashboardProps) {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Calculate scores for each dimension
  const dimensionScores = useMemo((): Record<string, DimensionScore> => {
    const scores: Record<string, DimensionScore> = {};

    // 1. SMART Indicators Score
    const indicators = collectAllIndicators(lfaDocument);
    const smartScore = calculateSmartScore(indicators);
    scores.smart_indicators = smartScore;

    // 2. Stakeholder Coverage Score
    const stakeholderScore = calculateStakeholderCoverage(lfaDocument);
    scores.stakeholder_coverage = stakeholderScore;

    // 3. Logic Chain Strength
    const logicScore = calculateLogicChainStrength(lfaDocument);
    scores.logic_chain = logicScore;

    // 4. Assumption Risk Score
    const assumptionScore = calculateAssumptionScore(lfaDocument);
    scores.assumption_risk = assumptionScore;

    // 5. Measurability Score
    const measurabilityScore = calculateMeasurabilityScore(lfaDocument);
    scores.measurability = measurabilityScore;

    return scores;
  }, [lfaDocument]);

  // Calculate overall score
  const overallScore = useMemo(() => {
    let weightedSum = 0;
    let totalWeight = 0;

    SCORING_DIMENSIONS.forEach((dim) => {
      const score = dimensionScores[dim.id];
      if (score) {
        weightedSum += score.percentage * dim.weight;
        totalWeight += dim.weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }, [dimensionScores]);

  // Get grade and badge
  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", label: "Excellent", color: "text-green-600", badge: "emerald" };
    if (score >= 80) return { grade: "A", label: "Very Good", color: "text-green-500", badge: "green" };
    if (score >= 70) return { grade: "B", label: "Good", color: "text-blue-500", badge: "blue" };
    if (score >= 60) return { grade: "C", label: "Acceptable", color: "text-amber-500", badge: "amber" };
    if (score >= 50) return { grade: "D", label: "Needs Work", color: "text-orange-500", badge: "orange" };
    return { grade: "F", label: "Critical", color: "text-red-500", badge: "red" };
  };

  const gradeInfo = getGrade(overallScore);

  // Collect improvement suggestions
  const topSuggestions = useMemo(() => {
    const allSuggestions: Array<{ dimension: string; suggestion: string; impact: number }> = [];

    SCORING_DIMENSIONS.forEach((dim) => {
      const score = dimensionScores[dim.id];
      if (score && score.percentage < 80) {
        score.suggestions.forEach((suggestion, idx) => {
          allSuggestions.push({
            dimension: dim.name,
            suggestion,
            impact: (100 - score.percentage) * dim.weight / 100,
          });
        });
      }
    });

    return allSuggestions
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5);
  }, [dimensionScores]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            LFA Health Score
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Quality assessment across 5 key dimensions
          </p>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Big Score Circle */}
              <div className="relative">
                <div
                  className={`w-28 h-28 rounded-full flex items-center justify-center border-4 ${
                    overallScore >= 70
                      ? "border-green-500 bg-green-50"
                      : overallScore >= 50
                      ? "border-amber-500 bg-amber-50"
                      : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="text-center">
                    <span className={`text-4xl font-bold ${gradeInfo.color}`}>
                      {overallScore}
                    </span>
                    <p className="text-xs text-muted-foreground">/ 100</p>
                  </div>
                </div>
                <div
                  className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    overallScore >= 70
                      ? "bg-green-500"
                      : overallScore >= 50
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                >
                  {gradeInfo.grade}
                </div>
              </div>

              {/* Grade Info */}
              <div>
                <p className={`text-2xl font-bold ${gradeInfo.color}`}>
                  {gradeInfo.label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your LFA is{" "}
                  {overallScore >= 70
                    ? "well-structured"
                    : overallScore >= 50
                    ? "functional but needs improvement"
                    : "missing critical elements"}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <Star className="h-4 w-4 text-amber-500" />
                  <Star className="h-4 w-4 text-amber-500" />
                  <Star
                    className={`h-4 w-4 ${
                      overallScore >= 60 ? "text-amber-500" : "text-muted"
                    }`}
                  />
                  <Star
                    className={`h-4 w-4 ${
                      overallScore >= 80 ? "text-amber-500" : "text-muted"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg bg-background/50">
                <p className="text-2xl font-bold">{lfaDocument.outcomes.length}</p>
                <p className="text-xs text-muted-foreground">Outcomes</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <p className="text-2xl font-bold">
                  {lfaDocument.outcomes.reduce((acc, o) => acc + o.outputs.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Outputs</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <p className="text-2xl font-bold">
                  {lfaDocument.outcomes.reduce(
                    (acc, o) =>
                      acc + o.outputs.reduce((acc2, op) => acc2 + op.activities.length, 0),
                    0
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Activities</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Dimension Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {SCORING_DIMENSIONS.map((dim) => {
          const score = dimensionScores[dim.id];
          const colors = COLOR_MAP[dim.color];
          const Icon = dim.icon;
          const isExpanded = showDetails === dim.id;

          return (
            <Card
              key={dim.id}
              className={`cursor-pointer transition-all ${
                isExpanded ? "ring-2 ring-primary" : "hover:shadow-md"
              }`}
              onClick={() => setShowDetails(isExpanded ? null : dim.id)}
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`h-4 w-4 ${colors.text}`} />
                  </div>
                  <span className={`text-xl font-bold ${colors.text}`}>
                    {score?.percentage || 0}%
                  </span>
                </div>
                <p className="text-sm font-medium truncate">{dim.name}</p>
                <Progress
                  value={score?.percentage || 0}
                  className="h-1.5 mt-2"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Weight: {dim.weight}%</span>
                  {score && score.issues.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {score.issues.length} issues
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Expanded Dimension Details */}
      {showDetails && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                {(() => {
                  const dim = SCORING_DIMENSIONS.find((d) => d.id === showDetails);
                  const Icon = dim?.icon || Target;
                  return <Icon className="h-5 w-5" />;
                })()}
                {SCORING_DIMENSIONS.find((d) => d.id === showDetails)?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowDetails(null)}>
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {SCORING_DIMENSIONS.find((d) => d.id === showDetails)?.description}
            </p>

            {dimensionScores[showDetails]?.issues.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-500" />
                  Issues Found
                </p>
                <ul className="space-y-1">
                  {dimensionScores[showDetails].issues.map((issue, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {dimensionScores[showDetails]?.suggestions.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2 flex items-center gap-1">
                  <Lightbulb className="h-4 w-4 text-green-500" />
                  Suggestions to Improve
                </p>
                <ul className="space-y-1">
                  {dimensionScores[showDetails].suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <Zap className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Top Improvement Suggestions */}
      {topSuggestions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Top Ways to Improve Your Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSuggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{item.suggestion}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.dimension}
                      </Badge>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <ArrowUp className="h-3 w-3" />
                        +{Math.round(item.impact)} potential points
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper functions for score calculation

function collectAllIndicators(lfa: LFADocument): string[] {
  const indicators: string[] = [...lfa.goal_indicators];

  lfa.outcomes.forEach((outcome) => {
    indicators.push(...outcome.indicators);
    outcome.outputs.forEach((output) => {
      indicators.push(...output.indicators);
      output.activities.forEach((activity) => {
        indicators.push(...activity.indicators);
      });
    });
  });

  return indicators;
}

function calculateSmartScore(indicators: string[]): DimensionScore {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let smartCount = 0;

  // Keywords for SMART indicators
  const measureKeywords = ["%", "number", "count", "rate", "score", "level", "increase", "decrease", "by"];
  const timeKeywords = ["by", "within", "annually", "monthly", "quarterly", "year", "month"];

  indicators.forEach((indicator, idx) => {
    const lower = indicator.toLowerCase();
    const hasMeasure = measureKeywords.some((kw) => lower.includes(kw));
    const hasTime = timeKeywords.some((kw) => lower.includes(kw));

    if (hasMeasure && hasTime) {
      smartCount++;
    } else if (!hasMeasure) {
      if (issues.length < 3) {
        issues.push(`Indicator "${indicator.slice(0, 50)}..." lacks measurable target`);
      }
    }
  });

  const percentage = indicators.length > 0 ? Math.round((smartCount / indicators.length) * 100) : 0;

  if (percentage < 50) {
    suggestions.push("Add specific numeric targets to indicators (e.g., '80% of students')");
    suggestions.push("Include timeframes in indicators (e.g., 'by end of Q2')");
  }
  if (percentage < 80) {
    suggestions.push("Review indicators using SMART criteria checklist");
  }

  return {
    id: "smart_indicators",
    score: smartCount,
    maxScore: indicators.length,
    percentage,
    issues,
    suggestions,
  };
}

function calculateStakeholderCoverage(lfa: LFADocument): DimensionScore {
  const issues: string[] = [];
  const suggestions: string[] = [];

  const levels = {
    district: ["deo", "diet", "dm", "district"],
    block: ["brp", "beo", "brcc", "block"],
    cluster: ["crp", "crcc", "cluster"],
    school: ["teacher", "hm", "head master", "school"],
    community: ["parent", "student", "smc", "community"],
  };

  const coveredLevels = new Set<string>();

  lfa.outcomes.forEach((outcome) => {
    outcome.outputs.forEach((output) => {
      output.activities.forEach((activity) => {
        const responsible = (activity.responsible_stakeholder || "").toLowerCase();
        const desc = activity.description.toLowerCase();

        Object.entries(levels).forEach(([level, keywords]) => {
          if (keywords.some((kw) => responsible.includes(kw) || desc.includes(kw))) {
            coveredLevels.add(level);
          }
        });
      });
    });
  });

  const percentage = Math.round((coveredLevels.size / 5) * 100);

  Object.keys(levels).forEach((level) => {
    if (!coveredLevels.has(level)) {
      issues.push(`No activities assigned to ${level} level stakeholders`);
      suggestions.push(`Add activities involving ${level} level stakeholders (${levels[level as keyof typeof levels].slice(0, 2).join(", ")})`);
    }
  });

  return {
    id: "stakeholder_coverage",
    score: coveredLevels.size,
    maxScore: 5,
    percentage,
    issues,
    suggestions,
  };
}

function calculateLogicChainStrength(lfa: LFADocument): DimensionScore {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;
  const maxScore = 100;

  // Check for goal
  if (lfa.goal && lfa.goal.length > 20) {
    score += 20;
  } else {
    issues.push("Goal statement is too brief or missing");
    suggestions.push("Expand goal statement to clearly describe desired impact");
  }

  // Check outcomes
  if (lfa.outcomes.length >= 2) {
    score += 20;
  } else {
    issues.push("LFA has fewer than 2 outcomes");
    suggestions.push("Consider adding more outcomes to comprehensively address the goal");
  }

  // Check outputs per outcome
  const hasOutputs = lfa.outcomes.every((o) => o.outputs.length >= 1);
  if (hasOutputs) {
    score += 20;
  } else {
    issues.push("Some outcomes have no outputs defined");
    suggestions.push("Ensure each outcome has at least one output");
  }

  // Check activities per output
  let activityGaps = 0;
  lfa.outcomes.forEach((outcome) => {
    outcome.outputs.forEach((output) => {
      if (output.activities.length === 0) {
        activityGaps++;
      }
    });
  });

  if (activityGaps === 0) {
    score += 20;
  } else {
    issues.push(`${activityGaps} output(s) have no activities assigned`);
    suggestions.push("Add activities to each output to complete the logic chain");
  }

  // Check for responsible stakeholders
  let unassigned = 0;
  lfa.outcomes.forEach((outcome) => {
    outcome.outputs.forEach((output) => {
      output.activities.forEach((activity) => {
        if (!activity.responsible_stakeholder) {
          unassigned++;
        }
      });
    });
  });

  if (unassigned === 0) {
    score += 20;
  } else {
    issues.push(`${unassigned} activities lack a responsible stakeholder`);
    suggestions.push("Assign a responsible stakeholder to each activity");
  }

  return {
    id: "logic_chain",
    score,
    maxScore,
    percentage: score,
    issues,
    suggestions,
  };
}

function calculateAssumptionScore(lfa: LFADocument): DimensionScore {
  const issues: string[] = [];
  const suggestions: string[] = [];

  const assumptions = lfa.assumptions || [];
  let score = 0;

  // Having assumptions
  if (assumptions.length >= 3) {
    score += 50;
  } else if (assumptions.length > 0) {
    score += 25;
    issues.push("Few assumptions documented");
    suggestions.push("Document more assumptions (at least 3-5 key assumptions)");
  } else {
    issues.push("No assumptions documented");
    suggestions.push("Identify and document key assumptions for each logic chain level");
  }

  // Check assumption quality (rough heuristic)
  const goodAssumptions = assumptions.filter(
    (a) => a.length > 20 && !a.toLowerCase().includes("will")
  );

  if (goodAssumptions.length >= assumptions.length * 0.5) {
    score += 50;
  } else if (assumptions.length > 0) {
    issues.push("Some assumptions are vague or optimistic");
    suggestions.push("Reframe assumptions as testable conditions rather than wishes");
  }

  return {
    id: "assumption_risk",
    score,
    maxScore: 100,
    percentage: score,
    issues,
    suggestions,
  };
}

function calculateMeasurabilityScore(lfa: LFADocument): DimensionScore {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  const indicators = collectAllIndicators(lfa);

  // Check for indicators
  if (indicators.length >= 5) {
    score += 30;
  } else if (indicators.length > 0) {
    score += 15;
    issues.push("Few indicators defined");
    suggestions.push("Add more indicators to track progress at each level");
  } else {
    issues.push("No indicators defined");
    suggestions.push("Add indicators for goal, outcomes, outputs, and key activities");
  }

  // Check for numeric targets
  const numericIndicators = indicators.filter((i) =>
    /\d+%|\d+\s*(students|teachers|schools|people)|\d+\s*by/i.test(i)
  );

  if (numericIndicators.length >= indicators.length * 0.5) {
    score += 35;
  } else if (numericIndicators.length > 0) {
    score += 15;
    issues.push("Many indicators lack numeric targets");
    suggestions.push("Add specific numbers/percentages to indicators");
  } else if (indicators.length > 0) {
    issues.push("No numeric targets in indicators");
    suggestions.push("Include baseline and target values in indicators");
  }

  // Check for data sources (heuristic: mentions of surveys, reports, etc.)
  const dataSourceKeywords = ["survey", "assessment", "report", "records", "data", "tracking"];
  const hasDataSource = indicators.some((i) =>
    dataSourceKeywords.some((kw) => i.toLowerCase().includes(kw))
  );

  if (hasDataSource) {
    score += 35;
  } else {
    issues.push("No data sources mentioned in indicators");
    suggestions.push("Specify data sources and collection methods for each indicator");
  }

  return {
    id: "measurability",
    score,
    maxScore: 100,
    percentage: score,
    issues,
    suggestions,
  };
}
