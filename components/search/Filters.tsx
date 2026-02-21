"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Sort = "relevance" | "recent";
type SortOrAuto = Sort | "auto";

function buildUrl(params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

const Filters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const project = searchParams.get("project") ?? "";
  const sort = (searchParams.get("sort") as Sort | null) ?? "";

  function setParam(key: string, val: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (val) next.set(key, val);
    else next.delete(key);

    // reset pagination due to filter change
    next.delete("offset");

    router.replace(buildUrl(next));
  }
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Label className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Project</span>
        <Input
          value={project}
          onChange={(e) => setParam("project", e.target.value.trim())}
          placeholder="all"
          className="w-48 rounded-lg border px-3 py-2 outline-none focus:ring-2"
        />
      </Label>

      <Label className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort</span>
        <div className="w-48 rounded-lg border focus:ring-2">
          <Select
            value={(sort ?? "auto") as SortOrAuto}
            onValueChange={(val) =>
              setParam("sort", val === "auto" ? null : val.trim())
            }
          >
            <SelectTrigger className="border-0 px-3 py-2 outline-none rounded-lg">
              <SelectValue placeholder="auto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">auto</SelectItem>
              <SelectItem value="relevance">relevance</SelectItem>
              <SelectItem value="recent">recent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Label>
    </div>
  );
};

export default Filters;
