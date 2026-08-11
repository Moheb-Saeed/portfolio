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
    await page.getByLabel("Message").fill("Hello, this is a test message.");

    // Force elapsed time under the min-fill-time so it hits the anti-spam path
    // and returns before ever trying to send an email (no API key needed).
    await page.evaluate(() => {
      const el = document.querySelector<HTMLInputElement>(
        'input[name="startedAt"]'
      );
      if (el) el.value = String(Date.now());
    });

    await page.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByText(/too quick/i)).toBeVisible();
  });
});
