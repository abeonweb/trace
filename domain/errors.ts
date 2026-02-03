export class IssueAlreadyResolvedError extends Error {
  constructor(issueId: string) {
    super(`Issue '${issueId}' is already resolved`);
  }
}

export class IssueNotFoundError extends Error {
  constructor(issueId: string) {
    super(`Issue '${issueId}' not found`);
  }
}

export class InvalidResolutionError extends Error {
  constructor() {
    super("Resolution requires a root cause");
  }
}

export class IssueResolutionMismatchError extends Error {
  constructor() {
    super("The resolution does not match the issue");
  }
}
