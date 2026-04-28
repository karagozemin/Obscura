import { Card } from "@/components/ui/card";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";

export function WrapInstructions() {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Wrap Tokens with iExec Nox</h3>
      <p className="mt-2 text-sm text-white/70">
        To fund deals privately, wrap your ERC-20 into an ERC-7984 Confidential Token. You must
        authorize the deal room as an operator before submitting encrypted bids.
      </p>
      <div className="mt-3 text-xs text-white/60">
        Confidential Token Address: {CONFIDENTIAL_TOKEN_ADDRESS || "Configure in env"}
      </div>
    </Card>
  );
}
