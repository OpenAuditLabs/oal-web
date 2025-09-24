import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function GeneralLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session.user?.id) {
    redirect("/signin");
  }
  return (
    <div className="min-h-screen flex flex-row">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
