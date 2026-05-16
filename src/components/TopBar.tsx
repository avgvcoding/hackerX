import { Languages, BriefcaseBusiness, Search } from "lucide-react";
import type { ReactNode } from "react";
import { StatusBadge } from "./shared";
import type { HealthResponse, Language } from "../types";

const LANGUAGES: Language[] = ["English", "Hinglish", "Hindi"];

const OBJECTIVES = [
  "Issue resolution",
  "Buy Lead optimization",
  "Catalog improvement",
  "Renewal value review",
  "Soft upsell",
  "Email verification",
  "Category preference tuning",
];

export function TopBar({
  query,
  setQuery,
  language,
  setLanguage,
  objective,
  setObjective,
  health,
}: {
  query: string;
  setQuery: (v: string) => void;
  language: Language;
  setLanguage: (v: Language) => void;
  objective: string;
  setObjective: (v: string) => void;
  health: HealthResponse | null;
}) {
  return (
    <header className="top-bar">
      {/* Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-sm">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <div className="hidden md:block">
          <div className="text-sm font-extrabold text-ink leading-none">AI Sales Call Prep</div>
          <div className="mt-0.5 text-[11px] font-medium text-muted">IndiaMART Seller Assistant</div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block h-8 w-px bg-slate-200" />

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input w-full"
          placeholder="Search GLID, company, contact, city..."
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Language */}
        <ControlPill icon={<Languages size={14} />} label="Language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="control-select"
          >
            {LANGUAGES.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </ControlPill>

        {/* Objective */}
        <ControlPill icon={<BriefcaseBusiness size={14} />} label="Objective">
          <select
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="control-select min-w-[160px]"
          >
            {OBJECTIVES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </ControlPill>

        {/* Status */}
        <StatusBadge
          tone={health?.llm_configured ? "success" : "warning"}
          label={health?.llm_configured ? "LLM Active" : "Local Mode"}
        />
      </div>
    </header>
  );
}

function ControlPill({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="hidden lg:flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-muted cursor-pointer">
      {icon}
      <span className="hidden xl:inline text-slate-500">{label}</span>
      {children}
    </label>
  );
}
