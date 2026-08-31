import "server-only";

import { createHash } from "node:crypto";

interface Counter {
  count: number;
  resetAt: number;
}

interface RateLimiterOptions {
  readonly windowMs: number;
  readonly requestLimit: number;
  readonly maxCounters: number;
}

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetAt: number;
}

export function createRateLimiter({ windowMs, requestLimit, maxCounters }: RateLimiterOptions) {
  const counters = new Map<string, Counter>();

  return function check(key: string, now = Date.now()): RateLimitResult {
    const existing = counters.get(key);
    const counter = !existing || existing.resetAt <= now
      ? { count: 0, resetAt: now + windowMs }
      : existing;

    counter.count += 1;
    counters.set(key, counter);

    if (!existing && counters.size > maxCounters) {
      for (const [candidate, value] of counters) {
        if (value.resetAt <= now) counters.delete(candidate);
      }
      while (counters.size > maxCounters) {
        const oldest = counters.keys().next().value;
        if (typeof oldest !== "string") break;
        counters.delete(oldest);
      }
    }

    return {
      allowed: counter.count <= requestLimit,
      remaining: Math.max(requestLimit - counter.count, 0),
      resetAt: counter.resetAt,
    };
  };
}

const check = createRateLimiter({
  windowMs: 10 * 60 * 1_000,
  requestLimit: 12,
  maxCounters: 2_000,
});

export function requestRateLimitKey(request: Request): string {
  const forwarded = request.headers.get("x-vercel-forwarded-for")
    ?? request.headers.get("x-forwarded-for")
    ?? "local";
  const ip = forwarded.split(",")[0]?.trim() || "local";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  return check(key, now);
}
