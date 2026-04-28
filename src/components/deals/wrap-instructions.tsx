import { Card } from "@/components/ui/card";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";
import { WrapForm } from "@/components/deals/wrap-form";

export function WrapInstructions() {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Wrap Tokens with iExec Nox</h3>
      <p className="mt-2 text-sm text-white/70">
        Wrap your ERC-20 USDC into ERC-7984 Confidential Token (cUSDC) to submit encrypted bids or repay deals. Tokens are exchanged 1:1.
      </p>
      <p className="mt-2 text-sm text-white/50">
        Need testnet USDC?{" "}
        <a
          href="https://faucet.circle.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-white/70 hover:text-white"
        >
          Get it from Circle Faucet
        </a>{" "}
        — select USDC on Arbitrum Sepolia.
      </p>
      <div className="mt-3 text-xs text-white/60">
        Confidential Token: {CONFIDENTIAL_TOKEN_ADDRESS || "Configure in env"}
      </div>
      <div className="mt-4">
        <WrapForm />
      </div>
    </Card>
  );
}
