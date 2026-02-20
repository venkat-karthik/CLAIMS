"use client";

import { AppShell } from "@/components/app-shell";
import { DASHBOARD_KPIs, WORKFLOW_STEPS, FRAUD_PIPELINE, WORKSHOP_PERFORMANCE, MOCK_CLAIMS } from "@/lib/data";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  TrendingDown, TrendingUp, AlertTriangle, Clock, CheckCircle2,
  Brain, Shield, Wrench, Users, Zap, ArrowUpRight, ArrowDownRight,
  ChevronRight, Activity, Target, DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";

const THROUGHPUT_DATA = [
  { day: "Mon", submitted: 42, resolved: 38, flagged: 4 },
  { day: "Tue", submitted: 38, resolved: 44, flagged: 6 },
  { day: "Wed", submitted: 56, resolved: 41, flagged: 8 },
  { day: "Thu", submitted: 49, resolved: 52, flagged: 3 },
  { day: "Fri", submitted: 62, resolved: 48, flagged: 9 },
  { day: "Sat", submitted: 28, resolved: 31, flagged: 2 },
  { day: "Sun", submitted: 21, resolved: 24, flagged: 1 },
];

const AI_ACCURACY_DATA = [
  { week: "W1", accuracy: 88.2, autoApproval: 58 },
  { week: "W2", accuracy: 89.7, autoApproval: 60 },
  { week: "W3", accuracy: 90.1, autoApproval: 61 },
  { week: "W4", accuracy: 91.4, autoApproval: 62 },
];

const SLA_DISTRIBUTION = [
  { name: "On Track", value: 621, fill: "oklch(0.62 0.18 160)" },
  { name: "At Risk", value: 203, fill: "oklch(0.72 0.18 85)" },
  { name: "Breached", value: 23, fill: "oklch(0.62 0.24 25)" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[oklch(0.18_0.02_255)] border border-[oklch(0.25_0.02_255)] rounded-lg p-3 text-xs shadow-xl">
        <p className="text-[oklch(0.6_0.01_240)] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }} className="font-medium">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function KPICard({ label, value, sub, trend, trendUp, color, onClick, icon: Icon }: any) {
  return (
    <button
      onClick={onClick}
      className="kiai-card rounded-xl p-4 text-left w-full group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center`} style={{ background: `${color}20` }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
            trendUp ? "bg-[oklch(0.62_0.18_160/15%)] text-[oklch(0.62_0.18_160)]" : "bg-[oklch(0.62_0.24_25/15%)] text-[oklch(0.62_0.24_25)]"
          }`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs font-medium text-[oklch(0.7_0.01_240)]">{label}</div>
      {sub && <div className="text-[10px] text-[oklch(0.45_0.01_250)] mt-0.5">{sub}</div>}
    </button>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const kpi = DASHBOARD_KPIs;

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Operations Dashboard</h1>
            <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Live view · Feb 20, 2026 · Auto-refreshes every 30s</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[oklch(0.62_0.18_160/12%)] border border-[oklch(0.62_0.18_160/25%)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.18_160)] live-dot" />
              <span className="text-xs font-medium text-[oklch(0.62_0.18_160)]">38 resolved today</span>
            </div>
            <button className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.58_0.22_255/20%)] text-[oklch(0.68_0.22_255)] border border-[oklch(0.58_0.22_255/35%)] rounded-lg hover:bg-[oklch(0.58_0.22_255/30%)] transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* KPI Strip — Ops */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-3.5 h-3.5 text-[oklch(0.58_0.22_255)]" />
            <span className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-widest">Operations</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <KPICard label="Active Claims" value={kpi.ops.totalActive} sub="Across all regions" trend="+12" trendUp={false} color="oklch(0.58 0.22 255)" icon={FileTextIcon} onClick={() => router.push('/claims')} />
            <KPICard label="SLA Breaches" value={kpi.ops.slaBreaches} sub="Needs immediate action" trend="-8" trendUp={true} color="oklch(0.62 0.24 25)" icon={AlertTriangle} onClick={() => router.push('/claims?filter=sla_breach')} />
            <KPICard label="Pending Approvals" value={kpi.ops.pendingApprovals} sub="Awaiting decision" color="oklch(0.72 0.18 85)" icon={Clock} onClick={() => router.push('/claims?filter=pending_approval')} />
            <KPICard label="Avg Cycle Time" value={kpi.ops.avgCycleTime} sub="↓ from 8.1d last week" trend="24%" trendUp={true} color="oklch(0.65 0.22 310)" icon={Target} />
            <KPICard label="Resolved Today" value={kpi.ops.throughputToday} sub="vs 31 yesterday" trend="+23%" trendUp={true} color="oklch(0.62 0.18 160)" icon={CheckCircle2} />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Throughput chart */}
          <div className="xl:col-span-2 kiai-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Weekly Throughput</h3>
                <p className="text-xs text-[oklch(0.5_0.01_250)]">Claims in vs out vs fraud flags</p>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[oklch(0.58_0.22_255)]" /><span className="text-[oklch(0.6_0.01_240)]">Submitted</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[oklch(0.62_0.18_160)]" /><span className="text-[oklch(0.6_0.01_240)]">Resolved</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[oklch(0.62_0.24_25)]" /><span className="text-[oklch(0.6_0.01_240)]">Flagged</span></div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={THROUGHPUT_DATA}>
                <defs>
                  <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.58 0.22 255)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.58 0.22 255)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.62 0.18 160)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.62 0.18 160)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="submitted" stroke="oklch(0.58 0.22 255)" fill="url(#gradBlue)" strokeWidth={2} name="Submitted" />
                <Area type="monotone" dataKey="resolved" stroke="oklch(0.62 0.18 160)" fill="url(#gradGreen)" strokeWidth={2} name="Resolved" />
                <Bar dataKey="flagged" fill="oklch(0.62 0.24 25)" radius={[3,3,0,0]} name="Flagged" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* SLA Distribution */}
          <div className="kiai-card rounded-xl p-5">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">SLA Status</h3>
              <p className="text-xs text-[oklch(0.5_0.01_250)]">847 active claims</p>
            </div>
            <div className="flex items-center justify-center mb-4">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={SLA_DISTRIBUTION} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                    {SLA_DISTRIBUTION.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {SLA_DISTRIBUTION.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                    <span className="text-[oklch(0.7_0.01_240)]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{item.value}</span>
                    <span className="text-[oklch(0.45_0.01_250)]">{Math.round(item.value/847*100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline + Fraud + AI row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Pipeline funnel */}
          <div className="kiai-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Claim Pipeline</h3>
              <span className="text-[10px] text-[oklch(0.5_0.01_250)]">Click to filter</span>
            </div>
            <div className="space-y-2">
              {WORKFLOW_STEPS.map((step, i) => {
                const maxCount = Math.max(...WORKFLOW_STEPS.map(s => s.count));
                const pct = (step.count / maxCount) * 100;
                const colors: Record<string, string> = {
                  blue: 'oklch(0.58 0.22 255)',
                  cyan: 'oklch(0.72 0.14 210)',
                  purple: 'oklch(0.65 0.22 310)',
                  amber: 'oklch(0.72 0.18 85)',
                  orange: 'oklch(0.72 0.2 55)',
                  green: 'oklch(0.62 0.18 160)',
                  pink: 'oklch(0.65 0.22 350)',
                  slate: 'oklch(0.45 0.01 250)',
                };
                const c = colors[step.color];
                return (
                  <button key={step.id} onClick={() => router.push(`/claims?stage=${step.id}`)} className="w-full group">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[oklch(0.7_0.01_240)] group-hover:text-white transition-colors">{step.label}</span>
                      <span className="font-semibold" style={{ color: c }}>{step.count}</span>
                    </div>
                    <div className="h-1.5 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: c, opacity: 0.8 }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fraud Panel */}
          <div className="kiai-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[oklch(0.62_0.24_25)]" />
                <h3 className="text-sm font-semibold text-white">Fraud Pipeline</h3>
              </div>
              <button onClick={() => router.push('/fraud')} className="text-[10px] text-[oklch(0.58_0.22_255)] hover:underline flex items-center gap-0.5">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3 mb-4">
              {FRAUD_PIPELINE.map((stage) => (
                <div key={stage.stage} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: stage.fill }} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs text-[oklch(0.7_0.01_240)]">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(stage.count / 47) * 100}%`, background: stage.fill, opacity: 0.8 }} />
                      </div>
                      <span className="text-xs font-bold text-white w-5 text-right">{stage.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[oklch(0.22_0.02_255)] pt-3 grid grid-cols-2 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-[oklch(0.62_0.24_25)]">₹18.4L</div>
                <div className="text-[10px] text-[oklch(0.5_0.01_250)]">Leakage Saved</div>
              </div>
              <div>
                <div className="text-lg font-bold text-[oklch(0.72_0.18_85)]">18%</div>
                <div className="text-[10px] text-[oklch(0.5_0.01_250)]">False Positive Rate</div>
              </div>
            </div>
          </div>

          {/* AI Performance */}
          <div className="kiai-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[oklch(0.65_0.22_310)]" />
              <h3 className="text-sm font-semibold text-white">AI Performance</h3>
            </div>
            <div className="space-y-3 mb-4">
              {[
                { label: "Estimation Accuracy", value: "91.4%", pct: 91.4, color: "oklch(0.62 0.18 160)" },
                { label: "Auto-Approval Rate", value: "62%", pct: 62, color: "oklch(0.58 0.22 255)" },
                { label: "Avg Confidence", value: "84%", pct: 84, color: "oklch(0.65 0.22 310)" },
                { label: "Fraud Detection", value: "88%", pct: 88, color: "oklch(0.72 0.18 85)" },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[oklch(0.7_0.01_240)]">{m.label}</span>
                    <span className="font-bold" style={{ color: m.color }}>{m.value}</span>
                  </div>
                  <div className="h-1.5 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${m.pct}%`, background: m.color, opacity: 0.85 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[oklch(0.22_0.02_255)] pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[oklch(0.5_0.01_250)]">Models run today</span>
                <span className="font-bold text-white">312</span>
              </div>
              <div className="flex items-center justify-between text-xs mt-1">
                <span className="text-[oklch(0.5_0.01_250)]">Total AI savings</span>
                <span className="font-bold text-[oklch(0.62_0.18_160)]">₹31.2L</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workshop Intelligence + Risk KPIs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Workshop table */}
          <div className="kiai-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[oklch(0.72_0.18_85)]" />
                <h3 className="text-sm font-semibold text-white">Workshop Intelligence</h3>
              </div>
              <button onClick={() => router.push('/workshops')} className="text-[10px] text-[oklch(0.58_0.22_255)] hover:underline flex items-center gap-0.5">
                All Workshops <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-[oklch(0.45_0.01_250)] border-b border-[oklch(0.22_0.02_255)]">
                    <th className="text-left py-2 font-medium">Workshop</th>
                    <th className="text-right py-2 font-medium">Jobs</th>
                    <th className="text-right py-2 font-medium">On-Time</th>
                    <th className="text-right py-2 font-medium">Deviation</th>
                    <th className="text-right py-2 font-medium">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(0.18_0.018_255)]">
                  {WORKSHOP_PERFORMANCE.map((w) => (
                    <tr key={w.name} className="hover:bg-[oklch(0.18_0.02_255)] cursor-pointer transition-colors" onClick={() => router.push('/workshops')}>
                      <td className="py-2.5 pr-2">
                        <div className="font-medium text-white truncate max-w-[130px]">{w.name}</div>
                        <div className="text-[oklch(0.45_0.01_250)]">★ {w.rating}</div>
                      </td>
                      <td className="py-2.5 text-right text-white font-medium">{w.jobs}</td>
                      <td className="py-2.5 text-right">
                        <span className={w.onTime >= 90 ? 'sla-ok font-medium' : w.onTime >= 75 ? 'sla-warn font-medium' : 'sla-breach font-medium'}>
                          {w.onTime}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={w.deviation <= 8 ? 'sla-ok' : w.deviation <= 15 ? 'sla-warn' : 'sla-breach'}>
                          +{w.deviation}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="inline-flex items-center gap-1">
                          <div className="h-1.5 w-10 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: `${w.riskScore}%`,
                              background: w.riskScore > 50 ? 'oklch(0.62 0.24 25)' : w.riskScore > 25 ? 'oklch(0.72 0.18 85)' : 'oklch(0.62 0.18 160)'
                            }} />
                          </div>
                          <span className="text-[oklch(0.6_0.01_240)] w-5">{w.riskScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk + Finance + CX KPIs */}
          <div className="space-y-4">
            {/* Risk */}
            <div className="kiai-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-3.5 h-3.5 text-[oklch(0.62_0.24_25)]" />
                <span className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-widest">Risk</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Fraud Flagged", v: kpi.risk.fraudFlagged, c: "oklch(0.62 0.24 25)" },
                  { label: "SIU Active", v: kpi.risk.siuActive, c: "oklch(0.65 0.22 310)" },
                  { label: "High Value", v: kpi.risk.highValue, c: "oklch(0.72 0.18 85)" },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="text-xl font-bold" style={{ color: m.c }}>{m.v}</div>
                    <div className="text-[10px] text-[oklch(0.5_0.01_250)]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Finance */}
            <div className="kiai-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-3.5 h-3.5 text-[oklch(0.62_0.18_160)]" />
                <span className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-widest">Finance</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Leakage Saved", v: "₹18.4L", c: "oklch(0.62 0.18 160)" },
                  { label: "Pending Payouts", v: "₹4.2Cr", c: "oklch(0.58 0.22 255)" },
                  { label: "Auto-Approved", v: kpi.finance.autoApproved, c: "oklch(0.65 0.22 310)" },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="text-xl font-bold" style={{ color: m.c }}>{m.v}</div>
                    <div className="text-[10px] text-[oklch(0.5_0.01_250)]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CX */}
            <div className="kiai-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-3.5 h-3.5 text-[oklch(0.72_0.14_210)]" />
                <span className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-widest">Customer Experience</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "NPS Score", v: kpi.cx.npsScore, c: "oklch(0.62 0.18 160)" },
                  { label: "Churn Risk", v: kpi.cx.churnRisk, c: "oklch(0.62 0.24 25)" },
                  { label: "Open Complaints", v: kpi.cx.openComplaints, c: "oklch(0.72 0.18 85)" },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="text-xl font-bold" style={{ color: m.c }}>{m.v}</div>
                    <div className="text-[10px] text-[oklch(0.5_0.01_250)]">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Claims strip */}
        <div className="kiai-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[oklch(0.62_0.24_25)] live-dot" />
              <h3 className="text-sm font-semibold text-white">Urgent — Requires Action Now</h3>
            </div>
            <button onClick={() => router.push('/claims')} className="text-xs text-[oklch(0.58_0.22_255)] hover:underline flex items-center gap-1">
              View All Claims <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {MOCK_CLAIMS.filter(c => c.priority === 'critical' || c.slaStatus === 'breach').map(claim => (
              <button
                key={claim.id}
                onClick={() => router.push(`/claims/${claim.id}`)}
                className="w-full flex items-center gap-4 p-3 rounded-lg bg-[oklch(0.62_0.24_25/8%)] border border-[oklch(0.62_0.24_25/25%)] hover:border-[oklch(0.62_0.24_25/50%)] transition-all text-left group"
              >
                <AlertTriangle className="w-4 h-4 text-[oklch(0.62_0.24_25)] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-white">{claim.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[oklch(0.62_0.24_25/20%)] text-[oklch(0.75_0.24_25)] border border-[oklch(0.62_0.24_25/30%)]">SLA BREACH</span>
                    {claim.fraudFlagged && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[oklch(0.65_0.22_310/20%)] text-[oklch(0.75_0.22_310)] border border-[oklch(0.65_0.22_310/30%)]">FRAUD FLAG</span>}
                  </div>
                  <div className="text-xs text-[oklch(0.6_0.01_240)]">{claim.claimantName} · {claim.vehicle}</div>
                  <div className="text-[10px] text-[oklch(0.62_0.24_25)] mt-0.5">{claim.requiredAction}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-white">₹{(claim.claimAmount/100000).toFixed(1)}L</div>
                  <div className="text-[10px] text-[oklch(0.62_0.24_25)]">{claim.slaDue} overdue</div>
                </div>
                <ChevronRight className="w-4 h-4 text-[oklch(0.4_0.01_250)] group-hover:text-white transition-colors flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function FileTextIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
