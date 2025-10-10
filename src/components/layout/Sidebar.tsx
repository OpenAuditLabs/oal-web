"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Workflow, History, FolderKanban } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "@/components/ui/sidebar";

interface SidebarProps {
  className?: string;
}

const items = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "audits", label: "Audits", href: "/audits", icon: Workflow },
  { id: "past-audits", label: "Past Audits", href: "/past-audits", icon: History },
  { id: "projects", label: "Projects", href: "/projects", icon: FolderKanban },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => setIsCollapsed(prev => !prev);

  return (
    <>
      <SidebarRoot
        className={cn(
          "hidden md:flex w-64 transition-[width] duration-200",
          isCollapsed && "sidebar-collapsed",
          className,
        )}
        aria-expanded={!isCollapsed}
      >
        <SidebarHeader className="h-16 flex items-center justify-between px-6 mb-20 mt-10 text-2xl font-semibold tracking-tight">
          {/* Placeholder for future logo */}
          <span className="text-primary sidebar-label">OpenAuditLabs</span>
          <button
            type="button"
            onClick={handleToggle}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={isCollapsed}
            aria-controls="sidebar-navigation"
            className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm"
          >
            <span aria-hidden="true">{isCollapsed ? "›" : "‹"}</span>
          </button>
        </SidebarHeader>
        <SidebarContent id="sidebar-navigation">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton asChild isActive={active}>
                        <Link href={item.href} className="flex items-center gap-3">
                        <Icon className="size-5" />
                          <span className="sidebar-label">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        </SidebarContent>
      </SidebarRoot>
      <style jsx>{`
        .sidebar-collapsed {
          width: 4rem !important;
        }

        .sidebar-collapsed .sidebar-label {
          opacity: 0;
          pointer-events: none;
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </>
  );
}
