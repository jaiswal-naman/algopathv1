"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CornerDownRight, Target, TrendingUp, Package, Activity } from "lucide-react";
import type { LFADocument, Outcome, Output, Activity as ActivityType } from "@/types";

interface ManualGridProps {
    data: LFADocument;
    onChange: (newData: LFADocument) => void;
}

export function ManualGrid({ data, onChange }: ManualGridProps) {
    // Update Root Fields (Title, Goal)
    const updateField = (field: keyof LFADocument, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const updateGoalIndicators = (val: string) => {
        onChange({ ...data, goal_indicators: val.split("\n") });
    };
    const updateAssumptions = (val: string) => {
        onChange({ ...data, assumptions: val.split("\n") });
    };

    // --- Helper to update specific Outcome ---
    const updateOutcome = (index: number, newOutcome: Outcome) => {
        const outcomes = [...data.outcomes];
        outcomes[index] = newOutcome;
        onChange({ ...data, outcomes });
    };

    const addOutcome = () => {
        const newOutcome: Outcome = {
            id: `OC${data.outcomes.length + 1}`,
            description: "New Outcome",
            indicators: [""],
            means_of_verification: [""],
            outputs: [],
        };
        onChange({ ...data, outcomes: [...data.outcomes, newOutcome] });
    };

    const removeOutcome = (index: number) => {
        const outcomes = [...data.outcomes];
        outcomes.splice(index, 1);
        onChange({ ...data, outcomes });
    };

    // --- Helper to update Output within Outcome ---
    const updateOutput = (outcomeIndex: number, outputIndex: number, newOutput: Output) => {
        const outcomes = [...data.outcomes];
        const outputs = [...outcomes[outcomeIndex].outputs];
        outputs[outputIndex] = newOutput;
        outcomes[outcomeIndex] = { ...outcomes[outcomeIndex], outputs };
        onChange({ ...data, outcomes });
    };

    const addOutput = (outcomeIndex: number) => {
        const outcomes = [...data.outcomes];
        const newOutput: Output = {
            id: `OP${outcomes[outcomeIndex].outputs.length + 1}`,
            description: "New Output",
            indicators: [""],
            means_of_verification: [""],
            activities: [],
        };
        outcomes[outcomeIndex].outputs.push(newOutput);
        onChange({ ...data, outcomes });
    };

    const removeOutput = (outcomeIndex: number, outputIndex: number) => {
        const outcomes = [...data.outcomes];
        outcomes[outcomeIndex].outputs.splice(outputIndex, 1);
        onChange({ ...data, outcomes });
    };

    // --- Helper to update Activity within Output ---
    const updateActivity = (
        outcomeIndex: number,
        outputIndex: number,
        activityIndex: number,
        newActivity: ActivityType
    ) => {
        const outcomes = [...data.outcomes];
        const outputs = [...outcomes[outcomeIndex].outputs];
        const activities = [...outputs[outputIndex].activities];
        activities[activityIndex] = newActivity;
        outputs[outputIndex].activities = activities;
        outcomes[outcomeIndex].outputs = outputs;
        onChange({ ...data, outcomes });
    };

    const addActivity = (outcomeIndex: number, outputIndex: number) => {
        const outcomes = [...data.outcomes];
        const outputs = [...outcomes[outcomeIndex].outputs];
        const newActivity: ActivityType = {
            id: `A${outputs[outputIndex].activities.length + 1}`,
            description: "New Activity",
            indicators: [],
            means_of_verification: [],
        };
        outputs[outputIndex].activities.push(newActivity);
        outcomes[outcomeIndex].outputs = outputs;
        onChange({ ...data, outcomes });
    };

    const removeActivity = (outcomeIndex: number, outputIndex: number, activityIndex: number) => {
        const outcomes = [...data.outcomes];
        outcomes[outcomeIndex].outputs[outputIndex].activities.splice(activityIndex, 1);
        onChange({ ...data, outcomes });
    };

    return (
        <div className="space-y-8 p-4 md:p-6 border border-slate-700 rounded-lg bg-slate-800/50 overflow-x-auto">
            {/* HEADER INFO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/50 p-4 md:p-6 rounded-lg border border-slate-700">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-400 uppercase flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Project Title
                    </label>
                    <Input
                        value={data.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-400 uppercase">Goal / Impact</label>
                    <Textarea
                        value={data.goal}
                        onChange={(e) => updateField("goal", e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white min-h-[80px]"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-400 uppercase">
                        Goal Indicators (Per line)
                    </label>
                    <Textarea
                        value={data.goal_indicators.join("\n")}
                        onChange={(e) => updateGoalIndicators(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-emerald-400 uppercase">
                        Key Assumptions (Per line)
                    </label>
                    <Textarea
                        value={data.assumptions.join("\n")}
                        onChange={(e) => updateAssumptions(e.target.value)}
                        className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
                    />
                </div>
            </div>

            {/* OUTCOMES LOOP */}
            <section>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
                        <TrendingUp className="h-6 w-6" />
                        Outcomes
                    </h3>
                    <Button
                        size="sm"
                        onClick={addOutcome}
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Outcome
                    </Button>
                </div>

                {data.outcomes.map((outcome, i) => (
                    <div
                        key={i}
                        className="mb-6 border-2 border-purple-500/50 rounded-lg p-4 md:p-6 bg-purple-500/10"
                    >
                        {/* Outcome Header */}
                        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start">
                            <div className="flex-1 w-full space-y-2">
                                <div className="flex items-center justify-between">
                                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                                        Outcome {i + 1}
                                    </Badge>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOutcome(i)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={outcome.description}
                                    onChange={(e) => updateOutcome(i, { ...outcome, description: e.target.value })}
                                    className="font-semibold text-base bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div className="w-full md:w-1/3 space-y-2">
                                <label className="text-xs font-bold text-purple-400 uppercase">Indicators</label>
                                <Textarea
                                    value={outcome.indicators.join("\n")}
                                    onChange={(e) =>
                                        updateOutcome(i, { ...outcome, indicators: e.target.value.split("\n") })
                                    }
                                    className="text-sm h-20 bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                        </div>

                        {/* OUTPUTS LOOP */}
                        <div className="pl-0 md:pl-6 border-l-0 md:border-l-4 border-blue-500/50 ml-0 md:ml-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                                <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2">
                                    <Package className="h-4 w-4" />
                                    Outputs
                                </h4>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addOutput(i)}
                                    className="h-7 text-xs px-3 bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add Output
                                </Button>
                            </div>

                            {outcome.outputs.map((output, j) => (
                                <div
                                    key={j}
                                    className="mb-4 bg-slate-900/50 p-3 md:p-4 rounded-lg border border-blue-500/30"
                                >
                                    <div className="flex flex-col md:flex-row gap-3 items-start mb-3">
                                        <div className="flex-1 w-full">
                                            <Input
                                                value={output.description}
                                                onChange={(e) =>
                                                    updateOutput(i, j, { ...output, description: e.target.value })
                                                }
                                                className="font-medium bg-slate-800 border-slate-600 text-white"
                                                placeholder="Output Description"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/3">
                                            <Input
                                                value={output.indicators.join(", ")}
                                                onChange={(e) =>
                                                    updateOutput(i, j, { ...output, indicators: e.target.value.split(",") })
                                                }
                                                placeholder="Indicators (comma sep)"
                                                className="text-xs bg-slate-800 border-slate-600 text-white"
                                            />
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeOutput(i, j)}
                                            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* ACTIVITIES LOOP */}
                                    <div className="pl-0 md:pl-6 mt-3 border-l-0 md:border-l-2 border-amber-500/50 ml-0 md:ml-2">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                                                <Activity className="h-3 w-3" />
                                                Activities
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => addActivity(i, j)}
                                                className="h-6 text-[10px] px-2 text-amber-300 hover:text-amber-200 hover:bg-amber-500/20"
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                Activity
                                            </Button>
                                        </div>
                                        {output.activities.map((activity, k) => (
                                            <div key={k} className="flex gap-2 mb-2 items-center">
                                                <Input
                                                    value={activity.description}
                                                    onChange={(e) =>
                                                        updateActivity(i, j, k, { ...activity, description: e.target.value })
                                                    }
                                                    className="h-8 text-xs bg-slate-800 border-slate-600 text-white"
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeActivity(i, j, k)}
                                                    className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
