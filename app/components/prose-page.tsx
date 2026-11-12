import type { ReactNode } from "react";

import { Container, Eyebrow } from "./ui";

// The frame for text pages (privacy, contact, later a guide): a title block and a
// readable column. Styles for the text inside are on the wrapper, so pages stay plain JSX.
export function ProsePage({
    eyebrow,
    title,
    lead,
    children,
}: {
    eyebrow: string;
    title: string;
    lead?: ReactNode;
    children: ReactNode;
}) {
    return (
        <Container className="max-w-3xl py-16 sm:py-20">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                {title}
            </h1>
            {lead && (
                <p className="text-muted-foreground mt-4 text-lg text-pretty">
                    {lead}
                </p>
            )}
            {/* a:not([class]) styles plain text links only, so buttons keep their own colors */}
            <div className="[&_p]:text-muted-foreground [&_section>ul]:text-muted-foreground [&_a:not([class])]:text-primary mt-12 space-y-10 leading-relaxed [&_a:not([class])]:font-medium [&_a:not([class])]:underline-offset-4 [&_a:not([class])]:hover:underline [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:mt-2 [&_p]:mt-3 [&_section>ul]:mt-3 [&_section>ul]:list-disc [&_section>ul]:pl-5">
                {children}
            </div>
        </Container>
    );
}
