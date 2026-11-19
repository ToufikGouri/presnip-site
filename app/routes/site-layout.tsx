import { motion, MotionConfig } from "motion/react";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";

import { CursorGlow } from "~/components/cursor-glow";
import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";

// The frame every page shares: header, the page itself, footer.
// "isolate" starts a new stacking layer, so the cursor glow (z -10) sits above the page
// background but behind all content. MotionConfig makes every animation respect the
// visitor's "reduce motion" setting.
export default function SiteLayout() {
    const location = useLocation();

    // Pages fade in when you move between them, but not on the first load: the prerendered
    // HTML must be visible straight away (and without JavaScript).
    const firstLoad = useRef(true);
    useEffect(() => {
        firstLoad.current = false;
    }, []);

    return (
        <MotionConfig reducedMotion="user">
            <div className="relative isolate flex min-h-dvh flex-col">
                <a
                    href="#main"
                    className="focus:bg-card sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:shadow"
                >
                    Skip to content
                </a>
                <CursorGlow />
                <SiteHeader />
                <main id="main" className="flex-1">
                    <motion.div
                        key={location.pathname}
                        initial={
                            firstLoad.current ? false : { opacity: 0, y: 8 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
                <SiteFooter />
            </div>
        </MotionConfig>
    );
}
