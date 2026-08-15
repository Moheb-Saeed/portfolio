import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand values as literal sRGB — satori can't read the CSS tokens, which is the
// documented exception to "colours via tokens only".
const BLUE_700 = "#1d4ed8";
const INK = "#0a1628";
const PAPER = "#ffffff";
const NEUTRAL_300 = "#cbd5e1"; // stays ≥4.5:1 across the whole gradient
const HAIRLINE = "rgba(255,255,255,0.24)";

/**
 * A cover, so it gets the deep field (Blue 700 → Ink at 145°) — one of the two
 * places the manual allows blue to take a whole surface.
 *
 * On a brand-blue field the mark is the knockout lockup: all white, brackets
 * included. Blue-on-blue is explicitly a "don't" (§14), so the brackets do not
 * keep their accent colour here.
 *
 * Note: satori has no access to the page's webfonts, so the type falls back to
 * its default sans rather than Space Grotesk / Archivo. The composition, colour
 * and proportions are the brand's; the letterforms are approximate.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          backgroundImage: `linear-gradient(145deg, ${BLUE_700} 0%, ${INK} 100%)`,
          padding: 96,
          color: PAPER,
        }}
      >
        {/* Knockout `< MS />` — set directly on the field, never in a container. */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            fontSize: 64,
            letterSpacing: -3,
            color: PAPER,
          }}
        >
          <div style={{ display: "flex", fontWeight: 500 }}>&lt;</div>
          <div style={{ display: "flex", fontWeight: 700 }}>MS</div>
          <div style={{ display: "flex", fontWeight: 500 }}>/&gt;</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Signature gradient rule, flattened to the field's own light end. */}
          <div
            style={{
              display: "flex",
              width: 64,
              height: 3,
              borderRadius: 999,
              background: "#60a5fa",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: -3,
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 16,
              fontSize: 30,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: NEUTRAL_300,
            }}
          >
            {site.role} · {site.location}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: 32,
          }}
        >
          {["Next.js", "TypeScript", "Node.js", "Tailwind CSS"].map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 999,
                padding: "8px 20px",
                fontSize: 22,
                color: NEUTRAL_300,
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
