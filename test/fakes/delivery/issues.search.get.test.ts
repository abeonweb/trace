import { describe, expect, it } from "vitest";
import { FakeIssueRepository } from "../FakeIssueRepository";
import { makeSearchIssuesHandlers } from "@/delivery/http/handlers/searchIssues";

describe("GET /api/issues/search", () => {
  it("returns 200 and array results", async () => {
    const repo = new FakeIssueRepository();
    await repo.save({
      id: "1",
      project: "trace",
      title: "Timeout",
      description: "DB timeout when searching",
      status: "open",
      createdAt: new Date("2026-02-01T10:00:00.000Z"),
    });

    const handlers = makeSearchIssuesHandlers({ issueRepo: repo });

    const req = new Request(
      "http://localhost/api/issues/search?q=timeout&project=trace&sort=recent",
    );
    const res = await handlers.GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results.length).toBe(1);
  });

  it("handles empty q gracefully", async () => {
    const repo = new FakeIssueRepository();
    const handlers = makeSearchIssuesHandlers({ issueRepo: repo });

    const req = new Request("http://localhost/api/issues/search");
    const res = await handlers.GET(req);

    expect(res.status).toBe(200);
  });
});
