"use client";

import type { DocumentFields } from "@/lib/documentTypes";
import ProviderCustomerPreview from "./ProviderCustomerPreview";

export default function PilotPreview({ fields }: { fields: DocumentFields }) {
  return (
    <ProviderCustomerPreview
      title="Pilot Agreement"
      fields={fields}
      extraRows={[
        { label: "Pilot Period", key: "pilotPeriod", placeholder: "30 days" },
        { label: "Product Description", key: "productDescription", placeholder: "Describe the product…" },
        { label: "General Cap Amount", key: "generalCapAmount", placeholder: "$1,000" },
      ]}
    />
  );
}
