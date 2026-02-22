import { issueRepo, resolutionRepo } from "@/composition/container";
import { IssueDetailDTO } from "@/types/issue";

export async function getIssueDetail(
  issueId: string,
): Promise<IssueDetailDTO | null> {
  const issue = await issueRepo.getById(issueId);
  if (!issue) return null;

  const resolution = await resolutionRepo.getByIssueId(issueId);

  return {
    issue: {
      id: issue.id,
      organizationId: issue.organizationId,
      project: issue.project,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      createdAt: issue.createdAt.toISOString(),
    },
    resolution: resolution
      ? {
          issueId: resolution.issueId,
          rootCause: resolution.rootCause,
          prevention: resolution.prevention,
          resolvedAt: resolution.resolvedAt.toISOString(),
        }
      : null,
  };
}
