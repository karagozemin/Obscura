import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-border bg-surface/60 px-3 py-2 text-sm text-white placeholder:text-white/40",
        className
      )}
      {...props}
    />
  );
}
