import { EmptyState } from '@/components/pages/audits/EmptyState';

export default function PastAuditsPage() {
  // Placeholder for fetching past audits
  const pastAudits: any[] = []; // Simulate no past audits for now

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Past Audits</h1>
      {pastAudits.length === 0 ? (
        <EmptyState />
      ) : (
        <p className="text-sm text-muted-foreground">Placeholder past audits content.</p>
      )}
    </div>
  );
}
