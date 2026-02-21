"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";

function buildUrl(params: URLSearchParams) {
  const queryStr = params.toString();
  return queryStr ? `/?${queryStr}` : "/";
}

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initial = searchParams.get("q") ?? "";
  const [value, setValue] = useState(initial);

  //   to keep input synced when user navigates
  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const debouncedValue = useMemo(() => value.trimStart(), [value]);
  const urlQueryParams = searchParams.toString();
  useEffect(() => {
    const timeId = setTimeout(() => {
      const next = new URLSearchParams(urlQueryParams);

      if (debouncedValue) next.set("q", debouncedValue);
      else next.delete("q");

      //reset pagination when query changes
      next.delete("offset");

      router.replace(buildUrl(next));
    }, 300);

    return () => clearTimeout(timeId);
  }, [debouncedValue, router, urlQueryParams]);

  return (
    <div className="w-full">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search issues"
        className="w-full rounded-xl border px-4 py-3 text-base outline-none focus:ring-2"
        aria-label="Search"
      />
    </div>
  );
};

export default SearchBar;
