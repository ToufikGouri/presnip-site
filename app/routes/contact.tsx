import { Bug, Lightbulb, Mail, MessageCircleQuestion } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { spotlightMove } from "~/components/motion-bits";
import { ProsePage } from "~/components/prose-page";
import { buttonClass } from "~/components/ui";
import { PRODUCT_NAME, SUPPORT_EMAIL, SUPPORT_MAILTO } from "~/const";
import { pageMeta } from "~/meta";
import type { Route } from "./+types/contact";

export function meta({}: Route.MetaArgs) {
    return pageMeta(
        "Contact",
        `Questions, bug reports or ideas for ${PRODUCT_NAME}. Get in touch by email.`,
    );
}

function Reason({
    icon,
    title,
    children,
}: {
    icon: ReactNode;
    title: string;
    children: ReactNode;
}) {
    return (
        <div
            onPointerMove={spotlightMove}
            className="glow-card bg-card rounded-xl border p-5"
        >
            <div className="bg-primary-soft text-primary-soft-foreground flex size-9 items-center justify-center rounded-lg">
                {icon}
            </div>
            <h3 className="mt-3 font-semibold">{title}</h3>
            <div className="text-muted-foreground mt-1 text-sm">{children}</div>
        </div>
    );
}

export default function Contact() {
    return (
        <ProsePage
            eyebrow="Contact"
            title="Get in touch"
            lead={`Questions, bugs or ideas for ${PRODUCT_NAME}: email is the way to reach us.`}
        >
            <div className="bg-card flex flex-col items-start gap-4 rounded-xl border p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-muted-foreground text-sm">Email</div>
                    <div className="mt-1 font-mono text-base break-all">
                        {SUPPORT_EMAIL}
                    </div>
                </div>
                <a href={SUPPORT_MAILTO} className={buttonClass("primary")}>
                    <Mail className="size-4" aria-hidden />
                    Send an email
                </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Reason
                    icon={<Bug className="size-4" aria-hidden />}
                    title="Report a bug"
                >
                    Include your browser and its version, the website, and what
                    you expected to happen.
                </Reason>
                <Reason
                    icon={<Lightbulb className="size-4" aria-hidden />}
                    title="Suggest an idea"
                >
                    Tell us what you were trying to do. The use case helps more
                    than the feature name.
                </Reason>
                <Reason
                    icon={
                        <MessageCircleQuestion className="size-4" aria-hidden />
                    }
                    title="Ask a question"
                >
                    The <Link to="/#faq">FAQ</Link> covers storage, supported
                    sites and moving snippets between browsers.
                </Reason>
            </div>

            <section>
                <h2>Please don't send your snippets</h2>
                <p>
                    You never need to share what's in your snippets to get help.
                    If something goes wrong with one, describe it instead, or
                    send a made-up snippet that shows the same problem.
                </p>
            </section>
        </ProsePage>
    );
}
