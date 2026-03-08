import { SkeletonCard } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300" role="status" aria-label="Loading settings" aria-busy="true">
            <div className="space-y-2">
                <div className="h-10 w-52 bg-surface-warm/50 rounded-lg animate-pulse" />
                <div className="h-5 w-72 bg-surface-warm/30 rounded-lg animate-pulse" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
    );
}
