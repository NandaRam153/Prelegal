"use client";

import dynamic from "next/dynamic";
import type { DocumentFields, DocumentTypeId } from "@/lib/documentTypes";
import { getDownloadFilename, toNDAFields } from "@/lib/documentTypes";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null }
);

const NDADocument = dynamic(() => import("@/components/NDADocument"), {
  ssr: false,
  loading: () => null,
});

const GenericDocumentPdf = dynamic(
  () => import("@/components/pdf/GenericDocumentPdf"),
  { ssr: false, loading: () => null }
);

interface Props {
  documentType: DocumentTypeId;
  fields: DocumentFields;
}

export default function DocumentDownloadButton({ documentType, fields }: Props) {
  const filename = getDownloadFilename(documentType, fields);
  const document =
    documentType === "mutual-nda" ? (
      <NDADocument fields={toNDAFields(fields)} />
    ) : (
      <GenericDocumentPdf documentType={documentType} fields={fields} />
    );

  return (
    <PDFDownloadLink document={document} fileName={filename}>
      {({ loading }: { loading: boolean }) => (
        <button
          className="btn-primary flex items-center gap-2"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {loading ? "Preparing PDF…" : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
