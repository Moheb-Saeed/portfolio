import { z } from "zod";

// Contact-form validation lives here, not in the "use server" action file, so it
// can be unit-tested and reused — a server-action module may only export async
// functions.

/**
 * A web address: an explicit scheme, a `www.` host, or a bare `example.com`.
 *
 * Anti-spam 3 — see `app/actions/contact.ts` for the honeypot and the fill-time
 * guard. It applies to the *name* field only. The "Dear Webmaster" blasts run a
 * template that substitutes the crawled site's own URL into every slot, so they
 * arrive as `Portfolio enquiry from To the http://mohebsaeed.com/… Administrator`.
 * A person's name never contains a URL, which makes this the one content rule
 * here with no honest false positive. The message body is left alone on purpose:
 * a real enquiry links a job post, a repo or the sender's own site.
 *
 * The bare-domain arm lists TLDs explicitly and ends on a word boundary rather
 * than matching "dot plus letters" — the loose form flags real names like
 * "St.Johns" and "Dr.Comstock", and turning someone away from the form is a
 * worse outcome than letting one spam message through.
 */
const WEB_ADDRESS =
  /(?:[a-z][a-z0-9+.-]*:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|io|co|ru|cn|de|uk|info|biz|xyz|top|online|site|shop|club|live|store)\b)/i;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100)
    .refine(
      (value) => !WEB_ADDRESS.test(value),
      "Please enter your name on its own, without a web address."
    ),
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Message is too long."),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Escape the five HTML-significant characters before interpolating user input
 *  into the notification email's HTML body. */
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!
  );
}
