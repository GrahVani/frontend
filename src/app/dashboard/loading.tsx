import { SkeletonCard } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300" role="status" aria-label="Loading dashboard" aria-busy="true">
            <div className="space-y-2">
                <div className="h-10 w-48 bg-parchment/50 rounded-lg animate-pulse" />
                <div className="h-5 w-64 bg-parchment/30 rounded-lg animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="col-span-full lg:col-span-2"><SkeletonCard /></div>
                <SkeletonCard />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
        </div>
    );
}
