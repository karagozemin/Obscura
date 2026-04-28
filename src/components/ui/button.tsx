import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "outline";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function buttonStyles({
  variant = "primary",
  className
}: {
  variant?: ButtonVariant;
  className?: string;
}) {
  return cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
    variant === "primary" && "bg-accent text-white hover:bg-accent/90 shadow-glow",
    variant === "outline" &&
      "border border-border bg-transparent text-white hover:bg-white/5",
    variant === "ghost" && "bg-transparent text-white hover:bg-white/5",
    className
  );
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={buttonStyles({ variant, className })} {...props} />;
}
