import { SkeletonCard } from "@/components/ui/Skeleton";

export default function ChaldeanLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300" role="status" aria-label="Loading chaldean numerology" aria-busy="true">
            <div className="space-y-2">
                <div className="h-10 w-64 bg-surface-warm/50 rounded-lg animate-pulse" />
                <div className="h-5 w-96 bg-surface-warm/30 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}
