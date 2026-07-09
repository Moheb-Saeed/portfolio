export const site = {
  // TODO(Moheb): set NEXT_PUBLIC_SITE_URL in Vercel to your real domain.
  // It drives canonical URLs, OG image URLs, sitemap, and JSON-LD.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://moheb-saeed.vercel.app",
  name: "Moheb Saeed",
  role: "Frontend Engineer",
  location: "Cairo, Egypt",
  email: "moheb.saed55@gmail.com",
  github: "https://github.com/Moheb-Saeed",
  linkedin: "https://linkedin.com/in/moheb-saeed-43a2a0265",
  whatsapp:
    "https://wa.me/201005547821?text=Hi%20Moheb%2C%20I%20saw%20your%20portfolio",
  cv: "/cv.pdf",
} as const;
