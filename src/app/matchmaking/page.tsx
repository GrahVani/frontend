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
            {/* Header */}
            <div className="prem-card glass-shimmer relative overflow-hidden p-5">
                <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                         style={{
                             background: 'linear-gradient(135deg, rgba(201,162,77,0.18) 0%, rgba(139,90,43,0.10) 100%)',
                             border: '1px solid rgba(201,162,77,0.25)',
                             boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 6px rgba(139,90,43,0.08)',
                         }}>
                        <Heart className="w-5 h-5 text-gold-dark" />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-serif font-bold text-ink leading-tight">New Match Analysis</h1>
                        <p className="text-[13px] text-ink/50 font-medium mt-0.5">
                            Analyze compatibility using the Ashta Koota (36-point) method
                        </p>
                    </div>
                </div>
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
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white rounded-xl transition-all disabled:opacity-50"
                            style={{
                                background: 'linear-gradient(135deg, rgba(201,162,77,0.90) 0%, rgba(139,90,43,0.85) 100%)',
                                boxShadow: '0 2px 8px rgba(139,90,43,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
                            }}
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
