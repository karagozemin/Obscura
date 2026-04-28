import { Card } from "@/components/ui/card";
import { CONFIDENTIAL_TOKEN_ADDRESS } from "@/lib/contracts";

export function WrapInstructions() {
  return (
    <Card>
      <h3 className="text-lg font-semibold">Wrap Tokens with iExec Nox</h3>
      <p className="mt-2 text-sm text-white/70">
        To fund deals privately, wrap your ERC-20 into a Confidential Token. This uses the iExec
        Nox Confidential Token contract configured for this deployment.
      </p>
      <div className="mt-3 text-xs text-white/60">
        Confidential Token Address: {CONFIDENTIAL_TOKEN_ADDRESS || "Configure in env"}
      </div>
    </Card>
  );
}
