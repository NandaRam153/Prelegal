"use client";

import type { NDAFields } from "@/lib/ndaTypes";

function fill(val: string, placeholder: string) {
  return val.trim() || (
    <span className="italic" style={{ color: "var(--gray)" }}>
      {placeholder}
    </span>
  );
}

export default function NDAPreview({ fields }: { fields: NDAFields }) {
  return (
    <div
      className="bg-white rounded-xl shadow p-8 overflow-y-auto h-full text-sm leading-relaxed"
      style={{ fontFamily: "Georgia, serif", color: "#1a1a2e" }}
    >
      {/* Header */}
      <div className="text-center mb-8 border-b pb-6" style={{ borderColor: "#e5e7eb" }}>
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--navy)" }}>
          Mutual Non-Disclosure Agreement
        </h1>
        <p className="text-xs" style={{ color: "var(--gray)" }}>
          Common Paper Standard — Version 1.0
        </p>
      </div>

      {/* Cover Page */}
      <section className="mb-6">
        <h2 className="font-bold text-base mb-4" style={{ color: "var(--navy)" }}>
          Cover Page
        </h2>

        <table className="w-full border-collapse text-xs mb-4">
          <thead>
            <tr style={{ backgroundColor: "#f3f4f6" }}>
              <th className="border p-2 text-left w-1/3" style={{ borderColor: "#e5e7eb" }}></th>
              <th className="border p-2 text-center w-1/3" style={{ borderColor: "#e5e7eb", color: "var(--navy)" }}>
                Party 1
              </th>
              <th className="border p-2 text-center w-1/3" style={{ borderColor: "#e5e7eb", color: "var(--navy)" }}>
                Party 2
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Company", "party1Company", "party2Company", "Acme Corp", "Beta LLC"],
              ["Signatory Name", "party1Name", "party2Name", "Jane Smith", "John Doe"],
              ["Title", "party1Title", "party2Title", "CEO", "CTO"],
              ["Notice Address", "party1Address", "party2Address", "123 Main St…", "456 Market St…"],
            ].map(([label, f1, f2, ph1, ph2]) => (
              <tr key={label as string}>
                <td className="border p-2 font-semibold" style={{ borderColor: "#e5e7eb", color: "var(--gray)" }}>
                  {label}
                </td>
                <td className="border p-2 text-center" style={{ borderColor: "#e5e7eb" }}>
                  {fill(fields[f1 as keyof NDAFields], ph1 as string)}
                </td>
                <td className="border p-2 text-center" style={{ borderColor: "#e5e7eb" }}>
                  {fill(fields[f2 as keyof NDAFields], ph2 as string)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-3">
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Purpose: </span>
            {fill(fields.purpose, "Evaluating a potential business relationship…")}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Effective Date: </span>
            {fill(fields.effectiveDate, "YYYY-MM-DD")}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>MNDA Term: </span>
            {fill(fields.mndaTerm, "1 year from Effective Date")}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Term of Confidentiality: </span>
            {fill(fields.termOfConfidentiality, "1 year from Effective Date")}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Governing Law: </span>
            {fill(fields.governingLaw, "Delaware")}
          </div>
          <div>
            <span className="font-semibold" style={{ color: "var(--navy)" }}>Jurisdiction: </span>
            {fill(fields.jurisdiction, "New Castle, DE")}
          </div>
        </div>
      </section>

      {/* Signature block */}
      <section className="mt-6 pt-4 border-t" style={{ borderColor: "#e5e7eb" }}>
        <p className="text-xs mb-4" style={{ color: "var(--gray)" }}>
          By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.
        </p>
        <div className="grid grid-cols-2 gap-8">
          {[
            { label: "Party 1", company: fields.party1Company, name: fields.party1Name, title: fields.party1Title },
            { label: "Party 2", company: fields.party2Company, name: fields.party2Name, title: fields.party2Title },
          ].map((p) => (
            <div key={p.label}>
              <p className="font-bold text-xs mb-3" style={{ color: "var(--navy)" }}>{p.label}</p>
              <div className="border-b mb-4" style={{ borderColor: "#9ca3af", height: "40px" }} />
              <p className="text-xs"><strong>Signature</strong></p>
              <p className="text-xs mt-2">
                <strong>Name:</strong>{" "}
                {fill(p.name, "Signatory Name")}
              </p>
              <p className="text-xs mt-1">
                <strong>Title:</strong>{" "}
                {fill(p.title, "Title")}
              </p>
              <p className="text-xs mt-1">
                <strong>Company:</strong>{" "}
                {fill(p.company, "Company Name")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-8 text-center text-xs" style={{ color: "var(--gray)" }}>
        Common Paper Mutual NDA Version 1.0 — free to use under CC BY 4.0
      </p>
    </div>
  );
}
