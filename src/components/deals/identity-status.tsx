"use client";

import { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { identityRegistryAbi } from "@/lib/abi";
import { IDENTITY_REGISTRY_ADDRESS } from "@/lib/contracts";

export function IdentityStatus() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  const { data: isVerified, isLoading } = useReadContract({
    address: IDENTITY_REGISTRY_ADDRESS as `0x${string}`,
    abi: identityRegistryAbi,
    functionName: "isVerified",
    args: address ? [address] : undefined,
    query: { enabled: mounted && !!address && !!IDENTITY_REGISTRY_ADDRESS },
  });

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !isConnected || !address) return null;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
      <span className="font-medium text-white/60">ERC-3643 Compliance</span>
      {isLoading ? (
        <span className="ml-auto text-white/40">checking…</span>
      ) : isVerified ? (
        <span className="ml-auto flex items-center gap-1.5 font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          KYC Verified
        </span>
      ) : (
        <span className="ml-auto flex items-center gap-1.5 font-semibold text-amber-400">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Not Verified — contact issuer for KYC
        </span>
      )}
    </div>
  );
}
