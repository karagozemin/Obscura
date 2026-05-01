"use client";

import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { useEffect, useState } from "react";

async function requestChainSwitch() {
  const ethereum = (window as unknown as { ethereum?: { request?: (args: unknown) => Promise<unknown> } }).ethereum;
  if (!ethereum?.request) return false;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x66eee" }],
    });
    return true;
  } catch (error: unknown) {
    const code = (error as { code?: number }).code;
    if (code !== 4902) return false;
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x66eee",
        chainName: "Arbitrum Sepolia",
        rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
        blockExplorerUrls: ["https://sepolia.arbiscan.io"],
      }],
    });
    return true;
  }
}

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];
  const isWrongChain = isConnected && chainId !== arbitrumSepolia.id;

  useEffect(() => { setMounted(true); }, []);

  // Auto-switch every time the chain drifts away from Arbitrum Sepolia.
  // Re-fires whenever chainId changes (covers manual switches too).
  useEffect(() => {
    if (!mounted || !isConnected || !isWrongChain || isSwitching) return;
    void requestChainSwitch().then((switched) => {
      if (!switched) switchChain({ chainId: arbitrumSepolia.id });
    });
  }, [mounted, isConnected, isWrongChain, isSwitching, switchChain]);

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
      <button
        onClick={() => requestChainSwitch().then((ok) => { if (!ok) switchChain({ chainId: arbitrumSepolia.id }); })}
        disabled={isSwitching}
        className="group relative inline-flex h-9 items-center gap-2 overflow-hidden rounded-xl border border-warning/30 bg-warning/10 px-4 text-sm font-medium text-warning transition-all duration-150 hover:border-warning/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <span className="relative">
          {isSwitching ? "Switching…" : "Switch to Arbitrum Sepolia"}
        </span>
      </button>
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
