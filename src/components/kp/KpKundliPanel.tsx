"use client";

/**
 * KpKundliPanel
 * 
 * Exports two standalone card components for the KP Kundli overview page:
 *   - KpCuspalChartCard  → Left column (replaces Rashi planetary table)
 *   - KpPlanetaryTableCard → Right column (full-width, replaces D9/D10 slots)
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { useVedicClient } from '@/context/VedicClientContext';
import { useKpPlanetsCusps, useKpBhavaDetails, useKpFortuna } from '@/hooks/queries/useKP';
import { BhavaTableDashboard, KpFortunaDashboard } from './KpDashboardComponents';
import { useKpTransformedData } from '@/hooks/useKpTransformedData';

const KpCuspalChart = dynamic(() => import('@/components/kp/KpCuspalChart'), {
    loading: () => (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-gold-primary animate-spin" />
        </div>
    ),
});

// ─── Constants ───────────────────────────────────────────────────────

const twoLetterNames: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra',
    'Ketu': 'Ke', 'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl',
    'Ascendant': 'As', 'Lagna': 'As',
};

const planetEmojis: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿',
    'Jupiter': '♃', 'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊',
    'Ketu': '☋', 'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿',
    'Ju': '♃', 'Ve': '♀', 'Sa': '♄', 'Ra': '☊', 'Ke': '☋',
};

const signSymbols: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓',
};

const HEADER_STYLE = {
    background: 'linear-gradient(180deg, rgba(250,245,234,0.60) 0%, rgba(250,245,234,0.30) 100%)',
    borderBottom: '1px solid rgba(220,201,166,0.25)',
};

// ─── Helpers ─────────────────────────────────────────────────────────

function toTwoLetters(name: string): string {
    const normalized = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    return twoLetterNames[normalized] || name.slice(0, 2);
}

// ─── Shared data hook ────────────────────────────────────────────────

function useKpData() {
    const { clientDetails, processedCharts } = useVedicClient();
    const clientId = clientDetails?.id || '';

    const planetsCuspsQuery = useKpPlanetsCusps(clientId);
    const bhavaDetailsQuery = useKpBhavaDetails(clientId);
    const fortunaQuery = useKpFortuna(clientId);
    const emptyQuery = { data: undefined, isLoading: false };

    const transformed = useKpTransformedData({
        processedCharts,
        planetsCuspsQuery,
        houseSignificationsQuery: emptyQuery,
        planetSignificatorsQuery: emptyQuery,
        bhavaDetailsQuery,
        rulingPlanetsQuery: emptyQuery,
        interlinksQuery: emptyQuery,
        advancedSslQuery: emptyQuery,
        nakshatraNadiQuery: emptyQuery,
        fortunaQuery,
    });

    const isLoading = (planetsCuspsQuery.isLoading || bhavaDetailsQuery.isLoading || fortunaQuery.isLoading) && !transformed.cuspData.length;
    const bhavaData = transformed.bhavaDetails || {};
    const fortunaData = transformed.fortunaData;

    return { clientId, transformed, isLoading, bhavaData, fortunaData };
}

// ─── Types ───────────────────────────────────────────────────────────

interface KpPlanetRow {
    name: string;
    fullName: string;
    sign: string;
    degreeFormatted?: string;
    house: number;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
    isRetrograde: boolean;
}

// ═════════════════════════════════════════════════════════════════════
// 1. KpCuspalChartCard — Left column, replaces Rashi planetary table
// ═════════════════════════════════════════════════════════════════════

export function KpCuspalChartCard() {
    const { clientId, transformed, isLoading } = useKpData();
    const hasCuspData = transformed.cuspData.length > 0;

    if (!clientId) return null;

    return (
        <div className="prem-card flex flex-col">
            <div className="px-3 py-1.5" style={HEADER_STYLE}>
                <h2 className={TYPOGRAPHY.sectionTitle}>Cuspal chart</h2>
            </div>
            <div className="h-[390px] overflow-hidden bg-surface-warm">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full py-12">
                        <Loader2 className="w-5 h-5 text-gold-primary animate-spin" />
                    </div>
                ) : hasCuspData ? (
                    <KpCuspalChart
                        planets={transformed.d1Data.planets}
                        houseSigns={transformed.cuspData.map(c => c.signId)}
                        className="w-full h-full bg-transparent border-none"
                        preserveAspectRatio="none"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full py-12">
                        <p className={cn(TYPOGRAPHY.subValue, "text-primary italic text-center")}>
                            No cuspal data available
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════
// 2. KpPlanetaryTableCard — Right column, full-width table
// ═════════════════════════════════════════════════════════════════════

export function KpPlanetaryTableCard() {
    const { clientId, transformed, isLoading } = useKpData();
    const hasPlanetaryData = transformed.planetaryData.length > 0;

    if (!clientId) return null;

    return (
        <div className="prem-card flex flex-col">
            <div className="px-3 py-1.5" style={HEADER_STYLE}>
                <h2 className={TYPOGRAPHY.sectionTitle}>
                    Planetary positions with star & sub lords
                </h2>
            </div>
            <div className="bg-surface-warm">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-5 h-5 text-gold-primary animate-spin" />
                    </div>
                ) : hasPlanetaryData ? (
                    <KpPlanetaryTableFull planets={transformed.planetaryData} />
                ) : (
                    <p className={cn(TYPOGRAPHY.subValue, "text-primary italic text-center py-6")}>
                        No planetary data available
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Full-width Planetary Table (matches Rashi table style) ──────────

function KpPlanetaryTableFull({ planets }: { planets: KpPlanetRow[] }) {
    if (!planets || planets.length === 0) return null;

    const colWidths = {
        planet: "w-[18%] sm:w-[17%]",
        sign: "w-[16%] sm:w-[15%]",
        degree: "w-[18%] sm:w-[17%]",
        house: "w-[7%] shrink-0 text-center",
        nakshatra: "w-[18%] sm:w-[17%]",
        star: "w-[12%] sm:w-[10%]",
        sub: "w-[11%] sm:w-[10%]",
    };

    return (
        <div className="w-full font-sans">
            {/* Header row */}
            <div className={cn(
                "flex items-center py-1.5 px-3 border-b border-gold-primary/15",
                TYPOGRAPHY.tableHeader
            )}>
                <div className={cn(colWidths.planet, "shrink-0")}>Planet</div>
                <div className={cn(colWidths.sign, "shrink-0")}>Sign</div>
                <div className={cn(colWidths.degree, "shrink-0")}>Degree</div>
                <div className={cn(colWidths.house, "shrink-0")}>H</div>
                <div className={cn(colWidths.nakshatra, "shrink-0")}>Nakshatra</div>
                <div className={cn(colWidths.star, "shrink-0")}>Star Lord</div>
                <div className={cn(colWidths.sub, "shrink-0")}>Sub Lord</div>
            </div>

            {/* Data rows */}
            {planets.map((planet, i) => {
                const name = planet.fullName || planet.name;
                return (
                    <div
                        key={planet.name}
                        className={cn(
                            "flex items-center py-1 px-3 border-b border-gold-primary/10 last:border-0 hover:bg-gold-primary/5 transition-colors",
                            i % 2 !== 0 && "bg-gold-primary/5"
                        )}
                    >
                        {/* Planet */}
                        <div className={cn(colWidths.planet, "shrink-0 truncate flex items-center gap-2", TYPOGRAPHY.planetName)}>
                            <span className="text-[17px] font-serif opacity-90">{planetEmojis[name] || planetEmojis[planet.name] || '●'}</span>
                            <span className="truncate">{name}</span>
                            {planet.isRetrograde && <span className="ml-0.5 text-rose-500 text-[12px]">(R)</span>}
                        </div>

                        {/* Sign */}
                        <div className={cn(colWidths.sign, "shrink-0 truncate flex items-center gap-2", TYPOGRAPHY.planetName)}>
                            <span className="text-[15px] font-serif opacity-70">{signSymbols[planet.sign] || ''}</span>
                            <span className="truncate">{planet.sign}</span>
                        </div>

                        {/* Degree */}
                        <div className={cn(colWidths.degree, "shrink-0", TYPOGRAPHY.dateAndDuration)}>
                            {planet.degreeFormatted}
                        </div>

                        {/* House */}
                        <div className={cn(colWidths.house, "shrink-0 text-center", TYPOGRAPHY.value)}>
                            {planet.house}
                        </div>

                        {/* Nakshatra */}
                        <div className={cn(colWidths.nakshatra, "shrink-0 truncate", TYPOGRAPHY.planetName)}>
                            {planet.nakshatra}
                        </div>

                        {/* Star Lord */}
                        <div className={cn(colWidths.star, "shrink-0 truncate", TYPOGRAPHY.dateAndDuration)}>
                            {planet.nakshatraLord}
                        </div>

                        {/* Sub Lord */}
                        <div className={cn(colWidths.sub, "shrink-0 truncate", TYPOGRAPHY.dateAndDuration)}>
                            {planet.subLord}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════
// 3. KpBhavaDetailsCard — Table of house cusps and lords
// ═════════════════════════════════════════════════════════════════════

export function KpBhavaDetailsCard() {
    const { clientId, bhavaData, isLoading } = useKpData();
    const hasBhavaData = Object.keys(bhavaData).length > 0;

    if (!clientId) return null;

    return (
        <div className="prem-card flex flex-col">
            <div className="px-3 py-1.5" style={HEADER_STYLE}>
                <h2 className={TYPOGRAPHY.sectionTitle}>Bhava details</h2>
            </div>
            <div className="min-h-[430px] bg-surface-warm px-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full py-12">
                        <Loader2 className="w-5 h-5 text-gold-primary animate-spin" />
                    </div>
                ) : hasBhavaData ? (
                    <BhavaTableDashboard bhavaDetails={bhavaData} />
                ) : (
                    <p className={cn(TYPOGRAPHY.subValue, "text-primary italic text-center py-12")}>
                        No bhava details available
                    </p>
                )}
            </div>
        </div>
    );
}

// ═════════════════════════════════════════════════════════════════════
// 4. KpFortunaCard — Pars Fortuna derivation and placement
// ═════════════════════════════════════════════════════════════════════

export function KpFortunaCard() {
    const { clientId, fortunaData, isLoading } = useKpData();
    const hasFortunaData = !!fortunaData && !!fortunaData.calculation;

    if (!clientId) return null;

    return (
        <div className="prem-card overflow-hidden flex flex-col h-full">
            <div className="px-3 py-1.5" style={HEADER_STYLE}>
                <h2 className={TYPOGRAPHY.sectionTitle}>Pars Fortuna</h2>
            </div>
            <div className="flex-1 overflow-auto bg-surface-warm p-3 scrollbar-none">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-5 h-5 text-gold-primary animate-spin" />
                    </div>
                ) : hasFortunaData ? (
                    <KpFortunaDashboard data={{ fortunaData }} />
                ) : (
                    <p className={cn(TYPOGRAPHY.subValue, "text-primary italic text-center py-6")}>
                        No fortuna data available
                    </p>
                )}
            </div>
        </div>
    );
}

// ─── Default export (kept for backward compat) ───────────────────────

export default function KpKundliPanel() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KpCuspalChartCard />
                <KpPlanetaryTableCard />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <KpBhavaDetailsCard />
                <KpFortunaCard />
            </div>
        </div>
    );
}
