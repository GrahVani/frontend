"use client";

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';
import { Shield, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ContributorEntry {
    contributor: string;
    bindus: number[] | Record<string | number, number>;
}

interface AshtakavargaData {
    bhinnashtakavarga?: Record<string, any>;
    ashtakvarga?: Record<string, any>;
    contributors?: ContributorEntry[];
    [key: string]: unknown;
}

interface PremiumMatrixProps {
    type: 'sarva' | 'bhinna';
    planet?: string;
    data: AshtakavargaData;
    lagnaSign?: number;
    className?: string;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const SIGNS = Array.from({ length: 12 }, (_, i) => i + 1);

// Planet Icons/Abbreviations
const PLANET_METADATA: Record<string, { label: string; icon: any; color: string }> = {
    Sun: { label: 'SU', icon: () => <span>☀️</span>, color: 'text-orange-500' },
    Moon: { label: 'MO', icon: () => <span>🌙</span>, color: 'text-blue-400' },
    Mars: { label: 'MA', icon: () => <span>♂️</span>, color: 'text-red-500' },
    Mercury: { label: 'ME', icon: () => <span>☿️</span>, color: 'text-emerald-500' },
    Jupiter: { label: 'JU', icon: () => <span>♃</span>, color: 'text-amber-500' },
    Venus: { label: 'VE', icon: () => <span>♀️</span>, color: 'text-pink-500' },
    Saturn: { label: 'SA', icon: () => <span>♄</span>, color: 'text-indigo-500' },
    Lagna: { label: 'AS', icon: () => <span>⤒</span>, color: 'text-slate-500' },
    Ascendant: { label: 'AS', icon: () => <span>⤒</span>, color: 'text-slate-500' },
};

/**
 * Premium Ashtakavarga Matrix
 * A high-density, heatmap-style visualization for planetary bindus.
 */
export default function PremiumAshtakavargaMatrix({ type, planet: propPlanet, data, lagnaSign, className }: PremiumMatrixProps) {
    const isSarva = type === 'sarva';
    const [selectedPlanet, setSelectedPlanet] = React.useState<string>(propPlanet || 'Lagna');

    // 1. Data Normalization Helper
    const getVal = (rd: any, s: number): number => {
        if (!rd) return 0;
        
        // 1. If it's an array
        if (Array.isArray(rd)) return rd[s - 1] ?? 0;
        
        // 2. If it's an object with numeric or string keys
        if (rd[s] !== undefined && rd[s] !== null) return Number(rd[s]);
        if (rd[s.toString()] !== undefined && rd[s.toString()] !== null) return Number(rd[s.toString()]);
        
        // 3. Check for sign names as keys
        const signName = ZODIAC_SIGNS[s - 1];
        if (rd[signName] !== undefined) return Number(rd[signName]);
        if (rd[signName.toLowerCase()] !== undefined) return Number(rd[signName.toLowerCase()]);
        
        // 4. Handle nested bindus/points property
        if (rd.bindus) return getVal(rd.bindus, s);
        if (rd.points) return getVal(rd.points, s);
        if (rd.total) return getVal(rd.total, s);

        return 0;
    };

    // 2. Extract Available Planets for Bhinna Tabs
    const availablePlanets = useMemo(() => {
        if (isSarva) return [];
        const root = (data.bhinnashtakavarga || data.ashtakvarga || data) as any;
        const keys = Object.keys(root).filter(k => 
            ['lagna', 'ascendant', 'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'].includes(k.toLowerCase())
        );
        // Normalize and Deduplicate
        const normalized = Array.from(new Set(keys.map(k => {
            if (k.toLowerCase().startsWith('asc') || k.toLowerCase() === 'lagna') return 'Lagna';
            return k.charAt(0).toUpperCase() + k.slice(1).toLowerCase();
        })));
        
        // Ensure prompt planet or default is in state
        if (normalized.length > 0 && !normalized.includes(selectedPlanet)) {
             // Try to find a match or default to first
             const match = normalized.find(n => n.toLowerCase() === selectedPlanet.toLowerCase());
             if (!match) setSelectedPlanet(normalized[0]);
        }
        
        return normalized;
    }, [data, isSarva, selectedPlanet]);

    // 3. Process Rows and Data
    const processedData = useMemo(() => {
        if (!data) return { rows: [], matrix: {}, columnTotals: {} };

        const root = (data.bhinnashtakavarga || data.ashtakvarga || data) as any;
        const sarvaDict = data.sarvashtakavarga as Record<number, number> | undefined;
        const bhinnaDict = data.bhinnashtakavarga as Record<string, any> | undefined;
        const dataContribs = data.contributors as ContributorEntry[] | undefined;

        // For Sarva: All 7 Planets. For Bhinna: All Contributors to the selected planet's BAV.
        let rows = isSarva ? PLANETS : PLANETS_WITH_ASC;
        
        const matrix: Record<string, Record<number, number>> = {};
        const colTotals: Record<number, number> = {};

        const PLANET_ALIASES: Record<string, string[]> = {
            Sun: ['Sun', 'sun', 'Su', 'su', 'SU'],
            Moon: ['Moon', 'moon', 'Moo', 'moo', 'Mo', 'mo', 'MO'],
            Mars: ['Mars', 'mars', 'Mar', 'mar', 'Ma', 'ma', 'MA'],
            Mercury: ['Mercury', 'mercury', 'Mer', 'mer', 'Me', 'me', 'ME'],
            Jupiter: ['Jupiter', 'jupiter', 'Jup', 'jup', 'Ju', 'ju', 'JU'],
            Venus: ['Venus', 'venus', 'Ven', 'ven', 'Ve', 've', 'VE'],
            Saturn: ['Saturn', 'saturn', 'Sat', 'sat', 'Sa', 'sa', 'SA'],
            Lagna: ['Lagna', 'lagna', 'Ascendant', 'ascendant', 'As', 'as', 'Asc', 'asc', 'AS'],
        };

        // Determine the source object for the matrix
        let activeSource = (isSarva 
            ? (bhinnaDict || root) 
            : (bhinnaDict?.[selectedPlanet] || root[selectedPlanet] || root[selectedPlanet.toLowerCase()] || root[selectedPlanet.toUpperCase()] || {})) as any;

        // NEW: If activeSource is null or undefined, use root as a fallback
        if (!activeSource || (typeof activeSource === 'object' && Object.keys(activeSource).length === 0)) {
            activeSource = root;
        }

        // Enhanced source detection: Look for nested matrix/table/data
        if (activeSource && typeof activeSource === 'object' && !Array.isArray(activeSource)) {
            // Priority list for matrix containers
            const matrixKeys = ['matrix', 'table', 'rows', 'data', 'bhinnashtakavarga_points', 'ashtakavarga_points', 'ashtaka_table', 'contributors', 'contributions', 'contribution'];
            
            for (const key of matrixKeys) {
                const nested = activeSource[key];
                if (nested && typeof nested === 'object') {
                    if (Array.isArray(nested) && nested.length > 0) {
                        // Check if it's an array of objects (contributors) rather than a list of numbers (totals)
                        const firstItem = nested[0];
                        if (typeof firstItem === 'object' && firstItem !== null && 
                           (firstItem.contributor || firstItem.planet || firstItem.name || firstItem.label)) {
                            activeSource = { _is_array: true, items: nested };
                            break;
                        }
                    } else if (!Array.isArray(nested) && Object.keys(nested).length > 0) {
                        // Check if it has planet keys
                        if (Object.keys(nested).some(k => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna', 'Su', 'Mo', 'Asc'].some(pa => k.toLowerCase().startsWith(pa.toLowerCase())))) {
                            activeSource = nested;
                            break;
                        }
                    }
                }
            }
            
            // SPECIAL CASE: Only use 'bindus' or 'points' if they are NOT a simple numeric array (which usually means totals)
            if (!activeSource._is_array && !Object.keys(activeSource).some(k => ['Sun', 'Moon', 'Mars'].some(pa => k.toLowerCase().startsWith(pa.toLowerCase())))) {
                const fallbackKeys = ['bindus', 'points'];
                for (const fk of fallbackKeys) {
                    const nested = activeSource[fk];
                    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
                        activeSource = nested;
                        break;
                    }
                }
            }
        }

        const contributorsList = dataContribs || (activeSource && activeSource._is_array ? activeSource.items : null) || (activeSource?.contributors && Array.isArray(activeSource.contributors) ? activeSource.contributors : null);

        rows.forEach(rowName => {
            matrix[rowName] = {};
            
            const rowIdentifiers = [
                rowName.toLowerCase(), 
                ...(PLANET_ALIASES[rowName]?.map(a => a.toLowerCase()) || [])
            ];

            let rd: any = null;

            // Strategy 1: Check direct keys if activeSource is an object
            if (activeSource && !activeSource._is_array) {
                const sourceKeys = Object.keys(activeSource);
                for (const key of sourceKeys) {
                    if (rowIdentifiers.includes(key.toLowerCase())) {
                        rd = activeSource[key];
                        break;
                    }
                }
            }

            // Strategy 2: Check contributors array (if present in root data or activeSource)
            if (!rd && contributorsList && Array.isArray(contributorsList)) {
                const item = contributorsList.find((it: any) => 
                    rowIdentifiers.includes(it.contributor?.toLowerCase()) || 
                    rowIdentifiers.includes(it.planet?.toLowerCase()) ||
                    rowIdentifiers.includes(it.name?.toLowerCase()) ||
                    rowIdentifiers.includes(it.label?.toLowerCase())
                );
                if (item) {
                    rd = item.bindus || item.points || item.data || item.ashtakavarga_points || item;
                }
            }

            SIGNS.forEach(s => {
                const val = getVal(rd, s);
                matrix[rowName][s] = val;
                colTotals[s] = (colTotals[s] || 0) + val;
            });
        });

        // Use pre-calculated totals from the API if available to ensure consistency
        const preCalcTotals = isSarva 
            ? sarvaDict 
            : (bhinnaDict?.[selectedPlanet]?.total || bhinnaDict?.[selectedPlanet]?.total_bindus || bhinnaDict?.[selectedPlanet]?.bindus ||
               root[selectedPlanet]?.total || root[selectedPlanet]?.total_bindus || root[selectedPlanet]?.bindus ||
               root[selectedPlanet.toLowerCase()]?.total || null);

        if (preCalcTotals && (typeof preCalcTotals === 'object' || Array.isArray(preCalcTotals))) {
            const hasValues = SIGNS.some(s => getVal(preCalcTotals, s) > 0);
            if (hasValues) {
                SIGNS.forEach(s => {
                    const preVal = getVal(preCalcTotals, s);
                    if (preVal !== undefined) colTotals[s] = preVal;
                });
            }
        }

        return { rows, matrix, columnTotals: colTotals };
    }, [data, isSarva, selectedPlanet]);



    const { rows, matrix, columnTotals } = processedData;

    // 4. Styling Logic
    const getCellIntensity = (val: number) => {
        if (isSarva) {
            if (val >= 35) return 'bg-emerald-500/20 text-emerald-700';
            if (val >= 30) return 'bg-emerald-400/10 text-emerald-600';
            if (val >= 25) return 'bg-amber-400/5 text-amber-700';
            if (val >= 20) return 'bg-orange-400/10 text-orange-600';
            return 'bg-red-500/10 text-red-700';
        } else {
            if (val >= 1) return 'bg-emerald-500/15 text-emerald-700';
            return 'bg-red-500/5 text-red-500/30';
        }
    };

    if (!data || rows.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 opacity-40">
                <Shield className="w-12 h-12 mb-4" />
                <p className="text-[12px] font-bold uppercase tracking-widest text-center">No Matrix Data Found</p>
                <p className="text-[10px] uppercase tracking-tight mt-1">Ensure systems are calculated correctly</p>
            </div>
        );
    }

    return (
        <div className={cn(className, "h-full flex flex-col gap-2 p-1 overflow-hidden")}>
            {!isSarva && availablePlanets.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar-slim pb-1 px-1 shrink-0">
                    {availablePlanets.map(p => (
                        <button
                            key={p}
                            onClick={() => setSelectedPlanet(p)}
                            className={cn(
                                "whitespace-nowrap px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all duration-300",
                                selectedPlanet === p 
                                    ? "bg-gold-primary text-white shadow-sm" 
                                    : "bg-surface-warm/40 text-ink/40 hover:bg-surface-warm hover:text-ink/60"
                            )}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-auto custom-scrollbar-slim rounded border border-ink/5 bg-white/30">
                <table className="w-full border-separate border-spacing-[1px]">
                    <thead className="sticky top-0 z-20 bg-[#FDFBF7]">
                        <tr>
                            <th className="w-10 p-1 text-[8px] font-black uppercase text-gold-dark text-left bg-surface-warm/50 rounded-tl-sm">Sign</th>
                            {SIGNS.map(s => {
                                const isLagna = lagnaSign === s;
                                return (
                                    <th key={s} className={cn("w-8 p-1 text-center bg-surface-warm/20", isLagna && "bg-gold-primary/10")}>
                                        <div className="flex flex-col items-center relative gap-0.5">
                                            {isLagna && <div className="absolute -top-1.5 px-0.5 bg-gold-primary text-white text-[6px] font-black rounded-sm shadow-sm">L</div>}
                                            <span className={cn("text-[8px] font-black", isLagna ? "text-gold-dark" : "text-ink/80")}>{s}</span>
                                            <span className="text-[6px] font-bold opacity-30 uppercase tracking-tighter">{ZODIAC_SIGNS[s-1].slice(0,3)}</span>
                                        </div>
                                    </th>
                                );
                            })}
                            <th className="w-10 p-1 text-[8px] font-black uppercase text-gold-dark bg-surface-warm/50 rounded-tr-sm">Tot</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((rowName) => {
                            const rowData = matrix[rowName] || {};
                            let rowTot = SIGNS.reduce((acc, s) => acc + (rowData[s] || 0), 0);
                            const meta = PLANET_METADATA[rowName] || { label: rowName.substring(0,2).toUpperCase(), icon: () => <span>•</span>, color: 'text-ink' };

                            return (
                                <tr key={rowName} className="group hover:bg-gold-primary/5 transition-colors">
                                    <td className="p-1 px-1.5 min-w-[40px] bg-surface-warm/10 rounded-l-sm border-r border-ink/5">
                                        <div className="flex items-center gap-1.5">
                                            <span className={cn("text-[9px]", meta.color)}>{meta.icon()}</span>
                                            <span className="text-[9px] font-black text-ink/60 uppercase tracking-tighter">{meta.label}</span>
                                        </div>
                                    </td>
                                    {SIGNS.map(s => {
                                        const v = rowData[s] || 0;
                                        return (
                                            <td key={s} className={cn("p-1 text-center transition-all duration-300", getCellIntensity(v))}>
                                                <span className="text-[9px] font-black tracking-tight">{v}</span>
                                            </td>
                                        );
                                    })}
                                    <td className="p-1 text-center bg-surface-warm/20 rounded-r-sm font-black text-[9px] text-ink">
                                        {rowTot}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="sticky bottom-0 z-10">
                        <tr className="bg-surface-warm/60 backdrop-blur-md border-t border-ink/10">
                            <td className="p-1.5 rounded-bl-sm">
                                <span className="text-[9px] font-black uppercase text-gold-dark tracking-widest pl-1 leading-none">{isSarva ? 'SAV' : 'TOT'}</span>
                            </td>
                            {SIGNS.map(s => {
                                const tot = columnTotals[s];
                                return (
                                    <td key={s} className={cn(
                                        "p-1.5 text-center",
                                        isSarva && tot >= 30 ? "text-emerald-700 font-black" : isSarva && tot < 22 ? "text-red-600 font-black" : "text-ink font-bold"
                                    )}>
                                        <div className="flex flex-col items-center leading-none">
                                            <span className="text-[10px]">{tot}</span>
                                        </div>
                                    </td>
                                )
                            })}
                            <td className="p-1.5 text-center bg-gold-primary/20 rounded-br-sm">
                                <span className="text-[10px] font-black text-gold-dark">
                                    {Object.values(columnTotals).reduce((a, b) => a + b, 0)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Micro Legenda */}
            <div className="flex items-center justify-between px-1 shrink-0 pt-0.5 border-t border-ink/5">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
                        <span className="text-[7px] font-bold uppercase text-ink/40 tracking-widest">Selected Row Bindus</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-20">
                    <Info className="w-2 h-2 text-ink" />
                    <span className="text-[7px] font-bold uppercase text-ink tracking-tight">
                        {isSarva ? "Sum of all planetary bindus" : `Contributors to ${selectedPlanet}`}
                    </span>
                </div>
            </div>
        </div>
    );
}

const PLANETS_WITH_ASC = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];
