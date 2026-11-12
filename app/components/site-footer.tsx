import { Link } from "react-router";

import { EXTENSION_VERSION, NAV_LINKS, PRODUCT_NAME } from "~/const";
import { Logo } from "./logo";
import { Container } from "./ui";

export function SiteFooter() {
    return (
        <footer className="border-t">
            <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-2">
                    <Logo />
                    <p className="text-muted-foreground text-sm">
                        Your snippets stay on your device.
                    </p>
                </div>
                <nav
                    className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
                    aria-label="Footer"
                >
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </Container>
            <Container className="text-muted-foreground flex flex-col gap-1 border-t py-6 text-xs sm:flex-row sm:justify-between">
                <span>
                    © {new Date().getFullYear()} {PRODUCT_NAME}
                </span>
                <span>Extension version {EXTENSION_VERSION}</span>
            </Container>
        </footer>
    );
}
