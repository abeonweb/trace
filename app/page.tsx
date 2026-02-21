import Filters from "@/components/search/Filters";
import { IssueList } from "@/components/search/IssueList";
import { Pagination } from "@/components/search/Pagination";
import SearchBar from "@/components/search/SearchBar";
import { searchIssues } from "@/lib/queries/issues";
import { SearchSort } from "@/types/issue";

export const runtime = "nodejs";

function asString(v: unknown) {
  return typeof v === "string" ? v : "";
}

function asInt(v: unknown, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = asString(sp.q).trim();
  const project = asString(sp.project).trim() || undefined;
  const sort = (asString(sp.sort) as SearchSort) || undefined;
  const limit = Math.min(Math.max(asInt(sp.limit, 20), 1), 50);
  const offset = Math.max(asInt(sp.offset, 0), 0);
  const results = await searchIssues({ q, project, sort, limit, offset });

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <div className="text-sm text-muted-foreground">Trace</div>
        <h1 className="text-2xl font-semibold">Search</h1>
      </div>
      <div className="space-y-4">
        <SearchBar/>
        <Filters />
      </div>
      <IssueList results={results} />

      <Pagination
        q={q}
        project={project}
        sort={sort}
        limit={limit}
        offset={offset}
        resultsCount={results.length}
      />
    </main>
  );
}
