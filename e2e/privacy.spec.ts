import { test, expect } from "@playwright/test";

test.describe("privacy policy", () => {
  test("loads with the right title and H1", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page).toHaveTitle(/Privacy Policy/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Privacy Policy" })
    ).toBeVisible();
  });

  test("every contents entry points at a real clause", async ({ page }) => {
    await page.goto("/privacy");
    const hrefs = await page
      .locator('nav[aria-labelledby="contents"] a')
      .evaluateAll((links) => links.map((a) => a.getAttribute("href") ?? ""));

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      await expect(page.locator(href)).toHaveCount(1);
    }
  });

  test("is reachable from the footer of the home page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Privacy Policy", exact: true }).click();
    await expect(page).toHaveURL(/\/privacy$/);
  });

  // The nav's hash links are relative on the homepage; from a sub-page they
  // have to carry the path, or they resolve against /privacy and go nowhere.
  test("nav links lead back to the home page sections", async ({ page }) => {
    await page.goto("/privacy");
    await page.getByRole("link", { name: "Work", exact: true }).click();
    await expect(page).toHaveURL(/\/#work$/);
    await expect(page.locator("#work")).toBeVisible();
  });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/privacy");
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflows).toBe(false);
  });
});
