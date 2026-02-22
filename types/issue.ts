export type IssueStatus = "open" | "resolved";
export type SearchSort = "relevance" | "recent";

export type IssueDTO = {
  id: string;
  organizationId: string;
  project: string;
  title: string;
  description: string;
  status: IssueStatus;
  createdAt: string;
};

export type ResolutionDTO = {
  issueId: string;
  rootCause: string;
  prevention: string;
  resolvedAt: string;
};

export type IssueDetailDTO = {
  issue: IssueDTO;
  resolution: ResolutionDTO | null;
};
