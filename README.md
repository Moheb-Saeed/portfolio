# Moheb Saeed — Portfolio

Personal developer portfolio. Single-page, dark-only, built to be fast enough to
serve as its own performance evidence.

**Stack:** Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind CSS v4 ·
Zod · Resend · Upstash (optional) · Vitest · Playwright · Vercel Analytics.

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

## Architecture notes

- **Design tokens** live in `app/globals.css` under `@theme`, as oklch values.
  Components only use token-based utilities (`bg-surface`, `text-muted`), never
  raw colors. Elevation on dark = borders + lighter surfaces, not shadows. The
  blue system (logo chip → buttons → accent text) is one hue (255) at different
  lightness.
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
- **Motion is CSS-only.** The `.reveal` fade and the `.device-*` slide are the
  only enter animations, each toggled by a single `IntersectionObserver`. No
  `motion` library — only `transform`/`opacity` ever animate.
- **The hero never animates in.** It is the LCP element, so it paints straight
  from static HTML instead of starting at `opacity: 0` until hydration.
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
  `app/opengraph-image.tsx`.

## Testing

- **Unit — Vitest (node env).** Pure logic, as `*.test.ts` beside the code:
  `lib/rate-limit.test.ts`, `lib/contact.test.ts`, `data/projects.test.ts`.
- **E2E — Playwright (chromium).** Smoke tests in `e2e/`: title/H1, the work /
  about / contact sections, the three work categories, hash navigation, no
  horizontal overflow, the security headers, and the contact form's fields +
  anti-spam rejection. It reuses a dev server on `:3000` if one is up, otherwise
  starts one.

First e2e run needs the browser: `pnpm exec playwright install chromium`.

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

- `NEXT_PUBLIC_SITE_URL` — set to the real production domain (`lib/site.ts`).
- The hero positioning line (`components/sections/Hero.tsx`).
- The Resend `from:` branded address once a domain is verified
  (`app/actions/contact.ts`).

Screenshots for the three iframe-blocked projects live at
`public/screens/{webics,symk,lifescience}-{desktop,tablet,mobile}.webp`; the CV
is `public/Moheb-Saeed_CV.pdf`.
