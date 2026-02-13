import { Issue } from "@/domain/issue/issue";

export type IssueSearchOptions = {
  project?: string;
  sort?: "relevance" | "recent";
  limit?: number;
  offset?: number;
};

export interface IssueRepository {
  getById(id: string): Promise<Issue | null>;
  save(issue: Issue): Promise<void>;
  update(issue: Issue): Promise<void>;
  search(query: string, options: IssueSearchOptions): Promise<Issue[]>;
}
