import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "elevated" | "gold";
};

export function Card({ className, variant = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "card-shine relative rounded-2xl border p-6 transition-shadow duration-300",
        variant === "default"  && "border-border bg-card shadow-card hover:shadow-card-hover",
        variant === "elevated" && "border-border-2 bg-card-hover shadow-card",
        variant === "gold"     && "border-purple-subtle bg-card shadow-gold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
