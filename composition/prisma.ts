import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Defensive initialization: prefer adapter when a valid DATABASE_URL exists
// but fall back to a plain PrismaClient if the adapter or DB isn't available.
let prisma: PrismaClient;

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  // No DB URL available in environment — don't attempt adapter initialization.
  // This prevents runtime errors when running in environments without a DB.

  console.warn(
    "DATABASE_URL not set — initializing PrismaClient without adapter",
  );
  prisma = globalForPrisma.prisma || new PrismaClient();
} else {
  try {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
  } catch (err) {
    // If adapter initialization fails for any reason, log and fall back.

    console.error(
      "Prisma adapter initialization failed, falling back to plain PrismaClient:",
      err,
    );
    prisma = globalForPrisma.prisma || new PrismaClient();
  }
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
