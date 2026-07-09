"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Device } from "./DeviceFrame";

const VIEWPORTS: Record<Device, { width: number; height: number }> = {
  macbook: { width: 1440, height: 900 },
  ipad: { width: 820, height: 1180 },
  iphone: { width: 390, height: 844 },
};

const IMAGE_SIZES: Record<Device, string> = {
  macbook: "(min-width: 1152px) 880px, (min-width: 768px) 78vw, 100vw",
  ipad: "(min-width: 1152px) 300px, 26vw",
  iphone: "(min-width: 1152px) 145px, 20vw",
};

type DeviceScreenProps = {
  device: Device;
  title: string;
  liveUrl: string;
  embeddable: boolean;
  screenshot: string;
  priority?: boolean;
};

/**
 * The screen inside a DeviceFrame. Embeddable projects render the live site
 * in a decorative iframe at true viewport size, scaled down to fit; the rest
 * render a screenshot via next/image. A permanent overlay <a> is the only
 * interactive/focusable element and opens the real site in a new tab.
 */
export function DeviceScreen({
  device,
  title,
  liveUrl,
  embeddable,
  screenshot,
  priority = false,
}: DeviceScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [showIframe, setShowIframe] = useState(false);
  const { width, height } = VIEWPORTS[device];

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !embeddable) return;

    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / width);
    });
    ro.observe(el);

    // Mount the iframe only when the frame approaches the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowIframe(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);

    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, [embeddable, width]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden bg-surface-2"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      {embeddable ? (
        showIframe &&
        scale > 0 && (
          <iframe
            src={liveUrl}
            title={`${title} — live preview`}
            tabIndex={-1}
            aria-hidden="true"
            scrolling="no"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
            style={{ width, height, transform: `scale(${scale})` }}
          />
        )
      ) : (
        <Image
          src={screenshot}
          alt=""
          fill
          sizes={IMAGE_SIZES[device]}
          priority={priority}
          className="object-cover object-top"
        />
      )}

      <a
        href={liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${title} — opens in a new tab`}
        className="group absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
      >
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-bg/80 px-3 py-1.5 font-medium text-ink whitespace-nowrap text-xs opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          {device === "macbook" ? "Visit site ↗" : "↗"}
        </span>
      </a>
    </div>
  );
}
