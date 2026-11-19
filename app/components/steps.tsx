import {
    motion,
    useMotionValueEvent,
    useScroll,
    useSpring,
} from "motion/react";
import { useRef, useState, type ReactNode } from "react";

import { cx } from "./ui";

export interface Step {
    title: string;
    body: ReactNode;
}

// "How it works": numbered steps joined by a line that draws as you scroll, and each
// number lights up when the line reaches it. The line is tied to the scroll position
// (not a timer), so scrolling back up undraws it.
export function Steps({ steps }: { steps: Step[] }) {
    const ref = useRef<HTMLOListElement>(null);
    // 0 when the list's top is 80% down the window, 1 when it reaches 35%
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 80%", "start 35%"],
    });
    const progress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 24,
    });

    // How many numbers are lit: the first at the start, the last when the line is done
    const [lit, setLit] = useState(0);
    const last = Math.max(steps.length - 1, 1);
    useMotionValueEvent(progress, "change", (v) => {
        const next =
            v <= 0.02
                ? 0
                : Math.min(steps.length, Math.floor(v * last + 0.02) + 1);
        setLit((current) => (current === next ? current : next));
    });

    return (
        <ol
            ref={ref}
            className="relative mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3"
        >
            {/* Horizontal line on wide screens, from the first number's center to the last.
                The right end: one column width (minus the number's half) from the edge. */}
            <div
                aria-hidden
                className="bg-border absolute top-4 left-4 hidden h-px md:block"
                style={{ right: "calc((100% - 4rem) / 3 - 1rem)" }}
            >
                <motion.div
                    className="bg-primary h-full origin-left"
                    style={{ scaleX: progress }}
                />
            </div>
            {/* Vertical line on phones, along the numbers on the left */}
            <div
                aria-hidden
                className="bg-border absolute top-4 bottom-12 left-4 w-px md:hidden"
            >
                <motion.div
                    className="bg-primary w-full origin-top"
                    style={{ scaleY: progress, height: "100%" }}
                />
            </div>

            {steps.map((step, i) => {
                const on = i < lit;
                return (
                    <li key={step.title} className="relative flex gap-4">
                        <motion.span
                            animate={{ scale: on ? [1, 1.18, 1] : 1 }}
                            transition={{ duration: 0.35 }}
                            className={cx(
                                "relative flex size-8 shrink-0 items-center justify-center rounded-full border font-mono text-sm font-semibold transition-colors duration-300",
                                on
                                    ? "border-primary bg-primary text-primary-foreground shadow-primary/40 shadow-lg"
                                    : "bg-card text-muted-foreground",
                            )}
                        >
                            {i + 1}
                        </motion.span>
                        <div>
                            <h3 className="font-semibold">{step.title}</h3>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {step.body}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}
