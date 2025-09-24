"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId?: string; // optionally override active detection
  className?: string;
  itemClassName?: string;
  orientation?: "horizontal" | "vertical";
}

export function Tabs({ tabs, activeId, className, itemClassName, orientation = "horizontal" }: TabsProps) {
  const pathname = usePathname();

  const resolvedActive = useMemo(() => {
    if (activeId) return activeId;
    // Sort tabs by descending href length for specificity
    const sortedTabs = [...tabs].sort((a, b) => b.href.length - a.href.length);
    const match = sortedTabs.find(t =>
      pathname === t.href || pathname.startsWith(t.href + "/")
    );
    return match?.id;
  }, [activeId, tabs, pathname]);

  const vertical = orientation === "vertical";

  return (
    <div
      className={cn(
        vertical ? "flex flex-col gap-8" : "border-b border-primary/20",
        className
      )}
    >
      <div className={cn(vertical ? "flex flex-col gap-4" : "flex justify-center gap-8")}>
        {tabs.map(tab => {
          const Icon = tab.icon;
            const isActive = tab.id === resolvedActive;
            const highlightDot = tab.highlight;
            if (vertical) {
              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-6 py-4 text-sm font-bold transition-colors border",
                    isActive
                      ? "bg-accent text-foreground border-primary"
                      : "hover:bg-accent/60 border-transparent text-foreground/80 scale-95 hover:scale-100",
                    itemClassName
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  {highlightDot && <span className="w-2 h-2 bg-primary rounded-full" />}
                </Link>
              );
            }
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-1 py-2 pb-3 text-sm relative",
                  isActive ? "text-primary border-b-2 border-primary font-semibold" : "text-gray-600",
                  itemClassName
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                {tab.label}
                {highlightDot && <span className="w-2 h-2 bg-primary relative top-[-1px] rounded-full" />}
              </Link>
            );
        })}
      </div>
    </div>
  );
}
