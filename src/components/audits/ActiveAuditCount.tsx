import Image from 'next/image';
interface ActiveAuditCountProps {
  count: number;
  className?: string;
}

export default function ActiveAuditCount({ count, className = "" }: ActiveAuditCountProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-accent border border-primary ${className}`}>
      <span className="text-sm font-medium text-foreground">
        {count} Active Scan{count !== 1 ? 's' : ''}
      </span>
      <Image
        src="/icons/scan-alt.svg"
        alt="Queued scans"
        width={20}
        height={20}
        className="rotate-90 text-current"
      />
    </div>
  );
}
