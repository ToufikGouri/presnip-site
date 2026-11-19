import { KEY_HINTS } from "~/const";
import { cx, KeyCap } from "./ui";

// The row used everywhere in the product: title, one-line preview, shortcut badge on the right
export function SnippetRow({
    title,
    preview,
    badge,
    active = false,
    onPick,
}: {
    title: string;
    preview: string;
    badge: string;
    active?: boolean;
    onPick?: () => void;
}) {
    const className = cx(
        "flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left",
        active ? "bg-accent" : onPick && "hover:bg-accent/60",
    );
    const body = (
        <>
            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                    {title}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                    {preview}
                </span>
            </span>
            <span className="bg-primary-soft text-primary-soft-foreground shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[11px] font-medium">
                {badge}
            </span>
        </>
    );

    return onPick ? (
        <button
            type="button"
            role="option"
            aria-selected={active}
            // mousedown, not click, so the text box doesn't lose focus first
            onMouseDown={(e) => {
                e.preventDefault();
                onPick();
            }}
            className={className}
        >
            {body}
        </button>
    ) : (
        <div className={className}>{body}</div>
    );
}

// Uppercase section header with a count, like "SNIPPETS 3"
export function ListHeader({ label, count }: { label: string; count: number }) {
    return (
        <div className="text-muted-foreground flex items-center gap-2 px-2.5 pt-1 pb-1.5 text-[11px] font-semibold tracking-wider uppercase">
            {label}
            <span className="bg-muted rounded px-1 font-mono text-[10px]">
                {count}
            </span>
        </div>
    );
}

// pressedKey: draw that key held down, e.g. "Enter" while the demo inserts
export function KeyHintsBar({ pressedKey }: { pressedKey?: string | null }) {
    return (
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 border-t px-3 py-2 text-[11px]">
            {KEY_HINTS.map((hint) => (
                <span
                    key={hint.label}
                    className="inline-flex items-center gap-1"
                >
                    {hint.keys.map((key) => (
                        <KeyCap key={key} pressed={key === pressedKey}>
                            {key}
                        </KeyCap>
                    ))}
                    <span className="ml-0.5">{hint.label}</span>
                </span>
            ))}
        </div>
    );
}
