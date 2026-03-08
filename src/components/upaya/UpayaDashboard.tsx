import React from 'react';
import { cn } from "@/lib/utils";
import ChartAlignmentPanel from '@/components/upaya/ChartAlignmentPanel';
import VigorTimelinePanel from '@/components/upaya/VigorTimelinePanel';
import GemstoneAnalysisCard from '@/components/upaya/GemstoneAnalysisCard';

import { Sparkles, ShieldAlert, BadgeCheck, User } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';

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
}

export default function UpayaDashboard({ data, className }: UpayaDashboardProps) {
    if (!data) return null;

    // Mapping for new JSON structure
    const recommended = data.recommended_gemstones || [];
    const notRecommended = data.not_recommended_gemstones || [];
    const meta = data.meta || {};

    return (
        <div className={cn("min-h-screen p-4 lg:p-6 space-y-8 animate-in fade-in duration-700 pb-20", className)}>



            {/* 2. Main High-Impact Recommendations Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <BadgeCheck className="w-6 h-6 text-emerald-600" />
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-black")}>Recommended gemstones</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-100 to-transparent ml-4" />
                </div>

                {recommended.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    <div className="p-12 text-center bg-surface-warm/30 rounded-2xl border-2 border-dashed border-gold-primary/15">
                        <Sparkles className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
                        <p className="text-[14px] font-medium text-ink/45 italic">No specific gemstones required for current karma.</p>
                    </div>
                )}
            </div>

            {/* 3. Cautionary Guidance Section (Not Recommended) */}
            {notRecommended.length > 0 && (
                <div className="space-y-6 pt-6">
                    <div className="flex items-center gap-3 px-2">
                        <ShieldAlert className="w-6 h-6 text-red-600" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[20px] font-black")}>Caution: avoid these gemstones</h3>
                        <div className="h-px flex-1 bg-gradient-to-r from-red-100 to-transparent ml-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
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
