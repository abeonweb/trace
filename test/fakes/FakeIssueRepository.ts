import type {
  IssueRepository,
  IssueSearchOptions,
} from "../../application/ports/IssueRepository";
import { Issue } from "../../domain/issue/issue";

export class FakeIssueRepository implements IssueRepository {
  private issues = new Map<string, Issue>();

  async getById(id: string): Promise<Issue | null> {
    return this.issues.get(id) ?? null;
  }

  async save(issue: Issue) {
    this.issues.set(issue.id, issue);
  }

  async update(issue: Issue): Promise<void> {
    this.issues.set(issue.id, issue);
  }

  async search(query: string, options?: IssueSearchOptions): Promise<Issue[]> {
    const q = query.trim().toLowerCase();
    const project = options?.project;

    const values = Array.from(this.issues.values());

    const filtered = values.filter((i) => {
      if (project && i.project !== project) return false;
      if (!q) return true;
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
      );
    });

    if (options?.sort === "recent") {
      return filtered.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    }

    // "relevance" (simple heuristic for fake)
    return filtered;
  }
}
