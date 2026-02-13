import { NextResponse } from "next/server";

function requestId() {
    return crypto.randomUUID();
}

export function middleware(req: Request) {
    const res = NextResponse.next();
    res.headers.set("x-request-id", req.headers.get("x-request-id") ?? requestId())
    return res;
}

// Apply only to API routes
export const config = {
    matcher: ["/api/:path"],
};