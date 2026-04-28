"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUnits } from "viem";
import { TxLink } from "@/components/tx/tx-link";

export function RepayForm({ dealId }: { dealId: number }) {
  const [amount, setAmount] = useState("");
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash });

  const handleRepay = () => {
    if (!amount) return;
    writeContract({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "repay",
      args: [BigInt(dealId), parseUnits(amount, 18)]
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Repayment Amount</Label>
        <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.0" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleRepay} disabled={isPending}>
          {isPending ? "Submitting" : "Repay"}
        </Button>
        {confirming ? <span className="text-xs text-white/60">Confirming...</span> : null}
        <TxLink hash={hash} />
      </div>
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </div>
  );
}
