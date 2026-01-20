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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Shikshagraha Education Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {stakeholderLevels.map((level, index) => {
            const isHighlighted = highlightLevel === level.level.toLowerCase();
            const width = 100 - (index * 12);

            return (
              <div
                key={level.level}
                className={`mx-auto transition-all duration-300 ${isHighlighted ? 'scale-[1.02]' : ''}`}
                style={{ width: `${width}%` }}
              >
                <div
                  className={`flex items-center justify-between py-2 px-3 rounded-lg border ${level.bgColor} ${isHighlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md bg-white/50 dark:bg-black/20 ${level.color}`}>
                      {level.icon}
                    </div>
                    <span className={`font-medium text-sm ${level.color}`}>
                      {level.title}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {level.stakeholders.map((stakeholder) => (
                      <Badge
                        key={stakeholder}
                        variant="secondary"
                        className={`text-xs ${level.color} bg-white/70 dark:bg-black/30`}
                      >
                        {stakeholder}
                      </Badge>
                    ))}
                  </div>
                </div>
                {index < stakeholderLevels.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <div className="w-0.5 h-2 bg-muted-foreground/30" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Support flows down, data flows up
        </p>
      </CardContent>
    </Card>
  );
}
