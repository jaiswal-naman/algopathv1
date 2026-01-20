"use client";

/**
 * Animated Counter Component
 * Smoothly animates numbers from 0 to target value
 */

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/useScrollAnimation";

interface AnimatedCounterProps {
    value: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    className?: string;
}

export function AnimatedCounter({
    value,
    duration = 2,
    suffix = "",
    prefix = "",
    decimals = 0,
    className = "",
}: AnimatedCounterProps) {
    const prefersReducedMotion = usePrefersReducedMotion();
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

    const spring = useSpring(0, {
        duration: prefersReducedMotion ? 0 : duration * 1000,
        bounce: 0,
    });

    const display = useTransform(spring, (current) =>
        (Math.floor(current * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
    );

    useEffect(() => {
        if (!hasStarted) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setHasStarted(true);
                        spring.set(value);
                    }
                },
                { threshold: 0.1 }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => observer.disconnect();
        }
    }, [hasStarted, spring, value]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            <motion.span>{display}</motion.span>
            {suffix}
        </span>
    );
}
