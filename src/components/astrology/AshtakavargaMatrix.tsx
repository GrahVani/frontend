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
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const SIGNS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const SIGN_NAMES = ZODIAC_SIGNS;

// House Groups for astrological analysis
const HOUSE_GROUPS = {
    dharma: { houses: [1, 5, 9], name: 'dharma', displayName: 'Dharma', desc: 'Purpose & luck', color: 'bg-purple-100 text-purple-800', termKey: 'house_dharma' },
    artha: { houses: [2, 6, 10], name: 'artha', displayName: 'Artha', desc: 'Wealth & career', color: 'bg-amber-100 text-amber-900', termKey: 'house_artha' },
    kama: { houses: [3, 7, 11], name: 'kama', displayName: 'Kama', desc: 'Desires & gains', color: 'bg-pink-100 text-pink-800', termKey: 'house_kama' },
    moksha: { houses: [4, 8, 12], name: 'moksha', displayName: 'Moksha', desc: 'Liberation', color: 'bg-blue-100 text-blue-800', termKey: 'house_moksha' }
};

// Visual intensity dot for bindu values
// In Bhinna (binary 0/1): 1 = bindu present (positive) → green
// In Sarva (0-8 scale): low = weak (red), high = strong (green)
const getBinduDot = (val: number, isBinary = false) => {
    if (val === 0 || isBinary) return null; // no dot for zero or in Bhinna mode
    if (val <= 2) return <span className="w-1.5 h-1.5 rounded-full bg-red-400" />;
    if (val <= 4) return <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />;
    if (val <= 6) return <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />;
    return <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />;
};

// SAV strength indicator — per-sign SAV ranges 0-8
const getSavBadge = (val: number) => {
    if (val >= 6) return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />;   // strong
    if (val <= 3) return <span className="w-1.5 h-1.5 rounded-full bg-red-400" />;      // weak
    return null; // 4-5 = average, no badge
};

// Planet label with symbol and color
const PlanetRowLabel = ({ name, abbrev }: { name: string; abbrev: string }) => {
    const symbol = getPlanetSymbol(name);
    const color = PLANET_COLORS[name] || PLANET_COLORS[abbrev] || '#3D3228';
    return (
        <div className="flex items-center gap-2">
            <span className="text-[20px] leading-none" style={{ color }}>{symbol}</span>
            <span className="font-medium text-primary text-[16px]">{abbrev}</span>
        </div>
    );
};

export default function AshtakavargaMatrix({ type, planet, data, className }: MatrixProps) {
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
            <div className="rounded-xl border border-primary flex-1 overflow-hidden">

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3 py-2 bg-amber-50/30 border-b border-primary text-[11px] text-primary">
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
                            <tr className="bg-amber-50/30 border-b border-primary">
                                <th className={cn(TYPOGRAPHY.tableHeader, "py-3 px-2 text-left w-20 border-r border-primary")}>
                                    {isSarva ? 'Planet' : planet?.substring(0, 4)}
                                </th>
                                {SIGNS.map(s => (
                                    <th key={s} className={cn(TYPOGRAPHY.tableHeader, "py-3 px-1 text-center w-8 border-r border-primary text-amber-900 font-medium")}>{s}</th>
                                ))}
                                <th className={cn(TYPOGRAPHY.tableHeader, "py-3 px-1.5 text-center bg-amber-50 w-10")}>Tot</th>
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
                                    <tr key={p} className={cn("border-b border-primary", idx % 2 === 1 && "bg-amber-50/30")}>
                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "py-2.5 px-2 font-medium border-r border-primary")}>
                                            <PlanetRowLabel name={p} abbrev={p.substring(0, 3)} />
                                        </td>
                                        {SIGNS.map(s => {
                                            const val = getVal(rd, s);
                                            return (
                                                <td key={s} className={cn(TYPOGRAPHY.dateAndDuration, "py-2.5 px-1 text-center border-r border-primary font-medium")}>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <span>{val}</span>
                                                        {getBinduDot(val, !isSarva)}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className={cn(TYPOGRAPHY.dateAndDuration, "py-2.5 px-1.5 text-center font-medium bg-amber-50")}>{rowTot}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="bg-amber-50 border-t border-primary">
                                <td className={cn(TYPOGRAPHY.label, "py-3 px-2 border-r border-primary mb-0")}>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-3.5 h-3.5 text-amber-700" />
                                        <KnowledgeTooltip term="ashtakavarga_sav" unstyled>SAV</KnowledgeTooltip>
                                    </div>
                                </td>
                                {SIGNS.map(s => {
                                    const v = sav[s];
                                    return (
                                        <td key={s} className="py-3 px-1 text-center border-r border-primary">
                                            <div className="flex flex-col items-center justify-center leading-none gap-1">
                                                <span className={cn(TYPOGRAPHY.value, "leading-none font-medium")}>{v}</span>
                                                {getSavBadge(v)}
                                            </div>
                                        </td>
                                    );
                                })}
                                <td className={cn(TYPOGRAPHY.value, "py-3 px-1.5 text-center bg-amber-50/50 font-medium")}>
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
