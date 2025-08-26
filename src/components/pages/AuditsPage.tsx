import Header from "@/components/common/Header";
import AuditsClient from "@/components/audits/AuditsClient";
import { getActiveAudits, type AuditCard } from "@/actions/activities";

export default async function AuditsPage() {
  const initialAudits: AuditCard[] = await getActiveAudits();

  return (
    <main className="flex-1 p-8">
      <Header 
        title="Audits"
        subtitle="Monitor real-time security analysis and threat detection"
      />

      <AuditsClient initialAudits={initialAudits} />
    </main>
  );
}
