import { SectionHeading } from "@/components/section-heading";
import { DealList } from "@/components/deals/deal-list";
import { TokenBalance } from "@/components/deals/token-balance";
import { WrapInstructions } from "@/components/deals/wrap-instructions";

export default function InvestorPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        title="Investor Dashboard"
        description="Wrap tokens into confidential assets, encrypt sealed bids with iExec Nox, and claim repayments. Amounts remain hidden onchain."
      />
      <TokenBalance />
      <WrapInstructions />
      <DealList mode="investor" />
    </div>
  );
}
