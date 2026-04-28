"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { erc7984Abi } from "@/lib/abi";
import { Card } from "@/components/ui/card";
import { formatToken } from "@/lib/format";
import { useHandleClient } from "@/lib/nox-handle";
import { useEffect, useState } from "react";

export function TokenBalance() {
  const { address } = useAccount();
  const handleClient = useHandleClient();
  const [decrypted, setDecrypted] = useState<bigint | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);

  const { data } = useReadContract({
    address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
    abi: erc7984Abi,
    functionName: "confidentialBalanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONFIDENTIAL_TOKEN_ADDRESS }
  });

  useEffect(() => {
    const handle = data as `0x${string}` | undefined;
    if (!handleClient || !handle) {
      setDecrypted(null);
      return;
    }
    let mounted = true;
    setIsDecrypting(true);
    handleClient
      .decrypt(handle)
      .then(({ value }) => {
        if (mounted) {
          setDecrypted(value as bigint);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsDecrypting(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [data, handleClient]);

  return (
    <Card>
      <h3 className="text-lg font-semibold">Confidential Token Balance</h3>
      <p className="mt-2 text-sm text-white/70">
        Encrypted with iExec Nox. Amount hidden onchain.
      </p>
      <div className="mt-4 text-2xl font-semibold">
        {isDecrypting ? "Decrypting..." : formatToken(decrypted ?? undefined)} CT
      </div>
      {!handleClient && (
        <div className="mt-2 text-xs text-white/50">Connect wallet to decrypt balance.</div>
      )}
      {!CONFIDENTIAL_TOKEN_ADDRESS && (
        <div className="mt-2 text-xs text-white/50">
          Configure `NEXT_PUBLIC_CONFIDENTIAL_TOKEN_ADDRESS` to load balances.
        </div>
      )}
    </Card>
  );
}
