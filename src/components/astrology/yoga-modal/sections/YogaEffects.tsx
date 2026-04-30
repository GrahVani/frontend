'use client';

import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { Target } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { NormalizedEffects } from '@/types/yoga.types';

interface YogaEffectsProps {
    data: NormalizedEffects;
}

export const YogaEffects = memo(function YogaEffects({ data }: YogaEffectsProps) {
    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
            <h3 className="font-serif font-bold text-amber-900 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <Target className="w-4 h-4 text-amber-500" /> Effects & Impacts
            </h3>

            {data.specific.length > 0 && (
                <div className="space-y-2.5 mb-4">
                    {data.specific.map((effect, i) => (
                        <div key={i} className="flex gap-3 items-start group">
                            <div className="p-1 px-1.5 bg-amber-100 text-amber-900 rounded-md text-[10px] font-bold mt-0.5 group-hover:bg-amber-500 group-hover:text-white transition-colors shrink-0">
                                0{i + 1}
                            </div>
                            <p className={cn(TYPOGRAPHY.value, "text-[12px] leading-relaxed capitalize")}>
                                {effect.replace(/_/g, ' ')}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {data.overall && (
                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 italic text-[11px] leading-relaxed text-amber-900 opacity-80">
                    &ldquo;{data.overall}&rdquo;
                </div>
            )}
        </div>
    );
});

