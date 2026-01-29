import  prisma  from "./prisma";
import { IssueRepository } from "../../application/issue/issueRepository";

export const prismaIssueRepository: IssueRepository = {
  async getById(id) {
    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) return null;

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      status: issue.status as "open" | "resolved",
    };
  },

  async save(issue) {
    await prisma.issue.upsert({
      where: { id: issue.id },
      update: issue,
      create: issue,
    });
  },

  async saveResolution(resolution) {
    await prisma.resolution.create({ data: resolution });
  },
};
