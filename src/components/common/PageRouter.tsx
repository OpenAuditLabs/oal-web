"use client";

import DashboardPage from "@/components/pages/DashboardPage";

type TabType = "dashboard" | "audits" | "past-audits" | "projects";

interface PageRouterProps {
  activeTab: TabType;
}

export default function PageRouter({ activeTab }: PageRouterProps) {
  const renderPage = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />;
      case "audits":
        return <div className="flex-1 p-8">Audits Page - Coming Soon</div>;
      case "past-audits":
        return <div className="flex-1 p-8">Past Audits Page - Coming Soon</div>;
      case "projects":
        return <div className="flex-1 p-8">Projects Page - Coming Soon</div>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      {renderPage()}
    </>
  );
}

// Export the setActiveTab function so it can be used by the Sidebar
export { type TabType };
