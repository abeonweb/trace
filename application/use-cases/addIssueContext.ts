import { IssueContext } from "@/domain/IssueContext/issueContext";
import { IssueContextRepository } from "../ports/IssueContextRepository";

export async function addIssueContext(context:IssueContext, repo:IssueContextRepository): Promise<void> {
    await repo.save(context);
}