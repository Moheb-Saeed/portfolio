import type { Project } from "@/data/projects";
import { DeviceFrame, type Device } from "./DeviceFrame";
import { DeviceScreen } from "./DeviceScreen";
import { ClusterReveal } from "./ClusterReveal";

type ProjectCardProps = {
  project: Project;
  priority?: boolean; // first project only
  titleAs?: "h3" | "h4"; // h4 when nested under a category heading
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
      {/* screenBg fills the strip above the notch on the MacBook and iPhone.
          The iPad has no notch, so its content covers the backing entirely. */}
      <DeviceFrame device={device} screenBg={project.screenBg}>
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

export function ProjectCard({
  project,
  priority = false,
  titleAs: Title = "h3",
}: ProjectCardProps) {
  return (
    <article>
      <Title className="font-display text-2xl font-semibold tracking-tight">
        {project.title}
      </Title>
      <p className="mt-1 text-sm text-muted">{project.role}</p>
      {project.description && (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
          {project.description}
        </p>
      )}

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
          Mobile: MacBook + iPhone only. Bottom edges align.
          On scroll-in the MacBook slides from the left edge and the iPad +
          iPhone from the right edge (device-slide, see globals.css). */}
      <ClusterReveal className="relative mt-8">
        <div className="device-from-left md:w-[78%]">
          <Showcase project={project} device="macbook" priority={priority} />
        </div>
        <div className="device-from-right device-delay-1 absolute bottom-0 right-0 z-10 hidden w-[26%] md:block">
          <Showcase project={project} device="ipad" />
        </div>
        <div className="device-from-right device-delay-2 absolute bottom-0 right-0 z-20 w-[20%] md:right-[21%] md:w-[12.5%]">
          <Showcase project={project} device="iphone" />
        </div>
      </ClusterReveal>
    </article>
  );
}
