import { IssueRepository } from "@/application/ports/IssueRepository";
import { ResolutionRepository } from "@/application/ports/ResolutionRepository";
import { resolveIssueUseCase } from "@/application/use-cases/resolveIssue";
import {
  InvalidResolutionError,
  IssueAlreadyResolvedError,
  IssueNotFoundError,
} from "@/domain/errors";
import { log, logError } from "@/lib/observability/logger";
import { getRequestId } from "@/lib/observability/request";
import { NextResponse } from "next/server";

type ResolveBody = Partial<{ rootCause: string; prevention: string }>;

export function makeResolveIssueHandler(deps: {
  issueRepo: IssueRepository;
  resolutionRepo: ResolutionRepository;
}) {
  return {
    async POST(
      req: Request,
      ctx: { params: { id: string } },
    ): Promise<Response> {
      const requestId = getRequestId(req);
      const started = performance.now();
      const path = new URL(req.url).pathname;

      let body: ResolveBody;
      try {
        body = (await req.json()) as ResolveBody;
      } catch (error) {
        const durationMS = Math.round(performance.now() - started);

        log("warn", "resolveIssue.bad_json", {
          requestId,
          route: "/api/issues/[id]",
          method: "POST",
          path,
          durationMS,
        });

        return NextResponse.json(
          { message: "Invalid JSON body" },
          { status: 400 },
        );
      }
      const { rootCause, prevention } = body ?? {};
      if (!rootCause || !prevention) {
        const durationMS = Math.round(performance.now() - started);
        log("warn", "resolveIssue.client_error", {
          requestId,
          route: "/api/issues/[id]",
          path,
          method: "POST",
          durationMS,
          meta: {
            useCase: "resolveIssue",
            missingRootCause: !rootCause,
            missingPrevention: !prevention,
          },
        });

        return NextResponse.json(
          { message: "rootCause and prevention are required" },
          { status: 400 },
        );
      }

      const issueId = ctx.params.id;
      try {
        // create resolution object
        const resolution = {
          issueId,
          rootCause,
          prevention,
          resolvedAt: new Date(),
        };

        const resolved = await resolveIssueUseCase(
          issueId,
          resolution,
          deps.issueRepo,
          deps.resolutionRepo,
        );
        const durationMs = Math.round(performance.now() - started);

        log("info", "resolveIssue.ok", {
          requestId,
          route: "/api/issues/[id]",
          path,
          method: "POST",
          durationMs,
          meta: { issueId },
        });

        return NextResponse.json({ issue: resolved }, { status: 200 });
      } catch (error: unknown) {
        const durationMS = Math.round(performance.now() - started);

        // Known domain/app errors -> 4xx (warn)
        if (error instanceof IssueNotFoundError) {
          log("warn", "resolveIssue.not_found", {
            requestId,
            route: "/api/issues/[id]",
            method: "POST",
            path,
            durationMS,
            meta: { issueId },
          });
          return NextResponse.json({ message: error.message }, { status: 404 });
        }

        if (error instanceof IssueAlreadyResolvedError) {
          log("warn", "resolveIssue.already_resolved", {
            requestId,
            route: "/api/issues/[id]",
            method: "POST",
            path,
            durationMS,
            meta: { issueId },
          });
          return NextResponse.json({ message: error.message }, { status: 409 });
        }

        if (error instanceof InvalidResolutionError) {
          log("warn", "resolveIssue.invalid_resolution", {
            requestId,
            route: "/api/issues/[id]",
            method: "POST",
            path,
            durationMS,
            meta: { issueId },
          });
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
        logError("resolveIssue.failed", error, {
          requestId,
          route: "/apt/issues/[id]",
          method: "POST",
          path,
          durationMS,
          meta: { issueId },
        });
        return NextResponse.json(
          { message: "Internal server error" },
          { status: 500 },
        );
      }
    },
  };
}
