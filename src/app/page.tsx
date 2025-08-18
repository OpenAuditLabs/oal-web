"use client";

import { useState } from "react";
import Sidebar from "@/components/common/Sidebar";
import PageRouter from "@/components/common/PageRouter";
import { TabType } from "@/components/common/PageRouter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="h-1 bg-primary"></div>
      
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <PageRouter activeTab={activeTab} />
      </div>
    </div>
  );
}
