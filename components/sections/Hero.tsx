import { site } from "@/lib/site";

const primaryCta =
  "rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-bright";
const secondaryCta =
  "rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-soft hover:bg-surface-2";

export function Hero() {
  return (
    <section
      id="home"
      className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 pt-16 sm:px-8"
    >
      {/* No Reveal here on purpose: the hero is above the fold, so a whileInView
          reveal would fire instantly anyway while shipping the LCP element as
          opacity:0 until hydration. It paints from the server HTML instead. */}
      <p className="font-mono text-sm text-accent-bright">
        {site.role} · {site.location}
      </p>

      <h1 className="mt-4 max-w-4xl font-display font-bold leading-[1.05] tracking-tight text-[clamp(2.25rem,5vw,4rem)]">
        {site.name}
      </h1>

      {/* TODO(Moheb): final positioning line. */}
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
        Software engineer specializing in Next.js & React.js — pixel-perfect,
        fast, bilingual-ready.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <a href="#work" className={primaryCta}>
          View Work
        </a>
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryCta}
        >
          GitHub
        </a>
        <a
          href={site.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryCta}
        >
          LinkedIn
        </a>
        <a href={site.cv} download className={secondaryCta}>
          Download CV
        </a>
      </div>
    </section>
  );
}
