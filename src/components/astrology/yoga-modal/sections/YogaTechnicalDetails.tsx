'use client';

import React, { memo } from 'react';
import { Activity } from 'lucide-react';
import type { NormalizedTechnical } from '@/types/yoga.types';

interface YogaTechnicalDetailsProps {
    data: NormalizedTechnical;
}

export const YogaTechnicalDetails = memo(function YogaTechnicalDetails({ data }: YogaTechnicalDetailsProps) {
    return (
        <div className="bg-surface-warm rounded-2xl p-5 border border-gold-primary/15">
            <h3 className="text-[10px] font-bold text-ink uppercase tracking-widest mb-4 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-gold-primary" /> Analysis Engine
            </h3>

            {/* Critical Fixes */}
            {data.criticalFixes && data.criticalFixes.length > 0 && (
                <div className="space-y-2 mb-4 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar border-b border-gold-primary/15 pb-4">
                    {data.criticalFixes.map((fix, i) => (
                        <div key={i} className="flex gap-3 items-start group">
                            <span className="text-[9px] font-bold text-ink opacity-40 mt-0.5 shrink-0">0{i + 1}</span>
                            <p className="text-[11px] leading-tight text-ink font-medium group-hover:text-gold-dark transition-colors">{fix}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Technical Metadata */}
            <div className="grid grid-cols-2 gap-2">
                {data.ayanamsaValue && (
                    <div className="bg-surface-warm/50 border border-gold-primary/15 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-ink opacity-50 uppercase tracking-tighter">Ayanamsa</span>
                        <span className="text-[10px] font-serif font-bold text-ink">{data.ayanamsaValue}</span>
                    </div>
                )}
                {data.houseSystem && (
                    <div className="bg-surface-warm/50 border border-gold-primary/15 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-ink opacity-50 uppercase tracking-tighter">House System</span>
                        <span className="text-[10px] font-serif font-bold text-ink">{data.houseSystem}</span>
                    </div>
                )}
                {data.chartType && (
                    <div className="bg-surface-warm/50 border border-gold-primary/15 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-ink opacity-50 uppercase tracking-tighter">Chart Type</span>
                        <span className="text-[10px] font-serif font-bold text-ink">{data.chartType}</span>
                    </div>
                )}
                {data.analysisType && (
                    <div className="bg-surface-warm/50 border border-gold-primary/15 rounded-lg p-2">
                        <span className="block text-[8px] font-bold text-ink opacity-50 uppercase tracking-tighter">Analysis</span>
                        <span className="text-[10px] font-serif font-bold text-ink">{data.analysisType}</span>
                    </div>
                )}
            </div>
        </div>
    );
});

