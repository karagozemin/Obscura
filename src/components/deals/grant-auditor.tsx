"use client";

import { useState } from "react";
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxLink } from "@/components/tx/tx-link";

export function GrantAuditor({ dealId }: { dealId: number }) {
  const [auditor, setAuditor] = useState("");
  const [investor, setInvestor] = useState("");
  const publicClient = usePublicClient();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  const getFees = async () => {
    if (!publicClient) return {};
    const priorityFallback = parseUnits("0.1", 9);

    try {
      const fees = await publicClient.estimateFeesPerGas();
      const maxFee = fees.maxFeePerGas ?? fees.gasPrice;
      const maxPriority = fees.maxPriorityFeePerGas ?? priorityFallback;
      return {
        ...(maxFee ? { maxFeePerGas: maxFee } : {}),
        ...(maxPriority ? { maxPriorityFeePerGas: maxPriority } : {})
      };
    } catch {
      const gasPrice = await publicClient.getGasPrice().catch(() => undefined);
      const maxFee = gasPrice ? gasPrice * 2n : parseUnits("1", 9);
      return { maxFeePerGas: maxFee, maxPriorityFeePerGas: priorityFallback };
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Auditor Wallet</Label>
        <Input value={auditor} onChange={(event) => setAuditor(event.target.value)} placeholder="0x..." />
      </div>
      <div className="space-y-2">
        <Label>Investor Wallet</Label>
        <Input value={investor} onChange={(event) => setInvestor(event.target.value)} placeholder="0x..." />
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={async () => {
            const fees = await getFees();
            writeContract({
              address: DEAL_ROOM_ADDRESS as `0x${string}`,
              abi: dealRoomAbi,
              functionName: "grantAuditorAccess",
              args: [BigInt(dealId), auditor as `0x${string}`, investor as `0x${string}`],
              ...fees
            });
          }}
          disabled={isPending}
        >
          {isPending ? "Granting" : "Grant Access"}
        </Button>
        {isLoading ? <span className="text-xs text-white/60">Confirming...</span> : null}
        <TxLink hash={hash} />
      </div>
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </div>
  );
}
