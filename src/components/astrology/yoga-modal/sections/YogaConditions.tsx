'use client';

import React, { memo } from 'react';
import { CheckCircle2, XCircle, ListChecks } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { NormalizedConditions } from '@/types/yoga.types';

interface YogaConditionsProps {
    data: NormalizedConditions;
}

export const YogaConditions = memo(function YogaConditions({ data }: YogaConditionsProps) {
    const { met, failed } = data;

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
            <h3 className="font-serif font-bold text-amber-900 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <ListChecks className="w-4 h-4 text-amber-500" /> <KnowledgeTooltip term="yoga" unstyled>Formation Conditions</KnowledgeTooltip>
            </h3>

            <div className="space-y-4">
                {/* Met Conditions */}
                {met.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">
                            âœ¦ Conditions Satisfied ({met.length})
                        </h4>
                        {met.map((condition, i) => (
                            <div key={i} className="flex items-start gap-2.5 group">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-amber-900 leading-relaxed">
                                    {condition}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Failed Conditions */}
                {failed.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-red-500 mb-2">
                            âœ¦ Conditions Not Met ({failed.length})
                        </h4>
                        {failed.map((condition, i) => (
                            <div key={i} className="flex items-start gap-2.5 group">
                                <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-amber-900 opacity-50 leading-relaxed line-through decoration-red-200">
                                    {condition}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
});

