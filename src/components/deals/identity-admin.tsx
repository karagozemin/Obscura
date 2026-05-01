"use client";

import { useState } from "react";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { keccak256, toBytes } from "viem";
import { identityRegistryAbi } from "@/lib/abi";
import { IDENTITY_REGISTRY_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxLink } from "@/components/tx/tx-link";

const registryAddress = IDENTITY_REGISTRY_ADDRESS as `0x${string}`;

export function IdentityAdmin() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const [investorAddress, setInvestorAddress] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  const { data: adminAddress } = useReadContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: "admin",
    query: { enabled: !!IDENTITY_REGISTRY_ADDRESS },
  });

  const { data: isVerified, refetch: refetchVerified } = useReadContract({
    address: registryAddress,
    abi: identityRegistryAbi,
    functionName: "isVerified",
    args: checkAddress ? [checkAddress as `0x${string}`] : undefined,
    query: { enabled: checkAddress.startsWith("0x") && checkAddress.length === 42 },
  });

  const isAdmin = !!address && !!adminAddress &&
    (address as string).toLowerCase() === (adminAddress as string).toLowerCase();

  const getFees = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    return {
      ...(fees.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {}),
    };
  };

  const register = async () => {
    if (!investorAddress.startsWith("0x")) return;
    const fees = await getFees();
    const identityHash = keccak256(toBytes(investorAddress.toLowerCase()));
    writeContract({
      address: registryAddress,
      abi: identityRegistryAbi,
      functionName: "registerIdentity",
      args: [investorAddress as `0x${string}`, identityHash],
      ...fees,
    });
  };

  const revoke = async () => {
    if (!investorAddress.startsWith("0x")) return;
    const fees = await getFees();
    writeContract({
      address: registryAddress,
      abi: identityRegistryAbi,
      functionName: "revokeIdentity",
      args: [investorAddress as `0x${string}`],
      ...fees,
    });
  };

  return (
    <div className="space-y-6">
      {/* Registry info */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-3">Registry Info</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-2">Contract</span>
            <span className="font-mono text-xs text-text-1">
              {IDENTITY_REGISTRY_ADDRESS
                ? `${IDENTITY_REGISTRY_ADDRESS.slice(0, 10)}…${IDENTITY_REGISTRY_ADDRESS.slice(-6)}`
                : "not configured"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-2">Admin</span>
            <span className="font-mono text-xs text-text-1">
              {adminAddress ? `${(adminAddress as string).slice(0, 10)}…${(adminAddress as string).slice(-6)}` : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-2">Your wallet</span>
            <span className={`text-xs font-semibold ${isAdmin ? "text-emerald-400" : "text-amber-400"}`}>
              {isAdmin ? "✓ Admin" : "Not admin"}
            </span>
          </div>
        </div>
      </Card>

      {/* Register / revoke */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-4">
          Register / Revoke Identity
          <span className="ml-2 normal-case tracking-normal font-normal opacity-60">(ERC-3643)</span>
        </p>
        {!isAdmin && (
          <p className="text-xs text-amber-400 mb-4">Connect the admin wallet to manage identities.</p>
        )}
        <div className="space-y-3">
          <div>
            <Label htmlFor="investor-addr">Investor Address</Label>
            <Input
              id="investor-addr"
              placeholder="0x..."
              value={investorAddress}
              onChange={(e) => setInvestorAddress(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={register}
              disabled={isPending || !isAdmin || !investorAddress.startsWith("0x")}
              size="sm"
            >
              {isPending ? "Submitting…" : "Register (KYC Approve)"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={revoke}
              disabled={isPending || !isAdmin || !investorAddress.startsWith("0x")}
            >
              Revoke
            </Button>
          </div>
          {txHash && <TxLink hash={txHash} />}
          {error && <p className="text-xs text-danger">{error.message}</p>}
        </div>
      </Card>

      {/* Verify check */}
      <Card>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-4">Check Verification Status</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="check-addr">Address to check</Label>
            <Input
              id="check-addr"
              placeholder="0x..."
              value={checkAddress}
              onChange={(e) => { setCheckAddress(e.target.value); refetchVerified(); }}
            />
          </div>
          {checkAddress.startsWith("0x") && checkAddress.length === 42 && (
            <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${
              isVerified ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"
            }`}>
              <span className={`h-2 w-2 rounded-full ${isVerified ? "bg-emerald-400" : "bg-amber-400"}`} />
              {isVerified ? "KYC Verified — can submit bids" : "Not verified — cannot submit bids"}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
