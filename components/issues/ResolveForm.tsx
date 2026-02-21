"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ResolveForm({ issueId }: { issueId: string }) {
  const router = useRouter();
  const [rootCause, setRootCause] = useState<string>("");
  const [prevention, setPrevention] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!rootCause.trim() || !prevention.trim()) {
      setError("rootCause and prevention are required");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rootCause, prevention }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
        };
        throw new Error(data?.message ?? "Resolve failed");
      }

      //   refresh server page data (issue becomes resolved)
      router.refresh();
      setRootCause("");
      setPrevention("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Resolve failed");
    } finally {
        setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">

 <div className="space-y-2">
        <div className="text-xs text-muted-foreground">Root cause</div>
        <Textarea
          value={rootCause}
          onChange={(e) => setRootCause(e.target.value)}
          placeholder="What actually caused the issue?"
          className="min-h-24"
        />
      </div>

      <div className="space-y-2">
        <div className="text-xs text-muted-foreground">Prevention</div>
        <Textarea
          value={prevention}
          onChange={(e) => setPrevention(e.target.value)}
          placeholder="How do we prevent this class of issue?"
          className="min-h-24"
        />
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Resolving…" : "Resolve issue"}
      </Button>
    </form>
  )
}
