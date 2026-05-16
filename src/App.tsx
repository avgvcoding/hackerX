import {
  BarChart3,
  Bot,
  History as HistoryIcon,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { chat, generateBrief, generatePitch, getHealth, getSeller, searchSellers } from "./api";
import type { GenerationResponse, HealthResponse, Language, SellerRecord, SellerSummary } from "./types";

import { TopBar } from "./components/TopBar";
import { Sidebar } from "./components/Sidebar";
import { SellerHeader } from "./components/SellerHeader";
import { PainPointsBar } from "./components/PainPointsBar";
import { ChatPage } from "./components/ChatPage";
import { SellerDetails } from "./components/SellerDetails";
import { PerformanceView } from "./components/PerformanceView";
import { HistoryTimeline } from "./components/HistoryTimeline";
import { EmptyState } from "./components/shared";

type WorkspaceTab = "profile" | "performance" | "history";
type AppPage = "workspace" | "chat";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  mode?: GenerationResponse["mode"];
  model?: string;
};

export default function App() {
  /* ─── State ─── */
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [query, setQuery] = useState("42473394");
  const [results, setResults] = useState<SellerSummary[]>([]);
  const [selected, setSelected] = useState<SellerRecord | null>(null);
  const [language, setLanguage] = useState<Language>("Hinglish");
  const [objective, setObjective] = useState("Issue resolution");
  const [salesContext, setSalesContext] = useState(
    "I want to call the client regarding Buy Lead and export lead issues."
  );
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("profile");
  const [aiResult, setAiResult] = useState<GenerationResponse | null>(null);
  const [question, setQuestion] = useState("");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [historyFilter, setHistoryFilter] = useState("All");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<AppPage>(() =>
    typeof window !== "undefined" && window.location.hash === "#/chat"
      ? "chat"
      : "workspace"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHash = () => {
      setPage(window.location.hash === "#/chat" ? "chat" : "workspace");
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  function navigate(next: AppPage) {
    setPage(next);
    if (typeof window !== "undefined") {
      window.location.hash = next === "chat" ? "#/chat" : "";
    }
  }

  /* ─── Effects ─── */
  useEffect(() => {
    getHealth().then(setHealth).catch((err) => setError(err.message));
    searchSellers("42473394")
      .then((items) => {
        setResults(items);
        if (items[0]) return getSeller(items[0].glid);
        return null;
      })
      .then((seller) => seller && setSelected(seller))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      searchSellers(query).then(setResults).catch((err) => setError(err.message));
    }, 180);
    return () => window.clearTimeout(id);
  }, [query]);

  const historyTypes = useMemo(() => historyTypeOptions(selected), [selected]);
  const filteredHistory = useMemo(() => {
    const history = selected?.sales_service_history ?? [];
    if (historyFilter === "All") return history;
    return history.filter((item) =>
      String(item.activity_type ?? "").startsWith(historyFilter)
    );
  }, [historyFilter, selected]);

  /* ─── Actions ─── */
  async function pickSeller(glid: string) {
    setLoading("seller");
    setError(null);
    try {
      const seller = await getSeller(glid);
      setSelected(seller);
      setActiveTab("profile");
      setAiResult(null);
      setChatTurns([]);
      setQuery(glid);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load seller");
    } finally {
      setLoading(null);
    }
  }

  async function runBrief() {
    if (!selected) return;
    setLoading("brief");
    setError(null);
    try {
      const result = await generateBrief(selected.glid, language, objective);
      recordAssistantResult(result, "Pre-call brief");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate brief");
    } finally {
      setLoading(null);
    }
  }

  async function runPitch() {
    if (!selected) return;
    setLoading("pitch");
    setError(null);
    try {
      const result = await generatePitch(
        selected.glid,
        language,
        objective,
        salesContext
      );
      recordAssistantResult(result, "Sales pitch");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate pitch");
    } finally {
      setLoading(null);
    }
  }

  async function runChat(promptOverride?: string) {
    if (!selected) return;
    const prompt = (promptOverride ?? question).trim();
    if (!prompt) return;
    setLoading("chat");
    setError(null);
    const userTurn: ChatTurn = { role: "user", content: prompt };
    const apiMessages = [...chatTurns.slice(-6), userTurn].map((turn) => ({
      role: turn.role,
      content: turn.content,
    }));
    setChatTurns((current) => [...current, userTurn]);
    setQuestion("");
    try {
      const result = await chat(
        selected.glid,
        language,
        objective,
        apiMessages
      );
      recordAssistantResult(result, "Chat answer", false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to answer question");
    } finally {
      setLoading(null);
    }
  }

  function recordAssistantResult(
    result: GenerationResponse,
    label: string,
    includeLabel = true
  ) {
    setAiResult(result);
    setChatTurns((current) => [
      ...current,
      {
        role: "assistant",
        content: includeLabel ? `## ${label}\n${result.content}` : result.content,
        mode: result.mode,
        model: result.model,
      },
    ]);
  }

  /* ─── Tab Config ─── */
  const tabs: Array<{ id: WorkspaceTab; label: string; icon: ReactNode }> = [
    { id: "profile", label: "Seller Details", icon: <UserRound size={15} /> },
    { id: "performance", label: "Performance", icon: <BarChart3 size={15} /> },
    { id: "history", label: "History", icon: <HistoryIcon size={15} /> },
  ];

  /* ─── Render ─── */
  if (page === "chat") {
    return (
      <main className="flex h-screen bg-page overflow-hidden">
        <ChatPage
          seller={selected}
          chatTurns={chatTurns}
          question={question}
          setQuestion={setQuestion}
          runChat={runChat}
          runBrief={runBrief}
          runPitch={runPitch}
          loading={loading}
          salesContext={salesContext}
          setSalesContext={setSalesContext}
          onBack={() => navigate("workspace")}
        />
      </main>
    );
  }

  return (
    <main className="flex h-screen bg-page overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        results={results}
        selected={selected}
        onSelect={pickSeller}
        loading={loading === "seller"}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar
          query={query}
          setQuery={setQuery}
          language={language}
          setLanguage={setLanguage}
          objective={objective}
          setObjective={setObjective}
          health={health}
        />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Center: Seller Intelligence */}
          <div className="flex-1 min-w-0 overflow-y-auto p-5 space-y-4 scrollbar-thin">
            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 animate-fade-in">
                <svg className="h-5 w-5 shrink-0 mt-0.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="ml-auto shrink-0 text-red-400 hover:text-red-600"
                >
                  ✕
                </button>
              </div>
            )}

            {selected ? (
              <>
                {/* Seller Header Banner */}
                <SellerHeader seller={selected} />

                {/* Pain Points Strip */}
                <PainPointsBar seller={selected} />

                {/* Tab Navigation + Open Chat */}
                <div className="flex flex-wrap items-center gap-2">
                  <nav className="flex flex-1 items-center gap-1 rounded-xl border border-line bg-white p-1.5 shadow-sm">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-tab ${activeTab === tab.id ? "nav-tab-active" : ""}`}
                      >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                  <button
                    onClick={() => navigate("chat")}
                    className="primary-button shrink-0"
                    title="Open AI Sales Assistant"
                  >
                    <MessageSquare size={14} />
                    AI Chat
                  </button>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === "profile" && <SellerDetails seller={selected} />}
                  {activeTab === "performance" && (
                    <PerformanceView seller={selected} />
                  )}
                  {activeTab === "history" && (
                    <HistoryTimeline
                      history={filteredHistory}
                      filter={historyFilter}
                      filters={historyTypes}
                      setFilter={setHistoryFilter}
                    />
                  )}
                </div>
              </>
            ) : (
              <EmptyState loading={loading === "seller"} />
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => navigate("chat")}
          className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg text-white transition hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 4px 20px rgba(37, 99, 235, 0.4)",
          }}
          title="Open AI Chat"
        >
          <Bot size={24} />
        </button>
      </div>
    </main>
  );
}

/* ─── Helpers ─── */
function historyTypeOptions(seller: SellerRecord | null) {
  const types = new Set<string>(["All"]);
  for (const item of seller?.sales_service_history ?? []) {
    const type = String(item.activity_type ?? "").split(" - ")[0];
    if (type) types.add(type);
  }
  return [...types];
}
