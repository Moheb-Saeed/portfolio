import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Section } from "@/components/ui/Section";

/** 01 · Brand story — the four attributes the identity is built around. */
const ATTRIBUTES = ["Precise", "Fast", "Bilingual", "Unfussy"];

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <Eyebrow>About</Eyebrow>
        <h2 className="mt-3 text-h2 text-balance">A little about me</h2>
      </Reveal>

      {/* Drafted from Moheb's CV — edit freely. */}
      <Reveal className="mt-8 max-w-2xl space-y-6 text-body text-muted text-pretty">
        <p>
          I&apos;m a software engineer based in Cairo with a B.E. in Computer
          Engineering, specializing in full-stack web architecture with Next.js
          and Node.js. I care about interfaces that are fast, accessible, and
          precise — the kind where the performance budget is part of the design,
          not an afterthought.
        </p>
        <p>
          I took the Intensive Code Camp at ITI — six months on the MEARN stack
          in Giza, working across React, Angular and Next.js. Modular component
          systems built straight from Figma, REST and GraphQL APIs on Node and
          Express, and the habit of shipping in Agile teams with peer code
          review.
        </p>
        <p>
          Since then, at Webics Agency, I&apos;ve architected performance-focused
          marketing sites and creative portfolios, a bilingual (AR/EN) property
          platform on Payload CMS and PostgreSQL, and an AI-assisted grading
          system — consistently pushing Lighthouse scores to 100 and animations
          to a fluid 60fps, with containerized Docker deployments and robust
          REST/GraphQL APIs behind them.
        </p>
      </Reveal>

      <Reveal>
        <ul className="mt-8 flex flex-wrap gap-3">
          {ATTRIBUTES.map((attribute) => (
            <li
              key={attribute}
              className="rounded-full border border-accent/40 bg-accent-quiet px-3 py-2 font-mono text-eyebrow uppercase text-accent"
            >
              {attribute}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
