import { Resolution } from "./resolution/resolution";
import { Issue } from "./issue/issue";

export function resolveIssue(issue: Issue, resolution: Resolution): Issue {
  if (issue.status ==="resolved") {
    throw new Error("The issue is already resolved");
  }
  if (!resolution.rootCause) {
    throw new Error("Root cause is required to resolve an issue");
  }
  if (resolution.issueId !== issue.id) {
    throw new Error("The resolution does not match the issue");
  }
  return {
    ...issue,
    status: "resolved",
  };
}
