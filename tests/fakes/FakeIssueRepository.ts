import { IssueRepository } from "../../application/ports/IssueRepository";
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

  async search(): Promise<Issue[]> {
    return Array.from(this.issues.values());
  }
}
