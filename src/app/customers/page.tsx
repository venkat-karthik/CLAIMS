"use client";

import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import {
  Users, MessageSquare, Star, AlertTriangle, TrendingUp, TrendingDown,
  Phone, Send, Clock, CheckCircle2, ChevronRight, Bell
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";

const CHURN_RISKS = [
  { name: "Deepak Nair", claimId: "CLM-2024-0891", reason: "SLA breach + no update 4 days", risk: "critical", phone: "+91 98765 43210" },
  { name: "Chirag Patel", claimId: "CLM-2024-0897", reason: "Invoice dispute pending 6 days", risk: "high", phone: "+91 91234 56789" },
  { name: "Rohit Gupta", claimId: "CLM-2024-0895", reason: "High-value, silent for 2 days", risk: "high", phone: "+91 87654 32109" },
  { name: "Suresh Babu", claimId: "CLM-2024-0893", reason: "Docs incomplete, frustrated customer", risk: "medium", phone: "+91 76543 21098" },
];

const NPS_TREND = [
  { month: "Sep", nps: 41 },
  { month: "Oct", nps: 44 },
  { month: "Nov", nps: 48 },
  { month: "Dec", nps: 46 },
  { month: "Jan", nps: 50 },
  { month: "Feb", nps: 52 },
];

const COMPLAINT_REASONS = [
  { reason: "No update / silence", count: 31 },
  { reason: "Delay in repair", count: 24 },
  { reason: "Invoice mismatch", count: 18 },
  { reason: "Rude workshop staff", count: 9 },
  { reason: "App not working", count: 6 },
];

const SURVEY_DATA = [
  { label: "Sent", count: 312, color: "oklch(0.58 0.22 255)" },
  { label: "Responded", count: 209, color: "oklch(0.62 0.18 160)" },
  { label: "Promoters (9-10)", count: 134, color: "oklch(0.62 0.18 160)" },
  { label: "Passives (7-8)", count: 47, color: "oklch(0.72 0.18 85)" },
  { label: "Detractors (0-6)", count: 28, color: "oklch(0.62 0.24 25)" },
];

export default function CustomersPage() {
  const [campaignMsg, setCampaignMsg] = useState("Hi {name}, your claim {claimId} is being processed. Expected completion: {date}. Reply STOP to opt out.");

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">Customer Experience</h1>
          <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">NPS · Churn risk · Proactive alerts · Survey campaigns · Complaint management</p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "NPS Score", v: "52", c: "oklch(0.62 0.18 160)", trend: "↑4 MoM" },
            { label: "Churn Risk", v: "17", c: "oklch(0.62 0.24 25)", trend: "⚠ High" },
            { label: "Open Complaints", v: "9", c: "oklch(0.72 0.18 85)", trend: "" },
            { label: "Survey Response", v: "67%", c: "oklch(0.65 0.22 310)", trend: "" },
            { label: "Avg Response Time", v: "3.2h", c: "oklch(0.72 0.14 210)", trend: "↓0.4h" },
          ].map(s => (
            <div key={s.label} className="kiai-card rounded-xl p-3">
              <div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-[oklch(0.5_0.01_250)]">{s.label}</div>
              {s.trend && <div className="text-[10px] text-[oklch(0.45_0.01_250)] mt-0.5">{s.trend}</div>}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Churn risk list */}
          <div className="kiai-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-[oklch(0.62_0.24_25)]" />
              <h3 className="text-sm font-semibold text-white">Churn Risk — Act Now</h3>
            </div>
            <div className="space-y-3">
              {CHURN_RISKS.map(r => (
                <div key={r.name} className={`p-3 rounded-lg border ${
                  r.risk === 'critical' ? 'border-[oklch(0.62_0.24_25/40%)] bg-[oklch(0.62_0.24_25/8%)]' :
                  r.risk === 'high' ? 'border-[oklch(0.72_0.18_85/35%)] bg-[oklch(0.72_0.18_85/6%)]' :
                  'border-[oklch(0.22_0.02_255)] bg-[oklch(0.13_0.016_255)]'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{r.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      r.risk === 'critical' ? 'text-[oklch(0.75_0.24_25)] bg-[oklch(0.62_0.24_25/20%)]' :
                      r.risk === 'high' ? 'text-[oklch(0.72_0.18_85)] bg-[oklch(0.72_0.18_85/20%)]' :
                      'text-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/15%)]'
                    }`}>{r.risk}</span>
                  </div>
                  <div className="text-[10px] text-[oklch(0.5_0.01_250)] mb-2">{r.claimId} · {r.reason}</div>
                  <div className="flex gap-1">
                    <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-[oklch(0.62_0.18_160/15%)] text-[oklch(0.62_0.18_160)] border border-[oklch(0.62_0.18_160/30%)] rounded hover:bg-[oklch(0.62_0.18_160/30%)] transition-colors">
                      <Phone className="w-2.5 h-2.5" />
                      Call
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-[oklch(0.58_0.22_255/15%)] text-[oklch(0.68_0.22_255)] border border-[oklch(0.58_0.22_255/30%)] rounded hover:bg-[oklch(0.58_0.22_255/30%)] transition-colors">
                      <MessageSquare className="w-2.5 h-2.5" />
                      WhatsApp
                    </button>
                    <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-[oklch(0.22_0.02_255)] text-[oklch(0.6_0.01_240)] rounded hover:bg-[oklch(0.28_0.02_255)] transition-colors">
                      <Bell className="w-2.5 h-2.5" />
                      Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NPS + Survey */}
          <div className="space-y-4">
            <div className="kiai-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">NPS Trend</h3>
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={NPS_TREND}>
                  <XAxis dataKey="month" tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 10 }} axisLine={false} tickLine={false} domain={[35, 60]} />
                  <Tooltip contentStyle={{ background: 'oklch(0.18 0.02 255)', border: '1px solid oklch(0.25 0.02 255)', borderRadius: '8px', fontSize: 11 }} />
                  <Line type="monotone" dataKey="nps" stroke="oklch(0.62 0.18 160)" strokeWidth={2.5} dot={{ fill: 'oklch(0.62 0.18 160)', r: 3 }} name="NPS" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="kiai-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Survey Performance</h3>
              <div className="space-y-2">
                {SURVEY_DATA.map(s => (
                  <div key={s.label} className="flex items-center justify-between text-xs">
                    <span className="text-[oklch(0.7_0.01_240)]">{s.label}</span>
                    <span className="font-bold" style={{ color: s.color }}>{s.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-[oklch(0.22_0.02_255)]">
                <div className="text-xs text-[oklch(0.5_0.01_250)]">Response rate: <span className="text-white font-semibold">67%</span></div>
              </div>
            </div>
          </div>

          {/* Complaint reasons + WhatsApp campaign */}
          <div className="space-y-4">
            <div className="kiai-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3">Complaint Reasons</h3>
              <div className="space-y-2">
                {COMPLAINT_REASONS.map(cr => (
                  <div key={cr.reason}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[oklch(0.7_0.01_240)]">{cr.reason}</span>
                      <span className="font-bold text-white">{cr.count}</span>
                    </div>
                    <div className="h-1.5 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-[oklch(0.62_0.24_25/70%)]" style={{ width: `${(cr.count/31)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Campaign */}
            <div className="kiai-card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[oklch(0.62_0.18_160/20%)] flex items-center justify-center text-xs">💬</div>
                <h3 className="text-sm font-semibold text-white">WhatsApp Campaign</h3>
              </div>
              <textarea
                value={campaignMsg}
                onChange={e => setCampaignMsg(e.target.value)}
                rows={4}
                className="w-full bg-[oklch(0.11_0.015_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-3 py-2 text-xs text-white placeholder-[oklch(0.4_0.01_250)] focus:outline-none focus:border-[oklch(0.58_0.22_255)] transition-colors resize-none mb-3"
              />
              <div className="flex gap-2">
                <select className="flex-1 bg-[oklch(0.11_0.015_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-2 py-1.5 text-xs text-white">
                  <option>All churn risk customers</option>
                  <option>SLA breached claims</option>
                  <option>Post-delivery NPS</option>
                </select>
                <button className="px-3 py-1.5 text-xs font-medium text-white kiai-gradient rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1">
                  <Send className="w-3 h-3" />
                  Send
                </button>
              </div>
              <p className="text-[10px] text-[oklch(0.45_0.01_250)] mt-2">Will send to 17 customers · Templates auto-personalized</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
