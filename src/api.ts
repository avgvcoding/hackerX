import type { GenerationResponse, HealthResponse, Language, SellerRecord, SellerSummary, SourceChunk } from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function getHealth() {
  return request<HealthResponse>("/api/health");
}

export async function searchSellers(query: string) {
  const data = await request<{ records: SellerSummary[] }>(`/api/sellers?query=${encodeURIComponent(query)}&limit=30`);
  return data.records;
}

export function getSeller(glid: string) {
  return request<SellerRecord>(`/api/sellers/${encodeURIComponent(glid)}`);
}

export async function ragSearch(query: string, glid?: string) {
  const data = await request<{ chunks: SourceChunk[] }>("/api/rag/search", {
    method: "POST",
    body: JSON.stringify({ query, glid, top_k: 8 })
  });
  return data.chunks;
}

export function generateBrief(glid: string, language: Language, callObjective: string) {
  return request<GenerationResponse>("/api/brief", {
    method: "POST",
    body: JSON.stringify({ glid, language, call_objective: callObjective })
  });
}

export function generatePitch(glid: string, language: Language, callObjective: string, salespersonContext: string) {
  return request<GenerationResponse>("/api/pitch", {
    method: "POST",
    body: JSON.stringify({ glid, language, call_objective: callObjective, salesperson_context: salespersonContext })
  });
}

export function chat(
  glid: string,
  language: Language,
  callObjective: string,
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>
) {
  return request<GenerationResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      glid,
      language,
      call_objective: callObjective,
      messages
    })
  });
}
