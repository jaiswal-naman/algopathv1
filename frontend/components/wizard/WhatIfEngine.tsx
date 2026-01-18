"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import type { LFADocument } from "@/types";
import {
  Zap,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
  Target,
  Shield,
  TrendingDown,
  Lightbulb,
  ArrowRight,
  Clock,
  Users,
  DollarSign,
  Scale,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Activity,
} from "lucide-react";

// Predefined scenario templates
const SCENARIO_TEMPLATES = [
  {
    id: "budget_cut",
    name: "Budget Cut",
    icon: DollarSign,
    color: "red",
    prompt: "Budget is reduced by {value}%",
    placeholder: "40",
    unit: "%",
  },
  {
    id: "timeline_delay",
    name: "Timeline Delay",
    icon: Clock,
    color: "orange",
    prompt: "Implementation is delayed by {value} months",
    placeholder: "6",
    unit: "months",
  },
  {
    id: "stakeholder_resistance",
    name: "Stakeholder Resistance",
    icon: Users,
    color: "purple",
    prompt: "{value} resist adoption of the program",
    placeholder: "Teachers",
    unit: "",
  },
  {
    id: "scale_reduction",
    name: "Scale Reduction",
    icon: Scale,
    color: "blue",
    prompt: "Program scope is reduced by {value}%",
    placeholder: "50",
    unit: "%",
  },
];

const IMPACT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  critical: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-200 dark:border-red-800",
  },
  significant: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-700 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800",
  },
  moderate: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  minimal: {
    bg: "bg-green-50 dark:bg-green-950/30",
    text: "text-green-700 dark:text-green-400",
    border: "border-green-200 dark:border-green-800",
  },
};

interface ScenarioAnalysis {
  scenario_summary: string;
  overall_impact: string;
  impact_score: number;
  affected_elements: Array<{
    element_type: string;
    element_id: string;
    element_description: string;
    impact_severity: string;
    impact_description: string;
    cascade_effects: string[];
  }>;
  logic_chain_breaks: Array<{
    from_element: string;
    to_element: string;
    break_description: string;
  }>;
  mitigation_strategies: Array<{
    strategy: string;
    priority: string;
    feasibility: string;
    responsible_stakeholder: string;
  }>;
  modified_recommendations: Array<{
    original_element: string;
    recommended_change: string;
    reason: string;
  }>;
  assumptions_invalidated: string[];
  resilience_score: number;
  analysis_summary: string;
}

interface WhatIfEngineProps {
  lfaDocument: LFADocument;
  sessionId?: string;
}

export function WhatIfEngine({ lfaDocument, sessionId }: WhatIfEngineProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateValue, setTemplateValue] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ScenarioAnalysis | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["affected", "mitigation"])
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const runAnalysis = useCallback(async () => {
    let scenarioDescription = customScenario;

    // Build scenario from template if selected
    if (selectedTemplate && templateValue) {
      const template = SCENARIO_TEMPLATES.find((t) => t.id === selectedTemplate);
      if (template) {
        scenarioDescription = template.prompt.replace("{value}", templateValue);
      }
    }

    if (!scenarioDescription.trim()) {
      setError("Please describe a scenario or select a template");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await api.analyzeScenario({
        session_id: sessionId,
        lfa_document: lfaDocument,
        scenario_description: scenarioDescription,
      });
      setAnalysis(result);
    } catch (err) {
      console.error("Scenario analysis failed:", err);
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTemplate, templateValue, customScenario, sessionId, lfaDocument]);

  const resetAnalysis = () => {
    setAnalysis(null);
    setSelectedTemplate(null);
    setTemplateValue("");
    setCustomScenario("");
    setError(null);
  };

  const impactColors = analysis
    ? IMPACT_COLORS[analysis.overall_impact] || IMPACT_COLORS.moderate
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            What-If Scenario Engine
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Test how your LFA responds to hypothetical scenarios
          </p>
        </div>
        {analysis && (
          <Button variant="outline" size="sm" onClick={resetAnalysis}>
            <RefreshCw className="h-4 w-4 mr-1" />
            New Scenario
          </Button>
        )}
      </div>

      {/* Scenario Input Section */}
      {!analysis && (
        <div className="space-y-6">
          {/* Quick Templates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quick Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SCENARIO_TEMPLATES.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;

                  return (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(isSelected ? null : template.id);
                        setTemplateValue(template.placeholder);
                      }}
                      className={`
                        p-3 rounded-lg border-2 transition-all text-left
                        ${isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-muted hover:border-primary/50"
                        }
                      `}
                    >
                      <Icon
                        className={`h-5 w-5 mb-2 ${
                          isSelected ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                      <p className="font-medium text-sm">{template.name}</p>
                    </button>
                  );
                })}
              </div>

              {/* Template Value Input */}
              {selectedTemplate && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <label className="text-sm font-medium">
                    {SCENARIO_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}{" "}
                    Value
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      value={templateValue}
                      onChange={(e) => setTemplateValue(e.target.value)}
                      placeholder={
                        SCENARIO_TEMPLATES.find((t) => t.id === selectedTemplate)
                          ?.placeholder
                      }
                      className="max-w-[150px]"
                    />
                    <span className="text-sm text-muted-foreground">
                      {SCENARIO_TEMPLATES.find((t) => t.id === selectedTemplate)?.unit}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Scenario:{" "}
                    <span className="font-medium">
                      {SCENARIO_TEMPLATES.find((t) => t.id === selectedTemplate)
                        ?.prompt.replace("{value}", templateValue || "...")}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Scenario */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Or Describe Your Own Scenario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customScenario}
                onChange={(e) => {
                  setCustomScenario(e.target.value);
                  if (e.target.value) setSelectedTemplate(null);
                }}
                placeholder="E.g., 'What if CRP positions remain vacant for 6 months?' or 'What if parents don't support homework activities?'"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-700">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <Button
            onClick={runAnalysis}
            disabled={isLoading || (!selectedTemplate && !customScenario.trim())}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing Impact...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Analyze Scenario Impact
              </>
            )}
          </Button>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Impact Summary Card */}
          <Card className={`${impactColors?.bg} ${impactColors?.border} border-2`}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Scenario Analyzed
                  </p>
                  <p className="text-lg font-semibold mt-1">
                    {analysis.scenario_summary}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    className={`${impactColors?.bg} ${impactColors?.text} border ${impactColors?.border} text-sm px-3 py-1`}
                  >
                    {analysis.overall_impact.toUpperCase()} IMPACT
                  </Badge>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{analysis.impact_score}</span>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Impact Score</p>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{analysis.impact_score}%</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">LFA Resilience</p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="font-medium">{analysis.resilience_score}%</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm">{analysis.analysis_summary}</p>
            </CardContent>
          </Card>

          {/* Affected Elements */}
          <Card>
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("affected")}
            >
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Affected LFA Elements ({analysis.affected_elements.length})
                </span>
                {expandedSections.has("affected") ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
            {expandedSections.has("affected") && (
              <CardContent className="space-y-3">
                {analysis.affected_elements.map((element, idx) => {
                  const colors =
                    IMPACT_COLORS[element.impact_severity] || IMPACT_COLORS.moderate;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {element.element_type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {element.element_id}
                            </Badge>
                            <Badge className={`${colors.text} ${colors.bg} text-xs`}>
                              {element.impact_severity}
                            </Badge>
                          </div>
                          <p className="font-medium mt-2">
                            {element.element_description}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {element.impact_description}
                      </p>
                      {element.cascade_effects.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-dashed">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Cascade Effects:
                          </p>
                          <ul className="text-sm space-y-1">
                            {element.cascade_effects.map((effect, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <ArrowRight className="h-3 w-3 mt-1 text-muted-foreground shrink-0" />
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            )}
          </Card>

          {/* Logic Chain Breaks */}
          {analysis.logic_chain_breaks.length > 0 && (
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader
                className="pb-3 cursor-pointer"
                onClick={() => toggleSection("breaks")}
              >
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Logic Chain Breaks ({analysis.logic_chain_breaks.length})
                  </span>
                  {expandedSections.has("breaks") ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </CardTitle>
              </CardHeader>
              {expandedSections.has("breaks") && (
                <CardContent className="space-y-3">
                  {analysis.logic_chain_breaks.map((breakItem, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200"
                    >
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">{breakItem.from_element}</Badge>
                        <ArrowRight className="h-4 w-4 text-red-500" />
                        <Badge variant="outline">{breakItem.to_element}</Badge>
                      </div>
                      <p className="text-sm mt-2">{breakItem.break_description}</p>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          )}

          {/* Mitigation Strategies */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader
              className="pb-3 cursor-pointer"
              onClick={() => toggleSection("mitigation")}
            >
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-green-500" />
                  Mitigation Strategies ({analysis.mitigation_strategies.length})
                </span>
                {expandedSections.has("mitigation") ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </CardTitle>
            </CardHeader>
            {expandedSections.has("mitigation") && (
              <CardContent className="space-y-3">
                {analysis.mitigation_strategies.map((strategy, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-medium">{strategy.strategy}</p>
                      <div className="flex gap-1">
                        <Badge
                          variant="outline"
                          className={
                            strategy.priority === "immediate"
                              ? "border-red-500 text-red-600"
                              : strategy.priority === "short_term"
                              ? "border-amber-500 text-amber-600"
                              : ""
                          }
                        >
                          {strategy.priority.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Feasibility: {strategy.feasibility}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {strategy.responsible_stakeholder}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>

          {/* Invalidated Assumptions */}
          {analysis.assumptions_invalidated.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Assumptions No Longer Valid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.assumptions_invalidated.map((assumption, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      {assumption}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
