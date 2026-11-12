import { Link } from "react-router";

import { buttonClass, Container } from "~/components/ui";
import { pageMeta } from "~/meta";
import type { Route } from "./+types/not-found";

export function meta({}: Route.MetaArgs) {
    return [
        ...pageMeta("Page not found", "This page doesn't exist."),
        { name: "robots", content: "noindex" },
    ];
}

// Any URL that matches no other route. It's prerendered as /404 and copied to 404.html.
export default function NotFound() {
    return (
        <Container className="flex max-w-xl flex-col items-center py-28 text-center">
            <p className="text-primary font-mono text-sm font-semibold">404</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Page not found
            </h1>
            <p className="text-muted-foreground mt-4">
                The page you're looking for doesn't exist or has moved.
            </p>
            <Link to="/" className={buttonClass("primary", "mt-8")}>
                Back to home
            </Link>
        </Container>
    );
}
