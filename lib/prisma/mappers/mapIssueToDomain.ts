import { Issue, IssueStatus } from "../../../domain/issue/issue";

type IssueRow = {
  id: string;
  project: string;
  title: string;
  description: string;
  status: string;
  created_at: Date;
};

export function mapIssueToDomain(row: IssueRow): Issue {
  return {
    id: row.id,
    project: row.project,
    title: row.title,
    description: row.description,
    status: row.status as IssueStatus,
    createdAt: row.created_at,
  };
}
