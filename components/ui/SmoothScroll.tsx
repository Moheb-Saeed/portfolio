"use client";

import { useEffect } from "react";

/**
 * Controlled in-page scrolling for same-document hash links.
 *
 * CSS `scroll-behavior: smooth` is already on `html`, and it does animate — but
 * its duration is the browser's to choose, and over the distances on this page
 * (Contact sits ~9000px down) Chrome covers the gap so fast that it reads as a
 * snap. There is no CSS knob for duration, so the travel is animated here
 * instead, with a duration that grows with distance and then clamps, so a short
 * hop stays crisp and a long one stays legible.
 *
 * The CSS rule is deliberately left in place: without JS these links still fall
 * back to the browser's own smooth scroll rather than jumping.
 *
 * This ignores `prefers-reduced-motion` on purpose — see the note at the call
 * site in `onClick`.
 */

/** Slow at both ends, quickest in the middle. */
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function SmoothScroll() {
  useEffect(() => {
    let frame = 0;

    const cancel = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const scrollTo = (target: HTMLElement) => {
      // The nav is fixed, so headings sit under it. `scroll-margin-top` already
      // encodes that clearance for native scrolling; read it back rather than
      // hard-coding the nav height in two places.
      const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const from = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const to = Math.min(
        Math.max(target.getBoundingClientRect().top + from - offset, 0),
        Math.max(max, 0)
      );
      const distance = to - from;
      if (!distance) return;

      // ~1px per ms, floored so short hops still register as movement and
      // capped so the full-page trips don't feel indulgent.
      const duration = Math.min(1100, Math.max(450, Math.abs(distance) * 0.35));
      const start = performance.now();

      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // `instant` matters: a plain scrollTo would inherit the CSS
        // `scroll-behavior: smooth` and re-animate on every single frame.
        window.scrollTo({ top: from + distance * easeInOutCubic(t), behavior: "instant" });
        frame = t < 1 ? requestAnimationFrame(step) : 0;
      };
      cancel();
      frame = requestAnimationFrame(step);
    };

    const onClick = (event: MouseEvent) => {
      // Leave modified clicks alone — they open tabs and windows.
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>(
        'a[href^="#"]'
      );
      const href = link?.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;

      event.preventDefault();

      // Deliberately plays regardless of `prefers-reduced-motion` — owner's
      // call, the same one already made for the Work section's device slide-in.
      // Animated scrolling is a common vestibular trigger, so this is a real
      // trade: it is chosen here because in-page navigation is the primary way
      // the site is read. The travel stays interruptible (see `abort` below),
      // which is what keeps it from trapping anyone mid-flight.
      scrollTo(target);

      // Native hash navigation moves focus to the target and updates the URL;
      // preventing the default drops both, so do them by hand or keyboard users
      // land back at the top of the document.
      history.pushState(null, "", href);
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    // Any deliberate scroll input hands control straight back to the user.
    const abort = () => cancel();

    document.addEventListener("click", onClick);
    window.addEventListener("wheel", abort, { passive: true });
    window.addEventListener("touchstart", abort, { passive: true });
    window.addEventListener("keydown", abort);

    return () => {
      cancel();
      document.removeEventListener("click", onClick);
      window.removeEventListener("wheel", abort);
      window.removeEventListener("touchstart", abort);
      window.removeEventListener("keydown", abort);
    };
  }, []);

  return null;
}
