"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import type {
  LFADocument,
  StakeholderPersona,
  StakeholderFeedback,
  StakeholderFeedbackItem,
} from "@/types";
import {
  GraduationCap,
  School,
  Users,
  MapPin,
  Building2,
  Home,
  BookOpen,
  BookMarked,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  ShieldAlert,
  CheckCircle2,
  MessageSquare,
  ChevronRight,
  Loader2,
  RefreshCw,
  X,
  Sparkles,
  Target,
} from "lucide-react";

// Icon mapping for stakeholder types
const STAKEHOLDER_ICONS: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-5 w-5" />,
  School: <School className="h-5 w-5" />,
  Users: <Users className="h-5 w-5" />,
  MapPin: <MapPin className="h-5 w-5" />,
  Building2: <Building2 className="h-5 w-5" />,
  Home: <Home className="h-5 w-5" />,
  BookOpen: <BookOpen className="h-5 w-5" />,
  BookMarked: <BookMarked className="h-5 w-5" />,
};

// Color mapping for stakeholder levels
const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  school: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
  },
  cluster: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
  block: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-700 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  district: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-700 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-800",
  },
  community: {
    bg: "bg-teal-50 dark:bg-teal-950/30",
    text: "text-teal-700 dark:text-teal-400",
    border: "border-teal-200 dark:border-teal-800",
  },
};

// Severity styling
const SEVERITY_STYLES: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  critical: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30 border-red-200",
  },
  important: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200",
  },
  minor: {
    icon: <Lightbulb className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200",
  },
};

// Type icon mapping
const TYPE_ICONS: Record<string, React.ReactNode> = {
  gap: <Target className="h-3.5 w-3.5" />,
  risk: <ShieldAlert className="h-3.5 w-3.5" />,
  concern: <AlertTriangle className="h-3.5 w-3.5" />,
  suggestion: <Lightbulb className="h-3.5 w-3.5" />,
};

// Sentiment styling
const SENTIMENT_STYLES: Record<string, { color: string; label: string }> = {
  supportive: { color: "text-green-600", label: "Generally Supportive" },
  cautious: { color: "text-amber-600", label: "Cautiously Optimistic" },
  skeptical: { color: "text-orange-600", label: "Somewhat Skeptical" },
  concerned: { color: "text-red-600", label: "Has Concerns" },
};

interface StakeholderInterviewPanelProps {
  lfaDocument: LFADocument;
  sessionId?: string;
}

export function StakeholderInterviewPanel({
  lfaDocument,
  sessionId,
}: StakeholderInterviewPanelProps) {
  const [stakeholders, setStakeholders] = useState<StakeholderPersona[]>([]);
  const [selectedStakeholder, setSelectedStakeholder] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, StakeholderFeedback>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStakeholders, setLoadingStakeholders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load available stakeholders on mount
  useEffect(() => {
    const loadStakeholders = async () => {
      try {
        const response = await api.getStakeholders();
        setStakeholders(response.stakeholders);
      } catch (err) {
        console.error("Failed to load stakeholders:", err);
        // Use fallback stakeholders if API fails
        setStakeholders([
          { id: "teacher", name: "Teacher", hindi_name: "Shikshak", level: "school", icon: "GraduationCap", color: "orange", description: "Classroom realities, workload, practical challenges" },
          { id: "head_master", name: "Head Master (HM)", hindi_name: "Pradhanadhyapak", level: "school", icon: "School", color: "orange", description: "School management, teacher coordination, resources" },
          { id: "crp", name: "CRP", hindi_name: "Sankal Srot Vyakti", level: "cluster", icon: "Users", color: "green", description: "Mentoring feasibility, visit logistics, support capacity" },
          { id: "brp", name: "BRP", hindi_name: "Khand Srot Vyakti", level: "block", icon: "MapPin", color: "blue", description: "Block-level coordination, training quality, scale" },
          { id: "deo", name: "DEO", hindi_name: "Jila Shiksha Adhikari", level: "district", icon: "Building2", color: "purple", description: "Strategic oversight, monitoring, resource allocation" },
          { id: "parent", name: "Parent", hindi_name: "Abhivavak", level: "community", icon: "Home", color: "teal", description: "Home support, understanding methods, child progress" },
          { id: "student", name: "Student", hindi_name: "Vidyarthi", level: "school", icon: "BookOpen", color: "yellow", description: "Learning experience, engagement, difficulty level" },
          { id: "diet", name: "DIET Faculty", hindi_name: "DIET Adhyapak", level: "district", icon: "BookMarked", color: "purple", description: "Training design, capacity building, documentation" },
        ]);
      } finally {
        setLoadingStakeholders(false);
      }
    };
    loadStakeholders();
  }, []);

  // Interview a stakeholder
  const handleInterviewStakeholder = useCallback(
    async (stakeholderId: string) => {
      // If already have feedback for this stakeholder, just show it
      if (feedback[stakeholderId]) {
        setSelectedStakeholder(stakeholderId);
        return;
      }

      setSelectedStakeholder(stakeholderId);
      setIsLoading(true);
      setError(null);

      try {
        const result = await api.interviewStakeholder({
          stakeholder_id: stakeholderId,
          session_id: sessionId,
          lfa_document: lfaDocument,
        });

        setFeedback((prev) => ({
          ...prev,
          [stakeholderId]: result,
        }));
      } catch (err) {
        console.error("Interview failed:", err);
        setError(err instanceof Error ? err.message : "Failed to interview stakeholder");
      } finally {
        setIsLoading(false);
      }
    },
    [feedback, sessionId, lfaDocument]
  );

  // Retry interview
  const handleRetry = useCallback(() => {
    if (selectedStakeholder) {
      // Clear existing feedback to force re-fetch
      setFeedback((prev) => {
        const next = { ...prev };
        delete next[selectedStakeholder];
        return next;
      });
      handleInterviewStakeholder(selectedStakeholder);
    }
  }, [selectedStakeholder, handleInterviewStakeholder]);

  // Close feedback panel
  const handleCloseFeedback = useCallback(() => {
    setSelectedStakeholder(null);
    setError(null);
  }, []);

  // Calculate overall issue summary
  const getOverallSummary = () => {
    let critical = 0;
    let important = 0;
    let minor = 0;
    let total = 0;

    Object.values(feedback).forEach((f) => {
      if (f.issue_summary) {
        critical += f.issue_summary.critical || 0;
        important += f.issue_summary.important || 0;
        minor += f.issue_summary.minor || 0;
        total += f.issue_summary.total || 0;
      }
    });

    return { critical, important, minor, total, consulted: Object.keys(feedback).length };
  };

  const overallSummary = getOverallSummary();
  const currentFeedback = selectedStakeholder ? feedback[selectedStakeholder] : null;

  // Group stakeholders by level for display
  const stakeholdersByLevel = stakeholders.reduce(
    (acc, s) => {
      const level = s.level || "other";
      if (!acc[level]) acc[level] = [];
      acc[level].push(s);
      return acc;
    },
    {} as Record<string, StakeholderPersona[]>
  );

  const levelOrder = ["district", "block", "cluster", "school", "community"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Interview Your LFA
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Click on stakeholder avatars to get authentic feedback from their perspective
          </p>
        </div>
        {overallSummary.consulted > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {overallSummary.consulted} consulted
            </Badge>
            {overallSummary.critical > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {overallSummary.critical} critical
              </Badge>
            )}
            {overallSummary.important > 0 && (
              <Badge className="gap-1 bg-amber-500">
                <AlertTriangle className="h-3 w-3" />
                {overallSummary.important} important
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Main content: Stakeholder grid + Feedback panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stakeholder Selection Grid */}
        <div className="space-y-4">
          {loadingStakeholders ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            levelOrder.map((level) => {
              const levelStakeholders = stakeholdersByLevel[level];
              if (!levelStakeholders || levelStakeholders.length === 0) return null;

              const colors = LEVEL_COLORS[level] || LEVEL_COLORS.school;

              return (
                <div key={level} className="space-y-2">
                  <h4 className={`text-xs font-medium uppercase tracking-wider ${colors.text}`}>
                    {level.charAt(0).toUpperCase() + level.slice(1)} Level
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {levelStakeholders.map((stakeholder) => {
                      const hasFeedback = !!feedback[stakeholder.id];
                      const isSelected = selectedStakeholder === stakeholder.id;
                      const isInterviewing = isSelected && isLoading;

                      return (
                        <button
                          key={stakeholder.id}
                          onClick={() => handleInterviewStakeholder(stakeholder.id)}
                          disabled={isLoading && !isSelected}
                          className={`
                            relative p-3 rounded-lg border-2 transition-all duration-200
                            text-left hover:shadow-md
                            ${isSelected ? `ring-2 ring-primary ${colors.border}` : colors.border}
                            ${colors.bg}
                            ${isLoading && !isSelected ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                            ${hasFeedback ? "border-l-4 border-l-green-500" : ""}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
                            >
                              {isInterviewing ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                STAKEHOLDER_ICONS[stakeholder.icon] || (
                                  <Users className="h-5 w-5" />
                                )
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium text-sm ${colors.text}`}>
                                  {stakeholder.name}
                                </span>
                                {hasFeedback && (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                {stakeholder.description}
                              </p>
                            </div>
                            <ChevronRight
                              className={`h-4 w-4 flex-shrink-0 transition-transform ${
                                isSelected ? "rotate-90" : ""
                              } ${colors.text}`}
                            />
                          </div>

                          {/* Quick issue summary badge */}
                          {hasFeedback && feedback[stakeholder.id]?.issue_summary && (
                            <div className="absolute -top-1 -right-1 flex gap-0.5">
                              {feedback[stakeholder.id].issue_summary.critical > 0 && (
                                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-medium">
                                  {feedback[stakeholder.id].issue_summary.critical}
                                </span>
                              )}
                              {feedback[stakeholder.id].issue_summary.important > 0 && (
                                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-medium">
                                  {feedback[stakeholder.id].issue_summary.important}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Feedback Display Panel */}
        <div className="lg:sticky lg:top-4">
          {!selectedStakeholder ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-lg">Select a Stakeholder</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Click on any stakeholder avatar to hear their perspective on your LFA document
                </p>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-muted-foreground">
                  Interviewing {stakeholders.find((s) => s.id === selectedStakeholder)?.name}...
                </p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/30">
              <CardContent className="py-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-700 dark:text-red-400">
                      Interview Failed
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">{error}</p>
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="outline" onClick={handleRetry}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCloseFeedback}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : currentFeedback ? (
            <Card className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        LEVEL_COLORS[currentFeedback.stakeholder_level]?.bg || "bg-muted"
                      } ${LEVEL_COLORS[currentFeedback.stakeholder_level]?.text || ""}`}
                    >
                      {STAKEHOLDER_ICONS[currentFeedback.stakeholder_icon] || (
                        <Users className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {currentFeedback.stakeholder_name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {currentFeedback.stakeholder_level}
                        </Badge>
                        <span
                          className={`text-xs ${
                            SENTIMENT_STYLES[currentFeedback.overall_sentiment]?.color ||
                            "text-muted-foreground"
                          }`}
                        >
                          {SENTIMENT_STYLES[currentFeedback.overall_sentiment]?.label ||
                            currentFeedback.overall_sentiment}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleCloseFeedback}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Greeting */}
                <div className="p-3 rounded-lg bg-muted/50 border">
                  <p className="text-sm italic">{`"${currentFeedback.greeting}"`}</p>
                </div>

                {/* Issue Summary Pills */}
                {currentFeedback.issue_summary && (
                  <div className="flex flex-wrap gap-2">
                    {currentFeedback.issue_summary.critical > 0 && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {currentFeedback.issue_summary.critical} Critical
                      </Badge>
                    )}
                    {currentFeedback.issue_summary.important > 0 && (
                      <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
                        <AlertTriangle className="h-3 w-3" />
                        {currentFeedback.issue_summary.important} Important
                      </Badge>
                    )}
                    {currentFeedback.issue_summary.suggestions > 0 && (
                      <Badge variant="secondary" className="gap-1">
                        <Lightbulb className="h-3 w-3" />
                        {currentFeedback.issue_summary.suggestions} Suggestions
                      </Badge>
                    )}
                  </div>
                )}

                {/* Feedback Items */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {currentFeedback.feedback_items.map((item, index) => (
                    <FeedbackItemCard key={index} item={item} />
                  ))}
                </div>

                {/* Closing Remark */}
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground italic">
                    {`"${currentFeedback.closing_remark}"`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// Feedback Item Card Component
function FeedbackItemCard({ item }: { item: StakeholderFeedbackItem }) {
  const severityStyle = SEVERITY_STYLES[item.severity] || SEVERITY_STYLES.minor;

  return (
    <div className={`p-3 rounded-lg border ${severityStyle.bg}`}>
      <div className="flex items-start gap-2">
        <div className={`mt-0.5 ${severityStyle.color}`}>{severityStyle.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-medium text-sm ${severityStyle.color}`}>
              {item.title}
            </span>
            <Badge variant="outline" className="text-xs gap-1">
              {TYPE_ICONS[item.type]}
              {item.type}
            </Badge>
          </div>
          <p className="text-sm mt-1.5 text-foreground">{item.message}</p>

          {item.lfa_reference && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Target className="h-3 w-3" />
              Relates to: {item.lfa_reference}
            </p>
          )}

          {item.recommendation && (
            <div className="mt-2 p-2 rounded bg-background/50 border">
              <p className="text-xs">
                <span className="font-medium text-green-600 dark:text-green-400">
                  Recommendation:{" "}
                </span>
                {item.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
