"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { MatchedTemplate } from "@/types";
import { Sparkles, FileText, Target, Users, TrendingUp, BarChart3 } from "lucide-react";

interface TemplatesStepProps {
  templates: MatchedTemplate[];
  onSelect: (templateId: string | null, generateNew: boolean) => Promise<void>;
  isLoading: boolean;
}

// Icon mapping for different template types
const templateIcons = [Target, Users, TrendingUp, BarChart3, FileText];

// Color mapping for different match percentages
const getColorClasses = (percent: number) => {
  if (percent >= 80) return { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/50" };
  if (percent >= 60) return { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/50" };
  if (percent >= 40) return { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/50" };
  return { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/50" };
};

export function TemplatesStep({
  templates,
  onSelect,
  isLoading,
}: TemplatesStepProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelectTemplate = async (templateId: string) => {
    setSelectedId(templateId);
    await onSelect(templateId, false);
  };

  const handleGenerateNew = async () => {
    setSelectedId(null);
    await onSelect(null, true);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          We found {templates.length} matching templates
        </h2>
        <p className="text-slate-400">
          Select a template to use as a starting point, or generate a completely new LFA.
        </p>
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {templates.map((template, index) => {
          const isSelected = selectedId === template.id;
          const matchPercent = Math.round(template.score * 100);
          const colors = getColorClasses(matchPercent);
          const Icon = templateIcons[index % templateIcons.length];

          // Mock data for weight and issues (you can replace with actual data from template)
          const weight = Math.floor(Math.random() * 4) + 1; // 1-4
          const weightPercent = Math.floor(Math.random() * 20) + 15; // 15-35%
          const issues = Math.floor(Math.random() * 5) + 1; // 1-5

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-300 glass-card hover:scale-[1.02] ${isSelected
                  ? `ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/25`
                  : ""
                }`}
              onClick={() => !isLoading && handleSelectTemplate(template.id)}
            >
              <CardContent className="p-4">
                {/* Icon and Percentage */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                    <Icon className={`h-5 w-5 ${colors.text}`} />
                  </div>
                  <div className={`text-2xl font-bold ${colors.text}`}>
                    {matchPercent}%
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-sm font-semibold text-white mb-3 truncate" title={template.title}>
                  {template.title}
                </h3>

                {/* Weight and Issues */}
                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <div>Weight: <span className="text-white font-semibold">{weight}</span></div>
                    <div>{weightPercent}%</div>
                  </div>
                  <div className="text-slate-400">
                    <div className="text-white font-semibold">{issues} issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Template Action */}
      {selectedId && (
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={() => selectedId && handleSelectTemplate(selectedId)}
            disabled={isLoading}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
          >
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Generating LFA...
              </>
            ) : (
              "Use Selected Template"
            )}
          </Button>
        </div>
      )}

      {/* Generate New Option */}
      <Card className="border-2 border-dashed border-slate-600 bg-slate-800/30">
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-full">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Generate New LFA</h3>
              <p className="text-sm text-slate-400 mb-4 max-w-md">
                Don't see a good match? We can create a completely custom LFA based on
                your program description and answers.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleGenerateNew}
              disabled={isLoading}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              {isLoading && selectedId === null ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Generating Custom LFA...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Custom LFA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
