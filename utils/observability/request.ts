export function getRequestId(req: Request) {
  return req.headers.get("x-request-id") ?? "unknown";
}
