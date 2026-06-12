"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { api, type ChatMessage } from "@/lib/api";
import type { NDAFields } from "@/lib/ndaTypes";

interface Props {
  fields: NDAFields;
  onFieldsChange: (fields: NDAFields) => void;
  onCompleteChange: (complete: boolean) => void;
}

export default function ChatPanel({
  fields,
  onFieldsChange,
  onCompleteChange,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initialized) return;
    setInitialized(true);
    api
      .chatGreeting()
      .then(({ message }) => {
        setMessages([{ role: "assistant", content: message }]);
        inputRef.current?.focus();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load chat");
      });
  }, [initialized]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { role: "user", content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await api.chatMessage(nextMessages, fields);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.message },
      ]);
      onFieldsChange(response.fields);
      onCompleteChange(response.is_complete);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
        {messages.map((msg, index) => (
          <div
            key={`${msg.role}-${index}`}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className="max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed"
              style={
                msg.role === "user"
                  ? { backgroundColor: "var(--navy)", color: "white" }
                  : { backgroundColor: "#f3f4f6", color: "#1a1a2e" }
              }
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs" style={{ color: "var(--gray)" }}>
            Prelegal is thinking…
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={inputRef}
          className="input-field resize-none flex-1"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer…"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          className="btn-primary self-end px-4"
          disabled={loading || !input.trim()}
          style={{ backgroundColor: "var(--purple)" }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
