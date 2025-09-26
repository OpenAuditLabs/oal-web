import Image from 'next/image'

export interface ActiveScanBadgeProps {
  count: number
}

export function ActiveScanBadge({ count }: ActiveScanBadgeProps) {
  if (count <= 0) return null
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-accent text-accent-foreground border border-primary text-base font-medium mt-4">
      <span>
        {count} {count === 1 ? 'Active Scan' : 'Active Scans'}
      </span>
      <Image
        src="/icons/scan-alt.svg"
        alt={`${count} Active scan${count === 1 ? '' : 's'}`}
        width={20}
        height={20}
        className="rotate-90 text-current"
      />
    </div>
  )
}
