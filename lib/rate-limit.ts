import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Rate limiter for the contact form.
//
// - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set, uses Upstash
//   Redis (free tier) for a strict limit shared across every serverless
//   instance.
// - Otherwise falls back to an in-memory limiter so the form still works with
//   zero config. In-memory state is per-instance and resets on a cold start.
//
// Both paths are exposed through the same async `rateLimit(key, limit, windowMs)`.

export type RateLimitResult = { ok: boolean; retryAfterMs: number };

/* -------------------------------------------------------------------------- */
/* In-memory fallback (fixed window)                                           */
/* -------------------------------------------------------------------------- */

type MemWindow = { count: number; resetAt: number };
const windows = new Map<string, MemWindow>();
let lastSweep = 0;

/** Drop expired windows occasionally so the map can't grow unbounded. */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, w] of windows) {
    if (now >= w.resetAt) windows.delete(key);
  }
}

function memoryLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const w = windows.get(key);
  if (!w || now >= w.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterMs: 0 };
  }
  if (w.count >= limit) {
    return { ok: false, retryAfterMs: w.resetAt - now };
  }
  w.count += 1;
  return { ok: true, retryAfterMs: 0 };
}

/* -------------------------------------------------------------------------- */
/* Upstash (used only when the env vars are present)                           */
/* -------------------------------------------------------------------------- */

// undefined = not resolved yet, null = not configured.
let redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redis !== undefined) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redis = url && token ? new Redis({ url, token }) : null;
  return redis;
}

// One Ratelimit instance per (limit, window) pair.
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMs: number): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  const cacheKey = `${limit}:${windowMs}`;
  let limiter = limiters.get(cacheKey);
  if (!limiter) {
    limiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs} ms` as Duration),
      prefix: "ratelimit",
      analytics: false,
    });
    limiters.set(cacheKey, limiter);
  }
  return limiter;
}

/* -------------------------------------------------------------------------- */

/**
 * Allow up to `limit` calls per `windowMs` for `key`. Prefers Upstash; falls
 * back to the in-memory limiter when Upstash isn't configured or is unreachable
 * (fail-open — a transient Redis outage must not lock everyone out of the form).
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const limiter = getLimiter(limit, windowMs);
  if (limiter) {
    try {
      const res = await limiter.limit(key);
      return {
        ok: res.success,
        retryAfterMs: res.success ? 0 : Math.max(0, res.reset - Date.now()),
      };
    } catch (err) {
      console.error("[rate-limit] Upstash unavailable, using in-memory", err);
    }
  }
  return memoryLimit(key, limit, windowMs);
}
