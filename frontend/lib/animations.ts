/**
 * Animation Utilities and Variants for Framer Motion
 * Reusable animation configurations for consistent UI animations
 */

import { Variants } from "framer-motion";

// Easing functions
export const easings = {
    easeInOut: [0.43, 0.13, 0.23, 0.96],
    easeOut: [0.19, 1.0, 0.22, 1.0],
    easeIn: [0.87, 0, 0.13, 1.0],
    spring: { type: "spring", stiffness: 300, damping: 30 },
    smoothSpring: { type: "spring", stiffness: 100, damping: 20 },
};

// Fade animations
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
};

export const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
};

export const fadeInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
};

// Scale animations
export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: easings.easeOut },
    },
};

export const scaleUp: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3, ease: easings.easeOut },
    },
    tap: { scale: 0.95 },
};

// Stagger children
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: easings.easeOut },
    },
};

// Slide animations
export const slideInLeft: Variants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
    exit: {
        x: -100,
        opacity: 0,
        transition: { duration: 0.4, ease: easings.easeIn },
    },
};

export const slideInRight: Variants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
    exit: {
        x: 100,
        opacity: 0,
        transition: { duration: 0.4, ease: easings.easeIn },
    },
};

// Expand/Collapse
export const expandCollapse: Variants = {
    collapsed: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.4, ease: easings.easeInOut },
    },
    expanded: {
        height: "auto",
        opacity: 1,
        transition: { duration: 0.4, ease: easings.easeInOut },
    },
};

// 3D Card tilt effect
export const cardTilt = {
    rest: {
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        transition: { duration: 0.3, ease: easings.easeOut },
    },
    hover: {
        scale: 1.05,
        transition: { duration: 0.3, ease: easings.easeOut },
    },
};

// Pulse animation
export const pulse: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Shimmer effect
export const shimmer = {
    initial: { backgroundPosition: "-200% 0" },
    animate: {
        backgroundPosition: "200% 0",
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "linear",
        },
    },
};

// Rotate animation
export const rotate360: Variants = {
    initial: { rotate: 0 },
    animate: {
        rotate: 360,
        transition: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
        },
    },
};

// Bounce animation
export const bounce: Variants = {
    initial: { y: 0 },
    animate: {
        y: [-10, 0, -10],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Page transition
export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: easings.easeOut },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.4, ease: easings.easeIn },
    },
};

// Modal animations
export const modalBackdrop: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 },
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.3 },
    },
};

export const modalContent: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.4, ease: easings.easeOut },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.3, ease: easings.easeIn },
    },
};

// Number counter animation
export const counterAnimation = {
    duration: 2,
    ease: "easeOut",
};

// Glow effect
export const glowEffect = {
    initial: {
        boxShadow: "0 0 0px rgba(16, 185, 129, 0)",
    },
    animate: {
        boxShadow: [
            "0 0 0px rgba(16, 185, 129, 0)",
            "0 0 20px rgba(16, 185, 129, 0.5)",
            "0 0 0px rgba(16, 185, 129, 0)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};
