import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { NavBar } from "@/components/ui/NavBar";
import { Background } from "@/components/ui/Background";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Loader } from "@/components/ui/Loader";
import { site } from "@/lib/site";

// 08 · Typography. Three families, three jobs — display/logo, text, detail.
//
// Self-hosted from `app/fonts` rather than fetched from Google: the static cuts
// of these families 404'd intermittently on gstatic mid-build, and self-hosting
// removes the third-party origin from the critical path entirely.
//
// Only the weights the type scale actually calls for are declared. The
// directory holds more faces than this (italics, extra weights) — none are
// referenced, so none are bundled or served.

/** Display and the `< MS />` signature. 500 for brackets, 700 for initials. */
const spaceGrotesk = localFont({
  variable: "--font-space-grotesk",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  src: [
    { path: "./fonts/SpaceGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/SpaceGrotesk-Bold.woff2", weight: "700", style: "normal" },
  ],
});

/** Headings, UI labels and body copy across every surface. */
const archivo = localFont({
  variable: "--font-archivo",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  src: [
    { path: "./fonts/Archivo-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Archivo-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Archivo-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Archivo-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
});

/** Eyebrows, code, metadata, numbers. 500 is the eyebrow weight. */
const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  display: "swap",
  fallback: ["ui-monospace", "monospace"],
  src: [
    { path: "./fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-Medium.woff2", weight: "500", style: "normal" },
  ],
});

const description =
  "Moheb Saeed is a software engineer in Cairo specializing in Next.js, React.js & Node.js — building fast, accessible, bilingual full-stack web apps.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // Homepage keeps the role plus the two headline technologies for search;
    // the template covers any future sub-pages.
    default: `${site.name} — ${site.role} | Next.js & React.js`,
    template: `%s — ${site.name}`,
  },
  description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.role}`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.role}`,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/** Browser chrome matches the ground in each mode — Deep Ink / Paper. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a1628" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

/** Schema.org Person — helps search engines associate the site with Moheb. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  jobTitle: site.role,
  description,
  email: `mailto:${site.email}`,
  worksFor: { "@type": "Organization", name: "Webics Agency" },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Modern Academy for Engineering and Technology",
    },
    {
      "@type": "EducationalOrganization",
      name: "Information Technology Institute (ITI)",
      description: "Intensive Code Camp (ICC) — MEARN stack, 2025",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cairo",
    addressCountry: "EG",
  },
  sameAs: [site.github, site.linkedin],
  knowsAbout: [
    "Next.js",
    "React.js",
    "TypeScript",
    "Node.js",
    "Tailwind CSS",
    "Full-stack web development",
    "GraphQL",
    "PostgreSQL",
    "Docker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${archivo.variable} ${jetbrainsMono.variable} h-full`}
    >
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          // Static, developer-authored object — no user input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only rounded-input bg-accent-solid px-4 py-2 text-small font-semibold text-on-accent focus:not-sr-only focus:absolute focus:left-5 focus:top-5 focus:z-[60]"
        >
          Skip to content
        </a>
        <Loader />
        <Background />
        <SmoothScroll />
        <NavBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
