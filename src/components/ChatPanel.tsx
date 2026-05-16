import { Send, Sparkles, FileSearch, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SellerRecord, GenerationResponse } from "../types";
import { MarkdownLite, Spinner, TypingIndicator, val } from "./shared";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  mode?: GenerationResponse["mode"];
  model?: string;
  sources?: Array<{ title: string; kind: string }>;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
        <div ref={messagesEndRef} />
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
        <div className="whitespace-pre-wrap text-sm leading-relaxed">{turn.content}</div>
      </div>
    );
  }

  // For assistant messages, determine if sources were used
  const usedRAG = turn.mode === "gateway" || turn.mode === "local_fallback";

  return (
    <div className="chat-bubble-bot">
      <MarkdownLite text={turn.content} />
      {usedRAG && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="source-tag">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Sources referenced
          </span>
        </div>
      )}
    </div>
  );
}
