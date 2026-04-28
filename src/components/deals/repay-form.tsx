"use client";

import { useEffect, useState } from "react";
import { useAccount, useChainId, usePublicClient, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { dealRoomAbi, erc7984Abi, erc20Abi } from "@/lib/abi";
import { CONFIDENTIAL_TOKEN_ADDRESS, DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseUnits } from "viem";
import { TxLink } from "@/components/tx/tx-link";
import { useHandleClient } from "@/lib/nox-handle";

export function RepayForm({ dealId, isIssuer }: { dealId: number; isIssuer: boolean }) {
  const [amount, setAmount] = useState("");
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [encryptedHandle, setEncryptedHandle] = useState<string | null>(null);
  const [handleProof, setHandleProof] = useState<string | null>(null);
  const [encryptTarget, setEncryptTarget] = useState<string | null>(null);
  const [encryptError, setEncryptError] = useState<string | null>(null);
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const isCorrectChain = chainId === arbitrumSepolia.id;
  const publicClient = usePublicClient();
  const handleClient = useHandleClient();

  const { data: underlyingAddress } = useReadContract({
    address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
    abi: erc7984Abi,
    functionName: "underlying",
    query: { enabled: !!CONFIDENTIAL_TOKEN_ADDRESS }
  });
  const { data: decimals } = useReadContract({
    address: underlyingAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: !!underlyingAddress }
  });
  const tokenDecimals = typeof decimals === "number" ? decimals : 18;
  const {
    data: approveHash,
    writeContract: setOperator,
    isPending: approving,
    error: approveError
  } = useWriteContract();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: confirming } = useWaitForTransactionReceipt({ hash });
  const { isLoading: approveConfirming, isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveHash });
  const operatorReady = approveConfirmed || !approveHash;

  useEffect(() => {
    setEncryptedHandle(null);
    setHandleProof(null);
    setEncryptTarget(null);
  }, [amount, dealId]);

  const handleOperator = async () => {
    if (!DEAL_ROOM_ADDRESS || !CONFIDENTIAL_TOKEN_ADDRESS) return;
    const until = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const fees = publicClient ? await publicClient.estimateFeesPerGas() : null;
    setOperator({
      address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
      abi: erc7984Abi,
      functionName: "setOperator",
      args: [DEAL_ROOM_ADDRESS as `0x${string}`, until],
      ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees?.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
    });
  };

  const handleEncrypt = async () => {
    setEncryptError(null);
    setEncryptedHandle(null);
    setHandleProof(null);
    setEncryptTarget(null);
    if (!amount) {
      setEncryptError("Enter a repayment amount first.");
      return;
    }
    if (!handleClient) {
      setEncryptError("Connect wallet on Arbitrum Sepolia to initialize encryption.");
      return;
    }
    if (!isCorrectChain) {
      setEncryptError("Switch MetaMask to Arbitrum Sepolia.");
      return;
    }
    if (!DEAL_ROOM_ADDRESS) {
      setEncryptError("Deal room address not configured.");
      return;
    }
    setIsEncrypting(true);
    try {
      const value = parseUnits(amount, tokenDecimals);
      setEncryptTarget(DEAL_ROOM_ADDRESS);
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
    if (!DEAL_ROOM_ADDRESS || encryptTarget !== DEAL_ROOM_ADDRESS) {
      setEncryptError("Re-encrypt the amount after refresh and try again.");
      return;
    }
    setEncryptError(null);
    try {
      const fees = publicClient ? await publicClient.estimateFeesPerGas() : null;
      const gas = publicClient
        ? await publicClient.estimateContractGas({
            address: DEAL_ROOM_ADDRESS as `0x${string}`,
            abi: dealRoomAbi,
            functionName: "repay",
            args: [BigInt(dealId), encryptedHandle as `0x${string}`, handleProof as `0x${string}`],
            account: address
          })
        : null;
      writeContract({
        address: DEAL_ROOM_ADDRESS as `0x${string}`,
        abi: dealRoomAbi,
        functionName: "repay",
        args: [BigInt(dealId), encryptedHandle as `0x${string}`, handleProof as `0x${string}`],
        ...(gas ? { gas } : {}),
        ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
        ...(fees?.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
      });
    } catch (error) {
      setEncryptError(error instanceof Error ? error.message : "Repay failed.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Repayment Amount</Label>
        <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.0" />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onClick={handleOperator}
          disabled={approving || !isIssuer || !CONFIDENTIAL_TOKEN_ADDRESS}
        >
          {approving ? "Authorizing" : "Authorize Operator"}
        </Button>
        <Button
          variant="outline"
          onClick={handleEncrypt}
          disabled={isEncrypting || !handleClient || !isIssuer || !operatorReady}
        >
          {isEncrypting ? "Encrypting" : "Encrypt Amount"}
        </Button>
        <Button onClick={handleRepay} disabled={isPending || !encryptedHandle || !isIssuer || !operatorReady}>
          {isPending ? "Submitting" : "Repay"}
        </Button>
        {(confirming || approveConfirming) ? (
          <span className="text-xs text-white/60">Confirming...</span>
        ) : null}
        <TxLink hash={hash} />
        <TxLink hash={approveHash} />
      </div>
      <div className="text-xs text-white/60">Encrypted with iExec Nox.</div>
      {encryptTarget ? (
        <div className="text-xs text-white/50">Encryption target: {encryptTarget}</div>
      ) : null}
      {!isConnected ? (
        <div className="text-xs text-amber-300">Connect wallet to enable encryption.</div>
      ) : !isIssuer ? (
        <div className="text-xs text-amber-300">Switch to the issuer wallet to repay.</div>
      ) : !isCorrectChain ? (
        <div className="text-xs text-amber-300">Switch to Arbitrum Sepolia to encrypt.</div>
      ) : approveConfirming ? (
        <div className="text-xs text-amber-300">Waiting for operator authorization to confirm...</div>
      ) : null}
      {encryptError ? <div className="text-xs text-red-300">{encryptError}</div> : null}
      {approveError ? <div className="text-xs text-red-300">{approveError.message}</div> : null}
      {error ? <div className="text-xs text-red-300">{error.message}</div> : null}
    </div>
  );
}
