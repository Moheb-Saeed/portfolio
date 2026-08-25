import type { ComponentType, SVGProps } from "react";
import { FaEnvelope, FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { ContactForm } from "@/components/ui/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow, Section } from "@/components/ui/Section";
import { btnSecondary } from "@/components/ui/button";
import { site } from "@/lib/site";

type ContactLink = {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Per glyph: these marks don't carry equal weight at equal box sizes. */
  iconSize: string;
};

/**
 * Icon + label, no value. The values these used to print — the address, the
 * handles, the phone number — were the href written out a second time, so they
 * cost four rows of weight for nothing a click doesn't give. (They were *not*
 * load-bearing for anti-harvesting: `site.whatsapp` is a wa.me URL, so the
 * digits are in the href either way.) The label stays because it is the part
 * that was never a duplicate, and four unlabelled squares read as anonymous.
 *
 * Two things here are measured against the rendered glyphs, not guessed:
 *
 * · Size (`iconSize`, per link). The envelope is a filled, wide shape that
 *   already carries as much weight at 16 as the three brand marks do at 20, so
 *   it holds `size-4` while they take `size-5` — the next step on the 4px scale.
 *
 * · Lift (0.08em, shared below). `items-center` centres each icon's *box*, but
 *   the eye aligns the *ink* to the label's cap height, which sits higher. One
 *   shared value because it measured right for all four — within 0.2px of the
 *   cap line — and in em so it tracks the label. Re-measure if either changes.
 *
 * LinkedIn is `FaLinkedin`, the enclosed badge, not `FaLinkedinIn`, the bare
 * "in". The bare mark is letterforms sitting beside letterforms, so the eye
 * lines its baseline up with the label's and reads the ~3.7px overhang as the
 * icon being off the line — GitHub's mark overhangs more (4.3px) and looks fine,
 * because an enclosed shape has no baseline to compare. The badge also puts all
 * three brand marks in one family.
 */
const links: ContactLink[] = [
  { label: "Email", href: `mailto:${site.email}`, Icon: FaEnvelope, iconSize: "size-4" },
  { label: "LinkedIn", href: site.linkedin, Icon: FaLinkedin, iconSize: "size-5" },
  { label: "GitHub", href: site.github, Icon: FaGithub, iconSize: "size-5" },
  { label: "WhatsApp", href: site.whatsapp, Icon: FaWhatsapp, iconSize: "size-5" },
];

export function Contact() {
  return (
    <Section id="contact">
      <Reveal>
        <Eyebrow>Contact</Eyebrow>
        <h2 className="mt-3 text-h1 text-balance">Let&apos;s work together</h2>
        <p className="mt-4 max-w-xl text-body text-muted text-pretty">
          Have a project in mind, or a role you think I&apos;d fit? Send a
          message or reach me directly.
        </p>
      </Reveal>

      {/* The row sits with the copy rather than in a second column: four links
          can't hold a column beside a form five fields tall. They take
          `btnSecondary` unchanged, so this reads as the same kind of row as the
          hero's — a control is a control, and the shared class keeps the height,
          radius and hover identical without a second definition of them. */}
      <Reveal>
        <ul className="mt-8 flex flex-wrap gap-3">
          {links.map(({ label, href, Icon, iconSize }) => {
            const external = !href.startsWith("mailto:");
            return (
              <li key={label}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`${btnSecondary} gap-2`}
                >
                  {/* Decorative: the label beside it is the accessible name. */}
                  <Icon aria-hidden className={`shrink-0 -translate-y-[0.08em] ${iconSize}`} />
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal className="mt-12 max-w-xl">
        <ContactForm />
      </Reveal>
    </Section>
  );
}
