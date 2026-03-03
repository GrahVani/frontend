import { SkeletonCard } from "@/components/ui/Skeleton";

export default function MatchmakingLoading() {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300" role="status" aria-label="Loading matchmaking" aria-busy="true">
            <div className="h-24 bg-parchment/50 rounded-xl animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonCard />
                <SkeletonCard />
            </div>
        </div>
    );
}
