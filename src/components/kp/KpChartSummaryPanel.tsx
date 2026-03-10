"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

const planetEmojis: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
};

const signAbbreviations: Record<string, string> = {
    'Aries': 'Ari', 'Taurus': 'Tau', 'Gemini': 'Gem', 'Cancer': 'Can',
    'Leo': 'Leo', 'Virgo': 'Vir', 'Libra': 'Lib', 'Scorpio': 'Sco',
    'Sagittarius': 'Sag', 'Capricorn': 'Cap', 'Aquarius': 'Aqu', 'Pisces': 'Pis',
};

interface PlanetSnapshot {
    name: string;
    sign: string;
    isRetrograde?: boolean;
}

interface KpChartSummaryPanelProps {
    birthDate?: string;
    birthTime?: string;
    birthPlace?: string;
    lagna?: string;
    lagnaLord?: string;
    ayanamsaType?: string;
    ayanamsaValue?: string;
    moonSign?: string;
    moonNakshatra?: string;
    moonStarLord?: string;
    houseCuspCount?: number;
    planets?: PlanetSnapshot[];
    className?: string;
}

/**
 * Chart Summary Panel
 * Compact card with birth details, Lagna, Ayanamsa, and quick planet glyphs
 */
export default function KpChartSummaryPanel({
    birthDate,
    birthTime,
    birthPlace,
    lagna,
    lagnaLord,
    ayanamsaType = 'KP',
    ayanamsaValue,
    moonSign,
    moonNakshatra,
    moonStarLord,
    houseCuspCount = 12,
    planets = [],
    className,
}: KpChartSummaryPanelProps) {
    return (
        <div className={cn("prem-card p-5", className)}>
            <h3 className={cn(TYPOGRAPHY.value, "text-[16px] mb-4 flex items-center gap-2 font-semibold")}>
                <div className="p-1.5 bg-surface-warm rounded-lg border border-gold-primary/20">
                    <Compass className="w-3.5 h-3.5 text-gold-dark" />
                </div>
                Chart Summary
            </h3>

            {/* Key Details Grid */}
            <div className="space-y-2.5">
                <DetailRow label="Birth Date" value={birthDate || '—'} />
                <DetailRow label="Birth Time" value={birthTime || '—'} />
                <DetailRow label="Birth Place" value={birthPlace || '—'} />
                <div className="border-t border-gold-primary/15 pt-2.5" />
                <DetailRow label="Lagna" value={lagna || '—'} highlight />
                <DetailRow label="Lagna Lord" value={lagnaLord || '—'} />
                <DetailRow label="Moon Sign" value={moonSign || '—'} />
                <DetailRow label={<>Moon <KnowledgeTooltip term="nakshatra">Nakshatra</KnowledgeTooltip></>} value={moonNakshatra || '—'} />
                <DetailRow label={<>Moon <KnowledgeTooltip term="star_lord">Star Lord</KnowledgeTooltip></>} value={moonStarLord || '—'} />
                <div className="border-t border-gold-primary/15 pt-2.5" />
                <DetailRow label={<KnowledgeTooltip term="kp_ayanamsa">Ayanamsa</KnowledgeTooltip>} value={`${ayanamsaType}${ayanamsaValue ? ` (${ayanamsaValue})` : ''}`} highlight />
                <DetailRow label="House System" value="Placidus (KP)" />
                <DetailRow label={<KnowledgeTooltip term="kp_cusp">Cusps</KnowledgeTooltip>} value={`${houseCuspCount} houses`} />
            </div>

            {/* Planet Snapshot */}
            {planets.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gold-primary/15">
                    <p className={cn(TYPOGRAPHY.label, "text-[9px] uppercase tracking-widest !font-bold mb-2")}>Planet Snapshot</p>
                    <div className="flex flex-wrap gap-1.5">
                        {planets.map((p) => (
                            <div
                                key={p.name}
                                className="flex items-center gap-1 px-2 py-1 bg-surface-warm border border-gold-primary/20 rounded text-[12px]"
                                title={`${p.name} in ${p.sign}${p.isRetrograde ? ' (R)' : ''}`}
                            >
                                <span className="text-[14px]">{planetEmojis[p.name] || '●'}</span>
                                <span className={cn(TYPOGRAPHY.value, "text-[12px] font-medium")}>
                                    {signAbbreviations[p.sign] || p.sign?.slice(0, 3)}
                                </span>
                                {p.isRetrograde && (
                                    <span className="text-red-500 text-[9px] font-bold">R</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value, highlight }: { label: React.ReactNode; value: string; highlight?: boolean }) {
    return (
        <div className="flex items-center justify-between gap-2">
            <span className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-widest !font-bold shrink-0")}>{label}</span>
            <span className={cn(
                TYPOGRAPHY.value,
                "text-[14px] font-medium text-right",
                highlight ? "!text-gold-dark !font-bold" : "!text-ink"
            )}>
                {value}
            </span>
        </div>
    );
}
