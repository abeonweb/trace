import { Pool } from "pg";
import { PrismaClient } from "../../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({connectionString: process.env.DATABASE_URL});
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({adapter});

export async function resetDb() {
    // Order metters (FK constraints)
    // Adjust names to match your Prisma CLIENT model names
    await prisma.issueContext.deleteMany();
    await prisma.resolution.deleteMany();
    await prisma.issue.deleteMany();
}

export async function closeDb() {
    await prisma.$disconnect();
    await pool.end();
}