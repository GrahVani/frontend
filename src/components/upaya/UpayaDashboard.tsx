import React from 'react';
import { cn } from "@/lib/utils";
import ChartAlignmentPanel from '@/components/upaya/ChartAlignmentPanel';
import VigorTimelinePanel from '@/components/upaya/VigorTimelinePanel';
import GemstoneAnalysisCard from '@/components/upaya/GemstoneAnalysisCard';

import { Sparkles, ShieldAlert, BadgeCheck, User } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface GemstoneEntry {
    planet: string;
    gemstone?: string;
    [key: string]: unknown;
}

interface UpayaDashboardData {
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

interface UpayaDashboardProps {
    data: UpayaDashboardData;
    className?: string;
    compact?: boolean;
}

export default function UpayaDashboard({ data, className, compact }: UpayaDashboardProps) {
    if (!data) return null;

    // Mapping for new JSON structure
    const recommended = data.recommended_gemstones || [];
    const notRecommended = data.not_recommended_gemstones || [];
    const meta = data.meta || {};

    return (
        <div className={cn(
            compact ? "space-y-4 pb-4" : "min-h-screen p-4 lg:p-6 space-y-8 pb-20",
            "animate-in fade-in duration-700",
            className
        )}>

            {/* 2. Main High-Impact Recommendations Section */}
            <div className={compact ? "space-y-3" : "space-y-6"}>
                <div className="flex items-center gap-3 px-2">
                    <BadgeCheck className={cn(compact ? "w-5 h-5" : "w-6 h-6", "text-emerald-600")} />
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, compact ? "text-[16px] font-black" : "text-[20px] font-black")}>Recommended <KnowledgeTooltip term="general_gemstone">gemstones</KnowledgeTooltip></h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-100 to-transparent ml-4" />
                </div>

                {recommended.length > 0 ? (
                    <div className={cn(
                        "grid gap-4",
                        compact ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    )}>
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
                    <div className={cn(compact ? "p-6" : "p-12", "text-center bg-amber-50/60 rounded-2xl border-2 border-dashed border-amber-200/60")}>
                        <Sparkles className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
                        <p className="text-[14px] font-medium text-amber-700/45 italic">No specific gemstones required for current karma.</p>
                    </div>
                )}
            </div>

            {/* 3. Cautionary Guidance Section (Not Recommended) */}
            {notRecommended.length > 0 && (
                <div className={cn(compact ? "space-y-3 pt-4" : "space-y-6 pt-6")}>
                    <div className="flex items-center gap-3 px-2">
                        <ShieldAlert className={cn(compact ? "w-5 h-5" : "w-6 h-6", "text-red-600")} />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, compact ? "text-[16px] font-black" : "text-[20px] font-black")}>Caution: avoid these <KnowledgeTooltip term="general_gemstone">gemstones</KnowledgeTooltip></h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-red-100 to-transparent ml-4" />
                    </div>

                    <div className={cn(
                        "grid gap-4 items-stretch",
                        compact ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    )}>
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

            {/* 4. Technical Insight Panels (Chart & Vigor) - Integrated if available */}
            {(data.chart_details || data.planetary_strength_analysis) && (
                <div className={cn(
                    "grid gap-8",
                    compact ? "grid-cols-1 pt-4" : "grid-cols-1 lg:grid-cols-2 pt-8"
                )}>
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
