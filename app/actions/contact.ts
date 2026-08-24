"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { Resend } from "resend";
import { site } from "@/lib/site";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, escapeHtml } from "@/lib/contact";

/** A real human takes at least this long to fill the form. */
const MIN_FILL_MS = 3000;

/** At most this many messages may be sent from one IP per window. */
const MAX_PER_WINDOW = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** Best-effort client IP from the platform's proxy headers. */
async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Anti-spam 1: honeypot. Bots fill every field; humans never see this one.
  if (formData.get("company")) {
    return { status: "success" }; // silently pretend it worked
  }

  // Anti-spam 2: minimum fill time. The timestamp is stamped on mount using the
  // browser's clock, so it's only trustworthy when it's present and roughly
  // agrees with ours. Reject only a real, positive, sub-threshold gap. A missing
  // stamp (no-JS / pre-hydration) or a client clock that runs ahead of the
  // server (negative gap) would otherwise block real people, so those fall
  // through to the honeypot + rate limiter instead.
  const startedAt = Number(formData.get("startedAt"));
  const elapsed = Date.now() - startedAt;
  if (startedAt > 0 && elapsed >= 0 && elapsed < MIN_FILL_MS) {
    return {
      status: "error",
      message: "That was too quick — please try again.",
    };
  }

  const parsed = contactSchema.safeParse({
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

  // Rate limit actual send attempts per IP — validation-error retries above
  // don't count, so a legitimate visitor fixing a field is never blocked.
  const limit = await rateLimit(
    `contact:${await clientIp()}`,
    MAX_PER_WINDOW,
    RATE_WINDOW_MS
  );
  if (!limit.ok) {
    const minutes = Math.max(1, Math.ceil(limit.retryAfterMs / 60_000));
    return {
      status: "error",
      message: `Too many messages. Please try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // Must be the verified sending domain, never the visitor's address: the
      // DKIM signature is d=send.mohebsaeed.com, so a visitor address in From
      // breaks alignment and the mail gets spam-foldered or refused. The
      // visitor is reachable through replyTo below.
      from: "Portfolio <portfolio@send.mohebsaeed.com>",
      to: [site.email],
      replyTo: email,
      // Collapse any newlines so the name can't spill onto its own header line.
      subject: `Portfolio enquiry from ${name.replace(/[\r\n]+/g, " ")}`,
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
