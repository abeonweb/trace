import { makeResolveIssueHandler } from "@/delivery/http/handlers/resolveIssue";
import { describe, expect, it } from "vitest";
import { FakeIssueRepository } from "../FakeIssueRepository";
import { FakeResolutionRepository } from "../FakeResolutionRepository";

describe("POST api/issues/:id/resolve", () => {
  it("returns 400 when rootCause/prevention is missing", async () => {
    const handlers = makeResolveIssueHandler({
      issueRepo: new FakeIssueRepository(),
      resolutionRepo: new FakeResolutionRepository(),
    });

    const req = new Request("http://localhost/api/issues/1/resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rootCause: "x" }),
    });

    const res = await handlers.POST(req, { params: { id: "1" } });
    expect(res.status).toBe(400);
  });

  it("returns 404 when issue not found", async () => {
    const handler = makeResolveIssueHandler({
      issueRepo: new FakeIssueRepository(),
      resolutionRepo: new FakeResolutionRepository(),
    });

    const req = new Request("http://localhost/api/issues/missing/resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ rootCause: "x", prevention: "y" }),
    });

    const res = await handler.POST(req, { params: { id: "missing" } });
    expect(res.status).toBe(404);
  });

  it("returns 200 when issue resolves", async () => {
    const issueRepo = new FakeIssueRepository();
    const resolutionRepo = new FakeResolutionRepository();

    await issueRepo.save({
      id: "i-1",
      project: "trace",
      title: "Timeout",
      description: "DB timeout",
      status: "open",
      createdAt: new Date("2026-02-01T10:00:00.000Z"),
    });

    const handlers = makeResolveIssueHandler({ issueRepo, resolutionRepo });

    const req = new Request("http://localhost/api/issues/1/resolve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        rootCause: "Pool exhausted",
        prevention: "Add limits",
      }),
    });
    const res = await handlers.POST(req, { params: { id: "i-1" } });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.issue.status).toBe("resolved");
    expect(resolutionRepo.saved.length).toBe(1);
  });
});
