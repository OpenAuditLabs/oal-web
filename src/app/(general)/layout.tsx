import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function GeneralLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session.user?.id) {
    redirect("/signin");
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
