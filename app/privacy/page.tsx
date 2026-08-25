import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Section, Eyebrow, BrandRule } from "@/components/ui/Section";
import { Footer } from "@/components/ui/Footer";
import { site } from "@/lib/site";

/**
 * The site's only sub-page. Its title takes the `text-h1` step, which the
 * homepage's section headings share (the homepage h1 is the display mark).
 *
 * Clauses are data rather than hand-written markup so the contents list and the
 * sections can't drift apart: both render from CLAUSES, and every `id` here is
 * both an anchor and a contents entry.
 *
 * Everything this describes is checkable against the code — the fields in
 * `lib/contact.ts`, the IP key and 5-per-10-minutes window in
 * `app/actions/contact.ts`, the limiter in `lib/rate-limit.ts`, and the
 * `Analytics` mount in `app/layout.tsx`. Re-read those before editing a claim.
 */

// The date this wording last changed. Deliberately a literal and not
// `new Date()` — unlike the footer's year, an effective date that silently
// moved would misstate when the terms actually changed. Update it by hand.
const LAST_UPDATED = "24 August 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How this site handles personal data: what the contact form collects, the cookieless analytics it uses, who processes it, how long it is kept, and your rights under GDPR, US state law and MENA data protection law.",
  alternates: { canonical: "/privacy" },
};

type Clause = { id: string; title: string; body: ReactNode };

/** Body copy inside a clause. */
function P({ children }: { children: ReactNode }) {
  return <p className="text-body text-muted text-pretty">{children}</p>;
}

/** A bulleted list; `term` sets the lead-in phrase in ink so rows stay scannable. */
function List({ items }: { items: { term?: string; text: ReactNode }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-body text-muted">
          <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
          <span className="text-pretty">
            {item.term && <strong className="font-semibold text-ink">{item.term}</strong>}
            {item.term && " — "}
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

const CLAUSES: Clause[] = [
  {
    id: "who",
    title: "Who is responsible",
    body: (
      <>
        <P>
          This site is run by {site.name}, an individual software engineer based in
          Cairo, Egypt. For the purposes of the EU and UK GDPR I am the data
          controller; under Egypt’s Personal Data Protection Law (Law No. 151 of
          2020) I am the data controller likewise. There is no company behind this
          site and no one else administers it.
        </P>
        <P>
          You can reach me about anything on this page at{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-accent underline underline-offset-4 hover:no-underline"
          >
            {site.email}
          </a>
          .
        </P>
      </>
    ),
  },
  {
    id: "collected",
    title: "What this site collects",
    body: (
      <>
        <P>
          This is a portfolio. There are no accounts, no logins and no database of
          visitors. Personal data reaches me in only four ways:
        </P>
        <List
          items={[
            {
              term: "The contact form",
              text: "your name, your email address and the message you write. Nothing else is in the form, and all three are fields you fill in deliberately. The message is emailed to me and is not stored on this site.",
            },
            {
              term: "Anti-spam checks",
              text: "your IP address is used as a counter key so that no more than five messages can be sent from one address in any ten-minute window. The form also carries a hidden field that real people never see and a timestamp of when the form was opened, both of which catch automated submissions.",
            },
            {
              term: "Audience measurement",
              text: "the page you viewed, the site that referred you, and coarse country, browser, operating system and device-type information derived from your request. This is counted in aggregate and is not tied to a name, an email address or a profile.",
            },
            {
              term: "Server logs",
              text: "as with any website, the hosting platform records requests — IP address, timestamp, the page requested and your browser’s user-agent string — so the service can be operated and abuse investigated.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "not-collected",
    title: "What this site deliberately does not do",
    body: (
      <>
        <P>
          Much of what a privacy policy usually has to disclose simply does not
          happen here, and that is a design decision rather than an oversight:
        </P>
        <List
          items={[
            {
              term: "No cookies",
              text: "the site sets none at all, and stores nothing in your browser’s local or session storage. That is why you are not being asked to dismiss a consent banner.",
            },
            {
              term: "No cross-site tracking",
              text: "there are no advertising pixels, no social-media trackers, no fingerprinting and no persistent identifier that follows you between sites or visits.",
            },
            {
              term: "No third-party embeds",
              text: "the project previews are screenshots served from this domain. Earlier versions loaded the live client sites in frames, which would have disclosed your visit to each of them; that no longer happens.",
            },
            {
              term: "No third-party fonts",
              text: "the typefaces are self-hosted, so your browser makes no request to Google Fonts or any other font service.",
            },
            {
              term: "No selling or sharing",
              text: "your personal data is never sold, rented, shared for cross-context behavioural advertising, or used to train any model. It is never disclosed to anyone except the service providers listed below.",
            },
            {
              term: "No special-category data",
              text: "I do not ask for, and have no use for, data about health, race, religion, politics, biometrics, sexual orientation, precise geolocation or financial account details. Please do not put any of it in the contact form.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "why",
    title: "Why it is processed, and on what legal basis",
    body: (
      <>
        <P>
          Where the EU or UK GDPR applies, these are the legal bases I rely on.
          The equivalent grounds under Egyptian, Emirati and Saudi law are the
          same in substance — a legitimate purpose, disclosed, and no more data
          than the purpose needs.
        </P>
        <List
          items={[
            {
              term: "Answering your message",
              text: "Article 6(1)(b) where you are contacting me about possible work, since replying is a step taken at your request before any agreement; otherwise Article 6(1)(f), my legitimate interest in responding to people who deliberately write to me.",
            },
            {
              term: "Keeping the form usable",
              text: "Article 6(1)(f). Without the IP-based rate limit and the automated-submission checks, the form is trivially abused and stops working for real people.",
            },
            {
              term: "Understanding what gets read",
              text: "Article 6(1)(f). The measurement is cookieless and aggregate, which is what keeps the balance in your favour; if it required a cookie or built a profile, I would have to ask your consent first, and I have deliberately avoided needing to.",
            },
            {
              term: "Running and securing the site",
              text: "Article 6(1)(f), and Article 6(1)(c) where a law obliges me to retain or produce something.",
            },
          ]}
        />
        <P>
          Where I rely on legitimate interests you have the right to object, and I
          explain how to do that below.
        </P>
      </>
    ),
  },
  {
    id: "processors",
    title: "Who else handles it",
    body: (
      <>
        <P>
          I use a small number of service providers. They act on my instructions
          under data processing terms, may not use your data for their own
          purposes, and are the only third parties involved:
        </P>
        <List
          items={[
            {
              term: "Vercel",
              text: "hosts the site and provides the cookieless audience measurement. It processes request data and server logs.",
            },
            {
              term: "Resend",
              text: "delivers the contact form as an email to my inbox. It handles your name, email address and message in transit.",
            },
            {
              term: "Upstash",
              text: "provides the database holding the anti-spam counter, so it briefly holds a key derived from your IP address. It never receives your name, your email address or your message.",
            },
            {
              term: "Google",
              text: "provides the mailbox the message arrives in, so your message rests there as ordinary email.",
            },
          ]}
        />
        <P>
          Beyond these, I disclose personal data only where a law or a binding
          order requires it, or to establish or defend a legal claim. There are no
          other recipients, and there is no onward sale to anyone.
        </P>
      </>
    ),
  },
  {
    id: "transfers",
    title: "Where your data goes",
    body: (
      <>
        <P>
          I am in Egypt and the providers above are US-headquartered and operate
          globally, so your data may be processed outside your own country —
          including in the United States, and outside the EEA and the UK.
        </P>
        <P>
          Where data protected by the EU or UK GDPR is transferred, it is covered
          by the Standard Contractual Clauses (with the UK Addendum or the UK
          International Data Transfer Agreement, as applicable) in the data
          processing terms I have with each provider, or by an equivalent
          safeguard such as an adequacy decision or the EU–US Data Privacy
          Framework where a provider is certified. Egypt’s Law No. 151 of 2020
          likewise permits cross-border transfer subject to an adequate level of
          protection, which those contractual safeguards are intended to meet.
        </P>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long it is kept",
    body: (
      <List
        items={[
          {
            term: "Your message",
            text: "kept while we are corresponding, and in any case deleted no later than 24 months after our last exchange — unless we go on to work together, in which case the records I am obliged to keep for tax or contractual reasons are kept for as long as that obligation lasts.",
          },
          {
            term: "The anti-spam counter",
            text: "the ten-minute window it belongs to, and no longer. The key expires by itself when the window closes. It is stored by Upstash as a count against a key derived from your IP address — a tally of how many messages have been sent from an address, never a record of what was in them or which pages you saw.",
          },
          {
            term: "Audience measurement",
            text: "retained by the hosting platform in aggregate form under its own retention schedule. It contains nothing that identifies you individually.",
          },
          {
            term: "Server logs",
            text: "kept briefly by the hosting platform for operational and security purposes under its own retention schedule.",
          },
        ]}
      />
    ),
  },
  {
    id: "security",
    title: "How it is protected",
    body: (
      <P>
        The site is served only over HTTPS and instructs browsers to refuse an
        unencrypted connection. It sends a strict set of security headers, refuses
        to be embedded in other sites, and declines the camera, microphone,
        geolocation and interest-tracking browser permissions outright. Contact
        form input is validated and length-limited before it is used, and escaped
        before it is placed in an email. Beyond the ten-minute anti-spam
        counter, no visitor data is stored at all — there is no database of
        visitors, no accounts and no archive of messages, which removes the
        largest category of risk rather than mitigating it.
        No system is perfectly secure, but there is very little here to lose.
      </P>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <P>
          Wherever you are, you can ask me to show you what I hold about you,
          correct it, delete it, or stop using it — and I will do it. In practice
          that almost always means one email thread in my inbox. Email me at{" "}
          <a
            href={`mailto:${site.email}`}
            className="text-accent underline underline-offset-4 hover:no-underline"
          >
            {site.email}
          </a>{" "}
          and I will respond within 30 days. There is no charge, and I will not
          treat you any differently for asking.
        </P>
        <P>
          Because I hold so little, I may be unable to identify you from a request
          alone — if I cannot tie your request to anything I actually hold, I will
          tell you so rather than ask you for more identifying data than I already
          have.
        </P>
      </>
    ),
  },
  {
    id: "rights-eu",
    title: "If you are in the EEA, the UK or Switzerland",
    body: (
      <>
        <P>
          The GDPR and the UK GDPR give you the rights of access, rectification,
          erasure, restriction of processing, data portability, and objection —
          including an absolute right to object to direct marketing, which I do
          not do. Where processing rests on consent you may withdraw it at any
          time without affecting what was lawful beforehand. No decision affecting
          you is made by automated means, and there is no profiling.
        </P>
        <P>
          You also have the right to complain to your national supervisory
          authority. In the UK that is the Information Commissioner’s Office; in
          the EEA it is the authority for the country where you live, work, or
          where you believe the problem occurred. I would rather you told me
          first, but the right is yours to use either way.
        </P>
      </>
    ),
  },
  {
    id: "rights-us",
    title: "If you are in the United States",
    body: (
      <>
        <P>
          California residents have rights under the CCPA as amended by the CPRA
          to know what personal information is collected and why, to access a copy
          of it, to correct it, to delete it, to opt out of its sale or of sharing
          for cross-context behavioural advertising, and to limit the use of
          sensitive personal information — plus the right not to be discriminated
          against for exercising any of them.
        </P>
        <P>
          Two of those need no action here: I do not sell personal information and
          have not done so in the preceding twelve months, and I do not share it
          for cross-context behavioural advertising. I also do not collect
          sensitive personal information as that term is defined, so there is
          nothing to limit. In the categories the statute uses, what this site
          collects is identifiers — your name, email address and IP address — and
          internet activity information about your visit.
        </P>
        <P>
          Residents of the other US states that have enacted comprehensive
          consumer privacy laws — Virginia, Colorado, Connecticut and Texas among
          them, with more states joining most legislative sessions — have
          substantially the same rights of access, correction, deletion,
          portability and opt-out, and may exercise them at the same address. I
          have not tried to work out which statute covers you before answering. Where a state gives you the
          right to appeal a refusal, you may appeal by replying to my response,
          and I will explain my reasoning in writing.
        </P>
      </>
    ),
  },
  {
    id: "rights-mena",
    title: "If you are in Egypt, the Gulf or the wider MENA region",
    body: (
      <>
        <P>
          I am established in Egypt, so Law No. 151 of 2020 on the Protection of
          Personal Data applies to this site directly. It gives you the right to
          be informed about the data held on you, to access it, to have it
          corrected or erased, to withdraw consent, to object to processing, and
          to be told if it has been disclosed or breached. The Personal Data
          Protection Center is the supervisory authority it establishes, and the
          law’s Executive Regulations were issued in 2025.
        </P>
        <P>
          If you are in the United Arab Emirates, Federal Decree-Law No. 45 of 2021
          gives you equivalent rights of access, correction, erasure, restriction,
          portability and objection, and the right to complain to the UAE Data
          Office. If you are in Saudi Arabia, the Personal Data Protection Law
          issued by Royal Decree M/19 of 1443H and amended by Royal Decree M/148 of
          1444H does the same, with
          the Saudi Data and Artificial Intelligence Authority as the competent
          body. Comparable rights apply under Bahrain’s Law No. 30 of 2018, Qatar’s
          Law No. 13 of 2016, and the data protection regimes of the DIFC, the
          ADGM, Morocco, Tunisia and Türkiye.
        </P>
        <P>
          The practical answer is the same everywhere: email me and tell me what
          you want done, and I will do it. I have not tried to give myself a
          weaker standard for any region.
        </P>
      </>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <P>
        This site is a professional portfolio aimed at clients, collaborators and
        employers. It is not directed at children, and I do not knowingly collect
        personal data from anyone under 16 — or under 13 in the United States,
        where the Children’s Online Privacy Protection Act sets that threshold. If
        you believe a child has sent me something through the contact form, email
        me and I will delete it.
      </P>
    ),
  },
  {
    id: "signals",
    title: "Do Not Track and Global Privacy Control",
    body: (
      <P>
        Some browsers send a Do Not Track header or a Global Privacy Control
        signal to tell sites not to track you or sell your data. There is no
        industry-agreed response to Do Not Track, so this site does not act on it
        specifically — but it does not track you across sites or over time in the
        first place, and it does not sell or share your personal data, so a Global
        Privacy Control signal has nothing here to switch off. The outcome those
        signals ask for is the default.
      </P>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <P>
        If what this site does with personal data changes, this page changes with
        it and the date at the top moves. There is no mailing list to notify, so
        for anything significant I will keep the previous position described here
        long enough to be noticed. The date at the top is the honest record of
        when this text last changed.
      </P>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <main id="main">
        <Section id="privacy" className="pt-24 lg:pt-32">
          <header className="max-w-3xl">
            <Eyebrow>Legal</Eyebrow>
            {/* First use of the h1 step — the scale reserved it for sub-pages. */}
            <h1 className="mt-4 text-h1 text-balance">Privacy Policy</h1>
            <p className="mt-4 font-mono text-small text-muted">
              Last updated {LAST_UPDATED}
            </p>
            <BrandRule className="mt-8" />
          </header>

          <div className="mt-10 max-w-3xl rounded-panel border border-line bg-raised p-6 lg:p-8">
            <h2 className="text-h3">In short</h2>
            <p className="mt-3 text-body text-muted text-pretty">
              This site sets no cookies, runs no trackers and shows no ads. The
              only personal data it asks for is what you choose to type into the
              contact form, which is emailed to me and stored nowhere else.
              Visitor numbers are counted anonymously and in aggregate. Nothing is
              ever sold or shared. You can ask me to delete anything I hold at any
              time, and I will. Everything below is the detail behind those
              sentences.
            </p>
          </div>

          <nav aria-labelledby="contents" className="mt-12 max-w-3xl">
            <h2 id="contents" className="text-h3">
              Contents
            </h2>
            <ol className="mt-4 flex flex-col gap-2">
              {CLAUSES.map((clause, i) => (
                <li key={clause.id} className="flex gap-3 text-body">
                  <span className="font-mono text-small text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${clause.id}`}
                    className="text-muted underline underline-offset-4 transition-colors duration-200 hover:text-accent"
                  >
                    {clause.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-16 flex max-w-3xl flex-col gap-14">
            {CLAUSES.map((clause, i) => (
              <section key={clause.id} id={clause.id} aria-labelledby={`${clause.id}-title`}>
                <p className="font-mono text-eyebrow uppercase text-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 id={`${clause.id}-title`} className="mt-2 text-h2 text-balance">
                  {clause.title}
                </h2>
                <div className="mt-5 flex flex-col gap-4">{clause.body}</div>
              </section>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
