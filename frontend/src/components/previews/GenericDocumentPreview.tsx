"use client";

import type { DocumentFields, DocumentTypeId } from "@/lib/documentTypes";
import { DOCUMENT_TYPES, FIELD_LABELS } from "@/lib/documentTypes";

function fill(val: string | undefined, placeholder: string) {
  return val?.trim() || (
    <span className="italic" style={{ color: "var(--gray)" }}>
      {placeholder}
    </span>
  );
}

interface Props {
  documentType: DocumentTypeId;
  fields: DocumentFields;
}

export default function GenericDocumentPreview({ documentType, fields }: Props) {
  const config = DOCUMENT_TYPES[documentType];

  return (
    <div
      className="bg-white rounded-xl shadow p-8 overflow-y-auto h-full text-sm leading-relaxed"
      style={{ fontFamily: "Georgia, serif", color: "#1a1a2e" }}
    >
      <div className="text-center mb-8 border-b pb-6" style={{ borderColor: "#e5e7eb" }}>
        <h1 className="text-xl font-bold mb-1" style={{ color: "var(--navy)" }}>
          {config.name}
        </h1>
        <p className="text-xs" style={{ color: "var(--gray)" }}>
          Common Paper Standard — Cover Page Preview
        </p>
      </div>

      <section>
        <h2 className="font-bold text-base mb-4" style={{ color: "var(--navy)" }}>
          Document Details
        </h2>
        <div className="space-y-3">
          {config.fieldNames.map((key) => (
            <div key={key}>
              <span className="font-semibold" style={{ color: "var(--navy)" }}>
                {FIELD_LABELS[key] ?? key}:{" "}
              </span>
              {fill(fields[key], `Enter ${FIELD_LABELS[key] ?? key}…`)}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
