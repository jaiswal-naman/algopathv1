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
  ChevronDown,
  Loader2,
  RefreshCw,
  X,
  Target,
  TrendingUp,
  Package,
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

// Level definitions with colors
const STAKEHOLDER_LEVELS = [
  { id: "district", name: "District", icon: Building2, color: "purple" },
  { id: "block", name: "Block", icon: MapPin, color: "blue" },
  { id: "cluster", name: "Cluster", icon: Users, color: "emerald" },
  { id: "school", name: "School", icon: School, color: "orange" },
  { id: "community", name: "Community", icon: Home, color: "teal" },
];

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  district: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/50" },
  block: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/50" },
  cluster: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/50" },
  school: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/50" },
  community: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/50" },
};

// Severity styling
const SEVERITY_STYLES: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  critical: { icon: <AlertCircle className="h-4 w-4" />, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
  important: { icon: <AlertTriangle className="h-4 w-4" />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  minor: { icon: <Lightbulb className="h-4 w-4" />, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
};

// Type icon mapping
const TYPE_ICONS: Record<string, React.ReactNode> = {
  gap: <Target className="h-3.5 w-3.5" />,
  risk: <ShieldAlert className="h-3.5 w-3.5" />,
  concern: <AlertTriangle className="h-3.5 w-3.5" />,
  suggestion: <Lightbulb className="h-3.5 w-3.5" />,
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

  // Level selection state
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Load available stakeholders on mount
  useEffect(() => {
    const loadStakeholders = async () => {
      try {
        const response = await api.getStakeholders();
        setStakeholders(response.stakeholders);
      } catch (err) {
        console.error("Failed to load stakeholders:", err);
        setStakeholders([
          { id: "teacher", name: "Teacher", hindi_name: "Shikshak", level: "school", icon: "GraduationCap", color: "orange", description: "Classroom realities, workload, practical challenges" },
          { id: "head_master", name: "Head Master (HM)", hindi_name: "Pradhanadhyapak", level: "school", icon: "School", color: "orange", description: "School management, teacher coordination, resources" },
          { id: "crp", name: "CRP", hindi_name: "Sankal Srot Vyakti", level: "cluster", icon: "Users", color: "green", description: "Mentoring feasibility, visit logistics, support capacity" },
          { id: "brp", name: "BRP", hindi_name: "Khand Srot Vyakti", level: "block", icon: "MapPin", color: "blue", description: "Block-level coordination, training quality, scale" },
          { id: "deo", name: "DEO", hindi_name: "Jila Shiksha Adhikari", level: "district", icon: "Building2", color: "purple", description: "Strategic oversight, monitoring, resource allocation" },
          { id: "parent", name: "Parent", hindi_name: "Abhivavak", level: "community", icon: "Home", color: "teal", description: "Home support, understanding methods, child progress" },
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

  const handleCloseFeedback = useCallback(() => {
    setSelectedStakeholder(null);
    setError(null);
  }, []);

  const toggleLevel = (levelId: string) => {
    setSelectedLevel(selectedLevel === levelId ? null : levelId);
  };

  // Group stakeholders by level
  const stakeholdersByLevel = stakeholders.reduce((acc, s) => {
    const level = s.level || "other";
    if (!acc[level]) acc[level] = [];
    acc[level].push(s);
    return acc;
  }, {} as Record<string, StakeholderPersona[]>);

  const currentFeedback = selectedStakeholder ? feedback[selectedStakeholder] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-emerald-500" />
        <h3 className="text-xl font-bold text-white">Interview Your LFA</h3>
      </div>

      {/* Stakeholder Level Buttons */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-slate-400">Select Stakeholder Level</h4>

        <div className="flex flex-wrap gap-2">
          {STAKEHOLDER_LEVELS.map((level) => {
            const colors = LEVEL_COLORS[level.id];
            const Icon = level.icon;
            const levelStakeholders = stakeholdersByLevel[level.id] || [];
            const isExpanded = selectedLevel === level.id;

            return (
              <button
                key={level.id}
                onClick={() => toggleLevel(level.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${isExpanded
                  ? `${colors.bg} ${colors.text} border-2 ${colors.border} shadow-lg`
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{level.name}</span>
                <Badge className={`${isExpanded ? colors.bg : "bg-slate-700"} text-xs`}>
                  {levelStakeholders.length}
                </Badge>
                {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
            );
          })}
        </div>

        {/* Stakeholders at Bottom of Selected Level */}
        {selectedLevel && (
          <Card className={`${LEVEL_COLORS[selectedLevel].bg} border-2 ${LEVEL_COLORS[selectedLevel].border} animate-in slide-in-from-top duration-300`}>
            <CardHeader className="pb-3">
              <CardTitle className={`text-base ${LEVEL_COLORS[selectedLevel].text} flex items-center gap-2`}>
                {(() => {
                  const level = STAKEHOLDER_LEVELS.find(l => l.id === selectedLevel);
                  if (level) {
                    const Icon = level.icon;
                    return <Icon className="h-5 w-5" />;
                  }
                  return null;
                })()}
                {STAKEHOLDER_LEVELS.find(l => l.id === selectedLevel)?.name} Level Stakeholders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStakeholders ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : stakeholdersByLevel[selectedLevel]?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stakeholdersByLevel[selectedLevel].map((stakeholder) => {
                    const hasFeedback = !!feedback[stakeholder.id];
                    const isSelected = selectedStakeholder === stakeholder.id;
                    const colors = LEVEL_COLORS[stakeholder.level] || LEVEL_COLORS.school;

                    return (
                      <button
                        key={stakeholder.id}
                        onClick={() => handleInterviewStakeholder(stakeholder.id)}
                        disabled={isLoading && !isSelected}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${isSelected ? `ring-2 ring-emerald-500 ${colors.border}` : colors.border
                          } ${colors.bg} ${isLoading && !isSelected ? "opacity-50" : ""} ${hasFeedback ? "border-l-4 border-l-green-500" : ""
                          }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`p-2 rounded-full ${colors.bg} ${colors.text}`}>
                            {STAKEHOLDER_ICONS[stakeholder.icon] || <Users className="h-5 w-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className={`font-medium text-sm ${colors.text}`}>{stakeholder.name}</span>
                              {hasFeedback && <CheckCircle2 className="h-3 w-3 text-green-500" />}
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2">{stakeholder.description}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">No stakeholders at this level</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Feedback Display */}
      {selectedStakeholder && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base text-white">
                {isLoading ? "Interviewing..." : currentFeedback?.stakeholder_name || "Stakeholder Feedback"}
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCloseFeedback}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-4" />
                <p className="text-sm text-slate-400">
                  Interviewing {stakeholders.find(s => s.id === selectedStakeholder)?.name}...
                </p>
              </div>
            ) : error ? (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-red-400">Interview Failed</p>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setError(null);
                        handleInterviewStakeholder(selectedStakeholder);
                      }}
                      className="mt-3 bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30"
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Retry
                    </Button>
                  </div>
                </div>
              </div>
            ) : currentFeedback ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {/* Greeting */}
                {currentFeedback.greeting && (
                  <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700">
                    <p className="text-sm italic text-slate-300">"{currentFeedback.greeting}"</p>
                  </div>
                )}

                {/* Issue Summary Pills */}
                {currentFeedback.issue_summary && (
                  <div className="flex flex-wrap gap-2">
                    {currentFeedback.issue_summary.critical > 0 && (
                      <Badge className="bg-red-500/20 text-red-300 border-red-500/50 gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {currentFeedback.issue_summary.critical} Critical
                      </Badge>
                    )}
                    {currentFeedback.issue_summary.important > 0 && (
                      <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50 gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {currentFeedback.issue_summary.important} Important
                      </Badge>
                    )}
                    {currentFeedback.issue_summary.suggestions > 0 && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 gap-1">
                        <Lightbulb className="h-3 w-3" />
                        {currentFeedback.issue_summary.suggestions} Suggestions
                      </Badge>
                    )}
                  </div>
                )}

                {/* Feedback Items */}
                <div className="space-y-3">
                  {currentFeedback.feedback_items && currentFeedback.feedback_items.length > 0 ? (
                    currentFeedback.feedback_items.map((item, index) => (
                      <FeedbackItemCard key={index} item={item} />
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">No feedback items</p>
                  )}
                </div>

                {/* Closing Remark */}
                {currentFeedback.closing_remark && (
                  <div className="pt-3 border-t border-slate-700">
                    <p className="text-sm text-slate-400 italic">
                      "{currentFeedback.closing_remark}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No feedback available</p>
            )}
          </CardContent>
        </Card>
      )}
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
            <span className={`font-medium text-sm ${severityStyle.color}`}>{item.title}</span>
            <Badge variant="outline" className="text-xs gap-1">
              {TYPE_ICONS[item.type]}
              {item.type}
            </Badge>
          </div>
          <p className="text-sm mt-1.5 text-slate-300">{item.message}</p>
          {item.recommendation && (
            <div className="mt-2 p-2 rounded bg-slate-900/50 border border-slate-700">
              <p className="text-xs">
                <span className="font-medium text-green-400">Recommendation: </span>
                {item.recommendation}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
