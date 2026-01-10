"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Lightbulb } from "lucide-react";

interface InputStepProps {
  onSubmit: (input: string) => Promise<void>;
  isLoading: boolean;
}

const examplePrompts = [
  "We want to improve literacy rates in rural primary schools through teacher training and providing learning materials to students.",
  "Our program aims to reduce malnutrition among children under 5 by training community health workers and establishing nutrition centers.",
  "We're launching a youth skills development initiative to prepare unemployed young people for jobs in the technology sector.",
];

export function InputStep({ onSubmit, isLoading }: InputStepProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length >= 10) {
      await onSubmit(input);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Describe Your Program</CardTitle>
        <CardDescription>
          Tell us about your program, initiative, or project. Include the goals,
          target audience, and any challenges you're trying to address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Example: We want to improve learning outcomes for students in underserved communities by training teachers and providing educational resources..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            className="resize-none"
            disabled={isLoading}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {input.length} characters (minimum 10)
            </span>
            <Button
              type="submit"
              disabled={input.trim().length < 10 || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </form>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Lightbulb className="h-4 w-4" />
            <span>Need inspiration? Try one of these examples:</span>
          </div>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(example)}
                className="block w-full text-left text-sm p-3 rounded-md border bg-muted/50 hover:bg-muted transition-colors"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
