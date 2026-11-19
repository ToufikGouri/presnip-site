# Presnip site: guide for Claude Code

## What this is
The public website for the Presnip browser extension (the extension lives in `../presnip`, its own repo).
Pages: Home (`/`), Privacy (`/privacy`, the URL the store listings link to), Contact (`/contact`), and a 404.
No backend, no cookies, no analytics, no external fonts or scripts. The privacy page says so, so keep it true.

Stack: React Router 8 in framework mode with `ssr: false` and prerendering, React 19, TypeScript (strict,
`noUncheckedIndexedAccess`), Tailwind v4, Lucide. Hosted as static files on Vercel.

## Commands
- `npm run dev`: dev server with hot reload
- `npm run build`: prerenders every route to `build/client/<route>/index.html`, then `scripts/postbuild.mjs` copies the 404 page to `404.html`
- `npm run preview`: serves `build/client` with `serve`, which resolves `/privacy` the way Vercel does. Don't use `vite preview`: it returns the home page for `/privacy`.
- `npm run typecheck`, `npm run format`, `npm run check` (typecheck plus format check). **Run `check` and `build` before finishing a task.**

## Structure
```
app/
  root.tsx         html shell, favicon links, the no-flash theme script, error boundary
  routes.ts        the route list. New page = a file in routes/ plus one line here
  routes/          site-layout (header + footer around every page), home, privacy, contact, not-found
  components/      ui (cx, buttonClass, KeyCap, TriggerCode, ShortcutChip...), header, footer, theme toggle,
                   typing demo, product mockups, snippet row, prose-page (frame for text pages)
  const.ts         every fixed value: product name, trigger, hotkeys, support email, store URLs, demo snippets
  meta.ts          pageMeta(title, description) for each route's <title> and link-preview tags
  app.css          Tailwind plus the color tokens copied from the extension
public/icon/       the extension's icons
vercel.json        static output from build/client, clean URLs, no trailing slash
```

## Rules
- **Match the extension.** Colors are copied from `presnip/src/assets/tailwind.css`, and the snippet row, uppercase
  headers with counts, key caps and the dashed "your shortcut" chip mirror the product. When the extension
  changes its name, trigger, hotkey, version, permissions or support email, update `app/const.ts` and, for
  permissions or data handling, the privacy page and its `PRIVACY_UPDATED` date.
- Copy never uses invented example shortcuts like "sig". Show the trigger plus the dashed chip.
- Store buttons read from `STORES` in `const.ts`: `url: null` shows "Soon". Fill in the URLs when the listings go live.
- `buttonClass` has no class-merging helper, so don't pass a class that fights a base one (`px-0`, `hidden`).
  Use the `"icon"` size, or wrap the button in an element that does the hiding.
- **Motion** (`motion/react`) does the animation; `MotionConfig reducedMotion="user"` in the layout honors reduced motion.
  Reusable pieces are in `components/motion-bits.tsx` (Reveal, RevealGroup/RevealItem, spotlightMove for
  `.glow-card`, AnimatedCheck). Anything that starts hidden must carry `data-reveal`, so the `<noscript>` rule in
  `root.tsx` can show it without JS. Don't animate on first load in ways that hide prerendered content.
- Motion writes an inline `transform` on elements it animates, which beats CSS `transform` rules. For CSS hover
  effects on those elements use the separate `translate` / `scale` properties.
- Decorative motion (cursor glow, floating keys, demo autoplay, cycling word, sheen) must stay off for reduced
  motion and on touch screens where it says so.
- Route modules export only route things (`meta`, `default`, and so on). Put shared data in `const.ts` or a component.
- With `ssr: false` there's no runtime server: no `action` or `headers` exports.
- Theme: `.dark` on `<html>`, set before paint by the inline script in `root.tsx`. The choice is in localStorage
  (`THEME_STORAGE_KEY`). Icons that depend on the theme are toggled with CSS (`dark:hidden`) to avoid hydration mismatches.

## Deploy
Vercel project with this repo, framework "Other" (vercel.json sets build command and output). After the first deploy,
put the real address in the extension's `SITE_URL` (`presnip/src/core/const.ts`), which unblocks its `npm run zip`.

## Working with Toufik
- He wants to learn: say what code does, where it runs (build time or browser) and why. Work in small steps.
- Explain and agree on the approach before starting a new feature or page.
- Be direct and concise.
