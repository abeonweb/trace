export function getOrgId() {
  const orgId = process.env.TRACE_ORG_ID?.trim();
  if (orgId) return orgId;

  const env = process.env.NODE_ENV;
  // strict in CI/tests and production deployments
  if (env === "test" || env === "production") {
    throw new Error("TRACE_ORG_ID is required");
  }

  // local dev default
  return "local";
}
