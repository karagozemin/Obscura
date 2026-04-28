"use client";

import { useState } from "react";
import { useAccount, useChainId, usePublicClient, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { dealRoomAbi, erc7984Abi, erc20Abi } from "@/lib/abi";
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
  const [encryptError, setEncryptError] = useState<string | null>(null);
  const [submitNotice, setSubmitNotice] = useState<string | null>(null);
  const { isConnected } = useAccount();
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
  const tokenDecimals = typeof decimals === "number" ? decimals : null;

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

  const { isLoading: approveConfirming, isSuccess: approveConfirmed } = useWaitForTransactionReceipt({ hash: approveHash });
  const { isLoading: bidConfirming } = useWaitForTransactionReceipt({ hash: bidHash });
  const operatorReady = approveConfirmed || !approveHash;

  const disabled = !DEAL_ROOM_ADDRESS || !CONFIDENTIAL_TOKEN_ADDRESS;

  const getFees = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    return {
      ...(fees.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
    };
  };

  const handleOperator = async () => {
    if (!DEAL_ROOM_ADDRESS) return;
    const until = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
    const fees = await getFees();
    setOperator({
      address: CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`,
      abi: erc7984Abi,
      functionName: "setOperator",
      args: [DEAL_ROOM_ADDRESS as `0x${string}`, until],
      ...fees
    });
  };

  const handleEncrypt = async () => {
    setEncryptError(null);
    setSubmitNotice(null);
    if (!amount) {
      setEncryptError("Enter a bid amount first.");
      return;
    }
    if (tokenDecimals === null) {
      setEncryptError("Token decimals are still loading. Try again in a moment.");
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

  const handleBid = async () => {
    if (!encryptedHandle || !handleProof || !sealedBid) return;
    setSubmitNotice(null);
    const fees = await getFees();
    let gas: bigint | null = null;
    if (publicClient) {
      try {
        gas = await publicClient.estimateContractGas({
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
      } catch {
        setSubmitNotice("Check Funding state, operator approval, and cUSDC balance.");
        gas = null;
      }
    }
    submitBid({
      address: DEAL_ROOM_ADDRESS as `0x${string}`,
      abi: dealRoomAbi,
      functionName: "submitBid",
      args: [
        BigInt(dealId),
        sealedBid as `0x${string}`,
        encryptedHandle as `0x${string}`,
        handleProof as `0x${string}`
      ],
      ...(gas ? { gas } : {}),
      ...fees
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
          disabled={disabled || !handleClient || !isCorrectChain || isEncrypting || tokenDecimals === null}
        >
          {isEncrypting ? "Encrypting" : "Encrypt Amount"}
        </Button>
        <Button onClick={handleBid} disabled={disabled || bidding || !encryptedHandle || !operatorReady}>
          {bidding ? "Submitting" : "Submit Sealed Bid"}
        </Button>
        {(approveConfirming || bidConfirming) && <span className="text-xs text-white/60">Confirming...</span>}
        <TxLink hash={approveHash} />
        <TxLink hash={bidHash} />
      </div>
      <div className="text-xs text-white/60">
        Encrypted with iExec Nox. Amount hidden onchain.
      </div>
      {!isConnected ? (
        <div className="text-xs text-amber-300">Connect wallet to enable encryption.</div>
      ) : !isCorrectChain ? (
        <div className="text-xs text-amber-300">Switch to Arbitrum Sepolia to encrypt.</div>
      ) : null}
      {encryptedHandle ? (
        <div className="text-xs text-white/50">Handle: {encryptedHandle}</div>
      ) : null}
      {encryptError ? <div className="text-xs text-red-300">{encryptError}</div> : null}
      {submitNotice ? <div className="text-xs text-amber-300">{submitNotice}</div> : null}
      {approveError ? <div className="text-xs text-red-300">{approveError.message}</div> : null}
      {bidError ? <div className="text-xs text-red-300">{bidError.message}</div> : null}
    </div>
  );
}
