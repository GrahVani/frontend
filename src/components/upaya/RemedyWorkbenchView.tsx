"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import ChartAlignmentPanel from '@/components/upaya/ChartAlignmentPanel';
import VigorTimelinePanel from '@/components/upaya/VigorTimelinePanel';
import GemstoneAnalysisCard from '@/components/upaya/GemstoneAnalysisCard';

import { Sparkles, ShieldAlert, BadgeCheck } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';

interface GemstoneEntry {
    planet: string;
    gemstone?: string;
    [key: string]: unknown;
}

interface RemedyWorkbenchData {
    recommended_gemstones?: GemstoneEntry[];
    not_recommended_gemstones?: GemstoneEntry[];
    meta?: {
        user?: string;
        ascendant?: string;
        current_mahadasha?: string;
        current_antardasha?: string;
        lagna_lord?: string;
        life_concern?: string;
    };
    chart_details?: Record<string, unknown>;
    planetary_strength_analysis?: Record<string, unknown>;
    dasha_details?: Record<string, unknown>;
}

interface RemedyWorkbenchViewProps {
    data: RemedyWorkbenchData;
}

export default function RemedyWorkbenchView({ data }: RemedyWorkbenchViewProps) {
    if (!data) return null;

    const recommended = data.recommended_gemstones || [];
    const notRecommended = data.not_recommended_gemstones || [];

    return (
        <div className="h-full w-full overflow-auto custom-scrollbar p-5 space-y-6">
            {/* Recommended Gemstones */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <BadgeCheck className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-xl font-black text-amber-900">
                        Recommended <KnowledgeTooltip term="general_gemstone">gemstones</KnowledgeTooltip>
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-100 to-transparent ml-4" />
                </div>

                {recommended.length > 0 ? (
                    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
                        {recommended.map((gem: GemstoneEntry, idx: number) => (
                            <GemstoneAnalysisCard
                                key={gem.planet}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                                gemstone={gem as any}
                                isRecommended={true}
                                priority={idx + 1}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="p-10 text-center bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-200/60">
                        <Sparkles className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
                        <p className="text-base font-medium text-amber-700/45 italic">No specific gemstones required for current karma.</p>
                    </div>
                )}
            </div>

            {/* Not Recommended Gemstones */}
            {notRecommended.length > 0 && (
                <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-red-600" />
                        <h2 className="text-xl font-black text-amber-900">
                            Caution: avoid these <KnowledgeTooltip term="general_gemstone">gemstones</KnowledgeTooltip>
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-red-100 to-transparent ml-4" />
                    </div>

                    <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))' }}>
                        {notRecommended.map((gem: GemstoneEntry) => (
                            <GemstoneAnalysisCard
                                key={gem.planet}
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                                gemstone={gem as any}
                                isRecommended={false}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Technical Insight Panels */}
            {(data.chart_details || data.planetary_strength_analysis) && (
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 pt-2">
                    <ChartAlignmentPanel
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                        chartData={data.chart_details as any}
                        planetaryAnalysis={data.planetary_strength_analysis as Record<string, unknown>}
                    />
                    <VigorTimelinePanel
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                        strengthAnalysis={data.planetary_strength_analysis as any}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
                        dashaDetails={data.dasha_details as any}
                    />
                </div>
            )}
        </div>
    );
}
