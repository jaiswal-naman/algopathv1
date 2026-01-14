"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileJson,
  Loader2,
} from "lucide-react";
import type { LFADocument } from "@/types";

interface ExportControlsPanelProps {
  lfaDocument: LFADocument;
  sessionId?: string;
}

export function ExportControlsPanel({
  lfaDocument,
  sessionId,
}: ExportControlsPanelProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];
  const safeTitle = lfaDocument.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
  const filename = `${safeTitle}_LFA_${today}`;

  const handleExport = async (format: string) => {
    setIsExporting(format);
    try {
      const exportSessionId = sessionId || crypto.randomUUID();

      const response = await fetch("http://localhost:8000/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: exportSessionId,
          format: format,
          lfa_data: lfaDocument,
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
      alert(`Export failed: ${error}`);
    } finally {
      setIsExporting(null);
    }
  };

  const handleJSONDownload = () => {
    const blob = new Blob([JSON.stringify(lfaDocument, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <CardTitle>Export Document</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Export Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport("csv")}
            disabled={isExporting !== null}
            className="flex-1 min-w-[120px]"
          >
            {isExporting === "csv" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4 mr-2" />
            )}
            CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport("docx")}
            disabled={isExporting !== null}
            className="flex-1 min-w-[120px]"
          >
            {isExporting === "docx" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <FileText className="h-4 w-4 mr-2" />
            )}
            Word
          </Button>
          <Button
            variant="outline"
            onClick={handleJSONDownload}
            disabled={isExporting !== null}
            className="flex-1 min-w-[120px]"
          >
            <FileJson className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>

        {/* Filename Preview */}
        <div className="p-3 bg-muted/50 rounded-md">
          <p className="text-xs text-muted-foreground mb-1">Filename</p>
          <code className="text-sm">{filename}.[format]</code>
        </div>
      </CardContent>
    </Card>
  );
}
