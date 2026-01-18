"use client";

import { Edit3 } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-[calc(100vh-200px)] relative flex flex-col items-center justify-center px-4 py-12">
            {/* Floating decorative elements */}
            <div className="absolute top-10 right-20 w-16 h-16 border-2 border-emerald-400/20 rotate-45 animate-float hidden md:block"></div>
            <div className="absolute bottom-20 left-10 w-12 h-12 border-2 border-emerald-500/20 rounded-full animate-float-slow hidden md:block"></div>

            {/* Main Content */}
            <div className="max-w-5xl w-full space-y-12 relative z-10">
                {/* Hero Section */}
                <div className="text-left space-y-6 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                        About AlgoPath
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-4xl">
                        AlgoPath empowers education NGOs to design clear, system-aligned
                        programs using the Common Logical Framework — without
                        relying on consultants.
                    </p>
                </div>

                {/* Mission Card */}
                <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden card-hover animate-fade-in-up animation-delay-200">
                    {/* Decorative icon */}
                    <div className="absolute top-6 right-6 opacity-20">
                        <Edit3 className="h-12 w-12 text-emerald-400" />
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/20 rounded-lg">
                            <Edit3 className="h-6 w-6 text-emerald-400" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            Our Mission
                        </h2>
                    </div>
                    <p className="text-lg text-slate-300 leading-relaxed">
                        AlgoPath aims to eliminate the 'blank page problem' by
                        guiding NGOs step through problem definition,
                        system actor mapping, intervention logic, and
                        indicator selection — ultimately reducing
                        program design time by nearly 60%.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-400">
                    {/* Guided Thinking */}
                    <div className="glass-card rounded-2xl p-8 card-hover group">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-emerald-500/20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                                <svg className="h-12 w-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Guided Thinking
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Break down complex educational challenges into simple,
                                structured steps.
                            </p>
                        </div>
                    </div>

                    {/* Faster Design */}
                    <div className="glass-card rounded-2xl p-8 card-hover group">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-emerald-500/20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                                <svg className="h-12 w-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Faster Design
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Reduce program design effort by up to 60% through
                                intelligent workflows.
                            </p>
                        </div>
                    </div>

                    {/* Logic Validation */}
                    <div className="glass-card rounded-2xl p-8 card-hover group">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-emerald-500/20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                                <svg className="h-12 w-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Logic Validation
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                AI checks consistency across outcomes, interventions,
                                and indicators.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
