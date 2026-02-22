import { IssueRepository } from "@/application/ports/IssueRepository";
import { log, logError } from "@/utils/observability/logger";
import { getRequestId } from "@/utils/observability/request";
import { NextResponse } from "next/server";

type Sort = "relevance" | "recent";

export function makeSearchIssuesHandlers(deps: { issueRepo: IssueRepository }) {
  return {
    async GET(req: Request): Promise<Response> {
      const requestId = getRequestId(req);
      const started = performance.now();

      try {
        const { searchParams } = new URL(req.url);

        const q = searchParams.get("q") ?? "";
        const project = searchParams.get("project") ?? undefined;
        const sort = (searchParams.get("sort") as Sort | null) ?? "relevance";
        const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
        const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

        const results = await deps.issueRepo.search(q, {
          project,
          sort,
          limit,
          offset,
        });

        const durationMs = Math.round(performance.now() - started);
        log("info", "searchIssues.ok", {
          requestId,
          route: "/api/issues/search",
          method: "GET",
          durationMs,
          meta: {
            qlen: q.length,
            project,
            sort: sort ?? (q ? "relevance" : "recent"),
            limit,
            offset,
            results: results.length,
          },
        });

        return NextResponse.json({ results }, { status: 200 });
      } catch (error: unknown) {
        const durationMs = Math.round(performance.now() - started);
        logError("searchIssues.failed", error, {
          requestId,
          route: "/api/issues/search",
          method: "GET",
          durationMs,
        });

        return NextResponse.json(
          { message: "Internal server error" },
          { status: 500 },
        );
      }
    },
  };
}
