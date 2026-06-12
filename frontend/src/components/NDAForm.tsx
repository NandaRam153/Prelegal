"use client";

import type { NDAFields } from "@/lib/ndaTypes";

interface Props {
  fields: NDAFields;
  onChange: (fields: NDAFields) => void;
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  name: keyof NDAFields;
  value: string;
  onChange: (name: keyof NDAFields, val: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="input-field"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  name: keyof NDAFields;
  value: string;
  onChange: (name: keyof NDAFields, val: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        className="input-field resize-none"
        rows={3}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </div>
  );
}

export default function NDAForm({ fields, onChange }: Props) {
  const set = (name: keyof NDAFields, val: string) =>
    onChange({ ...fields, [name]: val });

  return (
    <div className="space-y-6 overflow-y-auto h-full pr-1">
      {/* Party 1 */}
      <section>
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
          style={{ color: "var(--navy)", borderColor: "var(--blue)" }}
        >
          Party 1
        </h3>
        <div className="space-y-3">
          <Field label="Company Name" name="party1Company" value={fields.party1Company} onChange={set} placeholder="Acme Corp" />
          <Field label="Signatory Name" name="party1Name" value={fields.party1Name} onChange={set} placeholder="Jane Smith" />
          <Field label="Title" name="party1Title" value={fields.party1Title} onChange={set} placeholder="CEO" />
          <Field label="Notice Address" name="party1Address" value={fields.party1Address} onChange={set} placeholder="123 Main St, San Francisco, CA 94105" />
        </div>
      </section>

      {/* Party 2 */}
      <section>
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
          style={{ color: "var(--navy)", borderColor: "var(--blue)" }}
        >
          Party 2
        </h3>
        <div className="space-y-3">
          <Field label="Company Name" name="party2Company" value={fields.party2Company} onChange={set} placeholder="Beta LLC" />
          <Field label="Signatory Name" name="party2Name" value={fields.party2Name} onChange={set} placeholder="John Doe" />
          <Field label="Title" name="party2Title" value={fields.party2Title} onChange={set} placeholder="CTO" />
          <Field label="Notice Address" name="party2Address" value={fields.party2Address} onChange={set} placeholder="456 Market St, New York, NY 10001" />
        </div>
      </section>

      {/* Agreement Terms */}
      <section>
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3 pb-1 border-b"
          style={{ color: "var(--navy)", borderColor: "var(--blue)" }}
        >
          Agreement Terms
        </h3>
        <div className="space-y-3">
          <TextArea label="Purpose" name="purpose" value={fields.purpose} onChange={set} placeholder="Evaluating a potential business relationship…" />
          <Field label="Effective Date" name="effectiveDate" value={fields.effectiveDate} onChange={set} type="date" />
          <Field label="MNDA Term" name="mndaTerm" value={fields.mndaTerm} onChange={set} placeholder="1 year from Effective Date" />
          <Field label="Term of Confidentiality" name="termOfConfidentiality" value={fields.termOfConfidentiality} onChange={set} placeholder="1 year from Effective Date" />
          <Field label="Governing Law (State)" name="governingLaw" value={fields.governingLaw} onChange={set} placeholder="Delaware" />
          <Field label="Jurisdiction" name="jurisdiction" value={fields.jurisdiction} onChange={set} placeholder="New Castle, DE" />
        </div>
      </section>
    </div>
  );
}
