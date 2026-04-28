"use client";

import { useAccount, useReadContract } from "wagmi";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { erc20Abi } from "@/lib/abi";
import { Card } from "@/components/ui/card";
import { formatToken } from "@/lib/format";

export function TokenBalance() {
  const { address } = useAccount();

  const { data } = useReadContract({
    address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address && !!CONFIDENTIAL_TOKEN_ADDRESS }
  });

  return (
    <Card>
      <h3 className="text-lg font-semibold">Confidential Token Balance</h3>
      <p className="mt-2 text-sm text-white/70">
        Balance is read from the confidential token contract deployed via iExec Nox.
      </p>
      <div className="mt-4 text-2xl font-semibold">{formatToken(data as bigint | undefined)} CT</div>
      {!CONFIDENTIAL_TOKEN_ADDRESS && (
        <div className="mt-2 text-xs text-white/50">
          Configure `NEXT_PUBLIC_CONFIDENTIAL_TOKEN_ADDRESS` to load balances.
        </div>
      )}
    </Card>
  );
}
