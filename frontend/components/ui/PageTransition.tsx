"use client";

/**
 * Page Transition Wrapper
 * Provides smooth transitions between page navigations
 */

import { motion, AnimatePresence } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { usePrefersReducedMotion } from "@/hooks/useScrollAnimation";

interface PageTransitionProps {
    children: React.ReactNode;
    className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
    const prefersReducedMotion = usePrefersReducedMotion();

    if (prefersReducedMotion) {
        return <div className={className}>{children}</div>;
    }

    return (
        <AnimatePresence mode="wait">
            <motion.div
                className={className}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageTransition}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
