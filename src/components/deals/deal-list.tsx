"use client";

import { useMemo } from "react";
import { useAccount, usePublicClient, useReadContract, useReadContracts, useWriteContract } from "wagmi";
import { dealRoomAbi } from "@/lib/abi";
import { DEAL_ROOM_ADDRESS } from "@/lib/contracts";
import { Card } from "@/components/ui/card";
import { DealStateBadge } from "@/components/deals/deal-state";
import { EncryptedAmount } from "@/components/deals/encrypted-amount";
import { BidForm } from "@/components/deals/bid-form";
import { ClaimButton } from "@/components/deals/claim-button";
import { GrantAuditor } from "@/components/deals/grant-auditor";
import { RepayForm } from "@/components/deals/repay-form";
import { Button } from "@/components/ui/button";
import { TxLink } from "@/components/tx/tx-link";

const dealRoomAddress = DEAL_ROOM_ADDRESS as `0x${string}`;

type Mode = "issuer" | "investor" | "auditor";

export function DealList({ mode }: { mode: Mode }) {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: actionHash, writeContract, isPending: actionPending, error: actionError } =
    useWriteContract();
  const hasAddress = Boolean(DEAL_ROOM_ADDRESS);

  const { data: count } = useReadContract({
    address: dealRoomAddress,
    abi: dealRoomAbi,
    functionName: "getDealsCount",
    query: { enabled: hasAddress }
  });

  const dealCount = Number(count ?? 0);

  const dealContracts = useMemo(
    () =>
      Array.from({ length: dealCount }).map((_, index) => ({
        address: dealRoomAddress,
        abi: dealRoomAbi,
        functionName: "getDeal" as const,
        args: [BigInt(index)]
      })),
    [dealCount]
  );

  const { data: dealResults } = useReadContracts({
    contracts: dealContracts,
    query: { enabled: dealCount > 0 }
  });

  const bidContracts = useMemo(
    () =>
      Array.from({ length: dealCount }).map((_, index) => ({
        address: dealRoomAddress,
        abi: dealRoomAbi,
        functionName: "getBidForInvestor" as const,
        args: [BigInt(index), address as `0x${string}`]
      })),
    [dealCount, address]
  );

  const { data: bidResults } = useReadContracts({
    contracts: bidContracts,
    query: { enabled: mode === "investor" && dealCount > 0 && !!address }
  });

  const accessContracts = useMemo(
    () =>
      Array.from({ length: dealCount }).map((_, index) => ({
        address: dealRoomAddress,
        abi: dealRoomAbi,
        functionName: "hasAuditorAccess" as const,
        args: [BigInt(index), address as `0x${string}`]
      })),
    [dealCount, address]
  );

  const { data: accessResults } = useReadContracts({
    contracts: accessContracts,
    query: { enabled: mode === "auditor" && dealCount > 0 && !!address }
  });

  if (!DEAL_ROOM_ADDRESS) {
    return (
      <Card>
        <p className="text-sm text-white/70">
          Deal contract address not configured. Set `NEXT_PUBLIC_DEAL_ROOM_ADDRESS` after deployment.
        </p>
      </Card>
    );
  }

  if (!dealCount) {
    return (
      <Card>
        <p className="text-sm text-white/70">No deals yet. Create the first private funding round.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {dealResults?.map((result, index) => {
        if (!result?.result) return null;
        const hasAccess = accessResults?.[index]?.result as boolean | undefined;
        if (mode === "auditor" && !hasAccess) return null;
        const deal = result.result as {
          issuer: string;
          metadata: {
            title: string;
            category: string;
            maturityDate: bigint;
            description: string;
            documentHash: string;
          };
          state: number;
          totalCommitted: `0x${string}`;
          totalRepaid: `0x${string}`;
          totalClaimed: `0x${string}`;
        };

        const bid = bidResults?.[index]?.result as
          | { sealedBid: string; amount: `0x${string}`; claimed: boolean }
          | undefined;

        return (
          <Card key={`deal-${index}`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/50">Deal {index}</div>
                <h3 className="mt-1 text-lg font-semibold">{deal.metadata.title}</h3>
                <p className="text-sm text-white/60">{deal.metadata.category}</p>
              </div>
              <DealStateBadge state={deal.state} />
            </div>
            <p className="mt-4 text-sm text-white/70">{deal.metadata.description}</p>
            <div className="mt-4 grid gap-2 text-xs text-white/60 md:grid-cols-2">
              <div>Document Hash: {deal.metadata.documentHash}</div>
              <div>Maturity: {new Date(Number(deal.metadata.maturityDate) * 1000).toLocaleDateString()}</div>
              <div>Total Committed: Encrypted</div>
              <div>Total Repaid: Encrypted</div>
            </div>
            <div className="mt-2 text-xs text-white/50">
              Encrypted with iExec Nox. Amounts hidden onchain.
            </div>

            {mode === "issuer" ? (
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const fees = publicClient
                        ? await publicClient.estimateFeesPerGas()
                        : null;
                      writeContract({
                        address: dealRoomAddress,
                        abi: dealRoomAbi,
                        functionName: "setFundingOpen",
                        args: [BigInt(index)],
                        ...(fees?.maxFeePerGas ? { maxFeePerGas: fees.maxFeePerGas } : {}),
                        ...(fees?.maxPriorityFeePerGas
                          ? { maxPriorityFeePerGas: fees.maxPriorityFeePerGas }
                          : {})
                      });
                    }}
                    disabled={actionPending}
                  >
                    {actionPending ? "Submitting" : "Open Funding"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      writeContract({
                        address: dealRoomAddress,
                        abi: dealRoomAbi,
                        functionName: "setFunded",
                        args: [BigInt(index)]
                      })
                    }
                    disabled={actionPending}
                  >
                    {actionPending ? "Submitting" : "Mark Funded"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      writeContract({
                        address: dealRoomAddress,
                        abi: dealRoomAbi,
                        functionName: "closeDeal",
                        args: [BigInt(index)]
                      })
                    }
                    disabled={actionPending}
                  >
                    {actionPending ? "Submitting" : "Close Deal"}
                  </Button>
                  <TxLink hash={actionHash} />
                </div>
                {actionError ? (
                  <div className="text-xs text-red-300">{actionError.message}</div>
                ) : null}
                <RepayForm dealId={index} />
                <GrantAuditor dealId={index} />
              </div>
            ) : null}

            {mode === "investor" ? (
              <div className="mt-6 space-y-4">
                {deal.state === 1 ? <BidForm dealId={index} /> : null}
                <div className="rounded-lg border border-border bg-black/20 p-3 text-sm text-white/70">
                  <div>Your sealed bid: {bid?.sealedBid ?? "Not submitted"}</div>
                  <div className="flex items-center gap-2">
                    <span>Committed:</span>
                    {bid ? <EncryptedAmount handle={bid.amount} /> : "-"}
                  </div>
                  <div>Claimed: {bid?.claimed ? "Yes" : "No"}</div>
                </div>
                {deal.state >= 3 ? <ClaimButton dealId={index} /> : null}
              </div>
            ) : null}
          </Card>
        );
      })}
    </div>
  );
}
