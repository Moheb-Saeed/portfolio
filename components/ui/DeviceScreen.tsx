import Image from "next/image";
import type { Device } from "./DeviceFrame";

/**
 * Rendered width of each screen well, measured against the real layout rather
 * than estimated: an overstated `sizes` pushes the browser into a larger
 * srcset entry and ships bytes the frame can't show. Values are rounded up to
 * the next whole vw so no breakpoint ever under-states and blurs.
 *
 * Well width = frame width x the content inset in DeviceFrame's FRAMES[].
 *   macbook  78% of the container above md, full width below; caps at 819px.
 *   ipad     26% of the container, hidden below md; caps at 299px.
 *   iphone   12.5% above md / 20% below; caps at 147px.
 * The container itself caps at ~1280px, so every well is fixed past ~1440vw.
 */
const IMAGE_SIZES: Record<Device, string> = {
  macbook: "(min-width: 1440px) 820px, (min-width: 768px) 62vw, 80vw",
  ipad: "(min-width: 1440px) 300px, 23vw",
  iphone: "(min-width: 1440px) 150px, (min-width: 768px) 12vw, 18vw",
};

type DeviceScreenProps = {
  device: Device;
  title: string;
  liveUrl: string;
  screenshot: string;
  priority?: boolean;
};

/**
 * The screen inside a DeviceFrame: a screenshot of the project, with a
 * permanent overlay <a> as the only interactive/focusable element, opening the
 * real site in a new tab.
 *
 * Screenshots, not live embeds. Framing each site cost ~1.4-5.4MB and ~0.7-1.2MB
 * of third-party JS per project, x3 frames per card - and left the section at the
 * mercy of sites we don't control (a redesign, an outage, or a new
 * frame-ancestors header silently emptied a frame). The screenshots are captured
 * at the exact viewport each iframe used and clipped to the well, so they show
 * the same pixels the embed did. Regenerate with `scripts/capture-screens.mjs`.
 *
 * Deliberately a server component: with the iframe gone there is no state, no
 * ResizeObserver and no IntersectionObserver left here, so it needs no client
 * directive and ships no JS. Lazy loading is the browser's, via next/image.
 */
export function DeviceScreen({
  device,
  title,
  liveUrl,
  screenshot,
  priority = false,
}: DeviceScreenProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={screenshot}
        // Describe the primary (desktop) shot for image search; the tablet and
        // phone are duplicate views of the same site, so they stay decorative.
        alt={device === "macbook" ? `${title} — desktop website preview` : ""}
        fill
        sizes={IMAGE_SIZES[device]}
        // Only the first card's MacBook is eager — it's the section's LCP
        // candidate. Everything else defers to the browser's lazy loader, which
        // also skips the iPad entirely below md, where it's display:none.
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        // Decode off the main thread so a frame scrolling into view can't
        // block interaction.
        decoding="async"
        quality={65}
        className="object-cover object-top"
      />

      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${title} — opens in a new tab`}
        className="group absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
      >
        {/* Solid, not frosted: §12's "don't" list rules out glassmorphism. */}
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-raised px-3 py-2 font-mono text-eyebrow uppercase text-ink whitespace-nowrap opacity-0 shadow-raised transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {device === "macbook" ? "Visit site ↗" : "↗"}
        </span>
      </a>
    </div>
  );
}
