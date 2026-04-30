'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { CheckCircle2, Stars, ChevronDown } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { NormalizedRemedyCategory } from '@/types/yoga.types';

type RemedyData = string[] | NormalizedRemedyCategory[];

interface YogaRemediesProps {
    data: RemedyData;
}

/** Type guard: is it a categorized remedy list? */
function isCategorized(data: RemedyData): data is NormalizedRemedyCategory[] {
    return data.length > 0 && typeof data[0] === 'object' && 'category' in data[0];
}

const CATEGORY_ICONS: Record<string, string> = {
    'Immediate Actions': 'ðŸ”¥',
    'Weekly Practices': 'ðŸ“…',
    'Monthly Rituals': 'ðŸŒ•',
    'Gemstone Recommendations': 'ðŸ’Ž',
    'Lifestyle Changes': 'ðŸŒ¿',
};

export const YogaRemedies = memo(function YogaRemedies({ data }: YogaRemediesProps) {
    if (data.length === 0) return null;

    // â”€â”€â”€ Categorized Remedies (daridra-style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    if (isCategorized(data)) {
        return (
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Stars className="w-14 h-14 text-amber-500" />
                </div>

                <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px] mb-4")}><KnowledgeTooltip term="upaya" unstyled>Empowering Remedies</KnowledgeTooltip></h3>

                <div className="space-y-4">
                    {data.map((cat, ci) => (
                        <details key={ci} open={ci === 0}>
                            <summary className="cursor-pointer select-none flex items-center gap-2 text-[12px] font-bold text-amber-700 hover:text-amber-500 transition-colors group">
                                <ChevronDown className="w-3 h-3 transition-transform group-open:rotate-180" />
                                <span>{CATEGORY_ICONS[cat.category] ?? 'âœ¦'} {cat.category}</span>
                                <span className="text-[9px] text-amber-900 opacity-60 ml-auto">{cat.items.length} items</span>
                            </summary>
                            <div className="flex flex-wrap gap-2 mt-2 pl-5">
                                {cat.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-2 px-3 py-1.5 bg-white border border-amber-200/60 rounded-xl shadow-sm hover:border-amber-500 transition-colors cursor-default"
                                    >
                                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
                                        <span className="text-[11px] font-medium text-amber-900 leading-snug">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </details>
                    ))}
                </div>
            </div>
        );
    }

    // â”€â”€â”€ Flat Remedies (original style) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const flatData = data as string[];
    return (
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Stars className="w-14 h-14 text-amber-500" />
            </div>

            <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-[14px] mb-3")}><KnowledgeTooltip term="upaya" unstyled>Empowering Remedies</KnowledgeTooltip></h3>

            <div className="flex flex-wrap gap-2">
                {flatData.map((remedy, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-amber-200/60 rounded-xl shadow-sm hover:border-amber-500 transition-colors cursor-default"
                    >
                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                        <span className="text-[11px] font-medium text-amber-900">{remedy}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});

