import { Issue, IssueStatus } from "../../domain/issue/issue";
import { IssueRepository } from "../../application/ports/IssueRepository";
import { PrismaClient } from "@prisma/client/extension";
import { IssueAlreadyResolvedError } from "../../domain/errors";
import { Prisma } from "../generated/prisma/client";
import { mapIssueToDomain } from "../prisma/mappers/mapIssueToDomain";

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

  async search(
    query: string,
    options?: { project?: string; sort?: "relevance" | "recent" },
  ): Promise<Issue[]> {
    const project = options?.project;
    const sort = options?.sort ?? "relevance";

    const results = await this.prisma.$queryRaw<
      {
        id: string;
        project: string;
        title: string;
        description: string;
        status: string;
        created_at: Date;
      }[]
    >`
      SELECT *
      FROM issues
      WHERE to_tsvector('english', title || ' ' || description)
       @@ plainto_tsquery('english', ${query})
       AND (${project} IS NULL OR project = ${project})
       ${
         sort === "recent" ? Prisma.sql`ORDER BY created_at DESC` : Prisma.sql``
       }
    `;

    return results.map(mapIssueToDomain);
  }
}
