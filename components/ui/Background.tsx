/**
 * The hero cover texture: the mark's brackets, tiled.
 *
 * One texture per surface and never two at once (§13), so this is the only
 * pattern on the page — it belongs to the cover, fades out before the hero's
 * body copy, and scrolls away rather than following the viewport, leaving Work,
 * About and Contact on plain ground.
 *
 * Zero JS and nothing animated. The manual's "don't" list is explicit about
 * glow, multi-hue gradients and noise, so there is no drift, no blur and no
 * grain here — the texture is flat and sits at 5% contrast against the ground,
 * inside the 4–8% band.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-screen overflow-hidden text-ink"
      // Fades the lattice out well above the hero paragraph: a pattern belongs
      // behind headers and covers, never under body text.
      style={{
        maskImage: "linear-gradient(to bottom, black 0%, transparent 68%)",
      }}
    >
      <div className="pattern-lattice texture absolute inset-0" />
    </div>
  );
}
