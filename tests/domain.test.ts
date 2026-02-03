import { describe, expect, it } from "vitest";
import { resolveIssueDomain } from "../domain/resolveIssueDomain";
import { Issue } from "../domain/issue/issue";
import { Resolution } from "../domain/resolution/resolution";
import { IssueAlreadyResolvedError } from "../domain/errors";

describe("resolveIssue", () => {
  const openIssue: Issue = {
    id: "1",
    project: "trace",
    title: "Crash",
    description: "App crashes",
    status: "open",
    createdAt: new Date(),
  };

  it("resolves an open issue", () => {
    const resolution: Resolution = {
      issueId: openIssue.id,
      rootCause: "Null ref",
      prevention: "Guard",
      resolvedAt: new Date(),
    };

    const result = resolveIssueDomain(openIssue, resolution);

    expect(result.status).toBe("resolved");
  });

  it("throws an error if root cause is missing", () => {
    expect(() =>
      resolveIssueDomain(openIssue, {
        issueId: "1",
        rootCause: "",
        prevention: "",
        resolvedAt: new Date(),
      }),
    ).toThrow();
  });

  it("throws an error if issue is already resolved", () => {
    expect(() =>
      resolveIssueDomain(
        { ...openIssue, status: "resolved" },
        {
          issueId: "1",
          rootCause: "Already fixed",
          prevention: "N/A",
          resolvedAt: new Date(),
        },
      ),
    ).toThrow(IssueAlreadyResolvedError);
  });

  it("throws if resolution does not match issue", () => {
    expect(() =>
      resolveIssueDomain(openIssue, {
        issueId: "2",
        rootCause: "Mismatch",
        prevention: "N/A",
        resolvedAt: new Date(),
      }),
    ).toThrow();
  });

  it("does not mutate the original issue", () => {
    const copy = { ...openIssue };

    resolveIssueDomain(copy, {
      issueId: "1",
      rootCause: "Cause",
      prevention: "Prevention",
      resolvedAt: new Date(),
    });

    expect(copy.status).toBe("open");
  });
});
