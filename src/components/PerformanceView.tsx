import { Activity, BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import type { SellerRecord } from "../types";
import { Panel, MetricBox, MetricLine } from "./shared";

export function PerformanceView({ seller }: { seller: SellerRecord }) {
  const perf = seller.performance_snapshot ?? {};
  const rows = toPerformanceRows(seller);

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Performance Cards */}
      <div className="grid gap-3 md:grid-cols-3">
        <PerformanceCard title="7 Day" data={perf.seven_day} accent="blue" />
        <PerformanceCard title="30 Day" data={perf.thirty_day} accent="violet" />
        <PerformanceCard title="90 Day" data={perf.ninety_day} accent="amber" />
      </div>

      {/* Chart + Signals */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Panel title="Calls & Replies Trend" icon={<BarChart3 size={16} />}>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} barGap={4}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={42}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(37, 99, 235, 0.04)" }}
                  contentStyle={{
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", fontWeight: 600 }}
                  iconType="circle"
                  iconSize={8}
                />
                <Bar
                  dataKey="calls"
                  name="Calls"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
                <Bar
                  dataKey="replies"
                  name="Replies"
                  fill="#f59e0b"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Snapshot Signals" icon={<Activity size={16} />}>
          <div className="space-y-1">
            <MetricLine label="Category score" value={perf.category_score} />
            <MetricLine label="Product count" value={perf.product_count} />
            <MetricLine label="Connect recency" value={perf.connect_recency} />
            <MetricLine label="Meeting recency" value={perf.meeting_recency} />
            <MetricLine label="Number count" value={perf.number_count} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function PerformanceCard({
  title,
  data,
  accent,
}: {
  title: string;
  data: Record<string, any> | undefined;
  accent: "blue" | "violet" | "amber";
}) {
  const accentMap: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-500/5 border-blue-200/60",
    violet: "from-violet-500/10 to-violet-500/5 border-violet-200/60",
    amber: "from-amber-500/10 to-amber-500/5 border-amber-200/60",
  };
  const dotMap: Record<string, string> = {
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    amber: "bg-amber-500",
  };

  return (
    <section className={`perf-card bg-gradient-to-br ${accentMap[accent]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotMap[accent]}`} />
          <span className="text-sm font-bold text-ink">{title}</span>
        </div>
        <Activity size={15} className="text-muted" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <MetricBox label="Calls" value={data?.calls ?? "—"} />
        <MetricBox label="Replies" value={data?.replies ?? "—"} />
        <MetricBox label="Lead Manager" value={data?.lead_manager ?? "—"} />
        <MetricBox label="Conn./Attempt" value={data?.connection_attempt ?? "—"} />
      </div>
    </section>
  );
}

function toPerformanceRows(seller: SellerRecord) {
  const perf = seller.performance_snapshot ?? {};
  return [
    {
      period: "7D",
      calls: Number(perf.seven_day?.calls ?? 0),
      replies: Number(perf.seven_day?.replies ?? 0),
    },
    {
      period: "30D",
      calls: Number(perf.thirty_day?.calls ?? 0),
      replies: Number(perf.thirty_day?.replies ?? 0),
    },
    {
      period: "90D",
      calls: Number(perf.ninety_day?.calls ?? 0),
      replies: Number(perf.ninety_day?.replies ?? 0),
    },
  ];
}
