import { SectionHeading } from "@/components/section-heading";
import { DealList } from "@/components/deals/deal-list";
import { TokenBalance } from "@/components/deals/token-balance";
import { WrapInstructions } from "@/components/deals/wrap-instructions";

export default function InvestorPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Investor Dashboard"
        title="Fund Deals with Encrypted Bids"
        description="Wrap tokens into confidential assets, encrypt your bid amount with iExec Nox, and claim repayments — your allocation stays hidden onchain."
      />
      <div className="grid gap-6 md:grid-cols-2">
        <TokenBalance />
        <WrapInstructions />
      </div>
      <DealList mode="investor" />
    </div>
  );
}
