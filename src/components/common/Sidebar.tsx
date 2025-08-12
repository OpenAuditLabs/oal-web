import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Folder, 
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-50 shadow-sm min-h-screen">
      <div className="p-6">
        {/* Empty space for logo/name */}
        <div className="h-24 mb-8"></div>
        
        <nav className="space-y-4">
          <a 
            href="#" 
            className="flex items-center gap-3 px-3 py-4 text-black-700 rounded-lg font-bold border border-black"
            style={{ backgroundColor: '#AFFDC3' }}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-3 py-3 text-black-700 hover:bg-gray-50 rounded-lg font-bold"
          >
            <FileText className="w-5 h-5" />
            Audits
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-3 py-3 text-black-700 hover:bg-gray-50 rounded-lg font-bold"
          >
            <Clock className="w-5 h-5" />
            Past Audits
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-3 py-3 text-black-700 hover:bg-gray-50 rounded-lg font-bold"
          >
            <Folder className="w-5 h-5" />
            Projects
          </a>
        </nav>
      </div>
    </aside>
  );
}
