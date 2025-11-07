'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlusCircledIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/navigation';

export function EmptyState() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Image
        src="/file.svg"
        alt="No projects"
        width={64}
        height={64}
        className="mb-4 opacity-50"
      />
      <h2 className="text-xl font-semibold mb-2">No Projects Found</h2>
      <p className="text-muted-foreground mb-4">
        It looks like you haven't created any projects yet.
      </p>
      <Button onClick={() => router.push('/projects/new')}>
        <PlusCircledIcon className="w-4 h-4 mr-2" />
        Create Project
      </Button>
    </div>
  );
}
