import { getCount } from '@/actions/projects/getCount/logic';
import { EmptyState } from '@/components/pages/projects/EmptyState';

export default async function ProjectsPage() {
  const count = await getCount();

  if (count === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      <p className="text-sm text-muted-foreground">Placeholder projects content.</p>
    </div>
  );
}
