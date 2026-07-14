import Image from "next/image";
import type { ReactNode } from "react";

export type Device = "macbook" | "ipad" | "iphone";

type FrameSpec = {
  src: string;
  width: number;
  height: number;
  /** Screen cutout as % of the frame image, measured from the real PNG. */
  screen: { top: number; left: number; width: number; height: number };
  sizes: string;
};

// Insets measured from the provided device PNGs (public/frames/*). The iPad
// source was landscape and is rotated to portrait; values are post-rotation.
const FRAMES: Record<Device, FrameSpec> = {
  macbook: {
    src: "/frames/macbook.png",
    width: 537,
    height: 327,
    screen: { top: 2.45, left: 9.31, width: 81.38, height: 86.24 },
    sizes: "(min-width: 1152px) 700px, 78vw",
  },
  ipad: {
    src: "/frames/ipad.png",
    width: 696,
    height: 965,
    screen: { top: 3.83, left: 4.74, width: 89.94, height: 92.85 },
    sizes: "(min-width: 1152px) 230px, 26vw",
  },
  iphone: {
    src: "/frames/iphone.png",
    width: 451,
    height: 931,
    screen: { top: 1.61, left: 4.21, width: 91.8, height: 96.67 },
    sizes: "(min-width: 1152px) 120px, 20vw",
  },
};

type DeviceFrameProps = {
  device: Device;
  children: ReactNode;
};

/**
 * Real device photo as the chrome. The live screen sits in a "well" positioned
 * at the frame's measured screen cutout; the transparent frame PNG is overlaid
 * on top (decorative, click-through) so its bezel masks the screen's corners.
 */
export function DeviceFrame({ device, children }: DeviceFrameProps) {
  const f = FRAMES[device];
  return (
    <div
      className="relative w-full select-none"
      style={{ aspectRatio: `${f.width} / ${f.height}` }}
    >
      <div
        className="absolute overflow-hidden"
        style={{
          top: `${f.screen.top}%`,
          left: `${f.screen.left}%`,
          width: `${f.screen.width}%`,
          height: `${f.screen.height}%`,
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
