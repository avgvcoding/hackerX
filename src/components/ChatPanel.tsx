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

      {/* Input Area */}
      <div className="chat-input-area">
        {seller && (
          <div className="mb-3 space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
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
            <PainPointSuggestionBubbles seller={seller} setQuestion={setQuestion} />
          </div>
        )}
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

function PainPointSuggestionBubbles({
  seller,
  setQuestion,
}: {
  seller: SellerRecord;
  setQuestion: (v: string) => void;
}) {
  const painSuggestions = (seller.pain_points ?? [])
    .slice(0, 5)
    .map((point, index) => {
      const category = stringValue(point.category) || `Pain point ${index + 1}`;
      const action = stringValue(point.suggested_action);
      const label = shortenText(category, 34);
      return {
        category,
        action,
        label,
        prompt: action
          ? `Give me a short salesperson line for ${category}. Suggested action: ${action}`
          : `Give me a short salesperson line for ${category}.`,
        tone: "pain" as const,
      };
    })
    .filter((item) => item.label);

  const categorySuggestions = (seller.categories_bl_last_6_months ?? [])
    .slice(0, 4)
    .map((category, index) => {
      const mcat = stringValue(category.mcat_name) || `Category ${index + 1}`;
      const products = [
        ...(category.primary_products ?? []),
        ...(category.secondary_products ?? []),
      ]
        .map(stringValue)
        .filter(Boolean)
        .slice(0, 3)
        .join(", ");
      const rank = stringValue(category.rank);
      const service = stringValue(category.service);
      const label = shortenText(mcat, 30);
      const detail = [
        products && `products: ${products}`,
        rank && `rank: ${rank}`,
        service && `service: ${service}`,
      ]
        .filter(Boolean)
        .join("; ");
      return {
        category: mcat,
        action: detail,
        label,
        prompt: `Use ${mcat}${detail ? ` (${detail})` : ""} to suggest the best issue-resolution or upsell angle for this seller.`,
        tone: "category" as const,
      };
    })
    .filter((item) => item.label);

  const suggestions = [...painSuggestions, ...categorySuggestions];

  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {suggestions.map((item) => (
        <button
          key={`${item.category}-${item.label}`}
          type="button"
          onClick={() => setQuestion(item.prompt)}
          title={item.action || item.category}
          className={`shrink-0 max-w-[190px] truncate rounded-full border px-2.5 py-1 text-left text-[10px] font-bold leading-4 transition ${
            item.tone === "category"
              ? "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100"
              : "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-300 hover:bg-amber-100 hover:text-amber-900"
          }`}
        >
          {item.label}
        </button>
      ))}
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
  const displayBody = normalizeEvidenceSection(body);
  const hasEvidence = (turn.sources?.length ?? 0) > 0;

  return (
    <div className="chat-bubble-bot">
      <div className="text-[15px] leading-relaxed">
        <MarkdownLite text={displayBody} />
      </div>

      {hasEvidence && <EvidenceBlock sources={turn.sources!} />}

      {!hasEvidence && sourcesMarkdown && <CompactSources markdown={sourcesMarkdown} />}
    </div>
  );
}

function normalizeEvidenceSection(markdown: string): string {
  const lines = markdown.split("\n");
  const evidenceHeading = /^(\s*#{1,6}\s+)(Evidence|Sources)(\s*)$/i;
  const headingIndex = lines.findIndex((line) => evidenceHeading.test(line));
  if (headingIndex === -1) return markdown;

  let nextHeadingIndex = lines.length;
  for (let i = headingIndex + 1; i < lines.length; i++) {
    if (/^\s*#{1,6}\s+\S/.test(lines[i])) {
      nextHeadingIndex = i;
      break;
    }
  }

  const evidenceLines = lines.slice(headingIndex, nextHeadingIndex);
  evidenceLines[0] = evidenceLines[0].replace(
    evidenceHeading,
    "$1Evidence$3"
  );

  const remaining = [
    ...lines.slice(0, headingIndex),
    ...lines.slice(nextHeadingIndex),
  ]
    .join("\n")
    .trimEnd();
  const evidenceText = evidenceLines.join("\n").trim();

  return remaining ? `${remaining}\n\n${evidenceText}` : evidenceText;
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

/**
 * Compact, one-line-per-item Sources list rendered under the body.
 * Shows ONLY IndiaMART doc references (bullets that look like "[N] …"),
 * capped at the first two — seller-data bullets are filtered out because
 * they're already represented in the Sources section above.
 */
function CompactSources({ markdown }: { markdown: string }) {
  const allItems: string[] = [];
  for (const raw of markdown.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const m = /^[-*+]\s+(.+)$/.exec(line);
    if (m) allItems.push(m[1].trim());
  }
  // Keep only items that look like a doc reference: "[1] Title …", "[2] Title …", etc.
  const docItems = allItems.filter((item) => /^\[\d+\]/.test(stripInlineMarkdown(item)));
  const top = docItems.slice(0, 2);
  if (top.length === 0) return null;
  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/70">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <FileText size={11} />
        Sources
      </div>
      <ul className="space-y-0.5">
        {top.map((item, i) => (
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

/** Sources section: small, expandable cards drawn from API source chunks. */
function EvidenceBlock({ sources }: { sources: SourceChunk[] }) {
  const [expanded, setExpanded] = useState(false);
  const top = expanded ? sources : sources.slice(0, 3);
  const remaining = sources.length - top.length;

  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/70">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <Database size={11} />
        Sources
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
  if (source.kind === "seller") {
    const sellerRecords = parseSellerRecords(source.text);
    if (sellerRecords.length > 0) {
      return <SellerSourceSummary source={source} records={sellerRecords} />;
    }
  }

  // Seller chunks usually contain Python-dict-style strings. Try parsing first.
  const parsed = tryParseStructured(source.text);
  if (parsed && parsed.length > 0) {
    const important = importantKeysFor(source);
    return (
      <div className="space-y-2">
        {parsed.map((item, idx) => (
          <StructuredItem key={idx} item={item} important={important} />
        ))}
      </div>
    );
  }

  // Document chunks: render as markdown (tables, headings, lists).
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

type SellerSourceSection =
  | "pain_points"
  | "categories"
  | "history"
  | "identity"
  | "account_status"
  | "performance"
  | "generic";

function SellerSourceSummary({
  source,
  records,
}: {
  source: SourceChunk;
  records: Array<Record<string, any>>;
}) {
  const section = sellerSourceSection(source);

  if (section === "pain_points") {
    return <SellerPainPointSources records={records} />;
  }

  if (section === "categories") {
    return <SellerCategorySources records={records} />;
  }

  if (section === "history") {
    return <SellerHistorySources records={records} />;
  }

  const fields = compactFieldsForSection(section);
  const first = records[0] ?? {};
  const entries = fields
    .map((key) => [key, first[key]] as const)
    .filter(([, value]) => hasDisplayValue(value));

  if (entries.length === 0) {
    return (
      <p className="whitespace-pre-wrap text-[11px] leading-snug text-slate-600 line-clamp-6">
        {shortenText(source.text, 420)}
      </p>
    );
  }

  return (
    <div className="rounded-md border border-slate-200/70 bg-white px-2.5 py-2">
      <div className="grid grid-cols-[96px,1fr] gap-x-2 gap-y-1">
        {entries.map(([key, value]) => (
          <div key={key} className="contents">
            <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-snug">
              {humanizeKey(key)}
            </div>
            <div className="min-w-0 break-words text-[11px] leading-snug text-slate-700">
              {shortenText(compactDisplayValue(value), 150)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SellerPainPointSources({
  records,
}: {
  records: Array<Record<string, any>>;
}) {
  const top = records.slice(0, 4);
  return (
    <div className="space-y-1.5">
      {top.map((item, idx) => {
        const category = stringValue(item.category) || `Pain point ${idx + 1}`;
        const action = stringValue(item.suggested_action);
        const source = firstString(item.evidence);
        return (
          <div
            key={`${category}-${idx}`}
            className="rounded-md border border-amber-100 bg-white px-2.5 py-2"
          >
            <div className="text-[11px] font-bold leading-snug text-slate-800">
              {category}
            </div>
            {action && (
              <div className="mt-1 text-[11px] leading-snug text-slate-600">
                <span className="font-bold text-slate-500">Action:</span>{" "}
                {shortenText(action, 130)}
              </div>
            )}
            {source && (
              <div className="mt-0.5 text-[10px] leading-snug text-slate-500">
                <span className="font-bold">Source:</span>{" "}
                {shortenText(source, 130)}
              </div>
            )}
          </div>
        );
      })}
      {records.length > top.length && (
        <div className="text-[10px] font-semibold text-slate-400">
          +{records.length - top.length} more in seller data
        </div>
      )}
    </div>
  );
}

function SellerHistorySources({
  records,
}: {
  records: Array<Record<string, any>>;
}) {
  const top = records.slice(0, 3);
  return (
    <div className="space-y-1.5">
      {top.map((item, idx) => {
        const title = [stringValue(item.date), stringValue(item.activity_type)]
          .filter(Boolean)
          .join(" - ");
        const summary = stringValue(item.summary);
        return (
          <div
            key={`${title || "history"}-${idx}`}
            className="rounded-md border border-slate-200/70 bg-white px-2.5 py-2"
          >
            <div className="text-[11px] font-bold leading-snug text-slate-800">
              {title || `History ${idx + 1}`}
            </div>
            {summary && (
              <div className="mt-1 text-[11px] leading-snug text-slate-600">
                {shortenText(summary, 160)}
              </div>
            )}
            {typeof item.follow_up_required === "boolean" && (
              <div className="mt-0.5 text-[10px] font-semibold text-slate-500">
                Follow-up: {item.follow_up_required ? "Yes" : "No"}
              </div>
            )}
          </div>
        );
      })}
      {records.length > top.length && (
        <div className="text-[10px] font-semibold text-slate-400">
          +{records.length - top.length} more in seller data
        </div>
      )}
    </div>
  );
}

function SellerCategorySources({
  records,
}: {
  records: Array<Record<string, any>>;
}) {
  const top = records.slice(0, 5);
  return (
    <div className="space-y-1.5">
      {top.map((item, idx) => {
        const mcat = stringValue(item.mcat_name) || `Category ${idx + 1}`;
        const products = compactDisplayValue([
          ...(Array.isArray(item.primary_products) ? item.primary_products : []),
          ...(Array.isArray(item.secondary_products) ? item.secondary_products : []),
        ]);
        const demand = [
          item.pur_bl_t_last_6m !== undefined && `Total BL: ${item.pur_bl_t_last_6m}`,
          item.pur_bl_p_last_6m !== undefined && `Purchased BL: ${item.pur_bl_p_last_6m}`,
        ]
          .filter(Boolean)
          .join(" | ");
        return (
          <div
            key={`${mcat}-${idx}`}
            className="rounded-md border border-blue-100 bg-white px-2.5 py-2"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold leading-snug text-slate-800">
                {mcat}
              </span>
              {item.rank && (
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-600">
                  Rank {String(item.rank)}
                </span>
              )}
              {item.service && (
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-500">
                  {String(item.service)}
                </span>
              )}
            </div>
            {products && (
              <div className="mt-1 text-[11px] leading-snug text-slate-600">
                <span className="font-bold text-slate-500">Products:</span>{" "}
                {shortenText(products, 140)}
              </div>
            )}
            {demand && (
              <div className="mt-0.5 text-[10px] leading-snug text-slate-500">
                {demand}
              </div>
            )}
          </div>
        );
      })}
      {records.length > top.length && (
        <div className="text-[10px] font-semibold text-slate-400">
          +{records.length - top.length} more in seller data
        </div>
      )}
    </div>
  );
}

function sellerSourceSection(source: SourceChunk): SellerSourceSection {
  const haystack = `${source.source} ${source.title}`.toLowerCase();
  if (haystack.includes("pain_point") || haystack.includes("pain point")) {
    return "pain_points";
  }
  if (
    haystack.includes("categories_products") ||
    haystack.includes("categories products")
  ) {
    return "categories";
  }
  if (haystack.includes("history") || haystack.includes("sales_service")) {
    return "history";
  }
  if (haystack.includes("account_status") || haystack.includes("account status")) {
    return "account_status";
  }
  if (haystack.includes("identity")) {
    return "identity";
  }
  if (haystack.includes("performance")) {
    return "performance";
  }
  return "generic";
}

function compactFieldsForSection(section: SellerSourceSection): string[] {
  if (section === "identity") {
    return [
      "company_name",
      "contact_person",
      "city",
      "state",
      "customer_type",
      "business_type",
      "package_indicators",
      "turnover_range",
    ];
  }
  if (section === "account_status") {
    return ["status", "created_date", "updated_date", "website"];
  }
  if (section === "performance") {
    return ["category_score", "product_count", "seven_day", "thirty_day", "ninety_day"];
  }
  if (section === "categories") {
    return [
      "mcat_name",
      "primary_products",
      "secondary_products",
      "rank",
      "no_of_products",
      "pur_bl_t_last_6m",
      "pur_bl_p_last_6m",
      "service",
    ];
  }
  return [
    "category",
    "suggested_action",
    "date",
    "activity_type",
    "summary",
    "recommended_call_objective",
  ];
}

function parseSellerRecords(text: string): Array<Record<string, any>> {
  const parsed = tryParseStructured(text);
  if (parsed) return parsed;

  const records: Array<Record<string, any>> = [];
  for (const objectLiteral of extractCompleteObjectLiterals(text)) {
    const item = tryParseStructured(objectLiteral);
    if (item) records.push(...item);
  }
  return records;
}

function extractCompleteObjectLiterals(text: string): string[] {
  const out: string[] = [];
  let quote: "'" | '"' | null = null;
  let depth = 0;
  let start = -1;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (quote) {
      if (ch === "\\" && i + 1 < text.length) {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }

    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
      continue;
    }

    if (ch === "}" && depth > 0) {
      depth--;
      if (depth === 0 && start >= 0) {
        out.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return out;
}

function hasDisplayValue(value: any): boolean {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

function stringValue(value: any): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function firstString(value: any): string {
  if (Array.isArray(value)) {
    for (const item of value) {
      const str = stringValue(item) || compactDisplayValue(item);
      if (str) return str;
    }
    return "";
  }
  return stringValue(value) || compactDisplayValue(value);
}

function compactDisplayValue(value: any): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (Array.isArray(value)) {
    return value
      .map((item) => compactDisplayValue(item))
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
  }
  if (typeof value === "object") {
    return Object.entries(value)
      .filter(([, itemValue]) => hasDisplayValue(itemValue))
      .slice(0, 4)
      .map(([key, itemValue]) => `${humanizeKey(key)}: ${compactDisplayValue(itemValue)}`)
      .join("; ");
  }
  return String(value);
}

function shortenText(text: string, max = 120): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, Math.max(0, max - 3)).trimEnd()}...`;
}

/**
 * For a seller-data chunk, return the small whitelist of fields a salesperson
 * actually cares about. Returns `null` to mean "show everything".
 * Detection is based on the source path / title since chunk schemas vary.
 */
function importantKeysFor(source: SourceChunk): Set<string> | null {
  if (source.kind !== "seller") return null;
  const haystack = `${source.source} ${source.title}`.toLowerCase();
  if (haystack.includes("pain_point") || haystack.includes("pain point")) {
    return new Set(["category", "suggested_action"]);
  }
  if (haystack.includes("history") || haystack.includes("sales_service")) {
    return new Set(["date", "activity_type", "employee", "summary", "follow_up_required"]);
  }
  if (haystack.includes("account_status") || haystack.includes("account status")) {
    return new Set(["status", "created_date", "updated_date", "website"]);
  }
  if (haystack.includes("identity")) {
    return new Set([
      "company_name",
      "contact_person",
      "ceo_name",
      "city",
      "state",
      "customer_type",
      "business_type",
      "package_indicators",
      "turnover_range",
    ]);
  }
  if (haystack.includes("performance")) {
    return new Set([
      "category_score",
      "product_count",
      "seven_day",
      "thirty_day",
      "ninety_day",
    ]);
  }
  if (haystack.includes("model_usage") || haystack.includes("model usage")) {
    return new Set(["recommended_call_objective", "suggested_objectives", "tone"]);
  }
  return null;
}

/* ─── Structured rendering for Python-dict-style chunks ─── */
function StructuredItem({
  item,
  important,
}: {
  item: Record<string, any>;
  important?: Set<string> | null;
}) {
  const entries = Object.entries(item).filter(([k, v]) => {
    if (v === null || v === undefined || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    if (important && !important.has(k)) return false;
    return true;
  });
  if (entries.length === 0) return null;
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
