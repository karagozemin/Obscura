import { txUrl } from "@/lib/explorer";

export function TxLink({ hash }: { hash?: `0x${string}` | undefined }) {
  if (!hash) return null;
  return (
    <a
      href={txUrl(hash)}
      target="_blank"
      rel="noreferrer"
      className="text-xs text-accent hover:underline"
    >
      View transaction
    </a>
  );
}
