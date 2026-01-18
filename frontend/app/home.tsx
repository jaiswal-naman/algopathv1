"use client";

import { useRouter } from "next/navigation";
import { Brain, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
    const router = useRouter();

    return (
        <div className="min-h-[calc(100vh-200px)] relative flex flex-col items-center justify-center px-4 py-12">
            {/* Floating decorative elements */}
            <div className="absolute top-10 right-20 w-16 h-16 border-2 border-emerald-400/20 rotate-45 animate-float hidden md:block"></div>
            <div className="absolute bottom-20 left-10 w-12 h-12 border-2 border-emerald-500/20 rounded-full animate-float-slow hidden md:block"></div>

            {/* Main Content */}
            <div className="max-w-5xl w-full space-y-12 relative z-10 text-center">
                {/* Hero Section */}
                <div className="space-y-6 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                        Welcome to AlgoPath
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto">
                        Design clear, system-aligned education programs using a guided
                        framework—no consultants needed
                    </p>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                        Replace the blank page with intuitive tools that reduce design effort by 60%
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-200">
                    {/* Guided Framework */}
                    <div className="glass-card rounded-2xl p-8 card-hover group">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-emerald-500/20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                                <Brain className="h-12 w-12 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Guided Framework
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Logical structure that simplifies your design thinking
                            </p>
                        </div>
                    </div>

                    {/* Systems Thinking */}
                    <div className="glass-card rounded-2xl p-8 card-hover group">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-emerald-500/20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                                <Zap className="h-12 w-12 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Systems Thinking
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Learn by doing with intuitive tools
                            </p>
                        </div>
                    </div>

                    {/* Non-Technical */}
                    <div className="glass-card rounded-2xl p-8 card-hover group">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 bg-emerald-500/20 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-500/30">
                                <Users className="h-12 w-12 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                Non-Technical
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                For NGO teams with zero design expertise
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-emerald-400">
                            60%
                        </div>
                        <div className="text-sm text-slate-400 mt-2">Less Effort</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-emerald-400">
                            0
                        </div>
                        <div className="text-sm text-slate-400 mt-2">Consultants Needed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold text-emerald-400">
                            100%
                        </div>
                        <div className="text-sm text-slate-400 mt-2">System-Aligned</div>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="text-center mt-12">
                    <Button
                        onClick={() => router.push("/lfa-builder")}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-lg px-12 py-6 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                    >
                        Start Designing Your Program →
                    </Button>
                </div>
            </div>
        </div>
    );
}
