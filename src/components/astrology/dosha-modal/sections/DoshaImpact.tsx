'use client';

import React, { memo } from 'react';
import { Target, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { NormalizedDoshaImpact } from '@/types/dosha.types';

interface DoshaImpactProps {
    data: NormalizedDoshaImpact[];
}

export const DoshaImpact = memo(function DoshaImpact({ data }: DoshaImpactProps) {
    if (data.length === 0) return null;

    const impacts = data.filter(d => d.type === 'impact');
    const analyses = data.filter(d => d.type === 'analysis');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Impact List */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm border border-red-100 p-5">
                <h3 className="font-serif font-bold text-amber-900 mb-4 flex items-center gap-2 text-[11px] uppercase tracking-wider">
                    <Target className="w-4 h-4 text-red-500" /> Potential Manifestations
                </h3>
                <div className="space-y-3">
                    {impacts.map((item, i) => (
                        <div key={i} className="flex gap-3 items-start group">
                            <div className="p-1 px-1.5 bg-red-50 text-red-700 rounded-md text-[9px] font-black mt-0.5 transition-colors group-hover:bg-red-500 group-hover:text-white">
                                {String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[10px] font-black uppercase text-red-900/60 tracking-tight">{item.title}</h4>
                                <p className={cn(TYPOGRAPHY.value, "text-[12px] leading-relaxed")}>{item.content}</p>
                            </div>
                        </div>
                    ))}
                    {impacts.length === 0 && <p className="text-[10px] italic text-amber-700/55">General planetary analysis applies.</p>}
                </div>
            </div>

            {/* Analysis Summary */}
            <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm border border-red-100 p-5 flex flex-col">
                <h3 className="font-serif font-bold text-amber-900 mb-4 flex items-center gap-2 text-[11px] uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-red-500" /> Professional Assessment
                </h3>
                <div className="flex-1 space-y-4">
                    {analyses.map((item, i) => (
                        <div key={i} className="p-4 bg-red-50/30 rounded-xl border border-red-100/50 italic text-[12px] leading-relaxed text-amber-800/80 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
                            "{item.content}"
                        </div>
                    ))}
                    {analyses.length === 0 && (
                        <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/60 border-dashed text-[10px] text-center italic text-amber-700/55">
                            Detailed summary not specified.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

