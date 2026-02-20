"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, Shield, Wrench, Users, Brain,
  GitBranch, BarChart3, Settings, Bell, Search, ChevronRight,
  LogOut, Menu, X, AlertTriangle, Activity, HelpCircle
} from "lucide-react";
import type { User } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", badge: null },
  { href: "/claims", icon: FileText, label: "Claims", badge: "847" },
  { href: "/fraud", icon: Shield, label: "Fraud / SIU", badge: "14" },
  { href: "/workshops", icon: Wrench, label: "Workshops", badge: null },
  { href: "/customers", icon: Users, label: "Customers", badge: "9" },
  { href: "/ai-insights", icon: Brain, label: "AI Insights", badge: null },
  { href: "/flowcharts", icon: GitBranch, label: "Flowcharts", badge: null },
  { href: "/reports", icon: BarChart3, label: "Reports", badge: null },
  { href: "/admin", icon: Settings, label: "Admin", badge: null },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState(5);

  useEffect(() => {
    const stored = localStorage.getItem("kiai_user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("kiai_user");
    router.push("/login");
  };

  if (!user) return null;

  const activeLabel = NAV_ITEMS.find(n => pathname.startsWith(n.href))?.label || "Dashboard";

  return (
    <div className="flex h-screen bg-[oklch(0.11_0.015_255)] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-[220px] bg-[oklch(0.09_0.015_255)] border-r border-[oklch(0.18_0.018_255)] transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[oklch(0.18_0.018_255)]">
          <div className="w-8 h-8 rounded-lg kiai-gradient flex items-center justify-center flex-shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-tight">KiAI Claims</div>
            <div className="text-[10px] text-[oklch(0.42_0.01_250)] uppercase tracking-widest">Operations</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group relative ${
                  active
                    ? "bg-[oklch(0.58_0.22_255/18%)] text-white"
                    : "text-[oklch(0.6_0.01_240)] hover:bg-[oklch(0.15_0.018_255)] hover:text-white"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-[oklch(0.58_0.22_255)]" />
                )}
                <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[oklch(0.68_0.22_255)]" : "text-[oklch(0.5_0.01_240)] group-hover:text-white"}`} />
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    item.href === "/fraud" || item.href === "/customers"
                      ? "bg-[oklch(0.62_0.24_25/20%)] text-[oklch(0.75_0.24_25)]"
                      : "bg-[oklch(0.22_0.02_255)] text-[oklch(0.6_0.01_240)]"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-[oklch(0.18_0.018_255)] p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[oklch(0.15_0.018_255)] transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[oklch(0.58_0.22_255/25%)] flex items-center justify-center text-xs font-bold text-[oklch(0.68_0.22_255)] flex-shrink-0">
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-[oklch(0.42_0.01_250)] truncate capitalize">{user.role.replace(/_/g, ' ')}</div>
            </div>
            <button onClick={handleLogout} className="text-[oklch(0.4_0.01_250)] hover:text-[oklch(0.62_0.24_25)] transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 flex items-center gap-4 px-4 lg:px-6 border-b border-[oklch(0.18_0.018_255)] bg-[oklch(0.11_0.015_255)] flex-shrink-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-[oklch(0.6_0.01_240)] hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title + breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[oklch(0.45_0.01_250)]">KiAI</span>
            <ChevronRight className="w-3 h-3 text-[oklch(0.35_0.01_250)]" />
            <span className="font-medium text-white">{activeLabel}</span>
          </div>

          {/* Live indicator */}
          <div className="hidden md:flex items-center gap-1.5 ml-4 px-2.5 py-1 rounded-full bg-[oklch(0.62_0.18_160/12%)] border border-[oklch(0.62_0.18_160/25%)]">
            <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.62_0.18_160)] live-dot" />
            <span className="text-[10px] font-medium text-[oklch(0.62_0.18_160)]">LIVE</span>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[oklch(0.15_0.018_255)] border border-[oklch(0.22_0.02_255)] rounded-lg px-3 py-2 w-64 focus-within:border-[oklch(0.58_0.22_255)] transition-colors">
            <Search className="w-3.5 h-3.5 text-[oklch(0.45_0.01_250)]" />
            <input
              type="text"
              placeholder="Search claims, policies..."
              className="flex-1 bg-transparent text-xs text-white placeholder-[oklch(0.4_0.01_250)] focus:outline-none"
            />
            <kbd className="text-[9px] text-[oklch(0.4_0.01_250)] bg-[oklch(0.22_0.02_255)] px-1.5 py-0.5 rounded">⌘K</kbd>
          </div>

          {/* Alerts */}
          <button className="relative text-[oklch(0.6_0.01_240)] hover:text-white transition-colors p-2 rounded-lg hover:bg-[oklch(0.18_0.02_255)]">
            <Bell className="w-4.5 h-4.5" />
            {alerts > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[oklch(0.62_0.24_25)] text-[9px] font-bold text-white flex items-center justify-center">
                {alerts}
              </span>
            )}
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.58_0.22_255/25%)] flex items-center justify-center text-xs font-bold text-[oklch(0.68_0.22_255)] cursor-pointer">
            {user.avatar}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
