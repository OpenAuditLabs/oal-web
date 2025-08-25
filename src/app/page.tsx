import SidebarClient from "@/components/common/SidebarClient";
import PageRouter from "@/components/common/PageRouter";
import { TabType } from "@/components/common/PageRouter";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Dashboard({ searchParams }: PageProps) {
  const params = await searchParams;
  const tab = params.tab as TabType;
  const activeTab: TabType = tab && ["dashboard", "audits", "past-audits", "projects"].includes(tab) 
    ? tab 
    : "dashboard";

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="h-1 bg-primary"></div>
      
      <div className="flex">
        {/* Left Sidebar */}
        <SidebarClient activeTab={activeTab} />

        {/* Main Content */}
        <PageRouter activeTab={activeTab} />
      </div>
    </div>
  );
}
