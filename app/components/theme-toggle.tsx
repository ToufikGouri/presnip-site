import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

import { THEME_STORAGE_KEY } from "~/const";
import { buttonClass } from "./ui";

function readStored(): string | null {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
        return null;
    }
}

// Switches light and dark. Until someone clicks, the site follows the system setting.
// Both icons are always rendered and CSS shows one, so the prerendered HTML and the
// browser agree (no hydration mismatch) and nothing flickers.
export function ThemeToggle() {
    useEffect(() => {
        const media = matchMedia("(prefers-color-scheme: dark)");
        const follow = () => {
            if (readStored()) return; // an explicit choice wins over the system
            document.documentElement.classList.toggle("dark", media.matches);
        };
        media.addEventListener("change", follow);
        return () => media.removeEventListener("change", follow);
    }, []);

    const toggle = () => {
        const dark = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", dark);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
        } catch {
            // private mode or blocked storage: the switch still works for this visit
        }
    };

    return (
        <button
            type="button"
            onClick={toggle}
            className={buttonClass("ghost", undefined, "icon")}
            aria-label="Switch between light and dark theme"
            title="Switch theme"
        >
            <Sun className="size-4 dark:hidden" aria-hidden />
            <Moon className="hidden size-4 dark:block" aria-hidden />
        </button>
    );
}
