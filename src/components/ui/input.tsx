import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-text-1",
        "placeholder:text-text-3",
        "focus:border-purple/30 focus:outline-none focus:ring-2 focus:ring-purple/10",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        "transition-colors duration-150",
        className
      )}
      {...props}
    />
  );
}
