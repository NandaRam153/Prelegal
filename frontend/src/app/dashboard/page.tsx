"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { api, type User } from "@/lib/api";
import ChatPanel from "@/components/ChatPanel";
import NDAPreview from "@/components/NDAPreview";
import { emptyNDA, type NDAFields } from "@/lib/ndaTypes";

const NDADownloadButton = dynamic(
  () => import("@/components/NDADownloadButton"),
  { ssr: false }
);

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fields, setFields] = useState<NDAFields>(emptyNDA());
  const [isComplete, setIsComplete] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => router.replace("/"))
      .finally(() => setChecking(false));
  }, [router]);

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
            Mutual NDA
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
              fields={fields}
              onFieldsChange={setFields}
              onCompleteChange={setIsComplete}
            />
          </div>

          {isComplete && <NDADownloadButton fields={fields} />}
        </div>

        <div className="flex-1 min-w-0">
          <NDAPreview fields={fields} />
        </div>
      </main>
    </div>
  );
}
