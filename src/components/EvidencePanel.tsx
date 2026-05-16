import { Database, FileSearch, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import type { HealthResponse, SourceChunk } from "../types";
import { Panel, MetricBox, Spinner } from "./shared";

export function EvidencePanel({
  health,
  sources,
  query,
  setQuery,
  runLookup,
  loading,
}: {
  health: HealthResponse | null;
  sources: SourceChunk[];
  query: string;
  setQuery: (v: string) => void;
  runLookup: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-4 animate-fade-in-up">
      <Panel title="Knowledge Base" icon={<Database size={16} />}>
        <div className="grid gap-3 md:grid-cols-3 mb-4">
          <MetricBox label="Document chunks" value={health?.docs ?? "—"} />
          <MetricBox label="Seller chunks" value={health?.seller_chunks ?? "—"} />
          <MetricBox label="Total chunks" value={health?.total_chunks ?? "—"} />
        </div>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") runLookup();
            }}
            className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-white px-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            placeholder="Search IndiaMART docs and seller data..."
          />
          <button onClick={runLookup} disabled={loading} className="primary-button">
            {loading ? <Spinner /> : <FileSearch size={14} />}
            Search
          </button>
        </div>
      </Panel>

      <Panel title="Retrieved Sources" icon={<FileSearch size={16} />}>
        {sources.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted">
            No sources retrieved yet. Run a search above.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {sources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

export function SourceCard({
  source,
  compact = false,
}: {
  source: SourceChunk;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const parsed = useMemo(() => tryParseStructured(source.text), [source.text]);
  const isLong = source.text.length > 280;

  return (
    <article className="source-card">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 truncate text-xs font-bold text-ink">
          {source.title}
        </div>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
            source.kind === "doc"
              ? "bg-blue-50 text-blue-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          {source.kind}
        </span>
      </div>
      <div className="mt-1.5 truncate text-[11px] font-medium text-blue-500">
        {source.source}
      </div>

      {parsed && parsed.length > 0 ? (
        <div className="mt-2.5 space-y-2">
          {(expanded ? parsed : parsed.slice(0, compact ? 1 : 2)).map((item, idx) => (
            <StructuredItem key={idx} item={item} />
          ))}
          {parsed.length > (compact ? 1 : 2) && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              {expanded ? (
                <>
                  <ChevronUp size={12} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={12} /> Show {parsed.length - (compact ? 1 : 2)} more
                </>
              )}
            </button>
          )}
        </div>
      ) : (
        <>
          <p
            className={`mt-2 text-xs leading-5 text-muted ${
              compact || (!expanded && isLong) ? "line-clamp-4" : ""
            }`}
          >
            {source.text}
          </p>
          {isLong && !compact && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              {expanded ? (
                <>
                  <ChevronUp size={12} /> Show less
                </>
              ) : (
                <>
                  <ChevronDown size={12} /> Show more
                </>
              )}
            </button>
          )}
        </>
      )}
    </article>
  );
}

/* ─── Structured rendering for Python-dict-style chunks ─── */
function StructuredItem({ item }: { item: Record<string, any> }) {
  const entries = Object.entries(item).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  return (
    <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-2.5">
      {entries.map(([key, value]) => (
        <div key={key} className="mb-1 last:mb-0">
          <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {humanizeKey(key)}
          </div>
          <div className="mt-0.5 text-[12px] leading-relaxed text-slate-700 break-words">
            {renderValue(value)}
          </div>
        </div>
      ))}
    </div>
  );
}

function renderValue(value: any): React.ReactNode {
  if (value === null || value === undefined) return "—";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    if (value.every((v) => typeof v !== "object" || v === null)) {
      return (
        <ul className="list-disc pl-4 space-y-0.5">
          {value.map((v, idx) => (
            <li key={idx}>{String(v)}</li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-1">
        {value.map((v, idx) => (
          <StructuredItem key={idx} item={v} />
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    return <StructuredItem item={value} />;
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Try to parse a Python-dict-style string (e.g. `[{'category': 'X', ...}]`)
 * into structured JSON. Returns an array of records, or null if parsing fails.
 */
function tryParseStructured(text: string): Array<Record<string, any>> | null {
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
  // Replace Python literals
  let out = input
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\bNone\b/g, "null");

  // Convert single-quoted strings to JSON double-quoted, character by character
  // while respecting already-double-quoted strings.
  let result = "";
  let i = 0;
  while (i < out.length) {
    const ch = out[i];
    if (ch === '"') {
      // copy through to matching double quote, respecting escapes
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
      // collect single-quoted segment
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
      // escape any embedded double quotes
      buf = buf.replace(/"/g, '\\"');
      result += `"${buf}"`;
      continue;
    }
    result += ch;
    i++;
  }
  return result;
}
