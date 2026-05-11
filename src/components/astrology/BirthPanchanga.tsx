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
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';

/** Vara (weekday) → ruling planet color */
const VARA_COLORS: Record<string, { hex: string; bg: string; border: string; label: string }> = {
    'Sunday': { hex: PLANET_SVG_FILLS['Sun'] || '#F97316', bg: 'bg-orange-50', border: 'border-orange-200/60', label: 'text-orange-700' },
    'Monday': { hex: PLANET_SVG_FILLS['Moon'] || '#2563EB', bg: 'bg-blue-50', border: 'border-blue-200/60', label: 'text-blue-700' },
    'Tuesday': { hex: PLANET_SVG_FILLS['Mars'] || '#EF4444', bg: 'bg-red-50', border: 'border-red-200/60', label: 'text-red-700' },
    'Wednesday': { hex: PLANET_SVG_FILLS['Mercury'] || '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200/60', label: 'text-emerald-700' },
    'Thursday': { hex: '#92400E', bg: 'bg-yellow-50', border: 'border-yellow-200/60', label: 'text-amber-800' },
    'Friday': { hex: PLANET_SVG_FILLS['Venus'] || '#D946EF', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200/60', label: 'text-fuchsia-700' },
    'Saturday': { hex: PLANET_SVG_FILLS['Saturn'] || '#4338CA', bg: 'bg-indigo-50', border: 'border-indigo-200/60', label: 'text-indigo-700' },
};

interface PanchangaItemProps {
    label: string;
    value: string;
    subValue?: string;
    progress?: number;
    icon: React.ElementType;
    color: string;
    termKey?: string;
    noBorder?: boolean;
}

function PanchangaItem({ label, value, subValue, icon: Icon, color, termKey, noBorder = false }: PanchangaItemProps) {
    // Derive soft background tint from the icon color class (e.g. "text-indigo-400" → bg-indigo-50)
    const colorPrefix = color.replace('text-', '').split('-')[0]; // e.g. "indigo"
    const bgTint = `bg-${colorPrefix}-50`;
    const borderTint = `border-${colorPrefix}-200/40`;

    return (
        <div className={cn(
            "bg-white p-3 rounded-xl flex items-start gap-3 shadow-sm group hover:shadow-md transition-all",
            !noBorder && "border",
            !noBorder ? borderTint : "border-transparent"
        )}>
            <div className={cn("p-2 rounded-xl shrink-0 shadow-xs transition-colors mt-0.5", bgTint, color)}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
                {/* LABEL — bright colored caption per-category */}
                <p className={cn("font-sans text-[13px] font-bold mb-1 leading-none", `text-${colorPrefix}-600`)}>
                    {termKey ? <KnowledgeTooltip term={termKey}>{label}</KnowledgeTooltip> : label}
                </p>
                {/* VALUE — prominent, dark, clearly the "primary content" */}
                <p className="font-serif text-[15px] font-bold text-stone-900 leading-tight">
                    {value}
                </p>
                {/* SUBVALUE — secondary detail, distinctly lighter and smaller than value */}
                {subValue && (
                    <p className={cn(
                        "font-sans text-[11px] font-medium mt-0.5 leading-none",
                        `text-${colorPrefix}-600/80`
                    )}>
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
            <div className="p-4 text-center border border-amber-200/60 rounded-xl bg-amber-50/50 text-amber-800 text-[10px] font-sans tracking-wide">
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
                        noBorder
                    />
                    <PanchangaItem
                        label="Karana"
                        value={karana.name}
                        icon={CalendarDays}
                        color="text-rose-400"
                        termKey="karana"
                        noBorder
                    />
                </div>

                {/* Sunrise / Sunset — same hierarchy pattern */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-200/40 shadow-sm">
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                            <Sunrise className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-sans text-[13px] font-bold text-amber-600 mb-1 leading-none">Sunrise</p>
                            <p className="font-serif text-[15px] font-bold text-stone-900 leading-tight">{times.sunrise.time}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-200/40 shadow-sm">
                        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-500 shrink-0">
                            <Sunset className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="font-sans text-[13px] font-bold text-indigo-600 mb-1 leading-none">Sunset</p>
                            <p className="font-serif text-[15px] font-bold text-stone-900 leading-tight">{times.sunset.time}</p>
                        </div>
                    </div>
                </div>

                {/* Birth Vara — same hierarchy pattern */}
                <div className="pt-1">
                    {(() => {
                        const varaStyle = VARA_COLORS[vara.name];
                        if (varaStyle) {
                            return (
                                <div className={cn("text-center py-2.5 rounded-xl border shadow-sm flex items-center justify-center gap-2", varaStyle.bg, varaStyle.border)}>
                                    <span className={cn("font-sans text-[13px] font-bold", varaStyle.label)}>
                                        <KnowledgeTooltip term="vara">Birth vara</KnowledgeTooltip> :
                                    </span>
                                    <span className="font-serif text-[15px] font-bold" style={{ color: varaStyle.hex }}>
                                        {vara.name}
                                    </span>
                                </div>
                            );
                        }
                        return (
                            <div className="text-center bg-amber-50/40 py-2.5 rounded-xl border border-amber-200/40">
                                <span className="font-sans text-[13px] font-bold text-amber-700 mr-2">
                                    <KnowledgeTooltip term="vara">Birth vara</KnowledgeTooltip> :
                                </span>
                                <span className="font-serif text-[15px] font-bold text-stone-900">{vara.name}</span>
                            </div>
                        );
                    })()}
                </div>
            </div>
        </KnowledgeBatchProvider>
    );
}

