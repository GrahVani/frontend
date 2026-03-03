"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import MatchInputForm from "@/components/matchmaking/MatchInputForm";
import GunaChart from "@/components/matchmaking/GunaChart";
import MatchScoreCard from "@/components/matchmaking/MatchScoreCard";
import EmptyState from "@/components/ui/EmptyState";
import type { BirthDetails, MatchResult } from "@/types/matchmaking.types";

export default function MatchmakingPage() {
    const [result, setResult] = useState<MatchResult | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async (bride: BirthDetails, groom: BirthDetails) => {
        setLoading(true);
        try {
            // TODO: Replace with actual API call via useMatchAnalysis
            // For now, show the empty state after form submit
            setResult(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-header-gradient rounded-xl p-6 border border-header-border/30">
                <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-5 h-5 text-active-glow" />
                    <h1 className="font-serif text-2xl font-bold text-softwhite">New Match Analysis</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-sm max-w-2xl">
                    Analyze compatibility between prospective partners using the Ashta Koota (36-point) method.
                </p>
            </div>

            <MatchInputForm onSubmit={handleAnalyze} loading={loading} />

            {result ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MatchScoreCard result={result} />
                    <GunaChart kootas={result.kootas} totalScore={result.totalScore} />
                </div>
            ) : (
                <EmptyState
                    icon={Heart}
                    title="Enter birth details to begin"
                    description="Fill in the bride and groom birth details above, then click 'Analyze Compatibility' to see the Ashta Koota matching results."
                />
            )}
        </div>
    );
}
