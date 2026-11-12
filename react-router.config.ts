import type { Config } from "@react-router/dev/config";

// No runtime server: every route is rendered to static HTML at build time, so Vercel only
// serves files. "/404" is listed on purpose (the "*" route isn't a static path), and
// scripts/postbuild.mjs copies it to 404.html, which Vercel serves for unknown URLs.
export default {
    ssr: false,
    async prerender({ getStaticPaths }) {
        return [...getStaticPaths(), "/404"];
    },
} satisfies Config;
