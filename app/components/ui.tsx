import type { ReactNode } from "react";

// Joins class names and drops the empty ones
export function cx(...parts: Array<string | false | null | undefined>) {
    return parts.filter(Boolean).join(" ");
}

export function Container({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={cx("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
            {children}
        </div>
    );
}

type ButtonVariant = "primary" | "outline" | "ghost";

// A class string, not a component, so it works on <a>, <Link> and <button> alike.
// "icon" is a square button for a single icon. It's a size, not an override, because
// without a class-merging helper "px-4 px-0" keeps px-4 and squeezes the icon.
export function buttonClass(
    variant: ButtonVariant = "primary",
    className?: string,
    size: "default" | "icon" = "default",
) {
    return cx(
        "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0",
        size === "icon" ? "w-10" : "px-4",
        variant === "primary" &&
            "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" &&
            "border bg-card text-card-foreground hover:bg-accent",
        variant === "ghost" &&
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className,
    );
}

// A keyboard key, same look as the hints in the palette and typing list
export function KeyCap({ children }: { children: ReactNode }) {
    return (
        <kbd className="bg-card text-muted-foreground inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-b-2 px-1.5 font-mono text-[11px] leading-none font-medium">
            {children}
        </kbd>
    );
}

export function KeyCombo({ keys }: { keys: string[] }) {
    return (
        <span className="inline-flex items-center gap-1">
            {keys.map((key) => (
                <KeyCap key={key}>{key}</KeyCap>
            ))}
        </span>
    );
}

// The trigger in a monospace badge, e.g. "@ps:"
export function TriggerCode({ trigger }: { trigger: string }) {
    return (
        <code className="bg-primary-soft text-primary-soft-foreground rounded-md px-1.5 py-0.5 font-mono text-[0.9em] font-semibold">
            {trigger}
        </code>
    );
}

// The dashed "your shortcut" chip used across the product instead of a made-up example
export function ShortcutChip() {
    return (
        <span className="border-input text-muted-foreground inline-flex items-center rounded-md border border-dashed px-1.5 py-0.5 font-mono text-[0.85em]">
            your shortcut
        </span>
    );
}

export function TriggerWithChip({ trigger }: { trigger: string }) {
    return (
        <span className="inline-flex items-center gap-1 align-middle">
            <TriggerCode trigger={trigger} />
            <ShortcutChip />
        </span>
    );
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">
            {children}
        </p>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    lead,
    id,
}: {
    eyebrow?: string;
    title: string;
    lead?: ReactNode;
    id?: string;
}) {
    return (
        <div className="mx-auto max-w-2xl text-center">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2
                id={id}
                className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
            >
                {title}
            </h2>
            {lead && (
                <p className="text-muted-foreground mt-4 text-base text-pretty sm:text-lg">
                    {lead}
                </p>
            )}
        </div>
    );
}
