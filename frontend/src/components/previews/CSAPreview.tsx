"use client";

import type { DocumentFields } from "@/lib/documentTypes";
import ProviderCustomerPreview from "./ProviderCustomerPreview";

export default function CSAPreview({ fields }: { fields: DocumentFields }) {
  return (
    <ProviderCustomerPreview
      title="Cloud Service Agreement"
      fields={fields}
      extraRows={[
        { label: "Subscription Period", key: "subscriptionPeriod", placeholder: "1 year" },
        { label: "Cloud Service Description", key: "cloudServiceDescription", placeholder: "Describe the cloud service…" },
        { label: "Fees", key: "fees", placeholder: "Fee structure…" },
      ]}
    />
  );
}
