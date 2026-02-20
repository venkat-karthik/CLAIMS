"use client";

import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { Settings, Sliders, Clock, Shield, Users, Zap, ChevronRight, Plus, Edit2, Toggle, Save } from "lucide-react";

const SLA_RULES = [
  { type: "Motor — Standard", days: 7, warningAt: 80, escalateTo: "Claims Manager" },
  { type: "Motor — High Value (>₹1L)", days: 5, warningAt: 70, escalateTo: "Senior Manager" },
  { type: "Motor — Total Loss", days: 3, warningAt: 60, escalateTo: "Claims Head" },
  { type: "Health — Standard", days: 14, warningAt: 80, escalateTo: "Claims Manager" },
  { type: "Property — Commercial", days: 21, warningAt: 75, escalateTo: "Claims Head" },
];

const APPROVAL_MATRIX = [
  { condition: "Claim amount < ₹25,000", approver: "AI Auto-Approve", threshold: "<25K" },
  { condition: "Claim amount ₹25K - ₹1L", approver: "Claims Handler", threshold: "25K-1L" },
  { condition: "Claim amount ₹1L - ₹5L", approver: "Senior Handler + Manager", threshold: "1L-5L" },
  { condition: "Claim amount > ₹5L", approver: "Claims Head + Finance Sign-off", threshold: ">5L" },
  { condition: "Fraud flagged (any amount)", approver: "SIU + Manager", threshold: "All" },
];

const FRAUD_RULES = [
  { rule: "Invoice deviation > 25%", weight: 25, active: true },
  { rule: "Workshop risk score > 50", weight: 15, active: true },
  { rule: "Same VIN — 3rd claim in 12m", weight: 30, active: true },
  { rule: "Policy inception < 3 months", weight: 10, active: true },
  { rule: "Customer in high-risk zone", weight: 12, active: true },
  { rule: "Night-time incident (no witness)", weight: 8, active: false },
  { rule: "Parts list mismatch with photos", weight: 20, active: true },
];

const AUTO_ASSIGN_RULES = [
  { priority: 1, condition: "Claim region = South", assignTo: "Priya Sharma (South Team)", active: true },
  { priority: 2, condition: "Claim region = North", assignTo: "Rahul Iyer (North Team)", active: true },
  { priority: 3, condition: "Claim value > ₹2L", assignTo: "Senior Handler (Overflow)", active: true },
  { priority: 4, condition: "Fraud flagged = true", assignTo: "Sneha Patel (SIU)", active: true },
  { priority: 5, condition: "All others (fallback)", assignTo: "Auto-balance by workload", active: true },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"sla" | "approval" | "fraud" | "assignment" | "roles">("sla");

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[oklch(0.58_0.22_255)]" />
            Admin & Rules Engine
          </h1>
          <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Configure SLA rules · Approval matrix · Auto-assignment · Fraud thresholds · Permissions</p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[oklch(0.13_0.016_255)] rounded-xl border border-[oklch(0.22_0.02_255)] overflow-x-auto">
          {[
            { id: "sla", label: "SLA Rules", icon: Clock },
            { id: "approval", label: "Approval Matrix", icon: Users },
            { id: "fraud", label: "Fraud Rules", icon: Shield },
            { id: "assignment", label: "Auto-Assignment", icon: Zap },
            { id: "roles", label: "Role Permissions", icon: Users },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[oklch(0.58_0.22_255/20%)] text-white border border-[oklch(0.58_0.22_255/40%)]'
                  : 'text-[oklch(0.6_0.01_240)] hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* SLA Rules */}
        {activeTab === "sla" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">SLA Definitions</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white kiai-gradient rounded-lg">
                <Plus className="w-3.5 h-3.5" /> Add Rule
              </button>
            </div>
            <div className="kiai-card rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[oklch(0.13_0.016_255)] border-b border-[oklch(0.22_0.02_255)] text-[oklch(0.45_0.01_250)] uppercase tracking-wide">
                    <th className="p-4 text-left font-medium">Claim Type</th>
                    <th className="p-4 text-left font-medium">SLA (days)</th>
                    <th className="p-4 text-left font-medium">Warning at %</th>
                    <th className="p-4 text-left font-medium">Escalate to</th>
                    <th className="p-4 text-left font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(0.18_0.018_255)]">
                  {SLA_RULES.map((rule, i) => (
                    <tr key={i} className="hover:bg-[oklch(0.17_0.02_255)] transition-colors">
                      <td className="p-4 font-medium text-white">{rule.type}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-[oklch(0.58_0.22_255/15%)] text-[oklch(0.68_0.22_255)] border border-[oklch(0.58_0.22_255/30%)] rounded-lg font-bold">{rule.days}d</span>
                      </td>
                      <td className="p-4 text-[oklch(0.72_0.18_85)]">{rule.warningAt}%</td>
                      <td className="p-4 text-[oklch(0.6_0.01_240)]">{rule.escalateTo}</td>
                      <td className="p-4">
                        <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-[oklch(0.6_0.01_240)] hover:text-white bg-[oklch(0.22_0.02_255)] rounded hover:bg-[oklch(0.28_0.02_255)] transition-colors">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Approval Matrix */}
        {activeTab === "approval" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Approval Thresholds</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white kiai-gradient rounded-lg">
                <Plus className="w-3.5 h-3.5" /> Add Rule
              </button>
            </div>
            <div className="kiai-card rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[oklch(0.13_0.016_255)] border-b border-[oklch(0.22_0.02_255)] text-[oklch(0.45_0.01_250)] uppercase tracking-wide">
                    <th className="p-4 text-left font-medium">Condition</th>
                    <th className="p-4 text-left font-medium">Approved by</th>
                    <th className="p-4 text-left font-medium" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[oklch(0.18_0.018_255)]">
                  {APPROVAL_MATRIX.map((rule, i) => (
                    <tr key={i} className="hover:bg-[oklch(0.17_0.02_255)] transition-colors">
                      <td className="p-4 font-medium text-white">{rule.condition}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg font-medium border ${
                          rule.approver.includes('AI') ? 'text-[oklch(0.65_0.22_310)] border-[oklch(0.65_0.22_310/40%)] bg-[oklch(0.65_0.22_310/12%)]' :
                          'text-[oklch(0.58_0.22_255)] border-[oklch(0.58_0.22_255/40%)] bg-[oklch(0.58_0.22_255/12%)]'
                        }`}>{rule.approver}</span>
                      </td>
                      <td className="p-4">
                        <button className="flex items-center gap-1 px-2 py-1 text-[10px] text-[oklch(0.6_0.01_240)] hover:text-white bg-[oklch(0.22_0.02_255)] rounded hover:bg-[oklch(0.28_0.02_255)] transition-colors">
                          <Edit2 className="w-3 h-3" /> Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fraud Rules */}
        {activeTab === "fraud" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Fraud Signal Rules & Weights</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[oklch(0.5_0.01_250)]">SIU trigger threshold: <span className="text-white font-bold">70</span></span>
                <button className="px-2.5 py-1 text-xs text-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/12%)] border border-[oklch(0.58_0.22_255/30%)] rounded hover:bg-[oklch(0.58_0.22_255/25%)] transition-colors">Edit</button>
              </div>
            </div>
            <div className="kiai-card rounded-xl p-5 space-y-3">
              {FRAUD_RULES.map((rule, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-[oklch(0.13_0.016_255)] border border-[oklch(0.22_0.02_255)]">
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${rule.active ? 'text-white' : 'text-[oklch(0.5_0.01_250)] line-through'}`}>{rule.rule}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-sm font-bold text-[oklch(0.62_0.24_25)]">+{rule.weight}</div>
                      <div className="text-[10px] text-[oklch(0.45_0.01_250)]">weight</div>
                    </div>
                    <button className={`w-10 h-5 rounded-full transition-colors relative ${rule.active ? 'bg-[oklch(0.58_0.22_255)]' : 'bg-[oklch(0.28_0.02_255)]'}`}>
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[oklch(0.45_0.01_250)]">
              Total possible score: 120. Claims scoring ≥70 are flagged. ≥85 with critical signals → auto-route to SIU.
            </p>
          </div>
        )}

        {/* Auto-Assignment */}
        {activeTab === "assignment" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Auto-Assignment Rules</h3>
              <span className="text-xs text-[oklch(0.5_0.01_250)]">Evaluated in priority order · First match wins</span>
            </div>
            <div className="kiai-card rounded-xl p-5 space-y-3">
              {AUTO_ASSIGN_RULES.map((rule, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-[oklch(0.22_0.02_255)] bg-[oklch(0.13_0.016_255)]">
                  <div className="w-7 h-7 rounded-lg bg-[oklch(0.58_0.22_255/15%)] flex items-center justify-center text-xs font-bold text-[oklch(0.68_0.22_255)] flex-shrink-0">
                    {rule.priority}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white">{rule.condition}</div>
                    <div className="text-[11px] text-[oklch(0.58_0.22_255)] mt-0.5">→ {rule.assignTo}</div>
                  </div>
                  <button className={`w-10 h-5 rounded-full transition-colors relative ${rule.active ? 'bg-[oklch(0.58_0.22_255)]' : 'bg-[oklch(0.28_0.02_255)]'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${rule.active ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Permissions */}
        {activeTab === "roles" && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white">Role Permissions Matrix</h3>
            <div className="kiai-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-[oklch(0.13_0.016_255)] border-b border-[oklch(0.22_0.02_255)]">
                      <th className="p-4 text-left font-medium text-[oklch(0.45_0.01_250)] uppercase tracking-wide">Permission</th>
                      {["Manager", "Handler", "Surveyor", "Workshop", "SIU", "Finance", "Admin"].map(r => (
                        <th key={r} className="p-4 text-center font-medium text-[oklch(0.45_0.01_250)] uppercase tracking-wide">{r}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[oklch(0.18_0.018_255)]">
                    {[
                      { perm: "View all claims", vals: [true, false, false, false, false, false, true] },
                      { perm: "Approve claims", vals: [true, true, false, false, false, false, true] },
                      { perm: "Manage SIU cases", vals: [false, false, false, false, true, false, true] },
                      { perm: "View financials", vals: [true, false, false, false, false, true, true] },
                      { perm: "Workshop portal", vals: [false, false, false, true, false, false, true] },
                      { perm: "Edit rules engine", vals: [false, false, false, false, false, false, true] },
                      { perm: "Export reports", vals: [true, false, false, false, false, true, true] },
                    ].map(row => (
                      <tr key={row.perm} className="hover:bg-[oklch(0.17_0.02_255)] transition-colors">
                        <td className="p-4 font-medium text-white">{row.perm}</td>
                        {row.vals.map((v, i) => (
                          <td key={i} className="p-4 text-center">
                            {v
                              ? <span className="text-[oklch(0.62_0.18_160)] text-base">✓</span>
                              : <span className="text-[oklch(0.3_0.01_250)] text-sm">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
