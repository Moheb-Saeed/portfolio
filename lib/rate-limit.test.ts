import { describe, it, expect, vi } from "vitest";
import { rateLimit } from "./rate-limit";

// With no UPSTASH_* env vars set, rateLimit uses the in-memory fallback. Each
// test uses a unique key so the module-level window map can't cross-contaminate.
describe("rateLimit (in-memory fallback)", () => {
  it("allows calls up to the limit, then blocks", async () => {
    const key = "unit:allow-then-block";
    for (let i = 0; i < 5; i++) {
      expect((await rateLimit(key, 5, 60_000)).ok).toBe(true);
    }
    const blocked = await rateLimit(key, 5, 60_000);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
  });

  it("resets once the window elapses", async () => {
    vi.useFakeTimers();
    try {
      const key = "unit:reset";
      for (let i = 0; i < 3; i++) await rateLimit(key, 3, 10_000);
      expect((await rateLimit(key, 3, 10_000)).ok).toBe(false);

      vi.advanceTimersByTime(10_001);
      expect((await rateLimit(key, 3, 10_000)).ok).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("tracks separate keys independently", async () => {
    expect((await rateLimit("unit:k1", 1, 60_000)).ok).toBe(true);
    expect((await rateLimit("unit:k1", 1, 60_000)).ok).toBe(false);
    // A different key still has its full budget.
    expect((await rateLimit("unit:k2", 1, 60_000)).ok).toBe(true);
  });
});
