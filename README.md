# Moheb Saeed — Portfolio

Personal developer portfolio. Single page, built to be fast enough to serve as
its own performance evidence.

The visual system is not improvised: it implements **MS Brand Manual v1.0**.
Palette, type scale, spacing scale, logo construction, radii, elevation and the
pattern set all come from it, and the code comments cite its section numbers
(`§09 · Brand colors`, `§11 · Spacing & layout`, and so on). When changing
anything visual, that PDF is the source of truth — not taste, and not this file.

> The manual itself is **not in this repo** and is git-ignored, so it can't be
> committed by accident. Ask Moheb for the current version before doing visual
> work; the section numbers in the comments are your index into it.

**Stack:** Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind CSS v4 ·
Zod · Resend · Upstash (optional) · Vitest · Playwright · Vercel Analytics.
Fonts are self-hosted from `app/fonts` (no Google Fonts at runtime).

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
pnpm dev
```

## Scripts

| Command | What |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` | ESLint |
| `pnpm test` / `pnpm test:watch` | Vitest unit tests (once / watch) |
| `pnpm test:e2e` | Playwright e2e (auto-starts, or reuses, the dev server) |

## Environment

| Var | Required? | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | **Yes** | Contact-form delivery. Missing → the form returns a friendly error instead of sending. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production origin, no trailing slash. Drives canonical, OG image, sitemap, and JSON-LD URLs. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Optional | Cross-instance contact-form rate limiting (free Upstash tier). Absent → per-instance in-memory limiter. |

Keep real secrets in `.env.local` (git-ignored). `.env.example` stays blank.

## The brand system

All of it lives in `app/globals.css`.

- **Colour.** The manual's blue and neutral scales are declared as fixed hex on
  `:root`, then mapped onto semantic tokens (`--ms-surface`, `--ms-ink`,
  `--ms-accent`…) which `@theme inline` exposes as utilities — `bg-surface`,
  `bg-raised`, `border-line`, `text-ink`, `text-muted`, `text-accent`. Components
  use those and never raw colour.
- **Two themes, one set of classes.** Dark is the default ground; the manual's
  light-mode configuration takes over under `prefers-color-scheme: light`. The
  tokens flip, so no component carries a `dark:` variant.
- **The accent is two tokens, deliberately.** `--color-accent` is for text,
  links and hairlines and flips per theme (Blue 600 light / Blue 400 dark).
  `--color-accent-solid` is for filled controls and stays Signal Blue in both,
  because the manual is explicit that these are not interchangeable: Blue 600
  carries a white label at 5.2:1 and Blue 400 does not.
- **Elevation has exactly one level** — a single soft shadow in light mode, and
  `none` in dark, where the manual separates surfaces with lines and raised
  grounds instead. There is no second level.
- **Type scale** is exposed as `text-display` / `text-h1` / `text-h2` /
  `text-h3` / `text-body` / `text-small` / `text-eyebrow`, each carrying its own
  size, line height, weight and tracking. Space Grotesk is display and the mark
  only; Archivo is every heading and all body copy; JetBrains Mono is eyebrows,
  code and metadata. Eyebrows are the only uppercase type in the system.
- **Spacing** is the 4px scale (4 8 12 16 24 32 48 64 96) and nothing between.
  `components/ui/Section.tsx` holds the page shell so the grid is identical
  everywhere: 1280px content width, 20/64px gutters, 48/96px section padding.
- **Radii** are the manual's four, as `rounded-input` (6), `rounded-card` (10),
  `rounded-panel` (18) and `rounded-full`.
- **The mark is `< MS />`** and never sits in a coloured container. Two
  implementations, for two different problems: `ui/MSLogo.tsx` is live text
  (picks up theme colour, scales with `font-size`) and is what the page uses;
  `ui/MSMarkOutline.tsx` is generated Space Grotesk outlines, used by the loader
  where the webfont may not have arrived yet. Both app icons are built from the
  same outlines.
- **Four textures**, all derived from the mark or the grid: `.pattern-dots`,
  `.pattern-hairline`, `.pattern-lattice`, `.pattern-field`. One per surface,
  never two at once, strength always from `.texture` so the contrast rule is
  enforced by the token rather than by whoever writes the markup. Only the
  bracket lattice is currently in use, as the hero cover.

## Architecture notes

- **Work is grouped** into categories — `Webics Agency`, `Freelance work`,
  `Projects` — driven by the `category` field and `CATEGORY_ORDER` in
  `data/projects.ts` and rendered as sections in `components/sections/Work.tsx`.
- **Device showcase** (`components/ui/DeviceScreen.tsx`) renders each embeddable
  project's live site in a decorative, sandboxed iframe at its true viewport
  size, scaled down with `transform: scale()` measured by a `ResizeObserver`.
  Iframes mount only within 200px of the viewport; the screen is transparent so
  the site's own background shows while it loads. Sites that block framing fall
  back to a screenshot — see the `embeddable` flag in `data/projects.ts`.
- **Cluster slide-in.** On scroll each device cluster slides to its resting
  position — MacBook from the left screen edge, iPad + iPhone from the right —
  via CSS keyframes toggled by one `IntersectionObserver`
  (`components/ui/ClusterReveal.tsx` + the `.device-*` rules in `globals.css`).
  Keyframes, not a transition, so it stays on the compositor and starts on time
  even while screenshots decode. `html`/`body` use `overflow-x: clip` so the
  off-screen layers never add a horizontal scrollbar.
- **Motion is CSS.** The `.reveal` fade, the `.device-*` slide and the opening
  sequence are the enter animations; the first two are toggled by a single
  `IntersectionObserver` each. No `motion` library — only `transform`/`opacity`
  ever animate.
- **Opening sequence** (`components/ui/Loader.tsx`): the brackets close in
  around the initials, the signature gradient draws underneath, then the overlay
  lifts. ~1.35s, CSS-only and server-rendered, so it paints with the first frame
  of HTML and dismisses on a timer it owns rather than waiting on a hydration or
  network event that might never land. It ends at `visibility: hidden`, which is
  what actually retires the layer — opacity alone would leave an invisible sheet
  swallowing clicks. Note it covers the viewport while it runs, so it does cost
  LCP; drop it if the score matters more than the intro.
- **In-page scrolling is JS-driven** (`components/ui/SmoothScroll.tsx`). CSS
  `scroll-behavior: smooth` is still set as the no-JS fallback, but it offers no
  duration control and the browser covers this page's ~8000px fast enough to
  read as a snap. The handler eases hash-link travel over 450–1100ms, keeps the
  URL hash, moves focus to the target for keyboard users, and aborts the moment
  the user scrolls.
- **The hero never animates in.** It is the LCP element, so it paints straight
  from static HTML instead of starting at `opacity: 0` until hydration.
- **Fonts are self-hosted** from `app/fonts` via `next/font/local`. Google's
  static cuts of these families 404'd intermittently mid-build, and self-hosting
  also drops a third-party origin from the critical path. Only the weights the
  type scale needs are declared; the directory holds more faces than that, and
  unreferenced ones are neither bundled nor served.
- **Images.** `next/image` serves AVIF (WebP fallback) for both the device
  frames and the screenshots; screenshots render at `quality={65}` (they're
  small inside the frames). Configured in `next.config.ts`.
- **Contact form** (`app/actions/contact.ts`): shared Zod validation
  (`lib/contact.ts`), a honeypot + minimum-fill-time, per-IP rate limiting
  (`lib/rate-limit.ts` — Upstash if configured, else in-memory), an
  HTML-escaped email body, and delivery via Resend.
- **Security headers** are set for every response in `next.config.ts`:
  `Content-Security-Policy: frame-ancestors 'none'`, `X-Frame-Options: DENY`,
  `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`,
  `Referrer-Policy`, and a locked-down `Permissions-Policy`.
- **SEO.** Metadata, canonical, OpenGraph/Twitter, and a `Person` JSON-LD live
  in `app/layout.tsx`; plus `app/sitemap.ts`, `app/robots.ts`, and a generated
  `app/opengraph-image.tsx`. The OG image is a deep-field cover with the
  knockout mark; satori can't reach the page webfonts, so its type falls back to
  a default sans — composition and colour are the brand's, letterforms are
  approximate.
- **Icons.** `app/icon.svg` is the `< MS />` lockup on no ground, shipping both
  approved colourways and letting `prefers-color-scheme` pick, so it stays
  legible on a light or dark tab strip. `app/apple-icon.png` keeps an opaque Ink
  ground, because iOS composites transparency onto black. Both are generated
  from the real font outlines, not traced by hand.

## Testing

- **Unit — Vitest (node env).** Pure logic, as `*.test.ts` beside the code:
  `lib/rate-limit.test.ts`, `lib/contact.test.ts`, `data/projects.test.ts`.
- **E2E — Playwright (chromium).** Smoke tests in `e2e/`: title/H1, the work /
  about / contact sections, the three work categories, hash navigation, no
  horizontal overflow, the security headers, and the contact form's fields +
  anti-spam rejection. It reuses a dev server on `:3000` if one is up, otherwise
  starts one.

First e2e run needs the browser: `pnpm exec playwright install chromium`.

**Known failure.** `contact.spec.ts › rejects a submission that arrives too
fast` fails. The test stamps `startedAt` from the browser clock while the action
subtracts using the server's; when the server reads even a millisecond behind,
`elapsed` goes negative and the gate is skipped *by design* (see the clock-skew
comment in `app/actions/contact.ts`). The submission then falls through to
Resend and **sends a real email on every run**. Freeze the clock in the test, or
have the action refuse to send outside production, before running the full
suite. `pnpm exec playwright test e2e/home.spec.ts` avoids it.

## Deploying to Vercel

1. Import the repo. Framework preset: Next.js.
2. Set environment variables (Project → Settings → Environment Variables):
   - `RESEND_API_KEY` — required, or the contact form returns a friendly error.
   - `NEXT_PUBLIC_SITE_URL` — your production origin, no trailing slash.
   - `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` — optional.
3. The form sends from `onboarding@resend.dev`, which only delivers to the email
   your Resend account is registered under. To send from your own domain, verify
   it on Resend and update `from:` in `app/actions/contact.ts`.

## Remaining copy / config

Marked `TODO(Moheb)` in source:

- The Resend `from:` branded address once a domain is verified
  (`app/actions/contact.ts`).
- The `draft: true` flag on Cairaw, to drop once `cairawfilms.com` is live
  (`data/projects.ts`).

`lib/site.ts` now defaults to `https://mohebsaeed.com`; set
`NEXT_PUBLIC_SITE_URL` only to override it for previews.

## Assets

| Path | What |
| --- | --- |
| `public/Moheb-Saeed_CV.pdf` | CV, linked from the hero. |
| `public/screens/{webics,symk,lifescience}-{desktop,tablet,mobile}.webp` | Fallback screenshots for the three iframe-blocked projects. |
| `public/frames/` | Device frame PNGs (MacBook, iPad, iPhone). |
| `app/fonts/` | Space Grotesk, Archivo and JetBrains Mono, self-hosted. |
