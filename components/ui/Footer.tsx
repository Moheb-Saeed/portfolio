import { MSLogo } from "@/components/ui/MSLogo";
import { site } from "@/lib/site";

/**
 * 01 · Brand story — "Every shipped product carries one line: Developed by MS."
 * This site is a shipped product, so it carries it too. A hairline and two
 * pieces of metadata; nothing else belongs down here.
 */
export function Footer() {
  const domain = site.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <footer className="px-5 pb-12 lg:px-16 lg:pb-24">
      <div className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
        <p className="flex items-center gap-3">
          <span className="font-mono text-eyebrow uppercase text-muted">
            Developed by
          </span>
          <MSLogo size={18} title={`${site.name} — developed by`} />
        </p>

        <a
          href={site.url}
          className="font-mono text-small text-muted transition-colors duration-200 hover:text-accent"
        >
          {domain}
        </a>
      </div>
    </footer>
  );
}
