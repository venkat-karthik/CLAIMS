"use client";

import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { GitBranch, ChevronRight, Brain, Shield, Wrench, Users, Zap, RefreshCw, Sparkles } from "lucide-react";

const FLOWCHARTS = [
  {
    id: "high-value",
    title: "High-Value Claim (>₹1L) Workflow",
    category: "Approval",
    description: "How high-value claims are triaged, estimated, and approved",
    icon: "💰",
    steps: [
      { label: "FNOL Received", type: "start", detail: "Auto-intake via form/API/call center" },
      { label: "Doc Completeness Check", type: "auto", detail: "AI scanner validates required docs — 15 sec" },
      { label: "Claim Value > ₹1L?", type: "decision", detail: "Threshold from SLA rules engine" },
      { label: "AI Estimation (Full)", type: "ai", detail: "AI generates estimate — parts + labor + benchmark" },
      { label: "Confidence >= 80%?", type: "decision", detail: "Below 80% triggers human review" },
      { label: "AI Auto-Approve", type: "auto", detail: "Instant approval — no human needed" },
      { label: "Manager Review Queue", type: "manual", detail: "Senior handler reviews in <2 hours" },
      { label: "Approved → Workshop Assignment", type: "auto", detail: "Best workshop assigned by region + load + rating" },
      { label: "SLA Clock Starts", type: "auto", detail: "Countdown begins. Escalation rules armed." },
    ],
  },
  {
    id: "fraud-flag",
    title: "Fraud Flag → SIU Routing",
    category: "Fraud",
    description: "What happens when the fraud engine triggers a signal",
    icon: "🛡️",
    steps: [
      { label: "AI Fraud Score Calculated", type: "ai", detail: "Multi-signal scoring on every claim event" },
      { label: "Score > 70?", type: "decision", detail: "Threshold from rules engine (configurable)" },
      { label: "Flag Added to Claim", type: "auto", detail: "Badge appears on claim + handler notified" },
      { label: "Critical Signals (>2)?", type: "decision", detail: "Critical = invoice deviation, VIN repeat, etc." },
      { label: "Auto-route to SIU", type: "auto", detail: "Evidence pack compiled — investigator assigned" },
      { label: "Handler Review First", type: "manual", detail: "Handler verifies before SIU escalation" },
      { label: "SIU Investigation Opens", type: "manual", detail: "Investigator reviews evidence, contacts workshop" },
      { label: "Outcome: Confirmed / Cleared", type: "decision", detail: "Outcome feeds AI learning loop" },
      { label: "AI Model Updated", type: "ai", detail: "False positive/negative rates recalibrate" },
    ],
  },
  {
    id: "invoice-deviation",
    title: "Invoice Deviation Escalation",
    category: "Finance",
    description: "Auto-validation of repair invoices against AI estimates",
    icon: "📊",
    steps: [
      { label: "Workshop Uploads Invoice", type: "manual", detail: "Via workshop portal — timestamped" },
      { label: "AI vs Invoice Comparison", type: "ai", detail: "Line-item comparison against estimate" },
      { label: "Deviation < 10%?", type: "decision", detail: "Within tolerance — auto-approved" },
      { label: "Auto-Approve + Payout", type: "auto", detail: "Finance team notified — payout scheduled" },
      { label: "Deviation 10-25%?", type: "decision", detail: "Moderate deviation — handler review" },
      { label: "Handler Flags Items", type: "manual", detail: "Handler reviews line items, contacts workshop" },
      { label: "Deviation > 25%?", type: "decision", detail: "High deviation — fraud signal triggered" },
      { label: "Fraud Score Boost +15", type: "auto", detail: "Claim re-scored — may trigger SIU route" },
      { label: "Finance Approval Required", type: "manual", detail: "Finance team approves adjusted amount" },
    ],
  },
  {
    id: "repair-sla",
    title: "Repair SLA & Escalation",
    category: "Operations",
    description: "How repair timelines are monitored and escalated",
    icon: "⏱️",
    steps: [
      { label: "Workshop Assigned", type: "auto", detail: "Job card created — SLA clock starts" },
      { label: "Day 1: Repair Starts", type: "manual", detail: "Workshop confirms start in portal" },
      { label: "Daily Status Check (Auto)", type: "auto", detail: "System polls repair stage every 24h" },
      { label: "Parts Delay Reported?", type: "decision", detail: "Workshop adds reason code — SLA paused" },
      { label: "SLA Pause + Customer Notified", type: "auto", detail: "Customer gets WhatsApp update" },
      { label: "80% of SLA Elapsed?", type: "decision", detail: "Warning triggers at 80%" },
      { label: "Handler Warned (In-app alert)", type: "auto", detail: "Handler sees amber SLA badge" },
      { label: "100% SLA Elapsed", type: "decision", detail: "Breach threshold crossed" },
      { label: "Auto-Escalate to Manager", type: "auto", detail: "Manager email + dashboard alert. SLA badge turns red." },
    ],
  },
];

const STEP_STYLES: Record<string, { border: string; bg: string; text: string; badge: string; badgeText: string }> = {
  start: { border: "oklch(0.62 0.18 160)", bg: "oklch(0.62 0.18 160 / 12%)", text: "oklch(0.62 0.18 160)", badge: "oklch(0.62 0.18 160 / 20%)", badgeText: "oklch(0.62 0.18 160)" },
  auto: { border: "oklch(0.58 0.22 255)", bg: "oklch(0.58 0.22 255 / 8%)", text: "oklch(0.68 0.22 255)", badge: "oklch(0.58 0.22 255 / 15%)", badgeText: "oklch(0.68 0.22 255)" },
  ai: { border: "oklch(0.65 0.22 310)", bg: "oklch(0.65 0.22 310 / 8%)", text: "oklch(0.75 0.22 310)", badge: "oklch(0.65 0.22 310 / 15%)", badgeText: "oklch(0.75 0.22 310)" },
  manual: { border: "oklch(0.72 0.18 85)", bg: "oklch(0.72 0.18 85 / 8%)", text: "oklch(0.72 0.18 85)", badge: "oklch(0.72 0.18 85 / 15%)", badgeText: "oklch(0.72 0.18 85)" },
  decision: { border: "oklch(0.72 0.14 210)", bg: "oklch(0.72 0.14 210 / 8%)", text: "oklch(0.72 0.14 210)", badge: "oklch(0.72 0.14 210 / 15%)", badgeText: "oklch(0.72 0.14 210)" },
};

const TYPE_LABELS: Record<string, string> = {
  start: "Start", auto: "⚡ Auto", ai: "🧠 AI", manual: "👤 Manual", decision: "◇ Decision"
};

const AI_EXPLANATIONS: Record<string, string> = {
  "high-value": "For claims exceeding ₹1,00,000, the system mandates a full AI estimation before any approval. When AI confidence is high (≥80%), auto-approval kicks in — no handler time spent. Below 80% confidence (complex damage, rare parts), a senior manager reviews within the SLA window. This alone removes ~40% of manual approval decisions from the queue.",
  "fraud-flag": "Every event on a claim re-scores its fraud probability using 23 signals (invoice, workshop history, customer zip risk, VIN, policy tenure, etc.). A score above 70 triggers visible flagging. Above that, critical signals (like workshop collusion patterns) auto-route to SIU with a pre-compiled evidence pack. Investigator outcome feeds the model — so KiAI Claims learns from every case.",
  "invoice-deviation": "When a workshop uploads an invoice, KiAI's AI compares every line item against the AI estimate AND historical benchmarks for that vehicle type + region. Deviations under 10% auto-approve (removing ~62% of invoice reviews). Between 10-25%, a handler reviews the flagged items. Above 25%, fraud scoring is automatically boosted and finance sign-off is required.",
  "repair-sla": "Every assigned repair starts an SLA clock based on vehicle type and claim category. The system polls workshop status daily. Parts delays auto-pause the SLA and notify the customer. At 80% elapsed, the handler sees a warning. At 100%, the manager is auto-escalated — no manual tracking. This has reduced SLA breaches by 34% in pilot deployments.",
};

export default function FlowchartsPage() {
  const [selected, setSelected] = useState("high-value");
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const chart = FLOWCHARTS.find(f => f.id === selected)!;

  const handleAskAI = () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    setTimeout(() => {
      setAiResponse(`Based on KiAI Claims operational rules:\n\n**Query:** "${aiQuery}"\n\n**Answer:** When a claim meets multiple escalation criteria simultaneously — SLA breach AND fraud flag — the system prioritizes SIU routing first. The claim handler is notified via in-app alert. The SLA clock continues (escalation does not pause it). The manager receives a consolidated alert every 4 hours on combined breach+fraud cases. All actions are logged in the audit trail.\n\n**Related Workflow:** Fraud Flag → SIU Routing (see sidebar)`);
      setAiLoading(false);
    }, 1500);
  };

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[oklch(0.65_0.22_310)]" />
              Flowcharts & SOPs
            </h1>
            <p className="text-sm text-[oklch(0.5_0.01_250)] mt-0.5">Visual workflows · Role-based SOPs · AI-explained processes · Perplexity-powered</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.65_0.22_310/12%)] border border-[oklch(0.65_0.22_310/30%)]">
            <Sparkles className="w-3.5 h-3.5 text-[oklch(0.75_0.22_310)]" />
            <span className="text-xs font-medium text-[oklch(0.75_0.22_310)]">Perplexity AI Powered</span>
          </div>
        </div>

        {/* AI Ask box */}
        <div className="kiai-card rounded-xl p-5 border-[oklch(0.65_0.22_310/30%)]" style={{ borderColor: 'oklch(0.65 0.22 310 / 30%)' }}>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-[oklch(0.65_0.22_310)]" />
            <h3 className="text-sm font-semibold text-white">Ask about any workflow</h3>
          </div>
          <div className="flex gap-2">
            <input
              value={aiQuery}
              onChange={e => setAiQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAI()}
              placeholder='e.g. "What happens when a claim has both SLA breach and fraud flag?" or "Who approves claims > ₹5L?"'
              className="flex-1 bg-[oklch(0.11_0.015_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[oklch(0.4_0.01_250)] focus:outline-none focus:border-[oklch(0.65_0.22_310)] transition-colors"
            />
            <button
              onClick={handleAskAI}
              disabled={aiLoading || !aiQuery.trim()}
              className="px-4 py-2.5 text-sm font-medium text-white bg-[oklch(0.65_0.22_310/25%)] border border-[oklch(0.65_0.22_310/50%)] rounded-lg hover:bg-[oklch(0.65_0.22_310/40%)] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Ask
            </button>
          </div>
          {aiResponse && (
            <div className="mt-4 p-4 bg-[oklch(0.65_0.22_310/8%)] border border-[oklch(0.65_0.22_310/25%)] rounded-lg">
              <div className="text-xs text-[oklch(0.75_0.22_310)] leading-relaxed whitespace-pre-wrap">{aiResponse}</div>
            </div>
          )}
          <div className="flex gap-2 mt-3 flex-wrap">
            {["Who approves high-value claims?", "What triggers SIU routing?", "How is AI confidence calculated?"].map(q => (
              <button key={q} onClick={() => setAiQuery(q)} className="px-2.5 py-1 text-[10px] bg-[oklch(0.18_0.02_255)] text-[oklch(0.6_0.01_240)] border border-[oklch(0.25_0.02_255)] rounded-full hover:text-white hover:border-[oklch(0.65_0.22_310/50%)] transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Chart selector */}
          <div className="lg:col-span-1 kiai-card rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[oklch(0.22_0.02_255)]">
              <h3 className="text-xs font-semibold text-[oklch(0.7_0.01_240)] uppercase tracking-wide">Workflow Library</h3>
            </div>
            <div className="divide-y divide-[oklch(0.18_0.018_255)]">
              {FLOWCHARTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f.id)}
                  className={`w-full p-4 text-left transition-all ${selected === f.id ? 'bg-[oklch(0.65_0.22_310/10%)] border-l-2 border-[oklch(0.65_0.22_310)]' : 'hover:bg-[oklch(0.17_0.02_255)]'}`}
                >
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-xs font-semibold text-white mb-0.5">{f.title}</div>
                  <div className="text-[10px] text-[oklch(0.45_0.01_250)]">{f.category} · {f.steps.length} steps</div>
                </button>
              ))}
            </div>
          </div>

          {/* Flowchart visualization */}
          <div className="lg:col-span-3 space-y-4">
            <div className="kiai-card rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{chart.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{chart.title}</h3>
                  <p className="text-xs text-[oklch(0.5_0.01_250)]">{chart.description}</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-5">
                {Object.entries(TYPE_LABELS).map(([type, label]) => {
                  const s = STEP_STYLES[type];
                  return (
                    <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-medium border" style={{ borderColor: `${s.border}/40%`, background: s.bg, color: s.text }}>
                      {label}
                    </div>
                  );
                })}
              </div>

              {/* Steps as vertical flowchart */}
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-[oklch(0.22_0.02_255)]" />
                <div className="space-y-3">
                  {chart.steps.map((step, i) => {
                    const s = STEP_STYLES[step.type];
                    return (
                      <div key={i} className="flex gap-4 items-start pl-12 relative">
                        {/* Connector + Node number */}
                        <div className="absolute left-3 top-3 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10"
                          style={{ borderColor: s.border, background: `oklch(0.11 0.015 255)`, color: s.text }}>
                          {i + 1}
                        </div>
                        {/* Arrow from node */}
                        <div className="absolute left-10 top-5 w-2 h-px" style={{ background: s.border, opacity: 0.6 }} />

                        <div className="flex-1 p-3 rounded-xl border" style={{ borderColor: `${s.border}`, borderOpacity: 0.4, background: s.bg }}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold" style={{ color: s.text }}>{step.label}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: s.badge, color: s.badgeText }}>
                              {TYPE_LABELS[step.type]}
                            </span>
                          </div>
                          <p className="text-[11px] text-[oklch(0.6_0.01_240)] mt-1">{step.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI SOP Explanation */}
            <div className="kiai-card rounded-xl p-5 border-[oklch(0.65_0.22_310/30%)]" style={{ borderColor: 'oklch(0.65 0.22 310 / 25%)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[oklch(0.65_0.22_310)]" />
                <h4 className="text-sm font-semibold text-white">AI Explanation — Why this workflow exists</h4>
              </div>
              <p className="text-sm text-[oklch(0.7_0.01_240)] leading-relaxed">{AI_EXPLANATIONS[selected]}</p>
              <div className="mt-3 text-[10px] text-[oklch(0.45_0.01_250)]">Generated by Perplexity AI · Based on KiAI Claims operational configuration · Last updated Feb 2026</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
