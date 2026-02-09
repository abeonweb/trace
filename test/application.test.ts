import { describe, expect, it } from "vitest";
import { resolveIssueUseCase } from "../application/use-cases/resolveIssue";
import { Issue } from "@/domain/issue/issue";
import { Resolution } from "../domain/resolution/resolution";
import { InMemoryIssueRepo, InMemoryResolutionRepo } from "../in-memory-repo";

describe("Application layer", () => {
  it("resolve an issue through the application layer", async () => {
    const issueRepo = new InMemoryIssueRepo();
    const resolutionRepo = new InMemoryResolutionRepo();

    const issue: Issue = {
      id: "i-1",
      project: "trace",
      title: "Crash",
      description: "App crashes",
      status: "open",
      createdAt: new Date(),
    };

    await issueRepo.save(issue);

    const resolution: Resolution = {
      issueId: issue.id,
      rootCause: "Null ref",
      prevention: "Guard",
      resolvedAt: new Date(),
    };
    const resolved = await resolveIssueUseCase(
      issue.id,
      resolution,
      issueRepo,
      resolutionRepo,
    );

    expect(resolved.status).toBe("resolved");
  });
});
