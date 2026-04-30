'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { Info } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { NormalizedDescription } from '@/types/yoga.types';

interface YogaDescriptionProps {
    data: NormalizedDescription;
}

export const YogaDescription = memo(function YogaDescription({ data }: YogaDescriptionProps) {
    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
            <h3 className="font-serif font-bold text-amber-900 mb-3 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <Info className="w-4 h-4 text-amber-500" /> Analysis
            </h3>
            <p className={cn(TYPOGRAPHY.value, "text-[12px] leading-relaxed")}>{data.text}</p>
            {data.explanation && data.text !== data.explanation && (
                <div className="mt-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 italic text-[11px] leading-relaxed text-amber-900 opacity-80">
                    &ldquo;{data.explanation}&rdquo;
                </div>
            )}
        </div>
    );
});

