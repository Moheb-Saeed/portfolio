import { MSLogo } from "@/components/ui/MSLogo";
import { BrandRule, Eyebrow } from "@/components/ui/Section";
import { btnPrimary, btnSecondary } from "@/components/ui/button";
import { site } from "@/lib/site";

/**
 * The cover, translated to a page: mark, signature rule, name, role line — the
 * same order the brand manual's own cover uses. The bracket lattice behind it
 * comes from ui/Background.tsx.
 */
export function Hero() {
  return (
    <section
      id="home"
      // `svh`, not `vh`: the small viewport is the stable one, so the fold
      // doesn't jump as mobile browser chrome hides on scroll.
      className="flex min-h-svh flex-col justify-center px-5 pb-12 pt-24 lg:px-16 lg:pb-24"
    >
      {/* No Reveal here on purpose: the hero is above the fold, so a whileInView
          reveal would fire instantly anyway while shipping the LCP element as
          opacity:0 until hydration. It paints from the server HTML instead. */}
      <div className="mx-auto w-full max-w-page">
        <MSLogo size="clamp(2.5rem, 7vw, 4rem)" />

        <BrandRule className="mt-8" />

        <h1 className="mt-6 font-display text-display text-balance">
          {site.name}
        </h1>

        <Eyebrow className="mt-4">
          {site.role} · {site.location}
        </Eyebrow>

        <p className="mt-6 max-w-xl text-body text-muted text-pretty">
          An engineer who ships the whole thing — architecture, interface and
          deployment. Next.js, React and Node.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <a href="#work" className={btnPrimary}>
            View work
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className={btnSecondary}
          >
            GitHub
          </a>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={btnSecondary}
          >
            LinkedIn
          </a>
          <a href={site.cv} download className={btnSecondary}>
            Download CV
          </a>
        </div>
      </div>
    </section>
  );
}
