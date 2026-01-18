"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, Target, TrendingUp, Package, Activity, ChevronDown, ChevronRight } from "lucide-react";
import type { LFADocument } from "@/types";

interface LogframeMatrixProps {
  lfaDocument: LFADocument;
}

function IndicatorList({ items }: { items: string[] }) {
  if (!items || items.length === 0) {
    return <span className="text-slate-500 text-sm">—</span>;
  }
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm flex items-start gap-1.5 text-slate-300">
          <span className="text-emerald-400">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LogframeMatrix({ lfaDocument }: LogframeMatrixProps) {
  const [expandedLevel, setExpandedLevel] = useState<string | null>("goal");
  const [expandedOutcome, setExpandedOutcome] = useState<string | null>(null);

  const toggleLevel = (level: string) => {
    setExpandedLevel(expandedLevel === level ? null : level);
  };

  const toggleOutcome = (outcomeId: string) => {
    setExpandedOutcome(expandedOutcome === outcomeId ? null : outcomeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Table className="h-5 w-5 text-emerald-500" />
        <h3 className="text-xl font-bold text-white">Logical Framework Matrix</h3>
      </div>

      {/* Level Buttons Row */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => toggleLevel("goal")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${expandedLevel === "goal"
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 scale-105"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
        >
          <Target className="h-5 w-5" />
          <span>Goal / Impact</span>
          {expandedLevel === "goal" ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={() => toggleLevel("outcomes")}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${expandedLevel === "outcomes"
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50 scale-105"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
            }`}
        >
          <TrendingUp className="h-5 w-5" />
          <span>Outcomes ({lfaDocument.outcomes.length})</span>
          {expandedLevel === "outcomes" ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Expanded Content */}
      <div className="space-y-4">
        {/* Goal Level */}
        {expandedLevel === "goal" && (
          <Card className="bg-slate-800/50 border-emerald-500/50 animate-in slide-in-from-top duration-300">
            <CardHeader className="pb-3 bg-emerald-500/10">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                <CardTitle className="text-lg text-white">Goal / Impact</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <p className="text-base text-white font-medium mb-3">{lfaDocument.goal}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-2">Indicators</h4>
                    <IndicatorList items={lfaDocument.goal_indicators} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase mb-2">Assumptions</h4>
                    <IndicatorList items={lfaDocument.assumptions} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Outcomes Level */}
        {expandedLevel === "outcomes" && (
          <div className="space-y-3 animate-in slide-in-from-top duration-300">
            {lfaDocument.outcomes.map((outcome, outcomeIdx) => (
              <Card key={outcome.id} className="bg-slate-800/50 border-purple-500/50">
                <CardHeader className="pb-3 bg-purple-500/10">
                  <button
                    onClick={() => toggleOutcome(outcome.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-400" />
                      <CardTitle className="text-lg text-white">Outcome {outcomeIdx + 1}</CardTitle>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                        {outcome.id}
                      </Badge>
                    </div>
                    {expandedOutcome === outcome.id ? (
                      <ChevronDown className="h-5 w-5 text-purple-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-purple-400" />
                    )}
                  </button>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                    <div className="lg:col-span-2">
                      <p className="text-base text-white">{outcome.description}</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs font-semibold text-purple-400 uppercase mb-2">Indicators</h4>
                        <IndicatorList items={outcome.indicators} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-purple-400 uppercase mb-2">Verification</h4>
                        <IndicatorList items={outcome.means_of_verification} />
                      </div>
                    </div>
                  </div>

                  {/* Outputs at the bottom - shown when outcome is expanded */}
                  {expandedOutcome === outcome.id && outcome.outputs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700 animate-in slide-in-from-top duration-200">
                      <h4 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Outputs ({outcome.outputs.length})
                      </h4>
                      <div className="space-y-3">
                        {outcome.outputs.map((output) => (
                          <div key={output.id} className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-4">
                            <div className="flex items-start gap-2 mb-3">
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs">
                                {output.id}
                              </Badge>
                              <p className="text-sm text-slate-200 flex-1">{output.description}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-blue-400 font-medium">Indicators:</span>
                                <IndicatorList items={output.indicators} />
                              </div>
                              <div>
                                <span className="text-blue-400 font-medium">Verification:</span>
                                <IndicatorList items={output.means_of_verification} />
                              </div>
                            </div>

                            {/* Activities at the bottom of output */}
                            {output.activities.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-slate-700/50">
                                <h5 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
                                  <Activity className="h-3 w-3" />
                                  Activities ({output.activities.length})
                                </h5>
                                <div className="space-y-2">
                                  {output.activities.map((activity) => (
                                    <div key={activity.id} className="bg-slate-800/50 rounded p-2">
                                      <div className="flex items-start gap-2">
                                        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/50 text-xs">
                                          {activity.id}
                                        </Badge>
                                        <p className="text-xs text-slate-300 flex-1">{activity.description}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
