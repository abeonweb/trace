import { Issue } from "@/domain/issue/issue";
import { IssueRepository } from "../ports/issueRepository";

export async function CreateIssue(issue: Issue, repo: IssueRepository): Promise<void>{
    await repo.save(issue)
}