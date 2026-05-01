"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { useState, useEffect } from "react";

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];
  const isWrongChain = isConnected && chain?.id !== arbitrumSepolia.id;

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="h-9 w-36 animate-pulse rounded-xl bg-surface-2" />;

  if (!isConnected) {
    return (
      <button
        onClick={() => connector && connect({ connector })}
        disabled={isPending || !connector}
        className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-xl border border-purple/30 bg-purple-subtle px-4 text-sm font-medium text-gold transition-all duration-150 hover:border-purple/30 hover:shadow-purple disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="relative">
          {!connector ? "No Wallet" : isPending ? "Connecting…" : "Connect Wallet"}
        </span>
      </button>
    );
  }

  if (isWrongChain) {
    return (
      <div className="inline-flex h-9 items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-4 text-sm font-medium text-warning">
        Wrong Network
      </div>
    );
  }

  return (
    <button
      onClick={() => disconnect()}
      className="group inline-flex h-9 items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-3.5 text-sm transition-all duration-150 hover:border-border-2 hover:bg-card"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
      </span>
      <span className="font-mono text-xs text-text-1">
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </span>
      <span className="text-xs text-text-3 group-hover:text-danger transition-colors">✕</span>
    </button>
  );
}
