"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi, erc20Abi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS, CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUnits } from "viem";
import { TxLink } from "@/components/tx/tx-link";

export function BidForm({ dealId }: { dealId: number }) {
  const [sealedBid, setSealedBid] = useState("");
  const [amount, setAmount] = useState("");

  const {
    data: approveHash,
    writeContract: approve,
    isPending: approving,
    error: approveError
  } = useWriteContract();
  const {
    data: bidHash,
    writeContract: submitBid,
    isPending: bidding,
    error: bidError
  } = useWriteContract();

  const { isLoading: approveConfirming } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: bidConfirming } = useWaitForTransactionReceipt({ hash: bidHash });

  const disabled = !DEAL_ROOM_ADDRESS || !CONFIDENTIAL_TOKEN_ADDRESS;

  const handleApprove = () => {
    if (!amount) return;
    const value = parseUnits(amount, 18);
    approve({
      address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [DEAL_ROOM_ADDRESS as `0x${string}`, value]
    });
  };

  const handleBid = () => {
    if (!amount || !sealedBid) return;
    const value = parseUnits(amount, 18);
    submitBid({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "submitBid",
      args: [BigInt(dealId), sealedBid as `0x${string}`, value]
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Sealed Bid Commitment (bytes32)</Label>
          <Input value={sealedBid} onChange={(event) => setSealedBid(event.target.value)} placeholder="0x..." />
        </div>
        <div className="space-y-2">
          <Label>Bid Amount</Label>
          <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.0" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleApprove} disabled={disabled || approving}>
          {approving ? "Approving" : "Approve"}
        </Button>
        <Button onClick={handleBid} disabled={disabled || bidding}>
          {bidding ? "Submitting" : "Submit Sealed Bid"}
        </Button>
        {(approveConfirming || bidConfirming) && <span className="text-xs text-white/60">Confirming...</span>}
        <TxLink hash={approveHash} />
        <TxLink hash={bidHash} />
      </div>
      {approveError ? <div className="text-xs text-red-300">{approveError.message}</div> : null}
      {bidError ? <div className="text-xs text-red-300">{bidError.message}</div> : null}
    </div>
  );
}
