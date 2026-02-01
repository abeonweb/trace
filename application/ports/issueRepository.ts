import { Issue } from "@/domain/issue/issue";

export interface IssueRepository {
  getById(id: string): Promise<Issue | null>;
  save(issue: Issue): Promise<void>;
  update(issue: Issue): Promise<void>;
  search(query: string): Promise<Issue[]>;
}
