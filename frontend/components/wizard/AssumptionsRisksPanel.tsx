"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { LFADocument } from "@/types";

interface AssumptionsRisksPanelProps {
  lfaDocument: LFADocument;
}

export function AssumptionsRisksPanel({ lfaDocument }: AssumptionsRisksPanelProps) {
  // Goal-level assumptions from the document
  const goalAssumptions = lfaDocument.assumptions || [];

  // Extract any outcome-level assumptions (if they exist in extended data)
  // For now, we'll derive operational risks from the structure
  const operationalRisks = [
    "Training delays due to academic calendar conflicts",
    "Staff turnover affecting program continuity",
    "Budget disbursement delays",
    "Weather or infrastructure disruptions in remote areas",
  ];

  // Categorize assumptions by type
  const externalAssumptions = goalAssumptions.filter(a =>
    a.toLowerCase().includes("government") ||
    a.toLowerCase().includes("policy") ||
    a.toLowerCase().includes("funding") ||
    a.toLowerCase().includes("support")
  );

  const internalAssumptions = goalAssumptions.filter(a =>
    a.toLowerCase().includes("staff") ||
    a.toLowerCase().includes("capacity") ||
    a.toLowerCase().includes("available") ||
    a.toLowerCase().includes("willing")
  );

  const otherAssumptions = goalAssumptions.filter(a =>
    !externalAssumptions.includes(a) && !internalAssumptions.includes(a)
  );

  const hasAssumptions = goalAssumptions.length > 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-600" />
          <CardTitle>Assumptions & Risks</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Critical factors for program success and potential risks to monitor
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Assumptions Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-semibold uppercase tracking-wide">
                Key Assumptions
              </h4>
            </div>

            {!hasAssumptions ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      No assumptions documented
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      Consider adding assumptions for donor compliance
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Goal Level */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Goal Level
                    </Badge>
                  </div>
                  <ul className="space-y-2 pl-1">
                    {goalAssumptions.slice(0, 4).map((assumption, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span>{assumption}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Outcome Level (derived) */}
                {externalAssumptions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        External Factors
                      </Badge>
                    </div>
                    <ul className="space-y-2 pl-1">
                      {externalAssumptions.slice(0, 3).map((assumption, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <TrendingUp className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Risks Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <h4 className="text-sm font-semibold uppercase tracking-wide">
                Operational Risks
              </h4>
            </div>

            <div className="space-y-2">
              {operationalRisks.map((risk, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-md border border-red-100 dark:border-red-900"
                >
                  <Zap className="h-3.5 w-3.5 text-red-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-800 dark:text-red-200">{risk}</span>
                </div>
              ))}
            </div>

            {/* Risk Mitigation Note */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Document mitigation strategies for each risk
                in your full project proposal. Consider adding a risk register
                as an annex.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
