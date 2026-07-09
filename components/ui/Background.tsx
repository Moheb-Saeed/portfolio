/**
 * Fixed, decorative background layer: two slow-drifting accent blobs behind a
 * fine noise texture. Zero JS — the drift is CSS keyframes on `transform` only,
 * and it stops entirely under prefers-reduced-motion (see globals.css).
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden"
    >
      <div className="bg-blob bg-blob-a absolute -left-[15%] -top-[10%] size-[70vmax] rounded-full opacity-40 blur-3xl" />
      <div className="bg-blob bg-blob-b absolute -bottom-[20%] -right-[15%] size-[60vmax] rounded-full opacity-30 blur-3xl" />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
