import { Reveal } from "@/components/ui/Reveal";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal>
        <p className="font-mono text-sm text-accent-bright">About</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          A little about me
        </h2>
      </Reveal>

      {/* Drafted from Moheb's CV — edit freely. */}
      <Reveal className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
        <p>
          I&apos;m a software engineer based in Cairo with a B.E. in Computer
          Engineering, specializing in full-stack web architecture with Next.js
          and Node.js. I care about interfaces that are fast, accessible, and
          precise — the kind where the performance budget is part of the design,
          not an afterthought.
        </p>
        <p>
          At Webics Agency I&apos;ve architected performance-focused marketing
          sites and creative portfolios, a bilingual (AR/EN) property platform on
          Payload CMS and PostgreSQL, and an AI-assisted grading system —
          consistently pushing Lighthouse scores to 100 and animations to a fluid
          60fps, with containerized Docker deployments and robust REST/GraphQL
          APIs behind them.
        </p>
      </Reveal>
    </section>
  );
}
