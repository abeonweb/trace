import { issueRepo } from "@/composition/container";
import { IssueDTO , IssueStatus, SearchSort} from "../../types/issue";



export async function searchIssues(args: {
  q: string;
  project?: string;
  sort?: SearchSort;
  limit?: number;
  offset?: number;
}): Promise<IssueDTO[]> {
  const issues = await issueRepo.search(args.q, {
    project: args.project,
    sort: args.sort,
    limit: args.limit,
    offset: args.offset,
  });

  return issues.map((i) => ({
    id: i.id,
    organizationId: i.organizationId,
    project: i.project,
    title: i.title,
    description: i.description,
    status: i.status as IssueStatus,
    createdAt: i.createdAt.toISOString(),
  }));
}
