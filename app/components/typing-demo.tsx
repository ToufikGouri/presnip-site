import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { DEFAULT_TRIGGER, DEMO_SNIPPETS } from "~/const";
import { KeyHintsBar, ListHeader, SnippetRow } from "./snippet-row";
import { TriggerCode } from "./ui";

// A small copy of the extension's typing list, running only on this page.
// Type the trigger in the box, pick a snippet, press Enter or Tab. Nothing is saved.

const escaped = DEFAULT_TRIGGER.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const TRIGGER_AT_CARET = new RegExp(`(?:^|\\s)(${escaped})([a-z0-9_-]*)$`);

interface Match {
    start: number; // where the trigger begins in the text
    query: string; // what was typed after the trigger
}

function findTrigger(text: string, caret: number): Match | null {
    const found = TRIGGER_AT_CARET.exec(text.slice(0, caret));
    if (!found || found[1] === undefined) return null;
    const query = found[2] ?? "";
    return { start: caret - DEFAULT_TRIGGER.length - query.length, query };
}

const prefersReducedMotion = () =>
    matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function TypingDemo() {
    const boxRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState("");
    const [caret, setCaret] = useState(0);
    const [active, setActive] = useState(0);
    const [dismissedAt, setDismissedAt] = useState<number | null>(null);
    const [userTookOver, setUserTookOver] = useState(false);
    const pendingCaret = useRef<number | null>(null);

    const match = findTrigger(text, caret);
    const results = match
        ? DEMO_SNIPPETS.filter((s) => s.shortcut.startsWith(match.query))
        : [];
    const open =
        match !== null && results.length > 0 && dismissedAt !== match.start;

    // Keep the highlighted row inside the list when the results change
    useEffect(() => setActive(0), [match?.query]);

    // After an insert, put the caret right after the inserted text
    useLayoutEffect(() => {
        const box = boxRef.current;
        if (box && pendingCaret.current !== null) {
            box.setSelectionRange(pendingCaret.current, pendingCaret.current);
            pendingCaret.current = null;
        }
    });

    const insert = (index: number) => {
        const snippet = results[index];
        if (!match || !snippet) return;
        const next =
            text.slice(0, match.start) + snippet.content + text.slice(caret);
        const end = match.start + snippet.content.length;
        setText(next);
        setCaret(end);
        pendingCaret.current = end;
        setDismissedAt(null);
    };

    // Autoplay once: type the trigger, pick a snippet, insert it. Stops as soon as you
    // click into the box, and is skipped entirely for reduced-motion visitors.
    useEffect(() => {
        if (userTookOver || prefersReducedMotion()) return;
        let cancelled = false;
        const typed = `${DEFAULT_TRIGGER}he`;
        (async () => {
            await wait(900);
            for (let i = 1; i <= typed.length; i++) {
                if (cancelled) return;
                setText(typed.slice(0, i));
                setCaret(i);
                await wait(140);
            }
            await wait(1100);
            if (cancelled) return;
            const content = DEMO_SNIPPETS[0]?.content ?? "";
            setText(content);
            setCaret(content.length);
        })();
        return () => {
            cancelled = true;
        };
    }, [userTookOver]);

    const takeOver = () => {
        if (userTookOver) return;
        setUserTookOver(true);
        setText("");
        setCaret(0);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!open) return; // keys only belong to the list while it is open
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const step = e.key === "ArrowDown" ? 1 : -1;
            setActive((i) => (i + step + results.length) % results.length);
        } else if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            insert(active);
        } else if (e.key === "Escape") {
            e.preventDefault();
            if (match) setDismissedAt(match.start);
        }
    };

    const syncCaret = () =>
        setCaret(boxRef.current?.selectionStart ?? text.length);

    return (
        <div className="relative w-full">
            <div className="bg-card shadow-primary/5 rounded-xl border shadow-xl">
                <div className="flex items-center gap-1.5 border-b px-4 py-3">
                    <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
                    <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
                    <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
                    <span className="text-muted-foreground ml-3 text-xs">
                        New message
                    </span>
                </div>
                <label htmlFor="demo-box" className="sr-only">
                    Try it: type {DEFAULT_TRIGGER} in this box
                </label>
                <textarea
                    id="demo-box"
                    ref={boxRef}
                    value={text}
                    rows={4}
                    spellCheck={false}
                    placeholder={`Type ${DEFAULT_TRIGGER} here`}
                    onFocus={takeOver}
                    onChange={(e) => {
                        setText(e.target.value);
                        setCaret(e.target.selectionStart);
                        setDismissedAt(null);
                    }}
                    onSelect={syncCaret}
                    onKeyDown={onKeyDown}
                    onBlur={() => match && setDismissedAt(match.start)}
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="demo-list"
                    aria-autocomplete="list"
                    className="placeholder:text-muted-foreground/70 block w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed outline-none"
                />
            </div>

            {open && (
                <div
                    id="demo-list"
                    role="listbox"
                    aria-label="Snippets"
                    className="bg-card absolute top-[calc(100%+8px)] left-0 z-10 w-full max-w-sm overflow-hidden rounded-lg border shadow-lg"
                >
                    <div className="p-1.5">
                        <ListHeader label="Snippets" count={results.length} />
                        {results.map((s, i) => (
                            <SnippetRow
                                key={s.shortcut}
                                title={s.title}
                                preview={s.content}
                                badge={`${DEFAULT_TRIGGER}${s.shortcut}`}
                                active={i === active}
                                onPick={() => insert(i)}
                            />
                        ))}
                    </div>
                    <KeyHintsBar />
                </div>
            )}

            <p className="text-muted-foreground mt-3 text-center text-sm">
                {userTookOver ? (
                    <>
                        Type <TriggerCode trigger={DEFAULT_TRIGGER} /> then pick
                        a snippet
                    </>
                ) : (
                    "Click the box to try it yourself"
                )}
            </p>
        </div>
    );
}
