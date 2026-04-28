import { Card } from "@/components/ui/card";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { WrapForm } from "@/components/deals/wrap-form";

export function WrapInstructions() {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-widest text-gold">Wrap Tokens</p>
      <h3 className="mt-1 text-lg font-semibold text-text-1">USDC → cUSDC</h3>
      <p className="mt-1 text-sm text-text-2">
        Convert ERC-20 USDC into ERC-7984 Confidential Tokens (1:1). Required for encrypted bids and repayments.
      </p>
      <p className="mt-2 text-xs text-text-3">
        Need testnet USDC?{" "}
        <a
          href="https://faucet.circle.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gold underline-offset-2 hover:underline"
        >
          Circle Faucet ↗
        </a>
        {" "}— select USDC on Arbitrum Sepolia.
      </p>
      {CONFIDENTIAL_TOKEN_ADDRESS && (
        <p className="mt-1 font-mono text-xs text-text-3 truncate">
          cUSDC: {CONFIDENTIAL_TOKEN_ADDRESS}
        </p>
      )}
      <div className="mt-5">
        <WrapForm />
      </div>
    </Card>
  );
}
