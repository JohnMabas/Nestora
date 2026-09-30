"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAgentAuth } from "@/context/AgentAuthContext";
import { AgentStoreProvider } from "@/context/AgentStoreContext";
import DashboardSidebar from "@/components/agents/DashboardSidebar";

/**
 * Dashboard layout — wraps all /agent/dashboard/* pages.
 *
 * Route protection: if there is no agent session, redirect to /agent/login.
 * The check lives here (single source of truth) and never in individual pages.
 *
 * The layout does NOT render the public <Header> or <Footer> — the dashboard
 * is an authenticated app-shell with its own sidebar navigation.
 */
export default function DashboardLayout({ children }) {
  const { agent, loading } = useAgentAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !agent) {
      router.replace("/agent/login");
    }
  }, [agent, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-1)]">
        <div className="flex flex-col items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <p className="text-sm text-[var(--color-text-muted)]">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!agent) return null; // redirect in flight

  return (
    <AgentStoreProvider>
      {/* Full-screen app-shell: sidebar + main content */}
      <div className="flex h-screen overflow-hidden bg-[var(--color-surface-1)] relative">
        <DashboardSidebar />

        {/* Main scroll area */}
        <div className="flex-1 flex flex-col overflow-y-auto md:pt-0 pt-14">
          <main id="dashboard-main" className="flex-1 p-5 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AgentStoreProvider>
  );
}
