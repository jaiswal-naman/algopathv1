"use client";

import { Edit3 } from "lucide-react";
import { FAQSection } from "@/components/FAQSection";
import { FlippableCard } from "@/components/ui/FlippableCard";

export default function AboutPage() {
    const faqs = [
        {
            question: "What is AlgoPath?",
            answer: "AlgoPath is an AI-powered platform that helps education NGOs design clear, system-aligned programs using the Common Logical Framework Approach (LFA). It eliminates the 'blank page problem' by guiding organizations through structured program design without needing external consultants."
        },
        {
            question: "Who is AlgoPath designed for?",
            answer: "AlgoPath is specifically designed for education NGOs and organizations working in the public education sector in India. It's built for teams with little to no technical design expertise who want to create professional, well-structured program frameworks."
        },
        {
            question: "How does AlgoPath reduce design time?",
            answer: "AlgoPath reduces program design effort by up to 60% through intelligent workflows, guided thinking processes, and AI-assisted validation. It breaks down complex challenges into simple, structured steps that can be completed much faster than traditional methods."
        },
        {
            question: "What is the Logical Framework Approach (LFA)?",
            answer: "The Logical Framework Approach is a systematic methodology for planning, implementing, and evaluating development programs. It helps organizations define clear objectives, identify stakeholders, map interventions, and establish measurable indicators for success."
        },
        {
            question: "Do I need technical expertise to use AlgoPath?",
            answer: "No! AlgoPath is designed to be non-technical and user-friendly. The platform guides you through each step with clear instructions, making it accessible to teams without design or technical expertise."
        },
        {
            question: "How does the AI validation work?",
            answer: "Our AI checks the consistency and logic across your program's outcomes, interventions, and indicators. It ensures that your framework is coherent, aligned with best practices, and follows the LFA methodology correctly."
        },
        {
            question: "Can I export my LFA documents?",
            answer: "Yes! Once you've completed your framework, you can export it in multiple formats including PDF, Word documents, and visual diagrams. This makes it easy to share with stakeholders and integrate into your organization's workflows."
        },
        {
            question: "Is AlgoPath free to use?",
            answer: "AlgoPath is currently available for education NGOs working in India. Please contact us at kunupayal1@gmail.com for information about pricing and access to the platform."
        }
    ];

    return (
        <div className="min-h-[calc(100vh-200px)] relative flex flex-col items-center justify-center px-4 py-12">
            {/* Floating decorative elements */}
            <div className="absolute top-10 right-20 w-16 h-16 border-2 border-emerald-400/20 rotate-45 animate-float hidden md:block"></div>
            <div className="absolute bottom-20 left-10 w-12 h-12 border-2 border-emerald-500/20 rounded-full animate-float-slow hidden md:block"></div>

            {/* Main Content */}
            <div className="max-w-5xl w-full space-y-12 relative z-10">
                {/* Hero Section */}
                <div className="text-left space-y-6 animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl gap-2 font-bold text-white leading-tight">
                        About
                        <span className="bg-gradient-to-r pl-4 from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            AlgoPath
                        </span>
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
                    <FlippableCard
                        image="/feature1.png"
                        title="Guided Thinking"
                        description="Break down complex educational challenges into simple, structured steps."
                        color="from-emerald-500 to-teal-500"
                    />
                    <FlippableCard
                        image="/feature2.jpg"
                        title="Faster Design"
                        description="Reduce program design effort by up to 60% through intelligent workflows."
                        color="from-cyan-500 to-blue-500"
                    />
                    <FlippableCard
                        image="/feature3.png"
                        title="Logic Validation"
                        description="AI checks consistency across outcomes, interventions, and indicators."
                        color="from-purple-500 to-pink-500"
                    />
                </div>

                {/* FAQ Section */}
                <div className="animate-fade-in-up animation-delay-600 pt-8">
                    <FAQSection faqs={faqs} />
                </div>
            </div>
        </div>
    );
}
