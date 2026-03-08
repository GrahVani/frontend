'use client';

import React, { memo } from 'react';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import type { NormalizedStrength } from '@/types/yoga.types';

interface YogaStrengthIndicatorProps {
    data: NormalizedStrength;
}

export const YogaStrengthIndicator = memo(function YogaStrengthIndicator({ data }: YogaStrengthIndicatorProps) {
    const { base, penalty, final, label, functionalStatus, specialFeatures } = data;

    const strengthLabel = label
        ?.split('_')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
        <div className="prem-card p-5">
            <h3 className="font-serif font-bold text-ink mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <Activity className="w-4 h-4 text-gold-primary" /> Strength Assessment
            </h3>

            {/* Score Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {base !== undefined && (
                    <div className="bg-white rounded-xl border border-gold-primary/15 p-3 text-center">
                        <span className="block text-[9px] text-ink opacity-60 uppercase font-bold tracking-wider">Base</span>
                        <span className={cn(TYPOGRAPHY.sectionTitle, "")}>{base}</span>
                    </div>
                )}
                {penalty !== undefined && penalty !== 0 && (
                    <div className="bg-red-50/50 rounded-xl border border-red-100 p-3 text-center">
                        <span className="block text-[9px] text-red-600 uppercase font-bold tracking-wider">Penalty</span>
                        <span className="text-[18px] font-serif font-bold text-red-700">{penalty}</span>
                    </div>
                )}
                <div className="bg-gold-primary/5 rounded-xl border border-gold-primary/20 p-3 text-center">
                    <span className="block text-[9px] text-ink opacity-60 uppercase font-bold tracking-wider">Final</span>
                    <span className="text-[18px] font-serif font-bold text-gold-dark">{final}</span>
                </div>
            </div>

            {/* Strength Label */}
            {strengthLabel && (
                <div className="flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-primary" />
                    <span className="text-[12px] font-bold text-ink">{strengthLabel}</span>
                </div>
            )}

            {/* Functional Status */}
            {functionalStatus && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(functionalStatus).map(([key, value]) => (
                        value && (
                            <span
                                key={key}
                                className={cn(
                                    "px-2.5 py-1 rounded-full text-[10px] font-bold border capitalize",
                                    value === 'benefic' || value === 'beneficial'
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : value === 'malefic'
                                            ? "bg-red-50 text-red-700 border-red-200"
                                            : "bg-surface-warm text-ink border-gold-primary/15"
                                )}
                            >
                                {key}: {value}
                            </span>
                        )
                    ))}
                </div>
            )}

            {/* Special Features */}
            {specialFeatures && specialFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {specialFeatures.map(feature => (
                        <span
                            key={feature}
                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-primary/10 text-gold-dark border border-gold-primary/20 rounded-full text-[10px] font-bold capitalize"
                        >
                            <Sparkles className="w-2.5 h-2.5" />
                            {feature.replace(/_/g, ' ')}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
});

