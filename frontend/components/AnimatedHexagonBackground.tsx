"use client";

import { motion } from "framer-motion";

export function AnimatedHexagonBackground() {
    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5 }}>
            {/* SVG Pattern Background */}
            <svg className="w-full h-full opacity-60">
                <defs>
                    {/* Hexagon Pattern */}
                    <pattern
                        id="hexPattern"
                        x="0"
                        y="0"
                        width="100"
                        height="87"
                        patternUnits="userSpaceOnUse"
                    >
                        {/* Hexagon shape */}
                        <motion.path
                            d="M 50,5 L 85,25 L 85,65 L 50,85 L 15,65 L 15,25 Z"
                            fill="none"
                            stroke="rgba(16, 185, 129, 0.5)"
                            strokeWidth="2"
                            animate={{
                                stroke: [
                                    "rgba(16, 185, 129, 0.5)",
                                    "rgba(20, 184, 166, 0.6)",
                                    "rgba(6, 182, 212, 0.5)",
                                    "rgba(16, 185, 129, 0.5)",
                                ],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    </pattern>

                    {/* Animated Gradient for Diagonal Sweep */}
                    <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(16, 185, 129, 0)" />
                        <stop offset="30%" stopColor="rgba(16, 185, 129, 0.4)" />
                        <stop offset="50%" stopColor="rgba(20, 184, 166, 0.6)" />
                        <stop offset="70%" stopColor="rgba(6, 182, 212, 0.4)" />
                        <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                    </linearGradient>
                </defs>

                {/* Apply the hexagon pattern */}
                <rect width="100%" height="100%" fill="url(#hexPattern)" />

                {/* Animated diagonal sweep */}
                <motion.rect
                    width="200%"
                    height="200%"
                    x="-50%"
                    y="-50%"
                    fill="url(#sweepGradient)"
                    animate={{
                        x: ["-50%", "50%"],
                        y: ["-50%", "50%"],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </svg>
        </div>
    );
}
