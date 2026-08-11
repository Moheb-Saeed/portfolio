"use client";

import { useEffect, useRef, type ReactNode } from "react";

type ClusterRevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Flips data-visible="true" the first time the device cluster scrolls into
 * view, so the layers inside can slide from the screen edges to their resting
 * position via CSS (see `.device-slide` in globals.css). Same
 * IntersectionObserver-not-Motion approach as Reveal, kept separate so the
 * cluster's slide stays decoupled from the card's fade.
 */
export function ClusterReveal({ children, className }: ClusterRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-visible", "true");
            observer.unobserve(entry.target); // once
          }
        }
      },
      { rootMargin: "-80px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-device-cluster="" className={className}>
      {children}
    </div>
  );
}
