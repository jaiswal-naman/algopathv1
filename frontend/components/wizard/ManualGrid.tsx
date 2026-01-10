"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowRight, CornerDownRight } from "lucide-react";
import type { LFADocument, Outcome, Output, Activity } from "@/types";

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
            outputs: []
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
            activities: []
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
    const updateActivity = (outcomeIndex: number, outputIndex: number, activityIndex: number, newActivity: Activity) => {
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
        const newActivity: Activity = {
            id: `A${outputs[outputIndex].activities.length + 1}`,
            description: "New Activity",
            indicators: [],
            means_of_verification: []
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
        <div className="space-y-8 p-4 border rounded-lg bg-white overflow-x-auto">
            {/* HEADER INFO */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                <div>
                    <label className="text-sm font-bold text-gray-500">Project Title</label>
                    <Input value={data.title} onChange={(e) => updateField("title", e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-500">Goal / Impact</label>
                    <Textarea value={data.goal} onChange={(e) => updateField("goal", e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-500">Goal Indicators (Per line)</label>
                    <Textarea value={data.goal_indicators.join("\n")} onChange={(e) => updateGoalIndicators(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-500">Key Assumptions (Per line)</label>
                    <Textarea value={data.assumptions.join("\n")} onChange={(e) => updateAssumptions(e.target.value)} />
                </div>
            </div>

            {/* OUTCOMES LOOP */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-green-700">Outcomes</h3>
                    <Button size="sm" onClick={addOutcome}><Plus className="h-4 w-4 mr-2" />Add Outcome</Button>
                </div>

                {data.outcomes.map((outcome, i) => (
                    <div key={i} className="mb-8 border border-green-200 rounded-lg p-4 bg-green-50/30">
                        {/* Outcome Header */}
                        <div className="flex gap-4 mb-4 items-start">
                            <div className="flex-1">
                                <label className="text-xs font-bold text-green-600 uppercase">Outcome {i + 1}</label>
                                <Textarea
                                    value={outcome.description}
                                    onChange={(e) => updateOutcome(i, { ...outcome, description: e.target.value })}
                                    className="font-semibold text-lg"
                                />
                            </div>
                            <div className="w-1/3">
                                <label className="text-xs font-bold text-green-600 uppercase">Indicators</label>
                                <Textarea
                                    value={outcome.indicators.join("\n")}
                                    onChange={(e) => updateOutcome(i, { ...outcome, indicators: e.target.value.split("\n") })}
                                    className="text-sm h-20"
                                />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => removeOutcome(i)} className="text-red-400">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* OUTPUTS LOOP */}
                        <div className="pl-6 border-l-4 border-orange-200 ml-2">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-sm font-bold text-orange-600 flex items-center gap-2">
                                    <CornerDownRight className="h-4 w-4" /> Outputs
                                </h4>
                                <Button size="sm" variant="outline" onClick={() => addOutput(i)} className="h-6 text-xs px-2">Add Output</Button>
                            </div>

                            {outcome.outputs.map((output, j) => (
                                <div key={j} className="mb-4 bg-white p-3 rounded border border-orange-100 shadow-sm">
                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            <Input
                                                value={output.description}
                                                onChange={(e) => updateOutput(i, j, { ...output, description: e.target.value })}
                                                className="font-medium"
                                                placeholder="Output Description"
                                            />
                                        </div>
                                        <div className="w-1/3">
                                            <Input
                                                value={output.indicators.join(", ")}
                                                onChange={(e) => updateOutput(i, j, { ...output, indicators: e.target.value.split(",") })}
                                                placeholder="Indicators (comma sep)"
                                                className="text-xs"
                                            />
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => removeOutput(i, j)} className="h-8 w-8 text-red-300">
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    {/* ACTIVITIES LOOP */}
                                    <div className="pl-6 mt-2 border-l-2 border-purple-200 ml-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-purple-600">Activities</span>
                                            <Button size="xs" variant="ghost" onClick={() => addActivity(i, j)} className="h-5 text-[10px]">+ Activity</Button>
                                        </div>
                                        {output.activities.map((activity, k) => (
                                            <div key={k} className="flex gap-2 mb-1 items-center">
                                                <Input
                                                    value={activity.description}
                                                    onChange={(e) => updateActivity(i, j, k, { ...activity, description: e.target.value })}
                                                    className="h-7 text-xs"
                                                />
                                                <Button variant="ghost" size="icon" onClick={() => removeActivity(i, j, k)} className="h-6 w-6 text-red-300">
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
