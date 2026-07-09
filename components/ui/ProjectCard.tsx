import type { Project } from "@/data/projects";
import { DeviceFrame, type Device } from "./DeviceFrame";
import { DeviceScreen } from "./DeviceScreen";

type ProjectCardProps = {
  project: Project;
  priority?: boolean; // first project only
};

const SCREENSHOT_KEY: Record<Device, keyof Project["screens"]> = {
  macbook: "desktop",
  ipad: "tablet",
  iphone: "mobile",
};

function Showcase({
  project,
  device,
  priority = false,
}: {
  project: Project;
  device: Device;
  priority?: boolean;
}) {
  return (
    // Hover micro-interaction: CSS transition only, never Motion.
    <div className="transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <DeviceFrame device={device}>
        <DeviceScreen
          device={device}
          title={project.title}
          liveUrl={project.liveUrl}
          embeddable={project.embeddable}
          screenshot={project.screens[SCREENSHOT_KEY[device]]}
          priority={priority}
        />
      </DeviceFrame>
    </div>
  );
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight">
            {project.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{project.role}</p>
        </div>
        {project.highlight && (
          <p className="font-mono text-sm text-accent-bright">{project.highlight}</p>
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>

      {/* Composed cluster: MacBook back, iPad mid, iPhone front.
          Mobile: MacBook + iPhone only. Bottom edges align. */}
      <div className="relative mt-8">
        <div className="md:w-[78%]">
          <Showcase project={project} device="macbook" priority={priority} />
        </div>
        <div className="absolute bottom-0 right-0 z-10 hidden w-[26%] md:block">
          <Showcase project={project} device="ipad" />
        </div>
        <div className="absolute bottom-0 right-0 z-20 w-[20%] md:right-[21%] md:w-[12.5%]">
          <Showcase project={project} device="iphone" />
        </div>
      </div>
    </article>
  );
}
