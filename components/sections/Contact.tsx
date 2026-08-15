import { FaWhatsapp } from "react-icons/fa6";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Section } from "@/components/ui/Section";
import { site } from "@/lib/site";

type ContactLink = {
  label: string;
  value: string;
  href: string;
  icon?: boolean;
};

const links: ContactLink[] = [
  { label: "Email", value: site.email, href: `mailto:${site.email}` },
  { label: "LinkedIn", value: "moheb-saeed", href: site.linkedin },
  { label: "GitHub", value: "Moheb-Saeed", href: site.github },
  { label: "WhatsApp", value: "+20 100 554 7821", href: site.whatsapp, icon: true },
];

export function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <Eyebrow>Contact</Eyebrow>
        <h2 className="mt-3 text-h2 text-balance">Let&apos;s work together</h2>
        <p className="mt-4 max-w-xl text-body text-muted text-pretty">
          Have a project in mind, or a role you think I&apos;d fit? Send a
          message or reach me directly.
        </p>
      </Reveal>

      <Reveal className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        <ContactForm />

        <ul className="space-y-4">
          {links.map((link) => {
            const external = !link.href.startsWith("mailto:");
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-center justify-between gap-4 rounded-card border border-line bg-raised px-4 py-3 shadow-raised transition-colors duration-200 hover:border-accent"
                >
                  <span className="flex min-w-0 items-center gap-3 text-small font-semibold text-ink">
                    {link.icon && (
                      <FaWhatsapp aria-hidden className="size-4 shrink-0 text-accent" />
                    )}
                    {link.label}
                  </span>
                  <span className="truncate font-mono text-small text-muted">
                    {link.value}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </Section>
  );
}
