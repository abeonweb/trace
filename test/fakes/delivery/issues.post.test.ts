import { beforeAll, describe, expect, it } from "vitest";
import { makeIssuesHandlers } from "@/delivery/http/handlers/issues";
import { FakeIssueRepository } from "@/test/fakes/FakeIssueRepository";

beforeAll(() => {
  process.env.TRACE_ORG_ID = "test-org";
});

describe("POST /api/issues", () => {
  it("returns 201 and id", async () => {
    const handlers = makeIssuesHandlers({
      issueRepo: new FakeIssueRepository(),
    });

    const req = new Request("http://localhost/api/issues", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        project: "trace",
        title: "Crash on login",
        description: "App crashes on login",
      }),
    });

    const res = await handlers.POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(typeof json.id).toBe("string");
  });

  it("returns 400 when required fields are missing", async () => {
    const handlers = makeIssuesHandlers({
      issueRepo: new FakeIssueRepository(),
    });

    const req = new Request("http://localhost/api/issues", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ project: "trace" }),
    });

    const res = await handlers.POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(typeof json.message).toBe("string");
  });
});
