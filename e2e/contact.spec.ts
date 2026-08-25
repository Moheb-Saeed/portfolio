import { test, expect } from "@playwright/test";

test.describe("contact form", () => {
  test("renders its fields and submit button", async ({ page }) => {
    await page.goto("/");
    // By role, not getByLabel: the direct-contact links beside the form are
    // named "Email", "GitHub" and so on, and getByLabel substring-matches
    // across every role, so the plain name resolves to a link and a field both.
    await expect(page.getByRole("textbox", { name: "Name" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send message/i })
    ).toBeVisible();
  });

  test("keeps what you typed, and points at the field, when rejected", async ({
    page,
  }) => {
    await page.goto("/");

    const name = page.getByRole("textbox", { name: "Name" });
    const message = page.getByRole("textbox", { name: "Message" });
    await name.fill("Jane Doe");
    await page.getByRole("textbox", { name: "Email" }).fill("jane@example.com");
    // Short on purpose — same reason as the test below: it keeps a real send
    // unreachable. Blanking the stamp skips the fill-time guard, so the request
    // reaches validation rather than stopping at "too quick".
    await message.fill("Hi.");
    await page.evaluate(() => {
      const el = document.querySelector<HTMLInputElement>(
        'input[name="startedAt"]'
      );
      if (el) el.value = "";
    });
    await page.getByRole("button", { name: /send message/i }).click();

    await expect(page.locator("#contact form p[aria-live]")).toHaveText(
      /highlighted fields/i
    );
    // React 19 resets an uncontrolled form once the action settles, error
    // included, so without submitContact echoing the submission back into
    // `defaultValue` these come back empty and the visitor loses their message.
    await expect(name).toHaveValue("Jane Doe");
    await expect(message).toHaveValue("Hi.");
    await expect(message).toBeFocused();
  });

  test("re-arms the fill-time guard after a rejected submission", async ({
    page,
  }) => {
    await page.goto("/");

    const send = page.getByRole("button", { name: /send message/i });
    const fill = async () => {
      await page.getByRole("textbox", { name: "Name" }).fill("Jane Doe");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("jane@example.com");
      await page.getByRole("textbox", { name: "Message" }).fill("Hi.");
    };

    // First attempt runs with the stamp blanked, so it lands on validation and
    // also warms the action. The reset that follows blanks the stamp again.
    await fill();
    await page.evaluate(() => {
      const el = document.querySelector<HTMLInputElement>(
        'input[name="startedAt"]'
      );
      if (el) el.value = "";
    });
    await send.click();
    await expect(page.locator("#contact form p[aria-live]")).toHaveText(
      /highlighted fields/i
    );

    // Nothing touches the stamp from here: the form has to have re-armed it
    // itself, or submitContact sees no stamp and waves this straight through.
    await fill();
    await send.click();
    await expect(page.locator("#contact form p[aria-live]")).toHaveText(
      /too quick/i
    );
  });

  test("rejects a submission that arrives too fast (anti-spam)", async ({
    page,
  }) => {
    await page.goto("/");

    const send = page.getByRole("button", { name: /send message/i });
    const status = page.locator("#contact form p[aria-live]");

    const fill = async () => {
      await page.getByRole("textbox", { name: "Name" }).fill("Jane Doe");
      await page
        .getByRole("textbox", { name: "Email" })
        .fill("jane@example.com");
      // Under the schema's 10-character floor, and that is load-bearing rather
      // than lazy. The guard below only fires while the server sees less than
      // MIN_FILL_MS between the form opening and the submit landing, and a
      // loaded run can overshoot that. submitContact then treats the submission
      // as genuine and carries on — past validation, to an actual Resend send.
      // This test did exactly that against a dev server holding a live key, and
      // put real "Portfolio enquiry from Jane Doe" mail in the inbox.
      //
      // Validation sits between the guard and the send, so a message that
      // cannot pass it makes the send unreachable no matter how slow the run or
      // which server answers. Keep it short: a "valid" message here re-arms
      // that bug — for both submissions below.
      await page.getByRole("textbox", { name: "Message" }).fill("Hi.");
    };

    const setStartedAt = (value: string) =>
      page.evaluate((v) => {
        const el = document.querySelector<HTMLInputElement>(
          'input[name="startedAt"]'
        );
        if (el) el.value = v;
      }, value);

    // First submit is a warm-up, and it is what makes this test deterministic.
    // The stamp is written immediately before the click, so the server reads
    // `elapsed` as the round trip itself — and dev compiles the server action on
    // its first invocation, which measured 2.7–3.6s against MIN_FILL_MS's 3000.
    // The guard fired or didn't on which side of that line the run landed. One
    // throwaway submit moves the real attempt onto the warm path (~0.2s).
    //
    // It runs with an empty stamp so its own outcome can't be "too quick":
    // submitContact skips the guard when the stamp is missing, so this always
    // lands on the validation error, and the assertion below is then proof the
    // second response arrived rather than the first one still being on screen.
    await fill();
    await setStartedAt("");
    await send.click();
    await expect(status).toHaveText(/highlighted fields/i);

    // React 19 resets the form once an action settles — the visible fields and
    // the hidden stamp alike — so the real attempt has to write both again.
    await fill();
    await setStartedAt(String(Date.now()));
    await send.click();

    // "too quick" rather than the field errors the short message would draw
    // proves the guard ran, and that it ran before validation.
    await expect(status).toHaveText(/too quick/i);
  });
});
