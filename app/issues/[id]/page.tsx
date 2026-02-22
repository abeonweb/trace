import ResolveForm from "@/components/issues/ResolveForm";
import StatusBadge from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/utils/utils";
import { getIssueDetail } from "@/lib/queries/issueDetail";
import { notFound } from "next/navigation";

export const runtime = "nodejs";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const detail = await getIssueDetail(id);
  if (!detail) notFound();

  const { issue, resolution } = detail;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">Trace</div>
        <h1 className="text-2xl font-semibold">{issue.title}</h1>

        <div className="flex flex-wrap items-center gap-2 trxt-sm text-muted-foreground">
          <span>{issue.project}</span>
          <span>-</span>
          <StatusBadge status={issue.status} />
          <span>-</span>
          <span>{formatDate(issue.createdAt)}</span>
          <span>-</span>
          <span className="font-mono">{issue.id.slice(0, 8)}</span>
        </div>
      </div>

      <Card className="mt-6 rounded-xl p-4">
        <div className="text-sm font-medium">Description</div>
        <div className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">
          {issue.description}
        </div>
      </Card>

      {issue.status === "resolved" && resolution ? (
        <Card className="mt-4 rounded-xl p-4">
          <div className="text-sm font-medium">Resolution</div>
          <div className="mt-3 space-y-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Root cause</div>
              <div className="mt-1 whitespace-pre-wrap">
                {resolution.rootCause}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Prevention</div>
              <div className="mt-1 whitespace-pre-wrap">
                {resolution.prevention}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Resolved: {formatDate(resolution.resolvedAt)}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mt-4 rounded-xl p-4">
          <div className="text-sm font-medium">Resolve</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Capture the root cause and the prevention so this doesn&apos;t cost
            the team time again.
          </div>

          <div className="mt-4">
            <ResolveForm issueId={issue.id} />
          </div>
        </Card>
      )}
    </main>
  );
}
