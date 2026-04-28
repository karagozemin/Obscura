import { SectionHeading } from "@/components/section-heading";
import { DealList } from "@/components/deals/deal-list";
import { TokenBalance } from "@/components/deals/token-balance";
import { WrapInstructions } from "@/components/deals/wrap-instructions";

export default function InvestorPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        title="Investor Dashboard"
        description="Wrap tokens into confidential assets, submit sealed bids, and claim repayments. All amounts remain private by default."
      />
      <TokenBalance />
      <WrapInstructions />
      <DealList mode="investor" />
    </div>
  );
}
