import { Issue } from "@/domain/issue/issue";
import { Resolution } from "@/domain/resolution/resolution";

export interface IssueRepository {
    getById(id: string): Promise<Issue | null>;
    save(issue: Issue): Promise<void>
    saveResolution(resolution: Resolution): Promise<void>
}