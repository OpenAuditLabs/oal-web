"use client";

import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Folder, 
} from "lucide-react";
import CreditsCard from "@/components/common/CreditsCard";
import { logoutUserAction } from '@/actions/auth';
import { useTransition } from 'react';

type TabType = "dashboard" | "audits" | "past-audits" | "projects";

interface SidebarClientProps { activeTab: TabType; creditsLeft?: number; }

export default function SidebarClient({ activeTab, creditsLeft }: SidebarClientProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleTabChange = (tab: TabType) => {
    const path = tab === "dashboard" ? "/" : `/?tab=${tab}`;
    router.push(path);
  };

  const handleLogout = () => {
    if (pending) return;
    startTransition(async () => {
      await logoutUserAction();
      router.push('/login');
    });
  };

  return (
    <aside className="w-64 bg-secondary shadow-sm min-h-screen min-w-64 flex flex-col">
      <div className="p-6 flex flex-col h-full">
        {/* Empty space for logo/name */}
        <div className="h-24 mb-8"></div>
        
        <nav className="space-y-4">
          <button 
            onClick={() => handleTabChange("dashboard")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "dashboard" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => handleTabChange("audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "audits" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span>Active Audits</span>
          </button>

          <button 
            onClick={() => handleTabChange("past-audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "past-audits" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <Clock className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span>Past Audits</span>
          </button>

          <button 
            onClick={() => handleTabChange("projects")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "projects" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <Folder className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span>Projects</span>
          </button>
        </nav>

        {/* Fixed footer area for credits + logout */}
        <div className="mt-auto pt-8 relative">
          <div className="fixed bottom-4 left-4 w-56 flex flex-col gap-3 z-40">
            <CreditsCard credits={creditsLeft} fixed={false} />
            <button
              type="button"
              onClick={handleLogout}
              disabled={pending}
              className="rounded-lg bg-destructive text-white py-2 font-medium hover:bg-destructive/90 disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/50"
            >
              {pending ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
