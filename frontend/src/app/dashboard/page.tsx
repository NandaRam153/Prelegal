"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { api, type User } from "@/lib/api";
import ChatPanel from "@/components/ChatPanel";
import DocumentPreview from "@/components/DocumentPreview";
import type { DocumentFields, DocumentTypeId } from "@/lib/documentTypes";
import { emptyFields, getDocumentName } from "@/lib/documentTypes";

const DocumentDownloadButton = dynamic(
  () => import("@/components/DocumentDownloadButton"),
  { ssr: false }
);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [documentType, setDocumentType] = useState<DocumentTypeId | null>(null);
  const [fields, setFields] = useState<DocumentFields>({});
  const [isComplete, setIsComplete] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => router.replace("/"))
      .finally(() => setChecking(false));
  }, [router]);

  function handleDocumentTypeChange(nextType: DocumentTypeId | null) {
    setDocumentType(nextType);
    if (nextType) {
      setFields(emptyFields(nextType));
    } else {
      setFields({});
    }
    setIsComplete(false);
  }

  async function handleSignOut() {
    await api.signout();
    router.replace("/");
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--navy)" }}>
        <div className="text-white">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "#f4f6f9" }}>
      <header
        className="flex items-center justify-between px-6 py-3 shadow-sm"
        style={{ backgroundColor: "var(--navy)" }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-white">
            Pre<span style={{ color: "var(--blue)" }}>legal</span>
          </h1>
          <span
            className="text-xs font-semibold px-2 py-1 rounded"
            style={{ backgroundColor: "rgba(32,157,215,0.2)", color: "var(--blue)" }}
          >
            {getDocumentName(documentType)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
            {user?.email}
          </span>
          <button
            onClick={handleSignOut}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "white" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex flex-1 gap-4 p-4 overflow-hidden">
        <div className="w-96 shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-xl shadow p-4 flex-1 overflow-hidden flex flex-col">
            <h2
              className="text-sm font-bold mb-4"
              style={{ color: "var(--navy)" }}
            >
              AI Assistant
            </h2>
            <ChatPanel
              documentType={documentType}
              fields={fields}
              onDocumentTypeChange={handleDocumentTypeChange}
              onFieldsChange={setFields}
              onCompleteChange={setIsComplete}
            />
          </div>

          {isComplete && documentType && (
            <DocumentDownloadButton documentType={documentType} fields={fields} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <DocumentPreview documentType={documentType} fields={fields} />
        </div>
      </main>
    </div>
  );
}
