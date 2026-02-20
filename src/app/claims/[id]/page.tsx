"use client";

import { AppShell } from "@/components/app-shell";
import { MOCK_CLAIMS } from "@/lib/data";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, CheckCircle2, Clock, AlertTriangle, Shield, FileText,
  Brain, MessageSquare, ChevronRight, Upload, Download, User, Car,
  Phone, Mail, MapPin, Calendar, TrendingUp, ExternalLink, ThumbsUp, ThumbsDown
} from "lucide-react";

const TIMELINE_EVENTS = [
  { event: "Claim Submitted", time: "Feb 15, 09:12 AM", by: "Customer Portal", how: "auto", status: "done" },
  { event: "Docs Verified (Partial)", time: "Feb 15, 09:45 AM", by: "AI Document Scanner", how: "auto", status: "warn", note: "RC copy missing" },
  { event: "Auto-reminder Sent (WhatsApp)", time: "Feb 15, 09:46 AM", by: "Comms Engine", how: "auto", status: "done" },
  { event: "Assigned to Handler", time: "Feb 15, 11:20 AM", by: "Auto-assignment Rule", how: "auto", status: "done" },
  { event: "Survey Scheduled", time: "Feb 15, 02:30 PM", by: "Priya Sharma", how: "manual", status: "done" },
  { event: "AI Estimate Generated", time: "Feb 16, 10:00 AM", by: "KiAI Estimation Model", how: "ai", status: "warn", note: "Low confidence — high deviation" },
  { event: "Fraud Signal Triggered", time: "Feb 16, 10:01 AM", by: "Fraud Detection Engine", how: "ai", status: "error" },
  { event: "Escalated to SIU", time: "Feb 16, 10:05 AM", by: "Auto-escalation Rule", how: "auto", status: "active" },
];

const DOCUMENTS = [
  { name: "Insurance Policy", type: "PDF", status: "verified", size: "2.1 MB" },
  { name: "Registration Certificate", type: "PDF", status: "missing", size: null },
  { name: "FIR Report", type: "PDF", status: "verified", size: "890 KB" },
  { name: "Accident Photos (6)", type: "ZIP", status: "verified", size: "12.4 MB" },
  { name: "Repair Estimate", type: "PDF", status: "verified", size: "1.2 MB" },
  { name: "Invoice", type: "PDF", status: "uploaded", size: "980 KB" },
];

const FRAUD_SIGNALS = [
  { signal: "Invoice vs AI Estimate deviation > 40%", severity: "critical", triggered: true },
  { signal: "Workshop flagged for historical inflation", severity: "high", triggered: true },
  { signal: "Recent policy inception (< 3 months)", severity: "medium", triggered: false },
  { signal: "Multiple claims same VIN (past 12m)", severity: "critical", triggered: false },
  { signal: "Customer in high-risk zone", severity: "medium", triggered: true },
  { signal: "Night-time incident (unverifiable)", severity: "low", triggered: false },
];

const HOW_COLOR: Record<string, string> = {
  auto: "text-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/15%)]",
  ai: "text-[oklch(0.65_0.22_310)] bg-[oklch(0.65_0.22_310/15%)]",
  manual: "text-[oklch(0.72_0.18_85)] bg-[oklch(0.72_0.18_85/15%)]",
};

export default function ClaimDetailPage() {
  const params = useParams();
  const router = useRouter();
  const claimId = params.id as string;
  const claim = MOCK_CLAIMS.find(c => c.id === claimId) || MOCK_CLAIMS[0];

  const deviation = claim.invoiceAmount > 0
    ? Math.round(((claim.invoiceAmount - claim.aiEstimate) / claim.aiEstimate) * 100)
    : 0;

  return (
    <AppShell>
      <div className="p-5 lg:p-6 space-y-5">
        {/* Breadcrumb + Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <button onClick={() => router.push('/claims')} className="mt-1 text-[oklch(0.5_0.01_250)] hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-white">{claim.id}</h1>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${claim.fraudFlagged ? 'status-flagged' : 'status-in-review'}`}>
                  {claim.fraudFlagged ? "Fraud Flagged" : "In Review"}
                </span>
                {claim.slaStatus === 'breach' && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-[oklch(0.62_0.24_25/40%)] text-[oklch(0.62_0.24_25)] bg-[oklch(0.62_0.24_25/15%)] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    SLA BREACHED
                  </span>
                )}
              </div>
              <div className="text-sm text-[oklch(0.5_0.01_250)] mt-1">
                Policy: {claim.policyNumber} · Filed: {claim.incidentDate} · Region: {claim.region}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="px-3 py-2 text-xs font-medium text-[oklch(0.6_0.01_240)] bg-[oklch(0.15_0.018_255)] border border-[oklch(0.22_0.02_255)] rounded-lg hover:border-[oklch(0.35_0.05_255)] transition-colors">
              Assign
            </button>
            <button className="px-3 py-2 text-xs font-medium text-white kiai-gradient rounded-lg hover:opacity-90 transition-opacity">
              Approve Claim
            </button>
          </div>
        </div>

        {/* Claim info + Timeline layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left: Timeline */}
          <div className="xl:col-span-1 kiai-card rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[oklch(0.58_0.22_255)]" />
              Claim Timeline
            </h3>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-[oklch(0.22_0.02_255)]" />
              <div className="space-y-5">
                {TIMELINE_EVENTS.map((ev, i) => {
                  const dotColor = ev.status === 'done' ? 'oklch(0.62 0.18 160)' :
                    ev.status === 'warn' ? 'oklch(0.72 0.18 85)' :
                    ev.status === 'error' ? 'oklch(0.62 0.24 25)' :
                    ev.status === 'active' ? 'oklch(0.58 0.22 255)' : 'oklch(0.4 0.01 250)';
                  return (
                    <div key={i} className="flex gap-4 pl-8 relative">
                      <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 border-[oklch(0.13_0.016_255)] flex-shrink-0"
                        style={{ background: dotColor, boxShadow: ev.status === 'active' ? `0 0 8px ${dotColor}` : 'none' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white leading-tight">{ev.event}</div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] text-[oklch(0.45_0.01_250)]">{ev.time}</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${HOW_COLOR[ev.how]}`}>
                            {ev.how === 'ai' ? '🧠 AI' : ev.how === 'auto' ? '⚡ Auto' : '👤 Manual'}
                          </span>
                        </div>
                        <div className="text-[10px] text-[oklch(0.5_0.01_250)] mt-0.5">{ev.by}</div>
                        {ev.note && (
                          <div className="text-[10px] text-[oklch(0.72_0.18_85)] mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />{ev.note}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Panels */}
          <div className="xl:col-span-2 space-y-4">
            {/* Claim Info */}
            <div className="kiai-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-[oklch(0.58_0.22_255)]" />
                Claim Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: User, label: "Claimant", value: claim.claimantName },
                  { icon: Car, label: "Vehicle", value: claim.vehicle },
                  { icon: FileText, label: "Policy No.", value: claim.policyNumber },
                  { icon: MapPin, label: "Region", value: claim.region },
                  { icon: Calendar, label: "Incident Date", value: claim.incidentDate },
                  { icon: User, label: "Assigned To", value: claim.assignedTo },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center gap-1.5 text-[10px] text-[oklch(0.45_0.01_250)] uppercase tracking-wide mb-1">
                      <item.icon className="w-3 h-3" />
                      {item.label}
                    </div>
                    <div className="text-sm font-medium text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Estimation Panel */}
            <div className={`rounded-xl p-5 border ${claim.aiConfidence < 60 ? 'border-[oklch(0.62_0.24_25/40%)] bg-[oklch(0.62_0.24_25/6%)]' : 'kiai-card'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[oklch(0.65_0.22_310)]" />
                  AI Estimation & Approval
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                  claim.aiConfidence >= 80 ? 'text-[oklch(0.62_0.18_160)] border-[oklch(0.62_0.18_160/40%)] bg-[oklch(0.62_0.18_160/12%)]' :
                  claim.aiConfidence >= 60 ? 'text-[oklch(0.72_0.18_85)] border-[oklch(0.72_0.18_85/40%)] bg-[oklch(0.72_0.18_85/12%)]' :
                  'text-[oklch(0.62_0.24_25)] border-[oklch(0.62_0.24_25/40%)] bg-[oklch(0.62_0.24_25/12%)]'
                }`}>
                  {claim.aiConfidence}% Confidence
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-[oklch(0.11_0.015_255)] rounded-lg">
                  <div className="text-xs text-[oklch(0.5_0.01_250)] mb-1">AI Estimate</div>
                  <div className="text-lg font-bold text-[oklch(0.68_0.22_255)]">
                    {claim.aiEstimate > 0 ? `₹${(claim.aiEstimate/1000).toFixed(0)}K` : "—"}
                  </div>
                </div>
                <div className="text-center p-3 bg-[oklch(0.11_0.015_255)] rounded-lg">
                  <div className="text-xs text-[oklch(0.5_0.01_250)] mb-1">Invoice Amount</div>
                  <div className={`text-lg font-bold ${deviation > 20 ? 'text-[oklch(0.62_0.24_25)]' : 'text-white'}`}>
                    {claim.invoiceAmount > 0 ? `₹${(claim.invoiceAmount/1000).toFixed(0)}K` : "—"}
                  </div>
                </div>
                <div className="text-center p-3 bg-[oklch(0.11_0.015_255)] rounded-lg">
                  <div className="text-xs text-[oklch(0.5_0.01_250)] mb-1">Deviation</div>
                  <div className={`text-lg font-bold ${deviation > 20 ? 'text-[oklch(0.62_0.24_25)]' : deviation > 10 ? 'text-[oklch(0.72_0.18_85)]' : 'text-[oklch(0.62_0.18_160)]'}`}>
                    {deviation > 0 ? `+${deviation}%` : "—"}
                  </div>
                </div>
              </div>
              {claim.aiConfidence < 60 && (
                <div className="p-3 rounded-lg bg-[oklch(0.62_0.24_25/10%)] border border-[oklch(0.62_0.24_25/30%)] mb-3">
                  <div className="text-xs text-[oklch(0.62_0.24_25)] font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Low confidence — Human review required
                  </div>
                  <div className="text-[10px] text-[oklch(0.6_0.01_240)] mt-1">
                    AI flagged: High deviation from benchmarks, unusual parts mix, workshop risk score elevated.
                  </div>
                </div>
              )}
              <div className="text-xs text-[oklch(0.5_0.01_250)] mb-3">
                <span className="font-medium text-[oklch(0.7_0.01_240)]">AI Explanation: </span>
                Estimate based on 847 similar Honda City repairs in Bangalore metro (2023-24). 
                Labor rate: ₹850/hr (benchmark). Parts: OEM pricing index. 
                {deviation > 20 ? " Invoice significantly exceeds benchmark — major deviation in parts line items." : " Within acceptable variance."}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium bg-[oklch(0.62_0.18_160/20%)] text-[oklch(0.62_0.18_160)] border border-[oklch(0.62_0.18_160/40%)] rounded-lg hover:bg-[oklch(0.62_0.18_160/35%)] transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  Approve Estimate
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium bg-[oklch(0.62_0.24_25/20%)] text-[oklch(0.62_0.24_25)] border border-[oklch(0.62_0.24_25/40%)] rounded-lg hover:bg-[oklch(0.62_0.24_25/35%)] transition-colors">
                  <ThumbsDown className="w-3.5 h-3.5" />
                  Escalate for Review
                </button>
              </div>
            </div>

            {/* Fraud Signals */}
            {claim.fraudFlagged && (
              <div className="kiai-card rounded-xl p-5 border-[oklch(0.62_0.24_25/30%)] kiai-glow-red">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[oklch(0.62_0.24_25)]" />
                    Fraud Signals
                  </h3>
                  <button className="text-xs text-[oklch(0.58_0.22_255)] hover:underline">Refer to SIU →</button>
                </div>
                <div className="space-y-2">
                  {FRAUD_SIGNALS.map((signal, i) => (
                    <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg ${
                      signal.triggered ? 'bg-[oklch(0.62_0.24_25/10%)] border border-[oklch(0.62_0.24_25/25%)]' : 'bg-[oklch(0.13_0.016_255)]'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${signal.triggered ? 'bg-[oklch(0.62_0.24_25)]' : 'bg-[oklch(0.35_0.01_250)]'}`} />
                        <span className={`text-xs ${signal.triggered ? 'text-white font-medium' : 'text-[oklch(0.5_0.01_250)]'}`}>{signal.signal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          signal.severity === 'critical' ? 'text-[oklch(0.75_0.24_25)] bg-[oklch(0.62_0.24_25/20%)]' :
                          signal.severity === 'high' ? 'text-[oklch(0.72_0.18_85)] bg-[oklch(0.72_0.18_85/20%)]' :
                          'text-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/15%)]'
                        }`}>{signal.severity}</span>
                        {signal.triggered ? <CheckCircle2 className="w-3.5 h-3.5 text-[oklch(0.62_0.24_25)]" /> : <div className="w-3.5 h-3.5 rounded-full border border-[oklch(0.35_0.01_250)]" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 p-3 rounded-lg bg-[oklch(0.65_0.22_310/10%)] border border-[oklch(0.65_0.22_310/25%)]">
                  <div className="text-xs font-medium text-[oklch(0.75_0.22_310)]">Overall Fraud Risk Score: 87/100</div>
                  <div className="text-[10px] text-[oklch(0.6_0.01_240)] mt-0.5">3 critical signals triggered. Refer to SIU immediately.</div>
                </div>
              </div>
            )}

            {/* SLA Panel */}
            <div className="kiai-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[oklch(0.72_0.18_85)]" />
                SLA & Escalation
              </h3>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { label: "SLA Type", value: "Motor - Standard" },
                  { label: "Target", value: "7 days" },
                  { label: "Remaining", value: claim.slaDue },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-[oklch(0.11_0.015_255)] rounded-lg">
                    <div className="text-[10px] text-[oklch(0.45_0.01_250)] uppercase mb-1">{item.label}</div>
                    <div className={`text-sm font-bold ${item.label === "Remaining" ? (claim.slaStatus === 'breach' ? 'text-[oklch(0.62_0.24_25)]' : 'text-[oklch(0.72_0.18_85)]') : 'text-white'}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-2 bg-[oklch(0.2_0.02_255)] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[oklch(0.62_0.24_25)]" style={{ width: '108%' }} />
              </div>
              <div className="text-[10px] text-[oklch(0.62_0.24_25)] mt-1">⚠ SLA BREACHED — Escalation email sent to Claims Manager</div>
            </div>

            {/* Documents */}
            <div className="kiai-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[oklch(0.72_0.14_210)]" />
                  Documents ({DOCUMENTS.filter(d => d.status !== 'missing').length}/{DOCUMENTS.length})
                </h3>
                <div className="text-xs text-[oklch(0.5_0.01_250)]">
                  Doc completeness: <span className={claim.docCompleteness < 80 ? 'text-[oklch(0.62_0.24_25)] font-bold' : 'text-[oklch(0.62_0.18_160)] font-bold'}>{claim.docCompleteness}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {DOCUMENTS.map(doc => (
                  <div key={doc.name} className={`flex items-center gap-3 p-3 rounded-lg border ${
                    doc.status === 'verified' ? 'border-[oklch(0.62_0.18_160/30%)] bg-[oklch(0.62_0.18_160/6%)]' :
                    doc.status === 'missing' ? 'border-[oklch(0.62_0.24_25/40%)] bg-[oklch(0.62_0.24_25/8%)]' :
                    'border-[oklch(0.72_0.18_85/30%)] bg-[oklch(0.72_0.18_85/6%)]'
                  }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      doc.status === 'verified' ? 'bg-[oklch(0.62_0.18_160/20%)] text-[oklch(0.62_0.18_160)]' :
                      doc.status === 'missing' ? 'bg-[oklch(0.62_0.24_25/20%)] text-[oklch(0.62_0.24_25)]' :
                      'bg-[oklch(0.72_0.18_85/20%)] text-[oklch(0.72_0.18_85)]'
                    }`}>
                      {doc.type}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{doc.name}</div>
                      <div className={`text-[10px] font-medium ${
                        doc.status === 'verified' ? 'text-[oklch(0.62_0.18_160)]' :
                        doc.status === 'missing' ? 'text-[oklch(0.62_0.24_25)]' : 'text-[oklch(0.72_0.18_85)]'
                      }`}>
                        {doc.status === 'missing' ? '⚠ Missing — Request sent' : doc.status === 'verified' ? '✓ Verified' : '↑ Uploaded'}
                        {doc.size && <span className="text-[oklch(0.45_0.01_250)] ml-1">· {doc.size}</span>}
                      </div>
                    </div>
                    {doc.status !== 'missing' && (
                      <button className="text-[oklch(0.5_0.01_250)] hover:text-white transition-colors">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Comments & Approvals */}
            <div className="kiai-card rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[oklch(0.58_0.22_255)]" />
                Comments & Approvals
              </h3>
              <div className="space-y-3 mb-4">
                {[
                  { by: "Priya Sharma", time: "Feb 16, 10:30 AM", msg: "Sent to SIU. Invoice has 3 line items that don't match survey photos.", type: "comment" },
                  { by: "Sneha Patel (SIU)", time: "Feb 16, 11:00 AM", msg: "Opening investigation. Requesting workshop records and bank statements.", type: "siu" },
                ].map((c, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${c.type === 'siu' ? 'border-[oklch(0.65_0.22_310/35%)] bg-[oklch(0.65_0.22_310/8%)]' : 'border-[oklch(0.22_0.02_255)] bg-[oklch(0.13_0.016_255)]'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white">{c.by}</span>
                      <span className="text-[10px] text-[oklch(0.45_0.01_250)]">{c.time}</span>
                    </div>
                    <p className="text-xs text-[oklch(0.7_0.01_240)]">{c.msg}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Add a comment or approval note..."
                  className="flex-1 bg-[oklch(0.11_0.015_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-3 py-2 text-xs text-white placeholder-[oklch(0.4_0.01_250)] focus:outline-none focus:border-[oklch(0.58_0.22_255)] transition-colors"
                />
                <button className="px-3 py-2 text-xs font-medium text-white bg-[oklch(0.58_0.22_255/30%)] border border-[oklch(0.58_0.22_255/50%)] rounded-lg hover:bg-[oklch(0.58_0.22_255/50%)] transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
