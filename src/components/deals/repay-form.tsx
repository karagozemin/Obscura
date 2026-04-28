"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUnits } from "viem";
import { TxLink } from "@/components/tx/tx-link";
import { useHandleClient } from "@/lib/nox-handle";

export function RepayForm({ dealId }: { dealId: number }) {
  const [amount, setAmount] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedHandle, setEncryptedHandle] = useState<string | null>(null);
  const [handleProof, setHandleProof] = useState<string | null>(null);
  const [encryptError, setEncryptError] = useState<string | null>(null);
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();
  const handleClient = useHandleClient();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash });

  const handleEncrypt = async () => {
    setEncryptError(null);
    if (!amount) {
      setEncryptError("Enter a repayment amount first.");
      return;
    }
    if (!handleClient) {
      setEncryptError("Connect wallet on Arbitrum Sepolia to initialize encryption.");
      return;
    }
    if (!DEAL_ROOM_ADDRESS) {
      setEncryptError("Deal room address not configured.");
      return;
    }
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
    } catch (error) {
      setEncryptError(error instanceof Error ? error.message : "Encryption failed.");
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleRepay = async () => {
    if (!encryptedHandle || !handleProof) return;
    const fees = publicClient ? await publicClient.estimateFeesPerGas() : null;
    writeContract({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "repay",
      args: [BigInt(dealId), encryptedHandle as `0x${string}`, handleProof as `0x${string}`],
      ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees?.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
    });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Repayment Amount</Label>
        <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.0" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={handleEncrypt} disabled={isEncrypting || !handleClient}>
          {isEncrypting ? "Encrypting" : "Encrypt Amount"}
        </Button>
        <Button onClick={handleRepay} disabled={isPending || !encryptedHandle}>
          {isPending ? "Submitting" : "Repay"}
        </Button>
        {confirming ? <span className="text-xs text-white/60">Confirming...</span> : null}
        <TxLink hash={hash} />
      </div>
      <div className="text-xs text-white/60">Encrypted with iExec Nox.</div>
      {!isConnected ? (
        <div className="text-xs text-amber-300">Connect wallet to enable encryption.</div>
      ) : null}
      {encryptError ? <div className="text-xs text-red-300">{encryptError}</div> : null}
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </div>
  );
}
