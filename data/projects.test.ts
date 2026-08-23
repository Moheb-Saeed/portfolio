import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { projects, CATEGORY_ORDER } from "./projects";
import { SCREENSHOT_KEY, wellAspect, type Device } from "@/lib/device-frames";

/** Width/height from a WebP header — enough to check shape without a decoder. */
function webpSize(file: string): { width: number; height: number } {
  const b = readFileSync(file);
  const format = b.toString("ascii", 12, 16);
  if (format === "VP8 ")
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  if (format === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  if (format === "VP8X")
    return { width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
  throw new Error(`${file}: unrecognised WebP chunk ${format}`);
}

describe("projects data integrity", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("assigns every project a category from CATEGORY_ORDER", () => {
    for (const p of projects) {
      expect(CATEGORY_ORDER).toContain(p.category);
    }
  });

  it("leaves no CATEGORY_ORDER entry empty", () => {
    for (const category of CATEGORY_ORDER) {
      expect(projects.some((p) => p.category === category)).toBe(true);
    }
  });

  it("fills the required text fields", () => {
    for (const p of projects) {
      expect(p.title.trim()).not.toBe("");
      expect(p.role.trim()).not.toBe("");
      expect(p.description.trim()).not.toBe("");
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("uses absolute https live URLs", () => {
    for (const p of projects) {
      expect(p.liveUrl).toMatch(/^https:\/\//);
    }
  });

  it("derives screenshot paths from the slug", () => {
    for (const p of projects) {
      expect(p.screens.desktop).toBe(`/screens/${p.slug}-desktop.webp`);
      expect(p.screens.tablet).toBe(`/screens/${p.slug}-tablet.webp`);
      expect(p.screens.mobile).toBe(`/screens/${p.slug}-mobile.webp`);
    }
  });

  it("uses a hex color for each screenBg", () => {
    for (const p of projects) {
      expect(p.screenBg).toMatch(/^#[0-9a-fA-F]{3,8}$/);
    }
  });
});

describe("project screenshots", () => {
  // Every project renders from screenshots now — there is no live-embed path
  // left to cover for a missing file, so an absent one is a broken image.
  it("ships all three screenshots for every project", () => {
    for (const p of projects) {
      for (const src of Object.values(p.screens)) {
        expect(existsSync(`public${src}`), `missing public${src}`).toBe(true);
      }
    }
  });

  // DeviceScreen fits these with `object-cover`, so anything off-aspect is
  // silently cropped. The tolerance is loose because three captures predate the
  // well-exact sizing; it still catches a transposed or wrongly-sized file.
  it("shapes each screenshot to its device's screen well", () => {
    for (const p of projects) {
      for (const device of Object.keys(SCREENSHOT_KEY) as Device[]) {
        const src = p.screens[SCREENSHOT_KEY[device]];
        const { width, height } = webpSize(`public${src}`);
        const drift = Math.abs(width / height / wellAspect(device) - 1);
        expect(drift, `${src} is ${(drift * 100).toFixed(1)}% off the well aspect`)
          .toBeLessThan(0.12);
      }
    }
  });
});
