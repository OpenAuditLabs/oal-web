"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Workflow,
  History,
  FolderKanban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
    <SidebarRoot
      className={cn(
        "hidden md:flex transition-[width] duration-200",
        isCollapsed ? "md:w-16" : "md:w-64",
        className,
      )}
    >
      <SidebarHeader className="mt-10 mb-20 flex h-16 items-center justify-between px-6 text-2xl font-semibold tracking-tight">
        {/* Placeholder for future logo */}
        <span className={cn("text-primary", isCollapsed && "sr-only")}>OpenAuditLabs</span>
        <button
          type="button"
          onClick={handleToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-navigation"
          className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-sm"
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="size-4" aria-hidden="true" />
          )}
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
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 transition-[gap] duration-200",
                          isCollapsed && "justify-center gap-0",
                        )}
                      >
                        <Icon className="size-5" />
                        <span className={cn(isCollapsed && "sr-only")}>{item.label}</span>
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
  );
}
