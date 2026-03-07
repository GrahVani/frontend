import React from 'react';
import { cn } from "@/lib/utils";
import ChartAlignmentPanel from '@/components/upaya/ChartAlignmentPanel';
import VigorTimelinePanel from '@/components/upaya/VigorTimelinePanel';
import GemstoneAnalysisCard from '@/components/upaya/GemstoneAnalysisCard';
import { Sparkles, ShieldAlert, BadgeCheck, User } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import styles from './UpayaDashboard.module.css';

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
        <div className={cn("animate-in fade-in duration-700 flex flex-col h-full overflow-hidden", styles.dashboardContainer, className)}>
            {/* Header Area */}
            <div className="flex-shrink-0 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between border-b border-divider pb-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[18px] lg:text-[22px] font-bold tracking-tight")}>
                        Gemstones : {String(meta.user || "Sadhaka")}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900/40">Active analysis</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Full Width Scrolling */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-6 space-y-8 no-scrollbar"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(180,83,9,0.2) transparent'
                }}>

                {/* Recommended Gemstones */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-xl font-black")}>Recommended gemstones</h3>
                    </div>

                    {recommended.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                            <p className="text-sm font-medium text-muted">No specific gemstones required for current karma.</p>
                        </div>
                    )}
                </div>

                {/* Cautionary Guidance (Not Recommended) */}
                {notRecommended.length > 0 && (
                    <div className="space-y-6 pt-6 border-t border-divider/50">
                        <div className="flex items-center gap-3 px-2">
                            <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-xl font-black")}>Caution: avoid these gemstones</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
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
            </div>
        </div>
    );
}
