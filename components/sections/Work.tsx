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
        <h2 className="mt-3 text-h2 text-balance">Work</h2>
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
              {/* Set as a label rather than a smaller heading: the projects
                  under it carry the H3 size, so the group marker reads like a
                  spec-sheet section header instead of competing with them. */}
              <h3 className="font-mono text-eyebrow uppercase text-accent">
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
