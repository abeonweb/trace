import { PrismaIssueRepository } from "@/lib/db/prismaIssueRepository";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { closeDb, prisma, resetDb } from "./db";
import { beforeEach } from "node:test";
import { PrismaResolutionRepository } from "@/lib/db/prismaResolutionRepository";
import { resolveIssueUseCase } from "@/application/use-cases/resolveIssue";
import { Issue } from "@/domain/issue/issue";

describe("PrismaIssueRepository", () => {
  const repo = new PrismaIssueRepository(prisma);

  beforeAll(async () => {
    await resetDb();
  });

  beforeEach(async () => {
    await resetDb();
  });

  afterAll(async () => {
    await closeDb();
  });

  it("saves and fetches by id", async () => {
    await repo.save({
      id: "i-1",
      project: "trace",
      title: "Timed out",
      description: "DB timeout",
      status: "open",
      createdAt: new Date(),
    });

    const fetched = await repo.getById("i-1");
    expect(fetched).not.toBeNull();
    expect(fetched?.id).toBe("i-1");
    expect(fetched?.status).toBe("open");
  });

  it("resolves issue and persists resolution", async () => {
    const issueRepo = new PrismaIssueRepository(prisma);
    const resolutionRepo = new PrismaResolutionRepository(prisma);

    await repo.save({
      id: "i-2",
      project: "trace",
      title: "Crasht",
      description: "App crashes on login",
      status: "open",
      createdAt: new Date(),
    });

    const resolution = {
      issueId: "i-2",
      rootCause: "Null session",
      prevention: "Guard clause",
      resolvedAt: new Date(),
    };

    const resolved = await resolveIssueUseCase(
      "i-2",
      resolution,
      issueRepo,
      resolutionRepo,
    );

    expect(resolved.status).toBe("resolved");

    // DB truth check (using Prisma Client models)
    const dbIssue = await prisma.issue.findUnique({ where: { id: "i-2" } });
    expect(dbIssue?.status).toBe("resolved");

    const dbRes = await prisma.resolution.findUnique({
      where: { issueId: "i-2" },
    });
    expect(dbRes?.rootCause).toBe("Null session");
  });

  it("searches issues by text (FTS)", async () => {
    const repo = new PrismaIssueRepository(prisma);

    await repo.save({
      id: "i-3",
      project: "trace",
      title: "Login error",
      description: "Timeout when hitting auth service",
      status: "open",
      createdAt: new Date(),
    });

    const results = await repo.search("timeout", {
      project: "trace",
      sort: "relevance",
    });
    expect(results.some((i) => i.id === "i-3")).toBe(true);
  });

  it("resolves search based on ranking relevance (title  over description", async () => {
    const repo = new PrismaIssueRepository(prisma);
    const issueA: Issue = {
      id: "i-4",
      project: "trace",
      title: "Login",
      description: "Timeout when hitting auth service",
      status: "open",
      createdAt: new Date(),
    };

    const issueB: Issue = {
      id: "i-5",
      project: "trace",
      title: "Random timeout",
      description: "seemingly random",
      status: "open",
      createdAt: new Date(),
    };

    await repo.save(issueA);
    await repo.save(issueB);

    const searchResults = await repo.search("timeout", { project: "trace" });
    expect(searchResults).not.toBeNull();
    expect(searchResults.length).toBeGreaterThan(1);
    expect(searchResults[0]?.id).toBe("i-5");
  });

  it("search returns recent when query is empty", async ()=>{
    const repo = new PrismaIssueRepository(prisma);
    const searchResults = await repo.search("", {project:"trace"})
    expect(searchResults).not.toBeNull()
    expect(searchResults.length).toBeGreaterThan(1)

  })
});
