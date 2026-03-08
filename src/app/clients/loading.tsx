import { SkeletonTable } from "@/components/ui/Skeleton";

export default function ClientsLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300" role="status" aria-label="Loading clients" aria-busy="true">
            <div className="space-y-2">
                <div className="h-10 w-40 bg-surface-warm/50 rounded-lg animate-pulse" />
                <div className="h-5 w-56 bg-surface-warm/30 rounded-lg animate-pulse" />
            </div>
            <SkeletonTable rows={8} />
        </div>
    );
}
