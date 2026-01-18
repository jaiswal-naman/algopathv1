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
    color: "emerald",
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

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/50",
    glow: "shadow-purple-500/50",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/50",
    glow: "shadow-blue-500/50",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/50",
    glow: "shadow-emerald-500/50",
  },
  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/50",
    glow: "shadow-orange-500/50",
  },
  teal: {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/50",
    glow: "shadow-teal-500/50",
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

    PYRAMID_LEVELS.forEach((level) => {
      mappings[level.id] = {
        levelId: level.id,
        activities: [],
        outputs: [],
      };
    });

    lfaDocument.outcomes.forEach((outcome) => {
      outcome.outputs.forEach((output) => {
        output.activities.forEach((activity) => {
          const responsible = (activity.responsible_stakeholder || "").toLowerCase();
          const description = activity.description.toLowerCase();

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <GraduationCap className="h-5 w-5 text-emerald-400" />
            </div>
            Stakeholder Accountability Pyramid
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Click each level to see mapped activities and responsibilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={`gap-1.5 px-3 py-1.5 rounded-full font-medium ${coverageStats.percentage === 100
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
              : "bg-amber-500/20 text-amber-400 border border-amber-500/50"
              }`}
          >
            {coverageStats.percentage === 100 ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5" />
            )}
            {coverageStats.covered}/{coverageStats.total} levels
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFlow(!showFlow)}
            className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white rounded-lg"
          >
            <Sparkles className="h-4 w-4 mr-1.5" />
            {showFlow ? "Hide" : "Show"} Flow
          </Button>
        </div>
      </div>


      {/* Pyramid Visualization */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="relative">
            {/* Flow indicators */}
            {showFlow && (
              <>
                <div className="absolute -left-8 sm:-left-4 top-8 bottom-8 flex flex-col items-center justify-between text-xs text-slate-400">
                  <div className="flex flex-col items-center gap-1">
                    <ArrowDown className="h-4 w-4 text-emerald-500 animate-bounce" />
                    <span className="writing-mode-vertical text-emerald-400 font-medium text-[10px] sm:text-xs">
                      Support
                    </span>
                  </div>
                </div>
                <div className="absolute -right-8 sm:-right-4 top-8 bottom-8 flex flex-col items-center justify-between text-xs text-slate-400">
                  <div className="flex flex-col items-center gap-1">
                    <ArrowUp className="h-4 w-4 text-blue-500 animate-bounce" />
                    <span className="writing-mode-vertical text-blue-400 font-medium text-[10px] sm:text-xs">
                      Data
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Pyramid levels */}
            <div className="flex flex-col gap-1.5 px-6 sm:px-10">
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
                      onClick={() => setSelectedLevel(isSelected ? null : level.id)}
                      className={`
                        relative transition-all duration-300 w-full
                        ${isSelected ? "scale-[1.02] z-10" : "hover:scale-[1.01]"}
                      `}
                      style={{ maxWidth: `${widthPercent}%` }}
                    >
                      <div
                        className={`
                          flex items-center justify-between p-4 rounded-xl border-2
                          bg-slate-800/50 ${colors.border}
                          ${isSelected ? `ring-2 ring-${level.color}-500 shadow-lg ${colors.glow}` : ""}
                          ${hasActivities ? "" : "opacity-60"}
                          backdrop-blur-sm
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="text-left">
                            <p className={`font-semibold text-sm ${colors.text}`}>
                              {level.name}
                            </p>
                            <p className="text-xs text-slate-500 hidden sm:block">
                              {level.stakeholders.join(" / ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {activityCount > 0 ? (
                            <Badge className={`${colors.bg} ${colors.text} border ${colors.border} rounded-full px-2.5 py-0.5`}>
                              <Activity className="h-3 w-3 mr-1" />
                              {activityCount}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-slate-500 text-xs rounded-full">
                              0
                            </Badge>
                          )}
                          {isSelected ? (
                            <ChevronUp className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Activity count indicator dot */}
                      {hasActivities && (
                        <div
                          className={`absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-800 ${isSelected ? "animate-pulse" : ""
                            }`}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coverage summary */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Stakeholder Coverage</span>
              <div className="flex items-center gap-2">
                <div className="w-24 sm:w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${coverageStats.percentage === 100
                      ? "bg-emerald-500"
                      : coverageStats.percentage >= 60
                        ? "bg-amber-500"
                        : "bg-red-500"
                      }`}
                    style={{ width: `${coverageStats.percentage}%` }}
                  />
                </div>
                <span className="font-medium text-white">{coverageStats.percentage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Panel - Below Pyramid */}
      {selectedLevelData && (
        <Card className={`glass-card`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-white">
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
              <p className="text-sm font-medium mb-2 text-slate-300">Key Stakeholders</p>
              <div className="flex flex-wrap gap-2">
                {selectedLevelData.level?.stakeholders.map((s) => (
                  <Badge key={s} className="bg-slate-700 text-slate-300 border-slate-600">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Mapped Activities */}
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1 text-slate-300">
                <Activity className="h-4 w-4" />
                Assigned Activities ({selectedLevelData.mapping.activities.length})
              </p>
              {selectedLevelData.mapping.activities.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {selectedLevelData.mapping.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-slate-200">{activity.description}</p>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50 text-xs shrink-0">
                          {activity.id}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Responsible: {activity.responsible}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-slate-700 text-center text-slate-400">
                  <AlertTriangle className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                  <p className="text-sm">No activities assigned to this level</p>
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
                <p className="text-sm font-medium mb-2 flex items-center gap-1 text-slate-300">
                  <Target className="h-4 w-4" />
                  Related Outputs ({selectedLevelData.mapping.outputs.length})
                </p>
                <div className="space-y-2">
                  {selectedLevelData.mapping.outputs.map((output) => (
                    <div
                      key={output.id}
                      className="p-3 rounded-lg border border-slate-700 bg-slate-900/50 text-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-slate-200">{output.description}</p>
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/50 text-xs shrink-0">
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
      )}

      {/* Summary Stats */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {coverageStats.levels.map((level) => {
              const colors = COLOR_MAP[level.color];
              const Icon = level.icon;

              return (
                <div
                  key={level.id}
                  className={`
                    p-4 rounded-xl border-2 text-center cursor-pointer transition-all
                    bg-slate-800/50 ${colors.border}
                    ${selectedLevel === level.id ? `ring-2 ring-${level.color}-500 shadow-lg ${colors.glow}` : ""}
                    hover:scale-[1.02] backdrop-blur-sm
                  `}
                  onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                >
                  <div className={`p-2 rounded-lg ${colors.bg} inline-block mb-2`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{level.activityCount}</p>
                  <p className="text-xs text-slate-400 truncate">{level.name}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
