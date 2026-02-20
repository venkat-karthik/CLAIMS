"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, Zap, Lock, ChevronRight } from "lucide-react";
import { MOCK_USERS, type Role } from "@/lib/data";

const ROLE_LABELS: Record<Role, string> = {
  claims_manager: "Claims Manager",
  claims_handler: "Claims Handler",
  surveyor: "Surveyor / Estimator",
  workshop: "Workshop Partner",
  siu: "SIU Investigator",
  cx: "Customer Experience",
  finance: "Finance",
  admin: "Administrator",
};

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  claims_manager: "Executive dashboard, KPIs, SLA oversight",
  claims_handler: "Work queue, claim processing, approvals",
  surveyor: "Survey tasks, photo upload, AI estimation",
  workshop: "Job cards, invoice upload, delivery scheduling",
  siu: "Fraud queue, evidence packs, investigation mgmt",
  cx: "NPS tracking, complaint management, proactive alerts",
  finance: "Invoice validation, payout approvals, reconciliation",
  admin: "Rules engine, SLA config, permission management",
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleLogin = (userId?: string) => {
    const uid = userId || selectedUser;
    if (!uid) return;
    const user = MOCK_USERS.find((u) => u.id === uid);
    if (!user) return;
    setLoading(true);
    localStorage.setItem("kiai_user", JSON.stringify(user));
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  const handleQuickLogin = (userId: string) => {
    setActiveDemo(userId);
    handleLogin(userId);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.11_0.015_255)] flex items-center justify-center p-4 grid-bg relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[oklch(0.58_0.22_255/8%)] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-[oklch(0.65_0.22_310/8%)] blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left — Branding */}
        <div className="hidden lg:flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl kiai-gradient flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold tracking-tight text-white">KiAI Claims</div>
              <div className="text-xs text-[oklch(0.56_0.01_250)] tracking-widest uppercase">Intelligence & Orchestration</div>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Claims operations.<br />
              <span className="kiai-gradient-text">Fully orchestrated.</span>
            </h1>
            <p className="text-[oklch(0.56_0.01_250)] text-base leading-relaxed max-w-md">
              From FNOL to closure — automated triage, AI estimation, fraud detection, 
              and SLA enforcement. Humans do exceptions, not administration.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "⚡", label: "Auto-Triage", desc: "Claims routed in seconds" },
              { icon: "🧠", label: "AI Estimation", desc: "91.4% accuracy rate" },
              { icon: "🛡️", label: "Fraud Detection", desc: "Multi-signal scoring" },
              { icon: "📊", label: "SLA Enforcement", desc: "Zero manual tracking" },
            ].map((item) => (
              <div key={item.label} className="kiai-card rounded-xl p-4">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-[oklch(0.56_0.01_250)]">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-[oklch(0.45_0.01_250)]">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.18_160)] live-dot" />
              <span>All systems operational</span>
            </div>
            <div>·</div>
            <div>v2.4.1</div>
            <div>·</div>
            <div>SOC2 Compliant</div>
          </div>
        </div>

        {/* Right — Login Panel */}
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl kiai-gradient flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-white">KiAI Claims</div>
          </div>

          <div className="bg-[oklch(0.15_0.018_255)] border border-[oklch(0.22_0.02_255)] rounded-2xl p-8">
            <h2 className="text-xl font-bold text-white mb-1">Sign in to your workspace</h2>
            <p className="text-sm text-[oklch(0.56_0.01_250)] mb-6">Role-based access — your dashboard loads automatically.</p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-[oklch(0.7_0.01_240)] mb-1.5 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  defaultValue="arjun@kiai.claims"
                  className="w-full bg-[oklch(0.11_0.015_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[oklch(0.4_0.01_250)] focus:outline-none focus:border-[oklch(0.58_0.22_255)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[oklch(0.7_0.01_240)] mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    defaultValue="••••••••"
                    className="w-full bg-[oklch(0.11_0.015_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[oklch(0.4_0.01_250)] focus:outline-none focus:border-[oklch(0.58_0.22_255)] transition-colors pr-10"
                  />
                  <button
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.01_250)] hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLogin('u1')}
              disabled={loading}
              className="w-full kiai-gradient rounded-lg py-3 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 mb-6"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

            {/* Quick Demo Access */}
            <div className="border-t border-[oklch(0.22_0.02_255)] pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[oklch(0.72_0.18_85)]" />
                <span className="text-xs font-semibold text-[oklch(0.72_0.18_85)] uppercase tracking-wide">Quick Demo Access</span>
              </div>
              <div className="space-y-2">
                {MOCK_USERS.slice(0, 6).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleQuickLogin(user.id)}
                    disabled={loading}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all text-left group
                      ${activeDemo === user.id
                        ? 'border-[oklch(0.58_0.22_255)] bg-[oklch(0.58_0.22_255/15%)]'
                        : 'border-[oklch(0.22_0.02_255)] hover:border-[oklch(0.35_0.05_255)] hover:bg-[oklch(0.18_0.02_255)]'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[oklch(0.58_0.22_255/20%)] flex items-center justify-center text-xs font-bold text-[oklch(0.68_0.22_255)]">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{user.name}</div>
                        <div className="text-[10px] text-[oklch(0.45_0.01_250)]">{ROLE_LABELS[user.role]}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[oklch(0.4_0.01_250)] group-hover:text-[oklch(0.58_0.22_255)] transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-[oklch(0.35_0.01_250)] mt-4">
            Secure access · SOC2 · ISO 27001 · All activity logged
          </p>
        </div>
      </div>
    </div>
  );
}
