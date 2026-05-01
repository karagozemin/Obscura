"use client";

import { useHandleClient } from "@/lib/nox-handle";
import { useEffect, useState } from "react";
import { formatToken } from "@/lib/format";

const ZERO_HANDLE = "0x0000000000000000000000000000000000000000000000000000000000000000";

export function EncryptedAmount({ handle }: { handle?: `0x${string}` }) {
  const handleClient = useHandleClient();
  const [value, setValue] = useState<bigint | null>(null);
  const [status, setStatus] = useState<"idle" | "decrypting" | "error">("idle");

  useEffect(() => {
    if (!handleClient || !handle || handle === ZERO_HANDLE) {
      setValue(null);
      return;
    }
    let mounted = true;
    setStatus("decrypting");

    const run = async () => {
      try {
        const result = await handleClient.decrypt(handle);
        if (mounted) {
          setValue(result.value as bigint);
          setStatus("idle");
        }
      } catch {
        if (mounted) setStatus("error");
      }
    };

    void run();
    return () => { mounted = false; };
  }, [handle, handleClient]);

  if (!handle || handle === ZERO_HANDLE) return <span className="text-xs text-white/60">—</span>;

  if (status === "decrypting") {
    return <span className="text-xs text-white/60">Decrypting...</span>;
  }

  if (status === "error") {
    return <span className="text-xs text-white/60">Auditor access required to decrypt</span>;
  }

  return <span className="text-xs text-white/80">{formatToken(value ?? undefined)} CT</span>;
}
