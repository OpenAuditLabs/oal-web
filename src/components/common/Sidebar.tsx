import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Folder, 
} from "lucide-react";
import { TabType } from "./PageRouter";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-secondary shadow-sm min-h-screen min-w-64">
      <div className="p-6">
        {/* Empty space for logo/name */}
        <div className="h-24 mb-8"></div>
        
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "dashboard" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span className="overflow-hidden">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab("audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "audits" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span className="overflow-hidden">Audits</span>
          </button>
          <button 
            onClick={() => setActiveTab("past-audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "past-audits" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <Clock className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span className="overflow-hidden">Past Audits</span>
          </button>
          <button 
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap transition-all duration-200 ${
              activeTab === "projects" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border hover:scale-105 border-transparent"
            }`}
          >
            <Folder className="w-5 h-5 flex-shrink-0 transition-transform duration-200 hover:scale-110" />
            <span className="overflow-hidden">Projects</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
