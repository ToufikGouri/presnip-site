import { Outlet } from "react-router";

import { SiteFooter } from "~/components/site-footer";
import { SiteHeader } from "~/components/site-header";

// The frame every page shares: header, the page itself, footer
export default function SiteLayout() {
    return (
        <div className="flex min-h-dvh flex-col">
            <a
                href="#main"
                className="focus:bg-card sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:px-3 focus:py-2 focus:text-sm focus:shadow"
            >
                Skip to content
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
                <Outlet />
            </main>
            <SiteFooter />
        </div>
    );
}
