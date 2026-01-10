"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MermaidDiagram } from "./MermaidDiagram";
import type { LFADocument } from "@/types";
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
}

type ViewTab = "diagram" | "document" | "code";
type DiagramType = "flowchart" | "mindmap" | "journey";

export function ResultStep({
  lfaDocument,
  mermaidCode,
  allVisualizations,
  onReset,
}: ResultStepProps) {
  const [activeTab, setActiveTab] = useState<ViewTab>("diagram");
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [copied, setCopied] = useState(false);
  const [expandedOutcomes, setExpandedOutcomes] = useState<Set<string>>(
    new Set(lfaDocument.outcomes.map((o) => o.id))
  );

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
    const blob = new Blob([JSON.stringify(lfaDocument, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lfaDocument.title.replace(/\s+/g, "_")}_LFA.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
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
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        {(["diagram", "document", "code"] as ViewTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
