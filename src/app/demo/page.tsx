import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

const steps = [
  { role: "Any",      action: "Connect your wallet to Arbitrum Sepolia" },
  { role: "Any",      action: "Get testnet USDC from Circle Faucet" },
  { role: "Any",      action: "Wrap USDC into cUSDC via the Wrap panel" },
  { role: "Issuer",   action: "Create a private credit deal with metadata" },
  { role: "Issuer",   action: "Open funding round → deal moves to Funding state" },
  { role: "Investor", action: "Authorize the deal room as operator" },
  { role: "Investor", action: "Encrypt bid amount with iExec Nox" },
  { role: "Investor", action: "Submit sealed bid onchain" },
  { role: "Issuer",   action: "Mark deal Funded → close the funding window" },
  { role: "Issuer",   action: "Authorize operator, encrypt repayment amount, and repay" },
  { role: "Investor", action: "Claim proportional repayment onchain" },
  { role: "Issuer",   action: "Grant auditor ACL access for a specific investor bid" },
  { role: "Auditor",  action: "View and decrypt permissioned bid disclosure" },
];

const roleColor: Record<string, string> = {
  Any:      "border-border bg-surface-2 text-text-2",
  Issuer:   "border-purple/30 bg-purple-subtle text-gold",
  Investor: "border-success/25 bg-success-bg text-success",
  Auditor:  "border-blue-500/25 bg-blue-950/40 text-blue-400",
};

export default function DemoPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Demo Mode"
        title="Guided Confidential Funding Flow"
        description="Every step triggers a real onchain transaction. Deal state, encrypted bids, and repayments are pulled live — nothing is simulated."
      />

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-2"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-purple/30 bg-purple-subtle text-xs font-bold text-gold">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="flex flex-1 items-center justify-between gap-4">
              <p className="text-sm text-text-1">{step.action}</p>
              <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${roleColor[step.role]}`}>
                {step.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">Jump to a role</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/issuer"   className={buttonStyles({ variant: "outline" })}>Issuer Dashboard</Link>
          <Link href="/investor" className={buttonStyles({ variant: "outline" })}>Investor Dashboard</Link>
          <Link href="/auditor"  className={buttonStyles({ variant: "outline" })}>Auditor Dashboard</Link>
        </div>
        <p className="mt-4 text-xs text-text-3">
          Deal state, encrypted amounts, and transaction hashes are always sourced directly from the deployed contract — they cannot be faked.
        </p>
      </div>
    </div>
  );
}
