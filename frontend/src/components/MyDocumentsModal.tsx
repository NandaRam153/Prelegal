"use client";

import { useEffect, useState } from "react";
import { api, type DocumentSummary } from "@/lib/api";
import { getDocumentName } from "@/lib/documentTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  onLoad: (id: number) => void;
}

export default function MyDocumentsModal({ open, onClose, onLoad }: Props) {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError("");
    api
      .listDocuments()
      .then(setDocuments)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load documents");
      })
      .finally(() => setLoading(false));
  }, [open]);

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError("");
    try {
      await api.deleteDocument(id);
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(3, 33, 71, 0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold" style={{ color: "var(--navy)" }}>
            My Documents
          </h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-lg"
            style={{ color: "var(--gray)" }}
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading && <p className="text-sm" style={{ color: "var(--gray)" }}>Loading…</p>}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
              {error}
            </p>
          )}
          {!loading && documents.length === 0 && (
            <p className="text-sm" style={{ color: "var(--gray)" }}>
              No saved documents yet. Use Save on the dashboard after drafting one.
            </p>
          )}
          <ul className="space-y-3">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="border rounded-lg p-3 flex items-start justify-between gap-3"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--navy)" }}>
                    {doc.title}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--gray)" }}>
                    {getDocumentName(doc.document_type)}
                    {doc.is_complete ? " · Complete" : " · Draft"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--gray)" }}>
                    Updated {new Date(doc.updated_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoad(doc.id);
                      onClose();
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white"
                    style={{ backgroundColor: "var(--blue)" }}
                  >
                    Load
                  </button>
                  <button
                    onClick={() => void handleDelete(doc.id)}
                    disabled={deletingId === doc.id}
                    className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                    style={{ backgroundColor: "#fee2e2", color: "#b91c1c" }}
                  >
                    {deletingId === doc.id ? "…" : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
