import Header from "@/components/common/Header";
import AuditsClient from "@/components/audits/AuditsClient";
import auditsData from "@/data/audits.json";

interface AuditCard {
  id: string;
  title: string;
  currentStatus: string;
  size: string;
  started: string;
  duration: string;
  progress: number;
  statusMessage: string;
  statusType: "active" | "queued";
}

export default async function AuditsPage() {
  // This could be replaced with actual database fetching later
  const initialAudits: AuditCard[] = auditsData.audits as AuditCard[];

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
