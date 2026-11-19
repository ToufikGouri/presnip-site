import { motion, type Variants } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

// Small animation pieces shared by the pages. All of them run in the browser after the
// prerendered HTML loads. Elements start hidden (opacity 0) in that HTML, so root.tsx has a
// <noscript> rule that shows everything [data-reveal] when JavaScript is off.

const EASE = [0.22, 1, 0.36, 1] as const; // quick start, soft landing

// Starts revealing a little before the element is fully in view, and only once
const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const;

// Fades and lifts one block into view as you scroll to it
export function Reveal({
    children,
    className,
    delay = 0,
}: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    return (
        <motion.div
            data-reveal
            className={className}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.6, ease: EASE, delay }}
        >
            {children}
        </motion.div>
    );
}

const group: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

type GroupTag = "div" | "ul" | "ol";
type ItemTag = "div" | "li" | "article";

// A list whose children (RevealItem) appear one after another when it scrolls into view
export function RevealGroup({
    as = "div",
    className,
    children,
}: {
    as?: GroupTag;
    className?: string;
    children: ReactNode;
}) {
    const Tag = motion[as];
    return (
        <Tag
            className={className}
            variants={group}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
        >
            {children}
        </Tag>
    );
}

export function RevealItem({
    as = "div",
    className,
    children,
    onPointerMove,
}: {
    as?: ItemTag;
    className?: string;
    children: ReactNode;
    onPointerMove?: (e: PointerEvent<HTMLElement>) => void;
}) {
    const Tag = motion[as];
    return (
        <Tag
            data-reveal
            className={className}
            variants={item}
            onPointerMove={onPointerMove}
        >
            {children}
        </Tag>
    );
}

// For cards with the "glow-card" class: stores where the mouse is inside the card in two
// CSS variables, and app.css draws a purple light on the border at that spot.
export function spotlightMove(e: PointerEvent<HTMLElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

// A checkmark that draws itself in when it scrolls into view
export function AnimatedCheck({
    delay = 0,
    className,
}: {
    delay?: number;
    className?: string;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden
        >
            <motion.path
                d="M20 6 9 17l-5-5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: "easeOut", delay }}
            />
        </svg>
    );
}
