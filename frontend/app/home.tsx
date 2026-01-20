"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ImageCarousel } from "@/components/ImageCarousel";
import { FlippableCard } from "@/components/ui/FlippableCard";
import {
    fadeInUp,
    staggerContainer,
    staggerItem,
    scaleUp,
} from "@/lib/animations";

export default function Home() {
    const router = useRouter();
    const { ref: heroRef, inView: heroInView } = useScrollAnimation();
    const { ref: featuresRef, inView: featuresInView } = useScrollAnimation();
    const { ref: statsRef, inView: statsInView } = useScrollAnimation();

    const features = [
        {
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
            title: "Guided Framework",
            description: "Logical structure that simplifies your design thinking",
            color: "from-emerald-500 to-teal-500",
        },
        {
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop",
            title: "Systems Thinking",
            description: "Learn by doing with intuitive tools",
            color: "from-cyan-500 to-blue-500",
        },
        {
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
            title: "Non-Technical",
            description: "For NGO teams with zero design expertise",
            color: "from-purple-500 to-pink-500",
        },
    ];

    return (
        <div className="min-h-[calc(100vh-200px)] relative flex flex-col items-center justify-center px-4 py-12">
            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-10 right-20 w-16 h-16 border-2 border-emerald-400/20 rotate-45 hidden md:block"
                animate={{
                    y: [0, -20, 0],
                    rotate: [45, 50, 45],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 left-10 w-12 h-12 border-2 border-emerald-500/20 rounded-full hidden md:block"
                animate={{
                    y: [0, 20, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Main Content */}
            <div className="max-w-5xl w-full space-y-12 relative z-10 text-center">
                {/* Hero Section */}
                <motion.div
                    ref={heroRef}
                    initial="hidden"
                    animate={heroInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="space-y-6"
                >
                    <motion.h1
                        variants={staggerItem}
                        className="text-5xl md:text-7xl font-bold text-white leading-tight"
                    >
                        Welcome to{" "}
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            AlgoPath
                        </span>
                    </motion.h1>
                    <motion.p
                        variants={staggerItem}
                        className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto"
                    >
                        Design clear, system-aligned education programs using a guided
                        framework—no consultants needed
                    </motion.p>
                    <motion.p
                        variants={staggerItem}
                        className="text-lg text-slate-400 max-w-3xl mx-auto"
                    >
                        Replace the blank page with intuitive tools that reduce design effort by 60%
                    </motion.p>
                </motion.div>

                {/* Image Carousel Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="w-full"
                >
                    <ImageCarousel
                        images={[
                            {
                                src: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop",
                                alt: "Students learning",
                                title: "Empowering Education",
                                description: "Transform learning outcomes through structured framework design"
                            },
                            {
                                src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=600&fit=crop",
                                alt: "Collaborative learning",
                                title: "Collaborative Approach",
                                description: "Build effective programs with stakeholder-driven methodologies"
                            },
                            {
                                src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&h=600&fit=crop",
                                alt: "Innovation in education",
                                title: "Innovation & Impact",
                                description: "Create measurable change in public education across India"
                            }
                        ]}
                    />
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                    ref={featuresRef}
                    initial="hidden"
                    animate={featuresInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            variants={staggerItem}
                        >
                            <FlippableCard
                                image={feature.image}
                                title={feature.title}
                                description={feature.description}
                                color={feature.color}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats */}
                <motion.div
                    ref={statsRef}
                    initial="hidden"
                    animate={statsInView ? "visible" : "hidden"}
                    variants={staggerContainer}
                    className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
                >
                    <motion.div variants={staggerItem} className="text-center">
                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                            <AnimatedCounter value={60} suffix="%" />
                        </div>
                        <div className="text-sm text-slate-400 mt-2">Less Effort</div>
                    </motion.div>
                    <motion.div variants={staggerItem} className="text-center">
                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            <AnimatedCounter value={0} />
                        </div>
                        <div className="text-sm text-slate-400 mt-2">Consultants Needed</div>
                    </motion.div>
                    <motion.div variants={staggerItem} className="text-center">
                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            <AnimatedCounter value={100} suffix="%" />
                        </div>
                        <div className="text-sm text-slate-400 mt-2">System-Aligned</div>
                    </motion.div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-center mt-12"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            onClick={() => router.push("/lfa-builder")}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-12 py-6 rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 group"
                        >
                            Start Designing Your Program
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
