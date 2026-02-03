import { IssueRepository } from "@/application/ports/IssueRepository";
import { ResolutionRepository } from "@/application/ports/ResolutionRepository";
import { resolveIssueUseCase } from "@/application/use-cases/resolveIssue";
import {
  InvalidResolutionError,
  IssueAlreadyResolvedError,
} from "@/domain/errors";
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
      const body = (await req.json()) as ResolveBody;
      const { rootCause, prevention } = body;

      if (!rootCause || !prevention) {
        return NextResponse.json(
          { message: "rootCause and prevention are required" },
          { status: 400 },
        );
      }

      try {
        const issueId = ctx.params.id;

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

        return NextResponse.json({ issue: resolved }, { status: 200 });
      } catch (error: unknown) {
        if (error instanceof InvalidResolutionError) {
          return NextResponse.json({ message: error.message }, { status: 404 });
        }

        if (error instanceof IssueAlreadyResolvedError) {
          NextResponse.json({ message: error.message }, { status: 409 });
        }

        if (error instanceof InvalidResolutionError) {
          NextResponse.json({ message: error.message }, { status: 400 });
        }
        return NextResponse.json(
          { message: "Internal server error" },
          { status: 500 },
        );
      }
    },
  };
}
