"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi, erc7984Abi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS, CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUnits } from "viem";
import { TxLink } from "@/components/tx/tx-link";
import { useHandleClient } from "@/lib/nox-handle";

export function BidForm({ dealId }: { dealId: number }) {
  const [sealedBid, setSealedBid] = useState("");
  const [amount, setAmount] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedHandle, setEncryptedHandle] = useState<string | null>(null);
  const [handleProof, setHandleProof] = useState<string | null>(null);
  const handleClient = useHandleClient();

  const {
    data: approveHash,
    writeContract: setOperator,
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

  const handleOperator = () => {
    if (!DEAL_ROOM_ADDRESS) return;
    const until = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    setOperator({
      address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
      abi: erc7984Abi,
      functionName: "setOperator",
      args: [DEAL_ROOM_ADDRESS as `0x${string}`, until]
    });
  };

  const handleEncrypt = async () => {
    if (!amount || !handleClient || !DEAL_ROOM_ADDRESS) return;
    setIsEncrypting(true);
    try {
      const value = parseUnits(amount, 18);
      const { handle, handleProof } = await handleClient.encryptInput(
        value,
        "uint256",
        DEAL_ROOM_ADDRESS as `0x${string}`
      );
      setEncryptedHandle(handle);
      setHandleProof(handleProof);
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleBid = () => {
    if (!encryptedHandle || !handleProof || !sealedBid) return;
    submitBid({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "submitBid",
      args: [
        BigInt(dealId),
        sealedBid as `0x${string}`,
        encryptedHandle as `0x${string}`,
        handleProof as `0x${string}`
      ]
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
        <Button variant="outline" onClick={handleOperator} disabled={disabled || approving}>
          {approving ? "Authorizing" : "Authorize Operator"}
        </Button>
        <Button
          variant="outline"
          onClick={handleEncrypt}
          disabled={disabled || !handleClient || isEncrypting}
        >
          {isEncrypting ? "Encrypting" : "Encrypt Amount"}
        </Button>
        <Button onClick={handleBid} disabled={disabled || bidding || !encryptedHandle}>
          {bidding ? "Submitting" : "Submit Sealed Bid"}
        </Button>
        {(approveConfirming || bidConfirming) && <span className="text-xs text-white/60">Confirming...</span>}
        <TxLink hash={approveHash} />
        <TxLink hash={bidHash} />
      </div>
      <div className="text-xs text-white/60">
        Encrypted with iExec Nox. Amount hidden onchain.
      </div>
      {encryptedHandle ? (
        <div className="text-xs text-white/50">Handle: {encryptedHandle}</div>
      ) : null}
      {approveError ? <div className="text-xs text-red-300">{approveError.message}</div> : null}
      {bidError ? <div className="text-xs text-red-300">{bidError.message}</div> : null}
    </div>
  );
}
