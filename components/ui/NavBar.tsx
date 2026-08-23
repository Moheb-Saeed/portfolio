"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MSLogo } from "./MSLogo";

const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export function NavBar() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  // The sections only exist on the homepage. Bare `#work` from a sub-page
  // would resolve against that page and go nowhere, so link back to `/#work`
  // there — and keep the bare hash at home, where SmoothScroll's
  // `a[href^="#"]` handler needs it to animate the travel.
  const onHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!onHome) return; // nothing to spy on outside the homepage
    const ids = ["home", ...SECTIONS.map((s) => s.id)];
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <header
      // Solid on scroll, not frosted — §12 rules out glassmorphism, so the bar
      // separates from the page with a hairline and a raised surface instead.
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-surface"
          : "border-b border-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-page items-center justify-between px-5 lg:px-16"
      >
        <a
          href={onHome ? "#home" : "/"}
          aria-label={onHome ? "Moheb Saeed — back to top" : "Moheb Saeed — home"}
          className="rounded-input"
        >
          {/* ~100px wide, clearing the manual's 96px floor for the full lockup. */}
          <MSLogo size={32} />
        </a>

        <ul className="flex items-center gap-1 sm:gap-2">
          {SECTIONS.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={onHome ? `#${s.id}` : `/#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-input px-3 py-2 text-small font-semibold transition-colors duration-200 ${
                    isActive ? "text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  {s.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3 -bottom-0.5 h-px origin-center bg-accent transition-opacity duration-300 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
