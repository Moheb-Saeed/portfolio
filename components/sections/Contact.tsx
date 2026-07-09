import { FaWhatsapp } from "react-icons/fa6";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
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
    <section id="contact" className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <Reveal>
        <p className="font-mono text-sm text-accent-bright">Contact</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&apos;s work together
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Have a project in mind, or a role you think I&apos;d fit? Send a
          message or reach me directly.
        </p>
      </Reveal>

      <Reveal className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
        <ContactForm />

        <ul className="space-y-3">
          {links.map((link) => {
            const external = !link.href.startsWith("mailto:");
            return (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-soft hover:bg-surface-2"
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-ink">
                    {link.icon && (
                      <FaWhatsapp aria-hidden className="size-4 text-accent" />
                    )}
                    {link.label}
                  </span>
                  <span className="font-mono text-xs text-muted">{link.value}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
