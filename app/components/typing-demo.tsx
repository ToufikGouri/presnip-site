import { SendHorizontal } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from "react";

import {
    DEFAULT_TRIGGER,
    DEMO_SCENES,
    DEMO_SNIPPETS,
    type DemoScene,
    type DemoSnippet,
} from "~/const";
import { KeyHintsBar, ListHeader, SnippetRow } from "./snippet-row";
import { cx, TriggerCode } from "./ui";

// The hero demo. It runs entirely in this page, with in-memory snippets; nothing is saved.
// Two modes:
//  - "auto": loops through an email, a chat and a form. In each it types the trigger, the
//    list opens, Enter goes down, and the snippet is inserted and briefly highlighted.
//  - "manual": after a click (or from the start with reduced motion) it's a real text box
//    with the same list logic as the extension: type the trigger, then ↑↓, Enter/Tab, Esc.

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

const suggest = (match: Match | null) =>
    match
        ? DEMO_SNIPPETS.filter((s) => s.shortcut.startsWith(match.query))
        : [];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const fallbackScene = DEMO_SCENES[0] as DemoScene;

export function TypingDemo() {
    const reduce = useReducedMotion();
    const [mode, setMode] = useState<"auto" | "manual">("auto");
    const [sceneIndex, setSceneIndex] = useState(0);
    const scene = DEMO_SCENES[sceneIndex] ?? fallbackScene;

    // auto mode
    const [autoText, setAutoText] = useState(fallbackScene.prefix);
    const [inserted, setInserted] = useState<{
        start: number;
        end: number;
    } | null>(null);
    const [pressed, setPressed] = useState<string | null>(null);

    // manual mode
    const boxRef = useRef<HTMLTextAreaElement>(null);
    const [text, setText] = useState("");
    const [caret, setCaret] = useState(0);
    const [active, setActive] = useState(0);
    const [dismissedAt, setDismissedAt] = useState<number | null>(null);
    const pendingCaret = useRef<number | null>(null);

    // Reduced motion: no autoplay, just the interactive box
    useEffect(() => {
        if (reduce) setMode("manual");
    }, [reduce]);

    const manualMatch = findTrigger(text, caret);
    const autoMatch = findTrigger(autoText, autoText.length);
    const match = mode === "auto" ? autoMatch : manualMatch;
    const results = suggest(match);
    const open =
        match !== null &&
        results.length > 0 &&
        (mode === "auto" || dismissedAt !== match.start);

    useEffect(() => setActive(0), [manualMatch?.query]);

    // Focus the box and place the caret, if something asked for it (an insert, or taking
    // over the demo). Called after every render AND when the box mounts: after a scene
    // switch the box appears later, once the old scene has faded out, and that mount
    // doesn't re-render this component, so the effect alone would miss it.
    const applyPendingCaret = (box: HTMLTextAreaElement | null) => {
        if (box && pendingCaret.current !== null) {
            box.focus();
            box.setSelectionRange(pendingCaret.current, pendingCaret.current);
            pendingCaret.current = null;
        }
    };
    useLayoutEffect(() => applyPendingCaret(boxRef.current));
    const setBox = (el: HTMLTextAreaElement | null) => {
        boxRef.current = el;
        applyPendingCaret(el);
    };

    // The autoplay loop. Every pause checks "cancelled", so a click stops it at once.
    useEffect(() => {
        if (mode !== "auto" || reduce) return;
        let cancelled = false;
        const pause = async (ms: number) => {
            await wait(ms);
            return !cancelled;
        };
        (async () => {
            let i = 0;
            while (true) {
                const s = DEMO_SCENES[i] ?? fallbackScene;
                const snippet = DEMO_SNIPPETS.find((x) =>
                    x.shortcut.startsWith(s.query),
                );
                setSceneIndex(i);
                setInserted(null);
                setAutoText(s.prefix);
                if (!(await pause(900))) return;

                const typed = DEFAULT_TRIGGER + s.query;
                for (let k = 1; k <= typed.length; k++) {
                    setAutoText(s.prefix + typed.slice(0, k));
                    if (!(await pause(110))) return;
                }
                if (!(await pause(1000))) return; // the list is open now

                setPressed("Enter");
                if (!(await pause(240))) return;
                const content = snippet?.content ?? "";
                setAutoText(s.prefix + content);
                setInserted({
                    start: s.prefix.length,
                    end: s.prefix.length + content.length,
                });
                setPressed(null);
                if (!(await pause(2800))) return;

                i = (i + 1) % DEMO_SCENES.length;
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [mode, reduce]);

    // Switch to the interactive box, optionally in another scene
    const takeOver = (index = sceneIndex) => {
        setSceneIndex(index);
        setPressed(null);
        setText("");
        setCaret(0);
        setDismissedAt(null);
        setMode("manual");
        pendingCaret.current = 0; // focuses the box after it renders
    };

    const insert = (snippet: DemoSnippet | undefined) => {
        if (!manualMatch || !snippet) return;
        const next =
            text.slice(0, manualMatch.start) +
            snippet.content +
            text.slice(caret);
        const end = manualMatch.start + snippet.content.length;
        setText(next);
        setCaret(end);
        pendingCaret.current = end;
        setDismissedAt(null);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!open) return; // keys only belong to the list while it is open
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            const step = e.key === "ArrowDown" ? 1 : -1;
            setActive((i) => (i + step + results.length) % results.length);
        } else if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            insert(results[active]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            if (manualMatch) setDismissedAt(manualMatch.start);
        }
    };

    const body =
        mode === "auto" ? (
            <button
                type="button"
                onClick={() => takeOver()}
                aria-label={`Try it yourself: type ${DEFAULT_TRIGGER} in a text box`}
                className="block h-full w-full text-left text-[15px] leading-relaxed whitespace-pre-wrap outline-none"
            >
                <AutoText text={autoText} inserted={inserted} />
            </button>
        ) : (
            <>
                <label htmlFor="demo-box" className="sr-only">
                    Try it: type {DEFAULT_TRIGGER} in this box
                </label>
                <textarea
                    id="demo-box"
                    ref={setBox}
                    value={text}
                    rows={scene.id === "chat" ? 2 : 3}
                    spellCheck={false}
                    placeholder={`Type ${DEFAULT_TRIGGER} here`}
                    onChange={(e) => {
                        setText(e.target.value);
                        setCaret(e.target.selectionStart);
                        setDismissedAt(null);
                    }}
                    onSelect={() =>
                        setCaret(boxRef.current?.selectionStart ?? text.length)
                    }
                    onKeyDown={onKeyDown}
                    onBlur={() =>
                        manualMatch && setDismissedAt(manualMatch.start)
                    }
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="demo-list"
                    aria-autocomplete="list"
                    className="placeholder:text-muted-foreground/70 block h-full w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none"
                />
            </>
        );

    return (
        <div className="relative w-full">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={scene.id}
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    <SceneFrame scene={scene}>{body}</SceneFrame>
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="demo-list"
                        role="listbox"
                        aria-label="Snippets"
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        style={{ transformOrigin: "top left" }}
                        className="bg-card absolute top-[calc(100%+8px)] left-0 z-10 w-full max-w-sm overflow-hidden rounded-lg border shadow-lg"
                    >
                        <div className="p-1.5">
                            <ListHeader
                                label="Snippets"
                                count={results.length}
                            />
                            {results.map((s, i) => (
                                <SnippetRow
                                    key={s.shortcut}
                                    title={s.title}
                                    preview={s.content}
                                    badge={`${DEFAULT_TRIGGER}${s.shortcut}`}
                                    active={
                                        mode === "auto" ? i === 0 : i === active
                                    }
                                    onPick={
                                        mode === "manual"
                                            ? () => insert(s)
                                            : undefined
                                    }
                                />
                            ))}
                        </div>
                        <KeyHintsBar pressedKey={pressed} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-4 flex flex-col items-center gap-2">
                <div
                    className="flex gap-1.5"
                    role="group"
                    aria-label="Demo scene"
                >
                    {DEMO_SCENES.map((s, i) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => takeOver(i)}
                            aria-pressed={i === sceneIndex}
                            className={cx(
                                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                                i === sceneIndex
                                    ? "bg-primary-soft text-primary-soft-foreground"
                                    : "text-muted-foreground hover:bg-accent",
                            )}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
                <p className="text-muted-foreground text-center text-sm">
                    {mode === "manual" ? (
                        <>
                            Type <TriggerCode trigger={DEFAULT_TRIGGER} /> then
                            pick a snippet
                        </>
                    ) : (
                        "Click the box to try it yourself"
                    )}
                </p>
            </div>
        </div>
    );
}

// The autoplay text: what's typed so far, the inserted snippet with a fading highlight,
// and a blinking purple caret at the end.
function AutoText({
    text,
    inserted,
}: {
    text: string;
    inserted: { start: number; end: number } | null;
}) {
    const caret = (
        <span className="caret-blink bg-primary ml-px inline-block h-[1.1em] w-[2px] translate-y-[0.2em] rounded-full" />
    );
    if (!inserted) {
        return (
            <>
                {text}
                {caret}
            </>
        );
    }
    return (
        <>
            {text.slice(0, inserted.start)}
            <mark
                key={`${inserted.start}-${inserted.end}-${text.length}`}
                className="insert-flash rounded-sm text-inherit"
            >
                {text.slice(inserted.start, inserted.end)}
            </mark>
            {text.slice(inserted.end)}
            {caret}
        </>
    );
}

function WindowDots() {
    return (
        <span className="flex gap-1.5" aria-hidden>
            <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
            <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
            <span className="bg-muted-foreground/25 size-2.5 rounded-full" />
        </span>
    );
}

// The window around the text: an email draft, a chat box or a form field.
// Every frame has the same total height, so switching scenes doesn't move the page.
function SceneFrame({
    scene,
    children,
}: {
    scene: DemoScene;
    children: ReactNode;
}) {
    return (
        <div className="bg-card shadow-primary/10 flex h-60 flex-col overflow-hidden rounded-xl border shadow-xl">
            <div className="flex items-center gap-3 border-b px-4 py-3">
                <WindowDots />
                <span className="text-muted-foreground text-xs">
                    {scene.title}
                </span>
            </div>

            {scene.id === "email" && (
                <>
                    <div className="text-muted-foreground flex items-center gap-3 border-b px-4 py-2 text-xs">
                        <span className="w-12">To</span>
                        <span className="bg-muted h-2 w-28 rounded-full" />
                    </div>
                    <div className="text-muted-foreground flex items-center gap-3 border-b px-4 py-2 text-xs">
                        <span className="w-12">Subject</span>
                        <span className="text-foreground">Quick question</span>
                    </div>
                    <div className="min-h-0 flex-1 px-4 py-3">{children}</div>
                </>
            )}

            {scene.id === "chat" && (
                <>
                    <div className="flex flex-1 items-start gap-2 px-4 py-3">
                        <span className="bg-primary-soft size-7 shrink-0 rounded-full" />
                        <span className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 text-sm">
                            Did you get a chance to look at this?
                        </span>
                    </div>
                    <div className="mx-3 mb-3 flex items-end gap-2 rounded-lg border px-3 py-2">
                        <div className="min-h-0 flex-1">{children}</div>
                        <SendHorizontal
                            className="text-primary mb-1 size-4 shrink-0"
                            aria-hidden
                        />
                    </div>
                </>
            )}

            {scene.id === "form" && (
                <div className="flex min-h-0 flex-1 flex-col px-4 py-3">
                    <span className="text-muted-foreground mb-1.5 text-xs font-medium">
                        Message
                    </span>
                    <div className="bg-background min-h-0 flex-1 rounded-md border px-3 py-2">
                        {children}
                    </div>
                </div>
            )}
        </div>
    );
}
