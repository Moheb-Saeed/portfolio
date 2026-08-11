import { projects, CATEGORY_ORDER } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal>
        <p className="font-mono text-sm text-accent-bright">Selected work</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Work
        </h2>
      </Reveal>

      {/* No `priority` on any project: the hero is min-h-screen, so not even the
          first screenshot is in the initial viewport. Preloading one would only
          compete with the fonts and the hero's LCP paint. ProjectCard still
          accepts the prop for future above-the-fold case-study pages. */}
      <div className="mt-16 space-y-24">
        {CATEGORY_ORDER.map((category) => {
          const grouped = projects.filter(
            (p) => p.category === category && !p.draft
          );
          if (grouped.length === 0) return null;

          return (
            <div key={category}>
              <Reveal>
                <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {category}
                </h3>
              </Reveal>

              <div className="mt-12 space-y-28">
                {grouped.map((project) => (
                  <Reveal key={project.slug}>
                    <ProjectCard project={project} titleAs="h4" />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
