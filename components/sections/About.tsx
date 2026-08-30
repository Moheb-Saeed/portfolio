import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <Eyebrow>About</Eyebrow>
        <h2 className="mt-3 text-h1 text-balance">A little about me</h2>
      </Reveal>

      {/* Drafted from Moheb's CV — edit freely. */}
      {/* Same `max-w-xl` as the hero's and contact's copy, so the three text
          columns share a right edge and the whitespace beside them reads as one
          deliberate column rather than a wandering rag. It also puts the measure
          at ~75 characters; at 2xl this ran to 87, past the comfortable band. */}
      <Reveal className="mt-8 max-w-xl space-y-6 text-body text-muted text-pretty">
        <p>
          I&apos;m a software engineer based in Cairo, working in Arabic and
          English, with a B.E. in Computer Engineering and a specialization in
          full-stack web architecture with Next.js and Node.js. I care about
          interfaces that are fast, accessible, and precise — the kind where the
          performance budget is part of the design, not an afterthought.
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

      {/* The manual's §01 attributes (Precise / Fast / Bilingual / Unfussy) used
          to close this section as four capsules. They are an internal north star
          rather than page copy: Work sits above this section, so the projects
          have already demonstrated them, and "fast" and "precise" repeated the
          first paragraph word for word. "Bilingual" was the one fact among the
          four and moved into the opening sentence. */}
    </Section>
  );
}
