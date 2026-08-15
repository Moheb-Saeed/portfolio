import type { ReactNode } from "react";

/**
 * 11 · Spacing & layout. Every page section uses this shell, so the grid is
 * identical across the site: 1280px max content width, a 20/64px page gutter
 * (mobile / desktop) and 48/96px of section padding. Content never touches the
 * gutter, which is why the padding sits on the outer element and the max width
 * on the inner one.
 */
export function Section({
  id,
  children,
  className = "",
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`px-5 py-12 lg:px-16 lg:py-24 ${className}`}>
      <div className="mx-auto w-full max-w-page">{children}</div>
    </section>
  );
}

/**
 * The section label above a heading — 12/1.4 JetBrains Mono 500, uppercase at
 * 0.14em tracking. Eyebrows are the only uppercase type in the system;
 * everything else is sentence case.
 */
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`font-mono text-eyebrow uppercase text-accent ${className}`}>
      {children}
    </p>
  );
}

/**
 * The signature gradient (Blue 700 → Blue 400) as a short vertical rule, set at
 * 180° per §09. Used the way the manual's own cover uses it: a single hairline
 * marking the start of a block.
 */
export function BrandRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`brand-rule h-[3px] w-16 rounded-full ${className}`} />
  );
}
