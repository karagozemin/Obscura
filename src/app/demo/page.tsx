import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";

const steps = [
  "Connect wallet",
  "Mint or use test token",
  "Wrap into confidential token",
  "Create deal",
  "Submit sealed bid",
  "Repay",
  "Claim repayment",
  "Grant auditor access",
  "View disclosure as auditor"
];

export default function DemoPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        title="Judge Demo Mode"
        description="Guided walkthrough of the real confidential funding flow. Each step requires a real onchain action."
      />
      <div className="grid gap-4">
        {steps.map((step, index) => (
          <Card key={step}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">Step {index + 1}</p>
              <p className="text-white/70">{step}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/issuer" className={buttonStyles({ variant: "outline" })}>
          Go to Issuer Flow
        </Link>
        <Link href="/investor" className={buttonStyles({ variant: "outline" })}>
          Go to Investor Flow
        </Link>
        <Link href="/auditor" className={buttonStyles({ variant: "outline" })}>
          Go to Auditor Flow
        </Link>
      </div>
      <p className="text-sm text-white/60">
        Demo mode only guides the flow. Deal state, bids, repayments, and claims are pulled from
        the live contracts and cannot be faked.
      </p>
    </div>
  );
}
