# CLAUDE.md

Guidance for working in this repo. See `README.md` for the full architecture
overview; this file focuses on conventions and non-obvious gotchas.

## Commands

- Dev: `pnpm dev` · Build: `pnpm build` · Lint: `pnpm lint`
- Typecheck: `npx tsc --noEmit`
- Unit tests: `pnpm test` (Vitest, node env) · E2E: `pnpm test:e2e` (Playwright)
- Package manager is **pnpm**. Native build scripts are allow-listed in
  `pnpm-workspace.yaml` under `allowBuilds` (e.g. `esbuild: true` for Vitest).

## Layout

- `app/` — App Router. `layout.tsx` holds all metadata + `Person` JSON-LD;
  `actions/contact.ts` is the contact server action; `sitemap.ts`, `robots.ts`,
  `opengraph-image.tsx` are generated routes.
- `components/sections/` — page sections (Hero, Work, About, Contact).
- `components/ui/` — reusable pieces (device frame/screen, NavBar, forms,
  Reveal/ClusterReveal).
- `data/projects.ts` — the single source of truth for projects.
- `lib/` — framework-free logic: `site.ts` (site constants), `contact.ts`
  (validation), `rate-limit.ts` (limiter).

## Conventions

- **Colors via tokens only.** Use `bg-surface` / `text-muted` etc.; the oklch
  tokens live in `app/globals.css` under `@theme`. The blue accents are all
  hue 255 at different lightness. No raw hex in components (the OG image and the
  SVG logo are the exceptions — satori/SVG can't read CSS tokens).
- **No animation library.** Enter animations are CSS (`.reveal`, `.device-*`)
  toggled by `IntersectionObserver`. Animate only `transform`/`opacity`.
- **Server-action files (`"use server"`) may only export async functions.**
  Shared schemas/helpers (e.g. the contact Zod schema, `escapeHtml`) live in
  `lib/` so they can be imported and unit-tested.
- Tests sit beside the code as `*.test.ts` (Vitest); browser specs live in
  `e2e/*.spec.ts` (Playwright) and are excluded from Vitest.

## Gotchas

- **Dev image cache (Next 16 + Turbopack) is at `.next/dev/cache/images`**, not
  `.next/cache/images`. After replacing a file in `public/` (e.g. a screenshot),
  clear it — otherwise the optimizer keeps serving the stale variant:
  `rm -rf .next/dev/cache/images` and restart `pnpm dev`.
- **The device slide-in intentionally ignores `prefers-reduced-motion`** (owner's
  call — it's core to the Work section). The `.reveal` fade still honors it. If
  you re-add a reduced-motion guard to `.device-*`, the animation will "do
  nothing" for anyone with reduce-motion enabled.
- **`overflow-x: clip` on `html` and `body`** (both — clip on `html` alone still
  scrolls) contains the device layers that start off-screen at `translateX(±100vw)`.
  Uses `clip`, not `hidden`, so the sticky nav still works.
- **Embeddable projects have no screenshot files** — they render the live site in
  an iframe. Only the `embeddable: false` projects (webics, symk, lifescience)
  have `public/screens/*.webp`. To capture a fresh screenshot, match the MacBook
  screen well's aspect (~1.62, e.g. 1440×888) so `object-cover` doesn't crop.
- **`next.config.ts` changes need a dev-server restart** (config isn't hot-reloaded).
- Images serve **AVIF** (WebP fallback); if you add a `quality` prop it must be
  listed in `next.config.ts` → `images.qualities`.

## Before committing

Run `npx tsc --noEmit`, `pnpm lint`, `pnpm test`. Run `pnpm test:e2e` for UI/route
changes.
