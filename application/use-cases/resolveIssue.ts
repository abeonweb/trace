import { Resolution } from "@/domain/resolution/resolution";
import { IssueRepository } from "../ports/issueRepository";
import { Issue } from "@/domain/issue/issue";
import { resolveIssueDomain } from "@/domain/resolveIssueDomain";
import { ResolutionRepository } from "../ports/ResolutionRepository";
import { IssueNotFoundError } from "@/domain/errors";

export async function resolveIssue(
  issueId: string,
  resolution: Resolution,
  issueRepo: IssueRepository,
  resolutionRepo: ResolutionRepository
): Promise<Issue> {
  const issue = await issueRepo.getById(issueId);
  if (!issue) throw new IssueNotFoundError(issueId);

  const resolved = resolveIssueDomain(issue, resolution);

  await issueRepo.update(resolved);
  await resolutionRepo.save(resolution);

  return resolved;
}
