// Grouping shown on the Work section. CATEGORY_ORDER (below) fixes the section
// order; within a section, projects render in array order.
export type Category = "Webics Agency" | "Freelance work" | "Projects";

export const CATEGORY_ORDER: Category[] = [
  "Webics Agency",
  "Freelance work",
  "Projects",
];

export type Project = {
  slug: string;
  title: string;
  category: Category;
  role: string;
  stack: string[];
  liveUrl: string;
  screens: { desktop: string; tablet: string; mobile: string };
  description: string; // what it is / the nature of the business; shown under the card
  draft?: boolean; // true = hidden from the site until the project goes live
  // Fills the MacBook/iPhone status strip above the notch so it reads
  // seamlessly with the screen, and backs the well while the screenshot lazy-
  // loads. Sampled from the top edge of the project's own screenshot — keep it
  // in step whenever the screenshots are recaptured.
  screenBg: string;
};

// Every project ships all three; capture them with `pnpm screens`
// (scripts/capture-screens.mjs), which renders each site at the exact
// viewport its device frame expects.
const screens = (slug: string) => ({
  desktop: `/screens/${slug}-desktop.webp`,
  tablet: `/screens/${slug}-tablet.webp`,
  mobile: `/screens/${slug}-mobile.webp`,
});

// Roles / stacks sourced from Moheb's CV; descriptions from each site's about
// page (Webics Agency, 2026).
export const projects: Project[] = [
  {
    slug: "webics",
    title: "Webics",
    category: "Webics Agency",
    role: "Architecture & frontend",
    stack: ["Next.js", "Tailwind CSS", "Motion", "Docker"],
    liveUrl: "https://webics.agency",
    screens: screens("webics"),
    description:
      "A digital solutions agency building modern, responsive websites alongside custom software, e-commerce platforms, and UI/UX design for growing businesses.",
    screenBg: "#030919",
  },
  {
    slug: "seen",
    title: "Seen",
    category: "Webics Agency",
    role: "Frontend development",
    stack: ["Next.js", "GSAP", "Motion"],
    liveUrl: "https://seencreatives.com",
    screens: screens("seen"),
    description:
      "A creative agency shaping brand identities and visual storytelling through design-led campaigns.",
    screenBg: "#070707",
  },
  {
    slug: "newbeat",
    title: "NewBeat",
    category: "Webics Agency",
    role: "Frontend development",
    stack: ["Next.js", "Motion"],
    liveUrl: "https://newbeat.agency",
    screens: screens("newbeat"),
    description:
      "A creative advertising agency delivering end-to-end audio and video production for brands across Egypt and the Middle East.",
    screenBg: "#000000",
  },
  {
    slug: "capital-earth",
    title: "Capital Earth",
    category: "Webics Agency",
    role: "Full-stack development",
    stack: ["Next.js", "Payload CMS", "PostgreSQL", "Docker"],
    liveUrl: "https://capitalearth-eg.com",
    screens: screens("capital-earth"),
    description:
      "A bilingual (AR/EN) real-estate platform that helps buyers find properties and finance them through flexible payment plans and consultation.",
    screenBg: "#fefffb",
  },
  {
    slug: "cairaw",
    title: "Cairaw",
    category: "Webics Agency",
    role: "Frontend development",
    stack: ["Next.js", "Motion"],
    liveUrl: "https://cairawfilms.com",
    screens: screens("cairaw"),
    description:
      "A full-service media production house crafting brand stories through cinematography, video, photography, and audio.",
    screenBg: "#000000",
    draft: true, // TODO(Moheb): remove once cairawfilms.com is live
  },
  {
    slug: "symk",
    title: "SYMK",
    category: "Webics Agency",
    role: "Shopify storefront development",
    stack: ["Shopify", "Liquid"],
    liveUrl: "https://scentsyoumayknow.com",
    screens: screens("symk"),
    description:
      "A fragrance house creating modern, unisex perfumes inspired by emotion, elegance, and timeless individuality.",
    screenBg: "#9d9394",
  },
  {
    slug: "lifescience",
    title: "LifeScience",
    category: "Freelance work",
    role: "Full-stack developer (freelance)",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    liveUrl: "https://www.lifescience-eg.com",
    screens: screens("lifescience"),
    description:
      "Calibration, maintenance, and technical support for HPLC and GC laboratory systems, plus qualification, spare parts, and training.",
    screenBg: "#dbe1e4",
  },
  {
    slug: "ecosphere",
    title: "EcoSphere",
    category: "Projects",
    role: "Personal project — frontend",
    stack: ["Next.js", "MongoDB", "Stripe", "Zod"],
    liveUrl: "https://eco-sphere-kappa.vercel.app",
    screens: screens("ecosphere"),
    description:
      "A sustainable e-commerce store for eco-friendly products, built end-to-end with a full cart-to-checkout flow on Stripe.",
    // White, not the old #0a0909: the site only rendered dark inside the
    // sandboxed iframe (its theme read of localStorage threw there and fell
    // back to dark). Standalone — and so in the screenshot — it is light.
    screenBg: "#ffffff",
  },
];
