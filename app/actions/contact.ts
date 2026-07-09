"use server";

import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";

/** A real human takes at least this long to fill the form. */
const MIN_FILL_MS = 3000;

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters.")
    .max(5000, "Message is too long."),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

function escapeHtml(value: string) {
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

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Anti-spam 1: honeypot. Bots fill every field; humans never see this one.
  if (formData.get("company")) {
    return { status: "success" }; // silently pretend it worked
  }

  // Anti-spam 2: minimum fill time. The timestamp is stamped on mount, so a
  // missing/zero value means the form was posted without running our client
  // code — reject rather than let it through (Number("") === 0 is finite).
  const startedAt = Number(formData.get("startedAt"));
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || startedAt <= 0 || elapsed < MIN_FILL_MS) {
    return {
      status: "error",
      message: "That was too quick — please try again.",
    };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const flat = z.flattenError(parsed.error).fieldErrors;
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: {
        name: flat.name?.[0],
        email: flat.email?.[0],
        message: flat.message?.[0],
      },
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return {
      status: "error",
      message: "Email isn't configured right now. Please email me directly.",
    };
  }

  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // TODO(Moheb): swap to a branded address once a domain is verified on Resend.
      from: "Portfolio <onboarding@resend.dev>",
      to: [site.email],
      replyTo: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });

    if (error) {
      console.error("[contact] resend error", error);
      return {
        status: "error",
        message: "Something went wrong sending your message. Please try again.",
      };
    }
  } catch (err) {
    console.error("[contact] unexpected error", err);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please try again.",
    };
  }

  return { status: "success" };
}
