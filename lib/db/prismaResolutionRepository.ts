import { ResolutionRepository } from "@/application/ports/ResolutionRepository";
import { Resolution } from "@/domain/resolution/resolution";
import { PrismaClient } from "@prisma/client/extension";
import { Prisma } from "../generated/prisma/client";

export class PrismaResolutionRepository implements ResolutionRepository {
  constructor(private prisma: PrismaClient) {}

  async save(resolution: Resolution) {
    try {
      await this.prisma.resolution.create({
        data: {
          issueId: resolution.issueId,
          rootCause: resolution.rootCause,
          prevention: resolution.prevention,
          resolvedAt: resolution.resolvedAt,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // correctly handle P2002 error
        if (error.code === "P2002") {
          throw new Error(
            `A resolution for the issue ${resolution.issueId} already exists`,
          );
        }
      }
      throw error;
    }
  }
}
