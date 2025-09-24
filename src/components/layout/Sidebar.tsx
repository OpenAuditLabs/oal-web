"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Workflow ,History, FolderKanban } from "lucide-react";
import { Tabs, TabItem } from "./Tabs";

interface SidebarProps {
  className?: string;
}

const items: TabItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "audits", label: "Audits", href: "/audits", icon: Workflow },
  { id: "past-audits", label: "Past Audits", href: "/past-audits", icon: History },
  { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
];

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("hidden md:flex flex-col w-64 shrink-0 border-r border-primary/20 bg-secondary/30 p-6 gap-10", className)}>
      {/* Reserved space for future logo / branding */}
      <div className="h-30 w-full" aria-hidden="true" />
      <Tabs tabs={items} orientation="vertical" />
    </aside>
  );
}
