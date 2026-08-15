type MSLogoProps = {
  /**
   * Rendered type size — a number is read as px. Drives the whole lockup, gap
   * and tracking included, since both are expressed in em.
   */
  size?: number | string;
  /**
   * Initials only — the manual's compact mark. Required below 56px wide, where
   * the brackets close up and stop reading as containers.
   */
  compact?: boolean;
  className?: string;
  title?: string;
};

/**
 * The `< MS />` signature — a self-closing element containing the initials.
 *
 * Set as live text rather than SVG, deliberately: the manual pins the lockup to
 * a typeface (Space Grotesk), two weights, a tracking value and a gap measured
 * in cap heights, and text is the only way to honour all four at every size
 * while still picking up the theme's ink and accent. Geometry and colour live
 * in `.ms-mark` (globals.css).
 *
 * The mark is never given a container — no chip, no plate, no coloured tile.
 * It sits directly on the surface.
 */
export function MSLogo({
  size = 24,
  compact = false,
  className,
  title = "Moheb Saeed",
}: MSLogoProps) {
  return (
    <span
      role="img"
      aria-label={title}
      translate="no"
      className={`ms-mark ${className ?? ""}`}
      style={{ fontSize: typeof size === "number" ? `${size}px` : size }}
    >
      {!compact && <span className="ms-mark__bracket">&lt;</span>}
      <span className="ms-mark__initials">MS</span>
      {!compact && <span className="ms-mark__bracket">/&gt;</span>}
    </span>
  );
}
