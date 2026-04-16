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
    onPlanetChange?: (planet: string) => void;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const SIGNS = Array.from({ length: 12 }, (_, i) => i + 1);

// Planet Two-Letter Abbreviations Only
const PLANET_METADATA: Record<string, { label: string; color: string }> = {
    Sun: { label: 'SU', color: 'text-orange-600' },
    Moon: { label: 'MO', color: 'text-blue-600' },
    Mars: { label: 'MA', color: 'text-red-600' },
    Mercury: { label: 'ME', color: 'text-emerald-600' },
    Jupiter: { label: 'JU', color: 'text-amber-600' },
    Venus: { label: 'VE', color: 'text-pink-600' },
    Saturn: { label: 'SA', color: 'text-indigo-600' },
    Lagna: { label: 'LG', color: 'text-slate-600' },
    Ascendant: { label: 'LG', color: 'text-slate-600' },
};

/**
 * Premium Ashtakavarga Matrix
 * A high-density, heatmap-style visualization for planetary bindus.
 */
export default function PremiumAshtakavargaMatrix({ type, planet: propPlanet, data, lagnaSign, className, onPlanetChange }: PremiumMatrixProps) {
    const isSarva = type === 'sarva';
    const [selectedPlanet, setSelectedPlanet] = React.useState<string>(propPlanet || 'Lagna');

    // Sync internal state with propPlanet if it changes externally
    React.useEffect(() => {
        if (propPlanet && propPlanet !== selectedPlanet) {
            setSelectedPlanet(propPlanet);
        }
    }, [propPlanet]);

    const handlePlanetChange = (planet: string) => {
        setSelectedPlanet(planet);
        onPlanetChange?.(planet);
    };

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

        // Handle tables array structure: ashtakvarga.tables = [{ planet: 'Sun', ... }, { planet: 'Moon', ... }]
        if (root.tables && Array.isArray(root.tables)) {
            const planetsFromTables = root.tables
                .map((t: any) => t.planet)
                .filter((p: string) => p && ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna', 'Ascendant'].includes(p));

            // Normalize and Deduplicate
            const normalized = Array.from(new Set(planetsFromTables.map((p: string) => {
                if (p.toLowerCase().startsWith('asc') || p.toLowerCase() === 'lagna') return 'Lagna';
                return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
            })));

            // Ensure prompt planet or default is in state
            if (normalized.length > 0 && !normalized.includes(selectedPlanet)) {
                const match = normalized.find((n) => (n as string).toLowerCase() === selectedPlanet.toLowerCase());
                if (!match) handlePlanetChange(normalized[0] as string);
            }

            return normalized as string[];
        }

        // Fallback: look for planet keys directly in root
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
            if (!match) handlePlanetChange(normalized[0]);
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
        // For both Sarva and Bhinna: use bhinnaDict or root which should contain all planets' data
        // This allows us to iterate through all planets (rows) and find their contributions
        let activeSource = (bhinnaDict || root) as any;

        // Fallback: if activeSource is null or empty, use root
        if (!activeSource || (typeof activeSource === 'object' && Object.keys(activeSource).length === 0)) {
            activeSource = root;
        }

        // Enhanced source detection: Look for nested matrix/table/data
        if (activeSource && typeof activeSource === 'object' && !Array.isArray(activeSource)) {
            // Priority list for matrix containers
            const matrixKeys = ['tables', 'matrix', 'table', 'rows', 'data', 'bhinnashtakavarga_points', 'ashtakavarga_points', 'ashtaka_table', 'contributors', 'contributions', 'contribution'];

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

        // Check if activeSource is from a "tables" array (ashtakvarga.tables structure)
        // where each item has { planet, contributors, total_bindus }
        const isTablesArray = activeSource?._is_array && activeSource.items?.[0]?.planet && activeSource.items?.[0]?.contributors;

        // For tables array: find the selected planet's table and use its contributors
        let selectedPlanetTable = null;
        if (isTablesArray && !isSarva) {
            // Map UI planet names to API planet names (Lagna -> Ascendant)
            const planetLookupName = selectedPlanet.toLowerCase() === 'lagna' ? 'ascendant' : selectedPlanet.toLowerCase();
            selectedPlanetTable = activeSource.items.find((t: any) =>
                t.planet?.toLowerCase() === planetLookupName
            );
        }

        const contributorsList = dataContribs ||
            (selectedPlanetTable?.contributors) ||
            (activeSource && activeSource._is_array ? activeSource.items : null) ||
            (activeSource?.contributors && Array.isArray(activeSource.contributors) ? activeSource.contributors : null);

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
        <div className={cn(className, "h-full flex flex-col gap-1 overflow-hidden")}>
            {!isSarva && availablePlanets.length > 0 && (
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar-slim pb-1 px-1 shrink-0">
                    {availablePlanets.map(p => (
                        <button
                            key={p}
                            onClick={() => handlePlanetChange(p)}
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

            <div className="flex-1 overflow-auto custom-scrollbar-slim">
                <table className="w-full h-full border-collapse border border-ink/20">
                    <thead className="sticky top-0 z-20 bg-surface-warm">
                        <tr className="border-b border-ink/20">
                            <th className="w-10 p-1 text-[9px] font-black uppercase text-ink text-left border-r border-ink/20">PL</th>
                            {SIGNS.map(s => (
                                <th key={s} className="w-7 p-1 text-center border-r border-ink/20 last:border-r-0">
                                    <span className="text-[9px] font-black text-ink">{s}</span>
                                </th>
                            ))}
                            <th className="w-8 p-1 text-[9px] font-black uppercase text-ink text-center">T</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((rowName) => {
                            const rowData = matrix[rowName] || {};
                            let rowTot = SIGNS.reduce((acc, s) => acc + (rowData[s] || 0), 0);
                            const meta = PLANET_METADATA[rowName] || { label: rowName.substring(0, 2).toUpperCase(), color: 'text-ink' };

                            return (
                                <tr key={rowName} className="border-b border-ink/10 last:border-b-0">
                                    <td className="p-1 px-1.5 min-w-[40px] border-r border-ink/20">
                                        <span className={cn("text-[10px] font-bold", meta.color)}>{meta.label}</span>
                                    </td>
                                    {SIGNS.map(s => {
                                        const v = rowData[s] || 0;
                                        return (
                                            <td key={s} className="p-1 text-center border-r border-ink/10 last:border-r-0">
                                                <span className="text-[9px] font-bold text-ink">{v}</span>
                                            </td>
                                        );
                                    })}
                                    <td className="p-1 text-center font-bold text-[9px] text-ink">
                                        {rowTot}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="sticky bottom-0 z-10 border-t border-ink/20 bg-surface-warm">
                        <tr>
                            <td className="p-1 px-1.5 border-r border-ink/20">
                                <span className="text-[9px] font-black uppercase text-ink">TT</span>
                            </td>
                            {SIGNS.map(s => {
                                const tot = columnTotals[s];
                                return (
                                    <td key={s} className="p-1 text-center border-r border-ink/10 last:border-r-0">
                                        <span className={cn(
                                            "text-[9px] font-bold",
                                            isSarva && tot >= 30 ? "text-emerald-700" : isSarva && tot < 22 ? "text-red-600" : "text-ink"
                                        )}>{tot}</span>
                                    </td>
                                )
                            })}
                            <td className="p-1 text-center">
                                <span className="text-[9px] font-black text-gold-dark">
                                    {Object.values(columnTotals).reduce((a, b) => a + b, 0)}
                                </span>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>
    );
}

const PLANETS_WITH_ASC = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];
