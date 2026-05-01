"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

const ARB_SEPOLIA_HEX = "0x66eee"; // 421614

async function switchToArbitrumSepolia() {
  const eth = (window as unknown as { ethereum?: { request: (a: unknown) => Promise<unknown> } }).ethereum;
  if (!eth) return;

  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARB_SEPOLIA_HEX }],
    });
  } catch (err: unknown) {
    // 4902 = chain not added to MetaMask yet
    if ((err as { code?: number }).code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: ARB_SEPOLIA_HEX,
          chainName: "Arbitrum Sepolia",
          nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
          rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
          blockExplorerUrls: ["https://sepolia.arbiscan.io"],
        }],
      });
    }
  }
}

export function ChainGuard({ children }: { children: React.ReactNode }) {
  const { isConnected, chain: connectedChain } = useAccount();
  const [switching, setSwitching] = useState(false);

  // chain is undefined when wallet is on a chain not in wagmi config
  const isWrongChain = isConnected && connectedChain?.id !== arbitrumSepolia.id;

  const handle = async () => {
    setSwitching(true);
    try {
      await switchToArbitrumSepolia();
    } finally {
      setSwitching(false);
    }
  };

  return (
    <>
      {children}
      {isWrongChain && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/80 backdrop-blur-md">
          <div className="mx-4 w-full max-w-sm rounded-2xl border border-warning/30 bg-card p-8 text-center shadow-2xl">
            <div className="mb-4 flex justify-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-2xl">⚠</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold text-text-1">Wrong Network</h2>
            <p className="mb-6 text-sm text-text-2">
              Obscura Finance runs on{" "}
              <span className="font-medium text-warning">Arbitrum Sepolia</span>.
              Please switch your wallet to continue.
            </p>
            <button
              onClick={handle}
              disabled={switching}
              className="w-full rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm font-semibold text-warning transition-all hover:bg-warning/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {switching ? "Switching…" : "Switch to Arbitrum Sepolia"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
