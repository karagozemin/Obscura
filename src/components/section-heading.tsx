import { ReactNode } from "react";

export function SectionHeading({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      {description ? <p className="text-white/70">{description}</p> : null}
    </div>
  );
}
