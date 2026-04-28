"use client";

import { useState } from "react";
import { useReadContract } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EncryptedAmount } from "@/components/deals/encrypted-amount";

export function AuditLookup() {
  const [dealId, setDealId] = useState("");
  const [investor, setInvestor] = useState("");

  const parsedDealId = dealId ? BigInt(dealId) : undefined;

  const { data } = useReadContract({
    address: DEAL_ROOM_ADDRESS as `0x${string}`,
    abi: dealRoomAbi,
    functionName: "getBidForInvestor",
    args: parsedDealId !== undefined && investor ? [parsedDealId, investor as `0x${string}`] : undefined,
    query: { enabled: !!parsedDealId && !!investor && !!DEAL_ROOM_ADDRESS },
  });

  const bid = data as { sealedBid: string; amount: `0x${string}`; claimed: boolean } | undefined;

  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Auditor Lookup</p>
      <h3 className="mt-1 text-lg font-semibold text-text-1">Permissioned Bid Disclosure</h3>
      <p className="mt-1 text-sm text-text-2">Enter a deal ID and investor address to view ACL-permissioned bid details.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Deal ID</Label>
          <Input value={dealId} onChange={(e) => setDealId(e.target.value)} placeholder="0" />
        </div>
        <div className="space-y-2">
          <Label>Investor Address</Label>
          <Input value={investor} onChange={(e) => setInvestor(e.target.value)} placeholder="0x…" />
        </div>
      </div>

      {bid ? (
        <div className="mt-5 rounded-xl border border-border bg-surface p-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Bid Data</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-text-2">Sealed Bid</span>
              <span className="font-mono text-xs text-text-1 max-w-[220px] truncate">{bid.sealedBid}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">Encrypted Amount</span>
              <EncryptedAmount handle={bid.amount} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-2">Claimed</span>
              <span className={bid.claimed ? "text-success" : "text-text-3"}>{bid.claimed ? "✓ Yes" : "No"}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-xl border border-border bg-surface px-4 py-6 text-center text-sm text-text-3">
          Enter deal ID and investor address to load permissioned bid data.
        </div>
      )}
      <p className="mt-3 text-xs text-text-3">ACL access required · Encrypted with iExec Nox</p>
    </Card>
  );
}
