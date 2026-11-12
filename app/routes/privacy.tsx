import { Link } from "react-router";

import { ProsePage } from "~/components/prose-page";
import {
    PRIVACY_UPDATED,
    PRODUCT_NAME,
    SUPPORT_EMAIL,
    SUPPORT_MAILTO,
} from "~/const";
import { pageMeta } from "~/meta";
import type { Route } from "./+types/privacy";

export function meta({}: Route.MetaArgs) {
    return pageMeta(
        "Privacy policy",
        `${PRODUCT_NAME} stores your snippets on your device only. No accounts, no servers, no analytics.`,
    );
}

// The policy the store listings link to. Keep it true to the code: if the extension ever
// gains a permission or a network call, this page changes in the same release.
export default function Privacy() {
    return (
        <ProsePage
            eyebrow="Privacy"
            title="Privacy policy"
            lead={
                <>
                    Short version: {PRODUCT_NAME} doesn't collect anything. Your
                    snippets stay on your device. Last updated {PRIVACY_UPDATED}
                    .
                </>
            }
        >
            <section>
                <h2>What Presnip stores, and where</h2>
                <p>
                    {PRODUCT_NAME} saves the snippets you create (title, text,
                    shortcut, whether it's a favorite, and when it was created,
                    changed and last used) and your settings (trigger, theme,
                    sort order). All of it is kept in your browser's extension
                    storage on this device. It is never sent anywhere.
                </p>
            </section>

            <section>
                <h2>What Presnip does not collect</h2>
                <ul>
                    <li>
                        No personal information, and no accounts or sign-in.
                    </li>
                    <li>No analytics, telemetry, crash reports or tracking.</li>
                    <li>
                        No network calls. The extension has no backend and never
                        contacts a server.
                    </li>
                    <li>
                        No reading of what you type for any other purpose. It
                        only looks for the trigger in the field you're typing
                        in.
                    </li>
                    <li>
                        No selling or sharing of data, because there is none.
                    </li>
                </ul>
            </section>

            <section>
                <h2>Why each permission is needed</h2>
                <ul>
                    <li>
                        <strong>Storage:</strong> to save your snippets and
                        settings on your device.
                    </li>
                    <li>
                        <strong>Access to websites:</strong> so the trigger
                        works in text fields on the sites you use. Your browser
                        describes this as reading and changing data on websites.
                        Presnip only watches for the trigger in the field that
                        has focus, and only changes the page when you confirm a
                        snippet with Enter or Tab.
                    </li>
                    <li>
                        <strong>Scripting and active tab:</strong> to open the
                        search palette on the current page when you click the
                        toolbar icon or press the shortcut.
                    </li>
                </ul>
                <p>
                    When the palette can't put text into a field directly, it
                    copies the snippet to your clipboard so you can paste it.
                    That only happens after you pick a snippet.
                </p>
            </section>

            <section>
                <h2>Your control over your data</h2>
                <ul>
                    <li>Edit or delete any snippet at any time.</li>
                    <li>
                        Export all snippets to a file from the {PRODUCT_NAME}{" "}
                        page, and import them elsewhere.
                    </li>
                    <li>
                        Uninstalling the extension removes everything it stored.
                    </li>
                </ul>
            </section>

            <section>
                <h2>This website</h2>
                <p>
                    This site uses no cookies, analytics or tracking. It
                    remembers your light or dark choice in your browser's local
                    storage, and that never leaves your device. The hosting
                    provider may keep standard server logs, such as IP
                    addresses, for security and reliability.
                </p>
            </section>

            <section>
                <h2>Changes to this policy</h2>
                <p>
                    If this policy changes, the new version is posted here with
                    a new date at the top. If {PRODUCT_NAME} ever needed to
                    handle data differently, that would be explained here before
                    it happens.
                </p>
            </section>

            <section>
                <h2>Contact</h2>
                <p>
                    Questions about privacy? Email{" "}
                    <a href={SUPPORT_MAILTO}>{SUPPORT_EMAIL}</a> or see the{" "}
                    <Link to="/contact">contact page</Link>.
                </p>
            </section>
        </ProsePage>
    );
}
