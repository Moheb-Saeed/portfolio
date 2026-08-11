import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("loads with the right title and H1", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Moheb Saeed/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Moheb Saeed" })
    ).toBeVisible();
  });

  test("renders the work, about and contact sections", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#work")).toBeVisible();
    await expect(page.locator("#about")).toBeVisible();
    await expect(page.locator("#contact")).toBeVisible();
  });

  test("shows the three work categories", async ({ page }) => {
    await page.goto("/");
    for (const category of ["Webics Agency", "Freelance work", "Projects"]) {
      await expect(
        page.getByRole("heading", { name: category, exact: true })
      ).toBeVisible();
    }
  });

  test("nav jumps to a section via its hash", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "About", exact: true }).click();
    await expect(page).toHaveURL(/#about$/);
  });

  test("has no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflows).toBe(false);
  });
});

test("sends the hardening security headers", async ({ request }) => {
  const res = await request.get("/");
  const headers = res.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["strict-transport-security"]).toContain("max-age=");
});
