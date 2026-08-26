# CLAUDE.md

Guidance for working in this repo. See `README.md` for the full architecture
overview; this file focuses on conventions and non-obvious gotchas.

## Commands

- Dev: `pnpm dev` · Build: `pnpm build` · Lint: `pnpm lint`
- Typecheck: `npx tsc --noEmit`
- Unit tests: `pnpm test` (Vitest, node env) · E2E: `pnpm test:e2e` (Playwright)
- Project screenshots: `pnpm screens [slug...]` (all projects if no slug)
- Package manager is **pnpm**. Native build scripts are allow-listed in
  `pnpm-workspace.yaml` under `allowBuilds` (e.g. `esbuild: true` for Vitest).

## Layout

- `app/` — App Router. `layout.tsx` holds all metadata + `Person` JSON-LD;
  `actions/contact.ts` is the contact server action; `privacy/page.tsx` is the
  only sub-page; `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` are generated
  routes.
- `app/fonts/` — self-hosted Space Grotesk / Archivo / JetBrains Mono, wired via
  `next/font/local` in `layout.tsx`.
- `components/sections/` — page sections (Hero, Work, About, Contact).
- `components/ui/` — reusable pieces: device frame/screen, NavBar, Footer,
  forms, Reveal/ClusterReveal, `Section` (page shell + `Eyebrow`/`BrandRule`),
  `button.ts` (shared control classes), `Loader`, `SmoothScroll`, and the two
  marks — `MSLogo` (live text) and `MSMarkOutline` (generated outlines).
- `data/projects.ts` — the single source of truth for projects.
- `lib/` — framework-free logic: `site.ts` (site constants), `contact.ts`
  (validation), `rate-limit.ts` (limiter), `device-frames.ts` (frame geometry
  + `wellAspect`, shared by the component, the capture script and the tests).
- `scripts/capture-screens.mjs` — regenerates `public/screens/*.webp`.

## Conventions

- **The MS Brand Manual is the design source of truth** — palette, type scale,
  spacing scale, radii, elevation, logo construction and the pattern set all
  come from it, and comments cite its section numbers. Most of the "odd"
  constants here are quoted from a page of it, so read it before changing
  anything visual. It is **not in this repo** (git-ignored, kept out
  deliberately) — ask Moheb for the current PDF.
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

- **The privacy policy must match the code.** `app/privacy/page.tsx` describes
  the real data flow — the three contact fields, the IP-keyed 5-per-10-minutes
  limiter, cookieless analytics, no cookies or storage anywhere. Change any of
  those and the page becomes a false statement, so update it in the same commit.
  Its `LAST_UPDATED` is a hand-edited literal on purpose: unlike the footer's
  computed year, an effective date that moved on its own would misstate when the
  terms changed. The processors clause names Vercel, Resend, Upstash and Google.
  Upstash is in it because the `UPSTASH_*` env vars are set, so the limiter's
  IP-derived key leaves the server. Unset them and the limiter falls back to
  memory — at which point Upstash has to come back out of the processors clause
  and the retention clause goes back to describing process memory.
- **Nav links are route-aware.** `NavBar` emits bare `#work` on the homepage, so
  `SmoothScroll`'s `a[href^="#"]` handler animates the travel, and `/#work`
  everywhere else, where a bare hash would resolve against the sub-page and go
  nowhere. Adding a route means keeping that split.

- **The hide-on-scroll bar and `SmoothScroll` share one flag.** A scroll listener
  can't tell the reader scrolling down from `SmoothScroll` animating a hash-link
  trip down the page, and hiding the bar on the second yanks it out from under
  the link that was just clicked. So `SmoothScroll` marks `<html>` with
  `data-auto-scroll` for the length of its travel and `NavBar` declines to hide
  while it's there. The mark is dropped by `cancel()` — which is also what runs
  the moment the reader takes control back, so a real scroll mid-travel hides the
  bar as usual — and, at the end of a completed trip, one frame *after* the last
  hop: a frame's scroll event is dispatched at the top of the next frame, and a
  stalled frame can make that final hop the whole journey. Clear it in the same
  frame and a click on a nav link ends with the bar gone. Covered in
  `e2e/home.spec.ts`.
- **The bar's transition names `translate`, not `transform`.** Tailwind v4's
  `-translate-y-full` sets the standalone `translate` property, so a
  `transition-[transform,…]` compiles fine, animates nothing, and leaves the bar
  snapping in and out.

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
- **Every project renders from screenshots; there are no live embeds.** Framing
  the client sites cost ~10MB and ~4MB of third-party JS across 12 iframes, and
  put the section at the mercy of sites we don't control. Capture with
  `pnpm screens [slug...]` (`scripts/capture-screens.mjs`) — it renders each site
  at the viewport its frame represents and clips to the well's exact aspect, so
  `object-cover` crops nothing. Sizes come from `lib/device-frames.ts`
  (`wellAspect`), which `DeviceFrame`, the script and the tests all share — don't
  re-derive them anywhere else.
- **Recheck `screenBg` after recapturing.** It fills the strip above the notch and
  backs the well while the shot lazy-loads, so it must match the screenshot's top
  edge. It used to be sampled from inside the iframe, which could differ from the
  standalone site — that's why EcoSphere was `#0a0909` and is now `#ffffff`.
- **`pnpm screens` can catch a site mid-animation.** Marquees and sliders don't
  settle, so review every file it writes before committing; webics and
  lifescience are captured by hand for exactly this reason.
- **Don't pin `weight` on the fonts.** They're wired with `next/font/local` from
  `app/fonts` precisely because `next/font/google` built static gstatic URLs for
  these families that 404'd mid-build. Only declared weights are bundled.
- **The app icons and `MSMarkOutline.tsx` are generated artwork**, not
  hand-drawn: real Space Grotesk outlines carrying the lockup's −0.045em
  tracking and 0.135 × cap gap. Don't hand-edit the path data — regenerate all
  three together if the fonts or the lockup change.
- **The favicon keeps the full lockup, against §03's 56px rule** — owner's call.
  The lockup is 4.15:1, so in a square box it is width-bound: already 96% of the
  width with the initials only 23% of the height, and no scaling changes that.
  The compact initials-only mark was tried (51% tall, 2.2× the cap height) and
  reverted because it drops the brackets. Small type on the tab is the accepted
  cost, so don't refile it as a sizing bug.
- **Texture strength sits below the manual's quoted 4–8%** (`--ms-texture`).
  That band assumes ink on paper; the same alpha on a backlit display reads as
  wallpaper, and the lattice is thin high-frequency stroke work the eye picks
  out easily. Measured on screen before settling on the value.
- **A pattern layer that slides needs `overflow: visible`.** An SVG clips to its
  viewBox, so the loader's brackets arrive as clipped fragments without it.
- **`next.config.ts` changes need a dev-server restart** (config isn't hot-reloaded).
- **The CV is `noindex`ed by header, not by `robots.txt`** — and the difference
  matters. `public/Moheb-Saeed_CV.pdf` is the one file carrying the phone number
  beside the name and email, and an indexed PDF is what bulk harvesters scrape,
  so `next.config.ts` sends `X-Robots-Tag: noindex` on that path only. Do *not*
  "tighten" this with a `Disallow` in `robots.ts`: a disallowed URL is never
  crawled, so the `noindex` would never be read, and the URL can still be
  indexed from a link — strictly worse than the header. `robots.txt` must keep
  saying `Allow: /`. The rule's `source` comes from `site.cv` so renaming the
  file can't silently drop it.
- **The CSP is deliberately partial.** It carries `frame-ancestors`, `base-uri`,
  `form-action` and `object-src` — every directive that needs no nonce. There is
  no `script-src` because Next inlines its bootstrap and flight data, so a real
  one means threading a per-request nonce through middleware. Absence is a
  decision, not an oversight.
- Images serve **AVIF** (WebP fallback); if you add a `quality` prop it must be
  listed in `next.config.ts` → `images.qualities`.

- **React 19 resets an uncontrolled form when its action settles — including on
  failure.** Every field returns to its `defaultValue`, the hidden `startedAt`
  with them, and nothing in the component asks for it. Two things lean on
  knowing that. `submitContact` echoes the submission back as `state.values` and
  each field takes its `defaultValue` from it, so the reset lands on what the
  visitor typed; drop the echo from any one error return and that path silently
  clears the form and leaves the field errors pointing at empty boxes. And
  `ContactForm` re-stamps `startedAt` on *every* settled state — keyed on
  `state`, not `state.status`, which doesn't change between two successes.
  Stamping only on success left later submissions carrying an empty stamp, which
  the action reads as "no stamp" and lets through, so the fill-time guard quietly
  stopped running after the first attempt. Both are covered in
  `e2e/contact.spec.ts`; both tests fail if the fix is removed.
- **The honeypot's name must stay meaningless.** It was `company`, which
  browsers match to the organization autofill category and can fill on the
  visitor's behalf — and since a filled honeypot answers with a silent success,
  that thanks a real person for a message that was never sent. `autoComplete="off"`
  is advisory and Chrome ignores it for address-shaped fields, so the name is the
  defence. Renaming it means changing `ContactForm` and the `formData.get` in
  `submitContact` together.
- **The anti-spam e2e test submits a message too short to validate, on purpose.**
  Its guard only fires while the server sees under `MIN_FILL_MS` (3s) between
  form-open and submit, and a loaded run overshoots that — `submitContact` then
  reads the submission as genuine and carries on to a real Resend send. Against
  a dev server holding the live key from `.env.local`, that put real "Portfolio
  enquiry from Jane Doe" mail in Moheb's inbox. Validation sits between the
  guard and the send, so a sub-10-character message makes the send unreachable
  whatever the timing or the server. Give that test a "valid" message and the
  bug is back.
- **That same test submits twice, and the first one is load-bearing.** The stamp
  is written immediately before the click, so the server reads `elapsed` as the
  click-to-server round trip itself — and dev compiles the server action on its
  first invocation, measured at 2.7–3.6s against `MIN_FILL_MS`'s 3000. The guard
  fired or didn't on which side of 3000 the run landed, which is why this used to
  fail perhaps half of full-suite runs while passing alone. The throwaway submit
  moves the real attempt onto the warm path (~0.2s). It runs with an empty stamp
  so its own outcome can't be "too quick" — `submitContact` skips the guard when
  the stamp is missing — which is what makes the second assertion proof that the
  second response landed. Delete it and the flake returns.
- **E2E reuses whatever answers on :3000.** That is what keeps it ~15s rather
  than a minute — a dedicated port would stop it reusing the dev server, and
  `next dev` refuses to run twice for one project on any port, so the suite
  would have to `pnpm build && pnpm start` first. The cost is that if another
  project holds :3000, the whole suite silently runs against that app and fails
  on the first title assertion. Start this project's `pnpm dev` before running,
  or point `baseURL` at the port it actually took.

## Before committing

Run `npx tsc --noEmit`, `pnpm lint`, `pnpm test`. Run `pnpm test:e2e` for UI/route
changes.
