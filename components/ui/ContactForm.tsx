"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactState } from "@/app/actions/contact";

const initialState: ContactState = { status: "idle" };

// No placeholder styling: the fields are labelled, and a muted placeholder
// would fall below the 4.5:1 contrast floor.
const fieldClass =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink transition-colors duration-200 hover:border-accent-soft focus:border-accent";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-bg transition-all duration-200 hover:bg-accent-bright disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-accent-bright">
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

  useEffect(() => {
    if (state.status !== "success") return;
    formRef.current?.reset();
    // reset() blanks the hidden field, so re-stamp or the next send is
    // rejected by the server's minimum-fill-time check.
    stampStartedAt();
  }, [state.status]);

  const errors = state.fieldErrors;

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input ref={startedAtRef} type="hidden" name="startedAt" defaultValue="" />

      {/* Honeypot — hidden from humans and assistive tech, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          aria-invalid={!!errors?.name}
          aria-describedby={errors?.name ? "name-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="name-error" error={errors?.name} />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          aria-invalid={!!errors?.email}
          aria-describedby={errors?.email ? "email-error" : undefined}
          className={fieldClass}
        />
        <FieldError id="email-error" error={errors?.email} />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          aria-invalid={!!errors?.message}
          aria-describedby={errors?.message ? "message-error" : undefined}
          className={`${fieldClass} resize-y`}
        />
        <FieldError id="message-error" error={errors?.message} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p aria-live="polite" className="text-sm">
          {state.status === "success" && (
            <span className="text-accent-bright">
              Thanks — I&apos;ll get back to you shortly.
            </span>
          )}
          {state.status === "error" && state.message && (
            <span className="text-muted">{state.message}</span>
          )}
        </p>
      </div>
    </form>
  );
}
