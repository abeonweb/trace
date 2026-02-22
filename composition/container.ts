import { PrismaIssueRepository } from "@/lib/db/prismaIssueRepository";
import { PrismaResolutionRepository } from "@/lib/db/prismaResolutionRepository";
import prisma from "./prisma";
import { getOrgId } from "@/lib/config";

const orgId = getOrgId();

export const issueRepo = new PrismaIssueRepository(prisma, orgId);
export const resolutionRepo = new PrismaResolutionRepository(prisma);
