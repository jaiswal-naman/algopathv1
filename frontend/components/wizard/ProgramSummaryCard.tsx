"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Calendar,
  MapPin,
  Tag,
  FileText,
  Clock,
  Edit3
} from "lucide-react";
import type { LFADocument, ProgramBrief } from "@/types";

interface ProgramSummaryCardProps {
  lfaDocument: LFADocument;
  programBrief?: ProgramBrief | null;
  version?: string;
  lastUpdated?: string;
  onEditMetadata?: () => void;
}

export function ProgramSummaryCard({
  lfaDocument,
  programBrief,
  version = "v1.0",
  lastUpdated,
  onEditMetadata,
}: ProgramSummaryCardProps) {
  const today = lastUpdated || new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Determine status based on version
  const isDraft = version.toLowerCase().includes("draft") || version === "v1.0";

  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-6">
        {/* Title Row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {lfaDocument.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Logical Framework Analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={isDraft ? "secondary" : "default"}
              className={isDraft ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" : ""}
            >
              {version} {isDraft && "(Draft)"}
            </Badge>
            {onEditMetadata && (
              <Button variant="ghost" size="sm" onClick={onEditMetadata}>
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Organization */}
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Organization</p>
              <p className="text-sm font-medium">
                {programBrief?.goal?.split(" ")[0] || "Not specified"}
              </p>
            </div>
          </div>

          {/* Donor */}
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Donor</p>
              <p className="text-sm font-medium">
                {programBrief?.context?.includes("UNICEF") ? "UNICEF" :
                 programBrief?.context?.includes("World Bank") ? "World Bank" :
                 "Self-funded"}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="text-sm font-medium">
                {programBrief?.geographic_scope || "12 months"}
              </p>
            </div>
          </div>

          {/* Geography */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Geography</p>
              <p className="text-sm font-medium">
                {programBrief?.geographic_scope || "National"}
              </p>
            </div>
          </div>

          {/* Theme */}
          <div className="flex items-start gap-2">
            <Tag className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Theme</p>
              <p className="text-sm font-medium">
                {lfaDocument.program_theme || programBrief?.program_theme || "Education"}
              </p>
            </div>
          </div>

          {/* Last Updated */}
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm font-medium">{today}</p>
            </div>
          </div>
        </div>

        {/* Goal Statement */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Program Goal</p>
              <p className="text-sm">{lfaDocument.goal}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
