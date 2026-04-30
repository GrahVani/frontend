'use client';

import React, { memo } from 'react';
import { MapPin } from 'lucide-react';
import { KnowledgeTooltip } from '@/components/knowledge';
import type { NormalizedHouse } from '@/types/yoga.types';

interface YogaHousesGridProps {
    data: NormalizedHouse[];
}

export const YogaHousesGrid = memo(function YogaHousesGrid({ data }: YogaHousesGridProps) {
    if (data.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
            <h3 className="font-serif font-bold text-amber-900 mb-3 flex items-center gap-2 text-[14px] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-amber-500" /> <KnowledgeTooltip term="bhava" unstyled>House Placements</KnowledgeTooltip>
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {data.map(house => (
                    <div
                        key={house.houseNumber}
                        className="bg-white border border-amber-200/60 rounded-lg p-2 text-center hover:border-amber-300 transition-colors"
                    >
                        <span className="block text-[9px] text-amber-900 opacity-60 font-bold uppercase">H{house.houseNumber}</span>
                        <span className="block text-[12px] font-serif font-bold text-amber-900 mt-0.5">{house.sign}</span>
                        {house.lord && (
                            <span className="block text-[8px] text-amber-700 font-bold mt-0.5">{house.lord}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

