"use client";

import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';

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
    dharma: { houses: [1, 5, 9], name: 'Dharma', desc: 'Purpose & luck', color: 'bg-purple-100 text-purple-800' },
    artha: { houses: [2, 6, 10], name: 'Artha', desc: 'Wealth & career', color: 'bg-amber-100 text-ink' },
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
        <div className={cn(className, "h-full flex flex-col")}>
            <div className="rounded-xl border border-primary flex-1 overflow-hidden">

                {/* Table */}
                <div className="overflow-x-auto">
                <table className="w-full h-full border-collapse text-[14px]" role="table" aria-label={isSarva ? "Sarvashtakavarga matrix showing planetary bindus across signs" : `Bhinnashtakavarga matrix for ${planet || 'planet'}`}>
                    <thead className="sticky top-0 z-10">
                        <tr className="bg-amber-50/30 border-b border-primary">
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-3 px-2 text-left w-16 border-r border-primary")}>
                                {isSarva ? 'Planet' : planet?.substring(0, 4)}
                            </th>
                            {SIGNS.map(s => (
                                <th key={s} className={cn(TYPOGRAPHY.tableHeader, "py-3 px-1 text-center w-8 border-r border-primary text-ink font-bold")}>{s}</th>
                            ))}
                            <th className={cn(TYPOGRAPHY.tableHeader, "py-3 px-1.5 text-center bg-surface-warm w-10")}>Tot</th>
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
                                <tr key={p} className={cn("border-b border-primary", idx % 2 === 1 && "bg-surface-warm/30")}>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "py-2.5 px-2 font-medium border-r border-primary")}>{p.substring(0, 3)}</td>
                                    {SIGNS.map(s => (
                                        <td key={s} className={cn(TYPOGRAPHY.dateAndDuration, "py-2.5 px-1 text-center border-r border-primary")}>{getVal(rd, s)}</td>
                                    ))}
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "py-2.5 px-1.5 text-center font-semibold bg-surface-warm")}>{rowTot}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="bg-surface-warm border-t border-primary">
                            <td className={cn(TYPOGRAPHY.label, "py-3 px-2 border-r border-primary mb-0")}>SAV</td>
                            {SIGNS.map(s => {
                                const v = sav[s];
                                return (
                                    <td key={s} className="py-3 px-1 text-center border-r border-primary">
                                        <div className="flex flex-col items-center justify-center leading-none">
                                            <span className={cn(TYPOGRAPHY.value, "leading-none")}>{v}</span>
                                        </div>
                                    </td>
                                );
                            })}
                            <td className={cn(TYPOGRAPHY.value, "py-3 px-1.5 text-center bg-amber-50/50")}>
                                {Object.values(sav).reduce((a, b) => a + b, 0)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
                </div>
            </div>



            {/* Quick Summary */}
            <div className="flex justify-between mt-3 px-1">
                <span className={cn(TYPOGRAPHY.subValue, "text-ink")}>
                    Strongest: <span className="text-ink font-black uppercase tracking-wider">{groupTotals.sort((a, b) => b.total - a.total)[0].name}</span>
                </span>
                <div className="flex gap-6">
                    <span className={cn(TYPOGRAPHY.subValue, "text-ink inline-flex items-center gap-1.5")}>
                        â†‘ Best: Sign {SIGNS.find(s => sav[s] === maxS)} <span className="font-black text-ink">({maxS})</span>
                    </span>
                    <span className={cn(TYPOGRAPHY.subValue, "text-ink inline-flex items-center gap-1.5")}>
                        â†“ Weak: Sign {SIGNS.find(s => sav[s] === minS)} <span className="font-black text-ink">({minS})</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

