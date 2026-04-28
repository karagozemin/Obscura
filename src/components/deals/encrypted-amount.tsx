"use client";

import { useHandleClient } from "@/lib/nox-handle";
import { useEffect, useState } from "react";
import { formatToken } from "@/lib/format";

export function EncryptedAmount({ handle }: { handle?: `0x${string}` }) {
  const handleClient = useHandleClient();
  const [value, setValue] = useState<bigint | null>(null);
  const [status, setStatus] = useState<"idle" | "decrypting" | "error">("idle");

  useEffect(() => {
    if (!handleClient || !handle) {
      setValue(null);
      return;
    }
    let mounted = true;
    setStatus("decrypting");
    handleClient
      .decrypt(handle)
      .then(({ value }) => {
        if (mounted) {
          setValue(value as bigint);
          setStatus("idle");
        }
      })
      .catch(() => {
        if (mounted) {
          setStatus("error");
        }
      });

    return () => {
      mounted = false;
    };
  }, [handle, handleClient]);

  if (!handle) return <span className="text-xs text-white/60">No handle</span>;

  if (status === "decrypting") {
    return <span className="text-xs text-white/60">Decrypting...</span>;
  }

  if (status === "error") {
    return <span className="text-xs text-white/60">Auditor access required to decrypt</span>;
  }

  return <span className="text-xs text-white/80">{formatToken(value ?? undefined)} CT</span>;
}
