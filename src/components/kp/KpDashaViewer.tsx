"use client";

import React, { useState, useEffect } from 'react';
import { 
    Loader2, 
    ChevronRight, 
    Calendar, 
    ChevronDown 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { DASHA_LEVELS, DASHA_SYSTEMS } from '@/lib/dasha-constants';
import { PLANET_COLORS } from '@/lib/astrology-constants';
import { 
    processDashaResponse, 
    DashaNode, 
    standardizeDuration, 
    generateVimshottariSubperiods 
} from '@/lib/dasha-utils';

interface KpDashaViewerProps {
    className?: string;
}

function formatDateShort(dateStr: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr || '—';
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function KpDashaViewer({ className }: KpDashaViewerProps) {
    const { clientDetails } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [selectedDashaType, setSelectedDashaType] = useState<string>('vimshottari');
    const [dashaTree, setDashaTree] = useState<DashaNode[]>([]);
    const [currentLevel, setCurrentLevel] = useState<number>(0);
    const [selectedPath, setSelectedPath] = useState<DashaNode[]>([]);
    const [viewingPeriods, setViewingPeriods] = useState<DashaNode[]>([]);
    
    const clientId = clientDetails?.id || '';

    // Queries
    const { data: vimshottariResponse, isLoading: vimLoading } = useDasha(
        clientId,
        'mahadasha',
        ayanamsa.toLowerCase()
    );

    const { data: otherResponse, isLoading: otherLoading } = useOtherDasha(
        clientId,
        selectedDashaType,
        ayanamsa.toLowerCase()
    );

    const isLoading = selectedDashaType === 'vimshottari' ? vimLoading : otherLoading;
    const allowMathematicalDrillDown = selectedDashaType === 'vimshottari';

    // Process data into tree
    useEffect(() => {
        const dashaData = selectedDashaType === 'vimshottari' ? vimshottariResponse?.data : otherResponse?.data;
        if (dashaData) {
            const maxLevel = selectedDashaType === 'vimshottari' ? 4 : 1;
            const processedTree = processDashaResponse(dashaData, maxLevel);
            if (processedTree.length > 0) {
                const finalTree = selectedDashaType === 'vimshottari' ? processedTree.slice(0, 9) : processedTree;
                setDashaTree(finalTree);
            }
        }
    }, [vimshottariResponse, otherResponse, selectedDashaType]);

    // Update viewing periods based on path
    useEffect(() => {
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
    }, [dashaTree, selectedPath]);

    const handleDrillDown = (period: DashaNode) => {
        let nextLevelPeriods = period.sublevel || [];

        if ((!nextLevelPeriods || nextLevelPeriods.length === 0) && allowMathematicalDrillDown && currentLevel < 4) {
            nextLevelPeriods = generateVimshottariSubperiods(period);
            period.sublevel = nextLevelPeriods;
        }

        if (nextLevelPeriods && nextLevelPeriods.length > 0) {
            setSelectedPath([...selectedPath, period]);
            setCurrentLevel(currentLevel + 1);
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
        }
    };

    const handleSystemChange = (type: string) => {
        setSelectedDashaType(type);
        setCurrentLevel(0);
        setSelectedPath([]);
        setDashaTree([]);
    };

    if (isLoading && !dashaTree.length) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-surface-pure/50 rounded-xl h-full border border-gold-primary/10">
                <Loader2 className="w-10 h-10 text-gold-dark animate-spin mb-4" />
                <p className="font-serif text-[14px] text-gold-dark animate-pulse italic">Calculating Eras...</p>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col h-full bg-surface-pure rounded-xl border border-gold-primary/15 shadow-sm overflow-hidden", className)}>
            {/* Header Controls */}
            <div className="p-4 border-b border-gold-primary/10 flex flex-wrap items-center justify-between gap-4 shrink-0 bg-gold-primary/5">
                <div className="flex items-center gap-3">
                    <label className={cn(TYPOGRAPHY.label, "!mb-0")}>System</label>
                    <div className="relative">
                        <select
                            value={selectedDashaType}
                            onChange={(e) => handleSystemChange(e.target.value)}
                            className="appearance-none bg-white border border-gold-primary/20 rounded-xl px-4 py-1.5 pr-10 text-[13px] font-medium text-ink focus:outline-none focus:ring-2 focus:ring-gold-primary/30 cursor-pointer min-w-[180px]"
                        >
                            {DASHA_SYSTEMS.map((sys) => (
                                <option key={sys.id} value={sys.id}>
                                    {sys.name} {sys.years > 0 ? `(${sys.years} yrs)` : ''}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark pointer-events-none" />
                    </div>
                </div>

                {/* Level Tabs */}
                {selectedDashaType === 'vimshottari' && (
                    <div className="flex gap-1">
                        {DASHA_LEVELS.map((level, idx) => (
                            <button
                                key={level.id}
                                onClick={() => handleBreadcrumbClick(idx - 1)}
                                disabled={idx > selectedPath.length}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border",
                                    currentLevel === idx
                                        ? cn(COLORS.wbActiveTab, "border-transparent text-white shadow-sm")
                                        : idx <= selectedPath.length
                                            ? "bg-white text-gold-dark border-gold-primary/20 hover:bg-gold-primary/10"
                                            : "bg-surface-warm text-ink/30 border-gold-primary/15 cursor-not-allowed"
                                )}
                            >
                                {level.short}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Breadcrumbs Area */}
            <div className="px-4 py-2 border-b border-gold-primary/10 flex items-center gap-2 overflow-x-auto shrink-0 bg-white">
                <button
                    onClick={() => handleBreadcrumbClick(-1)}
                    className={cn(
                        "text-[12px] font-bold px-2 py-0.5 rounded",
                        currentLevel === 0 ? "text-gold-dark bg-gold-primary/10" : "text-gold-dark/60"
                    )}
                >
                    Mahadasha
                </button>
                {selectedPath.map((period, idx) => (
                    <React.Fragment key={idx}>
                        <ChevronRight className="w-3 h-3 text-gold-dark/40" />
                        <button
                            onClick={() => handleBreadcrumbClick(idx)}
                            className={cn(
                                "text-[12px] font-bold px-2 py-0.5 rounded border",
                                PLANET_COLORS[period.planet] || "bg-surface-pure border-gold-primary/15",
                                currentLevel === idx + 1 ? "ring-1 ring-gold-primary" : ""
                            )}
                        >
                            {period.planet}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto bg-white/40 custom-scrollbar">
                <table className="w-full border-collapse">
                    <thead className={cn(TYPOGRAPHY.tableHeader, "bg-gold-primary/5 border-b border-gold-primary/10 sticky top-0 z-10")}>
                        <tr>
                            <th className="px-4 py-2 text-left">Planet</th>
                            <th className="px-4 py-2 text-left">Start Date</th>
                            <th className="px-4 py-2 text-left">End Date</th>
                            <th className="px-4 py-2 text-left">Duration</th>
                            <th className="px-4 py-2 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-primary/10 bg-white/40">
                        {viewingPeriods.map((period, idx) => {
                            const isClickable = allowMathematicalDrillDown && currentLevel < 4;
                            return (
                                <tr 
                                    key={idx} 
                                    className={cn(
                                        "hover:bg-gold-primary/5 transition-colors group",
                                        period.isCurrent && "bg-gold-primary/5 font-semibold",
                                        isClickable ? "cursor-pointer" : "cursor-default"
                                    )}
                                    onClick={() => isClickable && handleDrillDown(period)}
                                >
                                    <td className="px-4 py-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border shadow-sm min-w-[60px] justify-center", 
                                                PLANET_COLORS[period.planet] || "bg-surface-pure"
                                            )}>
                                                {period.planet}
                                            </span>
                                            {period.isCurrent && (
                                                <span className="inline-flex items-center px-1.5 py-0 rounded-full text-[8px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className={cn(TYPOGRAPHY.dateAndDuration, "flex items-center gap-1.5")}>
                                            <Calendar className="w-3 h-3 text-gold-dark/40" />
                                            {formatDateShort(period.startDate)}
                                        </div>
                                    </td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-4 py-2")}>
                                        {formatDateShort(period.endDate)}
                                    </td>
                                    <td className={cn(TYPOGRAPHY.dateAndDuration, "px-4 py-2")}>
                                        {standardizeDuration((period.raw as any)?.duration_years || 0, (period.raw as any)?.duration_days || 0)}
                                    </td>
                                    <td className="px-4 py-2 text-center text-gold-dark/40">
                                        {period.isCurrent ? (
                                            <span className="text-[10px] font-black text-green-600">LIVE</span>
                                        ) : isClickable ? (
                                            <ChevronRight className="w-4 h-4 text-gold-dark/40 group-hover:text-gold-dark transition-transform group-hover:translate-x-0.5" />
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {viewingPeriods.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-ink/40 italic font-sans text-[14px]">
                                    No periods available for this depth.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Legend */}
            <div className="px-4 py-2 bg-surface-warm/50 border-t border-gold-primary/10 flex justify-between text-[10px] text-gold-dark/60 font-sans uppercase tracking-widest">
                <span>Vedic Vimshottari System</span>
                <span>Click rows to drill down</span>
            </div>
        </div>
    );
}
