import { EmptyState } from '@/components/pages/audits/EmptyState';
import { PastAudit } from '@/types/audit';
import { getPastAudits } from '@/actions/audits/getPastAudits/action';
import { Button } from '@/components/ui/button';
import { downloadCsv } from '@/lib/csv';

export default async function PastAuditsPage() {
  const { data: pastAudits = [] } = await getPastAudits({});

  const handleDownloadCsv = () => {
    downloadCsv('past-audits.csv', pastAudits);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Past Audits</h1>
      <div className="mb-4">
        {pastAudits.length > 0 && (
          <Button onClick={handleDownloadCsv}>Download CSV</Button>
        )}
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
