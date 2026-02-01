import { Resolution } from "./resolution/resolution";
import { Issue } from "./issue/issue";
import { InvalidResolutionError, IssueAlreadyResolvedError, IssueResolutionMismatchError } from "./errors";

export function resolveIssueDomain(
  issue: Issue,
  resolution: Resolution,
): Issue {
  if (issue.status === "resolved") {
    throw new IssueAlreadyResolvedError(issue.id);
  }
  if (!resolution.rootCause) {
    throw new InvalidResolutionError();
  }
  if (resolution.issueId !== issue.id) {
    throw new IssueResolutionMismatchError();
  }

  return {
    ...issue,
    status: "resolved",
  };
}
