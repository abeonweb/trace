import { Issue, IssueStatus } from "../../domain/issue/issue";
import { IssueRepository } from "../../application/ports/IssueRepository";
import { PrismaClient } from "@prisma/client/extension";
import { IssueAlreadyResolvedError } from "../../domain/errors";
import { Prisma } from "../generated/prisma/client";
import { mapIssueToDomain } from "../prisma/mappers/mapIssueToDomain";

type SearchOptions = {
  project?: string;
  sort?: "relevance" | "recent";
  limit?: number;
  offset?: number;
};
export class PrismaIssueRepository implements IssueRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string) {
    const issue = await this.prisma.issue.findUnique({ where: { id } });
    if (!issue) return null;

    return {
      id: issue.id,
      project: issue.project,
      title: issue.title,
      description: issue.description,
      status: issue.status as IssueStatus,
      createdAt: issue.createdAt,
    };
  }

  async save(issue: Issue) {
    await this.prisma.issue.create({
      data: {
        id: issue.id,
        project: issue.project,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        createdAt: issue.createdAt,
      },
    });
  }

  async update(issue: Issue) {
    try {
      await this.prisma.issue.update({
        where: { id: issue.id },
        data: { status: issue.status },
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new IssueAlreadyResolvedError(issue.id);
        }
      }
      throw error;
    }
  }

  async search(query: string, options?: SearchOptions): Promise<Issue[]> {
    const q = query.trim();
    const project = options?.project;

    const limit = Math.min(options?.limit ?? 20, 50);
    const offset = Math.max(options?.offset ?? 0, 0);

    // if there is no query string, act like a recent issues feed
    const sort: "relevance" | "recent" =
      options?.sort ?? (q.length > 0 ? "relevance" : "recent");

    const projectFilter = project
      ? Prisma.sql` AND project = ${project}`
      : Prisma.sql``;

    // Recent Mode (q is empty or recent mode explicitly requested)
    if (sort === "recent" || q.length === 0) {
      const rows = await this.prisma.$queryRaw<
        {
          id: string;
          project: string;
          title: string;
          description: string;
          status: string;
          created_at: Date;
        }[]
      >`
        SELECT id, project, title, description, status, created_at
        FROM issues
        WHERE 1=1
        ${projectFilter}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      return rows.map(mapIssueToDomain);
    }
    // Relevance Mode (query provided)
    // Weighted vector: title is more important than description
    const rows = await this.prisma.$queryRaw<
      {
        id: string;
        project: string;
        title: string;
        description: string;
        status: string;
        created_at: Date;
        rank: number;
      }[]
    >`
        SELECT id, project, title, description, status, created_at,
        ts_rank_cd(
        (
          setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(description, '')), 'B') 
        ),
        plainto_tsquery('english', ${q})
        ) AS rank
        FROM issues
        WHERE 
        (
          setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
          setweight(to_tsvector('english', coalesce(description, '')), 'B') 
        ) @@ plainto_tsquery('english', ${q})
        ${projectFilter}
        ORDER BY rank DESC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    ;

    return rows.map(mapIssueToDomain);
  }
}
