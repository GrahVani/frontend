"use client";

import { useSearchParams } from "next/navigation";
import { Star, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";
import GunaChart from "@/components/matchmaking/GunaChart";
import MatchScoreCard from "@/components/matchmaking/MatchScoreCard";
import DoshaComparisonView from "@/components/matchmaking/DoshaComparisonView";
import { useSavedMatch } from "@/hooks/queries/useMatchmaking";
import { ASHTA_KOOTA_NAMES, ASHTA_KOOTA_MAX_SCORES } from "@/types/matchmaking.types";

export default function GunMilanPage() {
    const searchParams = useSearchParams();
    const matchId = searchParams.get("id");
    const { data: savedMatch, isLoading } = useSavedMatch(matchId);
    const result = savedMatch?.result ?? null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-header-gradient rounded-xl p-6 border border-gold-primary/30">
                <div className="flex items-center gap-2 mb-1">
                    <Star className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-[24px] font-bold text-softwhite">Gun Milan</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-[14px] max-w-2xl">
                    The Ashta Koota system evaluates 8 criteria for compatibility, totaling 36 points.
                </p>
            </div>

            {/* Loaded Match Results */}
            {matchId && isLoading && (
                <div className="flex items-center justify-center gap-2 py-8 text-ink/45">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-[14px] font-serif">Loading match details...</span>
                </div>
            )}

            {result && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MatchScoreCard result={result} />
                        <GunaChart kootas={result.kootas} totalScore={result.totalScore} />
                    </div>
                    <DoshaComparisonView result={result} />
                </div>
            )}

            {matchId && !isLoading && !result && (
                <div className="bg-status-warning/10 border border-status-warning/30 rounded-xl p-4 text-center">
                    <p className="text-[14px] font-serif text-ink">Match not found</p>
                    <p className="text-[12px] text-ink/45 mt-1">This match may have been deleted.</p>
                </div>
            )}

            {/* Reference Table */}
            <div className="prem-card rounded-xl p-5">
                <h3 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                    Ashta Koota Reference
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full" role="table">
                        <thead>
                            <tr className="border-b border-gold-primary/15">
                                <th className="text-left text-[12px] font-serif font-semibold text-ink py-2 pr-4">#</th>
                                <th className="text-left text-[12px] font-serif font-semibold text-ink py-2 pr-4">Koota</th>
                                <th className="text-center text-[12px] font-serif font-semibold text-ink py-2 px-4">Max Points</th>
                                <th className="text-left text-[12px] font-serif font-semibold text-ink py-2 pl-4">What It Measures</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ASHTA_KOOTA_NAMES.map((name, i) => (
                                <tr key={name} className="border-b border-gold-primary/10">
                                    <td className="py-2.5 pr-4 text-[14px] text-ink/45">{i + 1}</td>
                                    <td className="py-2.5 pr-4 text-[14px] font-serif font-semibold text-ink">{name}</td>
                                    <td className="py-2.5 px-4 text-center text-[14px] font-bold text-gold-dark">{ASHTA_KOOTA_MAX_SCORES[name]}</td>
                                    <td className="py-2.5 pl-4 text-[12px] text-ink/45">
                                        {getKootaDescription(name)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="border-t-2 border-gold-primary/20">
                                <td className="py-2.5 pr-4" />
                                <td className="py-2.5 pr-4 text-[14px] font-serif font-bold text-ink">Total</td>
                                <td className="py-2.5 px-4 text-center text-[14px] font-bold text-gold-dark">36</td>
                                <td />
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Scoring Guide */}
            <div className="prem-card rounded-xl p-5">
                <h3 className="text-[12px] font-bold text-gold-dark tracking-widest font-serif uppercase mb-4">
                    Scoring Guide
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-status-success/10 border border-status-success/30 rounded-lg p-3 text-center">
                        <span className="text-[18px] font-serif font-bold text-status-success block">28-36</span>
                        <span className="text-[12px] text-ink/45">Excellent Match</span>
                    </div>
                    <div className="bg-gold-primary/10 border border-gold-primary/30 rounded-lg p-3 text-center">
                        <span className="text-[18px] font-serif font-bold text-gold-dark block">18-27</span>
                        <span className="text-[12px] text-ink/45">Good Match</span>
                    </div>
                    <div className="bg-status-warning/10 border border-status-warning/30 rounded-lg p-3 text-center">
                        <span className="text-[18px] font-serif font-bold text-status-warning block">10-17</span>
                        <span className="text-[12px] text-ink/45">Average Match</span>
                    </div>
                    <div className="bg-status-error/10 border border-status-error/30 rounded-lg p-3 text-center">
                        <span className="text-[18px] font-serif font-bold text-status-error block">0-9</span>
                        <span className="text-[12px] text-ink/45">Below Average</span>
                    </div>
                </div>
            </div>

            {!matchId && (
                <EmptyState
                    icon={Star}
                    title="Run a match analysis to see results here"
                    description="Start a new match analysis from the main matchmaking page to see detailed Gun Milan results."
                    action={
                        <Link
                            href="/matchmaking"
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-softwhite bg-gold-dark rounded-lg hover:bg-gold-primary transition-colors"
                        >
                            New Match <ArrowRight className="w-4 h-4" />
                        </Link>
                    }
                />
            )}
        </div>
    );
}

function getKootaDescription(name: string): string {
    const descriptions: Record<string, string> = {
        "Varna": "Spiritual compatibility and ego levels",
        "Vashya": "Mutual attraction and dominance patterns",
        "Tara": "Destiny compatibility and fortune alignment",
        "Yoni": "Physical and sexual compatibility",
        "Graha Maitri": "Mental wavelength and friendship",
        "Gana": "Temperament compatibility (Deva, Manushya, Rakshasa)",
        "Bhakoot": "Love, family welfare, and financial prosperity",
        "Naadi": "Health, genes, and progeny compatibility",
    };
    return descriptions[name] ?? "";
}
