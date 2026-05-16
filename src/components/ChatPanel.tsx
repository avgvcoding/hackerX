import { Send, Sparkles, FileSearch, MessageCircle, FileText, Database } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SellerRecord, GenerationResponse, SourceChunk } from "../types";
import { MarkdownLite, Spinner, TypingIndicator, renderInline, val } from "./shared";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  mode?: GenerationResponse["mode"];
  model?: string;
  sources?: SourceChunk[];
};

const QUICK_QUESTIONS = [
  "What should I discuss first?",
  "What are the likely objections?",
  "Suggest an opening line",
  "Which pain point is most urgent?",
];

export function ChatPanel({
  seller,
  chatTurns,
  question,
  setQuestion,
  runChat,
  runBrief,
  runPitch,
  loading,
  salesContext,
  setSalesContext,
  standalone = false,
}: {
  seller: SellerRecord | null;
  chatTurns: ChatTurn[];
  question: string;
  setQuestion: (v: string) => void;
  runChat: (promptOverride?: string) => void;
  runBrief: () => void;
  runPitch: () => void;
  loading: string | null;
  salesContext: string;
  setSalesContext: (v: string) => void;
  standalone?: boolean;
}) {
  const messagesRef = useRef<HTMLDivElement>(null);

  // Scroll ONLY the messages container — not ancestors. scrollIntoView would
  // bubble up and shift the page/sidebar, clipping their tops.
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [chatTurns, loading]);

  const companyName = seller
    ? val(seller.seller_identity?.company_name, "this seller")
    : "a seller";

  return (
    <div
      className={`chat-panel rounded-xl border border-line overflow-hidden shadow-panel ${
        standalone ? "h-full bg-white" : ""
      }`}
    >
      {/* Chat Header */}
      <div className="chat-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-ink">AI Sales Assistant</div>
              <div className="text-[11px] font-medium text-muted">
                {seller ? `Prepared for ${companyName}` : "Select a seller to start"}
              </div>
            </div>
          </div>
          {seller && (
            <div className="flex items-center gap-1.5">
              <span className="status-dot online" />
              <span className="text-[11px] font-semibold text-emerald-600">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesRef}
        className="chat-messages scrollbar-thin"
        style={
          standalone
            ? { flex: 1, minHeight: 0 }
            : { minHeight: 300, maxHeight: "calc(100vh - 380px)" }
        }
      >
        {chatTurns.length === 0 &&
        loading !== "brief" &&
        loading !== "pitch" &&
        loading !== "chat" ? (
          <div className="flex flex-col items-center justify-center h-full py-12 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 mb-5">
              <MessageCircle size={28} className="text-blue-500" />
            </div>
            <h3 className="text-base font-bold text-ink">
              Ask me about {companyName}
            </h3>
            <p className="mt-2 max-w-xs text-center text-xs leading-5 text-muted">
              I can generate call briefs, sales pitches, answer questions about the seller, and help you prepare for your call.
            </p>

            {/* Quick questions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-sm">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => runChat(q)}
                  disabled={!seller || loading === "chat"}
                  className="quick-action-chip"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatTurns.map((turn, index) => (
              <ChatBubble key={`${turn.role}-${index}`} turn={turn} />
            ))}
          </>
        )}

        {loading === "chat" && <TypingIndicator />}
        {loading === "brief" && <InlineLoaderBubble label="Generating pre-call brief…" />}
        {loading === "pitch" && <InlineLoaderBubble label="Crafting your sales pitch…" />}
      </div>

      {/* Call Context (collapsible) */}
      {seller && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <textarea
            value={salesContext}
            onChange={(e) => setSalesContext(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-700 outline-none resize-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20"
            rows={2}
            placeholder="Add call context (e.g., renewal follow-up, buy lead issue)..."
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={runBrief}
              disabled={!seller || loading === "brief"}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-700 disabled:opacity-40"
            >
              {loading === "brief" ? <Spinner /> : <FileSearch size={13} />}
              Generate Brief
            </button>
            <button
              onClick={runPitch}
              disabled={!seller || loading === "pitch"}
              className="flex-1 primary-button text-xs h-auto py-2"
            >
              {loading === "pitch" ? <Spinner /> : <Sparkles size={13} />}
              Create Pitch
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="chat-input-area">
        <div className="chat-input-wrapper">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                runChat();
              }
            }}
            placeholder={seller ? `Ask about ${companyName}...` : "Select a seller first..."}
            disabled={!seller}
          />
          <button
            onClick={() => runChat()}
            disabled={!seller || loading === "chat" || !question.trim()}
            className="chat-send-btn"
            title="Send message"
          >
            {loading === "chat" ? <Spinner /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineLoaderBubble({ label }: { label: string }) {
  return (
    <div className="chat-bubble-bot flex items-center gap-2.5">
      <Spinner />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  );
}

function ChatBubble({ turn }: { turn: ChatTurn }) {
  const isUser = turn.role === "user";

  if (isUser) {
    return (
      <div className="chat-bubble-user">
        <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {turn.content}
        </div>
      </div>
    );
  }

  const { body, sourcesMarkdown } = splitOnSourcesHeading(turn.content);
  const hasEvidence = (turn.sources?.length ?? 0) > 0;

  return (
    <div className="chat-bubble-bot">
      <div className="text-[15px] leading-relaxed">
        <MarkdownLite text={body} />
      </div>

      {hasEvidence && <EvidenceBlock sources={turn.sources!} />}

      {sourcesMarkdown && <CompactSources markdown={sourcesMarkdown} />}
    </div>
  );
}

/**
 * Splits assistant markdown into its body and the trailing "Sources" section
 * (if any). Matches the LAST occurrence of a heading whose title contains
 * "sources" (case-insensitive).
 */
function splitOnSourcesHeading(content: string): {
  body: string;
  sourcesMarkdown: string | null;
} {
  const lines = content.split("\n");
  let splitIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^\s*#+\s+sources\b/i.test(lines[i])) {
      splitIdx = i;
      break;
    }
  }
  if (splitIdx === -1) return { body: content, sourcesMarkdown: null };
  return {
    body: lines.slice(0, splitIdx).join("\n").trimEnd(),
    sourcesMarkdown: lines.slice(splitIdx + 1).join("\n"),
  };
}

/** Compact, one-line-per-item Sources list rendered under the body. */
function CompactSources({ markdown }: { markdown: string }) {
  const items: string[] = [];
  for (const raw of markdown.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = /^[-*+]\s+(.+)$/.exec(line);
    if (m) items.push(m[1].trim());
  }
  if (items.length === 0) return null;
  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/70">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <FileText size={11} />
        Sources
      </div>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="truncate text-[11px] leading-snug text-slate-500"
            title={stripInlineMarkdown(item)}
          >
            <span className="mr-1 text-slate-400">·</span>
            {renderInline(item, `src-${i}`)}
          </li>
        ))}
      </ul>
    </div>
  );
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

/** Evidence section: small, expandable cards drawn from API source chunks. */
function EvidenceBlock({ sources }: { sources: SourceChunk[] }) {
  const [expanded, setExpanded] = useState(false);
  const top = expanded ? sources : sources.slice(0, 3);
  const remaining = sources.length - top.length;

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/70">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <Database size={11} />
        Evidence
      </div>
      <div className="space-y-1">
        {top.map((src) => (
          <EvidenceChip key={src.id} source={src} />
        ))}
      </div>
      {sources.length > 3 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-[11px] font-bold text-blue-600 hover:text-blue-700"
        >
          {expanded ? "Show fewer" : `Show ${remaining} more`}
        </button>
      )}
    </div>
  );
}

function EvidenceChip({ source }: { source: SourceChunk }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-md border border-slate-200/70 bg-white/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-1.5 px-2 py-1 text-left hover:bg-slate-50"
      >
        <span
          className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
            source.kind === "doc"
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {source.kind}
        </span>
        <span className="min-w-0 flex-1 truncate text-[11px] font-semibold text-slate-700">
          {source.title}
        </span>
        <span className="shrink-0 text-[10px] text-slate-400">
          {open ? "▲" : "▼"}
        </span>
      </button>
      {open && (
        <div className="border-t border-slate-100 px-2.5 py-2 bg-slate-50/40">
          <div className="mb-1.5 truncate text-[10px] font-medium text-blue-500">
            {source.source}
          </div>
          <EvidenceContent source={source} />
        </div>
      )}
    </div>
  );
}

/** Render evidence content based on the chunk kind / format. */
function EvidenceContent({ source }: { source: SourceChunk }) {
  // Seller chunks usually contain Python-dict-style strings. Try parsing first.
  const parsed = tryParseStructured(source.text);
  if (parsed && parsed.length > 0) {
    return (
      <div className="space-y-2">
        {parsed.map((item, idx) => (
          <StructuredItem key={idx} item={item} />
        ))}
      </div>
    );
  }

  // Document chunks: render as markdown (handles tables-as-pipes, headings, lists).
  if (source.kind === "doc") {
    return (
      <div className="text-[12px] leading-snug text-slate-700">
        <MarkdownLite text={source.text} />
      </div>
    );
  }

  // Fallback: plain text, monospace, line-clamped.
  return (
    <p className="whitespace-pre-wrap text-[11px] leading-snug text-slate-600 line-clamp-8">
      {source.text}
    </p>
  );
}

/* ─── Structured rendering for Python-dict-style chunks ─── */
function StructuredItem({ item }: { item: Record<string, any> }) {
  const entries = Object.entries(item).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  return (
    <div className="rounded border border-slate-200/70 bg-white px-2 py-1.5">
      <div className="grid grid-cols-[110px,1fr] gap-x-2 gap-y-1">
        {entries.map(([key, value]) => (
          <div key={key} className="contents">
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-snug pt-0.5">
              {humanizeKey(key)}
            </div>
            <div className="min-w-0 break-words text-[11px] leading-snug text-slate-700">
              {renderEvidenceValue(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderEvidenceValue(value: any): React.ReactNode {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (value.every((v) => typeof v !== "object" || v === null)) {
      return (
        <ul className="list-disc pl-3.5 space-y-0.5 marker:text-slate-400">
          {value.map((v, idx) => (
            <li key={idx}>{String(v)}</li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-1.5">
        {value.map((v, idx) => (
          <StructuredItem key={idx} item={v} />
        ))}
      </div>
    );
  }
  if (typeof value === "object") return <StructuredItem item={value} />;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function humanizeKey(key: string): string {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Try to parse a Python-dict-style string into structured JSON records. */
function tryParseStructured(
  text: string
): Array<Record<string, any>> | null {
  if (!text || typeof text !== "string") return null;
  const trimmed = text.trim();
  if (!trimmed.startsWith("[") && !trimmed.startsWith("{")) return null;
  if (!/['{}]/.test(trimmed)) return null;
  const candidate = pythonLiteralToJson(trimmed);
  try {
    const parsed = JSON.parse(candidate);
    if (Array.isArray(parsed)) {
      const records = parsed.filter(
        (x) => x && typeof x === "object" && !Array.isArray(x)
      );
      return records.length ? records : null;
    }
    if (parsed && typeof parsed === "object") return [parsed];
    return null;
  } catch {
    return null;
  }
}

function pythonLiteralToJson(input: string): string {
  let out = input
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null");
  let result = "";
  let i = 0;
  while (i < out.length) {
    const ch = out[i];
    if (ch === '"') {
      result += ch;
      i++;
      while (i < out.length) {
        const c = out[i];
        result += c;
        if (c === "\\" && i + 1 < out.length) {
          result += out[i + 1];
          i += 2;
          continue;
        }
        i++;
        if (c === '"') break;
      }
      continue;
    }
    if (ch === "'") {
      i++;
      let buf = "";
      while (i < out.length) {
        const c = out[i];
        if (c === "\\" && i + 1 < out.length) {
          buf += out[i] + out[i + 1];
          i += 2;
          continue;
        }
        if (c === "'") {
          i++;
          break;
        }
        buf += c;
        i++;
      }
      buf = buf.replace(/"/g, '\\"');
      result += `"${buf}"`;
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}
