import { ArrowLeft, Bot, MapPin, AlertTriangle, Activity, IdCard } from "lucide-react";
import { useState } from "react";
import type { GenerationResponse, SellerRecord, SourceChunk } from "../types";
import { ChatPanel } from "./ChatPanel";
import { val } from "./shared";

type PerfPeriod = "seven_day" | "thirty_day" | "ninety_day";
const PERF_OPTIONS: Array<{ id: PerfPeriod; label: string }> = [
  { id: "seven_day", label: "7D" },
  { id: "thirty_day", label: "30D" },
  { id: "ninety_day", label: "90D" },
];

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  mode?: GenerationResponse["mode"];
  model?: string;
  sources?: SourceChunk[];
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
      <header className="flex items-center gap-3 border-b border-line bg-white px-5 py-3 shadow-sm shrink-0">
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

      {/* Main body: chat (wide) + seller info sidebar.
          We use flex (not grid) so the children inherit a real height from
          the parent — with grid + auto rows the chat panel would grow past
          the viewport and the input/buttons would be clipped at the bottom. */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 sm:p-6">
        <div className="mx-auto h-full max-w-[1400px] flex gap-4 lg:gap-6">
          {/* Chat — fills remaining width, flex column so the messages area
              can shrink and the bottom action+input stay pinned. */}
          <div className="flex flex-1 min-w-0 min-h-0 flex-col">
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

          {/* Seller info sidebar — fixed width column, hidden on small. */}
          <aside className="hidden lg:flex w-[320px] shrink-0 min-h-0 flex-col">
            <SellerInfoSidebar seller={seller} />
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─── Seller Info Sidebar ─── */
function SellerInfoSidebar({ seller }: { seller: SellerRecord | null }) {
  const [period, setPeriod] = useState<PerfPeriod>("seven_day");

  if (!seller) {
    return (
      <div className="h-full rounded-xl border border-line bg-white p-5 text-center text-xs text-muted shadow-panel">
        Select a seller to see their details here.
      </div>
    );
  }

  const identity = seller.seller_identity ?? {};
  const perf = seller.performance_snapshot ?? {};
  const periodData: Record<string, any> = (perf[period] as Record<string, any>) ?? {};
  const painPoints = seller.pain_points ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-y-auto rounded-xl border border-line bg-white p-4 shadow-panel scrollbar-thin">
      {/* Header card */}
      <div className="rounded-lg bg-gradient-to-br from-blue-50 to-violet-50 p-3.5 border border-blue-100/60">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600">
          <IdCard size={11} />
          GLID
        </div>
        <div className="mt-0.5 text-sm font-extrabold text-ink tracking-tight">
          {seller.glid}
        </div>
        <div className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Seller
        </div>
        <div className="mt-0.5 break-words text-[14px] font-extrabold text-ink leading-tight">
          {val(identity.company_name)}
        </div>
        <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <MapPin size={10} />
          <span className="truncate">
            {val(identity.city)}{identity.state ? `, ${identity.state}` : ""}
          </span>
        </div>
        {identity.business_type && (
          <div className="mt-2 inline-flex items-center rounded-md bg-white/70 px-2 py-0.5 text-[10px] font-bold text-slate-600">
            {val(identity.business_type)}
          </div>
        )}
      </div>

      {/* Performance with period filter */}
      <Section
        icon={<Activity size={11} />}
        title="Performance"
        action={
          <div className="inline-flex rounded-md bg-slate-100 p-0.5">
            {PERF_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPeriod(opt.id)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-bold transition ${
                  period === opt.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-1.5">
          <Stat label="Calls" value={periodData.calls} />
          <Stat label="Replies" value={periodData.replies} />
          <Stat label="Lead Mgr" value={periodData.lead_manager} />
          <Stat label="Conn./Att" value={periodData.connection_attempt} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <Stat label="Category" value={perf.category_score} />
          <Stat label="Products" value={perf.product_count} />
        </div>
      </Section>

      {/* Pain Points */}
      <Section
        icon={<AlertTriangle size={11} className="text-amber-500" />}
        title="Pain Points"
      >
        {painPoints.length === 0 ? (
          <div className="text-[11px] text-slate-400">No pain points logged.</div>
        ) : (
          <ul className="space-y-1.5">
            {painPoints.slice(0, 5).map((p, idx) => (
              <li
                key={`${p.category}-${idx}`}
                className="rounded-md border border-amber-100 bg-amber-50/50 px-2 py-1.5"
              >
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-500 text-[9px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-amber-800 leading-tight">
                      {val(p.category)}
                    </div>
                    {p.suggested_action && (
                      <div className="mt-0.5 text-[10px] leading-snug text-slate-600 line-clamp-2">
                        {p.suggested_action}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({
  icon,
  title,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          {icon}
          {title}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-md bg-slate-50 px-2 py-1.5 min-w-0 overflow-hidden">
      <div className="text-[9px] font-semibold uppercase tracking-wider text-slate-400 leading-tight">
        {label}
      </div>
      <div className="mt-0.5 break-words text-[12px] font-extrabold text-ink leading-tight">
        {val(value)}
      </div>
    </div>
  );
}
