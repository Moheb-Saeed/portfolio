import { projects, CATEGORY_ORDER } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Section } from "@/components/ui/Section";

export function Work() {
  const categories = CATEGORY_ORDER.map((category) => ({
    category,
    grouped: projects.filter((p) => p.category === category && !p.draft),
  })).filter(({ grouped }) => grouped.length > 0);

  return (
    <Section id="work">
      <Reveal>
        <Eyebrow>Selected work</Eyebrow>
        <h2 className="mt-3 text-h1 text-balance">Work</h2>
      </Reveal>

      {/* No `priority` on any project: the hero is min-h-svh, so not even the
          first screenshot is in the initial viewport. Preloading one would only
          compete with the fonts and the hero's LCP paint. ProjectCard still
          accepts the prop for future above-the-fold case-study pages. */}
      <div className="mt-16">
        {categories.map(({ category, grouped }, i) => (
          // A hairline, not a bigger gap, carries the break between categories —
          // the gap stays on the 4px scale and the rule does the hierarchy.
          <div
            key={category}
            className={i > 0 ? "mt-16 border-t border-line pt-16" : undefined}
          >
            <Reveal>
              {/* Sized at the H2 step so the group reads as a real header, one
                  rung under the section's H1 and one above the projects' H3.
                  It keeps the mono/uppercase spec-sheet voice; the tracking is
                  set by hand because the eyebrow's 0.14em is tuned for 12px and
                  looks blown apart at 28, while the H2 step's own -0.01em is a
                  lowercase value that cramps caps. */}
              <h3 className="font-mono text-h2 uppercase tracking-[0.06em] text-accent">
                {category}
              </h3>
            </Reveal>

            <div className="mt-12 space-y-24">
              {grouped.map((project) => (
                <Reveal key={project.slug}>
                  <ProjectCard project={project} titleAs="h4" />
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
