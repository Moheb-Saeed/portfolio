import Image from "next/image";
import type { ReactNode } from "react";

export type Device = "macbook" | "ipad" | "iphone";

type Rect = { top: number; left: number; width: number; height: number };
type FrameSpec = {
  src: string;
  width: number;
  height: number;
  /** Full screen cutout, measured from the real PNG (% of frame). */
  hole: Rect;
  /** Where live content sits — same as hole, except inset below the notch. */
  content: Rect;
  /** Screen corner radius as a fraction of screen width. Rounds the screen
   *  layers so their square corners can't spill past the rounded cutout. */
  screenRadius: number;
  sizes: string;
};

// Frames processed from the provided device PNGs (feathered alpha, 2× for
// retina). The iPad source was landscape → rotated to portrait; the iPhone
// content is inset below the measured 5.67%-deep notch so the site header clears it.
const FRAMES: Record<Device, FrameSpec> = {
  macbook: {
    src: "/frames/macbook-frame.png",
    width: 1391,
    height: 848,
    hole: { top: 1.84, left: 8.97, width: 82.06, height: 87.12 },
    // Content sits below the camera notch (which reaches 4.36% and spans 40% of
    // the width, so it clashes with centred site logos); the strip above is
    // filled with the site's own bg colour, reading like the macOS menu bar.
    content: { top: 6.0, left: 8.97, width: 82.06, height: 82.96 },
    screenRadius: 0.008, // MacBook display corners are nearly square
    sizes: "(min-width: 1152px) 700px, 78vw",
  },
  ipad: {
    src: "/frames/ipad.png",
    width: 1392,
    height: 1930,
    hole: { top: 3.83, left: 4.74, width: 89.94, height: 92.85 },
    content: { top: 3.83, left: 4.74, width: 89.94, height: 92.85 },
    screenRadius: 0.022, // iPad: ~18pt on an 820pt-wide screen
    sizes: "(min-width: 1152px) 230px, 26vw",
  },
  iphone: {
    src: "/frames/iphone.png",
    width: 902,
    height: 1862,
    hole: { top: 1.61, left: 4.21, width: 91.8, height: 96.67 },
    // Content sits below the notch (+~2.5% clearance) so the site header clears
    // the Dynamic Island; the strip above is filled with the site's own bg color.
    content: { top: 9.6, left: 4.21, width: 91.8, height: 88.68 },
    screenRadius: 0.14, // iPhone: ~55pt on a 393pt-wide screen
    sizes: "(min-width: 1152px) 120px, 20vw",
  },
};

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
          backgroundColor: screenBg ?? "var(--color-bg)",
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
