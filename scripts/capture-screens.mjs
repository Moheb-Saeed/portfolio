// Regenerates public/screens/*.webp — the project previews inside the device
// frames. Run with `pnpm screens`, or `pnpm screens seen newbeat` for a subset.
//
// Each site is rendered at the exact viewport its device frame represents, then
// clipped to the slice the frame's screen well actually reveals. That keeps the
// screenshot's aspect identical to the well, so `object-cover` in DeviceScreen
// fits it with no crop, and matches what the old live iframes displayed.
//
// Encoding goes through Chromium's own WebP codec via a canvas, so this needs
// no sharp / ImageMagick / ffmpeg installed.
import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { projects } from "../data/projects.ts";
import { SCREENSHOT_KEY, wellAspect } from "../lib/device-frames.ts";

// Viewport each frame stands in for, and how far past 1x to render. The scale
// clears 2x of the CSS width each screenshot occupies (819 / 299 / 147px) while
// keeping the files small.
const VIEWPORTS = {
  macbook: { width: 1440, height: 932, scale: 1 },
  ipad: { width: 820, height: 1174, scale: 1.5 },
  iphone: { width: 390, height: 848, scale: 2 },
};

const IPHONE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

const only = process.argv.slice(2);
const targets = only.length
  ? projects.filter((p) => only.includes(p.slug))
  : projects;

if (!targets.length) {
  console.error(`No project matched: ${only.join(", ")}`);
  process.exit(1);
}

const browser = await chromium.launch();

// A single blank page re-encodes every PNG to WebP in-browser.
const encoder = await (await browser.newContext()).newPage();
await encoder.goto("about:blank");
const toWebp = (png, quality = 0.85) =>
  encoder.evaluate(
    ([b64, q]) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement("canvas");
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          c.getContext("2d").drawImage(img, 0, 0);
          const url = c.toDataURL("image/webp", q);
          if (!url.startsWith("data:image/webp"))
            return reject(new Error("Chromium produced no WebP"));
          resolve(url.slice(url.indexOf(",") + 1));
        };
        img.onerror = () => reject(new Error("PNG decode failed"));
        img.src = "data:image/png;base64," + b64;
      }),
    [png.toString("base64"), quality]
  );

let failed = 0;
for (const project of targets) {
  for (const device of ["macbook", "ipad", "iphone"]) {
    const name = SCREENSHOT_KEY[device];
    const { width, height, scale } = VIEWPORTS[device];
    // Clip to exactly what the frame's well reveals, so object-cover crops nothing.
    const clipHeight = Math.round(width / wellAspect(device));
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: scale,
      isMobile: device === "iphone",
      hasTouch: device !== "macbook",
      ...(device === "iphone" ? { userAgent: IPHONE_UA } : {}),
    });
    const page = await context.newPage();
    const out = `public/screens/${project.slug}-${name}.webp`;
    try {
      await page.goto(project.liveUrl, { waitUntil: "load", timeout: 60000 });
      // Intro loaders and GSAP/Motion hero entrances need to settle first.
      await page.waitForTimeout(7000);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
      const png = await page.screenshot({
        clip: { x: 0, y: 0, width, height: clipHeight },
      });
      const buf = Buffer.from(await toWebp(png), "base64");
      writeFileSync(out, buf);
      const dims = `${Math.round(width * scale)}x${Math.round(clipHeight * scale)}`;
      console.log(`  ${out.padEnd(42)} ${dims.padEnd(11)} ${(buf.length / 1024).toFixed(0)}KB`);
    } catch (error) {
      failed++;
      console.error(`  FAIL ${out}: ${error.message.split("\n")[0]}`);
    }
    await context.close();
  }
}

await browser.close();
// Sampled screenBg drifts when a site is restyled; the strip above the notch
// shows it, so flag the recapture rather than let it go unnoticed.
console.log(
  "\nRecheck each project's screenBg in data/projects.ts against the new top edge."
);
process.exit(failed ? 1 : 0);
