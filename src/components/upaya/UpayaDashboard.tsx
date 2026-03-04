import React from 'react';
import { cn } from "@/lib/utils";
import ChartAlignmentPanel from '@/components/upaya/ChartAlignmentPanel';
import VigorTimelinePanel from '@/components/upaya/VigorTimelinePanel';
import GemstoneAnalysisCard from '@/components/upaya/GemstoneAnalysisCard';
import DebugConsole from '@/components/debug/DebugConsole';
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

            {/* 1. Meta Context Banner */}
            <div className="bg-gradient-to-r from-parchment to-white border border-antique rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-gold-primary/10 border-2 border-gold-primary/20 flex items-center justify-center text-gold-dark">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl font-black")}>{meta.user || 'Sadhaka'}</h2>
                        <div className="flex flex-wrap gap-2 mt-1">
                            <span className="text-[10px] font-bold bg-ink/5 px-2 py-0.5 rounded-full text-muted uppercase tracking-wider border border-ink/10">
                                {meta.ascendant} Ascendant
                            </span>
                            <span className="text-[10px] font-bold bg-gold-primary/5 px-2 py-0.5 rounded-full text-gold-dark uppercase tracking-wider border border-gold-primary/10">
                                {meta.current_mahadasha} - {meta.current_antardasha} Period
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-center px-4 py-2 bg-white/50 rounded-xl border border-antique">
                        <p className="text-[9px] font-black text-muted uppercase mb-0.5">Lagna Lord</p>
                        <p className="text-sm font-bold text-ink">{meta.lagna_lord}</p>
                    </div>
                    <div className="text-center px-4 py-2 bg-white/50 rounded-xl border border-antique">
                        <p className="text-[9px] font-black text-muted uppercase mb-0.5">Analysis Type</p>
                        <p className="text-sm font-bold text-gold-dark capitalize">{meta.life_concern}</p>
                    </div>
                </div>
            </div>

            {/* 2. Main High-Impact Recommendations Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <BadgeCheck className="w-6 h-6 text-emerald-600" />
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-xl font-black")}>Recommended Gemstones</h3>
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
                    <div className="p-12 text-center bg-parchment/30 rounded-2xl border-2 border-dashed border-antique/50">
                        <Sparkles className="w-12 h-12 text-gold-primary/30 mx-auto mb-4" />
                        <p className="text-sm font-medium text-muted italic">No specific gemstones required for current karma.</p>
                    </div>
                )}
            </div>

            {/* 3. Cautionary Guidance Section (Not Recommended) */}
            {notRecommended.length > 0 && (
                <div className="space-y-6 pt-6">
                    <div className="flex items-center gap-3 px-2">
                        <ShieldAlert className="w-6 h-6 text-red-600" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-xl font-black")}>Caution: Avoid These Gemstones</h3>
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

            {/* Debugging Console */}
            <DebugConsole
                title="Gemstone Raw Analysis Data"
                data={data}
            />
        </div>
    );
}
