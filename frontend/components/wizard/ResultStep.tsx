"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MermaidDiagram } from "./MermaidDiagram";
import { ManualGrid } from "./ManualGrid";
import { StakeholderInterviewPanel } from "./StakeholderInterviewPanel";
import { LogicChallengerPanel } from "./LogicChallengerPanel";
import { InteractivePyramid } from "./InteractivePyramid";
import { HealthScoreDashboard } from "./HealthScoreDashboard";
import { WhatIfEngine } from "./WhatIfEngine";
import { TheoryOfChange } from "./TheoryOfChange";
import { AchievementBadges } from "./AchievementBadges";
import type { LFADocument } from "@/types";
import { api } from "@/lib/api";
import {
  Target,
  TrendingUp,
  Package,
  Activity,
  AlertTriangle,
  Download,
  RefreshCw,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Table,
  Trophy,
  Sparkles,
  Users,
  BarChart3,
  MessageSquareText,
  Brain,
  Triangle,
  Award,
  Zap,
  Play,
  Medal,
} from "lucide-react";

interface ResultStepProps {
  lfaDocument: LFADocument;
  mermaidCode: string;
  allVisualizations?: {
    flowchart: string;
    mindmap: string;
    journey: string;
  };
  onReset: () => void;
  sessionId?: string;
}

type ViewTab = "diagram" | "document" | "code" | "editor" | "interview" | "logic" | "pyramid" | "score" | "whatif" | "toc" | "badges";
type DiagramType = "flowchart" | "mindmap" | "journey";

export function ResultStep({
  lfaDocument,
  mermaidCode,
  allVisualizations,
  onReset,
  sessionId,
}: ResultStepProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("diagram");
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [copied, setCopied] = useState(false);
  const [localDocument, setLocalDocument] = useState<LFADocument>(lfaDocument);
  const [isExporting, setIsExporting] = useState(false);
  const [expandedOutcomes, setExpandedOutcomes] = useState<Set<string>>(
    new Set(lfaDocument.outcomes.map((o) => o.id))
  );
  const [showCelebration, setShowCelebration] = useState(true);
  const [featureUsage, setFeatureUsage] = useState({
    stakeholderInterviews: 0,
    logicChallengeRun: false,
    whatIfScenarios: 0,
    pyramidViewed: false,
    scoreViewed: false,
    tocPlayed: false,
  });

  // Track feature usage when tabs change
  const handleTabChange = (tab: ViewTab) => {
    setActiveTab(tab);
    setFeatureUsage(prev => {
      const next = { ...prev };
      if (tab === "pyramid") next.pyramidViewed = true;
      if (tab === "score") next.scoreViewed = true;
      if (tab === "toc") next.tocPlayed = true;
      return next;
    });
  };

  // Calculate stats
  const stats = {
    outcomes: lfaDocument.outcomes.length,
    outputs: lfaDocument.outcomes.reduce((acc, o) => acc + o.outputs.length, 0),
    activities: lfaDocument.outcomes.reduce(
      (acc, o) => acc + o.outputs.reduce((acc2, op) => acc2 + op.activities.length, 0),
      0
    ),
    indicators: lfaDocument.goal_indicators.length +
      lfaDocument.outcomes.reduce(
        (acc, o) => acc + o.indicators.length + o.outputs.reduce(
          (acc2, op) => acc2 + op.indicators.length + op.activities.reduce(
            (acc3, a) => acc3 + a.indicators.length, 0
          ), 0
        ), 0
      ),
  };

  // Auto-hide celebration after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const getCurrentDiagram = () => {
    if (!allVisualizations) return mermaidCode;
    return allVisualizations[diagramType] || mermaidCode;
  };

  const toggleOutcome = (id: string) => {
    setExpandedOutcomes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(lfaDocument, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(localDocument, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${localDocument.title.replace(/\s+/g, "_")}_LFA.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExport = async (format: "csv" | "docx") => {
    setIsExporting(true);
    try {
      // Use sessionId if available, otherwise generate a placeholder UUID
      // The backend will fall back to lfa_data if session is not found
      const exportSessionId = sessionId || crypto.randomUUID();

      const response = await fetch("http://localhost:8000/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: exportSessionId,
          format: format,
          lfa_data: localDocument
        })
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${localDocument.title.replace(/\s+/g, "_")}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Export failed: " + e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Celebration Banner */}
      {showCelebration && (
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border border-primary/30 p-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary),.1),transparent_50%)]" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 animate-pulse">
                <Trophy className="h-7 w-7 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-primary">Level 4 Complete!</h3>
                  <Sparkles className="h-5 w-5 text-yellow-500 animate-bounce" />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your Logical Framework has been unlocked. Explore the features below to earn more badges!
                </p>
                <div className="mt-2">
                  <AchievementBadges lfaDocument={localDocument} featureUsage={featureUsage} compact />
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCelebration(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{stats.outcomes}</p>
                <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Outcomes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10 border-orange-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">{stats.outputs}</p>
                <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Outputs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/10 border-purple-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{stats.activities}</p>
                <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Activities</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/10 border-green-200/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{stats.indicators}</p>
                <p className="text-xs text-green-600/80 dark:text-green-400/80">Indicators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{lfaDocument.title}</h2>
          <p className="text-muted-foreground mt-1">
            Your Logical Framework is ready!
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4 mr-1" />
            ) : (
              <Copy className="h-4 w-4 mr-1" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')} disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
            CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('docx')} disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-1" />}
            Word
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b overflow-x-auto">
        {(["diagram", "toc", "document", "editor", "interview", "logic", "pyramid", "score", "whatif", "badges", "code"] as ViewTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab === "interview" && <MessageSquareText className="h-4 w-4" />}
            {tab === "logic" && <Brain className="h-4 w-4" />}
            {tab === "pyramid" && <Triangle className="h-4 w-4" />}
            {tab === "score" && <Award className="h-4 w-4" />}
            {tab === "whatif" && <Zap className="h-4 w-4" />}
            {tab === "toc" && <Play className="h-4 w-4" />}
            {tab === "badges" && <Medal className="h-4 w-4" />}
            {tab === "interview" ? "Test LFA" : tab === "logic" ? "Challenge" : tab === "pyramid" ? "Pyramid" : tab === "score" ? "Score" : tab === "whatif" ? "What-If" : tab === "toc" ? "Flow" : tab === "badges" ? "Badges" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            {(tab === "interview" || tab === "logic" || tab === "pyramid" || tab === "score" || tab === "whatif" || tab === "toc" || tab === "badges") && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-primary to-purple-500 text-white rounded-full">
                NEW
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Diagram View */}
      {activeTab === "diagram" && (
        <div className="space-y-4">
          {allVisualizations && (
            <div className="flex gap-2">
              {(["flowchart", "mindmap", "journey"] as DiagramType[]).map(
                (type) => (
                  <Button
                    key={type}
                    variant={diagramType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDiagramType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                )
              )}
            </div>
          )}
          <Card>
            <CardContent className="p-6">
              <MermaidDiagram
                chart={getCurrentDiagram()}
                className="min-h-[400px]"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Editor View */}
      {activeTab === "editor" && (
        <Card>
          <CardContent className="p-0">
            <ManualGrid data={localDocument} onChange={setLocalDocument} />
          </CardContent>
        </Card>
      )}

      {/* Document View */}
      {activeTab === "document" && (
        <div className="space-y-6">
          {/* Goal */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle>Goal</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{lfaDocument.goal}</p>
              {lfaDocument.goal_indicators.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Indicators:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {lfaDocument.goal_indicators.map((indicator, i) => (
                      <li key={i} className="text-sm">
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assumptions */}
          {lfaDocument.assumptions.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <CardTitle>Key Assumptions</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1">
                  {lfaDocument.assumptions.map((assumption, i) => (
                    <li key={i} className="text-sm">
                      {assumption}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Outcomes */}
          {lfaDocument.outcomes.map((outcome) => (
            <Card key={outcome.id}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleOutcome(outcome.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <CardTitle className="text-lg">
                      <Badge variant="outline" className="mr-2">
                        {outcome.id}
                      </Badge>
                      {outcome.description}
                    </CardTitle>
                  </div>
                  {expandedOutcomes.has(outcome.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
              </CardHeader>
              {expandedOutcomes.has(outcome.id) && (
                <CardContent className="space-y-4">
                  {outcome.indicators.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Indicators:
                      </p>
                      <ul className="list-disc list-inside text-sm">
                        {outcome.indicators.map((ind, i) => (
                          <li key={i}>{ind}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Outputs */}
                  {outcome.outputs.map((output) => (
                    <div
                      key={output.id}
                      className="ml-4 pl-4 border-l-2 border-orange-200"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-orange-600" />
                        <span className="font-medium">
                          <Badge variant="secondary" className="mr-2">
                            {output.id}
                          </Badge>
                          {output.description}
                        </span>
                      </div>

                      {/* Activities */}
                      {output.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="ml-4 pl-4 border-l-2 border-purple-200 mt-2"
                        >
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">
                              <Badge
                                variant="outline"
                                className="mr-2 text-xs"
                              >
                                {activity.id}
                              </Badge>
                              {activity.description}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Interview Your LFA View */}
      {activeTab === "interview" && (
        <Card>
          <CardContent className="p-6">
            <StakeholderInterviewPanel
              lfaDocument={localDocument}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>
      )}

      {/* Logic Challenger View */}
      {activeTab === "logic" && (
        <Card>
          <CardContent className="p-6">
            <LogicChallengerPanel
              lfaDocument={localDocument}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>
      )}

      {/* Stakeholder Pyramid View */}
      {activeTab === "pyramid" && (
        <Card>
          <CardContent className="p-6">
            <InteractivePyramid lfaDocument={localDocument} />
          </CardContent>
        </Card>
      )}

      {/* Health Score Dashboard View */}
      {activeTab === "score" && (
        <Card>
          <CardContent className="p-6">
            <HealthScoreDashboard lfaDocument={localDocument} />
          </CardContent>
        </Card>
      )}

      {/* What-If Scenario Engine View */}
      {activeTab === "whatif" && (
        <Card>
          <CardContent className="p-6">
            <WhatIfEngine
              lfaDocument={localDocument}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>
      )}

      {/* Theory of Change Animation View */}
      {activeTab === "toc" && (
        <Card>
          <CardContent className="p-6">
            <TheoryOfChange lfaDocument={localDocument} />
          </CardContent>
        </Card>
      )}

      {/* Achievements/Badges View */}
      {activeTab === "badges" && (
        <Card>
          <CardContent className="p-6">
            <AchievementBadges
              lfaDocument={localDocument}
              featureUsage={featureUsage}
            />
          </CardContent>
        </Card>
      )}

      {/* Code View */}
      {activeTab === "code" && (
        <Card>
          <CardContent className="p-0">
            <pre className="p-4 overflow-x-auto text-sm bg-muted rounded-lg">
              {JSON.stringify(lfaDocument, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
