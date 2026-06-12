"use client";

import type { DocumentFields } from "@/lib/documentTypes";

function fill(val: string | undefined, placeholder: string) {
  return val?.trim() || (
    <span className="italic" style={{ color: "var(--gray)" }}>
      {placeholder}
    </span>
  );
}

interface Props {
  title: string;
  fields: DocumentFields;
  extraRows: Array<{ label: string; key: string; placeholder: string }>;
}

export default function ProviderCustomerPreview({
  title,
  fields,
  extraRows,
}: Props) {
  return (
    <div
      className="bg-white rounded-xl shadow p-8 overflow-y-auto h-full text-sm leading-relaxed"
      style={{ fontFamily: "Georgia, serif", color: "#1a1a2e" }}
    >
      <div className="text-center mb-8 border-b pb-6" style={{ borderColor: "#e5e7eb" }}>
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--navy)" }}>
          {title}
        </h1>
        <p className="text-xs" style={{ color: "var(--gray)" }}>
          Common Paper Standard — Cover Page Preview
        </p>
      </div>

      <section className="mb-6">
        <h2 className="font-bold text-base mb-4" style={{ color: "var(--navy)" }}>
          Parties
        </h2>
        <table className="w-full border-collapse text-xs mb-4">
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th className="border p-2 text-left w-1/3" style={{ borderColor: "#e5e7eb" }}></th>
              <th className="border p-2 text-center w-1/3" style={{ borderColor: "#e5e7eb", color: "var(--navy)" }}>
                Provider
              </th>
              <th className="border p-2 text-center w-1/3" style={{ borderColor: "#e5e7eb", color: "var(--navy)" }}>
                Customer
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Company", "providerCompany", "customerCompany", "Provider Co.", "Customer Co."],
              ["Signatory", "providerName", "customerName", "Jane Smith", "John Doe"],
              ["Title", "providerTitle", "customerTitle", "CEO", "CTO"],
              ["Notice Address", "providerAddress", "customerAddress", "123 Main St…", "456 Market St…"],
            ].map(([label, providerKey, customerKey, ph1, ph2]) => (
              <tr key={label as string}>
                <td className="border p-2 font-semibold" style={{ borderColor: "#e5e7eb", color: "var(--gray)" }}>
                  {label}
                </td>
                <td className="border p-2 text-center" style={{ borderColor: "#e5e7eb" }}>
                  {fill(fields[providerKey as string], ph1 as string)}
                </td>
                <td className="border p-2 text-center" style={{ borderColor: "#e5e7eb" }}>
                  {fill(fields[customerKey as string], ph2 as string)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-3">
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Effective Date: </span>
            {fill(fields.effectiveDate, "YYYY-MM-DD")}
          </div>
          {extraRows.map(({ label, key, placeholder }) => (
            <div key={key}>
              <span className="font-semibold" style={{ color: "var(--navy)" }}>{label}: </span>
              {fill(fields[key], placeholder)}
            </div>
          ))}
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Governing Law: </span>
            {fill(fields.governingLaw, "State")}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Chosen Courts: </span>
            {fill(fields.chosenCourts, "Courts in New Castle, DE")}
          </div>
        </div>
      </section>
    </div>
  );
}
