import { SectionHeading } from "@/components/section-heading";
import { CreateDealForm } from "@/components/deals/create-deal-form";
import { DealList } from "@/components/deals/deal-list";

export default function IssuerPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        title="Issuer Dashboard"
        description="Create and manage confidential RWA funding rounds. Live deal state loads from onchain data once contracts are deployed."
      />
      <CreateDealForm />
      <DealList mode="issuer" />
    </div>
  );
}
