import { PrismaIssueRepository } from "@/lib/db/prismaIssueRepository";
import { PrismaResolutionRepository } from "@/lib/db/prismaResolutionRepository";
import prisma from "./prisma";

export const issueRepo = new PrismaIssueRepository(prisma);
export const resolutionRepo = new PrismaResolutionRepository(prisma);
