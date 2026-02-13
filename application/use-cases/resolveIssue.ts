import { Resolution } from "../../domain/resolution/resolution";
import { IssueRepository } from "../ports/IssueRepository";
import { Issue } from "../../domain/issue/issue";
import { resolveIssueDomain } from "../../domain/resolveIssueDomain";
import { ResolutionRepository } from "../ports/ResolutionRepository";
import { IssueNotFoundError } from "../../domain/errors";
import { log, logError } from "@/lib/observability/logger";

export async function resolveIssueUseCase(
  issueId: string,
  resolution: Resolution,
  issueRepo: IssueRepository,
  resolutionRepo: ResolutionRepository,
): Promise<Issue> {
  const started = performance.now();
  try {
    log("info", "resolveIssueUseCase.start", {
      useCase: "resolveIssue",
      meta: { issueId },
    });
    const issue = await issueRepo.getById(issueId);
    if (!issue) throw new IssueNotFoundError(issueId);
    
    log("info", "resolveIssueUseCase.ok", {
      useCase: "resolveIssue",
      durationMs: Math.round(performance.now() - started),
      meta: { issueId },
    });
    
    if (resolution.issueId !== issueId) {
      throw new Error("Resolution issueId must match path issueId");
    }

    const resolved = resolveIssueDomain(issue, resolution);

    await issueRepo.update(resolved);
    await resolutionRepo.save(resolution);

    return resolved;
  } catch (error) {
    logError("resolveIssueUseCase.failed", error, {
      useCase: "resolveIssue",
      durationMs: Math.round(performance.now() - started),
      meta: { issueId },
    });
    throw error;
  }
}
