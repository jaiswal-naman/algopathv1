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
    Table,
    FileText,
    Settings,
    MessageSquareText,
    Brain,
    Triangle,
    Award,
    Zap,
    Play,
    Check,
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
    onFinish?: () => void;
    sessionId?: string;
}

type PrimaryTab = "logframe" | "export";
type AdvancedTool = "editor" | "interview" | "logic" | "pyramid" | "score" | "whatif" | "toc";

export function ResultStep({
    lfaDocument,
    onReset,
    onFinish,
    sessionId,
}: ResultStepProps) {
    const [activeTab, setActiveTab] = useState<PrimaryTab>("logframe");
    const [localDocument, setLocalDocument] = useState<LFADocument>(lfaDocument);
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
            a.download = `${localDocument.title.replace(/\\s+/g, "_")}.${format}`;
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
                    <h1 className="text-2xl font-bold truncate text-white">{localDocument.title}</h1>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                        {localDocument.goal}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {onFinish && (
                        <Button
                            size="sm"
                            onClick={onFinish}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
                        >
                            <Check className="h-4 w-4 mr-1" />
                            Finish
                        </Button>
                    )}
                    <Button
                        size="sm"
                        onClick={() => handleQuickExport("csv")}
                        disabled={isExporting}
                        className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                    >
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleQuickExport("docx")}
                        disabled={isExporting}
                        className="bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                    >
                        <Download className="h-4 w-4 mr-1" />
                        Word
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onReset}
                        className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                    >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reset
                    </Button>
                </div>
            </div>

            {/* Primary Tabs */}
            <div className="border-b border-slate-700">
                <div className="flex gap-1">
                    <button
                        onClick={() => { setActiveTab("logframe"); setActiveTool(null); }}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "logframe" && !activeTool
                            ? "border-emerald-500 text-emerald-400"
                            : "border-transparent text-slate-400 hover:text-white"
                            }`}
                    >
                        <Table className="h-4 w-4" />
                        Logframe
                    </button>
                    <button
                        onClick={() => { setActiveTab("export"); setActiveTool(null); }}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "export" && !activeTool
                            ? "border-emerald-500 text-emerald-400"
                            : "border-transparent text-slate-400 hover:text-white"
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
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-0">
                        <ManualGrid data={localDocument} onChange={setLocalDocument} />
                    </CardContent>
                </Card>
            )}

            {activeTool === "interview" && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                        <StakeholderInterviewPanel
                            lfaDocument={localDocument}
                            sessionId={sessionId}
                        />
                    </CardContent>
                </Card>
            )}

            {activeTool === "logic" && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                        <LogicChallengerPanel
                            lfaDocument={localDocument}
                            sessionId={sessionId}
                        />
                    </CardContent>
                </Card>
            )}

            {activeTool === "pyramid" && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                        <InteractivePyramid lfaDocument={localDocument} />
                    </CardContent>
                </Card>
            )}

            {activeTool === "score" && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                        <HealthScoreDashboard lfaDocument={localDocument} />
                    </CardContent>
                </Card>
            )}

            {activeTool === "whatif" && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                        <WhatIfEngine
                            lfaDocument={localDocument}
                            sessionId={sessionId}
                        />
                    </CardContent>
                </Card>
            )}

            {activeTool === "toc" && (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-6">
                        <TheoryOfChange lfaDocument={localDocument} />
                    </CardContent>
                </Card>
            )}

            {/* Advanced Tools - Static Section */}
            <div className="bg-slate-900/50 border-2 border-emerald-500/50 rounded-xl overflow-hidden shadow-xl">
                <div className="p-4">
                    <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Advanced Tools
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {advancedTools.map((tool) => {
                            const isActive = activeTool === tool.id;
                            return (
                                <button
                                    key={tool.id}
                                    onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${isActive
                                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 scale-105"
                                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-emerald-500/30"
                                        }`}
                                >
                                    <tool.icon className="h-4 w-4" />
                                    <span className="text-sm font-semibold">{tool.label}</span>
                                    {isActive && (
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
