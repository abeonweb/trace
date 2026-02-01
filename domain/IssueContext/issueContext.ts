export type IssueContextType =
   "commit"
  | "pull_request"
  | "file"
  | "log"
  | "url";

export type IssueContext = {
  readonly id: string;
  readonly issueId: string;
  readonly type: IssueContextType;
  readonly value: string;
};
