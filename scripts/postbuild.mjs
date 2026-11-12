// Runs after `react-router build`. Vercel serves /404.html for any URL that has no file,
// so copy the prerendered "/404" page there.
import { copyFileSync, existsSync } from "node:fs";

const from = "build/client/404/index.html";
const to = "build/client/404.html";

if (!existsSync(from)) {
    console.error(`postbuild: ${from} is missing, so there is no 404 page`);
    process.exit(1);
}
copyFileSync(from, to);
console.log(`postbuild: copied ${from} to ${to}`);
