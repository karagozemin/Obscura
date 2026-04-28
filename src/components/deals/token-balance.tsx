"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { erc7984Abi, erc20Abi } from "@/lib/abi";
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
    query: { enabled: !!address && !!CONFIDENTIAL_TOKEN_ADDRESS },
  });

  const { data: underlyingAddress } = useReadContract({
    address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
    abi: erc7984Abi,
    functionName: "underlying",
    query: { enabled: !!CONFIDENTIAL_TOKEN_ADDRESS },
  });

  const { data: decimals } = useReadContract({
    address: underlyingAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: !!underlyingAddress },
  });

  const tokenDecimals = typeof decimals === "number" ? decimals : 18;

  useEffect(() => {
    const handle = data as `0x${string}` | undefined;
    if (!handleClient || !handle) { setDecrypted(null); return; }
    let mounted = true;
    setIsDecrypting(true);
    handleClient.decrypt(handle)
      .then(({ value }) => { if (mounted) setDecrypted(value as bigint); })
      .finally(() => { if (mounted) setIsDecrypting(false); });
    return () => { mounted = false; };
  }, [data, handleClient]);

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Confidential Balance</p>
      <div className="mt-4 flex items-end gap-2">
        <span className="text-3xl font-semibold tabular-nums text-text-1">
          {isDecrypting ? (
            <span className="inline-block h-8 w-24 animate-pulse rounded-lg bg-surface-2" />
          ) : (
            formatToken(decrypted ?? undefined, tokenDecimals)
          )}
        </span>
        <span className="mb-0.5 text-sm font-medium text-gold">cUSDC</span>
      </div>
      <p className="mt-2 text-xs text-text-3">Encrypted with iExec Nox · decrypted locally</p>
      {!handleClient && (
        <p className="mt-2 text-xs text-warning">Connect wallet to decrypt balance.</p>
      )}
      {!CONFIDENTIAL_TOKEN_ADDRESS && (
        <p className="mt-2 text-xs text-danger">Configure NEXT_PUBLIC_CONFIDENTIAL_TOKEN_ADDRESS.</p>
      )}
    </Card>
  );
}
