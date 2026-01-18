"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, RefreshCw, CheckCircle, Sparkles } from "lucide-react";
import type { LFADocument } from "@/types";
import { useState } from "react";

interface CompletedStepProps {
    lfaDocument: LFADocument;
    onReset: () => void;
    sessionId?: string;
}

export function CompletedStep({ lfaDocument, onReset, sessionId }: CompletedStepProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleQuickExport = async (format: "csv" | "docx") => {
        setIsExporting(true);
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

            if (!response.ok) throw new Error("Export failed");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${lfaDocument.title.replace(/\\s+/g, "_")}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (e) {
            console.error(e);
            alert("Export failed: " + e);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="glass-card max-w-2xl w-full">
                <CardContent className="pt-12 pb-12 px-8 text-center">
                    {/* Success Icon */}
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
                            <CheckCircle className="h-24 w-24 text-emerald-400 relative" />
                        </div>
                    </div>

                    {/* Thank You Message */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Congratulations!
                    </h1>
                    <p className="text-xl text-slate-300 mb-2">
                        Your LFA is Completed
                    </p>
                    <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">
                        You've successfully created a comprehensive Logical Framework for{" "}
                        <span className="text-emerald-400 font-semibold">{lfaDocument.title}</span>
                    </p>

                    {/* Decorative Divider */}
                    <div className="flex items-center gap-4 mb-8 max-w-md mx-auto">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                        <Sparkles className="h-5 w-5 text-emerald-400" />
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
                    </div>

                    {/* Export Options */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Export Your Design
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={() => handleQuickExport("csv")}
                                disabled={isExporting}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg"
                            >
                                <Download className="h-5 w-5 mr-2" />
                                Download CSV
                            </Button>
                            <Button
                                onClick={() => handleQuickExport("docx")}
                                disabled={isExporting}
                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg"
                            >
                                <Download className="h-5 w-5 mr-2" />
                                Download Word
                            </Button>
                        </div>
                    </div>

                    {/* Start New */}
                    <div className="pt-6 border-t border-slate-700">
                        <p className="text-sm text-slate-400 mb-4">
                            Want to create another LFA?
                        </p>
                        <Button
                            variant="outline"
                            onClick={onReset}
                            className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Start New Design
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
