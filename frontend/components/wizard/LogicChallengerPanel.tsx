"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import type { LFADocument } from "@/types";
import {
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Target,
  ShieldAlert,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Brain,
  TrendingUp,
  Activity,
} from "lucide-react";

// Category styling and icons
const CATEGORY_STYLES: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string; label: string }
> = {
  logic_gap: {
    icon: <Target className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200",
    label: "Logic Gap",
  },
  unrealistic_assumption: {
    icon: <ShieldAlert className="h-4 w-4" />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200",
    label: "Unrealistic Assumption",
  },
  missing_activity: {
    icon: <Activity className="h-4 w-4" />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30 border-purple-200",
    label: "Missing Activity",
  },
  indicator_weakness: {
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200",
    label: "Indicator Weakness",
  },
  stakeholder_blindspot: {
    icon: <Users className="h-4 w-4" />,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-50 dark:bg-teal-950/30 border-teal-200",
    label: "Stakeholder Blindspot",
  },
};

// Severity styling
const SEVERITY_STYLES: Record<
  string,
  { icon: React.ReactNode; color: string; badgeVariant: "destructive" | "default" | "secondary" }
> = {
  critical: {
    icon: <XCircle className="h-4 w-4" />,
    color: "text-red-600",
    badgeVariant: "destructive",
  },
  important: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-amber-600",
    badgeVariant: "default",
  },
  minor: {
    icon: <Lightbulb className="h-4 w-4" />,
    color: "text-blue-600",
    badgeVariant: "secondary",
  },
};

// Effort badge styling
const EFFORT_STYLES: Record<string, { label: string; color: string }> = {
  low: { label: "Quick Fix", color: "text-green-600 bg-green-50" },
  medium: { label: "Moderate", color: "text-amber-600 bg-amber-50" },
  high: { label: "Significant", color: "text-red-600 bg-red-50" },
};

interface LogicAnalysis {
  overall_score: number;
  overall_assessment: string;
  logic_chain_analysis?: {
    strongest_chain?: string;
    weakest_chain?: string;
  };
  challenges: Array<{
    id: string;
    category: string;
    severity: string;
    title: string;
    description: string;
    lfa_element?: string;
    logic_break?: string;
    recommendation: string;
    effort_to_fix: string;
  }>;
  quick_wins?: Array<{
    action: string;
    impact: string;
  }>;
  summary_stats: {
    critical_issues: number;
    important_issues: number;
    minor_issues: number;
    logic_gaps: number;
    unrealistic_assumptions: number;
    missing_activities: number;
    indicator_weaknesses: number;
    stakeholder_blindspots: number;
  };
}

interface LogicChallengerPanelProps {
  lfaDocument: LFADocument;
  sessionId?: string;
}

export function LogicChallengerPanel({
  lfaDocument,
  sessionId,
}: LogicChallengerPanelProps) {
  const [analysis, setAnalysis] = useState<LogicAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedChallenges, setExpandedChallenges] = useState<Set<string>>(
    new Set()
  );

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.analyzeLFALogic({
        session_id: sessionId,
        lfa_document: lfaDocument,
      });
      setAnalysis(result);
      // Auto-expand critical issues
      const criticalIds = result.challenges
        .filter((c: { severity: string }) => c.severity === "critical")
        .map((c: { id: string }) => c.id);
      setExpandedChallenges(new Set(criticalIds));
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, lfaDocument]);

  const toggleChallenge = (id: string) => {
    setExpandedChallenges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Strong";
    if (score >= 60) return "Needs Work";
    return "Critical Issues";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Devils Advocate
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Proactive logic analysis to strengthen your LFA
          </p>
        </div>
        <Button onClick={runAnalysis} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : analysis ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-analyze
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Challenge My LFA
            </>
          )}
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">
                  Analysis Failed
                </p>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={runAnalysis}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 flex flex-col items-center">
            <div className="relative">
              <Brain className="h-12 w-12 text-primary animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full animate-ping" />
            </div>
            <p className="mt-4 font-medium">Analyzing LFA Logic...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Checking for gaps, assumptions, and missing links
            </p>
          </CardContent>
        </Card>
      )}

      {/* Initial state - no analysis yet */}
      {!isLoading && !analysis && !error && (
        <Card className="border-dashed">
          <CardContent className="py-12 flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Brain className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="font-medium text-lg">Challenge Your LFA</h4>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Click the button above to run an AI-powered analysis that will
              identify logic gaps, unrealistic assumptions, and missing
              activities in your LFA.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Analysis results */}
      {analysis && !isLoading && (
        <div className="space-y-6">
          {/* Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    LFA Logic Score
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-4xl font-bold ${getScoreColor(
                        analysis.overall_score
                      )}`}
                    >
                      {analysis.overall_score}
                    </span>
                    <span className="text-lg text-muted-foreground">/100</span>
                    <Badge
                      variant={
                        analysis.overall_score >= 80
                          ? "default"
                          : analysis.overall_score >= 60
                          ? "secondary"
                          : "destructive"
                      }
                      className="ml-2"
                    >
                      {getScoreLabel(analysis.overall_score)}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex gap-2">
                    {analysis.summary_stats.critical_issues > 0 && (
                      <Badge variant="destructive">
                        {analysis.summary_stats.critical_issues} Critical
                      </Badge>
                    )}
                    {analysis.summary_stats.important_issues > 0 && (
                      <Badge className="bg-amber-500">
                        {analysis.summary_stats.important_issues} Important
                      </Badge>
                    )}
                    {analysis.summary_stats.minor_issues > 0 && (
                      <Badge variant="secondary">
                        {analysis.summary_stats.minor_issues} Minor
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Progress
                value={analysis.overall_score}
                className="h-2"
              />
              <p className="text-sm text-muted-foreground mt-4">
                {analysis.overall_assessment}
              </p>
            </CardContent>
          </Card>

          {/* Logic Chain Analysis */}
          {analysis.logic_chain_analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Strongest Logic Chain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {analysis.logic_chain_analysis.strongest_chain ||
                      "Not identified"}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Weakest Logic Chain
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {analysis.logic_chain_analysis.weakest_chain ||
                      "Not identified"}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Quick Wins */}
          {analysis.quick_wins && analysis.quick_wins.length > 0 && (
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  Quick Wins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.quick_wins.map((win, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <ArrowRight className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">{win.action}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          - {win.impact}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Challenges List */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Identified Challenges ({analysis.challenges.length})
            </h4>
            {analysis.challenges.map((challenge) => {
              const categoryStyle =
                CATEGORY_STYLES[challenge.category] ||
                CATEGORY_STYLES.logic_gap;
              const severityStyle =
                SEVERITY_STYLES[challenge.severity] || SEVERITY_STYLES.minor;
              const effortStyle =
                EFFORT_STYLES[challenge.effort_to_fix] || EFFORT_STYLES.medium;
              const isExpanded = expandedChallenges.has(challenge.id);

              return (
                <Card
                  key={challenge.id}
                  className={`${categoryStyle.bg} border cursor-pointer transition-all`}
                  onClick={() => toggleChallenge(challenge.id)}
                >
                  <CardContent className="py-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={categoryStyle.color}>
                          {categoryStyle.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{challenge.title}</span>
                            <Badge
                              variant={severityStyle.badgeVariant}
                              className="text-xs"
                            >
                              {challenge.severity}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {categoryStyle.label}
                            </Badge>
                          </div>
                          {!isExpanded && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {challenge.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${effortStyle.color}`}
                        >
                          {effortStyle.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* Expanded content */}
                    {isExpanded && (
                      <div className="mt-4 space-y-3 pl-7">
                        <div>
                          <p className="text-sm font-medium mb-1">Issue</p>
                          <p className="text-sm">{challenge.description}</p>
                        </div>

                        {challenge.lfa_element && (
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Related LFA Element
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {challenge.lfa_element}
                            </p>
                          </div>
                        )}

                        {challenge.logic_break && (
                          <div>
                            <p className="text-sm font-medium mb-1">
                              Logic Break
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {challenge.logic_break}
                            </p>
                          </div>
                        )}

                        <div className="p-3 rounded bg-background/50 border">
                          <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                            Recommendation
                          </p>
                          <p className="text-sm">{challenge.recommendation}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Issues by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  {
                    key: "logic_gaps",
                    label: "Logic Gaps",
                    icon: <Target className="h-4 w-4" />,
                  },
                  {
                    key: "unrealistic_assumptions",
                    label: "Assumptions",
                    icon: <ShieldAlert className="h-4 w-4" />,
                  },
                  {
                    key: "missing_activities",
                    label: "Missing Activities",
                    icon: <Activity className="h-4 w-4" />,
                  },
                  {
                    key: "indicator_weaknesses",
                    label: "Indicators",
                    icon: <TrendingUp className="h-4 w-4" />,
                  },
                  {
                    key: "stakeholder_blindspots",
                    label: "Stakeholders",
                    icon: <Users className="h-4 w-4" />,
                  },
                ].map((cat) => (
                  <div
                    key={cat.key}
                    className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50"
                  >
                    <div className="text-muted-foreground mb-1">{cat.icon}</div>
                    <span className="text-2xl font-bold">
                      {analysis.summary_stats[
                        cat.key as keyof typeof analysis.summary_stats
                      ] || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cat.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
