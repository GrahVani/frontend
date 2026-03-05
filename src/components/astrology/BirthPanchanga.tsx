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

interface PanchangaItemProps {
    label: string;
    value: string;
    subValue?: string;
    progress?: number;
    icon: React.ElementType;
    color: string;
}

function PanchangaItem({ label, value, subValue, icon: Icon, color }: PanchangaItemProps) {
    return (
        <div className="bg-white/50 p-2.5 rounded-xl border border-antique/20 flex items-center gap-3 shadow-sm group hover:border-gold-primary/30 transition-all">
            <div className={cn("p-1.5 rounded-lg bg-white shrink-0 shadow-xs group-hover:bg-gold-primary/5 transition-colors", color)}>
                <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
                <p className={TYPOGRAPHY.label}>
                    {label}
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

interface BirthPanchangaData {
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
            <div className="p-4 text-center border border-antique/30 rounded-xl bg-softwhite/50 text-primary text-[10px] font-sans tracking-wide">
                Panchanga data loading...
            </div>
        );
    }

    const { panchanga, times } = data;
    const { tithi, nakshatra, yoga, karana, vara } = panchanga;

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <PanchangaItem
                    label="Tithi"
                    value={tithi.name}
                    subValue={tithi.paksha}
                    icon={Moon}
                    color="text-indigo-400"
                />
                <PanchangaItem
                    label="Nakshatra"
                    value={nakshatra.name}
                    subValue={`Pada ${nakshatra.pada}`}
                    icon={Zap}
                    color="text-amber-400"
                />
                <PanchangaItem
                    label="Yoga"
                    value={yoga.name}
                    icon={RefreshCcw}
                    color="text-teal-400"
                />
                <PanchangaItem
                    label="Karana"
                    value={karana.name}
                    icon={CalendarDays}
                    color="text-rose-400"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 border border-antique/20 shadow-sm">
                    <Sunrise className="w-4 h-4 text-accent-gold" />
                    <div className="min-w-0">
                        <p className={TYPOGRAPHY.label}>Sunrise</p>
                        <p className={TYPOGRAPHY.value}>{times.sunrise.time}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/50 border border-antique/20 shadow-sm">
                    <Sunset className="w-4 h-4 text-indigo-400" />
                    <div className="min-w-0">
                        <p className={TYPOGRAPHY.label}>Sunset</p>
                        <p className={TYPOGRAPHY.value}>{times.sunset.time}</p>
                    </div>
                </div>
            </div>

            <div className="pt-1">
                <div className="text-center bg-softwhite/40 py-1.5 rounded-lg border border-antique/10">
                    <span className={cn(TYPOGRAPHY.label, "mb-0 mr-2")}>Birth vara :</span>
                    <span className={TYPOGRAPHY.value}>{vara.name}</span>
                </div>
            </div>
        </div>
    );
}

