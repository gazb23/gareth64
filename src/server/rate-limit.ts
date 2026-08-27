import "server-only";

interface Counter {
  count: number;
  resetAt: number;
}

const counters = new Map<string, Counter>();
const windowMs = 10 * 60 * 1_000;
const requestLimit = 12;

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetAt: number;
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  const existing = counters.get(key);
  const counter = !existing || existing.resetAt <= now
    ? { count: 0, resetAt: now + windowMs }
    : existing;

  counter.count += 1;
  counters.set(key, counter);

  if (counters.size > 2_000) {
    for (const [candidate, value] of counters) {
      if (value.resetAt <= now) counters.delete(candidate);
    }
  }

  return {
    allowed: counter.count <= requestLimit,
    remaining: Math.max(requestLimit - counter.count, 0),
    resetAt: counter.resetAt,
  };
}

