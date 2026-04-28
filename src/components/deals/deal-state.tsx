export const dealStateLabels = ["Open", "Funding", "Funded", "Repaid", "Claimed"] as const;

export function DealStateBadge({ state }: { state: number }) {
  const label = dealStateLabels[state] ?? "Unknown";
  return (
    <span className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
      {label}
    </span>
  );
}
