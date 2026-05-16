import { MapPin, Building2, Briefcase } from "lucide-react";
import type { SellerRecord } from "../types";
import { val } from "./shared";

export function SellerHeader({ seller }: { seller: SellerRecord }) {
  const identity = seller.seller_identity ?? {};
  const account = seller.account_status ?? {};
  const perf = seller.performance_snapshot ?? {};

  return (
    <section className="seller-banner animate-fade-in-up">
      <div className="relative z-10">
        {/* Top Row: Company Name + Badges */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="truncate text-2xl font-extrabold tracking-tight">
                {val(identity.company_name)}
              </h1>
              <span className="rounded-md bg-white/15 px-2.5 py-1 text-xs font-bold backdrop-blur-sm">
                GLID {seller.glid}
              </span>
              <span className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                seller.record_type === "original"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}>
                {seller.record_type}
              </span>
            </div>

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/60">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                {val(identity.city)}, {val(identity.state)}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 size={13} />
                {val(identity.business_type)}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase size={13} />
                {val(identity.turnover_range?.contact_page ?? identity.turnover_range?.top_bar)}
              </span>
              <span className="text-white/40">
                {val(identity.contact_person)}
              </span>
            </div>

            {/* Package indicators */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(identity.package_indicators ?? []).map((item: string) => (
                <span
                  key={item}
                  className="rounded-md bg-blue-500/20 px-2.5 py-1 text-[11px] font-bold text-blue-200 backdrop-blur-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3">
            <QuickStat label="Status" value={val(account.status)} color="emerald" />
            <QuickStat label="Category" value={val(perf.category_score)} color="blue" />
            <QuickStat label="Products" value={val(perf.product_count)} color="violet" />
            <QuickStat label="Updated" value={val(account.updated_date)} color="slate" />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuickStat({
  label,
  value,
  color,
}: {
  label: string;
  value: React.ReactNode;
  color: "emerald" | "blue" | "violet" | "slate";
}) {
  const bgMap: Record<string, string> = {
    emerald: "bg-emerald-500/15",
    blue: "bg-blue-500/15",
    violet: "bg-violet-500/15",
    slate: "bg-white/8",
  };
  return (
    <div className={`rounded-xl ${bgMap[color]} px-4 py-2.5 backdrop-blur-sm min-w-[90px]`}>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-extrabold text-white/90">{value}</div>
    </div>
  );
}
