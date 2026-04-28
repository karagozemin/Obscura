import { SectionHeading } from "@/components/section-heading";
import { CreateDealForm } from "@/components/deals/create-deal-form";
import { DealList } from "@/components/deals/deal-list";
import { TokenBalance } from "@/components/deals/token-balance";
import { WrapInstructions } from "@/components/deals/wrap-instructions";

export default function IssuerPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        title="Issuer Dashboard"
        description="Create and manage confidential RWA funding rounds. Live deal state loads from onchain data once contracts are deployed."
      />
      <TokenBalance />
      <WrapInstructions />
      <CreateDealForm />
      <DealList mode="issuer" />
    </div>
  );
}
