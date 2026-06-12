"use client";

import type { DocumentFields, DocumentTypeId } from "@/lib/documentTypes";
import { DOCUMENT_TYPES, toNDAFields } from "@/lib/documentTypes";
import NDAPreview from "@/components/NDAPreview";
import CSAPreview from "@/components/previews/CSAPreview";
import PilotPreview from "@/components/previews/PilotPreview";
import GenericDocumentPreview from "@/components/previews/GenericDocumentPreview";

interface Props {
  documentType: DocumentTypeId | null;
  fields: DocumentFields;
}

export default function DocumentPreview({ documentType, fields }: Props) {
  if (!documentType) {
    return (
      <div
        className="bg-white rounded-xl shadow p-8 flex items-center justify-center h-full text-sm"
        style={{ color: "var(--gray)" }}
      >
        Start a conversation to choose a document type. Your live preview will appear here.
      </div>
    );
  }

  const style = DOCUMENT_TYPES[documentType].previewStyle;

  if (style === "nda") {
    return <NDAPreview fields={toNDAFields(fields)} />;
  }
  if (documentType === "csa") {
    return <CSAPreview fields={fields} />;
  }
  if (documentType === "pilot") {
    return <PilotPreview fields={fields} />;
  }
  return <GenericDocumentPreview documentType={documentType} fields={fields} />;
}
