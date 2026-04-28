"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const connector = connectors[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <Button
        onClick={() => connector && connect({ connector })}
        disabled={isPending || !connector}
      >
        {!connector ? "Wallet Unavailable" : isPending ? "Connecting" : "Connect Wallet"}
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => disconnect()}>
      {address?.slice(0, 6)}...{address?.slice(-4)}
    </Button>
  );
}
