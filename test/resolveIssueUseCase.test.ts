import { resolveIssueUseCase } from "../application/use-cases/resolveIssue";
import { FakeIssueRepository } from "./fakes/FakeIssueRepository";
import { FakeResolutionRepository } from "./fakes/FakeResolutionRepository";
import { expect, it } from "vitest";
import { IssueStatus } from "../domain/issue/issue";
import { IssueNotFoundError } from "../domain/errors";

it("resolves an open issue", async () => {
  const issueRepo = new FakeIssueRepository();
  const resolutionRepo = new FakeResolutionRepository();
  const issue = {
    id: "1",
    project: "trace",
    title: "Crash on login",
    description: "App crashes on login",
    status: "open" as IssueStatus,
    createdAt: new Date(),
  };
  await issueRepo.save(issue);

  const resolved = await resolveIssueUseCase(
    issue.id,
    {
      issueId: "1",
      resolvedAt: new Date(),
      prevention: "Add guard clause",
      rootCause: "Null session",
    },
    issueRepo,
    resolutionRepo,
  );
  expect(resolved.status).toBe("resolved");
  expect(resolutionRepo.saved).toHaveLength(1);
});

it("throws if issue deos not exist", async () => {
  const issueRepo = new FakeIssueRepository();
  const resolutionRepo = new FakeResolutionRepository();

  await expect(
    resolveIssueUseCase(
      "missing",
      {
        issueId: "missing",
        rootCause: "x",
        prevention: "y",
        resolvedAt: new Date(),
      },
      issueRepo,
      resolutionRepo,
    ),
  ).rejects.toThrow(IssueNotFoundError);
});
