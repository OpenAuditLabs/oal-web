import Image from 'next/image';
interface QueuedAuditCountProps {
  count: number;
  className?: string;
}

export default function QueuedAuditCount({ count, className = "" }: QueuedAuditCountProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-yellow-50 border border-yellow-300 ${className}`}>
      <span className="text-sm font-medium text-yellow-800">
        {count} Queued Scan{count !== 1 ? 's' : ''}
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
