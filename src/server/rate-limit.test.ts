import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createRateLimiter, requestRateLimitKey } from "./rate-limit";

describe("rate limiting", () => {
  it("uses the Vercel client IP and cannot be bypassed by changing user-agent", () => {
    const first = new Request("https://garethbeall.com/api/ask", {
      headers: {
        "user-agent": "browser-a",
        "x-forwarded-for": "198.51.100.9",
        "x-vercel-forwarded-for": "203.0.113.7",
      },
    });
    const second = new Request("https://garethbeall.com/api/ask", {
      headers: {
        "user-agent": "browser-b",
        "x-forwarded-for": "198.51.100.10",
        "x-vercel-forwarded-for": "203.0.113.7",
      },
    });

    expect(requestRateLimitKey(first)).toBe(requestRateLimitKey(second));
  });

  it("resets counters after the fixed window", () => {
    const check = createRateLimiter({ windowMs: 100, requestLimit: 2, maxCounters: 20 });

    expect(check("visitor", 0)).toMatchObject({ allowed: true, remaining: 1 });
    expect(check("visitor", 50)).toMatchObject({ allowed: true, remaining: 0 });
    expect(check("visitor", 75)).toMatchObject({ allowed: false, remaining: 0 });
    expect(check("visitor", 100)).toMatchObject({ allowed: true, remaining: 1 });
  });

  it("bounds retained client counters", () => {
    const check = createRateLimiter({ windowMs: 1_000, requestLimit: 2, maxCounters: 2 });

    check("oldest", 0);
    check("second", 0);
    check("third", 0);

    expect(check("oldest", 1)).toMatchObject({ allowed: true, remaining: 1 });
  });
});
