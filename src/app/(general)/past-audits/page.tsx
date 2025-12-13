import { EmptyState } from '@/components/pages/audits/EmptyState';
import { getPastAudits } from '@/actions/audits/getPastAudits/action';
import { DownloadCsvButton } from '@/components/pages/audits/DownloadCsvButton';

export default async function PastAuditsPage() {
  const { data: pastAudits = [] } = await getPastAudits({});

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Past Audits</h1>
      <div className="mb-4">
        <DownloadCsvButton pastAudits={pastAudits} />
      </div>
      {pastAudits.length === 0 ? (
        <EmptyState />
      ) : (
        <div>
          {/* Render your past audits list here if pastAudits is not empty */}
          <p className="text-sm text-muted-foreground">Displaying past audits content.</p>
          <ul>
            {pastAudits.map(audit => (
              <li key={audit.id}>{audit.title} - {audit.createdAt} - {audit.status}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
