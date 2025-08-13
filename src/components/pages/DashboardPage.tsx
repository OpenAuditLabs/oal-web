"use client";

import Header from "@/components/common/Header";
import KPIGrid from "@/components/common/KPIGrid";
import UploadCard from "@/components/common/UploadCard";

export default function DashboardPage() {
  return (
    <main className="flex-1 p-8">
      {/* Dashboard Header */}
      <Header 
        title="Dashboard"
        subtitle="Monitor real-time security analysis and threat detection"
      />

      <KPIGrid />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UploadCard />
      </div>
    </main>
  );
}
