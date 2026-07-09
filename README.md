# Moheb Saeed — Portfolio

Personal developer portfolio. Single-page, dark-only, built to be fast enough to
serve as its own performance evidence.

**Stack:** Next.js 16 (App Router, RSC) · TypeScript · Tailwind CSS v4 · Zod ·
Resend · Vercel Analytics.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in RESEND_API_KEY
pnpm dev
```

## Architecture notes

- **Design tokens** live in `app/globals.css` under `@theme`, as oklch values.
  Components only use token-based utilities (`bg-surface`, `text-muted`), never
  raw colors. Elevation on dark = borders + lighter surfaces, not shadows.
- **Device showcase** (`components/ui/DeviceScreen.tsx`) renders each project's
  live site in a decorative, sandboxed iframe at its true viewport size, scaled
  down with `transform: scale()` measured by a `ResizeObserver`. Iframes mount
  only within 200px of the viewport. Sites that block framing fall back to a
  screenshot — see the `embeddable` flag in `data/projects.ts`.
- **Motion is CSS-only.** The single enter reveal is the `.reveal` class in
  `globals.css`, toggled by one `IntersectionObserver` in
  `components/ui/Reveal.tsx`. Removing the `motion` library cut ~40 KB gzipped
  from first-load JS. Only `transform` and `opacity` are ever animated.
- **The hero never animates in.** It is the LCP element, so it paints straight
  from static HTML instead of starting at `opacity: 0` until hydration.

## Deploying to Vercel

1. Import the repo. Framework preset: Next.js.
2. Set environment variables (Project → Settings → Environment Variables):
   - `RESEND_API_KEY` — required, or the contact form returns a friendly error
     instead of sending.
   - `NEXT_PUBLIC_SITE_URL` — your production origin, no trailing slash.
3. The form sends from `onboarding@resend.dev`. To send from your own domain,
   verify it on Resend and update `from:` in `app/actions/contact.ts`.

## Assets to replace

| Path | What |
| --- | --- |
| `public/cv.pdf` | Placeholder — drop in the real CV |
| `public/screens/{webics,symk,lifescience}-{desktop,tablet,mobile}.webp` | Placeholders for the three projects that block iframe embedding |

Copy still marked `TODO(Moheb)` in source: the About paragraphs, the hero
positioning line, and the `role` / `stack` fields in `data/projects.ts`.
