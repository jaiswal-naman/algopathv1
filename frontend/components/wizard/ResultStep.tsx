"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ManualGrid } from "./ManualGrid";
import { StakeholderInterviewPanel } from "./StakeholderInterviewPanel";
import { LogicChallengerPanel } from "./LogicChallengerPanel";
import { InteractivePyramid } from "./InteractivePyramid";
import { HealthScoreDashboard } from "./HealthScoreDashboard";
import { WhatIfEngine } from "./WhatIfEngine";
import { TheoryOfChange } from "./TheoryOfChange";
import { LogframeMatrix } from "./LogframeMatrix";
import { ExportControlsPanel } from "./ExportControlsPanel";
import type { LFADocument } from "@/types";
import {
  RefreshCw,
  Download,
  ChevronDown,
  ChevronRight,
  Table,
  FileText,
  Settings,
  MessageSquareText,
  Brain,
  Triangle,
  Award,
  Zap,
  Play,
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

type PrimaryTab = "logframe" | "export";
type AdvancedTool = "editor" | "interview" | "logic" | "pyramid" | "score" | "whatif" | "toc";

export function ResultStep({
  lfaDocument,
  onReset,
  sessionId,
}: ResultStepProps) {
  const [activeTab, setActiveTab] = useState<PrimaryTab>("logframe");
  const [localDocument, setLocalDocument] = useState<LFADocument>(lfaDocument);
  const [advancedExpanded, setAdvancedExpanded] = useState(false);
  const [activeTool, setActiveTool] = useState<AdvancedTool | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleQuickExport = async (format: "csv" | "docx") => {
    setIsExporting(true);
    try {
      const exportSessionId = sessionId || crypto.randomUUID();
      const response = await fetch("http://localhost:8000/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: exportSessionId,
          format: format,
          lfa_data: localDocument,
        }),
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
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert("Export failed: " + e);
    } finally {
      setIsExporting(false);
    }
  };

  const advancedTools: { id: AdvancedTool; label: string; icon: React.ElementType }[] = [
    { id: "editor", label: "Editor", icon: Settings },
    { id: "interview", label: "Test LFA", icon: MessageSquareText },
    { id: "logic", label: "Challenge", icon: Brain },
    { id: "pyramid", label: "Pyramid", icon: Triangle },
    { id: "score", label: "Score", icon: Award },
    { id: "whatif", label: "What-If", icon: Zap },
    { id: "toc", label: "Flow", icon: Play },
  ];

  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold truncate">{localDocument.title}</h1>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
            {localDocument.goal}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => handleQuickExport("csv")}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
          <Button
            size="sm"
            onClick={() => handleQuickExport("docx")}
            disabled={isExporting}
          >
            <Download className="h-4 w-4 mr-1" />
            Word
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* Primary Tabs (2 only) */}
      <div className="border-b">
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveTab("logframe"); setActiveTool(null); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "logframe" && !activeTool
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table className="h-4 w-4" />
            Logframe
          </button>
          <button
            onClick={() => { setActiveTab("export"); setActiveTool(null); }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "export" && !activeTool
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {!activeTool && activeTab === "logframe" && (
        <LogframeMatrix lfaDocument={localDocument} />
      )}

      {!activeTool && activeTab === "export" && (
        <ExportControlsPanel
          lfaDocument={localDocument}
          sessionId={sessionId}
        />
      )}

      {/* Advanced Tool Content */}
      {activeTool === "editor" && (
        <Card>
          <CardContent className="p-0">
            <ManualGrid data={localDocument} onChange={setLocalDocument} />
          </CardContent>
        </Card>
      )}

      {activeTool === "interview" && (
        <Card>
          <CardContent className="p-6">
            <StakeholderInterviewPanel
              lfaDocument={localDocument}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>
      )}

      {activeTool === "logic" && (
        <Card>
          <CardContent className="p-6">
            <LogicChallengerPanel
              lfaDocument={localDocument}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>
      )}

      {activeTool === "pyramid" && (
        <Card>
          <CardContent className="p-6">
            <InteractivePyramid lfaDocument={localDocument} />
          </CardContent>
        </Card>
      )}

      {activeTool === "score" && (
        <Card>
          <CardContent className="p-6">
            <HealthScoreDashboard lfaDocument={localDocument} />
          </CardContent>
        </Card>
      )}

      {activeTool === "whatif" && (
        <Card>
          <CardContent className="p-6">
            <WhatIfEngine
              lfaDocument={localDocument}
              sessionId={sessionId}
            />
          </CardContent>
        </Card>
      )}

      {activeTool === "toc" && (
        <Card>
          <CardContent className="p-6">
            <TheoryOfChange lfaDocument={localDocument} />
          </CardContent>
        </Card>
      )}

      {/* Advanced Tools - Collapsible */}
      <div className="border rounded-lg">
        <button
          onClick={() => setAdvancedExpanded(!advancedExpanded)}
          className="w-full flex items-center justify-between p-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>Advanced Tools</span>
          {advancedExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {advancedExpanded && (
          <div className="border-t p-4">
            <div className="flex flex-wrap gap-2">
              {advancedTools.map((tool) => (
                <Button
                  key={tool.id}
                  variant={activeTool === tool.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                >
                  <tool.icon className="h-4 w-4 mr-1" />
                  {tool.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
