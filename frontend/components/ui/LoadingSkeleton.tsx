"use client";

/**
 * Loading Skeleton with Shimmer Effect
 * Displays animated placeholder while content loads
 */

import { motion } from "framer-motion";
import { shimmer } from "@/lib/animations";

interface LoadingSkeletonProps {
    width?: string;
    height?: string;
    className?: string;
    variant?: "text" | "circular" | "rectangular";
}

export function LoadingSkeleton({
    width = "100%",
    height = "20px",
    className = "",
    variant = "rectangular",
}: LoadingSkeletonProps) {
    const baseClasses = "bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700";

    const variantClasses = {
        text: "rounded",
        circular: "rounded-full",
        rectangular: "rounded-lg",
    };

    return (
        <motion.div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{
                width,
                height,
                backgroundSize: "200% 100%",
            }}
            initial="initial"
            animate="animate"
            variants={shimmer}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl p-6 space-y-4">
            <LoadingSkeleton height="24px" width="60%" />
            <LoadingSkeleton height="16px" width="100%" />
            <LoadingSkeleton height="16px" width="90%" />
            <LoadingSkeleton height="16px" width="80%" />
            <div className="flex gap-2 mt-4">
                <LoadingSkeleton height="40px" width="100px" />
                <LoadingSkeleton height="40px" width="100px" />
            </div>
        </div>
    );
}
