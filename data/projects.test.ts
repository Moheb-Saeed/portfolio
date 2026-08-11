import { describe, it, expect } from "vitest";
import { projects, CATEGORY_ORDER } from "./projects";

describe("projects data integrity", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("assigns every project a category from CATEGORY_ORDER", () => {
    for (const p of projects) {
      expect(CATEGORY_ORDER).toContain(p.category);
    }
  });

  it("leaves no CATEGORY_ORDER entry empty", () => {
    for (const category of CATEGORY_ORDER) {
      expect(projects.some((p) => p.category === category)).toBe(true);
    }
  });

  it("fills the required text fields", () => {
    for (const p of projects) {
      expect(p.title.trim()).not.toBe("");
      expect(p.role.trim()).not.toBe("");
      expect(p.description.trim()).not.toBe("");
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it("uses absolute https live URLs", () => {
    for (const p of projects) {
      expect(p.liveUrl).toMatch(/^https:\/\//);
    }
  });

  it("derives screenshot paths from the slug", () => {
    for (const p of projects) {
      expect(p.screens.desktop).toBe(`/screens/${p.slug}-desktop.webp`);
      expect(p.screens.tablet).toBe(`/screens/${p.slug}-tablet.webp`);
      expect(p.screens.mobile).toBe(`/screens/${p.slug}-mobile.webp`);
    }
  });

  it("uses a hex color for each screenBg", () => {
    for (const p of projects) {
      expect(p.screenBg).toMatch(/^#[0-9a-fA-F]{3,8}$/);
    }
  });
});
