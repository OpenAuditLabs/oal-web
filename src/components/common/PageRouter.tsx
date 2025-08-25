import DashboardPage from "@/components/pages/DashboardPage";
import AuditsPage from "@/components/pages/AuditsPage";
import PastAuditPage from "../pages/PastAuditsPage";
import ProjectsPage from "../pages/ProjectsPage";

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
        return <AuditsPage />;
      case "past-audits":
        return <PastAuditPage/>
      case "projects":
        return <ProjectsPage />;
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
