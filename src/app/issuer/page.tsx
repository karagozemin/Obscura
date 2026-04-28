import { SectionHeading } from "@/components/section-heading";
import { CreateDealForm } from "@/components/deals/create-deal-form";
import { DealList } from "@/components/deals/deal-list";
import { TokenBalance } from "@/components/deals/token-balance";
import { WrapInstructions } from "@/components/deals/wrap-instructions";

export default function IssuerPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Issuer Dashboard"
        title="Manage Your Private Credit Rounds"
        description="Create deals, open funding rounds, repay investors, and grant auditor access — all onchain with encrypted amounts."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <TokenBalance />
        <WrapInstructions />
      </div>
      <CreateDealForm />
      <DealList mode="issuer" />
    </div>
  );
}
