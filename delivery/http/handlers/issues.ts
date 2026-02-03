import { IssueRepository } from "../../../application/ports/IssueRepository";
import { createIssue } from "../../../application/use-cases/createIssue";
import { Issue } from "../../../domain/issue/issue";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

type CreateIssueBody = Partial<{
  project: string;
  title: string;
  description: string;
}>;

export function makeIssuesHandlers(deps: { issueRepo: IssueRepository }) {
  return {
    async POST(req: Request): Promise<Response> {
      const body = (await req.json()) as CreateIssueBody;

      const { project, title, description } = body;

      if (!project || !title || !description) {
        return NextResponse.json(
          { message: "project, title, description are required" },
          { status: 400 },
        );
      }

      const issue: Issue = {
        id: randomUUID(),
        project,
        title,
        description,
        status: "open",
        createdAt: new Date(),
      };

      await createIssue(issue, deps.issueRepo);

      return NextResponse.json({ id: issue.id }, { status: 201 });
    },
  };
}
