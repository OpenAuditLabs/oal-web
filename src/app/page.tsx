import SidebarClient from "@/components/common/SidebarClient";
import PageRouter from "@/components/common/PageRouter";
import { TabType } from "@/components/common/PageRouter";
import { getCurrentUserCredits } from "@/lib/user";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Dashboard({ searchParams }: PageProps) {
  const params = await searchParams || {};
  const tab = params.tab as TabType;
  const activeTab: TabType = tab && ["dashboard", "audits", "past-audits", "projects"].includes(tab) 
    ? tab 
    : "dashboard";

  // Auth guard: require valid JWT cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) {
    redirect('/login');
  }
  try {
    await verifyJwt(token);
  } catch {
    redirect('/login');
  }

  // Fetch credits on the server
  const creditsLeft = await getCurrentUserCredits();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="h-1 bg-primary"></div>
      
      <div className="flex">
        {/* Left Sidebar */}
        <SidebarClient
          activeTab={activeTab}
          creditsLeft={creditsLeft}
        />

        {/* Main Content */}
        <PageRouter activeTab={activeTab} />
      </div>
    </div>
  );
}
