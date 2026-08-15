export const site = {
  // Drives canonical URLs, OG image URLs, sitemap, and JSON-LD. Override with
  // NEXT_PUBLIC_SITE_URL for preview deployments; the default is the real
  // domain, which is also the one printed on the brand collateral.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohebsaeed.com",
  name: "Moheb Saeed",
  role: "Software Engineer",
  location: "Cairo, Egypt",
  email: "moheb.saed55@gmail.com",
  github: "https://github.com/Moheb-Saeed",
  linkedin: "https://www.linkedin.com/in/moheb-saeed/",
  whatsapp:
    "https://wa.me/201005547821?text=Hi%20Moheb%2C%20I%20saw%20your%20portfolio",
  cv: "/Moheb-Saeed_CV.pdf",
} as const;
