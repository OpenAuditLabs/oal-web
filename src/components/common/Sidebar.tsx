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
    <aside className="w-64 bg-secondary shadow-sm min-h-screen">
      <div className="p-6">
        {/* Empty space for logo/name */}
        <div className="h-24 mb-8"></div>
        
        <nav className="space-y-4">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-3 px-3 py-4 rounded-lg font-bold w-full text-left ${
              activeTab === "dashboard" 
                ? "text-foreground border border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left ${
              activeTab === "audits" 
                ? "text-foreground border border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <FileText className="w-5 h-5" />
            Audits
          </button>
          <button 
            onClick={() => setActiveTab("past-audits")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left ${
              activeTab === "past-audits" 
                ? "text-foreground border border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Clock className="w-5 h-5" />
            Past Audits
          </button>
          <button 
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg font-bold w-full text-left ${
              activeTab === "projects" 
                ? "text-foreground border border-primary bg-accent" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Folder className="w-5 h-5" />
            Projects
          </button>
        </nav>
      </div>
    </aside>
  );
}
