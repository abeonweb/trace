import { prisma } from "@/composition/container";
import { logError } from "@/lib/observability/logger";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // minimal DB check
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    logError("health.failed", error);
    return NextResponse.json({ status: "degraded" }, { status: 503 });
  }
}
