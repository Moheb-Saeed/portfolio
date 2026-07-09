export type Project = {
  slug: string;
  title: string;
  role: string;
  stack: string[];
  liveUrl: string;
  embeddable: boolean; // verified 2026-07-09 via X-Frame-Options / CSP frame-ancestors headers
  screens: { desktop: string; tablet: string; mobile: string }; // screenshot fallbacks
  highlight: string; // one-line metric; empty = not shown
};

const screens = (slug: string) => ({
  desktop: `/screens/${slug}-desktop.webp`,
  tablet: `/screens/${slug}-tablet.webp`,
  mobile: `/screens/${slug}-mobile.webp`,
});

// TODO(Moheb): confirm role / stack / highlight lines — placeholders where not
// specified in the brief are marked with (?).
export const projects: Project[] = [
  {
    slug: "webics",
    title: "Webics",
    role: "Design & frontend development (?)",
    stack: ["Next.js", "Tailwind CSS", "Motion"],
    liveUrl: "https://webics.agency",
    embeddable: false, // XFO: DENY + frame-ancestors 'none'
    screens: screens("webics"),
    highlight: "Lighthouse 71 → 100",
  },
  {
    slug: "seen",
    title: "Seen",
    role: "Frontend development (?)",
    stack: ["Next.js", "GSAP"],
    liveUrl: "https://seencreatives.com",
    embeddable: true,
    screens: screens("seen"),
    highlight: "60fps GSAP animations",
  },
  {
    slug: "newbeat",
    title: "NewBeat",
    role: "Frontend development (?)",
    stack: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://newbeat.agency",
    embeddable: true,
    screens: screens("newbeat"),
    highlight: "",
  },
  {
    slug: "cairaw",
    title: "Cairaw",
    role: "Frontend development (?)",
    stack: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://cairawfilms.com",
    embeddable: true,
    screens: screens("cairaw"),
    highlight: "",
  },
  {
    slug: "capital-earth",
    title: "Capital Earth",
    role: "Full-stack development (?)",
    stack: ["Next.js", "Payload CMS", "PostgreSQL"],
    liveUrl: "https://capitalearth-eg.com",
    embeddable: true,
    screens: screens("capital-earth"),
    highlight: "Bilingual AR/EN, Payload CMS + PostgreSQL",
  },
  {
    slug: "symk",
    title: "SYMK",
    role: "Shopify development (?)",
    stack: ["Shopify", "Liquid"],
    liveUrl: "https://scentsyoumayknow.com",
    embeddable: false, // Shopify: XFO: DENY + frame-ancestors 'none'
    screens: screens("symk"),
    highlight: "",
  },
  {
    slug: "lifescience",
    title: "LifeScience",
    role: "Frontend development (?)",
    stack: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://www.lifescience-eg.com",
    embeddable: false, // XFO: DENY + frame-ancestors 'none'
    screens: screens("lifescience"),
    highlight: "",
  },
  {
    slug: "ecosphere",
    title: "EcoSphere",
    role: "Personal project — full-stack",
    stack: ["Next.js", "Stripe", "Zod"],
    liveUrl: "https://eco-sphere-kappa.vercel.app",
    embeddable: true,
    screens: screens("ecosphere"),
    highlight: "Stripe webhooks, Zod validation",
  },
];
