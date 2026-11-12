import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

import { NAV_LINKS } from "~/const";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { buttonClass, Container, cx } from "./ui";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
        "rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:text-foreground",
    );

export function SiteHeader() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    // Close the phone menu after navigating
    useEffect(() => setOpen(false), [location.pathname, location.hash]);

    return (
        <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between gap-4">
                <Logo />

                <nav
                    className="hidden items-center gap-1 md:flex"
                    aria-label="Main"
                >
                    {NAV_LINKS.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end
                            className={linkClass}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-1">
                    <ThemeToggle />
                    {/* The wrapper hides it on phones: "hidden" on the link itself loses to
                        the button's own inline-flex */}
                    <div className="hidden sm:block">
                        <Link to="/#install" className={buttonClass("primary")}>
                            Add to browser
                        </Link>
                    </div>
                    <button
                        type="button"
                        className={buttonClass("ghost", "md:hidden", "icon")}
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        aria-label={open ? "Close menu" : "Open menu"}
                    >
                        {open ? (
                            <X className="size-5" aria-hidden />
                        ) : (
                            <Menu className="size-5" aria-hidden />
                        )}
                    </button>
                </div>
            </Container>

            {open && (
                <nav
                    id="mobile-nav"
                    className="border-t md:hidden"
                    aria-label="Main"
                >
                    <Container className="flex flex-col gap-1 py-3">
                        {NAV_LINKS.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end
                                className={linkClass}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                        <Link
                            to="/#install"
                            className={buttonClass("primary", "mt-2")}
                        >
                            Add to browser
                        </Link>
                    </Container>
                </nav>
            )}
        </header>
    );
}
