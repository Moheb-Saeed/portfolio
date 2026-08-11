import type { Metadata } from "next";
import { Space_Grotesk, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { NavBar } from "@/components/ui/NavBar";
import { Background } from "@/components/ui/Background";
import { site } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Modern Academy for Engineering and Technology",
  },
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${geistMono.variable} h-full`}
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
        <Background />
        <NavBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
