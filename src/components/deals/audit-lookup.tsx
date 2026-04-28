"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatToken } from "@/lib/format";

export function AuditLookup() {
  const [dealId, setDealId] = useState("");
  const [investor, setInvestor] = useState("");

  const parsedDealId = dealId ? BigInt(dealId) : undefined;

  const { data } = useReadContract({
    address: DEAL_ROOM_ADDRESS as `0x${string}`,
    abi: dealRoomAbi,
    functionName: "getBidForInvestor",
    args: parsedDealId !== undefined && investor ? [parsedDealId, investor as `0x${string}`] : undefined,
    query: { enabled: !!parsedDealId && !!investor && !!DEAL_ROOM_ADDRESS }
  });

  const bid = data as { sealedBid: string; amount: bigint; claimed: boolean } | undefined;

  return (
    <Card>
      <h3 className="text-lg font-semibold">Auditor Lookup</h3>
      <p className="mt-1 text-sm text-white/70">
        Enter a deal and investor wallet to view permissioned bid details.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Deal ID</Label>
          <Input value={dealId} onChange={(event) => setDealId(event.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Investor Address</Label>
          <Input value={investor} onChange={(event) => setInvestor(event.target.value)} placeholder="0x..." />
        </div>
      </div>
      <div className="mt-4 text-sm text-white/70">
        {bid ? (
          <div className="space-y-1">
            <div>Sealed Bid: {bid.sealedBid}</div>
            <div>Amount: {formatToken(bid.amount)} CT</div>
            <div>Claimed: {bid.claimed ? "Yes" : "No"}</div>
          </div>
        ) : (
          <div>Enter details to load permissioned bid data.</div>
        )}
      </div>
    </Card>
  );
}
