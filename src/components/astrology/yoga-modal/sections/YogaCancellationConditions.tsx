'use client';

import React, { memo } from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CancellationFactor } from '@/types/yoga.types';

interface YogaCancellationConditionsProps {
    data: CancellationFactor[];
}

export const YogaCancellationConditions = memo(function YogaCancellationConditions({ data }: YogaCancellationConditionsProps) {
    if (data.length === 0) return null;

    return (
        <div className="prem-card p-5">
            <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-gold-primary" /> Cancellation Factors
            </h3>

            <div className="space-y-2.5">
                {data.map((factor, i) => (
                    <div
                        key={i}
                        className={cn(
                            'flex items-start gap-3 p-3 rounded-xl border transition-colors',
                            factor.verified
                                ? 'bg-emerald-50/50 border-emerald-100'
                                : 'bg-white border-gold-primary/15'
                        )}
                    >
                        <div className="shrink-0 mt-0.5">
                            <ShieldCheck className={cn(
                                'w-3.5 h-3.5',
                                factor.verified ? 'text-emerald-500' : 'text-ink opacity-40'
                            )} />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[12px] font-bold text-ink">{factor.factor}</span>
                                {factor.strength && (
                                    <span className="px-1.5 py-0.5 bg-surface-warm text-ink border border-gold-primary/15 rounded-full text-[8px] font-bold uppercase">
                                        {factor.strength}
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-ink leading-relaxed">{factor.description}</p>
                            {factor.impact && (
                                <p className="text-[10px] text-ink opacity-70 mt-1 italic">{factor.impact}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

