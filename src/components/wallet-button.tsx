"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <Button
        onClick={() => connect({ connector: injected() })}
        disabled={isPending}
      >
        {isPending ? "Connecting" : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => disconnect()}>
      {address?.slice(0, 6)}...{address?.slice(-4)}
    </Button>
  );
}
