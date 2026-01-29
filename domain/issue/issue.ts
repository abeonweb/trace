export type IssueStatus = "open" | "resolved";

export type Issue = {
    title: string;
    readonly id: string;
    description: string;
    status: IssueStatus;
}