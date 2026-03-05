"use client";

import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';

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
const SIGN_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// House Groups for astrological analysis
const HOUSE_GROUPS = {
    dharma: { houses: [1, 5, 9], name: 'Dharma', desc: 'Purpose & luck', color: 'bg-purple-100 text-purple-800' },
    artha: { houses: [2, 6, 10], name: 'Artha', desc: 'Wealth & career', color: 'bg-amber-100 text-primary' },
    kama: { houses: [3, 7, 11], name: 'Kama', desc: 'Desires & gains', color: 'bg-pink-100 text-pink-800' },
    moksha: { houses: [4, 8, 12], name: 'Moksha', desc: 'Liberation', color: 'bg-blue-100 text-blue-800' }
};

// Minimal badge indicator for SAV values only (no colored text)
const getSavBadge = (val: number) => {
    if (val >= 30) return <span className="w-1.5 h-1.5 rounded-full bg-green-600" />;
    if (val < 22) return <span className="w-1.5 h-1.5 rounded-full bg-red-500" />;
    return null;
};

export default function AshtakavargaMatrix({ type, planet, data, className }: MatrixProps) {
    if (!data) return null;

    const isSarva = type === 'sarva';
    const payload: Record<string, Record<number, number> | number[]> = (data.bhinnashtakavarga || data.ashtakvarga || data) as Record<string, Record<number, number> | number[]>;
    const contribs = data.contributors;

    let rows = isSarva ? PLANETS : (contribs ? contribs.map((c: ContributorEntry) => c.contributor) : [planet || 'Sun']);
    rows = rows.filter((p: string) => !['Lagna', 'Ascendant', 'lagna', 'ascendant'].includes(p));

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
        <div className={className}>
            <div className="overflow-x-auto rounded-xl border border-border-warm">

                {/* Table */}
                <table className="w-full border-collapse text-sm" role="table" aria-label={isSarva ? "Sarvashtakavarga matrix showing planetary bindus across signs" : `Bhinnashtakavarga matrix for ${planet || 'planet'}`}>
                    <thead>
                        <tr className="bg-amber-50/30 border-b border-border-warm">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-2 text-left w-16 border-r border-border-warm")}>
                                {isSarva ? 'Planet' : planet?.substring(0, 4)}
                            </th>
                            {SIGNS.map(s => (
                                <th key={s} className={cn(TYPOGRAPHY.tableHeader, "py-2 px-1 text-center w-8 border-r border-border-warm text-secondary")}>{s}</th>
                            ))}
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-2 px-1.5 text-center bg-softwhite w-10")}>Tot</th>
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
                                <tr key={p} className={cn("border-b border-border-warm", idx % 2 === 1 && "bg-parchment/30")}>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "py-1.5 px-2 font-medium border-r border-border-warm")}>{p.substring(0, 3)}</td>
                                    {SIGNS.map(s => (
                                        <td key={s} className={cn(TYPOGRAPHY.dateAndDuration, "py-1.5 px-1 text-center border-r border-border-warm")}>{getVal(rd, s)}</td>
                                    ))}
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "py-1.5 px-1.5 text-center font-semibold bg-softwhite")}>{rowTot}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="bg-softwhite border-t border-b border-border-warm">
                            <td className={cn(TYPOGRAPHY.label, "py-2 px-2 border-r border-border-warm mb-0")}>SAV</td>
                            {SIGNS.map(s => {
                                const v = sav[s];
                                return (
                                    <td key={s} className="py-2 px-1 text-center border-r border-border-warm">
                                        <div className="flex flex-col items-center justify-center leading-none">
                                            <span className={cn(TYPOGRAPHY.value, "leading-none")}>{v}</span>
                                        </div>
                                    </td>
                                );
                            })}
                            <td className={cn(TYPOGRAPHY.value, "py-2 px-1.5 text-center bg-amber-50/50")}>
                                {Object.values(sav).reduce((a, b) => a + b, 0)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* House Group Analysis Cards */}
            <div className="mt-6 grid grid-cols-4 gap-3" role="group" aria-label="House group analysis summary">
                {groupTotals.map(g => {
                    const borderColor = g.key === 'dharma' ? 'border-purple-400' :
                        g.key === 'artha' ? 'border-amber-400' :
                            g.key === 'kama' ? 'border-pink-400' : 'border-blue-400';
                    return (
                        <div key={g.key} className={cn("rounded-lg p-2 border-l-2 bg-softwhite text-center", borderColor)}>
                            <div className={cn(TYPOGRAPHY.label, "text-secondary")}>{g.name}</div>
                            <div className={cn(TYPOGRAPHY.subValue, "text-muted-refined mt-0")}>{g.houses.join('-')}</div>
                            <div className={cn(TYPOGRAPHY.value, "text-base mt-1")}>{g.total}</div>
                            <div className={cn(TYPOGRAPHY.subValue, "text-muted-refined")}>{g.desc}</div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Summary */}
            <div className="flex justify-between mt-2 text-xs font-medium font-sans">
                <span className="text-secondary">
                    Strongest: <span className="text-primary font-semibold">{groupTotals.sort((a, b) => b.total - a.total)[0].name}</span>
                </span>
                <div className="flex gap-4">
                    <span className="text-secondary inline-flex items-center gap-1">
                        â†‘ Best: Sign {SIGNS.find(s => sav[s] === maxS)} <span className="font-semibold text-primary">({maxS})</span>
                    </span>
                    <span className="text-secondary inline-flex items-center gap-1">
                        â†“ Weak: Sign {SIGNS.find(s => sav[s] === minS)} <span className="font-semibold text-primary">({minS})</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

