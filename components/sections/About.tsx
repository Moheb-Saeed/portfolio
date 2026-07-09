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

      {/* TODO(Moheb): replace with your own copy. */}
      <Reveal className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-muted">
        <p>
          I&apos;m a frontend and full-stack engineer based in Cairo, working
          mostly with Next.js and Node.js. I care about interfaces that are fast,
          accessible, and precise — the kind where the performance budget is part
          of the design, not an afterthought.
        </p>
        <p>
          Recently I&apos;ve been building bilingual (AR/EN) marketing sites and
          commerce experiences, taking them from design through to CMS
          integration and deployment.
        </p>
      </Reveal>
    </section>
  );
}
