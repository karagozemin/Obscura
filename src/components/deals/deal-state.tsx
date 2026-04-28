export const dealStateLabels = ["Open", "Funding", "Funded", "Repaid", "Claimed"] as const;

const stateStyles: Record<number, string> = {
  0: "border-border-2 bg-surface-2 text-text-2",
  1: "border-purple/30 bg-purple-subtle text-gold",
  2: "border-success/25 bg-success-bg text-success",
  3: "border-blue-500/25 bg-blue-950/40 text-blue-400",
  4: "border-platinum/20 bg-surface-2 text-platinum",
};

const stateDots: Record<number, string> = {
  0: "bg-text-3",
  1: "bg-gold animate-pulse",
  2: "bg-success animate-pulse",
  3: "bg-blue-400",
  4: "bg-platinum",
};

export function DealStateBadge({ state }: { state: number }) {
  const label = dealStateLabels[state] ?? "Unknown";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${stateStyles[state] ?? stateStyles[0]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${stateDots[state] ?? stateDots[0]}`} />
      {label}
    </span>
  );
}
