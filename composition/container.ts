import { PrismaIssueRepository } from "@/lib/db/prismaIssueRepository";
import { PrismaResolutionRepository } from "@/lib/db/prismaResolutionRepository";
import { PrismaClient } from "@prisma/client/extension";

export const prisma = new PrismaClient();

export const issueRepo = new PrismaIssueRepository(prisma);
export const resolutionRepo = new PrismaResolutionRepository(prisma);
