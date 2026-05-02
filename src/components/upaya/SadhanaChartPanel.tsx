import React from 'react';
import { ChartWithPopup } from '../astrology/NorthIndianChart';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { parseChartData } from '@/lib/chart-helpers';
import { KnowledgeTooltip } from '@/components/knowledge';

interface SadhanaChartPanelProps {
    chartData: Record<string, unknown>;
    doshaStatus?: Record<string, boolean>;
}

export default function SadhanaChartPanel({ chartData }: SadhanaChartPanelProps) {
    const parsed = parseChartData(chartData);
    const { planets, ascendant: ascendantSign } = parsed;

    if (planets.length === 0) return null;

    return (
        <div className={cn("flex flex-col h-full max-h-[450px] w-full overflow-hidden rounded-lg border border-amber-300/60 bg-amber-50/60", COLORS.wbContainer)}>
            {/* Header - Matching workbench style */}
            <div className="bg-amber-50 px-3 py-1.5 border-b border-amber-200/60 flex justify-between items-center shrink-0">
                <h3 className="font-serif text-[18px] font-semibold text-primary leading-tight tracking-wide">
                    Horoscope projection
                </h3>
                <div className="px-2 py-0.5 bg-amber-50 rounded border border-amber-200/60">
                    <span className={cn(TYPOGRAPHY.label, "text-primary !mb-0")}><KnowledgeTooltip term="ayanamsa_lahiri" unstyled>Lahiri</KnowledgeTooltip></span>
                </div>
            </div>

            {/* Chart Area — Full space, no whitespace, matching workbench */}
            <div className="flex-1 min-h-0 w-full bg-amber-50/60">
                <ChartWithPopup
                    planets={planets}
                    ascendantSign={ascendantSign}
                    className="bg-transparent border-none w-full h-full"
                    preserveAspectRatio="none"
                    showDegrees={true}
                />
            </div>
        </div>
    );
}
