'use client';

import React, { memo } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';

interface YogaCoreMetricsProps {
    data: Record<string, Record<string, string>>;
}

export const YogaCoreMetrics = memo(function YogaCoreMetrics({ data }: YogaCoreMetricsProps) {
    const categories = Object.entries(data).filter(([_, items]) => Object.keys(items).length > 0);
    
    if (categories.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-surface-warm to-white border border-amber-200/60 rounded-xl p-5 shadow-sm">
            <h3 className="font-serif font-bold text-amber-900 mb-4 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <Compass className="w-4 h-4 text-amber-500" /> 
                <KnowledgeTooltip term="jaimini_system" unstyled>Core Measurements</KnowledgeTooltip>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map(([categoryName, items]) => (
                    <div key={categoryName} className="space-y-2">
                        <h4 className="text-[11px] font-bold text-amber-700 tracking-wide uppercase border-b border-amber-200/60 pb-1">
                            {categoryName}
                        </h4>
                        <div className="space-y-1.5 pt-1">
                            {Object.entries(items).map(([key, val]) => (
                                <div key={key} className="flex justify-between items-baseline gap-2 group">
                                    <span className="text-[12px] font-medium text-zinc-600 transition-colors group-hover:text-amber-900">
                                        {key.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-[12px] font-bold text-amber-900 text-right break-words shrink-0 max-w-[60%]">
                                        {val}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
