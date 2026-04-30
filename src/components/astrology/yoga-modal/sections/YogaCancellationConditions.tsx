'use client';

import React, { memo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { CancellationFactor } from '@/types/yoga.types';

interface YogaCancellationConditionsProps {
    data: CancellationFactor[];
}

export const YogaCancellationConditions = memo(function YogaCancellationConditions({ data }: YogaCancellationConditionsProps) {
    if (data.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
            <h3 className="font-serif font-bold text-amber-900 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> <KnowledgeTooltip term="yoga" unstyled>Cancellation Factors</KnowledgeTooltip>
            </h3>

            <div className="space-y-2.5">
                {data.map((factor, i) => (
                    <div
                        key={i}
                        className={cn(
                            'flex items-start gap-3 p-3 rounded-xl border transition-colors',
                            factor.verified
                                ? 'bg-emerald-50/50 border-emerald-100'
                                : 'bg-white border-amber-200/60'
                        )}
                    >
                        <div className="shrink-0 mt-0.5">
                            <ShieldCheck className={cn(
                                'w-3.5 h-3.5',
                                factor.verified ? 'text-emerald-500' : 'text-amber-900 opacity-40'
                            )} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[12px] font-bold text-amber-900">{factor.factor}</span>
                                {factor.strength && (
                                    <span className="px-1.5 py-0.5 bg-amber-50/60 text-amber-900 border border-amber-200/60 rounded-full text-[8px] font-bold uppercase">
                                        {factor.strength}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-amber-900 leading-relaxed">{factor.description}</p>
                            {factor.impact && (
                                <p className="text-[10px] text-amber-900 opacity-70 mt-1 italic">{factor.impact}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

