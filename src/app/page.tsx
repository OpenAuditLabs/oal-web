import SidebarClient from "@/components/common/SidebarClient";
import PageRouter from "@/components/common/PageRouter";
import { TabType } from "@/components/common/PageRouter";
import { getCurrentUserCredits } from "@/lib/user";


interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Dashboard({ searchParams }: PageProps) {
  const params = await searchParams || {};
  const tab = params.tab as TabType;
  const activeTab: TabType = tab && ["dashboard", "audits", "past-audits", "projects"].includes(tab) 
    ? tab 
    : "dashboard";
  const creditsLeft = await getCurrentUserCredits();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="h-1 bg-primary"></div>
      
      <div className="flex">
        {/* Left Sidebar */}
      <SidebarClient activeTab={activeTab} creditsLeft={creditsLeft} />

        {/* Main Content */}
        <PageRouter activeTab={activeTab} />
      </div>
    </div>
  );
}
