import { SkeletonCard, SkeletonChart } from "@/components/ui/Skeleton";

export default function VedicAstrologyLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300" role="status" aria-label="Loading vedic astrology" aria-busy="true">
            <div className="space-y-2">
                <div className="h-10 w-52 bg-parchment/50 rounded-lg animate-pulse" />
                <div className="h-5 w-72 bg-parchment/30 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart />
                <SkeletonCard />
            </div>
        </div>
    );
}
