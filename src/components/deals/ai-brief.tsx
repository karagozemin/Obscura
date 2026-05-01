"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AiBriefProps {
  title: string;
  category: string;
  description: string;
  maturityDate: bigint;
  documentHash: string;
}

export function AiBrief({ title, category, description, maturityDate, documentHash }: AiBriefProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    setText("");
    setDone(false);
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, description, maturityDate: maturityDate.toString(), documentHash }),
      });

      if (!res.ok || !res.body) {
        setError("AI brief unavailable.");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        setText((prev) => prev + decoder.decode(value, { stream: true }));
      }

      setDone(true);
    } catch {
      setError("Failed to generate brief.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-border pt-5 mt-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-text-1">
            AI Due Diligence Brief
          </p>
          <span className="text-[10px] font-medium text-text-3 border border-border rounded px-1.5 py-0.5">
            ChainGPT
          </span>
        </div>
        {!loading && (
          <Button variant="outline" size="sm" onClick={generate}>
            {done ? "Regenerate" : "Generate Brief"}
          </Button>
        )}
        {loading && (
          <span className="text-xs text-text-3 animate-pulse">Analyzing…</span>
        )}
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}

      {(text || loading) && (
        <div className="rounded-lg border border-border bg-surface p-4 text-sm text-text-2 leading-relaxed whitespace-pre-wrap">
          {text}
          {loading && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-text-2 animate-pulse align-middle" />}
        </div>
      )}
    </div>
  );
}
