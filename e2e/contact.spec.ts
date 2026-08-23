import { test, expect } from "@playwright/test";

test.describe("contact form", () => {
  test("renders its fields and submit button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send message/i })
    ).toBeVisible();
  });

  test("rejects a submission that arrives too fast (anti-spam)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    // Under the schema's 10-character floor, and that is load-bearing rather
    // than lazy. The guard below only fires while the server sees less than
    // MIN_FILL_MS between the form opening and the submit landing, and a loaded
    // run can overshoot that. submitContact then treats the submission as
    // genuine and carries on — past validation, to an actual Resend send. This
    // test did exactly that against a dev server holding a live key, and put
    // real "Portfolio enquiry from Jane Doe" mail in the inbox.
    //
    // Validation sits between the guard and the send, so a message that cannot
    // pass it makes the send unreachable no matter how slow the run or which
    // server answers. Keep it short: a "valid" message here re-arms that bug.
    await page.getByLabel("Message").fill("Hi.");

    // Force elapsed time under the min-fill-time so it hits the anti-spam path.
    await page.evaluate(() => {
      const el = document.querySelector<HTMLInputElement>(
        'input[name="startedAt"]'
      );
      if (el) el.value = String(Date.now());
    });

    await page.getByRole("button", { name: /send message/i }).click();

    // "too quick" rather than the field errors the short message would draw
    // proves the guard ran, and that it ran before validation.
    await expect(page.getByText(/too quick/i)).toBeVisible();
  });
});
