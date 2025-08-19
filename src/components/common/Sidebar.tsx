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
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap ${
              activeTab === "dashboard" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted border-transparent"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            <span className="overflow-hidden">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab("audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap ${
              activeTab === "audits" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted border-transparent"
            }`}
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span className="overflow-hidden">Audits</span>
          </button>
          <button 
            onClick={() => setActiveTab("past-audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap ${
              activeTab === "past-audits" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted border-transparent"
            }`}
          >
            <Clock className="w-5 h-5 flex-shrink-0" />
            <span className="overflow-hidden">Past Audits</span>
          </button>
          <button 
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left border whitespace-nowrap ${
              activeTab === "projects" 
                ? "text-foreground border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted border-transparent"
            }`}
          >
            <Folder className="w-5 h-5 flex-shrink-0" />
            <span className="overflow-hidden">Projects</span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
