"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Target,
  TrendingUp,
  Package,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import type { LFADocument } from "@/types";

interface MESnapshotProps {
  lfaDocument: LFADocument;
}

export function MESnapshot({ lfaDocument }: MESnapshotProps) {
  // Calculate indicator counts
  const goalIndicators = lfaDocument.goal_indicators.length;

  let outcomeIndicators = 0;
  let outputIndicators = 0;
  let activityIndicators = 0;
  let totalActivities = 0;
  let activitiesWithStakeholder = 0;

  lfaDocument.outcomes.forEach((outcome) => {
    outcomeIndicators += outcome.indicators.length;
    outcome.outputs.forEach((output) => {
      outputIndicators += output.indicators.length;
      output.activities.forEach((activity) => {
        activityIndicators += activity.indicators.length;
        totalActivities++;
        if (activity.responsible_stakeholder) {
          activitiesWithStakeholder++;
        }
      });
    });
  });

  const totalIndicators = goalIndicators + outcomeIndicators + outputIndicators + activityIndicators;

  // Calculate completeness score
  const hasGoalIndicators = goalIndicators > 0;
  const hasOutcomeIndicators = outcomeIndicators > 0;
  const hasOutputIndicators = outputIndicators > 0;
  const hasAssumptions = lfaDocument.assumptions.length > 0;
  const hasVerification = lfaDocument.outcomes.some(o =>
    o.means_of_verification.length > 0 ||
    o.outputs.some(op => op.means_of_verification.length > 0)
  );

  const completenessItems = [
    hasGoalIndicators,
    hasOutcomeIndicators,
    hasOutputIndicators,
    hasAssumptions,
    hasVerification,
  ];
  const completenessScore = Math.round((completenessItems.filter(Boolean).length / completenessItems.length) * 100);

  const indicatorStats = [
    { label: "Goal", count: goalIndicators, icon: Target, color: "text-blue-600" },
    { label: "Outcome", count: outcomeIndicators, icon: TrendingUp, color: "text-green-600" },
    { label: "Output", count: outputIndicators, icon: Package, color: "text-orange-600" },
    { label: "Activity", count: activityIndicators, icon: Activity, color: "text-purple-600" },
  ];

  const reportingFrequency = [
    { level: "Activities", frequency: "Monthly", checked: true },
    { level: "Outputs", frequency: "Quarterly", checked: true },
    { level: "Outcomes", frequency: "Bi-annually", checked: true },
    { level: "Goal/Impact", frequency: "Annually", checked: true },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Monitoring & Evaluation Snapshot</CardTitle>
          </div>
          <Badge
            variant={completenessScore >= 80 ? "default" : "secondary"}
            className={completenessScore >= 80 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
          >
            {completenessScore}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Indicator Breakdown */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Indicator Breakdown
            </h4>

            {/* Total Count */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Total Indicators</span>
              <span className="text-2xl font-bold text-primary">{totalIndicators}</span>
            </div>

            {/* By Level */}
            <div className="space-y-2">
              {indicatorStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-sm">{stat.label} Indicators</span>
                  </div>
                  <Badge variant="outline">{stat.count}</Badge>
                </div>
              ))}
            </div>

            {/* Completeness Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">M&E Readiness</span>
                <span className="text-xs font-medium">{completenessScore}%</span>
              </div>
              <Progress value={completenessScore} className="h-2" />
            </div>
          </div>

          {/* Reporting & Flags */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Suggested Reporting Frequency
            </h4>

            <div className="space-y-2">
              {reportingFrequency.map((item) => (
                <div
                  key={item.level}
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{item.level}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {item.frequency}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Quality Flags */}
            <div className="pt-2 space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Quality Checks
              </h4>

              {!hasGoalIndicators && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Goal indicators missing</span>
                </div>
              )}
              {!hasAssumptions && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>No assumptions documented</span>
                </div>
              )}
              {activitiesWithStakeholder < totalActivities && (
                <div className="flex items-center gap-2 text-amber-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {totalActivities - activitiesWithStakeholder} activities missing responsible stakeholder
                  </span>
                </div>
              )}
              {hasGoalIndicators && hasAssumptions && activitiesWithStakeholder === totalActivities && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>All quality checks passed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
