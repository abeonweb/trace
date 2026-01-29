import { resolveIssue } from "../../domain/resolveIssue";
import { IssueRepository } from "./issueRepository";
import { Resolution } from "../../domain/resolution/resolution";

export async function resolveIssueUseCase(
    issueId: string,
    resolution: Resolution,
    repo: IssueRepository
) {
    const issue = await repo.getById(issueId)
    if (!issue) {
        throw new Error("Issue not found");
    }

    if (issue.status === "resolved"){
        throw new Error("This issue is already resolved")
    }

    if (issue.id !== resolution.issueId){
        throw new Error("The resolution is not a match for this issue")
    }

    const resolved = resolveIssue(issue, resolution);

    await repo.save(resolved);
    await repo.saveResolution(resolution);

    return resolved;
}