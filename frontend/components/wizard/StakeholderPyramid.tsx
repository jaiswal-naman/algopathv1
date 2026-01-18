"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, MapPin, School, GraduationCap } from "lucide-react";

interface StakeholderLevel {
  level: string;
  title: string;
  stakeholders: string[];
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const stakeholderLevels: StakeholderLevel[] = [
  {
    level: "District",
    title: "District Level",
    stakeholders: ["DEO", "DIET", "DM"],
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30 border-purple-300",
    icon: <Building2 className="h-4 w-4" />,
  },
  {
    level: "Block",
    title: "Block Level",
    stakeholders: ["BRP", "BRCC", "BEO"],
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30 border-blue-300",
    icon: <MapPin className="h-4 w-4" />,
  },
  {
    level: "Cluster",
    title: "Cluster Level",
    stakeholders: ["CRP", "CRCC"],
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30 border-green-300",
    icon: <Users className="h-4 w-4" />,
  },
  {
    level: "School",
    title: "School Level",
    stakeholders: ["HM", "Teachers", "Students"],
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30 border-orange-300",
    icon: <School className="h-4 w-4" />,
  },
];

interface StakeholderPyramidProps {
  highlightLevel?: string;
  compact?: boolean;
}

export function StakeholderPyramid({ highlightLevel, compact = false }: StakeholderPyramidProps) {
  if (compact) {
    return (
      <div className="flex flex-col gap-1">
        {stakeholderLevels.map((level, index) => {
          const isHighlighted = highlightLevel === level.level.toLowerCase();
          const width = 100 - (index * 15);

          return (
            <div
              key={level.level}
              className={`mx-auto transition-all duration-300 ${isHighlighted ? 'scale-105' : ''}`}
              style={{ width: `${width}%` }}
            >
              <div
                className={`flex items-center justify-center gap-1 py-1 px-2 rounded text-xs font-medium border ${level.bgColor} ${level.color} ${isHighlighted ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              >
                {level.icon}
                <span>{level.stakeholders.join(" / ")}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-white">
          <GraduationCap className="h-5 w-5 text-emerald-500" />
          Shikshagraha Education Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {stakeholderLevels.map((level, index) => {
            const isHighlighted = highlightLevel === level.level.toLowerCase();

            return (
              <div
                key={level.level}
                className={`transition-all duration-300 ${isHighlighted ? 'scale-[1.02]' : ''}`}
              >
                <div
                  className={`flex flex-col gap-2 py-3 px-4 rounded-lg border-2 ${level.level === "District"
                      ? "bg-purple-100/10 border-purple-400"
                      : level.level === "Block"
                        ? "bg-blue-100/10 border-blue-400"
                        : level.level === "Cluster"
                          ? "bg-emerald-100/10 border-emerald-400"
                          : "bg-orange-100/10 border-orange-400"
                    } ${isHighlighted ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-800' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${level.level === "District"
                        ? "bg-purple-500/20"
                        : level.level === "Block"
                          ? "bg-blue-500/20"
                          : level.level === "Cluster"
                            ? "bg-emerald-500/20"
                            : "bg-orange-500/20"
                      }`}>
                      {level.icon}
                    </div>
                    <span className={`font-semibold text-sm ${level.level === "District"
                        ? "text-purple-300"
                        : level.level === "Block"
                          ? "text-blue-300"
                          : level.level === "Cluster"
                            ? "text-emerald-300"
                            : "text-orange-300"
                      }`}>
                      {level.title}
                    </span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {level.stakeholders.map((stakeholder) => (
                      <Badge
                        key={stakeholder}
                        className={`text-xs font-medium ${level.level === "District"
                            ? "bg-purple-500/30 text-purple-200 border-purple-400/50"
                            : level.level === "Block"
                              ? "bg-blue-500/30 text-blue-200 border-blue-400/50"
                              : level.level === "Cluster"
                                ? "bg-emerald-500/30 text-emerald-200 border-emerald-400/50"
                                : "bg-orange-500/30 text-orange-200 border-orange-400/50"
                          } border`}
                      >
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 text-center mt-4 italic">
          Support flows down, data flows up
        </p>
      </CardContent>
    </Card>
  );
}
