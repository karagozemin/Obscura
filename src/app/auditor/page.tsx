import { SectionHeading } from "@/components/section-heading";
import { DealList } from "@/components/deals/deal-list";
import { AuditLookup } from "@/components/deals/audit-lookup";

export default function AuditorPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Auditor Dashboard"
        title="Permissioned Bid Disclosure"
        description="Access is granted per-deal by the issuer. Bid handles are encrypted with iExec Nox ACL — you can only decrypt what you've been authorised to view."
      />
      <DealList mode="auditor" />
      <AuditLookup />
    </div>
  );
}
