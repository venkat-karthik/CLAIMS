"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useRouter } from "next/navigation";
import {
  Shield, AlertTriangle, Clock, CheckCircle2, XCircle,
  ChevronRight, FileText, Camera, BarChart3, Target, Eye
} from "lucide-react";

const FRAUD_CASES = [
  {
    id: "SIU-2024-0042", claimId: "CLM-2024-0891", claimant: "Deepak Nair",
    vehicle: "Honda City DL-01-AB-1234", riskScore: 87, status: "active",
    flags: ["Invoice deviation 50%", "Workshop risk", "High-risk zone"],
    assignedSIU: "Sneha Patel", openedAt: "Feb 16, 2024",
    claimAmount: 210000, estimatedFraud: 73000, stage: "Investigation",
  },
  {
    id: "SIU-2024-0041", claimId: "CLM-2024-0897", claimant: "Chirag Patel",
    vehicle: "Kia Seltos GJ-01-MN-6789", riskScore: 72, status: "active",
    flags: ["Invoice deviation 48%", "Parts list mismatch"],
    assignedSIU: "Sneha Patel", openedAt: "Feb 14, 2024",
    claimAmount: 138000, estimatedFraud: 46000, stage: "Evidence Collection",
  },
  {
    id: "SIU-2024-0039", claimId: "CLM-2024-0881", claimant: "Ramesh Pillai",
    vehicle: "Maruti Brezza MH-09-PQ-4512", riskScore: 91, status: "confirmed",
    flags: ["Same VIN 3rd claim", "FIR inconsistency", "Workshop collusion"],
    assignedSIU: "Sneha Patel", openedAt: "Feb 10, 2024",
    claimAmount: 185000, estimatedFraud: 185000, stage: "Confirmed Fraud",
  },
  {
    id: "SIU-2024-0038", claimId: "CLM-2024-0879", claimant: "Preethi Nambiar",
    vehicle: "Toyota Fortuner KL-07-RS-8891", riskScore: 65, status: "cleared",
    flags: ["High value claim", "Night incident"],
    assignedSIU: "Rahul Iyer", openedAt: "Feb 08, 2024",
    claimAmount: 420000, estimatedFraud: 0, stage: "Cleared — Genuine",
  },
  {
    id: "SIU-2024-0036", claimId: "CLM-2024-0875", claimant: "Sanjay Mehta",
    vehicle: "BMW X5 DL-3C-UV-2341", riskScore: 78, status: "reviewing",
    flags: ["Rapid re-registration", "Invoice parts inflated"],
    assignedSIU: "Sneha Patel", openedAt: "Feb 05, 2024",
    claimAmount: 580000, estimatedFraud: 120000, stage: "Manager Review",
  },
];

const EVIDENCE_ITEMS = [
  { label: "Accident Photos", count: 6, status: "collected" },
  { label: "Workshop Records", count: 3, status: "requested" },
  { label: "Bank Statements", count: 0, status: "requested" },
  { label: "FIR Document", count: 1, status: "collected" },
  { label: "Repair Invoice", count: 1, status: "collected" },
  { label: "Witness Statements", count: 0, status: "pending" },
];

const STATUS_STYLE: Record<string, string> = {
  active: "text-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/15%)] border-[oklch(0.58_0.22_255/35%)]",
  confirmed: "text-[oklch(0.62_0.24_25)] bg-[oklch(0.62_0.24_25/15%)] border-[oklch(0.62_0.24_25/35%)]",
  cleared: "text-[oklch(0.62_0.18_160)] bg-[oklch(0.62_0.18_160/15%)] border-[oklch(0.62_0.18_160/35%)]",
  reviewing: "text-[oklch(0.72_0.18_85)] bg-[oklch(0.72_0.18_85/15%)] border-[oklch(0.72_0.18_85/35%)]",
};

export default function FraudPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(FRAUD_CASES[0].id);

  const selectedCase = FRAUD_CASES.find(c => c.id === selected);

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-[oklch(0.62_0.24_25)]" />
              Fraud / SIU Case Management
            </h1>
            <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Active investigations · Evidence tracking · Outcome feedback loop</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "AI Flagged", v: 47, c: "oklch(0.72 0.18 85)" },
            { label: "SIU Active", v: 8, c: "oklch(0.58 0.22 255)" },
            { label: "Confirmed Fraud", v: 3, c: "oklch(0.62 0.24 25)" },
            { label: "Cleared", v: 22, c: "oklch(0.62 0.18 160)" },
            { label: "Leakage Saved", v: "₹18.4L", c: "oklch(0.65 0.22 310)" },
          ].map(s => (
            <div key={s.label} className="kiai-card rounded-xl p-3">
              <div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-[oklch(0.5_0.01_250)]">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Case list */}
          <div className="lg:col-span-2 kiai-card rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[oklch(0.22_0.02_255)]">
              <h3 className="text-sm font-semibold text-white">Fraud Queue</h3>
            </div>
            <div className="divide-y divide-[oklch(0.18_0.018_255)]">
              {FRAUD_CASES.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={`w-full p-4 text-left transition-all ${selected === c.id ? 'bg-[oklch(0.58_0.22_255/10%)] border-l-2 border-[oklch(0.58_0.22_255)]' : 'hover:bg-[oklch(0.17_0.02_255)]'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{c.id}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${STATUS_STYLE[c.status]}`}>
                      {c.stage}
                    </span>
                  </div>
                  <div className="text-xs text-[oklch(0.6_0.01_240)]">{c.claimant} · {c.claimId}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-14 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${c.riskScore}%`,
                          background: c.riskScore > 80 ? 'oklch(0.62 0.24 25)' : 'oklch(0.72 0.18 85)'
                        }} />
                      </div>
                      <span className={`text-[10px] font-bold ${c.riskScore > 80 ? 'text-[oklch(0.62_0.24_25)]' : 'text-[oklch(0.72_0.18_85)]'}`}>{c.riskScore}</span>
                    </div>
                    <span className="text-[10px] text-[oklch(0.45_0.01_250)]">₹{(c.claimAmount/100000).toFixed(1)}L claim</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {c.flags.slice(0, 2).map(f => (
                      <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-[oklch(0.62_0.24_25/15%)] text-[oklch(0.75_0.24_25)] border border-[oklch(0.62_0.24_25/25%)]">{f}</span>
                    ))}
                    {c.flags.length > 2 && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[oklch(0.22_0.02_255)] text-[oklch(0.5_0.01_250)]">+{c.flags.length-2}</span>}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Case detail */}
          {selectedCase && (
            <div className="lg:col-span-3 space-y-4">
              <div className="kiai-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-white">{selectedCase.id}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLE[selectedCase.status]}`}>
                        {selectedCase.stage}
                      </span>
                    </div>
                    <div className="text-xs text-[oklch(0.6_0.01_240)]">{selectedCase.claimant} · {selectedCase.vehicle}</div>
                    <div className="text-[10px] text-[oklch(0.45_0.01_250)] mt-0.5">
                      Opened: {selectedCase.openedAt} · Investigator: {selectedCase.assignedSIU}
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/claims/${selectedCase.claimId}`)}
                    className="flex items-center gap-1 text-xs text-[oklch(0.58_0.22_255)] hover:underline"
                  >
                    View Claim <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="p-3 bg-[oklch(0.11_0.015_255)] rounded-lg">
                    <div className="text-[10px] text-[oklch(0.45_0.01_250)] mb-1">Claim Amount</div>
                    <div className="text-base font-bold text-white">₹{(selectedCase.claimAmount/100000).toFixed(1)}L</div>
                  </div>
                  <div className="p-3 bg-[oklch(0.11_0.015_255)] rounded-lg">
                    <div className="text-[10px] text-[oklch(0.45_0.01_250)] mb-1">Est. Fraud Value</div>
                    <div className="text-base font-bold text-[oklch(0.62_0.24_25)]">
                      {selectedCase.estimatedFraud > 0 ? `₹${(selectedCase.estimatedFraud/100000).toFixed(1)}L` : "—"}
                    </div>
                  </div>
                  <div className="p-3 bg-[oklch(0.11_0.015_255)] rounded-lg">
                    <div className="text-[10px] text-[oklch(0.45_0.01_250)] mb-1">Risk Score</div>
                    <div className="text-base font-bold text-[oklch(0.62_0.24_25)]">{selectedCase.riskScore}/100</div>
                  </div>
                </div>

                <h4 className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-wide mb-2">Triggered Signals</h4>
                <div className="space-y-1.5 mb-4">
                  {selectedCase.flags.map((flag, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[oklch(0.62_0.24_25/8%)] border border-[oklch(0.62_0.24_25/20%)]">
                      <AlertTriangle className="w-3.5 h-3.5 text-[oklch(0.62_0.24_25)] flex-shrink-0" />
                      <span className="text-xs text-white">{flag}</span>
                    </div>
                  ))}
                </div>

                {/* Evidence Pack */}
                <h4 className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-wide mb-2">Evidence Pack (Auto-compiled)</h4>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {EVIDENCE_ITEMS.map(item => (
                    <div key={item.label} className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                      item.status === 'collected' ? 'border-[oklch(0.62_0.18_160/30%)] bg-[oklch(0.62_0.18_160/8%)]' :
                      item.status === 'requested' ? 'border-[oklch(0.72_0.18_85/30%)] bg-[oklch(0.72_0.18_85/8%)]' :
                      'border-[oklch(0.35_0.01_250/30%)] bg-[oklch(0.15_0.018_255)]'
                    }`}>
                      {item.status === 'collected' ? <CheckCircle2 className="w-3 h-3 text-[oklch(0.62_0.18_160)]" /> :
                       item.status === 'requested' ? <Clock className="w-3 h-3 text-[oklch(0.72_0.18_85)]" /> :
                       <XCircle className="w-3 h-3 text-[oklch(0.5_0.01_250)]" />}
                      <div>
                        <div className="text-[11px] font-medium text-white">{item.label}</div>
                        <div className={`text-[10px] ${item.status === 'collected' ? 'text-[oklch(0.62_0.18_160)]' : item.status === 'requested' ? 'text-[oklch(0.72_0.18_85)]' : 'text-[oklch(0.5_0.01_250)]'}`}>
                          {item.status === 'collected' ? `${item.count} item${item.count > 1 ? 's' : ''}` : item.status === 'requested' ? 'Requested' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Investigation notes */}
                <h4 className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-wide mb-2">Investigation Notes</h4>
                <div className="space-y-2 mb-4">
                  {[
                    { note: "Invoice shows 3 items not present in survey photos (front bumper assembly, side skirt R, LED DRL set). Total excess: ₹67,000.", by: "Sneha Patel", time: "Feb 16, 11:30 AM" },
                    { note: "Workshop SpeedAuto Ahmedabad flagged in 2 prior fraud cases (SIU-2023-0031, SIU-2023-0018). Pattern noted.", by: "System Auto-link", time: "Feb 16, 11:01 AM" },
                  ].map((n, i) => (
                    <div key={i} className="p-3 rounded-lg bg-[oklch(0.13_0.016_255)] border border-[oklch(0.22_0.02_255)]">
                      <p className="text-xs text-[oklch(0.7_0.01_240)]">{n.note}</p>
                      <div className="text-[10px] text-[oklch(0.45_0.01_250)] mt-1">{n.by} · {n.time}</div>
                    </div>
                  ))}
                </div>

                {/* Outcome Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="py-2.5 text-xs font-semibold bg-[oklch(0.62_0.24_25/20%)] text-[oklch(0.75_0.24_25)] border border-[oklch(0.62_0.24_25/40%)] rounded-lg hover:bg-[oklch(0.62_0.24_25/35%)] transition-colors">
                    Mark Confirmed Fraud
                  </button>
                  <button className="py-2.5 text-xs font-semibold bg-[oklch(0.62_0.18_160/20%)] text-[oklch(0.62_0.18_160)] border border-[oklch(0.62_0.18_160/40%)] rounded-lg hover:bg-[oklch(0.62_0.18_160/35%)] transition-colors">
                    Mark Cleared — Genuine
                  </button>
                </div>
                <p className="text-[10px] text-[oklch(0.45_0.01_250)] mt-2 text-center">
                  Outcome feeds AI learning loop — improves future fraud detection
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
