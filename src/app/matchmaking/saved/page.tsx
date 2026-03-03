"use client";

import { Heart, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useSavedMatches } from "@/hooks/queries/useMatchmaking";

const VERDICT_BADGE: Record<string, { variant: "success" | "default" | "warning" | "error"; label: string }> = {
    excellent: { variant: "success", label: "Excellent" },
    good: { variant: "default", label: "Good" },
    average: { variant: "warning", label: "Average" },
    below_average: { variant: "error", label: "Below Avg" },
};

export default function SavedMatchesPage() {
    const { data: matches, isLoading } = useSavedMatches();

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-serif text-ink font-bold mb-1">Saved Matches</h1>
                <p className="text-muted-refined font-serif italic">Previously analyzed match results</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : matches && matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matches.map((match) => {
                        const badge = VERDICT_BADGE[match.result.overallVerdict] ?? VERDICT_BADGE.average;
                        return (
                            <div key={match.id} className="bg-softwhite border border-antique rounded-xl p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-sm font-serif font-semibold text-ink">
                                            {match.result.bride.name} &amp; {match.result.groom.name}
                                        </p>
                                        <p className="text-xs text-muted-refined mt-0.5">
                                            Saved {new Date(match.savedAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-serif font-bold text-ink">{match.result.totalScore}/36</span>
                                    <Link
                                        href={`/matchmaking/gun-milan?id=${match.id}`}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-gold-primary hover:text-gold-dark transition-colors"
                                    >
                                        View details <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <EmptyState
                    icon={Heart}
                    title="No saved matches"
                    description="Completed match analyses will appear here. Start a new match analysis to save results."
                    action={
                        <Link
                            href="/matchmaking"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-softwhite bg-gold-dark rounded-lg hover:bg-gold-primary transition-colors"
                        >
                            New Match Analysis <ArrowRight className="w-4 h-4" />
                        </Link>
                    }
                />
            )}
        </div>
    );
}
