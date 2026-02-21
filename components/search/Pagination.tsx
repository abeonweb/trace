import Link from "next/link";
import { Button } from "../ui/button";

function buildUrl(params: URLSearchParams) {
  const queryStr = params.toString();
  return queryStr ? `/?${queryStr}` : "/";
}

export function Pagination({
  q,
  project,
  sort,
  limit,
  offset,
  resultsCount,
}: {
  q: string;
  project?: string;
  sort?: string;
  limit: number;
  offset: number;
  resultsCount: number;
}) {
  const prevOffset = Math.max(offset - limit, 0);
  const nextOffset = offset - limit;

  const base = new URLSearchParams();
  if (q) base.set("q", q);
  if (project) base.set("project", project);
  if (sort) base.set("sort", sort);
  base.set("limit", String(limit));

  const prev = new URLSearchParams(base);
  prev.set("offset", String(prevOffset));

  const next = new URLSearchParams(base);
  next.set("offset", String(nextOffset));

  const canPrev = offset > 0;
  const canNext = resultsCount === limit; //simple heuristic

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {resultsCount === 0
          ? "Showing 0 results"
          : `Showing ${offset + 1}-${offset + resultsCount}`}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" asChild disabled={!canPrev}>
          <Link href={buildUrl(prev)}>Prev</Link>
        </Button>

        <Button variant="outline" asChild disabled={!canNext}>
          <Link href={buildUrl(next)}>Next</Link>
        </Button>
      </div>
    </div>
  );
}
