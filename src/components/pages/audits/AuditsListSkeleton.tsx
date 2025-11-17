import { Skeleton } from "@/components/ui/skeleton";

export function AuditsListSkeleton() {
  return (
    <div className="p-10 space-y-8">
      <Skeleton className="h-10 max-w-sm" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
