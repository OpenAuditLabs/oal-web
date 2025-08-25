"use client";

import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Folder, 
} from "lucide-react";

type TabType = "dashboard" | "audits" | "past-audits" | "projects";

interface SidebarClientProps {
  activeTab: TabType;
}

export default function SidebarClient({ activeTab }: SidebarClientProps) {
  const router = useRouter();

  const handleTabChange = (tab: TabType) => {
    const path = tab === "dashboard" ? "/" : `/?tab=${tab}`;
    router.push(path);
  };

  return (
    <aside className="w-64 bg-secondary shadow-sm min-h-screen min-w-64">
      <div className="p-6">
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
      </div>
    </aside>
  );
}
