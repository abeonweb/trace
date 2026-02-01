import { IssueContext } from "@/domain/IssueContext/issueContext";

export interface IssueContextRepository {
    save(context: IssueContext): Promise<void>
}