
type Level = "debug" | "info" | "warn" | "error";

type LogEvent = {
  level: Level
  msg: string;
  ts: string;                 // ISO
  requestId?: string;
  route?: string;             // "/api/issues/search"
  method?: string;            // "GET"
  durationMs?: number;
  useCase?: string;           // "resolveIssue"
  project?: string;
  issueId?: string;
  err?: { name: string; message: string; stack?: string; code?: string };
  meta?: Record<string, unknown>;
};

function nowIso() {
  return new Date().toISOString();
}

function hasErrorCode(err: unknown): err is Error & { code: unknown } {
  return typeof err === "object" && err !== null && "code" in err;
}

function serializeError(err: unknown) {
  if (!(err instanceof Error))
    return { name: "UnknownError", message: String(err) };

  const base = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  }

  if (hasErrorCode(err) && typeof err.code === "string") {
    return {...base, code: err.code };
  }
  return base;
}

export function log(level: Level, msg: string, data?: Record<string, unknown>) {
  const event:LogEvent = {
    level,
    msg,
    ts: nowIso(),
    ...(data ?? {}),
  };

  // Production: JSON logs. 
  // Dev: still JSON.
  console.log(JSON.stringify(event));
}

export function logError(
  msg: string,
  err: unknown,
  data?: Record<string, unknown>,
) {
  log("error", msg, { ...(data ?? {}), err: serializeError(err) });
}
