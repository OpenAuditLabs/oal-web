import Image from 'next/image';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Image
        src="/icons/scan-alt.svg"
        alt="No audits"
        width={64}
        height={64}
        className="mb-4 opacity-50"
      />
      <h2 className="text-xl font-semibold mb-2">No Past Audits Found</h2>
      <p className="text-muted-foreground">
        It looks like you haven't completed any audits yet.
      </p>
    </div>
  );
}
