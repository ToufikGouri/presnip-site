import {
    ChevronDown,
    Check,
    Download,
    FileUp,
    Keyboard,
    LayoutList,
    MousePointerClick,
    Moon,
    Search,
    Settings2,
    ShieldCheck,
    Star,
    Undo2,
} from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import {
    FullPageMockup,
    PaletteMockup,
    TypedListMockup,
} from "~/components/mockups";
import { TypingDemo } from "~/components/typing-demo";
import {
    buttonClass,
    Container,
    Eyebrow,
    KeyCap,
    KeyCombo,
    SectionHeading,
    TriggerCode,
    TriggerWithChip,
} from "~/components/ui";
import {
    DEFAULT_TRIGGER,
    PALETTE_HOTKEY,
    PALETTE_HOTKEY_MAC,
    PRODUCT_DESCRIPTION,
    STORES,
    type Store,
} from "~/const";
import { pageMeta } from "~/meta";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return pageMeta("", PRODUCT_DESCRIPTION);
}

export default function Home() {
    return (
        <>
            <Hero />
            <ThreeWays />
            <HowItWorks />
            <Privacy />
            <Details />
            <Faq />
            <Install />
        </>
    );
}

function StoreButton({ store }: { store: Store }) {
    const label = `Add to ${store.name}`;
    if (store.url) {
        return (
            <a href={store.url} className={buttonClass("primary")}>
                <Download className="size-4" aria-hidden />
                {label}
            </a>
        );
    }
    return (
        <span
            className={buttonClass(
                "outline",
                "hover:bg-card cursor-default opacity-80",
            )}
            aria-disabled="true"
        >
            {label}
            <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                Soon
            </span>
        </span>
    );
}

function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* soft brand glow behind the hero */}
            <div
                aria-hidden
                className="bg-primary/15 pointer-events-none absolute inset-x-0 -top-40 -z-10 mx-auto h-[480px] max-w-3xl rounded-full blur-3xl"
            />
            <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
                <div className="text-center lg:text-left">
                    <Eyebrow>
                        Browser extension for Chrome, Edge and Firefox
                    </Eyebrow>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                        Type it once. Insert it anywhere.
                    </h1>
                    <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-lg text-pretty lg:mx-0">
                        Save the text you write again and again. Then type{" "}
                        <TriggerWithChip trigger={DEFAULT_TRIGGER} /> in any
                        text field, and it's there. Private, fast, and
                        everything stays on your device.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                        {STORES.map((store) => (
                            <StoreButton key={store.id} store={store} />
                        ))}
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm">
                        Brave, Opera and Vivaldi use the Chrome version.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-md pb-40 lg:pb-32">
                    <TypingDemo />
                </div>
            </Container>
        </section>
    );
}

function WayCard({
    icon,
    title,
    children,
    picture,
}: {
    icon: ReactNode;
    title: string;
    children: ReactNode;
    picture: ReactNode;
}) {
    return (
        <article className="bg-card flex flex-col rounded-xl border p-6">
            <div className="bg-primary-soft text-primary-soft-foreground flex size-10 items-center justify-center rounded-lg">
                {icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="text-muted-foreground mt-2 flex-1 text-sm">
                {children}
            </p>
            <div className="mt-6" aria-hidden>
                {picture}
            </div>
        </article>
    );
}

function ThreeWays() {
    return (
        <section id="features" className="bg-card/40 border-t py-20 sm:py-24">
            <Container>
                <SectionHeading
                    eyebrow="Three ways in"
                    title="Use whichever fits the moment"
                    lead="Type it, search for it, or manage everything on one page."
                />
                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    <WayCard
                        icon={<Keyboard className="size-5" aria-hidden />}
                        title="Type the trigger"
                        picture={<TypedListMockup />}
                    >
                        Type <TriggerWithChip trigger={DEFAULT_TRIGGER} /> in
                        any text field. A list opens under the cursor, and Enter
                        or Tab inserts the snippet.
                    </WayCard>
                    <WayCard
                        icon={<Search className="size-5" aria-hidden />}
                        title="Open the palette"
                        picture={<PaletteMockup />}
                    >
                        Click the toolbar icon or press{" "}
                        <KeyCombo keys={PALETTE_HOTKEY} />, or{" "}
                        <KeyCombo keys={PALETTE_HOTKEY_MAC} /> on a Mac. Search,
                        pick, and it goes where your cursor was.
                    </WayCard>
                    <WayCard
                        icon={<LayoutList className="size-5" aria-hidden />}
                        title="Manage on one page"
                        picture={<FullPageMockup />}
                    >
                        Create, edit, sort and favorite snippets. Import and
                        export them, change your trigger, and pick a theme.
                    </WayCard>
                </div>
            </Container>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        {
            title: "Save a snippet",
            body: "Give it a title, the text, and a short shortcut of your own.",
        },
        {
            title: "Type the trigger",
            body: (
                <>
                    In any text field, type{" "}
                    <TriggerWithChip trigger={DEFAULT_TRIGGER} />. Matching
                    snippets appear as you type.
                </>
            ),
        },
        {
            title: "Confirm to insert",
            body: (
                <>
                    Press <KeyCap>Enter</KeyCap> or <KeyCap>Tab</KeyCap>.
                    Nothing is inserted until you do, and Undo still works.
                </>
            ),
        },
    ];
    return (
        <section className="py-20 sm:py-24">
            <Container>
                <SectionHeading
                    eyebrow="How it works"
                    title="Three steps, then muscle memory"
                />
                <ol className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <li key={step.title} className="flex gap-4">
                            <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-sm font-semibold">
                                {i + 1}
                            </span>
                            <div>
                                <h3 className="font-semibold">{step.title}</h3>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {step.body}
                                </p>
                            </div>
                        </li>
                    ))}
                </ol>
            </Container>
        </section>
    );
}

function Privacy() {
    const points = [
        "No account, no sign-up",
        "No servers: snippets live in your browser's extension storage",
        "No analytics, tracking or network calls",
        "Export your snippets to a file whenever you like",
    ];
    return (
        <section className="bg-card/40 border-y py-20 sm:py-24">
            <Container className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                    <div className="bg-primary-soft text-primary-soft-foreground flex size-12 items-center justify-center rounded-xl">
                        <ShieldCheck className="size-6" aria-hidden />
                    </div>
                    <h2 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        Private by design, not by promise
                    </h2>
                    <p className="text-muted-foreground mt-4 text-lg text-pretty">
                        Presnip has nowhere to send your text, because it has no
                        backend. What you save stays on this device.
                    </p>
                    <Link
                        to="/privacy"
                        className={buttonClass("outline", "mt-6")}
                    >
                        Read the privacy policy
                    </Link>
                </div>
                <ul className="grid gap-3">
                    {points.map((point) => (
                        <li
                            key={point}
                            className="bg-card flex items-start gap-3 rounded-lg border p-4"
                        >
                            <Check
                                className="text-primary mt-0.5 size-5 shrink-0"
                                aria-hidden
                            />
                            <span>{point}</span>
                        </li>
                    ))}
                </ul>
            </Container>
        </section>
    );
}

function Details() {
    const items = [
        {
            icon: <Star className="size-5" aria-hidden />,
            title: "Favorites and sorting",
            body: "Pin the ones you use most and sort by title, shortcut, date or last use.",
        },
        {
            icon: <FileUp className="size-5" aria-hidden />,
            title: "Import without surprises",
            body: "Importing never overwrites. A shortcut that's already taken gets a -2.",
        },
        {
            icon: <Settings2 className="size-5" aria-hidden />,
            title: "Your own trigger",
            body: (
                <>
                    Keep <TriggerCode trigger={DEFAULT_TRIGGER} /> or pick
                    another. Changing it never touches your snippets.
                </>
            ),
        },
        {
            icon: <Undo2 className="size-5" aria-hidden />,
            title: "Undo still works",
            body: "Text goes in the way typing does, so Ctrl+Z takes it back out.",
        },
        {
            icon: <MousePointerClick className="size-5" aria-hidden />,
            title: "Works in rich editors",
            body: "Plain fields and rich editors like mail and chat apps, line breaks included.",
        },
        {
            icon: <Moon className="size-5" aria-hidden />,
            title: "Light and dark",
            body: "Follows your system, or pick one. The page, palette and list all match.",
        },
    ];
    return (
        <section className="py-20 sm:py-24">
            <Container>
                <SectionHeading
                    eyebrow="The details"
                    title="Small things, done carefully"
                />
                <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                        <div key={item.title} className="flex gap-4">
                            <div className="bg-primary-soft text-primary-soft-foreground flex size-10 shrink-0 items-center justify-center rounded-lg">
                                {item.icon}
                            </div>
                            <div>
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-muted-foreground mt-1 text-sm">
                                    {item.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}

const FAQ: Array<{ q: string; a: ReactNode }> = [
    {
        q: "Where are my snippets stored?",
        a: "In your browser's extension storage, on this device. Presnip has no servers and makes no network calls, so nothing leaves your computer.",
    },
    {
        q: "Does it work on every website?",
        a: (
            <>
                It works in normal text fields and in rich editors such as mail
                and chat apps. Typing the trigger doesn't work in email and
                number fields, in code editors that manage their own cursor, in
                editors inside embedded frames, or in Google Docs. There, open
                the palette with <KeyCombo keys={PALETTE_HOTKEY} />: if it can't
                insert directly, it copies the snippet so you can paste it.
            </>
        ),
    },
    {
        q: "How do I move my snippets to another browser or computer?",
        a: "Export them to a file from the Presnip page, then import that file in the other browser. Importing never overwrites what's already there.",
    },
    {
        q: "Can I change the trigger?",
        a: (
            <>
                Yes, in Settings. A trigger is one symbol, up to five lowercase
                letters or digits, and one more symbol. The default is{" "}
                <TriggerCode trigger={DEFAULT_TRIGGER} />.
            </>
        ),
    },
    {
        q: "Will it insert something by accident?",
        a: (
            <>
                No. The list only suggests. Nothing is inserted or replaced
                until you press <KeyCap>Enter</KeyCap> or <KeyCap>Tab</KeyCap>,
                and <KeyCap>Esc</KeyCap> closes it.
            </>
        ),
    },
];

function Faq() {
    return (
        <section id="faq" className="bg-card/40 border-t py-20 sm:py-24">
            <Container className="max-w-3xl">
                <SectionHeading eyebrow="FAQ" title="Questions, answered" />
                <div className="bg-card mt-10 divide-y rounded-xl border">
                    {FAQ.map((item) => (
                        <details key={item.q} className="group px-5 py-4">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                                {item.q}
                                <ChevronDown
                                    className="text-muted-foreground size-4 shrink-0 transition-transform group-open:rotate-180"
                                    aria-hidden
                                />
                            </summary>
                            <div className="text-muted-foreground mt-3 text-sm leading-relaxed">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>
            </Container>
        </section>
    );
}

function Install() {
    return (
        <section id="install" className="py-20 sm:py-24">
            <Container>
                <div className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl px-6 py-14 text-center sm:px-12">
                    <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                        Stop retyping the same things
                    </h2>
                    <p className="text-primary-foreground/80 mx-auto mt-4 max-w-xl text-pretty">
                        Presnip is on its way to the Chrome Web Store, Edge
                        Add-ons and Firefox Add-ons.
                    </p>
                    <ul className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                        {STORES.map((store) => (
                            <li
                                key={store.id}
                                className="bg-primary-foreground/10 rounded-lg px-4 py-3 text-left"
                            >
                                <div className="font-semibold">
                                    {store.name}
                                </div>
                                <div className="text-primary-foreground/75 text-sm">
                                    {store.url ? (
                                        <a
                                            href={store.url}
                                            className="underline"
                                        >
                                            Add to {store.name}
                                        </a>
                                    ) : (
                                        `Coming soon · ${store.note}`
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}
