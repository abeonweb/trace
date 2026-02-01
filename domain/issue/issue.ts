export type IssueStatus = "open" | "resolved";

export type Issue = {
    readonly project: string;
    readonly createdAt: Date;
    readonly title: string;
    readonly id: string;
    readonly description: string;
    readonly status: IssueStatus;
}