"use client";

import { useState } from "react";
import { Heart, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { useSavedMatches, useDeleteMatch } from "@/hooks/queries/useMatchmaking";
import { useToast } from "@/context/ToastContext";

const VERDICT_BADGE: Record<string, { variant: "success" | "default" | "warning" | "error"; label: string }> = {
    excellent: { variant: "success", label: "Excellent" },
    good: { variant: "default", label: "Good" },
    average: { variant: "warning", label: "Average" },
    below_average: { variant: "error", label: "Below Avg" },
};

export default function SavedMatchesPage() {
    const { data: matches, isLoading } = useSavedMatches();
    const deleteMutation = useDeleteMatch();
    const toast = useToast();
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

    const handleDelete = async (matchId: string) => {
        try {
            await deleteMutation.mutateAsync(matchId);
            setConfirmDeleteId(null);
            toast.success("Match deleted");
        } catch {
            toast.error("Failed to delete match");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-[30px] font-serif text-ink font-bold mb-1">Saved Matches</h1>
                <p className="text-ink/45 font-serif italic">Previously analyzed match results</p>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : matches && matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matches.map((match) => {
                        const badge = VERDICT_BADGE[match.result.overallVerdict] ?? VERDICT_BADGE.average;
                        const isConfirming = confirmDeleteId === match.id;
                        return (
                            <div key={match.id} className="prem-card rounded-xl p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="text-[14px] font-serif font-semibold text-ink">
                                            {match.result.bride.name} &amp; {match.result.groom.name}
                                        </p>
                                        <p className="text-[12px] text-ink/45 mt-0.5">
                                            Saved {new Date(match.savedAt).toLocaleDateString("en-IN")}
                                        </p>
                                    </div>
                                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[18px] font-serif font-bold text-ink">{match.result.totalScore}/36</span>
                                    <div className="flex items-center gap-3">
                                        {isConfirming ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-[12px] text-status-error">Delete?</span>
                                                <button
                                                    onClick={() => handleDelete(match.id)}
                                                    disabled={deleteMutation.isPending}
                                                    className="text-[12px] font-medium text-status-error hover:text-red-700 transition-colors"
                                                >
                                                    Yes
                                                </button>
                                                <button
                                                    onClick={() => setConfirmDeleteId(null)}
                                                    className="text-[12px] font-medium text-ink/45 hover:text-ink transition-colors"
                                                >
                                                    No
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setConfirmDeleteId(match.id)}
                                                className="text-ink/45 hover:text-status-error transition-colors"
                                                aria-label={`Delete match between ${match.result.bride.name} and ${match.result.groom.name}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <Link
                                            href={`/matchmaking/gun-milan?id=${match.id}`}
                                            className="inline-flex items-center gap-1 text-[12px] font-medium text-gold-primary hover:text-gold-dark transition-colors"
                                        >
                                            View details <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
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
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-softwhite bg-gold-dark rounded-lg hover:bg-gold-primary transition-colors"
                        >
                            New Match Analysis <ArrowRight className="w-4 h-4" />
                        </Link>
                    }
                />
            )}
        </div>
    );
}
