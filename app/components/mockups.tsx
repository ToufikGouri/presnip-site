import { Search, Star } from "lucide-react";

import { DEFAULT_TRIGGER, DEMO_SNIPPETS } from "~/const";
import { KeyHintsBar, ListHeader, SnippetRow } from "./snippet-row";

// Small static pictures of the product for the "three ways" cards. They are drawn with the
// same row and header as the real UI, so they never drift from how the extension looks.

const rows = DEMO_SNIPPETS.map((s) => ({
    title: s.title,
    preview: s.content,
    badge: `${DEFAULT_TRIGGER}${s.shortcut}`,
}));

export function TypedListMockup() {
    const first = rows[0];
    return (
        <div className="space-y-2">
            <div className="bg-background rounded-md border px-3 py-2 font-mono text-sm">
                {DEFAULT_TRIGGER}he
                <span className="caret-blink bg-foreground ml-px inline-block h-4 w-px translate-y-0.5" />
            </div>
            <div className="bg-card overflow-hidden rounded-md border">
                <div className="p-1">
                    <ListHeader label="Snippets" count={1} />
                    {first && <SnippetRow {...first} active />}
                </div>
            </div>
        </div>
    );
}

export function PaletteMockup() {
    return (
        <div className="bg-card overflow-hidden rounded-md border">
            <div className="text-muted-foreground flex items-center gap-2 border-b px-3 py-2 text-sm">
                <Search className="size-4" aria-hidden />
                Search snippets
            </div>
            <div className="p-1">
                <ListHeader label="Recent" count={rows.length} />
                {rows.slice(0, 2).map((row, i) => (
                    <SnippetRow key={row.badge} {...row} active={i === 0} />
                ))}
            </div>
            <KeyHintsBar />
        </div>
    );
}

export function FullPageMockup() {
    return (
        <div className="bg-card flex overflow-hidden rounded-md border text-xs">
            <div className="bg-muted/50 hidden w-24 shrink-0 space-y-1 border-r p-2 sm:block md:hidden xl:block">
                <div className="bg-accent rounded px-2 py-1 font-medium">
                    Snippets
                </div>
                <div className="text-muted-foreground px-2 py-1">Favorites</div>
                <div className="text-muted-foreground px-2 py-1">Settings</div>
            </div>
            <div className="min-w-0 flex-1 p-1">
                <ListHeader label="All snippets" count={rows.length} />
                {rows.map((row, i) => (
                    <div key={row.badge} className="flex items-center">
                        <div className="min-w-0 flex-1">
                            <SnippetRow {...row} />
                        </div>
                        <Star
                            className={
                                i === 0
                                    ? "fill-primary text-primary mr-2 size-3.5 shrink-0"
                                    : "text-muted-foreground/50 mr-2 size-3.5 shrink-0"
                            }
                            aria-hidden
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
