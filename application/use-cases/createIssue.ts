import { Issue } from "@/domain/issue/issue";
import { IssueRepository } from "../ports/IssueRepository";

export async function createIssue(
  issue: Issue,
  repo: IssueRepository,
): Promise<void> {
  await repo.save(issue);
}
