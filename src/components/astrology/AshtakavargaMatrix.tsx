"use client";

import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';
import { KnowledgeTooltip } from '@/components/knowledge';
import { getPlanetSymbol, PLANET_COLORS } from '@/lib/planet-symbols';
import { Star } from 'lucide-react';

interface ContributorEntry {
    contributor: string;
    bindus: number[];
}

interface AshtakavargaData {
    bhinnashtakavarga?: Record<string, Record<number, number> | number[]>;
    ashtakvarga?: Record<string, Record<number, number> | number[]>;
    contributors?: ContributorEntry[];
    [key: string]: unknown;
}

interface MatrixProps {
    type: 'sarva' | 'bhinna';
    planet?: string;
    data: AshtakavargaData;
    className?: string;
    compact?: boolean;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const SIGNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const SIGN_NAMES = ZODIAC_SIGNS;
const PLANET_DISPLAY: Record<string, string> = {
    Sun: 'Sun',
    Moon: 'Moon',
    Mars: 'Mars',
    Mercury: 'Mercury',
    Jupiter: 'Jupiter',
    Venus: 'Venus',
    Saturn: 'Saturn',
};

// House Groups for astrological analysis
const HOUSE_GROUPS = {
    dharma: { houses: [1, 5, 9], name: 'dharma', displayName: 'Dharma', desc: 'Purpose & luck', color: 'bg-purple-100 text-purple-800', termKey: 'house_dharma' },
    artha: { houses: [2, 6, 10], name: 'artha', displayName: 'Artha', desc: 'Wealth & career', color: 'bg-amber-100 text-amber-900', termKey: 'house_artha' },
    kama: { houses: [3, 7, 11], name: 'kama', displayName: 'Kama', desc: 'Desires & gains', color: 'bg-pink-100 text-pink-800', termKey: 'house_kama' },
    moksha: { houses: [4, 8, 12], name: 'moksha', displayName: 'Moksha', desc: 'Liberation', color: 'bg-blue-100 text-blue-800', termKey: 'house_moksha' }
};

// Text color for bindu values
// In Bhinna (binary 0/1): default text
// In Sarva (0-8 scale): low = weak (red), high = strong (green)
const getBinduTextColor = (val: number, isBinary = false) => {
    if (val === 0 || isBinary) return 'text-stone-900';
    if (val <= 2) return 'text-red-500';
    if (val <= 4) return 'text-amber-500';
    if (val <= 6) return 'text-emerald-500';
    return 'text-emerald-700';
};

// SAV text color — per-sign SAV ranges 0-8
const getSavTextColor = (val: number) => {
    if (val >= 30) return 'text-emerald-700';
    if (val <= 22) return 'text-red-500';
    return 'text-amber-500';
};

const getBinduBadgeClass = (val: number, isBinary = false) => {
    if (isBinary) return val > 0 ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-900';
    if (val === 0) return 'bg-stone-100 text-stone-900';
    if (val <= 2) return 'bg-red-100 text-red-600';
    if (val <= 4) return 'bg-orange-100 text-orange-600';
    if (val <= 6) return 'bg-emerald-100 text-emerald-700';
    return 'bg-green-100 text-green-800';
};

// Planet label with symbol and color
const PlanetRowLabel = ({ name, abbrev, compact }: { name: string; abbrev: string; compact?: boolean }) => {
    const symbol = getPlanetSymbol(name);
    const color = PLANET_COLORS[name] || PLANET_COLORS[abbrev] || '#3D3228';
    return (
        <div className="flex items-center gap-2">
            <span className={cn("leading-none", compact ? "text-[16px]" : "text-[20px]")} style={{ color }}>{symbol}</span>
            <span className={cn("font-medium text-primary", compact ? "text-[13px]" : "text-[16px]")}>
                {PLANET_DISPLAY[name] || abbrev}
            </span>
        </div>
    );
};

export default function AshtakavargaMatrix({ type, planet, data, className, compact }: MatrixProps) {
    if (!data) return null;

    const isSarva = type === 'sarva';
    const payload: Record<string, Record<number, number> | number[]> = (data.bhinnashtakavarga || data.ashtakvarga || data) as Record<string, Record<number, number> | number[]>;
    const contribs = data.contributors;

    let rows = isSarva ? PLANETS : (contribs ? contribs.map((c: ContributorEntry) => c.contributor) : [planet || 'Sun']);
    // Removed filtering of Lagna/Ascendant to ensure it shows in BAV as a contributor

    const getVal = (rd: Record<string | number, number> | number[], s: number): number => {
        if (!rd) return 0;
        if (Array.isArray(rd)) return rd[s - 1] ?? 0;
        return rd[s] ?? rd[SIGN_NAMES[s - 1]] ?? rd[SIGN_NAMES[s - 1]?.toLowerCase()] ?? 0;
    };

    // Calc SAV
    const sav: Record<number, number> = {};
    SIGNS.forEach(s => {
        let tot = 0;
        rows.forEach((p: string) => {
            let rd: Record<string | number, number> | number[] = {};
            if (contribs) {
                const c = contribs.find((x: ContributorEntry) => x.contributor === p);
                if (c?.bindus) c.bindus.forEach((v: number, i: number) => { rd[i + 1] = v; });
            } else {
                rd = payload[p] || payload[p.toLowerCase()] || {};
            }
            tot += getVal(rd, s);
        });
        sav[s] = tot;
    });

    const maxS = Math.max(...Object.values(sav));
    const minS = Math.min(...Object.values(sav));

    // Calculate House Group totals
    const groupTotals = Object.entries(HOUSE_GROUPS).map(([key, group]) => {
        const total = group.houses.reduce((sum, h) => sum + (sav[h] || 0), 0);
        const avg = Math.round(total / 3);
        return { key, ...group, total, avg };
    });

    return (
        <div className={cn(className, "h-full flex flex-col")}>
            <div className="rounded-xl border border-[#D97706]  flex-1 overflow-hidden">

                {/* Legend */}
                <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 bg-amber-50/30 border-b border-[#D97706] text-[11px] text-primary", compact ? "py-1.5" : "py-2")}>
                    <span className="font-semibold uppercase tracking-wider">Legend:</span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        Weak (≤2)
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Average (3–4)
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Good (5–6)
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        Strong (≥7)
                    </span>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full h-full border-collapse text-[14px]" role="table" aria-label={isSarva ? "Sarvashtakavarga matrix showing planetary bindus across signs" : `Bhinnashtakavarga matrix for ${planet || 'planet'}`}>
                        <thead className="sticky top-0 z-10">
                            <tr className="bg-amber-50/30 border-b border-[#D97706]">
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-2 text-left border-r border-[#D97706]", compact ? "py-2 w-16" : "py-3 w-20")}>
                                    {isSarva ? 'Planet' : planet}
                                </th>
                                {SIGNS.map(s => (
                                    <th key={s} className={cn(TYPOGRAPHY.tableHeader, "px-1 text-center border-r border-[#D97706] text-amber-900 font-medium", compact ? "py-2 w-7" : "py-3 w-8")}>{s}</th>
                                ))}
                                <th className={cn(TYPOGRAPHY.tableHeader, "px-1.5 text-center bg-amber-50", compact ? "py-2 w-8" : "py-3 w-10")}>Tot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((p: string, idx: number) => {
                                let rd: Record<string | number, number> | number[] = {};
                                if (contribs) {
                                    const c = contribs.find((x: ContributorEntry) => x.contributor === p);
                                    if (c?.bindus) c.bindus.forEach((v: number, i: number) => { rd[i + 1] = v; });
                                } else {
                                    rd = payload[p] || payload[p.toLowerCase()] || {};
                                }
                                let rowTot = 0;
                                SIGNS.forEach(s => { rowTot += getVal(rd, s); });

                                return (
                                    <tr key={p} className={cn("border-b border-[#D97706]", idx % 2 === 1 && "bg-amber-50/30")}>
                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-2 font-medium border-r border-[#D97706]", compact ? "py-2" : "py-2.5")}>
                                            <PlanetRowLabel name={p} abbrev={p.substring(0, 3)} compact={compact} />
                                        </td>
                                        {SIGNS.map(s => {
                                            const val = getVal(rd, s);
                                            return (
                                                <td key={s} className={cn(TYPOGRAPHY.dateAndDuration, "px-1 text-center border-r border-[#D97706] font-medium", compact ? "py-2" : "py-2.5")}>
                                                    <span className={cn(
                                                        "inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 leading-none font-bold",
                                                        getBinduBadgeClass(val, !isSarva)
                                                    )}>
                                                        {val}
                                                    </span>
                                                </td>
                                            );
                                        })}
                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "px-1.5 text-center font-bold bg-amber-50 text-stone-900", compact ? "py-2" : "py-2.5")}>{rowTot}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-amber-50 border-t border-[#D97706]">
                                <td className={cn(TYPOGRAPHY.label, "px-2 border-r border-[#D97706] mb-0", compact ? "py-2" : "py-3")}>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-orange-500" />
                                        <span className="font-serif text-[15px] leading-tight text-[#4A2417]">
                                            Total<br />
                                            <KnowledgeTooltip term="ashtakavarga_sav" unstyled>(SAV)</KnowledgeTooltip>
                                        </span>
                                    </div>
                                </td>
                                {SIGNS.map(s => {
                                    const v = sav[s];
                                    return (
                                        <td key={s} className={cn("px-1 text-center border-r border-[#D97706]", compact ? "py-2" : "py-3")}>
                                            <div className="inline-flex flex-col items-center gap-1">
                                                <span className={cn(TYPOGRAPHY.value, "leading-none font-bold", getSavTextColor(v))}>{v}</span>
                                                <span className={cn(
                                                    "h-2 w-2 rounded-full",
                                                    v >= 30 ? "bg-emerald-600" : v <= 22 ? "bg-red-400" : "bg-amber-500"
                                                )} />
                                            </div>
                                        </td>
                                    );
                                })}
                                <td className={cn(TYPOGRAPHY.value, "px-1.5 text-center bg-amber-50/50 font-medium", compact ? "py-2" : "py-3")}>
                                    {Object.values(sav).reduce((a, b) => a + b, 0)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
