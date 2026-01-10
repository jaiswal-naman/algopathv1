"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { MatchedTemplate } from "@/types";
import { Check, Sparkles, FileText } from "lucide-react";

interface TemplatesStepProps {
  templates: MatchedTemplate[];
  onSelect: (templateId: string | null, generateNew: boolean) => Promise<void>;
  isLoading: boolean;
}

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
        <h2 className="text-xl font-semibold mb-2">
          We found {templates.length} matching templates
        </h2>
        <p className="text-muted-foreground">
          Select a template to use as a starting point, or generate a completely new LFA.
        </p>
      </div>

      {/* Template Cards */}
      <div className="grid gap-4">
        {templates.map((template) => {
          const isSelected = selectedId === template.id;
          const matchPercent = Math.round(template.score * 100);

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "hover:border-primary/50"
              }`}
              onClick={() => !isLoading && setSelectedId(template.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={matchPercent >= 85 ? "success" : "secondary"}
                    >
                      {matchPercent}% match
                    </Badge>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {template.preview && (
                  <p className="text-sm text-muted-foreground">
                    {template.preview}
                  </p>
                )}
                {isSelected && (
                  <Button
                    className="mt-4 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template.id);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Generating LFA...
                      </>
                    ) : (
                      "Use This Template"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Generate New Option */}
      <Card className="border-dashed">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <CardTitle className="text-lg">Generate New LFA</CardTitle>
          </div>
          <CardDescription>
            Don't see a good match? We can create a completely custom LFA based on
            your program description and answers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGenerateNew}
            disabled={isLoading}
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
        </CardContent>
      </Card>
    </div>
  );
}
