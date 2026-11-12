import { PRODUCT_NAME } from "./const";

// The <title>, description and link-preview tags for one page
export function pageMeta(title: string, description: string) {
    const fullTitle = title
        ? `${title} · ${PRODUCT_NAME}`
        : `${PRODUCT_NAME}: type it once, insert it anywhere`;
    return [
        { title: fullTitle },
        { name: "description", content: description },
        { property: "og:title", content: fullTitle },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: PRODUCT_NAME },
        { name: "twitter:card", content: "summary" },
    ];
}
