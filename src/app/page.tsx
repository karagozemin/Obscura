import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="space-y-8">
        <Badge>Confidential RWA Deal Room</Badge>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Private RWA funding, without public exposure.
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            Obscura Finance is a confidential deal room where investors submit sealed bids,
            allocations stay hidden, repayments settle onchain, and auditors verify details
            through permissioned disclosure.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/demo" className={buttonStyles({ variant: "primary" })}>
            Start Judge Demo
          </Link>
          <Link href="/issuer" className={buttonStyles({ variant: "outline" })}>
            Issuer Dashboard
          </Link>
          <Link href="/investor" className={buttonStyles({ variant: "ghost" })}>
            Investor Dashboard
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="text-lg font-semibold">Problem</h3>
          <p className="mt-2 text-white/70">
            Private credit cannot move fully onchain if every bid, allocation, and repayment
            exposure is public. Issuers need settlement transparency while investors require
            confidentiality for strategy and exposure.
          </p>
        </Card>
        <Card>
          <h3 className="text-lg font-semibold">Solution</h3>
          <p className="mt-2 text-white/70">
            Obscura Finance combines confidential token funding with permissioned audit access.
            Investors fund deals privately, issuers settle repayments onchain, and auditors can
            verify sensitive details only when access is granted.
          </p>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          "Sealed investor bids",
          "Confidential token funding",
          "Hidden allocations",
          "Private investor exposure",
          "Onchain repayment and claim flow",
          "Permissioned auditor disclosure",
          "Real transaction timeline"
        ].map((feature) => (
          <Card key={feature}>
            <p className="text-sm font-semibold text-white">{feature}</p>
          </Card>
        ))}
      </section>

      <section className="rounded-2xl border border-border bg-card/60 p-8">
        <h3 className="text-xl font-semibold">Demo in under 4 minutes</h3>
        <ol className="mt-4 space-y-2 text-white/70">
          <li>1. Issuer creates a private credit deal.</li>
          <li>2. Investor wraps tokens into a confidential asset.</li>
          <li>3. Investor submits a sealed bid.</li>
          <li>4. Issuer repays and investors claim onchain.</li>
          <li>5. Auditor views permissioned disclosure.</li>
        </ol>
      </section>
    </div>
  );
}
