import { SectionHeading } from "@/components/section-heading";
import { DealList } from "@/components/deals/deal-list";
import { AuditLookup } from "@/components/deals/audit-lookup";

export default function AuditorPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        title="Auditor Dashboard"
        description="Access is permissioned by issuers. Handles are encrypted with iExec Nox and require ACL access to decrypt."
      />
      <DealList mode="auditor" />
      <AuditLookup />
    </div>
  );
}
