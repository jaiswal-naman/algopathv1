/**
 * Custom hook for scroll-triggered animations
 * Uses Intersection Observer for performance
 */

import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface UseScrollAnimationOptions {
    threshold?: number;
    triggerOnce?: boolean;
    rootMargin?: string;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
    const {
        threshold = 0.1,
        triggerOnce = true,
        rootMargin = "0px 0px -100px 0px",
    } = options;

    const [hasAnimated, setHasAnimated] = useState(false);
    const { ref, inView } = useInView({
        threshold,
        triggerOnce,
        rootMargin,
    });

    useEffect(() => {
        if (inView && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [inView, hasAnimated]);

    return {
        ref,
        inView: triggerOnce ? hasAnimated : inView,
        hasAnimated,
    };
}

/**
 * Hook for parallax scrolling effect
 */
export function useParallax(speed: number = 0.5) {
    const [offset, setOffset] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const rate = scrolled * speed;
                setOffset(rate);
            }
        };

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (!prefersReducedMotion) {
            window.addEventListener("scroll", handleScroll, { passive: true });
            handleScroll();
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [speed]);

    return { ref: elementRef, offset };
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return prefersReducedMotion;
}
