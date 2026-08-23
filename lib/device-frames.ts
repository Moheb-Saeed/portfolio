/**
 * Geometry of the device frame artwork, kept framework-free so the component,
 * the screenshot capture script and the tests all measure from one source.
 *
 * Frames were processed from the provided device PNGs (feathered alpha, 2x for
 * retina). The iPad source was landscape → rotated to portrait; the iPhone
 * content is inset below the measured 5.67%-deep notch so the site header clears it.
 */
export type Device = "macbook" | "ipad" | "iphone";

export type Rect = { top: number; left: number; width: number; height: number };

export type FrameSpec = {
  src: string;
  width: number;
  height: number;
  /** Full screen cutout, measured from the real PNG (% of frame). */
  hole: Rect;
  /** Where screen content sits — same as hole, except inset below the notch. */
  content: Rect;
  /** Screen corner radius as a fraction of screen width. Rounds the screen
   *  layers so their square corners can't spill past the rounded cutout. */
  screenRadius: number;
  sizes: string;
};

export const FRAMES: Record<Device, FrameSpec> = {
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

/**
 * Width ÷ height of the content well in real pixels. A screenshot cut to this
 * fills the well exactly, so DeviceScreen's `object-cover` crops nothing.
 */
export const wellAspect = (device: Device): number => {
  const f = FRAMES[device];
  return (f.width * f.content.width) / (f.height * f.content.height);
};

/** The screenshot each device's well displays, as named in public/screens. */
export const SCREENSHOT_KEY = {
  macbook: "desktop",
  ipad: "tablet",
  iphone: "mobile",
} as const satisfies Record<Device, string>;
