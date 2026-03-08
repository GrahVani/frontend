import { SkeletonCard } from "@/components/ui/Skeleton";

export default function CalendarLoading() {
    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300" role="status" aria-label="Loading calendar" aria-busy="true">
            <div className="h-24 bg-surface-warm/50 rounded-xl animate-pulse" />
            <SkeletonCard />
        </div>
    );
}
