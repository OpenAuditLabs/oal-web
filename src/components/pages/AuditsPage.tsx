
import Header from "@/components/common/Header";
import { getActiveAuditsCards as getActiveAudits, type ActiveAuditCard as AuditCard } from "@/actions/active-audits";
import { SearchProvider, SearchInput, SearchableActiveAuditList } from "@/components/audits/ActiveAuditClient";

export default async function AuditsPage() {
  const initialAudits: AuditCard[] = await getActiveAudits();
  return (
    <SearchProvider>
      <main className="flex-1 p-8">
        <Header 
          title="Audits"
          subtitle="Monitor real-time security analysis and threat detection"
        >
          <SearchInput />
        </Header>

        <SearchableActiveAuditList initialAudits={initialAudits} />
      </main>
    </SearchProvider>
  );
}
