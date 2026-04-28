"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
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

  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash
  });

  const disabled = !DEAL_ROOM_ADDRESS;

  const handleSubmit = () => {
    if (!maturityDate) return;
    const maturity = BigInt(Math.floor(new Date(maturityDate).getTime() / 1000));
    writeContract({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "createDeal",
      args: [
        {
          title,
          category,
          maturityDate: maturity,
          description,
          documentHash
        }
      ]
    });
  };

  return (
    <Card>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Create Deal</h3>
          <p className="text-sm text-white/70">Sample metadata only. Funding flow is real onchain.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Atlas Receivables Series A" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(event) => setCategory(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maturity">Maturity Date</Label>
            <Input id="maturity" type="date" value={maturityDate} onChange={(event) => setMaturityDate(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="document">Document Hash</Label>
            <Input id="document" value={documentHash} onChange={(event) => setDocumentHash(event.target.value)} placeholder="ipfs://..." />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Short deal memo" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleSubmit} disabled={disabled || isPending}>
            {isPending ? "Submitting" : "Create Deal"}
          </Button>
          <TxLink hash={hash} />
          {isConfirming ? <span className="text-xs text-white/60">Confirming...</span> : null}
          {isSuccess ? <span className="text-xs text-emerald-400">Deal created</span> : null}
          {error ? <span className="text-xs text-red-300">{error.message}</span> : null}
        </div>
      </div>
    </Card>
  );
}
