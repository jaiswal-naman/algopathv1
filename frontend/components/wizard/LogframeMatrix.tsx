"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table } from "lucide-react";
import type { LFADocument } from "@/types";

interface LogframeMatrixProps {
  lfaDocument: LFADocument;
}

function IndicatorList({ items }: { items: string[] }) {
  if (!items || items.length === 0) {
    return <span className="text-muted-foreground text-sm">—</span>;
  }
  return (
    <ul className="space-y-1">
      {items.map((item, i) => (
        <li key={i} className="text-sm flex items-start gap-1.5">
          <span className="text-muted-foreground">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LogframeMatrix({ lfaDocument }: LogframeMatrixProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Table className="h-5 w-5 text-primary" />
          <CardTitle>Logical Framework Matrix</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            {/* Header */}
            <thead>
              <tr className="bg-muted/50 border-y">
                <th className="text-left p-3 font-semibold w-[35%]">
                  Intervention Logic
                </th>
                <th className="text-left p-3 font-semibold w-[25%]">
                  Indicators
                </th>
                <th className="text-left p-3 font-semibold w-[20%]">
                  Means of Verification
                </th>
                <th className="text-left p-3 font-semibold w-[20%]">
                  Assumptions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* GOAL Row */}
              <tr className="bg-primary/5 border-b">
                <td className="p-3">
                  <div className="font-semibold text-primary">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1">Goal</span>
                    {lfaDocument.goal}
                  </div>
                </td>
                <td className="p-3 align-top">
                  <IndicatorList items={lfaDocument.goal_indicators} />
                </td>
                <td className="p-3 align-top text-muted-foreground">
                  Impact assessments
                </td>
                <td className="p-3 align-top">
                  <IndicatorList items={lfaDocument.assumptions} />
                </td>
              </tr>

              {/* OUTCOMES, OUTPUTS, ACTIVITIES */}
              {lfaDocument.outcomes.map((outcome) => (
                <>
                  {/* Outcome Row */}
                  <tr key={outcome.id} className="bg-primary/5 border-b">
                    <td className="p-3">
                      <div>
                        <span className="text-xs font-mono text-muted-foreground mr-2">{outcome.id}</span>
                        <span className="font-medium">{outcome.description}</span>
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      <IndicatorList items={outcome.indicators} />
                    </td>
                    <td className="p-3 align-top">
                      <IndicatorList items={outcome.means_of_verification} />
                    </td>
                    <td className="p-3 align-top text-muted-foreground">—</td>
                  </tr>

                  {/* Outputs within Outcome */}
                  {outcome.outputs.map((output) => (
                    <>
                      <tr key={output.id} className="border-b">
                        <td className="p-3 pl-6">
                          <div>
                            <span className="text-xs font-mono text-muted-foreground mr-2">{output.id}</span>
                            <span>{output.description}</span>
                          </div>
                        </td>
                        <td className="p-3 align-top">
                          <IndicatorList items={output.indicators} />
                        </td>
                        <td className="p-3 align-top">
                          <IndicatorList items={output.means_of_verification} />
                        </td>
                        <td className="p-3 align-top text-muted-foreground">—</td>
                      </tr>

                      {/* Activities within Output */}
                      {output.activities.map((activity) => (
                        <tr key={activity.id} className="border-b bg-muted/30">
                          <td className="p-3 pl-10">
                            <div className="text-muted-foreground">
                              <span className="text-xs font-mono mr-2">{activity.id}</span>
                              <span>{activity.description}</span>
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <IndicatorList items={activity.indicators} />
                          </td>
                          <td className="p-3 align-top">
                            <IndicatorList items={activity.means_of_verification} />
                          </td>
                          <td className="p-3 align-top text-muted-foreground">—</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
