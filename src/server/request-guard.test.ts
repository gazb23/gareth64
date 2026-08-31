import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { isJsonRequest, isSameOriginBrowserRequest, readJsonBody } from "./request-guard";

function request(headers: Readonly<Record<string, string>> = {}, body = "{}") {
  return new Request("https://garethbeall.com/api/ask", { method: "POST", headers, body });
}

describe("Ask request guards", () => {
  it("requires a valid same-origin browser request", () => {
    expect(isSameOriginBrowserRequest(request({ origin: "https://garethbeall.com", "sec-fetch-site": "same-origin" }))).toBe(true);
    expect(isSameOriginBrowserRequest(request())).toBe(false);
    expect(isSameOriginBrowserRequest(request({ origin: "https://evil.example" }))).toBe(false);
    expect(isSameOriginBrowserRequest(request({ origin: "https://garethbeall.com", "sec-fetch-site": "cross-site" }))).toBe(false);
  });

  it("accepts only the application/json media type", () => {
    expect(isJsonRequest(request({ "content-type": "application/json; charset=utf-8" }))).toBe(true);
    expect(isJsonRequest(request({ "content-type": "application/json.evil" }))).toBe(false);
  });

  it("parses a small JSON body", async () => {
    await expect(readJsonBody(request({}, '{"question":"Who is Gareth?"}'), 1_024)).resolves.toEqual({
      kind: "ok",
      value: { question: "Who is Gareth?" },
    });
  });

  it("rejects streamed bodies over the byte cap", async () => {
    await expect(readJsonBody(request({}, "x".repeat(1_025)), 1_024)).resolves.toEqual({ kind: "too-large" });
  });

  it("rejects malformed JSON", async () => {
    await expect(readJsonBody(request({}, "{"), 1_024)).resolves.toEqual({ kind: "invalid" });
  });
});
