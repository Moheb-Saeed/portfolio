import type { NextConfig } from "next";
import { site } from "./lib/site";

// Sent on every response. X-Frame-Options / frame-ancestors control who may
// frame THIS site (clickjacking).
const securityHeaders = [
  // Don't let browsers MIME-sniff responses into a different content type.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Refuse to be framed anywhere (clickjacking). frame-ancestors is the modern
  // equivalent; both are sent for older-browser coverage.
  { key: "X-Frame-Options", value: "DENY" },
  // Deliberately not a full CSP: Next inlines its bootstrap and flight data, so
  // a script-src would need a per-request nonce threaded through middleware.
  // These four directives need no nonce and cost nothing:
  //   frame-ancestors — nobody may frame us (see X-Frame-Options above)
  //   base-uri        — an injected <base> can't repoint every relative URL
  //   form-action     — an injected <form> can't post the contact fields away
  //   object-src      — no <object>/<embed> plugin content, ever
  {
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'",
  },
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
  // Don't advertise the framework and version on every response.
  poweredByHeader: false,
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
    return [
      { source: "/:path*", headers: securityHeaders },
      // The CV is a public download but deliberately not a search result: it is
      // the one file carrying the phone number next to the name and email, and
      // an indexed PDF is what bulk harvesters scrape. Sourced from `site.cv` so
      // renaming the file can't silently drop the rule.
      //
      // Note this is a header and NOT a robots.txt Disallow, which would be
      // worse than nothing: a disallowed URL can't be crawled, so the noindex
      // would never be read, and the URL can still be indexed from a link.
      { source: site.cv, headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
