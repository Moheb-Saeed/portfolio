import { z } from "zod";

// Contact-form validation lives here, not in the "use server" action file, so it
// can be unit-tested and reused — a server-action module may only export async
// functions.

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
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
