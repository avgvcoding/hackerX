import { Clock3, PhoneCall } from "lucide-react";
import { Panel, val } from "./shared";

export function HistoryTimeline({
  history,
  filter,
  filters,
  setFilter,
}: {
  history: Array<Record<string, any>>;
  filter: string;
  filters: string[];
  setFilter: (v: string) => void;
}) {
  return (
    <Panel
      title="Sales & Service History"
      icon={<Clock3 size={16} />}
      action={
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="control-select h-8"
        >
          {filters.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      }
      className="animate-fade-in-up"
    >
      <div className="space-y-0">
        {history.length === 0 && (
          <div className="py-12 text-center text-sm text-muted">
            No history records found.
          </div>
        )}
        {history.map((item, index) => (
          <HistoryItem key={`${item.date}-${index}`} item={item} isLast={index === history.length - 1} />
        ))}
      </div>
    </Panel>
  );
}

function HistoryItem({
  item,
  isLast,
}: {
  item: Record<string, any>;
  isLast: boolean;
}) {
  const hasFollowUp = !!item.follow_up_required;
  const activityType = String(item.activity_type ?? "");
  const isUpsell = activityType.toLowerCase().includes("upsell");
  const isServicing = activityType.toLowerCase().includes("servicing");

  // Pick dot color based on type
  const dotColor = isUpsell
    ? "border-violet-500"
    : isServicing
      ? "border-emerald-500"
      : hasFollowUp
        ? "border-amber-500"
        : "border-blue-500";

  return (
    <article className={`timeline-item ${isLast ? "pb-0" : ""}`}>
      <div className={`timeline-dot ${dotColor} ${hasFollowUp ? "follow-up" : ""}`} />

      <div className="rounded-xl border border-line bg-white p-4 transition hover:shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <PhoneCall size={13} className="text-blue-500" />
              </span>
              <div>
                <div className="text-sm font-bold text-ink">{val(item.activity_type)}</div>
                <div className="text-[11px] font-medium text-muted">
                  {val(item.date)} · {val(item.employee)}
                </div>
              </div>
            </div>
          </div>
          {hasFollowUp && (
            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600 animate-pulse">
              Follow-up needed
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {val(item.summary)}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="tag">{val(item.contact_channel)}</span>
          {Object.entries(item.metrics ?? {}).map(([key, metricValue]) => (
            <span key={key} className="tag">
              {key}: {String(metricValue)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
