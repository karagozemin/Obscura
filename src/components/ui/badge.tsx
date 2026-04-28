import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type BadgeVariant = "default" | "gold" | "success" | "warning" | "danger" | "outline";

export function Badge({
  className,
  variant = "default",
  children,
}: {
  className?: string;
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variant === "default" && "border border-border bg-surface-2 text-text-2",
        variant === "gold"    && "border border-purple/30 bg-purple-subtle text-gold",
        variant === "success" && "border border-success/20 bg-success-bg text-success",
        variant === "warning" && "border border-warning/20 bg-warning/5 text-warning",
        variant === "danger"  && "border border-danger/20 bg-danger-bg text-danger",
        variant === "outline" && "border border-border-2 bg-transparent text-text-2",
        className
      )}
    >
      {children}
    </span>
  );
}
