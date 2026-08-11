import type { NextConfig } from "next";

// Sent on every response. These harden the site without touching the
// device-preview iframes — X-Frame-Options / frame-ancestors control who may
// frame THIS site (clickjacking), not the third-party sites it embeds.
const securityHeaders = [
  // Don't let browsers MIME-sniff responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Refuse to be framed anywhere (clickjacking). frame-ancestors is the modern
  // equivalent; both are sent for older-browser coverage.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Send only the origin on cross-site navigations; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for two years (browsers ignore this over plain http/localhost).
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // The site needs none of these powerful features — deny them outright.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Serve AVIF first (smaller than WebP), fall back to WebP. Applies to the
    // device frames and the project screenshots alike.
    formats: ["image/avif", "image/webp"],
    // 65 for the screenshots (they render small inside the frames); 75 stays the
    // default for the crisp frame bezels.
    qualities: [65, 75],
    // Screenshots + frames don't change, so let the CDN hold optimized variants.
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
