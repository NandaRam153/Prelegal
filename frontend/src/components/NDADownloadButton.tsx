"use client";

import dynamic from "next/dynamic";
import type { NDAFields } from "@/lib/ndaTypes";

// @react-pdf/renderer must run client-side only
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => null }
);

const NDADocument = dynamic(() => import("./NDADocument"), {
  ssr: false,
  loading: () => null,
});

export default function NDADownloadButton({ fields }: { fields: NDAFields }) {
  const filename = [
    fields.party1Company || "Party1",
    fields.party2Company || "Party2",
    "Mutual-NDA.pdf",
  ]
    .join("_")
    .replace(/\s+/g, "-");

  return (
    <PDFDownloadLink
      document={<NDADocument fields={fields} />}
      fileName={filename}
    >
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
