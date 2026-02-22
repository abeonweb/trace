import { getRequestId } from "@/utils/observability/request";
import { IssueRepository } from "../../../application/ports/IssueRepository";
import { createIssue } from "../../../application/use-cases/createIssue";
import { Issue } from "../../../domain/issue/issue";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { log, logError } from "@/utils/observability/logger";
import { getOrgId } from "@/lib/config";

type CreateIssueBody = Partial<{
  project: string;
  title: string;
  description: string;
}>;

export function makeIssuesHandlers(deps: { issueRepo: IssueRepository }) {
  return {
    async POST(req: Request): Promise<Response> {
      const started = performance.now();
      const requestId = getRequestId(req);
      const path = new URL(req.url).pathname;

      let body: CreateIssueBody;

      try {
        body = (await req.json()) as CreateIssueBody;
      } catch (error) {
        console.log("create issue error", error);
        const durationMS = Math.round(performance.now() - started);

        log("warn", "createIssue.bad_json", {
          requestId,
          route: "/api/issues",
          method: "POST",
          durationMS,
        });
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
      }
      const { project, title, description } = body;

      if (!project || !title || !description) {
        const durationMS = Math.round(performance.now() - started);
        log("warn", "createIssue.validation_failed", {
          requestId,
          route: "/api/issue",
          method: "POST",
          path,
          durationMS,
          meta: {
            missingProject: !project,
            missigTitle: !title,
            missingDescription: !description,
          },
        });

        return NextResponse.json(
          { message: "project, title, description are required" },
          { status: 400 },
        );
      }

      const issue: Issue = {
        id: randomUUID(),
        organizationId: getOrgId(),
        project,
        title,
        description,
        status: "open",
        createdAt: new Date(),
      };
      try {
        await createIssue(issue, deps.issueRepo);
        const durationMs = Math.round(performance.now() - started);
        log("info", "createIssue.ok", {
          requestId,
          route: "/api/issues",
          method: "POST",
          durationMs,
          meta: {
            issueId: issue.id,
            project: issue.project,
          },
        });
        return NextResponse.json({ id: issue.id }, { status: 201 });
      } catch (error: unknown) {
        const durationMs = Math.round(performance.now() - started);
        logError("createIssue.failed", error, {
          requestId,
          route: "/api/issues",
          method: "POST",
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
