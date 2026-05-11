import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, ChevronRight, Milestone } from 'lucide-react';
import { clientApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_COLORS, SIGN_COLORS } from '@/lib/astrology-constants';
import { getPlanetSymbol } from '@/lib/planet-symbols';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';
import {
    processDashaResponse, DashaNode, generateVimshottariSubperiods, calculateDuration
} from '@/lib/dasha-utils';
import { DASHA_LEVELS } from '@/lib/dasha-constants';
import dynamic from 'next/dynamic';

interface IntegratedDashaViewerProps {
    dashaType: string;
    clientId: string;
    ayanamsa: string;
    dashaData: any;
    isLoading?: boolean;
    compact?: boolean;
}

const PLANET_ABBREVIATIONS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me', 'Jupiter': 'Ju',
    'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return { date: '—', day: '' };
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) {
            const parts = dateStr.split(/[-/]/);
            if (parts.length === 3) {
                const year = parseInt(parts[2]);
                const month = parseInt(parts[1]) - 1;
                const day = parseInt(parts[0]);
                const parsed = new Date(year, month, day);
                if (!isNaN(parsed.getTime())) {
                    return {
                        date: `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${year}`,
                        day: parsed.toLocaleDateString('en-US', { weekday: 'short' })
                    };
                }
            }
            return { date: dateStr || '—', day: '' };
        }
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
        return { date: `${day}-${month}-${year}`, day: weekday };
    } catch {
        return { date: dateStr || '—', day: '' };
    }
};

export default function IntegratedDashaViewer({
    dashaType, clientId, ayanamsa, dashaData, isLoading = false, compact = false
}: IntegratedDashaViewerProps) {
    const [dashaTree, setDashaTree] = useState<DashaNode[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [selectedPath, setSelectedPath] = useState<DashaNode[]>([]);
    const [viewingPeriods, setViewingPeriods] = useState<DashaNode[]>([]);
    const [isSubLevelFetching, setIsSubLevelFetching] = useState(false);
    const [selectedIntelPlanet, setSelectedIntelPlanet] = useState<string | null>(null);
    const [selectedCycle, setSelectedCycle] = useState<number>(1);

    const isVimshottari = dashaType === 'vimshottari';
    const isTribhagi = dashaType.includes('tribhagi');
    const isShodashottari = dashaType === 'shodashottari';
    const isDwadashottari = dashaType === 'dwadashottari';
    const isPanchottari = dashaType.includes('panchottari');
    const isChaturshitisama = dashaType === 'chaturshitisama';
    const isSatabdika = dashaType === 'satabdika';
    const isDwisaptati = dashaType === 'dwisaptati';
    const isAshtottari = dashaType === 'ashtottari';
    const isChara = dashaType === 'chara';
    const isShasthihayani = dashaType === 'shasthihayani' || Boolean(((dashaData?.mahadashas as any)?.meta as any)?.shastihayani_condition);
    const isShattrimshatsama = dashaType === 'shattrimshatsama' || Boolean(((dashaData?.mahadashas as any)?.meta as any)?.shattrimshatsama_condition);

    const isCycleBased = isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isSatabdika || isDwisaptati || isShattrimshatsama;

    const getPlanetsPerCycle = (type: string): number => {
        switch (type) {
            case 'tribhagi': return 9;
            case 'shodashottari': return 8;
            case 'dwadashottari': return 8;
            case 'panchottari': return 7;
            case 'satabdika': return 7;
            case 'dwisaptati': return 8;
            case 'shattrimshatsama': return 8;
            default: return 9;
        }
    };

    const ERA_NAMES: Record<number, string> = {
        1: "First Era (Childhood To Youth)",
        2: "Second Era (Adulthood)",
        3: "Third Era (Maturity & Wisdom)",
        4: "Fourth Era (Legacy)"
    };

    // Group periods by cycle for cycle-based dashas
    const cycles = useMemo(() => {
        if (!dashaTree.length || !isCycleBased || currentLevel > 0) return {};
        const grouped: Record<number, DashaNode[]> = {};
        const planetsPerCycle = getPlanetsPerCycle(dashaType);
        dashaTree.forEach((p, idx) => {
            let cNum = (p.raw?.cycle as number) || Math.floor(idx / planetsPerCycle) + 1;
            // Sanitize: ensure valid positive integer
            cNum = Number.isFinite(cNum) && cNum > 0 ? Math.floor(cNum) : Math.floor(idx / planetsPerCycle) + 1;
            if (!grouped[cNum]) grouped[cNum] = [];
            grouped[cNum].push(p);
        });
        return grouped;
    }, [dashaTree, isCycleBased, currentLevel, dashaType]);

    const availableCycles = useMemo(() => {
        return Object.keys(cycles)
            .map(Number)
            .filter(n => Number.isFinite(n) && n > 0)
            .sort((a, b) => a - b);
    }, [cycles]);

    const activeCycleNum = useMemo(() => {
        if (!availableCycles.length) return 1;
        for (const cNum of availableCycles) {
            if (cycles[cNum]?.some(p => p.isCurrent)) return cNum;
        }
        return availableCycles[0];
    }, [cycles, availableCycles]);

    useEffect(() => {
        if (activeCycleNum && isCycleBased && currentLevel === 0) {
            setSelectedCycle(activeCycleNum);
        }
    }, [activeCycleNum, isCycleBased, currentLevel]);

    const isKP = ayanamsa.toLowerCase() === 'kp';
    const allowMathematicalDrillDown = isVimshottari && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isShasthihayani && !isShattrimshatsama && !isAshtottari;

    useEffect(() => {
        if (dashaData) {
            const maxLevel = isVimshottari ? 4 : (isAshtottari ? 2 : (isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati || isShasthihayani || isShattrimshatsama ? 1 : 4));
            const apiResponseWrapper = dashaData.mahadashas ? dashaData : { data: dashaData };
            const processedTree = processDashaResponse(apiResponseWrapper, maxLevel);

            if (processedTree.length > 0) {
                const finalTree = isVimshottari ? processedTree.slice(0, 9) : processedTree;
                setDashaTree(finalTree);
                if (selectedPath.length === 0) setViewingPeriods(finalTree);
            }
        }
    }, [dashaData, isVimshottari, isTribhagi, isShodashottari, isDwadashottari, isPanchottari, isChaturshitisama, isSatabdika, isDwisaptati, isShasthihayani, isShattrimshatsama, isAshtottari]);

    useEffect(() => {
        if ((!allowMathematicalDrillDown && !isAshtottari && currentLevel > 1) || (isAshtottari && currentLevel > 2)) {
            setCurrentLevel(0);
            setSelectedPath([]);
        }

        if (!allowMathematicalDrillDown || (isTribhagi && currentLevel >= 1) || (isShodashottari && currentLevel >= 1) || (isDwadashottari && currentLevel >= 1) || (isPanchottari && currentLevel >= 1) || (isChaturshitisama && currentLevel >= 1) || (isSatabdika && currentLevel >= 1) || (isDwisaptati && currentLevel >= 1) || (isAshtottari && currentLevel >= 2)) {
            if ((isTribhagi || isShodashottari || isDwadashottari || isPanchottari || isChaturshitisama || isSatabdika || isDwisaptati) && currentLevel === 0) {
                setViewingPeriods(dashaTree);
            } else if (!isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isAshtottari) {
                setViewingPeriods(dashaTree);
            }
            if (!isVimshottari && !isTribhagi && !isShodashottari && !isDwadashottari && !isPanchottari && !isChaturshitisama && !isSatabdika && !isDwisaptati && !isAshtottari && !isChara) {
                setViewingPeriods(dashaTree);
                return;
            }
        }

        let currentNodes = dashaTree;
        for (const p of selectedPath) {
            const match = currentNodes.find(n => n.planet === (p.planet || p.lord));
            if (match && match.sublevel) {
                currentNodes = match.sublevel;
            } else {
                currentNodes = [];
                break;
            }
        }
        setViewingPeriods(currentNodes);
    }, [dashaTree, selectedPath, currentLevel]);

    const handleDrillDown = async (period: DashaNode) => {
        const isMahaLevel = currentLevel === 0;
        const isAntarLevel = currentLevel === 1;

        if ((!period.sublevel || period.sublevel.length === 0) && !allowMathematicalDrillDown && clientId) {
            setIsSubLevelFetching(true);
            try {
                let result: any;
                if (isAshtottari) {
                    if (isAntarLevel) {
                        const mahaLord = selectedPath[0].planet;
                        const antarLord = period.planet;
                        result = await clientApi.generateOtherDasha(clientId, 'ashtottari', ayanamsa, 'pratyantardasha', false, { mahaLord, antarLord });
                    }
                } else if (isMahaLevel && !isVimshottari) {
                    result = await clientApi.generateOtherDasha(clientId, dashaType, ayanamsa, 'antardasha', false, { mahaLord: period.planet });
                }

                if (result?.data) {
                    const fullProcessed = processDashaResponse(result.data, currentLevel + 1);
                    const parentNode = fullProcessed.find(m => (m.planet || m.lord) === (isAntarLevel ? selectedPath[0].planet : period.planet));
                    if (isAntarLevel && parentNode) {
                        const childNode = parentNode.sublevel?.find(a => (a.planet || a.lord) === period.planet);
                        if (childNode?.sublevel) period.sublevel = childNode.sublevel;
                    } else if (parentNode?.sublevel) {
                        period.sublevel = parentNode.sublevel;
                    }
                }
            } catch (err) {
                console.error("[IntegratedDashaViewer] Failed to fetch sub-periods:", err);
            } finally {
                setIsSubLevelFetching(false);
            }
        }

        let nextLevelPeriods = period.sublevel || [];
        if ((!nextLevelPeriods || nextLevelPeriods.length === 0) && allowMathematicalDrillDown && currentLevel < (isKP ? 2 : 4)) {
            nextLevelPeriods = generateVimshottariSubperiods(period);
            period.sublevel = nextLevelPeriods;
        }

        if (nextLevelPeriods && nextLevelPeriods.length > 0) {
            setSelectedPath([...selectedPath, period]);
            setCurrentLevel(currentLevel + 1);
            setSelectedIntelPlanet(period.planet || period.lord || null);
        }
    };

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setSelectedPath([]);
            setCurrentLevel(0);
        } else {
            const newPath = selectedPath.slice(0, index + 1);
            setSelectedPath(newPath);
            setCurrentLevel(index + 1);
            setSelectedIntelPlanet(newPath[newPath.length - 1].planet || newPath[newPath.length - 1].lord || null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-full">
                <Loader2 className="w-8 h-8 text-gold-dark animate-spin mb-4" />
                <p className="font-serif text-[12px] text-gold-dark animate-pulse italic uppercase tracking-widest font-black opacity-30">Chronos Mapping...</p>
            </div>
        );
    }

    const pathPrefix = selectedPath.map(n => {
        const name = n.planet || n.lord || '';
        return isChara ? String(n.raw?.sign_name || name) : (PLANET_ABBREVIATIONS[name] || name.substring(0, 2));
    }).join('-') + (selectedPath.length > 0 ? '-' : '');

    // Filter periods by selected cycle when at level 0 for cycle-based dashas
    const displayPeriods = (isCycleBased && currentLevel === 0 && availableCycles.length > 0)
        ? (cycles[selectedCycle] || [])
        : viewingPeriods;

    const extractYear = (dateStr?: string) => {
        if (!dateStr) return '';
        const fmt = formatDate(dateStr);
        if (fmt.date === '—') return '';
        const parts = fmt.date.split('-');
        return parts.length === 3 ? parts[2] : '';
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Navigation Header */}
            {selectedPath.length > 0 && (
                <div className="bg-surface-warm/30 border-b border-gold-primary/10 px-3 py-1 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
                    <button onClick={() => handleBreadcrumbClick(-1)} className={cn("px-1.5 py-0.5 rounded hover:bg-gold-primary/10 transition-colors text-[11px] font-medium uppercase tracking-wider !text-primary")}>Home</button>
                    {selectedPath.map((node, i) => (
                        <React.Fragment key={i}>
                            <ChevronRight className="w-2.5 h-2.5 text-primary/30 shrink-0" />
                            <button
                                onClick={() => handleBreadcrumbClick(i)}
                                className={cn("px-1.5 py-0.5 rounded hover:bg-gold-primary/10 transition-colors text-[11px] font-medium whitespace-nowrap !text-primary")}
                            >
                                {isChara ? String(node.raw?.sign_name || node.planet || node.lord) : (PLANET_ABBREVIATIONS[node.planet || node.lord || ""] || (node.planet || node.lord || ""))}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* Cycle Tabs - for cycle-based dashas at level 0 */}
            {isCycleBased && currentLevel === 0 && availableCycles.length > 1 && (
                <div className="shrink-0 px-2 py-1.5 border-b border-gold-primary/10 bg-surface-warm/20">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <div className="flex bg-gold-soft/40 rounded-lg p-0.5 gap-0.5 border border-gold-primary/10 backdrop-blur-sm">
                            {availableCycles.map((c) => {
                                const isActive = selectedCycle === c;
                                const cyclePeriods = cycles[c] || [];
                                const startYear = cyclePeriods.length > 0 ? extractYear(cyclePeriods[0].startDate) : '';
                                const endYear = cyclePeriods.length > 0 ? extractYear(cyclePeriods[cyclePeriods.length - 1].endDate) : '';
                                return (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCycle(c)}
                                        className={cn(
                                            "flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 whitespace-nowrap",
                                            isActive
                                                ? "bg-primary text-active-glow shadow-sm font-semibold"
                                                : "hover:bg-primary/5 text-ink/70 font-medium"
                                        )}
                                    >
                                        <span className="text-[9px] uppercase tracking-wider">Cycle {c}</span>
                                        {startYear && endYear && (
                                            <>
                                                <span className="text-[9px] opacity-50">|</span>
                                                <span className="text-[9px] font-mono opacity-80">{startYear}-{endYear}</span>
                                            </>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        {isTribhagi && (
                            <div className="hidden sm:flex items-center gap-1 ml-auto">
                                <span className="text-[9px] font-bold text-ink/50 flex items-center gap-1 uppercase tracking-wider bg-gold-soft/30 px-2 py-0.5 rounded-md border border-gold-primary/10">
                                    <Milestone className="w-2.5 h-2.5 text-gold-dark" />
                                    {ERA_NAMES[selectedCycle] || `Cycle ${selectedCycle}`}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="flex-1 bg-white/40 p-0.5 flex flex-col min-h-0">
                <div className="flex-1 flex flex-col h-full">
                    {/* Header Strip - Fixed height */}
                    <div className="sticky top-0 z-20 bg-surface-warm/95 backdrop-blur-sm shadow-sm flex items-center shrink-0 border-b border-gold-primary/10 h-[36px]">
                        <div className="px-2 text-left w-[44%] !text-[11px] font-semibold tracking-wider text-primary">
                            {DASHA_LEVELS[currentLevel]?.name || 'Period'}
                        </div>
                        <div className="px-1 text-center w-[20%] !text-[11px] font-semibold tracking-wider text-primary">Start</div>
                        <div className="px-1 text-center w-[20%] !text-[11px] font-semibold tracking-wider text-primary">End</div>
                        <div className="px-1 text-center w-[16%] !text-[11px] font-semibold tracking-wider text-primary">Dur.</div>
                    </div>

                    {/* Filling Rows - Stretches to fill available height */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {displayPeriods.length > 0 ? (
                            displayPeriods.map((period, idx) => {
                                const startFmt = formatDate(period.startDate);
                                const endFmt = formatDate(period.endDate);
                                const durationStr = calculateDuration(period.startDate, period.endDate);
                                const isClickable = (currentLevel === 0 || period.canDrillFurther || (isAshtottari && currentLevel < 2) || (allowMathematicalDrillDown && currentLevel < (isKP ? 2 : 4)));
                                const nameStr = period.planet || period.lord || "";
                                const pName = isChara ? String(period.raw?.sign_name || nameStr) : (PLANET_ABBREVIATIONS[nameStr] || nameStr.substring(0, 2));
                                const displayName = isChara ? String(period.raw?.sign_name || nameStr) : nameStr;

                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex-1 flex items-center transition-all duration-200 group border-b border-gold-primary/5 last:border-none",
                                            period.isCurrent ? "bg-gold-primary/10" : "hover:bg-gold-primary/5 bg-white/40 shadow-sm",
                                            isClickable ? "cursor-pointer" : "cursor-default"
                                        )}
                                        onClick={() => isClickable && !isSubLevelFetching && handleDrillDown(period)}
                                    >
                                        <div className="px-1.5 flex items-center gap-1 w-[44%] h-full border-l-2 border-transparent group-hover:border-gold-primary transition-all overflow-hidden">
                                            {isClickable ? (
                                                <ChevronRight className="w-2.5 h-2.5 text-primary/40 group-hover:text-gold-dark transition-colors flex-shrink-0" />
                                            ) : (
                                                <div className="w-2 flex-shrink-0" />
                                            )}
                                            <div className="flex items-baseline gap-1 truncate overflow-hidden">
                                                <div className="flex items-center">
                                                    {selectedPath.length > 0 && (
                                                        <span className="!text-primary font-normal shrink-0 tracking-tighter !text-[11px] font-mono">{pathPrefix}</span>
                                                    )}
                                                    <span className="inline-flex items-center gap-1 shrink-0">
                                                        <span
                                                            className="text-[13px] font-serif leading-none"
                                                            style={{ color: PLANET_SVG_FILLS[nameStr] || '#92400E' }}
                                                        >
                                                            {getPlanetSymbol(nameStr)}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-primary">
                                                            {displayName}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            {period.isCurrent && (
                                                <span className="px-1 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full leading-none text-green-700 font-bold text-[8px] shrink-0">
                                                    A
                                                </span>
                                            )}
                                        </div>
                                        <div className={cn(TYPOGRAPHY.dateAndDuration, "w-[20%] px-0.5 text-center !text-[10px] font-semibold !text-primary tracking-tighter")}>
                                            {startFmt.date}
                                        </div>
                                        <div className={cn(TYPOGRAPHY.dateAndDuration, "w-[20%] px-0.5 text-center !text-[10px] font-semibold !text-primary tracking-tighter")}>
                                            {endFmt.date}
                                        </div>
                                        <div className={cn(TYPOGRAPHY.dateAndDuration, "w-[16%] px-0.5 text-center !text-[10px] font-semibold !text-primary tracking-tighter")}>
                                            {durationStr}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex-1 flex items-center justify-center py-8 text-[12px] text-primary/40 italic font-sans text-center">
                                Horizon line reached. No sub-eras available.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
