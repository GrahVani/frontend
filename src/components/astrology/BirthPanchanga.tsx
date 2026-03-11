"use client";

import React from 'react';
import {
    Moon,
    Sun,
    Zap,
    RefreshCcw,
    CalendarDays,
    Sunrise,
    Sunset,
    MapPin,
    Calendar,
    Clock,
    Sparkle
} from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { cn } from "@/lib/utils";
import { KnowledgeTooltip, KnowledgeBatchProvider } from '@/components/knowledge';

interface PanchangaItemProps {
    label: string;
    value: string;
    subValue?: string;
    progress?: number;
    icon: React.ElementType;
    color: string;
    termKey?: string;
}

function PanchangaItem({ label, value, subValue, icon: Icon, color, termKey }: PanchangaItemProps) {
    return (
        <div className="bg-white/50 p-2 rounded-xl border border-gold-primary/15 flex items-center gap-2 shadow-sm group hover:border-gold-primary/30 transition-all">
            <div className={cn("p-1.5 rounded-lg bg-white shrink-0 shadow-xs group-hover:bg-gold-primary/5 transition-colors", color)}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className={TYPOGRAPHY.label}>
                    {termKey ? <KnowledgeTooltip term={termKey}>{label}</KnowledgeTooltip> : label}
                </p>
                <p className={TYPOGRAPHY.value}>
                    {value}
                </p>
                {subValue && (
                    <p className={TYPOGRAPHY.subValue}>
                        {subValue}
                    </p>
                )}
            </div>
        </div>
    );
}

export interface BirthPanchangaData {
    panchanga: {
        tithi: { name: string; paksha: string };
        nakshatra: { name: string; pada: number };
        yoga: { name: string };
        karana: { name: string };
        vara: { name: string };
    };
    times: {
        sunrise: { time: string };
        sunset: { time: string };
    };
}

export default function BirthPanchanga({ data }: { data: BirthPanchangaData | null }) {
    if (!data || !data.panchanga) {
        return (
            <div className="p-4 text-center border border-gold-primary/20 rounded-xl bg-surface-warm/50 text-ink text-[10px] font-sans tracking-wide">
                Panchanga data loading...
            </div>
        );
    }

    const { panchanga, times } = data;
    const { tithi, nakshatra, yoga, karana, vara } = panchanga;

    return (
        <KnowledgeBatchProvider>
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <PanchangaItem
                    label="Tithi"
                    value={tithi.name}
                    subValue={tithi.paksha}
                    icon={Moon}
                    color="text-indigo-400"
                    termKey="tithi"
                />
                <PanchangaItem
                    label="Nakshatra"
                    value={nakshatra.name}
                    subValue={`Pada ${nakshatra.pada}`}
                    icon={Zap}
                    color="text-amber-400"
                    termKey="nakshatra"
                />
                <PanchangaItem
                    label="Yoga"
                    value={yoga.name}
                    icon={RefreshCcw}
                    color="text-teal-400"
                    termKey="yoga_panchanga"
                />
                <PanchangaItem
                    label="Karana"
                    value={karana.name}
                    icon={CalendarDays}
                    color="text-rose-400"
                    termKey="karana"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 border border-gold-primary/15 shadow-sm">
                    <Sunrise className="w-4 h-4 text-gold-dark" />
                    <div className="min-w-0">
                        <p className={TYPOGRAPHY.label}>Sunrise</p>
                        <p className={TYPOGRAPHY.value}>{times.sunrise.time}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 border border-gold-primary/15 shadow-sm">
                    <Sunset className="w-4 h-4 text-indigo-400" />
                    <div className="min-w-0">
                        <p className={TYPOGRAPHY.label}>Sunset</p>
                        <p className={TYPOGRAPHY.value}>{times.sunset.time}</p>
                    </div>
                </div>
            </div>

            <div className="pt-1">
                <div className="text-center bg-surface-warm/40 py-1.5 rounded-lg border border-gold-primary/10">
                    <span className={cn(TYPOGRAPHY.label, "mb-0 mr-2")}>
                        <KnowledgeTooltip term="vara">Birth vara</KnowledgeTooltip> :
                    </span>
                    <span className={TYPOGRAPHY.value}>{vara.name}</span>
                </div>
            </div>
        </div>
        </KnowledgeBatchProvider>
    );
}

