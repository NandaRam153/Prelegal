const BASE = "";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = err.detail;
    const message =
      typeof detail === "string"
        ? detail
        : Array.isArray(detail)
          ? detail.map((item: { msg?: string }) => item.msg ?? String(item)).join(", ")
          : "Request failed";
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

import type { DocumentFields, DocumentTypeId } from "./documentTypes";

export interface User {
  id: number;
  email: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CatalogEntry {
  id: DocumentTypeId;
  name: string;
  description: string;
  filename: string;
}

export interface ChatResponse {
  message: string;
  document_type: DocumentTypeId | null;
  fields: DocumentFields;
  is_complete: boolean;
}

export const api = {
  signup: (email: string, password: string) =>
    request<User>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signin: (email: string, password: string) =>
    request<User>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signout: () =>
    request<{ message: string }>("/api/auth/signout", { method: "POST" }),

  me: () => request<User>("/api/auth/me"),

  catalog: () => request<CatalogEntry[]>("/api/catalog"),

  chatGreeting: () => request<{ message: string }>("/api/chat/greeting"),

  chatMessage: (
    messages: ChatMessage[],
    documentType: DocumentTypeId | null,
    fields: DocumentFields
  ) =>
    request<ChatResponse>("/api/chat/message", {
      method: "POST",
      body: JSON.stringify({
        messages,
        document_type: documentType,
        fields,
      }),
    }),
};
