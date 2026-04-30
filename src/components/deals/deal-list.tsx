"use client";

import { useMemo } from "react";
import { useAccount, usePublicClient, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DealStateBadge } from "@/components/deals/deal-state";
import { EncryptedAmount } from "@/components/deals/encrypted-amount";
import { BidForm } from "@/components/deals/bid-form";
import { ClaimButton } from "@/components/deals/claim-button";
import { GrantAuditor } from "@/components/deals/grant-auditor";
import { RepayForm } from "@/components/deals/repay-form";
import { TxLink } from "@/components/tx/tx-link";

const dealRoomAddress = DEAL_ROOM_ADDRESS as `0x${string}`;
type Mode = "issuer" | "investor" | "auditor";

export function DealList({ mode }: { mode: Mode }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: actionHash, writeContract, isPending: actionPending, error: actionError } = useWriteContract();
  const hasAddress = Boolean(DEAL_ROOM_ADDRESS);

  const { data: count } = useReadContract({
    address: dealRoomAddress,
    abi: dealRoomAbi,
    functionName: "getDealsCount",
    query: { enabled: hasAddress },
  });

  const dealCount = Number(count ?? 0);

  const dealContracts = useMemo(
    () => Array.from({ length: dealCount }).map((_, i) => ({
      address: dealRoomAddress,
      abi: dealRoomAbi,
      functionName: "getDeal" as const,
      args: [BigInt(i)],
    })),
    [dealCount]
  );

  const { data: dealResults } = useReadContracts({
    contracts: dealContracts,
    query: { enabled: dealCount > 0 },
  });

  const bidContracts = useMemo(
    () => Array.from({ length: dealCount }).map((_, i) => ({
      address: dealRoomAddress,
      abi: dealRoomAbi,
      functionName: "getBidForInvestor" as const,
      args: [BigInt(i), address as `0x${string}`],
    })),
    [dealCount, address]
  );

  const { data: bidResults } = useReadContracts({
    contracts: bidContracts,
    query: { enabled: mode === "investor" && dealCount > 0 && !!address },
  });

  const accessContracts = useMemo(
    () => Array.from({ length: dealCount }).map((_, i) => ({
      address: dealRoomAddress,
      abi: dealRoomAbi,
      functionName: "hasAuditorAccess" as const,
      args: [BigInt(i), address as `0x${string}`],
    })),
    [dealCount, address]
  );

  const { data: accessResults } = useReadContracts({
    contracts: accessContracts,
    query: { enabled: mode === "auditor" && dealCount > 0 && !!address },
  });

  if (!DEAL_ROOM_ADDRESS) {
    return (
      <Card>
        <p className="text-sm text-text-2">Deal contract not configured. Set <code className="text-gold">NEXT_PUBLIC_DEAL_ROOM_ADDRESS</code> after deployment.</p>
      </Card>
    );
  }

  if (!dealCount) {
    return (
      <Card>
        <p className="text-sm text-text-2">No deals yet. Create the first private funding round.</p>
      </Card>
    );
  }

  const getFees = async () => {
    if (!publicClient) return {};
    const fees = await publicClient.estimateFeesPerGas();
    return {
      ...(fees.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
      ...(fees.maxPriorityFeePerGas ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas } : {}),
    };
  };

  const issuerAction = async (fn: "setFundingOpen" | "setFunded" | "closeDeal", index: number) => {
    const fees = await getFees();
    writeContract({ address: dealRoomAddress, abi: dealRoomAbi, functionName: fn, args: [BigInt(index)], ...fees });
  };

  return (
    <div className="space-y-5">
      {dealResults?.map((result, index) => {
        if (!result?.result) return null;
        const hasAccess = accessResults?.[index]?.result as boolean | undefined;
        if (mode === "auditor" && !hasAccess) return null;

        const deal = result.result as {
          issuer: string;
          metadata: { title: string; category: string; maturityDate: bigint; description: string; documentHash: string };
          state: number;
          totalCommitted: `0x${string}`;
          totalRepaid: `0x${string}`;
          totalClaimed: `0x${string}`;
        };

        const bid = bidResults?.[index]?.result as
          | { sealedBid: string; amount: `0x${string}`; claimed: boolean }
          | undefined;

        const isIssuer = !!address && deal.issuer.toLowerCase() === address.toLowerCase();

        return (
          <Card key={`deal-${index}`}>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-text-3">Deal {index}</p>
                <h3 className="mt-1 text-lg font-semibold text-text-1">{deal.metadata.title || "Untitled Deal"}</h3>
                <p className="text-sm text-text-2">{deal.metadata.category}</p>
              </div>
              <DealStateBadge state={deal.state} />
            </div>

            {deal.metadata.description && (
              <p className="mt-4 text-sm leading-relaxed text-text-2">{deal.metadata.description}</p>
            )}

            {/* Metadata grid */}
            <div className="mt-4 grid gap-x-6 gap-y-2 text-xs md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Maturity</span>
                <span className="font-mono text-text-1">
                  {new Date(Number(deal.metadata.maturityDate) * 1000).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Issuer</span>
                <span className="font-mono text-text-2">
                  {deal.issuer.slice(0, 6)}…{deal.issuer.slice(-4)}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Committed</span>
                <span className="text-gold text-xs">Encrypted</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
                <span className="text-text-3 uppercase tracking-widest">Repaid</span>
                <span className="text-gold text-xs">Encrypted</span>
              </div>
            </div>

            <p className="mt-2 text-xs text-text-3">Amounts hidden onchain · iExec Nox FHE</p>

            {/* Issuer actions */}
            {mode === "issuer" && (
              <div className="mt-6 space-y-5 border-t border-border pt-5">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Deal Controls</p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => issuerAction("setFundingOpen", index)} disabled={actionPending || !isIssuer}>
                      {actionPending ? "Submitting…" : "Open Funding"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => issuerAction("setFunded", index)} disabled={actionPending || !isIssuer}>
                      Mark Funded
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => issuerAction("closeDeal", index)} disabled={actionPending || !isIssuer}>
                      Close Deal
                    </Button>
                    <TxLink hash={actionHash} />
                  </div>
                  {!isIssuer && <p className="mt-2 text-xs text-warning">Connect the issuer wallet to use deal controls.</p>}
                  {actionError && <p className="mt-2 text-xs text-danger">{actionError.message}</p>}
                </div>
                <div className="border-t border-border pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Repayment</p>
                  <RepayForm dealId={index} isIssuer={isIssuer} />
                </div>
                <div className="border-t border-border pt-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Auditor Access</p>
                  <GrantAuditor dealId={index} />
                </div>
              </div>
            )}

            {/* Investor actions */}
            {mode === "investor" && (
              <div className="mt-6 space-y-4 border-t border-border pt-5">
                {deal.state === 1 && (
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold">Submit Bid</p>
                    <BidForm dealId={index} />
                  </div>
                )}
                <div className="rounded-xl border border-border bg-surface p-4 text-sm space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-3 mb-3">Your Position</p>
                  <div className="flex items-center justify-between">
                    <span className="text-text-2">Sealed Bid</span>
                    <span className="font-mono text-xs text-text-1">{bid?.sealedBid ? `${bid.sealedBid.slice(0, 10)}…` : "—"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-2">Committed</span>
                    <span>{bid ? <EncryptedAmount handle={bid.amount} /> : <span className="text-text-3">—</span>}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-2">Claimed</span>
                    <span className={bid?.claimed ? "text-success" : "text-text-3"}>
                      {bid?.claimed ? "✓ Yes" : "No"}
                    </span>
                  </div>
                </div>
                {deal.state >= 3 && bid && !bid.claimed && <ClaimButton dealId={index} />}
                {deal.state >= 3 && !bid && (
                  <p className="text-xs text-warning">No bid found for this wallet.</p>
                )}
                {deal.state >= 3 && bid?.claimed && (
                  <p className="text-xs text-success">Already claimed with this wallet.</p>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
