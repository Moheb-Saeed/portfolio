import { MSLogo } from "@/components/ui/MSLogo";
import { site } from "@/lib/site";

/**
 * 01 · Brand story — every shipped product carries one line, and this site is a
 * shipped product, so it carries it too. The manual words that line "Developed
 * by MS"; Moheb asked for a copyright notice instead, so the mark sits inside
 * one. A hairline and that one line; nothing else belongs down here.
 */
export function Footer() {
  // Resolved when the page is prerendered, so a redeploy rolls the year over on
  // its own instead of going stale every January. The page is fully static with
  // no client component below it, so there's nothing to hydrate against.
  const year = new Date().getFullYear();

  return (
    <footer className="px-5 pb-12 lg:px-16 lg:pb-24">
      <div className="mx-auto w-full max-w-page border-t border-line pt-8">
        {/* Typography sits on the <p>: `.ms-mark` pins its own family, size and
            colours, so the mark ignores all three and keeps its lockup.
            text-small, not the eyebrow the old "Developed by" used — that 12px
            and 0.14em tracking is sized for a run of uppercase words. Wraps on
            narrow phones rather than pushing the line out of the container. */}
        <p className="flex flex-wrap items-center gap-2 font-mono text-small text-muted">
          <span>&copy; {year}</span>
          <MSLogo size={18} title={site.name} />
          <span>All rights reserved.</span>
        </p>
      </div>
    </footer>
  );
}
