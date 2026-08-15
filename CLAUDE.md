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
- `app/fonts/` — self-hosted Space Grotesk / Archivo / JetBrains Mono, wired via
  `next/font/local` in `layout.tsx`.
- `components/sections/` — page sections (Hero, Work, About, Contact).
- `components/ui/` — reusable pieces: device frame/screen, NavBar, Footer,
  forms, Reveal/ClusterReveal, `Section` (page shell + `Eyebrow`/`BrandRule`),
  `button.ts` (shared control classes), `Loader`, `SmoothScroll`, and the two
  marks — `MSLogo` (live text) and `MSMarkOutline` (generated outlines).
- `data/projects.ts` — the single source of truth for projects.
- `lib/` — framework-free logic: `site.ts` (site constants), `contact.ts`
  (validation), `rate-limit.ts` (limiter).

## Conventions

- **`public/MS Brand Manual.pdf` is the design source of truth.** Palette, type
  scale, spacing scale, radii, elevation, logo construction and the pattern set
  all come from it; comments cite its section numbers. Read it before changing
  anything visual — most of the "odd" constants are quoted from a page of it.
- **Colors via tokens only.** Use `bg-surface` / `bg-raised` / `border-line` /
  `text-ink` / `text-muted` / `text-accent`; they're defined in
  `app/globals.css`, where fixed brand hex maps onto semantic `--ms-*` vars that
  `@theme inline` exposes. No raw hex in components (the OG image and the app
  icons are the exceptions — satori and standalone SVG can't read CSS tokens).
- **Dark is the default; light arrives via `prefers-color-scheme`.** The tokens
  flip, so components need no `dark:` variants. Don't add any.
- **Two accent tokens, not one.** `--color-accent` (text, links, hairlines)
  flips per theme; `--color-accent-solid` (filled controls) stays Blue 600 in
  both. Blue 400 fails contrast under a white label — don't unify them.
- **Sizes come from the scale.** `text-display/h1/h2/h3/body/small/eyebrow` and
  `rounded-input/card/panel` carry the manual's values; spacing is the 4px scale
  with nothing in between. Reach for a token before a raw utility.
- **No animation library.** Enter animations are CSS (`.reveal`, `.device-*`,
  `.loader*`) toggled by `IntersectionObserver` or plain delays. Animate only
  `transform`/`opacity`.
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
- **`ui/SmoothScroll.tsx` also ignores `prefers-reduced-motion`** (same call).
  It owns hash-link scrolling because CSS `scroll-behavior: smooth` gives no
  duration control, and over this page's distances (~8000px) the browser's own
  smooth scroll is fast enough to read as a snap. If you re-add the guard, anyone
  with reduce-motion on gets an instant jump and will report "smooth scrolling is
  broken" — that is exactly how this was first reported.
- **`overflow-x: clip` on `html` and `body`** (both — clip on `html` alone still
  scrolls) contains the device layers that start off-screen at `translateX(±100vw)`.
  Uses `clip`, not `hidden`, so the sticky nav still works.
- **Embeddable projects have no screenshot files** — they render the live site in
  an iframe. Only the `embeddable: false` projects (webics, symk, lifescience)
  have `public/screens/*.webp`. To capture a fresh screenshot, match the MacBook
  screen well's aspect (~1.62, e.g. 1440×888) so `object-cover` doesn't crop.
- **Don't pin `weight` on the fonts.** They're wired with `next/font/local` from
  `app/fonts` precisely because `next/font/google` built static gstatic URLs for
  these families that 404'd mid-build. Only declared weights are bundled.
- **The app icons and `MSMarkOutline.tsx` are generated artwork**, not
  hand-drawn: real Space Grotesk outlines carrying the lockup's −0.045em
  tracking and 0.135 × cap gap. Don't hand-edit the path data — regenerate all
  three together if the fonts or the lockup change.
- **Texture strength sits below the manual's quoted 4–8%** (`--ms-texture`).
  That band assumes ink on paper; the same alpha on a backlit display reads as
  wallpaper, and the lattice is thin high-frequency stroke work the eye picks
  out easily. Measured on screen before settling on the value.
- **A pattern layer that slides needs `overflow: visible`.** An SVG clips to its
  viewBox, so the loader's brackets arrive as clipped fragments without it.
- **`next.config.ts` changes need a dev-server restart** (config isn't hot-reloaded).
- Images serve **AVIF** (WebP fallback); if you add a `quality` prop it must be
  listed in `next.config.ts` → `images.qualities`.

## Before committing

Run `npx tsc --noEmit`, `pnpm lint`, `pnpm test`. Run `pnpm test:e2e` for UI/route
changes.
