import { Search } from "lucide-react";
import type { SellerRecord, SellerSummary } from "../types";

export function Sidebar({
  results,
  selected,
  onSelect,
  loading,
}: {
  results: SellerSummary[];
  selected: SellerRecord | null;
  onSelect: (glid: string) => void;
  loading: boolean;
}) {
  return (
    <aside className="sidebar shrink-0 hidden xl:flex">
      <div className="sidebar-header">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
            <Search size={14} className="text-blue-400" />
          </div>
          <span className="text-sm font-bold text-white/90">Seller Queue</span>
        </div>
        <p className="mt-3 rounded-lg bg-blue-500/10 border border-blue-500/15 px-3 py-2 text-[11px] font-medium leading-4 text-blue-300/80">
          Use GLID 42473394 for the authentic WebERP seller. Others are synthetic.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-3 py-3 space-y-1.5 scrollbar-dark">
        {results.map((item) => {
          const isActive = selected?.glid === item.glid;
          return (
            <button
              key={item.glid}
              onClick={() => onSelect(item.glid)}
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-bold">{item.company_name}</span>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                    item.record_type === "original"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-slate-500/15 text-slate-400"
                  }`}>
                    {item.record_type}
                  </span>
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-400">
                  GLID {item.glid}
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400/80">
                    {item.city}
                  </span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400/80">
                    {item.customer_type}
                  </span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400/80">
                    {item.product_count} products
                  </span>
                </div>
                {(item.top_categories?.length ?? 0) > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.top_categories!.slice(0, 2).map((category) => (
                      <span
                        key={category}
                        className="max-w-full truncate rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300/90"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
        {loading && (
          <div className="flex items-center gap-2 px-3 py-3 text-xs text-slate-400">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
            Loading seller…
          </div>
        )}
      </div>
    </aside>
  );
}
