import {
    type RouteConfig,
    index,
    layout,
    route,
} from "@react-router/dev/routes";

// To add a page: create app/routes/<name>.tsx and add one line inside the layout.
// Every route here is prerendered to static HTML at build time.
export default [
    layout("routes/site-layout.tsx", [
        index("routes/home.tsx"),
        route("privacy", "routes/privacy.tsx"),
        route("contact", "routes/contact.tsx"),
        route("*", "routes/not-found.tsx"),
    ]),
] satisfies RouteConfig;
