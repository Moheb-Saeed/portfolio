import { test, expect, type Page } from "@playwright/test";

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

  // The bar's scroll listener attaches on hydration; a wheel before that
  // scrolls the page with nothing watching, and the bar stays where it is. The
  // contact form's `startedAt` is blank in the server HTML and stamped by an
  // effect on mount, so it fills exactly once the client is live.
  const hydrated = (page: Page) =>
    page.waitForFunction(
      () =>
        !!document.querySelector<HTMLInputElement>('input[name="startedAt"]')
          ?.value
    );

  // Measured from the header's own box rather than a class name:
  // `-translate-y-full` is what the reader actually experiences, and the
  // transition means it settles a frame or two after the wheel.
  const navBottom = (page: Page) =>
    page.locator("header").evaluate((el) => el.getBoundingClientRect().bottom);

  test("nav bar hides scrolling down and comes back scrolling up", async ({
    page,
  }) => {
    await page.goto("/");
    await hydrated(page);
    await expect.poll(() => navBottom(page)).toBeGreaterThan(0);

    await page.mouse.wheel(0, 1600);
    await expect.poll(() => navBottom(page)).toBeLessThanOrEqual(0);

    await page.mouse.wheel(0, -400);
    await expect.poll(() => navBottom(page)).toBeGreaterThan(0);
  });

  // A hash-link click hands the scroll to SmoothScroll, whose animated travel
  // is indistinguishable from the reader scrolling down. The bar has to sit
  // still through it instead of vanishing from under the link just clicked.
  test("nav bar stays put while a hash link scrolls the page", async ({
    page,
  }) => {
    await page.goto("/");
    await hydrated(page);
    await page.getByRole("link", { name: "Contact", exact: true }).click();
    // Wait for the page to stop moving rather than for a distance or a fixed
    // delay: two samples the same means the travel has landed, whatever the
    // page height or how long SmoothScroll took to cover it.
    await page.waitForFunction(
      () => {
        const w = window as Window & { __lastY?: number };
        const settled = window.scrollY > 0 && window.scrollY === w.__lastY;
        w.__lastY = window.scrollY;
        return settled;
      },
      undefined,
      { polling: 250 }
    );
    expect(await navBottom(page)).toBeGreaterThan(0);
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
