"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";
import { btnPrimary } from "./button";

const initialState: ContactState = { status: "idle" };

// 6px radius — the manual's input value. No placeholder styling: the fields are
// labelled, and a muted placeholder would fall below the 4.5:1 contrast floor.
const fieldClass =
  "w-full rounded-input border border-line bg-raised px-4 py-3 text-body text-ink transition-colors duration-200 hover:border-accent focus:border-accent";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${btnPrimary} disabled:opacity-60`}>
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-2 text-small text-danger">
      {error}
    </p>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const startedAtRef = useRef<HTMLInputElement>(null);

  // Stamped straight onto the DOM node rather than through state: doing it in
  // render would mismatch hydration, and setState here is a wasted render.
  const stampStartedAt = () => {
    if (startedAtRef.current) startedAtRef.current.value = String(Date.now());
  };

  useEffect(stampStartedAt, []);

  // React 19 resets an uncontrolled form once its action settles — on failure as
  // well as success — and that reset blanks this hidden field along with the
  // visible ones. No explicit reset() is needed here, but the stamp has to be
  // re-armed, and on *every* settled state rather than only on success: leaving
  // it to success alone meant every later attempt in the session carried an
  // empty `startedAt`, which submitContact reads as "no stamp" and lets past the
  // minimum-fill-time guard, so the guard quietly stopped running after the
  // first submit. (Keying this on `state.status` had the same effect between two
  // consecutive successes: same value, so the effect never re-ran.) Re-stamping
  // can't weaken the guard — the clock restarts at now, so a bot still has to
  // wait out MIN_FILL_MS.
  useEffect(() => {
    if (state.status === "idle") return;
    stampStartedAt();

    // The reset also drops focus, and the error copy is announced politely from
    // the live region below — which tells a screen-reader user that something
    // needs fixing without telling them where. Land them on the first field.
    const firstInvalid = (["name", "email", "message"] as const).find(
      (field) => state.fieldErrors?.[field]
    );
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)
        ?.focus();
    }
  }, [state]);

  const errors = state.fieldErrors;

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      {/* Honeypot — hidden from humans and assistive tech, irresistible to bots.
          The name and label are deliberately meaningless: this used to be
          "Company", which browsers match to the organization autofill category
          and can fill on the visitor's behalf. submitContact answers a filled
          honeypot with a silent success, so an autofilled one thanks a real
          visitor for a message it never sent. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="ref-code">Leave this field empty</label>
        <input id="ref-code" name="ref-code" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="mb-2 block text-small text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          // The value React's post-action reset restores to — see ContactState.
          defaultValue={state.values?.name ?? ""}
          aria-invalid={!!errors?.name}
          aria-describedby={errors?.name ? "name-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="name-error" error={errors?.name} />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-small text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          spellCheck={false}
          defaultValue={state.values?.email ?? ""}
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? "email-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="email-error" error={errors?.email} />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-small text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          defaultValue={state.values?.message ?? ""}
          aria-invalid={!!errors?.message}
          aria-describedby={errors?.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
        <FieldError id="message-error" error={errors?.message} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p aria-live="polite" className="text-small">
          {state.status === "success" && (
            <span className="text-accent">
              Thanks — I&apos;ll get back to you shortly.
            </span>
          )}
          {state.status === "error" && state.message && (
            <span className="text-danger">{state.message}</span>
          )}
        </p>
      </div>

      {/* GDPR Art. 13 wants the notice where the data is handed over, not only
          linked from the footer — so it sits with the button that sends it. */}
      <p className="mt-4 text-small text-muted">
        Your message is emailed to me and stored nowhere else. See the{" "}
        <a
          href="/privacy"
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
