"use client";

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
  return (
    <SidebarRoot className={cn("hidden md:flex w-64", className)}>
      <SidebarHeader className="h-16 flex items-center px-6 mb-20 mt-10 text-2xl font-semibold tracking-tight">
        {/* Placeholder for future logo */}
        <span className="text-primary">OpenAuditLabs</span>
      </SidebarHeader>
      <SidebarContent>
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
                        <span>{item.label}</span>
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
