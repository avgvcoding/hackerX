import { ArrowLeft, Bot } from "lucide-react";
import type { GenerationResponse, SellerRecord } from "../types";
import { ChatPanel } from "./ChatPanel";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  mode?: GenerationResponse["mode"];
  model?: string;
};

export function ChatPage({
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
  onBack,
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
  onBack: () => void;
}) {
  return (
    <div className="flex h-full flex-1 flex-col min-w-0 bg-page">
      {/* Page header */}
      <header className="flex items-center gap-3 border-b border-line bg-white px-5 py-3 shadow-sm">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-blue-400 hover:text-blue-600"
        >
          <ArrowLeft size={14} />
          Back to seller
        </button>
        <div className="flex items-center gap-2 ml-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-ink leading-none">
              AI Chat
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-muted">
              {seller
                ? `${seller.seller_identity?.company_name ?? "Seller"} · GLID ${seller.glid}`
                : "No seller selected"}
            </div>
          </div>
        </div>
      </header>

      {/* Chat area — centered with max width for readability */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
        <div className="mx-auto h-full max-w-3xl">
          <ChatPanel
            seller={seller}
            chatTurns={chatTurns}
            question={question}
            setQuestion={setQuestion}
            runChat={runChat}
            runBrief={runBrief}
            runPitch={runPitch}
            loading={loading}
            salesContext={salesContext}
            setSalesContext={setSalesContext}
            standalone
          />
        </div>
      </div>
    </div>
  );
}
