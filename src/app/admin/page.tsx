import { SectionHeading } from "@/components/section-heading";
import { IdentityAdmin } from "@/components/deals/identity-admin";

export default function AdminPage() {
  return (
    <div className="space-y-10">
      <SectionHeading
        tag="Admin"
        title="Identity Registry"
        description="Register and revoke KYC-verified investor identities. Only the registry admin can modify the whitelist. Investors must be registered before they can submit bids (ERC-3643)."
      />
      <IdentityAdmin />
    </div>
  );
}
