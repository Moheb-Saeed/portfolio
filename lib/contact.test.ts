import { describe, it, expect } from "vitest";
import { contactSchema, escapeHtml } from "./contact";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello, I'd like to talk about a project.",
};

describe("contactSchema", () => {
  it("accepts a valid submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a too-short name", () => {
    expect(contactSchema.safeParse({ ...valid, name: "J" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(contactSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
      false
    );
  });

  it("rejects a too-short message", () => {
    expect(
      contactSchema.safeParse({ ...valid, message: "hi" }).success
    ).toBe(false);
  });

  it("enforces max lengths", () => {
    expect(
      contactSchema.safeParse({ ...valid, name: "a".repeat(101) }).success
    ).toBe(false);
    expect(
      contactSchema.safeParse({ ...valid, message: "a".repeat(5001) }).success
    ).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const r = contactSchema.safeParse({ ...valid, name: "  Jane Doe  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe("Jane Doe");
  });
});

describe("escapeHtml", () => {
  it("escapes the five HTML-significant characters", () => {
    expect(escapeHtml(`<b>"Tom" & 'Jerry'</b>`)).toBe(
      "&lt;b&gt;&quot;Tom&quot; &amp; &#39;Jerry&#39;&lt;/b&gt;"
    );
  });

  it("leaves ordinary text untouched", () => {
    expect(escapeHtml("Just a normal message.")).toBe("Just a normal message.");
  });
});
