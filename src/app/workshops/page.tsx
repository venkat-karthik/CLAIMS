"use client";

import { AppShell } from "@/components/app-shell";
import { WORKSHOP_PERFORMANCE } from "@/lib/data";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Star, TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle2, Upload, Calendar, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const WORKSHOP_JOBS = [
  { id: "JOB-1024", claim: "CLM-2024-0894", customer: "Ananya Iyer", vehicle: "Toyota Innova", stage: "In Repair", day: "Day 4/7", onTrack: true },
  { id: "JOB-1023", claim: "CLM-2024-0896", customer: "Lakshmi Venkat", vehicle: "Tata Nexon", stage: "Pending Start", day: "Scheduled Feb 21", onTrack: true },
  { id: "JOB-1019", claim: "CLM-2024-0884", customer: "Mohan Das", vehicle: "Hyundai i20", stage: "Invoice Uploaded", day: "Completed", onTrack: true },
  { id: "JOB-1015", claim: "CLM-2024-0879", customer: "Rekha Nair", vehicle: "Honda Amaze", stage: "Parts Delayed", day: "Day 9/7 ⚠", onTrack: false },
];

const MONTHLY_DATA = [
  { month: "Oct", jobs: 19, onTime: 84 },
  { month: "Nov", jobs: 22, onTime: 89 },
  { month: "Dec", jobs: 28, onTime: 91 },
  { month: "Jan", jobs: 31, onTime: 87 },
  { month: "Feb", jobs: 23, onTime: 87 },
];

export default function WorkshopsPage() {
  const [selected, setSelected] = useState<string | null>(WORKSHOP_PERFORMANCE[0].name);
  const router = useRouter();
  const ws = WORKSHOP_PERFORMANCE.find(w => w.name === selected) || WORKSHOP_PERFORMANCE[0];

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">Workshop Intelligence</h1>
          <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Performance tracking · Job management · Invoice validation · Risk scoring</p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Active Workshops", v: "24", c: "oklch(0.58 0.22 255)" },
            { label: "Jobs In Progress", v: "198", c: "oklch(0.65 0.22 310)" },
            { label: "Avg On-Time Rate", v: "86%", c: "oklch(0.62 0.18 160)" },
            { label: "High-Risk Workshops", v: "3", c: "oklch(0.62 0.24 25)" },
          ].map(s => (
            <div key={s.label} className="kiai-card rounded-xl p-3">
              <div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-[oklch(0.5_0.01_250)]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Workshop list */}
          <div className="lg:col-span-2 kiai-card rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[oklch(0.22_0.02_255)]">
              <h3 className="text-sm font-semibold text-white">All Workshops</h3>
            </div>
            <div className="divide-y divide-[oklch(0.18_0.018_255)]">
              {WORKSHOP_PERFORMANCE.map(w => (
                <button
                  key={w.name}
                  onClick={() => setSelected(w.name)}
                  className={`w-full p-4 text-left transition-all ${selected === w.name ? 'bg-[oklch(0.58_0.22_255/10%)] border-l-2 border-[oklch(0.58_0.22_255)]' : 'hover:bg-[oklch(0.17_0.02_255)]'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white truncate max-w-[160px]">{w.name}</span>
                    <span className={`text-[10px] font-bold ${w.riskScore > 50 ? 'text-[oklch(0.62_0.24_25)]' : w.riskScore > 25 ? 'text-[oklch(0.72_0.18_85)]' : 'text-[oklch(0.62_0.18_160)]'}`}>
                      Risk: {w.riskScore}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[oklch(0.6_0.01_240)]">
                    <span className="flex items-center gap-1"><Wrench className="w-3 h-3" />{w.jobs} jobs</span>
                    <span className={w.onTime >= 90 ? 'text-[oklch(0.62_0.18_160)]' : w.onTime >= 75 ? 'text-[oklch(0.72_0.18_85)]' : 'text-[oklch(0.62_0.24_25)]'}>
                      {w.onTime}% on-time
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-2.5 h-2.5 ${s <= Math.floor(w.rating) ? 'text-[oklch(0.72_0.18_85)] fill-current' : 'text-[oklch(0.3_0.01_250)]'}`} />
                    ))}
                    <span className="text-[10px] text-[oklch(0.5_0.01_250)] ml-1">{w.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Workshop detail */}
          <div className="lg:col-span-3 space-y-4">
            <div className="kiai-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">{ws.name}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className={`w-3 h-3 ${s <= Math.floor(ws.rating) ? 'text-[oklch(0.72_0.18_85)] fill-current' : 'text-[oklch(0.3_0.01_250)]'}`} />
                    ))}
                    <span className="text-xs text-[oklch(0.5_0.01_250)] ml-1">{ws.rating} · 127 reviews</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  ws.riskScore > 50 ? 'text-[oklch(0.62_0.24_25)] border-[oklch(0.62_0.24_25/40%)] bg-[oklch(0.62_0.24_25/15%)]' :
                  ws.riskScore > 25 ? 'text-[oklch(0.72_0.18_85)] border-[oklch(0.72_0.18_85/40%)] bg-[oklch(0.72_0.18_85/15%)]' :
                  'text-[oklch(0.62_0.18_160)] border-[oklch(0.62_0.18_160/40%)] bg-[oklch(0.62_0.18_160/15%)]'
                }`}>
                  Risk Score: {ws.riskScore}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Active Jobs", v: ws.jobs, c: "oklch(0.58 0.22 255)" },
                  { label: "On-Time", v: `${ws.onTime}%`, c: ws.onTime >= 90 ? "oklch(0.62 0.18 160)" : "oklch(0.72 0.18 85)" },
                  { label: "Avg Job Cost", v: `₹${Math.round(ws.avgCost/1000)}K`, c: "oklch(0.72 0.14 210)" },
                  { label: "Cost Deviation", v: `+${ws.deviation}%`, c: ws.deviation > 15 ? "oklch(0.62 0.24 25)" : "oklch(0.62 0.18 160)" },
                ].map(m => (
                  <div key={m.label} className="p-3 bg-[oklch(0.11_0.015_255)] rounded-lg text-center">
                    <div className="text-base font-bold" style={{ color: m.c }}>{m.v}</div>
                    <div className="text-[10px] text-[oklch(0.5_0.01_250)]">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_DATA}>
                    <XAxis dataKey="month" tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'oklch(0.45 0.01 250)', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: 'oklch(0.18 0.02 255)', border: '1px solid oklch(0.25 0.02 255)', borderRadius: '8px', fontSize: 11 }} />
                    <Bar dataKey="jobs" name="Jobs" fill="oklch(0.58 0.22 255)" radius={[3,3,0,0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Active Jobs */}
            <div className="kiai-card rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3">Active Jobs</h4>
              <div className="space-y-2">
                {WORKSHOP_JOBS.map(job => (
                  <div key={job.id} className={`flex items-center gap-3 p-3 rounded-lg border ${job.onTrack ? 'border-[oklch(0.22_0.02_255)] bg-[oklch(0.13_0.016_255)]' : 'border-[oklch(0.62_0.24_25/30%)] bg-[oklch(0.62_0.24_25/8%)]'}`}>
                    {job.onTrack ? <CheckCircle2 className="w-4 h-4 text-[oklch(0.62_0.18_160)]" /> : <AlertTriangle className="w-4 h-4 text-[oklch(0.62_0.24_25)]" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{job.id}</span>
                        <span className="text-[10px] text-[oklch(0.5_0.01_250)]">{job.claim}</span>
                      </div>
                      <div className="text-xs text-[oklch(0.6_0.01_240)]">{job.customer} · {job.vehicle}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-xs font-medium ${!job.onTrack ? 'text-[oklch(0.62_0.24_25)]' : 'text-[oklch(0.58_0.22_255)]'}`}>{job.stage}</div>
                      <div className="text-[10px] text-[oklch(0.45_0.01_250)]">{job.day}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload actions (Workshop partner view) */}
            <div className="kiai-card rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3">Workshop Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Upload Estimate", icon: Upload, color: "oklch(0.58 0.22 255)" },
                  { label: "Upload Invoice", icon: Upload, color: "oklch(0.65 0.22 310)" },
                  { label: "Add Delay Reason", icon: AlertTriangle, color: "oklch(0.72 0.18 85)" },
                  { label: "Schedule Delivery", icon: Calendar, color: "oklch(0.62 0.18 160)" },
                ].map(a => (
                  <button key={a.label} className="flex items-center gap-2 p-3 rounded-lg border border-[oklch(0.22_0.02_255)] hover:border-[oklch(0.35_0.05_255)] hover:bg-[oklch(0.17_0.02_255)] transition-all text-left">
                    <a.icon className="w-4 h-4 flex-shrink-0" style={{ color: a.color }} />
                    <span className="text-xs font-medium text-white">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
