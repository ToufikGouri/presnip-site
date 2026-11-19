import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

const INTERACTIVE =
    "a[href], button:not(:disabled), summary, label[for], select, input, textarea, [role='button'], [role='option']";

// A soft purple light that trails the mouse, behind the page content.
// Runs only in the browser, only with a mouse or trackpad, and not for people who
// ask their system for reduced motion. It grows a little over things you can click.
export function CursorGlow() {
    const [enabled, setEnabled] = useState(false);
    const [visible, setVisible] = useState(false);
    const [overInteractive, setOverInteractive] = useState(false);

    // Motion values change without re-rendering React, so following the mouse stays cheap.
    // The springs make the glow lag slightly behind, which reads as "trailing".
    const x = useMotionValue(-1000);
    const y = useMotionValue(-1000);
    const springX = useSpring(x, { stiffness: 260, damping: 30, mass: 0.6 });
    const springY = useSpring(y, { stiffness: 260, damping: 30, mass: 0.6 });

    useEffect(() => {
        const fine = matchMedia("(pointer: fine)");
        const calm = matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => setEnabled(fine.matches && !calm.matches);
        update();
        fine.addEventListener("change", update);
        calm.addEventListener("change", update);
        return () => {
            fine.removeEventListener("change", update);
            calm.removeEventListener("change", update);
        };
    }, []);

    useEffect(() => {
        if (!enabled) return;
        const move = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            x.set(e.clientX);
            y.set(e.clientY);
            setVisible(true);
            const target = e.target instanceof Element ? e.target : null;
            setOverInteractive(Boolean(target?.closest(INTERACTIVE)));
        };
        const leave = () => setVisible(false);
        window.addEventListener("pointermove", move, { passive: true });
        document.documentElement.addEventListener("pointerleave", leave);
        return () => {
            window.removeEventListener("pointermove", move);
            document.documentElement.removeEventListener("pointerleave", leave);
        };
    }, [enabled, x, y]);

    if (!enabled) return null;

    return (
        <motion.div
            aria-hidden
            className="pointer-events-none fixed top-0 left-0 -z-10 size-[420px] rounded-full"
            style={{
                x: springX,
                y: springY,
                translateX: "-50%",
                translateY: "-50%",
                background:
                    "radial-gradient(circle, color-mix(in oklch, var(--primary) 22%, transparent) 0%, transparent 65%)",
            }}
            animate={{
                opacity: visible ? 1 : 0,
                scale: overInteractive ? 1.25 : 1,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
        />
    );
}
