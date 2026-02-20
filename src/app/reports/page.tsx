"use client";

import { AppShell } from "@/components/app-shell";
import { BarChart3, Download, Calendar } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const CYCLE_TIME_DATA = [
  { type: "Motor Standard", days: 6.2 },
  { type: "Motor High Value", days: 4.8 },
  { type: "Motor Total Loss", days: 2.9 },
  { type: "Health", days: 11.4 },
  { type: "Property", days: 18.7 },
];

const MONTHLY_VOLUME = [
  { month: "Sep", submitted: 621, resolved: 598, fraud: 31 },
  { month: "Oct", submitted: 687, resolved: 641, fraud: 38 },
  { month: "Nov", submitted: 712, resolved: 698, fraud: 42 },
  { month: "Dec", submitted: 698, resolved: 721, fraud: 35 },
  { month: "Jan", submitted: 741, resolved: 712, fraud: 44 },
  { month: "Feb", submitted: 847, resolved: 782, fraud: 47 },
];

const COST_DISTRIBUTION = [
  { name: "Auto-Approved", value: 156, fill: "oklch(0.62 0.18 160)" },
  { name: "Handler Review", value: 89, fill: "oklch(0.58 0.22 255)" },
  { name: "Manager Review", value: 41, fill: "oklch(0.72 0.18 85)" },
  { name: "SIU Investigation", value: 8, fill: "oklch(0.62 0.24 25)" },
];

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[oklch(0.72_0.14_210)]" />
              Reports & Analytics
            </h1>
            <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Operational · Financial · Compliance · AI performance</p>
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-[oklch(0.15_0.018_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[oklch(0.58_0.22_255)]">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Year to date</option>
            </select>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white kiai-gradient rounded-lg">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Claims (Feb)", v: "847", c: "oklch(0.58 0.22 255)" },
            { label: "Resolved", v: "782 (92%)", c: "oklch(0.62 0.18 160)" },
            { label: "Avg Cycle Time", v: "6.2 days", c: "oklch(0.65 0.22 310)" },
            { label: "Leakage Saved", v: "₹18.4L", c: "oklch(0.72 0.18 85)" },
          ].map(s => (
            <div key={s.label} className="kiai-card rounded-xl p-4">
              <div className="text-xl font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-[oklch(0.5_0.01_250)] mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Monthly volume */}
          <div className="kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Monthly Claim Volume</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_VOLUME}>
                <XAxis dataKey="month" tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'oklch(0.18 0.02 255)', border: '1px solid oklch(0.25 0.02 255)', borderRadius: '8px', fontSize: 11 }} />
                <Bar dataKey="submitted" name="Submitted" fill="oklch(0.58 0.22 255)" radius={[3,3,0,0]} opacity={0.9} />
                <Bar dataKey="resolved" name="Resolved" fill="oklch(0.62 0.18 160)" radius={[3,3,0,0]} opacity={0.9} />
                <Bar dataKey="fraud" name="Fraud Flagged" fill="oklch(0.62 0.24 25)" radius={[3,3,0,0]} opacity={0.9} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Avg cycle time by type */}
          <div className="kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Avg Cycle Time by Claim Type</h3>
            <div className="space-y-3">
              {CYCLE_TIME_DATA.map(item => (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[oklch(0.7_0.01_240)]">{item.type}</span>
                    <span className="font-bold text-white">{item.days}d</span>
                  </div>
                  <div className="h-2 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[oklch(0.58_0.22_255/80%)]" style={{ width: `${(item.days / 20) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Approval distribution */}
          <div className="kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Approval Path Distribution (Feb)</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie data={COST_DISTRIBUTION} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={3} dataKey="value">
                    {COST_DISTRIBUTION.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {COST_DISTRIBUTION.map(item => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.fill }} />
                      <span className="text-[oklch(0.7_0.01_240)]">{item.name}</span>
                    </div>
                    <span className="font-bold text-white">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report downloads */}
          <div className="kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Available Reports</h3>
            <div className="space-y-2">
              {[
                { name: "Ops Performance Report (Feb 2026)", type: "PDF", updated: "Today" },
                { name: "Fraud Summary + SIU Outcomes", type: "PDF", updated: "Today" },
                { name: "AI Estimation Accuracy Audit", type: "XLSX", updated: "Feb 18" },
                { name: "Workshop Performance Scorecard", type: "PDF", updated: "Feb 15" },
                { name: "Finance — Invoice Variance Log", type: "XLSX", updated: "Feb 20" },
                { name: "NPS & CX Monthly Report", type: "PDF", updated: "Feb 19" },
              ].map(r => (
                <div key={r.name} className="flex items-center justify-between p-3 rounded-lg bg-[oklch(0.13_0.016_255)] border border-[oklch(0.22_0.02_255)] hover:border-[oklch(0.35_0.05_255)] transition-colors cursor-pointer">
                  <div>
                    <div className="text-xs font-medium text-white">{r.name}</div>
                    <div className="text-[10px] text-[oklch(0.45_0.01_250)]">Updated: {r.updated}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(0.22_0.02_255)] text-[oklch(0.6_0.01_240)]">{r.type}</span>
                    <Download className="w-3.5 h-3.5 text-[oklch(0.5_0.01_250)] hover:text-white transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
