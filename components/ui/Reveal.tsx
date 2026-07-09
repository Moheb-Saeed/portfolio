"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The only enter animation in the app: fade + 14px rise, once.
 *
 * Deliberately not Motion — a CSS transition plus one IntersectionObserver
 * produces the identical effect for none of the bundle cost. The transition,
 * the reduced-motion opt-out, and the no-JS fallback all live in globals.css
 * under `.reveal`, so there is still exactly one place to tune it.
 *
 * The -60px margin fires the reveal slightly before the element is fully on
 * screen, and is tighter than DeviceScreen's +200px iframe rootMargin, so a
 * device frame fades in first and its iframe loads behind it.
 */
export function Reveal({ children, className }: RevealProps) {
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
      { rootMargin: "-60px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal="" className={className ? `reveal ${className}` : "reveal"}>
      {children}
    </div>
  );
}
