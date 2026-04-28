"use client";

import { createViemHandleClient, type HandleClient } from "@iexec-nox/handle";
import { useWalletClient } from "wagmi";
import { useEffect, useState } from "react";

export function useHandleClient() {
  const { data: walletClient } = useWalletClient();
  const [handleClient, setHandleClient] = useState<HandleClient | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!walletClient) {
        setHandleClient(null);
        return;
      }
      const client = await createViemHandleClient(walletClient);
      if (mounted) {
        setHandleClient(client);
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [walletClient]);

  return handleClient;
}
