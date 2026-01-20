"use client";

import { Wizard } from "@/components/wizard";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Build Your Logical Framework
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Transform your program ideas into structured LFA documents with AI assistance.
          Describe your program, answer a few questions, and get a complete framework.
        </p>
      </div>

      {/* Wizard */}
      <Wizard />
    </div>
  );
}
