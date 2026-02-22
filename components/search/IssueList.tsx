import type { IssueDTO } from "@/types/issue";
import Link from "next/link";
import { Card } from "../ui/card";
import { formatDate } from "@/utils/utils";
import StatusBadge from "../StatusBadge";

export function IssueList({ results }: { results: IssueDTO[] }) {
  if (results.length === 0) {
    return (
      <div className="mt-6 text-sm text-muted-foreground">
        No results. Try different keywords or remove filters
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {results.map((i) => (
        <Link key={i.id} href={`/issues/${i.id}`}>
          <Card className="rounded-xl p-4 hover:bg-muted/40">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-base font-medium">{i.title}</div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{i.project}</span>
                  <span>·</span>
                  <StatusBadge status={i.status} />
                  <span>·</span>
                  <span>{formatDate(i.createdAt)}</span>
                </div>

                <div className="mt-2 line-clamp-2 text-sm text-foreground/80">
                  {i.description}
                </div>
              </div>

              <div className="shrink-0 text-xs text-muted-foreground">
                {i.id.slice(0, 8)}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
