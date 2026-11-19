import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
    type MotionValue,
} from "motion/react";
import { useEffect, useState } from "react";

import { HERO_WORDS } from "~/const";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The end of the headline: types a word, holds it, deletes it, types the next.
// The prerendered HTML shows the first word, so the page reads fine before JS loads.
// Screen readers get the first word only (the animated text is aria-hidden).
export function CyclingWord() {
    const first = HERO_WORDS[0] ?? "";
    const [text, setText] = useState(first);
    const reduce = useReducedMotion();

    useEffect(() => {
        if (reduce) {
            setText(first);
            return;
        }
        let cancelled = false;
        (async () => {
            let index = 0;
            while (!cancelled) {
                const word = HERO_WORDS[index] ?? first;
                await wait(2600); // hold the full word
                for (let i = word.length; i >= 0 && !cancelled; i--) {
                    setText(word.slice(0, i));
                    await wait(45);
                }
                index = (index + 1) % HERO_WORDS.length;
                const next = HERO_WORDS[index] ?? first;
                await wait(250);
                for (let i = 1; i <= next.length && !cancelled; i++) {
                    setText(next.slice(0, i));
                    await wait(85);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [reduce, first]);

    return (
        <span className="block">
            <span className="sr-only">{first}</span>
            <span
                aria-hidden
                className="from-primary bg-linear-to-r to-fuchsia-500 bg-clip-text text-transparent"
            >
                {text || "​"}
            </span>
            <span
                aria-hidden
                className="caret-blink bg-primary ml-1 inline-block h-[0.85em] w-[3px] translate-y-[0.1em] rounded-full"
            />
        </span>
    );
}

interface FloatingKey {
    keys: string[];
    position: React.CSSProperties;
    depth: number; // how far it moves with the mouse; bigger feels closer
    rotate: number;
    accent?: boolean;
}

// Placed in the side margins and the gaps above and below the hero content
const KEYS: FloatingKey[] = [
    {
        keys: ["@ps:"],
        position: { top: "16%", left: "2.5%" },
        depth: 1.3,
        rotate: -8,
        accent: true,
    },
    {
        keys: ["Enter"],
        position: { top: "64%", left: "4%" },
        depth: 0.7,
        rotate: 6,
    },
    {
        keys: ["Ctrl", "Shift", "Space"],
        position: { top: "5%", left: "44%" },
        depth: 0.9,
        rotate: -3,
    },
    {
        keys: ["Esc"],
        position: { top: "18%", right: "3%" },
        depth: 0.8,
        rotate: 8,
    },
    {
        keys: ["Tab"],
        position: { top: "70%", right: "3.5%" },
        depth: 1.1,
        rotate: -6,
    },
];

function Key({
    item,
    index,
    mouseX,
    mouseY,
}: {
    item: FloatingKey;
    index: number;
    mouseX: MotionValue<number>;
    mouseY: MotionValue<number>;
}) {
    // Parallax: the mouse position (-1 to 1) moves each key by up to 18px times its depth
    const x = useTransform(mouseX, (v) => v * 18 * item.depth);
    const y = useTransform(mouseY, (v) => v * 18 * item.depth);

    return (
        <motion.div className="absolute" style={{ ...item.position, x, y }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: item.rotate }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -10, 0], // gentle bob, each key on its own rhythm
                }}
                transition={{
                    opacity: { delay: 0.3 + index * 0.12, duration: 0.6 },
                    scale: { delay: 0.3 + index * 0.12, duration: 0.6 },
                    y: {
                        duration: 5 + index * 0.9,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.4,
                    },
                }}
                className="flex items-center gap-1.5"
            >
                {item.keys.map((key) => (
                    <span
                        key={key}
                        className={
                            item.accent
                                ? "border-primary/30 bg-primary-soft text-primary-soft-foreground rounded-lg border border-b-4 px-3 py-2 font-mono text-sm font-semibold shadow-sm"
                                : "bg-card/80 text-muted-foreground rounded-lg border border-b-4 px-3 py-2 font-mono text-sm shadow-sm backdrop-blur-sm"
                        }
                    >
                        {key}
                    </span>
                ))}
            </motion.div>
        </motion.div>
    );
}

// Key caps floating behind the hero. Wide screens only, where the side margins have room.
// They are decoration (aria-hidden) and don't render at all for reduced motion.
export function FloatingKeys() {
    const reduce = useReducedMotion();
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const mouseX = useSpring(rawX, { stiffness: 60, damping: 20 });
    const mouseY = useSpring(rawY, { stiffness: 60, damping: 20 });

    useEffect(() => {
        if (reduce) return;
        const move = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth) * 2 - 1);
            rawY.set((e.clientY / window.innerHeight) * 2 - 1);
        };
        window.addEventListener("pointermove", move, { passive: true });
        return () => window.removeEventListener("pointermove", move);
    }, [reduce, rawX, rawY]);

    if (reduce) return null;

    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 hidden xl:block"
        >
            {KEYS.map((item, i) => (
                <Key
                    key={item.keys.join("+")}
                    item={item}
                    index={i}
                    mouseX={mouseX}
                    mouseY={mouseY}
                />
            ))}
        </div>
    );
}
