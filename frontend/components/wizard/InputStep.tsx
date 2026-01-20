"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

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
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length >= 10) {
      await onSubmit(input);
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  const charCount = input.length;
  const minChars = 10;
  const progress = Math.min((charCount / minChars) * 100, 100);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <Card className="bg-slate-800/50 border-slate-700 shadow-xl">
        <CardHeader>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-white">Describe Your Program</CardTitle>
            </div>
            <CardDescription className="text-slate-300">
              Tell us about your program, initiative, or project. Include the goals,
              target audience, and any challenges you're trying to address.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative"
            >
              <Textarea
                placeholder="Example: We want to improve learning outcomes for students in underserved communities by training teachers and providing educational resources..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                rows={8}
                className={`resize-none bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500 transition-all duration-300 ${isFocused ? "ring-2 ring-emerald-500/50 border-emerald-500" : ""
                  }`}
                disabled={isLoading}
              />
              {isFocused && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500"
                  style={{ originX: 0 }}
                />
              )}
            </motion.div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium transition-colors ${charCount >= minChars ? "text-emerald-400" : "text-slate-400"
                  }`}>
                  {charCount} / {minChars} characters
                </span>
                <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={input.trim().length < 10 || isLoading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>

          <motion.div
            className="mt-6 border-t border-slate-700 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              <span>Need inspiration? Try one of these examples:</span>
            </div>
            <motion.div
              className="space-y-2"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {examplePrompts.map((example, index) => (
                <motion.button
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleExampleClick(example)}
                  className="block w-full text-left text-sm p-3 rounded-lg border border-slate-700 bg-slate-900/30 hover:bg-slate-800/50 hover:border-emerald-500/50 transition-all duration-300 text-slate-300 group"
                  disabled={isLoading}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 p-1 rounded bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                      <Sparkles className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="flex-1">{example}</span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
