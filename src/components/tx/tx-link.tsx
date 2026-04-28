import { txUrl } from "@/lib/explorer";

export function TxLink({ hash }: { hash?: `0x${string}` }) {
  if (!hash) return null;
  return (
    <a
      href={txUrl(hash)}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-gold transition-colors hover:border-purple/30 hover:text-purple-bright"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-success" />
      View tx ↗
    </a>
  );
}
