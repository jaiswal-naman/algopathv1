"use client";

/**
 * Animated Tool Card Component
 * Reusable card with 3D tilt and hover effects for advanced tools
 */

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { scaleUp } from "@/lib/animations";

interface AnimatedToolCardProps {
    id: string;
    label: string;
    icon: LucideIcon;
    isActive: boolean;
    onClick: () => void;
    color?: string;
}

export function AnimatedToolCard({
    id,
    label,
    icon: Icon,
    isActive,
    onClick,
    color = "emerald",
}: AnimatedToolCardProps) {
    return (
        <motion.button
            onClick={onClick}
            variants={scaleUp}
            whileHover="hover"
            whileTap="tap"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-300 whitespace-nowrap relative overflow-hidden ${isActive
                    ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/50 scale-105`
                    : `bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 hover:border-${color}-500/30`
                }`}
        >
            {/* Animated background gradient on hover */}
            {!isActive && (
                <motion.div
                    className={`absolute inset-0 bg-gradient-to-r from-${color}-500/0 via-${color}-500/10 to-${color}-500/0`}
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                />
            )}

            <motion.div
                animate={isActive ? { rotate: [0, 5, -5, 0] } : {}}
                transition={{ duration: 0.5 }}
            >
                <Icon className="h-4 w-4 relative z-10" />
            </motion.div>

            <span className="text-sm font-semibold relative z-10">{label}</span>

            {isActive && (
                <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                />
            )}
        </motion.button>
    );
}
