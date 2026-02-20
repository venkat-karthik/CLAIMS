"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { MOCK_CLAIMS, type Claim } from "@/lib/data";
import { useRouter } from "next/navigation";
import {
  Search, Filter, AlertTriangle, Clock, Shield, ChevronRight,
  SlidersHorizontal, CheckSquare, Square, ArrowUpDown, Plus, Download
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted", docs_pending: "Docs Pending", in_review: "In Review",
  surveyed: "Surveyed", estimated: "Estimated", approved: "Approved",
  in_repair: "In Repair", invoice_uploaded: "Invoice Uploaded",
  delivered: "Delivered", closed: "Closed", flagged: "Fraud Flagged",
};

const STATUS_CLASS: Record<string, string> = {
  submitted: "status-submitted", docs_pending: "status-submitted", in_review: "status-in-review",
  surveyed: "status-in-review", estimated: "status-in-review", approved: "status-approved",
  in_repair: "status-in-repair", invoice_uploaded: "status-in-repair",
  delivered: "status-approved", closed: "status-closed", flagged: "status-flagged",
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: "oklch(0.62 0.24 25)", high: "oklch(0.72 0.18 85)",
  medium: "oklch(0.58 0.22 255)", low: "oklch(0.5 0.01 250)",
};

const SLA_COLOR: Record<string, string> = {
  ok: "text-[oklch(0.62_0.18_160)]",
  warn: "text-[oklch(0.72_0.18_85)]",
  breach: "text-[oklch(0.62_0.24_25)] font-bold",
};

const FILTERS = ["All", "SLA Breach", "Fraud Flagged", "Pending Approval", "High Value", "Unassigned"];

export default function ClaimsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof Claim>("createdAt");

  const filtered = MOCK_CLAIMS.filter(c => {
    const matchSearch = !search || 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.claimantName.toLowerCase().includes(search.toLowerCase()) ||
      c.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(search.toLowerCase());
    
    const matchFilter = 
      activeFilter === "All" ||
      (activeFilter === "SLA Breach" && c.slaStatus === "breach") ||
      (activeFilter === "Fraud Flagged" && c.fraudFlagged) ||
      (activeFilter === "Pending Approval" && (c.status === "estimated" || c.status === "invoice_uploaded")) ||
      (activeFilter === "High Value" && c.claimAmount >= 100000) ||
      (activeFilter === "Unassigned" && c.assignedTo === "Unassigned");

    return matchSearch && matchFilter;
  });

  const toggleSelect = (id: string) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));
  };

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Claims Inbox</h1>
            <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Work queue — AI-prioritized. Act on what matters now.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[oklch(0.6_0.01_240)] bg-[oklch(0.15_0.018_255)] border border-[oklch(0.22_0.02_255)] rounded-lg hover:border-[oklch(0.35_0.05_255)] transition-colors">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white kiai-gradient rounded-lg hover:opacity-90 transition-opacity">
              <Plus className="w-3.5 h-3.5" />
              New Claim
            </button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total Active", v: "847", c: "oklch(0.58 0.22 255)" },
            { label: "SLA Breach", v: "23", c: "oklch(0.62 0.24 25)" },
            { label: "Fraud Flagged", v: "14", c: "oklch(0.65 0.22 310)" },
            { label: "Pending Approval", v: "41", c: "oklch(0.72 0.18 85)" },
            { label: "Unassigned", v: "8", c: "oklch(0.72 0.14 210)" },
          ].map(s => (
            <button key={s.label} onClick={() => setActiveFilter(s.label === "Total Active" ? "All" : s.label)} className="kiai-card rounded-xl p-3 text-left hover:kiai-glow">
              <div className="text-lg font-bold" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs text-[oklch(0.5_0.01_250)]">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[oklch(0.15_0.018_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-4 py-2.5 focus-within:border-[oklch(0.58_0.22_255)] transition-colors">
            <Search className="w-4 h-4 text-[oklch(0.45_0.01_250)] flex-shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by Claim ID, name, vehicle, policy..."
              className="flex-1 bg-transparent text-sm text-white placeholder-[oklch(0.4_0.01_250)] focus:outline-none"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap border transition-all ${
                  activeFilter === f
                    ? "border-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/20%)] text-[oklch(0.68_0.22_255)]"
                    : "border-[oklch(0.22_0.02_255)] text-[oklch(0.6_0.01_240)] hover:border-[oklch(0.35_0.05_255)] hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk actions */}
        {selected.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-[oklch(0.58_0.22_255/12%)] border border-[oklch(0.58_0.22_255/35%)] rounded-lg">
            <span className="text-xs font-medium text-[oklch(0.68_0.22_255)]">{selected.length} selected</span>
            <div className="flex gap-2 ml-2">
              {["Assign Handler", "Request Docs", "Escalate", "Export"].map(action => (
                <button key={action} className="px-3 py-1.5 text-xs font-medium bg-[oklch(0.58_0.22_255/20%)] text-[oklch(0.68_0.22_255)] border border-[oklch(0.58_0.22_255/40%)] rounded-lg hover:bg-[oklch(0.58_0.22_255/35%)] transition-colors">
                  {action}
                </button>
              ))}
            </div>
            <button onClick={() => setSelected([])} className="ml-auto text-xs text-[oklch(0.5_0.01_250)] hover:text-white transition-colors">
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        <div className="kiai-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[oklch(0.13_0.016_255)] border-b border-[oklch(0.22_0.02_255)]">
                  <th className="p-3 w-10">
                    <button onClick={toggleAll} className="text-[oklch(0.5_0.01_250)] hover:text-white transition-colors">
                      {selected.length === filtered.length && filtered.length > 0
                        ? <CheckSquare className="w-4 h-4" />
                        : <Square className="w-4 h-4" />}
                    </button>
                  </th>
                  <th className="p-3 text-left font-semibold text-[oklch(0.5_0.01_250)] uppercase tracking-wide">Claim</th>
                  <th className="p-3 text-left font-semibold text-[oklch(0.5_0.01_250)] uppercase tracking-wide">Status</th>
                  <th className="p-3 text-left font-semibold text-[oklch(0.5_0.01_250)] uppercase tracking-wide hidden md:table-cell">SLA Timer</th>
                  <th className="p-3 text-left font-semibold text-[oklch(0.5_0.01_250)] uppercase tracking-wide hidden lg:table-cell">Risk</th>
                  <th className="p-3 text-left font-semibold text-[oklch(0.5_0.01_250)] uppercase tracking-wide hidden xl:table-cell">Assigned To</th>
                  <th className="p-3 text-left font-semibold text-[oklch(0.5_0.01_250)] uppercase tracking-wide hidden lg:table-cell">Value</th>
                  <th className="p-3 text-left font-semibold text-[oklch(0.5_0.01_250)] uppercase tracking-wide">Required Action</th>
                  <th className="p-3 w-8" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[oklch(0.18_0.018_255)]">
                {filtered.map(claim => (
                  <tr
                    key={claim.id}
                    className={`hover:bg-[oklch(0.17_0.02_255)] cursor-pointer transition-colors group ${
                      selected.includes(claim.id) ? 'bg-[oklch(0.58_0.22_255/8%)]' : ''
                    }`}
                  >
                    <td className="p-3" onClick={e => { e.stopPropagation(); toggleSelect(claim.id); }}>
                      <div className="text-[oklch(0.5_0.01_250)] hover:text-white transition-colors">
                        {selected.includes(claim.id) ? <CheckSquare className="w-4 h-4 text-[oklch(0.58_0.22_255)]" /> : <Square className="w-4 h-4" />}
                      </div>
                    </td>
                    <td className="p-3" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-5 rounded-full" style={{ background: PRIORITY_COLOR[claim.priority] }} />
                        <div>
                          <div className="font-bold text-white">{claim.id}</div>
                          <div className="text-[oklch(0.6_0.01_240)] mt-0.5">{claim.claimantName}</div>
                          <div className="text-[oklch(0.45_0.01_250)]">{claim.vehicle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border ${STATUS_CLASS[claim.status]}`}>
                        {STATUS_LABELS[claim.status]}
                      </span>
                      {claim.fraudFlagged && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Shield className="w-3 h-3 text-[oklch(0.62_0.24_25)]" />
                          <span className="text-[oklch(0.62_0.24_25)] text-[9px] font-medium">FRAUD FLAG</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3 hidden md:table-cell" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <div className={`flex items-center gap-1.5 ${SLA_COLOR[claim.slaStatus]}`}>
                        <Clock className="w-3 h-3" />
                        <span>{claim.slaDue}</span>
                      </div>
                      {claim.slaStatus === 'breach' && (
                        <div className="text-[9px] text-[oklch(0.62_0.24_25)] mt-0.5 font-medium">⚠ BREACHED</div>
                      )}
                    </td>
                    <td className="p-3 hidden lg:table-cell" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${claim.riskScore}%`,
                            background: claim.riskScore > 70 ? 'oklch(0.62 0.24 25)' : claim.riskScore > 40 ? 'oklch(0.72 0.18 85)' : 'oklch(0.62 0.18 160)'
                          }} />
                        </div>
                        <span className={claim.riskScore > 70 ? 'sla-breach' : claim.riskScore > 40 ? 'sla-warn' : 'sla-ok'}>
                          {claim.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 hidden xl:table-cell" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <span className={claim.assignedTo === "Unassigned" ? "text-[oklch(0.62_0.24_25)]" : "text-[oklch(0.7_0.01_240)]"}>
                        {claim.assignedTo}
                      </span>
                    </td>
                    <td className="p-3 hidden lg:table-cell" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <div className="font-semibold text-white">₹{(claim.claimAmount / 100000).toFixed(1)}L</div>
                      {claim.aiConfidence > 0 && (
                        <div className="text-[10px] text-[oklch(0.5_0.01_250)]">AI: {claim.aiConfidence}% conf.</div>
                      )}
                    </td>
                    <td className="p-3 max-w-[200px]" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <div className={`text-[11px] leading-tight ${
                        claim.priority === 'critical' ? 'text-[oklch(0.62_0.24_25)]' :
                        claim.priority === 'high' ? 'text-[oklch(0.72_0.18_85)]' :
                        'text-[oklch(0.6_0.01_240)]'
                      }`}>
                        {claim.requiredAction}
                      </div>
                    </td>
                    <td className="p-3" onClick={() => router.push(`/claims/${claim.id}`)}>
                      <ChevronRight className="w-4 h-4 text-[oklch(0.4_0.01_250)] group-hover:text-white transition-colors" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-[oklch(0.5_0.01_250)]">
              <Filter className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No claims match your filter</p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-[oklch(0.22_0.02_255)]">
            <span className="text-xs text-[oklch(0.5_0.01_250)]">Showing {filtered.length} of 847 claims</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, "...", 24].map((p, i) => (
                <button key={i} className={`px-2.5 py-1 text-xs rounded ${p === 1 ? 'bg-[oklch(0.58_0.22_255/20%)] text-[oklch(0.68_0.22_255)]' : 'text-[oklch(0.5_0.01_250)] hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
