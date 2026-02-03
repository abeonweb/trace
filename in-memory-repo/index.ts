import { IssueRepository } from "@/application/ports/IssueRepository";
import { ResolutionRepository } from "@/application/ports/ResolutionRepository";
import { Issue } from "@/domain/issue/issue";
import { Resolution } from "@/domain/resolution/resolution";

export class InMemoryIssueRepo implements IssueRepository {
  private store = new Map<string, Issue>();

  async getById(id: string) {
    return this.store.get(id) ?? null;
  }

  async save(issue: Issue) {
    this.store.set(issue.id, issue);
  }

  async update(issue: Issue) {
    this.store.set(issue.id, issue);
  }

  async search(query: string) {
    return Array.from(this.store.values());
  }
}

export class InMemoryResolutionRepo implements ResolutionRepository {
  public saved: Resolution[] = [];

  async save(resolution: Resolution) {
    this.saved.push(resolution);
  }
}
