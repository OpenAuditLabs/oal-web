import { getProjectCountAction } from '@/actions/projects/getCount/action';
import { EmptyState } from '@/components/pages/projects/EmptyState';
import { getSession } from '@/lib/session';

export default async function ProjectsPage() {
  const session = await getSession();
  const userId = session?.user?.id;

  const count = await getProjectCountAction({ userId, timeframe: 'all' });

  if (count.current.value === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      <p className="text-sm text-muted-foreground">Placeholder projects content.</p>
    </div>
  );
}
