import Image from "next/image";
import type { ReactNode } from "react";
import { FRAMES, type Device, type FrameSpec, type Rect } from "@/lib/device-frames";

// Re-exported so the frame's consumers keep importing Device from the
// component they use it with.
export type { Device };

const rectStyle = (r: Rect) => ({
  top: `${r.top}%`,
  left: `${r.left}%`,
  width: `${r.width}%`,
  height: `${r.height}%`,
});

/**
 * Corner radius for a screen layer, matching the frame's rounded cutout.
 * A single `%` radius resolves against width horizontally and height
 * vertically, which skews on a tall screen — so derive each axis from the
 * layer's real pixel size and emit an explicit `x% / y%` pair.
 *
 * `roundTop` is false for a layer inset below the notch: it starts past the
 * screen's curve, where the edges are straight, so rounding its top corners
 * would bite into visible screen and expose the backing behind it.
 */
const radiusStyle = (f: FrameSpec, r: Rect, roundTop = true) => {
  const wPx = (r.width / 100) * f.width;
  const hPx = (r.height / 100) * f.height;
  const rPx = f.screenRadius * wPx;
  const x = ((rPx / wPx) * 100).toFixed(2);
  const y = ((rPx / hPx) * 100).toFixed(2);
  return roundTop
    ? `${x}% / ${y}%`
    : `0 0 ${x}% ${x}% / 0 0 ${y}% ${y}%`;
};

type DeviceFrameProps = {
  device: Device;
  children: ReactNode;
  /** Fills the iPhone status strip above the notch so it matches the site. */
  screenBg?: string;
};

/**
 * Real device photo as the chrome. A dark backing fills the whole screen
 * cutout; the live screen sits in the content well (inset below the notch on
 * iPhone); the transparent frame PNG is overlaid on top (decorative,
 * click-through) so its bezel masks the screen's corners.
 */
export function DeviceFrame({ device, children, screenBg }: DeviceFrameProps) {
  const f = FRAMES[device];
  return (
    <div
      className="relative w-full select-none"
      style={{ aspectRatio: `${f.width} / ${f.height}` }}
    >
      <div
        className="absolute"
        style={{
          ...rectStyle(f.hole),
          backgroundColor: screenBg ?? "var(--color-surface)",
          borderRadius: radiusStyle(f, f.hole),
        }}
      />
      <div
        className="absolute overflow-hidden"
        style={{
          ...rectStyle(f.content),
          // Only round the top when content starts at the screen's top curve.
          borderRadius: radiusStyle(f, f.content, f.content.top === f.hole.top),
        }}
      >
        {children}
      </div>
      <Image
        src={f.src}
        alt=""
        aria-hidden
        fill
        sizes={f.sizes}
        className="pointer-events-none object-fill"
      />
    </div>
  );
}
