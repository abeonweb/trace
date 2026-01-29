import { describe, expect, it } from "vitest";
import { resolveIssue } from "../domain/resolveIssue";
import { Issue } from "../domain/issue/issue";
import { Resolution } from "../domain/resolution/resolution";

describe("resolveIssue", () => {
  const openIssue: Issue = {
    id: "1",
    title: "Checkout failure",
    description: "Intermittent error",
    status: "open",
  };

  it("resolves an open issue", () => {
    const resolution: Resolution = {
      issueId: "1",
      rootCause: "Null price value",
      prevention: "Add validation",
    };

    const result = resolveIssue(openIssue, resolution);

    expect(result.status).toBe("resolved");
  });

  it("throws an error if root cause is missing", () => {
    expect(() =>
      resolveIssue(openIssue, {
        issueId: "1",
        rootCause: "",
        prevention: "",
      })
    ).toThrow();
  });

  it("throws an error if issue is already resolved", () => {
    expect(() =>
      resolveIssue(
        { ...openIssue, status: "resolved" },
        {
          issueId: "1",
          rootCause: "Already fixed",
          prevention: "N/A",
        }
      )
    ).toThrow();
  });

  it("throws if resolution does not match issue", () => {
    expect(() =>
      resolveIssue(openIssue, {
        issueId: "2",
        rootCause: "Mismatch",
        prevention: "N/A",
      })
    ).toThrow();
  });

  it("does not mutate the original issue", () => {
    const copy = { ...openIssue };

    resolveIssue(copy, {
      issueId: "1",
      rootCause: "Cause",
      prevention: "Prevention",
    });

    expect(copy.status).toBe("open");
  });
});
