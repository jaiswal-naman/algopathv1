"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = "" }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
      },
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart || !containerRef.current) return;

      try {
        setError(null);
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError("Failed to render diagram");
      }
    };

    renderDiagram();
  }, [chart]);

  if (error) {
    return (
      <div className={`p-4 bg-red-50 text-red-600 rounded-md ${className}`}>
        <p className="font-medium">Diagram Error</p>
        <p className="text-sm">{error}</p>
        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
