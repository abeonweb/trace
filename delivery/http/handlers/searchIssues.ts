import { IssueRepository } from "@/application/ports/IssueRepository";
import { NextResponse } from "next/server";

type Sort = "relevance" | "recent";

export function makeSearchIssuesHandlers(deps: { issueRepo: IssueRepository }) {
  return {
    async GET(req: Request): Promise<Response> {
      const { searchParams } = new URL(req.url);

      const q = searchParams.get("q") ?? "";
      const project = searchParams.get("project") ?? undefined;
      const sort = (searchParams.get("sort") as Sort | null) ?? "relevance";

      const results = await deps.issueRepo.search(q, { project, sort });
      return NextResponse.json({ results }, { status: 200 });
    },
  };
}
