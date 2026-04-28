"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits } from "viem";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { erc7984Abi, erc20Abi } from "@/lib/abi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxLink } from "@/components/tx/tx-link";

export function WrapForm() {
  const [amount, setAmount] = useState("");
  const [txError, setTxError] = useState<string | null>(null);
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const ctAddress = CONFIDENTIAL_TOKEN_ADDRESS as `0x${string}`;
  const enabled = !!ctAddress && !!address;

  const { data: underlyingAddress } = useReadContract({
    address: ctAddress,
    abi: erc7984Abi,
    functionName: "underlying",
    query: { enabled: !!ctAddress }
  });

  const { data: decimals } = useReadContract({
    address: underlyingAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "decimals",
    query: { enabled: !!underlyingAddress }
  });

  const { data: usdcBalance } = useReadContract({
    address: underlyingAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!underlyingAddress && !!address }
  });

  const { data: allowance } = useReadContract({
    address: underlyingAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "allowance",
    args: address && ctAddress ? [address, ctAddress] : undefined,
    query: { enabled: !!underlyingAddress && !!address && !!ctAddress }
  });

  const {
    data: approveHash,
    writeContract: approve,
    isPending: approving,
    error: approveError
  } = useWriteContract();

  const {
    data: wrapHash,
    writeContract: wrap,
    isPending: wrapping,
    error: wrapError
  } = useWriteContract();

  const { isLoading: approveConfirming, isSuccess: approveConfirmed } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { isLoading: wrapConfirming } = useWaitForTransactionReceipt({ hash: wrapHash });

  const tokenDecimals = typeof decimals === "number" ? decimals : 18;
  const parsedAmount = amount ? parseUnits(amount, tokenDecimals) : 0n;
  const hasAllowance = (allowance ?? 0n) >= parsedAmount && parsedAmount > 0n;
  const needsApprove = !hasAllowance && !approveConfirmed;

  const getFees = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    return {
      ...(fees.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {})
    };
  };

  const handleApprove = async () => {
    if (!underlyingAddress || !ctAddress || !parsedAmount) return;
    setTxError(null);
    try {
      const fees = await getFees();
      approve({
        address: underlyingAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "approve",
        args: [ctAddress, parsedAmount],
        ...fees
      });
    } catch (e) {
      setTxError(e instanceof Error ? e.message : "Approve failed.");
    }
  };

  const handleWrap = async () => {
    if (!ctAddress || !address || !parsedAmount) return;
    setTxError(null);
    try {
      const fees = await getFees();
      wrap({
        address: ctAddress,
        abi: erc7984Abi,
        functionName: "wrap",
        args: [address, parsedAmount],
        ...fees
      });
    } catch (e) {
      setTxError(e instanceof Error ? e.message : "Wrap failed.");
    }
  };

  if (!CONFIDENTIAL_TOKEN_ADDRESS) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label>Amount to Wrap</Label>
        <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" />
      </div>
      {usdcBalance !== undefined && (
        <div className="text-xs text-white/50">
          USDC balance: {formatUnits(usdcBalance as bigint, tokenDecimals)}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handleApprove}
          disabled={!enabled || approving || approveConfirming || !parsedAmount || hasAllowance}
        >
          {approving || approveConfirming ? "Approving..." : "Approve USDC"}
        </Button>
        <Button
          onClick={handleWrap}
          disabled={!enabled || wrapping || wrapConfirming || !parsedAmount || needsApprove}
        >
          {wrapping || wrapConfirming ? "Wrapping..." : "Wrap to cUSDC"}
        </Button>
        <TxLink hash={approveHash} />
        <TxLink hash={wrapHash} />
      </div>
      {txError && <div className="text-xs text-red-300">{txError}</div>}
      {approveError && <div className="text-xs text-red-300">{approveError.message}</div>}
      {wrapError && <div className="text-xs text-red-300">{wrapError.message}</div>}
    </div>
  );
}
