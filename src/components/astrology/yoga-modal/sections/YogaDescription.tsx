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
        <div className="prem-card p-5">
            <h3 className="font-serif font-bold text-ink mb-3 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <Info className="w-4 h-4 text-gold-primary" /> Analysis
            </h3>
            <p className={cn(TYPOGRAPHY.value, "text-[12px] leading-relaxed")}>{data.text}</p>
            {data.explanation && data.text !== data.explanation && (
                <div className="mt-3 p-3 bg-surface-warm/50 rounded-xl border border-gold-primary/15 italic text-[11px] leading-relaxed text-ink opacity-80">
                    &ldquo;{data.explanation}&rdquo;
                </div>
            )}
        </div>
    );
});

