"use client";

import { useState } from "react";
import { Heart, Save, Loader2 } from "lucide-react";
import MatchInputForm from "@/components/matchmaking/MatchInputForm";
import GunaChart from "@/components/matchmaking/GunaChart";
import MatchScoreCard from "@/components/matchmaking/MatchScoreCard";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/context/ToastContext";
import { useMatchAnalysis, useSaveMatch } from "@/hooks/queries/useMatchmaking";
import type { BirthDetails, MatchResult } from "@/types/matchmaking.types";

export default function MatchmakingPage() {
    const [result, setResult] = useState<MatchResult | null>(null);
    const toast = useToast();
    const analysisMutation = useMatchAnalysis();
    const saveMutation = useSaveMatch();

    const handleAnalyze = async (bride: BirthDetails, groom: BirthDetails) => {
        try {
            const matchResult = await analysisMutation.mutateAsync({ bride, groom });
            setResult(matchResult);
            toast.success("Match analysis complete!");
        } catch (error) {
            const message = error instanceof Error ? error.message : "Analysis failed";
            toast.error(message);
        }
    };

    const handleSave = async () => {
        if (!result) return;
        try {
            await saveMutation.mutateAsync({ result });
            toast.success("Match saved successfully!");
        } catch {
            toast.error("Failed to save match");
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

            <MatchInputForm onSubmit={handleAnalyze} loading={analysisMutation.isPending} />

            {result ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MatchScoreCard result={result} />
                        <GunaChart kootas={result.kootas} totalScore={result.totalScore} />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleSave}
                            disabled={saveMutation.isPending}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-softwhite bg-gold-dark rounded-lg hover:bg-gold-primary transition-colors disabled:opacity-50"
                        >
                            {saveMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Match Result
                        </button>
                    </div>
                </>
            ) : (
                <EmptyState
                    icon={Heart}
                    title="Enter birth details to begin"
                    description="Fill in the birth details for both persons above, then click 'Analyze Compatibility' to see the Ashta Koota matching results."
                />
            )}
        </div>
    );
}
