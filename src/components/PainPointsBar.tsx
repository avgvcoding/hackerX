import type { SellerRecord } from "../types";
import { val } from "./shared";

export function PainPointsBar({ seller }: { seller: SellerRecord }) {
  const points = seller.pain_points ?? [];
  if (points.length === 0) return null;

  const priorityColors = [
    { bg: "bg-red-50", border: "border-red-200", num: "bg-red-500 text-white", text: "text-red-700" },
    { bg: "bg-amber-50", border: "border-amber-200", num: "bg-amber-500 text-white", text: "text-amber-700" },
    { bg: "bg-yellow-50", border: "border-yellow-200", num: "bg-yellow-500 text-white", text: "text-yellow-700" },
    { bg: "bg-slate-50", border: "border-slate-200", num: "bg-slate-400 text-white", text: "text-slate-600" },
  ];

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-2.5">
        <svg className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <span className="text-xs font-bold text-ink">Top Pain Points</span>
        <span className="text-[10px] font-semibold text-muted">— address these in your call</span>
      </div>
      <div className="pain-strip scrollbar-thin">
        {points.slice(0, 5).map((point, index) => {
          const colors = priorityColors[Math.min(index, 3)];
          return (
            <div key={`${point.category}-${index}`} className={`pain-chip ${colors.bg} ${colors.border}`}>
              <span className={`pain-number ${colors.num}`}>{index + 1}</span>
              <div className="min-w-0">
                <div className={`text-xs font-bold ${colors.text}`}>
                  {val(point.category)}
                </div>
                <div className="mt-0.5 text-[11px] leading-4 text-slate-500 line-clamp-2">
                  {val(point.suggested_action)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
