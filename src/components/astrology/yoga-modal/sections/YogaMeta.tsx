'use client';

import React, { memo } from 'react';
import { User, Calendar, Clock, Compass, MapPin } from 'lucide-react';
import type { NormalizedMeta } from '@/types/yoga.types';
import { KnowledgeTooltip } from '@/components/knowledge';

interface YogaMetaProps {
    data: NormalizedMeta;
}

export const YogaMeta = memo(function YogaMeta({ data }: YogaMetaProps) {
    const chips = [
        data.userName && { icon: User, label: data.userName },
        data.birthDate && { icon: Calendar, label: data.birthDate },
        data.birthTime && { icon: Clock, label: data.birthTime },
        data.ascendantSign && { icon: Compass, label: <>{data.ascendantSign} <KnowledgeTooltip term="lagna" unstyled>Lagna</KnowledgeTooltip></> },
        data.ayanamsa && { icon: MapPin, label: data.ayanamsa },
    ].filter(Boolean) as { icon: React.ElementType; label: React.ReactNode }[];

    if (chips.length === 0) return null;

    return (
        <div className="flex items-center gap-4 flex-wrap text-[12px] bg-surface-warm/30 px-4 py-2.5 rounded-xl border border-gold-primary/15">
            {chips.map((chip, i) => (
                <React.Fragment key={i}>
                    {i > 0 && <div className="w-px h-3 bg-gold-primary/15" />}
                    <div className="flex items-center gap-1.5 text-ink">
                        <chip.icon className="w-3 h-3 opacity-70" />
                        <span className="font-medium">{chip.label}</span>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
});

