"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { TxLink } from "@/components/tx/tx-link";

export function ClaimButton({ dealId }: { dealId: number }) {
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading } = useWaitForTransactionReceipt({ hash });

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() =>
            writeContract({
              address: DEAL_ROOM_ADDRESS as `0x${string}`,
              abi: dealRoomAbi,
              functionName: "claim",
              args: [BigInt(dealId)]
            })
          }
          disabled={isPending}
        >
          {isPending ? "Claiming" : "Claim"}
        </Button>
        {isLoading ? <span className="text-xs text-white/60">Confirming...</span> : null}
        <TxLink hash={hash} />
      </div>
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </>
  );
}
