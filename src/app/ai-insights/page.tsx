"use client";

import { AppShell } from "@/components/app-shell";
import { Brain, TrendingUp, Target, Zap, ChevronRight, Info } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const ACCURACY_TREND = [
  { month: "Aug", accuracy: 86.1, confidence: 78 },
  { month: "Sep", accuracy: 87.4, confidence: 80 },
  { month: "Oct", accuracy: 88.9, confidence: 82 },
  { month: "Nov", accuracy: 89.7, confidence: 83 },
  { month: "Dec", accuracy: 90.1, confidence: 84 },
  { month: "Jan", accuracy: 91.0, confidence: 84 },
  { month: "Feb", accuracy: 91.4, confidence: 84 },
];

const CLAIM_TYPE_ACCURACY = [
  { type: "Motor", accuracy: 93.2, volume: 612 },
  { type: "Health", accuracy: 88.1, volume: 124 },
  { type: "Property", accuracy: 84.7, volume: 78 },
  { type: "Liability", accuracy: 79.3, volume: 33 },
];

const SAVINGS_DATA = [
  { month: "Oct", saved: 18.2, total: 89.4 },
  { month: "Nov", saved: 22.1, total: 97.1 },
  { month: "Dec", saved: 26.8, total: 112.3 },
  { month: "Jan", saved: 28.4, total: 108.7 },
  { month: "Feb", saved: 31.2, total: 121.4 },
];

const AUTO_APPROVAL_BREAKDOWN = [
  { name: "Low risk, high confidence", value: 89, color: "oklch(0.62 0.18 160)" },
  { name: "Medium risk, high confidence", value: 44, color: "oklch(0.58 0.22 255)" },
  { name: "Low risk, medium confidence", value: 23, color: "oklch(0.65 0.22 310)" },
];

const AI_MODULES = [
  { name: "Estimation Model", version: "v3.2", lastTrained: "Feb 15", accuracy: "91.4%", status: "healthy" },
  { name: "Fraud Detection", version: "v2.8", lastTrained: "Feb 10", accuracy: "88.3%", status: "healthy" },
  { name: "Doc Scanner", version: "v1.9", lastTrained: "Jan 28", accuracy: "96.1%", status: "healthy" },
  { name: "Churn Predictor", version: "v1.4", lastTrained: "Feb 01", accuracy: "79.2%", status: "retrain" },
  { name: "Workshop Risk Score", version: "v2.1", lastTrained: "Feb 12", accuracy: "84.7%", status: "healthy" },
];

const RADAR_DATA = [
  { subject: "Accuracy", A: 91 },
  { subject: "Coverage", A: 88 },
  { subject: "Speed", A: 96 },
  { subject: "Fraud Recall", A: 84 },
  { subject: "Cost/Claim", A: 79 },
  { subject: "Auto-Rate", A: 62 },
];

export default function AIInsightsPage() {
  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-[oklch(0.65_0.22_310)]" />
              AI Insights
            </h1>
            <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Model performance · Auto-approval stats · Savings attribution · Learning loop</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.65_0.22_310/12%)] border border-[oklch(0.65_0.22_310/30%)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.18_160)] live-dot" />
            <span className="text-xs font-medium text-[oklch(0.75_0.22_310)]">312 models run today</span>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Estimation Accuracy", v: "91.4%", c: "oklch(0.62 0.18 160)", trend: "↑0.4%" },
            { label: "Auto-Approval Rate", v: "62%", c: "oklch(0.58 0.22 255)", trend: "↑2%" },
            { label: "Avg Confidence", v: "84%", c: "oklch(0.65 0.22 310)", trend: "stable" },
            { label: "Total AI Savings", v: "₹31.2L", c: "oklch(0.72 0.18 85)", trend: "↑9.9%" },
            { label: "Cost per AI Run", v: "₹127", c: "oklch(0.72 0.14 210)", trend: "↓₹14" },
          ].map(s => (
            <div key={s.label} className="kiai-card rounded-xl p-3">
              <div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-[oklch(0.5_0.01_250)]">{s.label}</div>
              <div className="text-[10px] text-[oklch(0.45_0.01_250)] mt-0.5">{s.trend}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Accuracy trend */}
          <div className="xl:col-span-2 kiai-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">AI Estimation Accuracy — 7-Month Trend</h3>
                <p className="text-xs text-[oklch(0.5_0.01_250)]">Model accuracy vs average confidence score</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={ACCURACY_TREND}>
                <XAxis dataKey="month" tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} domain={[75, 95]} />
                <Tooltip contentStyle={{ background: 'oklch(0.18 0.02 255)', border: '1px solid oklch(0.25 0.02 255)', borderRadius: '8px', fontSize: 11 }} />
                <Line type="monotone" dataKey="accuracy" stroke="oklch(0.62 0.18 160)" strokeWidth={2.5} dot={{ fill: 'oklch(0.62 0.18 160)', r: 3 }} name="Accuracy %" />
                <Line type="monotone" dataKey="confidence" stroke="oklch(0.65 0.22 310)" strokeWidth={2} strokeDasharray="5 3" dot={{ fill: 'oklch(0.65 0.22 310)', r: 2 }} name="Avg Confidence %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Radar */}
          <div className="kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">AI System Health</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="oklch(0.22 0.02 255)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'oklch(0.55 0.01 250)', fontSize: 10 }} />
                <Radar name="Score" dataKey="A" stroke="oklch(0.65 0.22 310)" fill="oklch(0.65 0.22 310)" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Savings */}
          <div className="kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1">AI Savings vs Total Payout (₹L)</h3>
            <p className="text-xs text-[oklch(0.5_0.01_250)] mb-4">Leakage prevented through AI-validated approvals</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={SAVINGS_DATA}>
                <XAxis dataKey="month" tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'oklch(0.18 0.02 255)', border: '1px solid oklch(0.25 0.02 255)', borderRadius: '8px', fontSize: 11 }} />
                <Bar dataKey="total" name="Total Payout" fill="oklch(0.58 0.22 255 / 30%)" radius={[3,3,0,0]} />
                <Bar dataKey="saved" name="AI Savings" fill="oklch(0.62 0.18 160)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Accuracy by claim type */}
          <div className="kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-1">Accuracy by Claim Type</h3>
            <p className="text-xs text-[oklch(0.5_0.01_250)] mb-4">Motor performs best — Property & Liability need more data</p>
            <div className="space-y-3">
              {CLAIM_TYPE_ACCURACY.map(item => (
                <div key={item.type}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{item.type}</span>
                      <span className="text-[oklch(0.5_0.01_250)]">{item.volume} claims</span>
                    </div>
                    <span className={`font-bold ${item.accuracy >= 90 ? 'text-[oklch(0.62_0.18_160)]' : item.accuracy >= 85 ? 'text-[oklch(0.72_0.18_85)]' : 'text-[oklch(0.62_0.24_25)]'}`}>
                      {item.accuracy}%
                    </span>
                  </div>
                  <div className="h-2 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${item.accuracy}%`,
                      background: item.accuracy >= 90 ? 'oklch(0.62 0.18 160)' : item.accuracy >= 85 ? 'oklch(0.72 0.18 85)' : 'oklch(0.62 0.24 25)',
                      opacity: 0.85
                    }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-[oklch(0.72_0.18_85/8%)] border border-[oklch(0.72_0.18_85/25%)] rounded-lg">
              <p className="text-[10px] text-[oklch(0.72_0.18_85)]">
                ⚠ Property & Liability accuracy below 85% — recommend collecting 200+ more labelled cases for model retraining.
              </p>
            </div>
          </div>
        </div>

        {/* Model registry */}
        <div className="kiai-card rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[oklch(0.72_0.18_85)]" />
            AI Model Registry
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[oklch(0.22_0.02_255)] text-[oklch(0.45_0.01_250)] uppercase tracking-wide">
                  <th className="text-left py-2 font-medium">Model</th>
                  <th className="text-left py-2 font-medium">Version</th>
                  <th className="text-left py-2 font-medium">Last Trained</th>
                  <th className="text-left py-2 font-medium">Accuracy</th>
                  <th className="text-left py-2 font-medium">Status</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.18_0.018_255)]">
                {AI_MODULES.map(m => (
                  <tr key={m.name} className="hover:bg-[oklch(0.17_0.02_255)] transition-colors">
                    <td className="py-3 font-semibold text-white">{m.name}</td>
                    <td className="py-3 text-[oklch(0.5_0.01_250)]">{m.version}</td>
                    <td className="py-3 text-[oklch(0.6_0.01_240)]">{m.lastTrained}</td>
                    <td className="py-3">
                      <span className={`font-bold ${parseFloat(m.accuracy) >= 90 ? 'text-[oklch(0.62_0.18_160)]' : parseFloat(m.accuracy) >= 82 ? 'text-[oklch(0.72_0.18_85)]' : 'text-[oklch(0.62_0.24_25)]'}`}>
                        {m.accuracy}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                        m.status === 'healthy' ? 'text-[oklch(0.62_0.18_160)] border-[oklch(0.62_0.18_160/40%)] bg-[oklch(0.62_0.18_160/12%)]' :
                        'text-[oklch(0.72_0.18_85)] border-[oklch(0.72_0.18_85/40%)] bg-[oklch(0.72_0.18_85/12%)]'
                      }`}>
                        {m.status === 'healthy' ? '● Healthy' : '⚠ Needs Retrain'}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="px-2.5 py-1 text-[10px] font-medium text-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/12%)] border border-[oklch(0.58_0.22_255/30%)] rounded hover:bg-[oklch(0.58_0.22_255/25%)] transition-colors">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
