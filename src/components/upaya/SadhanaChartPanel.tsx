import React from 'react';
import { ChartWithPopup } from '../astrology/NorthIndianChart';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { parseChartData } from '@/lib/chart-helpers';

interface SadhanaChartPanelProps {
    chartData: Record<string, unknown>;
    doshaStatus?: Record<string, boolean>; // Still accepting but not rendering badge for UI parity
}

export default function SadhanaChartPanel({ chartData }: SadhanaChartPanelProps) {
    const parsed = parseChartData(chartData);
    const { planets, ascendant: ascendantSign } = parsed;

    // Only return null if we absolutely have no planetary data
    if (planets.length === 0) return null;

    return (
        <div className={cn("flex flex-col border border-antique shrink-0 overflow-hidden rounded-[2rem] bg-white/20", COLORS.wbContainer)}>
            {/* Standard Gochar-style Header */}
            <div className={cn("flex items-center justify-between px-4 py-2 h-11 shrink-0", COLORS.wbSectionHeader)}>
                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Horoscope projection</h3>
                <div className="px-2 py-0.5 bg-header-border/10 rounded border border-header-border/20">
                    <span className={cn(TYPOGRAPHY.label, "text-primary !mb-0")}>Lahiri</span>
                </div>
            </div>

            {/* Chart Area with Gochar background logic */}
            <div className="flex-1 flex flex-col items-center justify-start pt-0">
                <div className="w-full aspect-square -mt-3 relative">
                    {/* Subtle aura matches Gochar style */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] pointer-events-none bg-amber-400/5" />

                    <ChartWithPopup
                        planets={planets}
                        ascendantSign={ascendantSign}
                        className="w-full h-full"
                        showDegrees={false} // Match image style - cleaner labels
                    />
                </div>
            </div>

            <style jsx global>{`
                .sadhana-chart g[stroke="var(--header-border)"],
                svg g[stroke="var(--header-border)"] {
                    stroke: #B45309; /* Amber 700 */
                    stroke-opacity: 0.4;
                    stroke-width: 1.2;
                }
                svg text {
                    font-size: 16px !important;
                    font-weight: 600 !important;
                }
            `}</style>
        </div>
    );
}
