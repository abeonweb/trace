import { describe, expect, it } from "vitest";
import { makeIssuesHandlers } from "../delivery/http/handlers/issues";
import { FakeIssueRepository } from "./fakes/FakeIssueRepository";

describe("POST /api/issues", () => {
  it("returns 201 and id", async () => {
    const handlers = makeIssuesHandlers({
      issueRepo: new FakeIssueRepository(),
    });

    const req = new Request("http://localhost/api/issues", {
        method: "POST",
        headers: { "content-type": "application/json"},
        body: JSON.stringify({
            project:"trace",
            title:"Crash on login",
            description: "App crashes on login",
        }),
    });

    const res = await handlers.POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(typeof json.id).toBe("string");
  });
});
