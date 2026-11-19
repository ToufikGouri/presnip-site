import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { THEME_STORAGE_KEY } from "./const";
import "./app.css";

export const links: Route.LinksFunction = () => [
    { rel: "icon", type: "image/png", sizes: "32x32", href: "/icon/32.png" },
    { rel: "icon", type: "image/png", sizes: "16x16", href: "/icon/16.png" },
    { rel: "apple-touch-icon", href: "/icon/128.png" },
];

// Runs before the page paints, so a dark-mode visitor never sees a white flash.
// It is plain JS in a string because React hasn't loaded yet at that point.
const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
    THEME_STORAGE_KEY,
)});var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
                {/* Scroll reveals start at opacity 0 in the HTML. Without JS they'd never
                    appear, so show them as-is. */}
                <noscript>
                    <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
                </noscript>
                <Meta />
                <Links />
            </head>
            <body>
                {children}
                <ScrollRestoration />
                <Scripts />
            </body>
        </html>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Something went wrong";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "Page not found" : "Error";
        details = error.statusText || details;
    } else if (import.meta.env.DEV && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="mx-auto max-w-2xl px-4 py-24">
            <h1 className="text-2xl font-semibold">{message}</h1>
            <p className="text-muted-foreground mt-2">{details}</p>
            {stack && (
                <pre className="bg-muted mt-6 overflow-x-auto rounded-lg p-4 text-xs">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
