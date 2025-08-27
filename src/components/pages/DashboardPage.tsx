import Header from "@/components/common/Header";
import SearchAndFilter from "@/components/ui/SearchAndFilter";
import KPIGrid from "@/components/common/KPIGrid";
import UploadCard from "@/components/common/UploadCard";
import { RecentActivity } from "@/components/dashboard";
import { getDashboardKPIs } from "@/actions/dashboard";

export default async function DashboardPage() {
  const kpiData = await getDashboardKPIs();

  return (
    <main className="flex-1 p-8">
      {/* Dashboard Header */}
      <Header 
        title="Dashboard"
        subtitle="Monitor real-time security analysis and threat detection"
      >
        <SearchAndFilter searchPlaceholder="Search dashboard..." />
      </Header>

      <KPIGrid kpiData={kpiData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UploadCard />
        <RecentActivity />
      </div>
    </main>
  );
}
