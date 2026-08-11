import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Design tokens resolved to sRGB — satori has no oklch support.
const BG = "#181c25";
const SURFACE = "#22262f";
const BORDER = "#3a4150";
const INK = "#eef0f4";
const MUTED = "#9aa3b5";
const LOGO = "#003371"; // oklch(33% 0.12 255) — deep-blue logo chip

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
          background: BG,
          padding: 80,
          // Mirrors the site's drifting accent blob, flattened to a static wash.
          backgroundImage: `radial-gradient(circle at 85% 15%, ${SURFACE} 0%, ${BG} 55%)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 96,
              height: 96,
              borderRadius: 24,
              background: LOGO,
              color: "#ffffff",
              fontSize: 46,
              fontWeight: 700,
              letterSpacing: -2,
            }}
          >
            MS
          </div>
          <div style={{ display: "flex", fontSize: 26, color: MUTED }}>
            {site.location}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              color: INK,
              letterSpacing: -3,
            }}
          >
            {site.name}
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 34, color: MUTED }}>
            Software engineer specializing in Next.js & React.js
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 28,
          }}
        >
          {["Next.js", "TypeScript", "Node.js", "Tailwind CSS"].map((tech) => (
            <div
              key={tech}
              style={{
                display: "flex",
                border: `1px solid ${BORDER}`,
                borderRadius: 999,
                padding: "8px 18px",
                fontSize: 22,
                color: MUTED,
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
