"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LFADocument } from "@/types";
import {
  Building2,
  MapPin,
  Users,
  School,
  Home,
  ChevronDown,
  ChevronUp,
  Activity,
  Target,
  ArrowDown,
  ArrowUp,
  Sparkles,
  Check,
  AlertTriangle,
  GraduationCap,
} from "lucide-react";

// Stakeholder level definitions
const PYRAMID_LEVELS = [
  {
    id: "district",
    name: "District Level",
    stakeholders: ["DEO", "DIET", "DM"],
    keywords: ["deo", "diet", "district", "dm"],
    color: "purple",
    icon: Building2,
  },
  {
    id: "block",
    name: "Block Level",
    stakeholders: ["BRP", "BEO", "BRCC"],
    keywords: ["brp", "beo", "block", "brcc"],
    color: "blue",
    icon: MapPin,
  },
  {
    id: "cluster",
    name: "Cluster Level",
    stakeholders: ["CRP", "CRCC"],
    keywords: ["crp", "crcc", "cluster"],
    color: "green",
    icon: Users,
  },
  {
    id: "school",
    name: "School Level",
    stakeholders: ["Head Master", "Teachers"],
    keywords: ["teacher", "hm", "head master", "school", "shikshak"],
    color: "orange",
    icon: School,
  },
  {
    id: "community",
    name: "Community Level",
    stakeholders: ["Parents", "SMC", "Students"],
    keywords: ["parent", "student", "smc", "community", "vidyarthi"],
    color: "teal",
    icon: Home,
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string }> = {
  purple: {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-700",
    light: "bg-purple-50 dark:bg-purple-900/20",
  },
  blue: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-700",
    light: "bg-blue-50 dark:bg-blue-900/20",
  },
  green: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-300 dark:border-green-700",
    light: "bg-green-50 dark:bg-green-900/20",
  },
  orange: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-300 dark:border-orange-700",
    light: "bg-orange-50 dark:bg-orange-900/20",
  },
  teal: {
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-700 dark:text-teal-300",
    border: "border-teal-300 dark:border-teal-700",
    light: "bg-teal-50 dark:bg-teal-900/20",
  },
};

interface ActivityMapping {
  levelId: string;
  activities: Array<{
    id: string;
    description: string;
    responsible: string;
    outcomeId: string;
    outputId: string;
  }>;
  outputs: Array<{
    id: string;
    description: string;
  }>;
}

interface InteractivePyramidProps {
  lfaDocument: LFADocument;
}

export function InteractivePyramid({ lfaDocument }: InteractivePyramidProps) {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [showFlow, setShowFlow] = useState(true);

  // Map LFA activities to pyramid levels
  const levelMappings = useMemo((): Record<string, ActivityMapping> => {
    const mappings: Record<string, ActivityMapping> = {};

    // Initialize all levels
    PYRAMID_LEVELS.forEach((level) => {
      mappings[level.id] = {
        levelId: level.id,
        activities: [],
        outputs: [],
      };
    });

    // Extract all activities and map to levels
    lfaDocument.outcomes.forEach((outcome) => {
      outcome.outputs.forEach((output) => {
        output.activities.forEach((activity) => {
          const responsible = (
            activity.responsible_stakeholder || ""
          ).toLowerCase();
          const description = activity.description.toLowerCase();

          // Find matching level
          for (const level of PYRAMID_LEVELS) {
            const matches = level.keywords.some(
              (kw) => responsible.includes(kw) || description.includes(kw)
            );
            if (matches) {
              mappings[level.id].activities.push({
                id: activity.id,
                description: activity.description,
                responsible: activity.responsible_stakeholder || "Unassigned",
                outcomeId: outcome.id,
                outputId: output.id,
              });
              break;
            }
          }
        });

        // Also try to map outputs
        const outputDesc = output.description.toLowerCase();
        for (const level of PYRAMID_LEVELS) {
          const matches = level.keywords.some((kw) => outputDesc.includes(kw));
          if (matches) {
            mappings[level.id].outputs.push({
              id: output.id,
              description: output.description,
            });
            break;
          }
        }
      });
    });

    return mappings;
  }, [lfaDocument]);

  // Calculate coverage stats
  const coverageStats = useMemo(() => {
    const levels = PYRAMID_LEVELS.map((level) => ({
      ...level,
      activityCount: levelMappings[level.id]?.activities.length || 0,
      outputCount: levelMappings[level.id]?.outputs.length || 0,
    }));

    const covered = levels.filter((l) => l.activityCount > 0).length;
    const total = levels.length;

    return {
      levels,
      covered,
      total,
      percentage: Math.round((covered / total) * 100),
    };
  }, [levelMappings]);

  const selectedLevelData = selectedLevel
    ? {
        level: PYRAMID_LEVELS.find((l) => l.id === selectedLevel),
        mapping: levelMappings[selectedLevel],
      }
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Stakeholder Accountability Pyramid
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Click each level to see mapped activities and responsibilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={coverageStats.percentage === 100 ? "default" : "secondary"}
            className="gap-1"
          >
            {coverageStats.percentage === 100 ? (
              <Check className="h-3 w-3" />
            ) : (
              <AlertTriangle className="h-3 w-3" />
            )}
            {coverageStats.covered}/{coverageStats.total} levels covered
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFlow(!showFlow)}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {showFlow ? "Hide" : "Show"} Flow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pyramid Visualization */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              {/* Flow indicators */}
              {showFlow && (
                <>
                  <div className="absolute left-4 top-8 bottom-8 flex flex-col items-center justify-between text-xs text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <ArrowDown className="h-4 w-4 text-green-500 animate-bounce" />
                      <span className="writing-mode-vertical text-green-600 font-medium">
                        Support
                      </span>
                    </div>
                  </div>
                  <div className="absolute right-4 top-8 bottom-8 flex flex-col items-center justify-between text-xs text-muted-foreground">
                    <div className="flex flex-col items-center gap-1">
                      <ArrowUp className="h-4 w-4 text-blue-500 animate-bounce" />
                      <span className="writing-mode-vertical text-blue-600 font-medium">
                        Data
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Pyramid levels */}
              <div className="flex flex-col gap-2 px-10">
                {PYRAMID_LEVELS.map((level, index) => {
                  const colors = COLOR_MAP[level.color];
                  const mapping = levelMappings[level.id];
                  const activityCount = mapping?.activities.length || 0;
                  const isSelected = selectedLevel === level.id;
                  const hasActivities = activityCount > 0;
                  const Icon = level.icon;

                  // Calculate width for pyramid effect
                  const widthPercent = 100 - index * 10;

                  return (
                    <div
                      key={level.id}
                      className="flex flex-col items-center"
                      style={{ width: "100%" }}
                    >
                      <button
                        onClick={() =>
                          setSelectedLevel(isSelected ? null : level.id)
                        }
                        className={`
                          relative transition-all duration-300 w-full
                          ${isSelected ? "scale-[1.02] z-10" : "hover:scale-[1.01]"}
                        `}
                        style={{ maxWidth: `${widthPercent}%` }}
                      >
                        <div
                          className={`
                            flex items-center justify-between p-3 rounded-lg border-2
                            ${colors.bg} ${colors.border}
                            ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}
                            ${hasActivities ? "" : "opacity-60"}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-1.5 rounded-md bg-white/50 dark:bg-black/20 ${colors.text}`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="text-left">
                              <p className={`font-medium text-sm ${colors.text}`}>
                                {level.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {level.stakeholders.join(" / ")}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {activityCount > 0 ? (
                              <Badge
                                className={`${colors.bg} ${colors.text} border ${colors.border}`}
                              >
                                <Activity className="h-3 w-3 mr-1" />
                                {activityCount}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                No activities
                              </Badge>
                            )}
                            {isSelected ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>

                        {/* Activity count indicator dot */}
                        {hasActivities && (
                          <div
                            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 ${
                              isSelected ? "animate-ping" : ""
                            }`}
                          />
                        )}
                      </button>

                      {/* Connector line */}
                      {index < PYRAMID_LEVELS.length - 1 && (
                        <div className="w-0.5 h-2 bg-muted-foreground/30 my-0.5" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coverage summary */}
            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Stakeholder Coverage
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        coverageStats.percentage === 100
                          ? "bg-green-500"
                          : coverageStats.percentage >= 60
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${coverageStats.percentage}%` }}
                    />
                  </div>
                  <span className="font-medium">{coverageStats.percentage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail Panel */}
        <div>
          {selectedLevelData ? (
            <Card className={`${COLOR_MAP[selectedLevelData.level?.color || "purple"].light}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {selectedLevelData.level && (
                    <selectedLevelData.level.icon
                      className={`h-5 w-5 ${COLOR_MAP[selectedLevelData.level.color].text}`}
                    />
                  )}
                  {selectedLevelData.level?.name} Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stakeholders */}
                <div>
                  <p className="text-sm font-medium mb-2">Key Stakeholders</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLevelData.level?.stakeholders.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mapped Activities */}
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Activity className="h-4 w-4" />
                    Assigned Activities ({selectedLevelData.mapping.activities.length})
                  </p>
                  {selectedLevelData.mapping.activities.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                      {selectedLevelData.mapping.activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-2 rounded border bg-background text-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p>{activity.description}</p>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {activity.id}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Responsible: {activity.responsible}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded border border-dashed text-center text-muted-foreground">
                      <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                      <p className="text-sm">
                        No activities assigned to this level
                      </p>
                      <p className="text-xs mt-1">
                        Consider adding activities for{" "}
                        {selectedLevelData.level?.stakeholders.join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Mapped Outputs */}
                {selectedLevelData.mapping.outputs.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      Related Outputs ({selectedLevelData.mapping.outputs.length})
                    </p>
                    <div className="space-y-2">
                      {selectedLevelData.mapping.outputs.map((output) => (
                        <div
                          key={output.id}
                          className="p-2 rounded border bg-background text-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p>{output.description}</p>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {output.id}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium text-lg">Select a Level</h4>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                  Click on any level in the pyramid to see the activities and
                  stakeholders mapped to that level from your LFA
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {coverageStats.levels.map((level) => {
              const colors = COLOR_MAP[level.color];
              const Icon = level.icon;

              return (
                <div
                  key={level.id}
                  className={`
                    p-3 rounded-lg border text-center cursor-pointer transition-all
                    ${colors.light} ${colors.border}
                    ${selectedLevel === level.id ? "ring-2 ring-primary" : ""}
                    hover:scale-[1.02]
                  `}
                  onClick={() =>
                    setSelectedLevel(selectedLevel === level.id ? null : level.id)
                  }
                >
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${colors.text}`} />
                  <p className="text-2xl font-bold">{level.activityCount}</p>
                  <p className="text-xs text-muted-foreground">{level.name}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
