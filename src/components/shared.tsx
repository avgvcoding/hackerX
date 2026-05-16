import type { ReactNode } from "react";

/* ─── Panel ─── */
export function Panel({
  title,
  icon,
  action,
  children,
  className = "",
  noPad = false,
}: {
  title: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  noPad?: boolean;
}) {
  return (
    <section className={`rounded-xl border border-line bg-white shadow-panel ${className}`}>
      <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5 text-sm font-bold text-ink">
          <span className="text-martBlue">{icon}</span>
          {title}
        </div>
        {action}
      </div>
      <div className={noPad ? "" : "p-5"}>{children}</div>
    </section>
  );
}

/* ─── MetricLine ─── */
export function MetricLine({
  label,
  value: itemValue,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="detail-row">
      <span className="shrink-0 text-xs font-medium text-muted">{label}</span>
      <span className="min-w-0 break-words text-right text-xs font-bold text-ink">
        {val(itemValue)}
      </span>
    </div>
  );
}

/* ─── MetricBox ─── */
export function MetricBox({
  label,
  value: itemValue,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface p-3 overflow-hidden">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted leading-tight break-words">
        {label}
      </div>
      <div className="mt-1.5 break-words text-base font-extrabold text-ink leading-tight">
        {val(itemValue)}
      </div>
    </div>
  );
}

/* ─── DetailGrid ─── */
export function DetailGrid({
  items,
}: {
  items: Array<[string, ReactNode]>;
}) {
  return (
    <div>
      {items.map(([label, itemValue]) => (
        <MetricLine key={label} label={label} value={itemValue} />
      ))}
    </div>
  );
}

/* ─── Badge ─── */
export function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "blue" | "orange" | "green" | "red";
}) {
  const variantClasses: Record<string, string> = {
    default: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}

/* ─── StatusBadge ─── */
export function StatusBadge({
  tone,
  label,
}: {
  tone: "success" | "warning";
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-ink">
      <span
        className={`status-dot ${tone === "success" ? "online" : "warning"}`}
      />
      {label}
    </div>
  );
}

/* ─── LoadingSpinner ─── */
export function Spinner() {
  return (
    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  );
}

/* ─── TypingIndicator ─── */
export function TypingIndicator() {
  return (
    <div className="chat-bubble-bot">
      <div className="typing-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

/* ─── Inline markdown (bold, italic, code, links) ─── */
function renderInline(text: string, keyPrefix = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  // Order matters: bold (**...**) > italic (*...*) > code (`...`) > link [t](u)
  const pattern =
    /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      out.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      out.push(<strong key={`${keyPrefix}-b-${i++}`}>{match[2]}</strong>);
    } else if (match[3]) {
      out.push(<em key={`${keyPrefix}-i-${i++}`}>{match[4]}</em>);
    } else if (match[5]) {
      out.push(
        <code
          key={`${keyPrefix}-c-${i++}`}
          className="rounded bg-slate-100 px-1 py-0.5 text-[0.85em] font-mono text-slate-700"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      out.push(
        <a
          key={`${keyPrefix}-a-${i++}`}
          href={match[9]}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          {match[8]}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) out.push(text.slice(lastIndex));
  return out;
}

/* ─── MarkdownLite ─── */
export function MarkdownLite({
  text,
  compact = false,
  plain = false,
}: {
  text: string;
  compact?: boolean;
  plain?: boolean;
}) {
  if (plain) {
    return <div className="whitespace-pre-wrap text-sm leading-relaxed">{text}</div>;
  }

  const lines = text.split("\n");
  const blocks: ReactNode[] = [];

  type ListItem = { ordered: boolean; depth: number; content: string };
  let listBuf: ListItem[] = [];

  function flushList(keyHint: string) {
    if (listBuf.length === 0) return;
    const ordered = listBuf[0].ordered;
    const items = listBuf;
    listBuf = [];
    const Tag = ordered ? "ol" : "ul";
    blocks.push(
      <Tag
        key={`list-${keyHint}`}
        className={`${ordered ? "list-decimal" : "list-disc"} pl-6 my-1.5 space-y-1`}
      >
        {items.map((item, idx) => (
          <li key={idx} className="leading-relaxed">
            {renderInline(item.content, `${keyHint}-${idx}`)}
          </li>
        ))}
      </Tag>
    );
  }

  let inCode = false;
  let codeBuf: string[] = [];

  lines.forEach((rawLine, index) => {
    const line = rawLine;

    // Fenced code blocks
    if (/^```/.test(line.trim())) {
      if (inCode) {
        blocks.push(
          <pre
            key={`code-${index}`}
            className="my-2 overflow-x-auto rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-mono leading-relaxed text-slate-100"
          >
            <code>{codeBuf.join("\n")}</code>
          </pre>
        );
        codeBuf = [];
        inCode = false;
      } else {
        flushList(`${index}`);
        inCode = true;
      }
      return;
    }
    if (inCode) {
      codeBuf.push(line);
      return;
    }

    // Headings
    const h3 = /^###\s+(.+)$/.exec(line);
    const h2 = /^##\s+(.+)$/.exec(line);
    const h1 = /^#\s+(.+)$/.exec(line);
    if (h1 || h2 || h3) {
      flushList(`${index}`);
      if (h1) {
        blocks.push(
          <h2 key={index} className="text-base font-bold mt-2 mb-1">
            {renderInline(h1[1], `h1-${index}`)}
          </h2>
        );
      } else if (h2) {
        blocks.push(<h2 key={index}>{renderInline(h2[1], `h2-${index}`)}</h2>);
      } else if (h3) {
        blocks.push(
          <h3
            key={index}
            className="text-[13px] font-bold mt-2 mb-0.5 text-slate-700"
          >
            {renderInline(h3[1], `h3-${index}`)}
          </h3>
        );
      }
      return;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      flushList(`${index}`);
      blocks.push(<hr key={index} className="my-2 border-slate-200" />);
      return;
    }

    // Bullet list
    const bullet = /^(\s*)[-*+]\s+(.+)$/.exec(line);
    if (bullet) {
      const depth = Math.floor(bullet[1].length / 2);
      listBuf.push({ ordered: false, depth, content: bullet[2] });
      return;
    }

    // Numbered list
    const numbered = /^(\s*)\d+\.\s+(.+)$/.exec(line);
    if (numbered) {
      const depth = Math.floor(numbered[1].length / 2);
      listBuf.push({ ordered: true, depth, content: numbered[2] });
      return;
    }

    flushList(`${index}`);

    // Blank line
    if (line.trim() === "") {
      blocks.push(<div key={index} className="h-2" />);
      return;
    }

    // Paragraph
    blocks.push(
      <p key={index} className="leading-relaxed">
        {renderInline(line, `p-${index}`)}
      </p>
    );
  });
  flushList("end");
  if (inCode && codeBuf.length) {
    blocks.push(
      <pre
        key="code-end"
        className="my-2 overflow-x-auto rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-mono leading-relaxed text-slate-100"
      >
        <code>{codeBuf.join("\n")}</code>
      </pre>
    );
  }

  return (
    <div
      className={`markdown-lite text-sm leading-relaxed ${
        compact ? "max-h-[520px] overflow-auto pr-1 scrollbar-thin" : ""
      }`}
    >
      {blocks}
    </div>
  );
}

/* ─── EmptyState ─── */
export function EmptyState({ loading }: { loading: boolean }) {
  return (
    <section className="grid min-h-[560px] place-items-center rounded-xl border border-line bg-white p-8 text-center shadow-panel">
      <div className="max-w-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
          <svg
            className="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        {loading && (
          <span className="mx-auto mb-4 block h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
        )}
        <h2 className="text-xl font-extrabold text-ink">
          Select a seller to begin
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Search by GLID, company name, or city. The AI will load seller intelligence,
          performance history, and pain points to prepare you for the call.
        </p>
      </div>
    </section>
  );
}

/* ─── val helper ─── */
export function val(
  itemValue: ReactNode,
  fallback: ReactNode = "—"
): ReactNode {
  if (
    itemValue === null ||
    itemValue === undefined ||
    itemValue === ""
  )
    return fallback;
  return itemValue;
}
