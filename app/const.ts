// Every fixed value the site shows lives here. Mirror the extension's core/const.ts
// when one of these changes there (name, trigger, hotkey, support email, version).

export const PRODUCT_NAME = "Presnip";
export const PRODUCT_DESCRIPTION =
    "Save text you reuse, then insert it anywhere with a trigger and a shortcut. Fast, private, and everything stays on your device.";
export const EXTENSION_VERSION = "1.0.0";

export const DEFAULT_TRIGGER = "@ps:";
export const PALETTE_HOTKEY = ["Ctrl", "Shift", "Space"];
export const PALETTE_HOTKEY_MAC = ["⌘", "Shift", "Space"];

export const SUPPORT_EMAIL = "toufikgouri2@gmail.com";
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`${PRODUCT_NAME} support`)}`;

// The date shown on the privacy page. Change it whenever the policy text changes.
export const PRIVACY_UPDATED = "November 11, 2026";

// Store listings. null means "not published yet", and the button shows "Coming soon".
export interface Store {
    id: "chrome" | "edge" | "firefox";
    name: string;
    note: string;
    url: string | null;
}

export const STORES: Store[] = [
    {
        id: "chrome",
        name: "Chrome",
        note: "Also Brave, Opera and Vivaldi",
        url: "https://chromewebstore.google.com/detail/presnip/mjpclhnbpjfadfahakcbcafnnmipldha",
    },
    {
        id: "edge",
        name: "Edge",
        note: "Microsoft Edge Add-ons",
        url: "https://microsoftedge.microsoft.com/addons/detail/presnip/cblmmlpipfpaoainmfafofmakedagcli",
    },
    {
        id: "firefox",
        name: "Firefox",
        note: "Firefox 128 or newer",
        url: "https://addons.mozilla.org/firefox/addon/presnip/",
    },
];

// The snippets in the home page's typing demo. They live only in memory on this page.
export interface DemoSnippet {
    shortcut: string;
    title: string;
    content: string;
}

export const DEMO_SNIPPETS: DemoSnippet[] = [
    {
        shortcut: "hello",
        title: "Greeting",
        content: "Hello! This text was inserted by Presnip.",
    },
    {
        shortcut: "thanks",
        title: "Thank you",
        content: "Thank you so much, I really appreciate it!",
    },
    {
        shortcut: "later",
        title: "Follow up",
        content: "Thanks for your patience. I'll get back to you on this soon.",
    },
];

// The scenes the hero demo plays in a loop. "query" is what gets typed after the trigger,
// and it must be the start of one DEMO_SNIPPETS shortcut. "prefix" is text already in the field.
export interface DemoScene {
    id: "email" | "chat" | "form";
    label: string;
    title: string;
    prefix: string;
    query: string;
}

export const DEMO_SCENES: DemoScene[] = [
    {
        id: "email",
        label: "Email",
        title: "New message",
        prefix: "Hi,\n\n",
        query: "la",
    },
    { id: "chat", label: "Chat", title: "Team chat", prefix: "", query: "th" },
    {
        id: "form",
        label: "Form",
        title: "Support request",
        prefix: "",
        query: "he",
    },
];

// The last words of the hero headline, typed and deleted in turn. The first one is what
// the prerendered HTML, screen readers and reduced-motion visitors get.
export const HERO_WORDS = ["anywhere", "in emails", "in chats", "in forms"];

// Matches the extension's KEY_HINTS (core/expansion/key-hints.ts)
export const KEY_HINTS = [
    { keys: ["↑↓"], label: "Navigate" },
    { keys: ["Enter", "Tab"], label: "Insert" },
    { keys: ["Esc"], label: "Close" },
];

// localStorage key for the theme choice. Read by the inline script in root.tsx too.
export const THEME_STORAGE_KEY = "presnip-site-theme";

export const NAV_LINKS = [
    { to: "/", label: "Home" },
    { to: "/privacy", label: "Privacy" },
    { to: "/contact", label: "Contact" },
];
