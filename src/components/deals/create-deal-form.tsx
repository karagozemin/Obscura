"use client";

import { useState } from "react";
import { usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { TxLink } from "@/components/tx/tx-link";

export function CreateDealForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Private Credit");
  const [maturityDate, setMaturityDate] = useState("");
  const [description, setDescription] = useState("");
  const [documentHash, setDocumentHash] = useState("");

  const publicClient = usePublicClient();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const disabled = !DEAL_ROOM_ADDRESS;

  const handleSubmit = async () => {
    if (!maturityDate) return;
    const maturity = BigInt(Math.floor(new Date(maturityDate).getTime() / 1000));
    const fees = publicClient ? await publicClient.estimateFeesPerGas() : null;
    writeContract({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "createDeal",
      args: [{ title, category, maturityDate: maturity, description, documentHash }],
      ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees?.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {}),
    });
  };

  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">New Deal</p>
          <h3 className="mt-1 text-lg font-semibold text-text-1">Create Private Credit Round</h3>
          <p className="mt-0.5 text-xs text-text-2">Metadata is sample data. The funding flow is fully onchain.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Deal Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Atlas Receivables Series A" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maturity">Maturity Date</Label>
          <Input id="maturity" type="date" value={maturityDate} onChange={(e) => setMaturityDate(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="document">Document Hash</Label>
          <Input id="document" value={documentHash} onChange={(e) => setDocumentHash(e.target.value)} placeholder="ipfs://..." />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short deal memo" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button variant="gold" onClick={handleSubmit} disabled={disabled || isPending || !maturityDate}>
          {isPending ? "Submitting…" : "Create Deal"}
        </Button>
        <TxLink hash={hash} />
        {isConfirming && <span className="text-xs text-text-2">Confirming…</span>}
        {isSuccess && <span className="text-xs font-medium text-success">✓ Deal created</span>}
        {error && <span className="text-xs text-danger">{error.message}</span>}
      </div>
    </Card>
  );
}
