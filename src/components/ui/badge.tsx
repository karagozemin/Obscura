import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70",
        className
      )}
    >
      {children}
    </span>
  );
}
