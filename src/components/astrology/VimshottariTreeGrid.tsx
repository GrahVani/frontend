"use client";

import React, { useMemo, useState } from 'react';
import { cn } from "@/lib/utils";
import { CalendarDays, ChevronRight, Clock3, Home, Loader2 } from 'lucide-react';
import { DashaNode, calculateDuration, generateVimshottariSubperiods, parseApiDate } from '@/lib/dasha-utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';
import { getPlanetSymbol } from '@/lib/planet-symbols';

interface VimshottariTreeGridProps {
    data: DashaNode[];
    isLoading?: boolean;
    className?: string;
    maxDepth?: number;
}

const PLANET_ABBREVIATIONS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me', 'Jupiter': 'Ju',
    'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
};

const PLANET_GLYPH_COLORS: Record<string, string> = {
    Sun: '#F59E0B',
    Moon: '#3867FF',
    Mars: '#FF4967',
    Mercury: '#0F8F65',
    Jupiter: '#7C5CFF',
    Venus: '#F05A96',
    Saturn: '#F59E0B',
    Rahu: '#D97706',
    Ketu: '#D97706',
};

const LEVEL_LABELS = ["MAHA", "ANTAR", "PRATYANTAR", "SOOKSHMA", "PRANA"];

const LEVEL_TOOLTIP_TERMS: Record<string, string> = {
    'MAHA': 'dasha_mahadasha',
    'ANTAR': 'dasha_antardasha',
    'PRATYANTAR': 'dasha_pratyantardasha',
};

const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'â€”';
    try {
        const d = parseApiDate(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    } catch {
        return dateStr || 'â€”';
    }
};

export default function VimshottariTreeGrid({ data, isLoading, className, maxDepth = 4 }: VimshottariTreeGridProps) {
    // State to track the navigation path (array of selected nodes)
    const [navPath, setNavPath] = useState<DashaNode[]>([]);

    const pathPrefix = useMemo(() => {
        return navPath.map(n => PLANET_ABBREVIATIONS[n.planet] || n.planet.substring(0, 2)).join('-') + (navPath.length > 0 ? '-' : '');
    }, [navPath]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-amber-600 animate-spin mb-1" />
                <p className="font-sans text-[12px] text-amber-600/45 italic leading-compact">Processing dasha...</p>
            </div>
        );
    }

    // Determine what to display based on navigation path
    const currentNodes = navPath.length === 0 ? data : navPath[navPath.length - 1].sublevel || [];
    const currentLevelName = LEVEL_LABELS[navPath.length] || "DASA";

    const handleDrillDown = (node: DashaNode) => {
        let nodeToDrill = node;

        // If no sublevels exist, try to generate them on the fly (for non-active periods)
        if (!node.sublevel || node.sublevel.length === 0) {
            const generated = generateVimshottariSubperiods(node);
            if (generated.length > 0) {
                nodeToDrill = { ...node, sublevel: generated };
            }
        }

        if (nodeToDrill.sublevel && nodeToDrill.sublevel.length > 0) {
            setNavPath([...navPath, nodeToDrill]);
        }
    };



    const handleReset = () => {
        setNavPath([]);
    };

    return (
        <div className={cn("w-full flex flex-col overflow-hidden rounded-lg border border-amber-200/60 bg-white shadow-sm", className)}>
            {/* Navigation Header / Breadcrumbs */}
            <div className="bg-amber-50/30 border-b border-amber-200/50 p-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <button
                    onClick={handleReset}
                    className={cn(
                        "px-1.5 py-0.5 rounded hover:bg-amber-100 transition-colors leading-compact font-serif inline-flex items-center gap-1",
                        navPath.length === 0 ? "font-bold text-amber-900" : "text-amber-700",
                        TYPOGRAPHY.breadcrumb
                    )}
                >
                    <Home className="w-3 h-3 text-amber-600" />
                    Home
                </button>
                {navPath.length > 0 && <ChevronRight className="w-2.5 h-2.5 text-amber-600 flex-shrink-0" />}
                {navPath.map((node, i) => (
                    <React.Fragment key={i}>
                        {i > 0 && <ChevronRight className="w-2.5 h-2.5 text-amber-600 flex-shrink-0" />}
                        <button
                            onClick={() => setNavPath(navPath.slice(0, i + 1))}
                            className={cn(
                                "px-1.5 py-0.5 rounded hover:bg-amber-100 transition-colors leading-compact font-serif flex items-center gap-1 text-black text-[18px]",
                                i === navPath.length - 1 ? "font-bold" : "",
                                TYPOGRAPHY.breadcrumb
                            )}
                        >
                            <span>{PLANET_ABBREVIATIONS[node.planet] || node.planet}</span>
                        </button>
                    </React.Fragment>
                ))}
            </div>

            <div className="flex-1 overflow-x-auto scrollbar-hidden">
                <table className="w-full border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 bg-amber-50/95 backdrop-blur-sm shadow-sm">
                        <tr className={cn("border-b border-amber-200/60", TYPOGRAPHY.tableHeader)}>
                            <th className="px-0.5 py-0.5 text-left w-[33%]">
                                {LEVEL_TOOLTIP_TERMS[currentLevelName] ? (
                                    <KnowledgeTooltip
                                        term={LEVEL_TOOLTIP_TERMS[currentLevelName]}
                                        unstyled
                                        className="[&>span:last-child]:w-[16px] [&>span:last-child]:h-[16px] [&>span:last-child]:border-orange-400 [&>span:last-child]:text-orange-500 [&>span:last-child]:shadow-none"
                                    >
                                        {currentLevelName}
                                    </KnowledgeTooltip>
                                ) : currentLevelName}
                            </th>
                            <th className="px-0.5 py-0.5 text-left w-[27%] text-emerald-700/80">
                                <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" />Start</span>
                            </th>
                            <th className="px-0.5 py-0.5 text-left w-[27%] text-amber-800/80">
                                <span className="inline-flex items-center gap-1"><CalendarDays className="w-3 h-3" />End</span>
                            </th>
                            <th className="px-0.5 py-0.5 text-left w-[13%]">
                                <span className="inline-flex items-center gap-1"><Clock3 className="w-3 h-3" />Dur</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-200/40">
                        {currentNodes.length > 0 ? (
                            currentNodes.map((node, idx) => (
                                <DashaDrillRow
                                    key={node.planet + idx}
                                    node={node}
                                    depth={navPath.length}
                                    pathPrefix={pathPrefix}
                                    onDrill={() => handleDrillDown(node)}
                                    maxDepth={maxDepth}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-4 text-center font-sans text-[12px] text-amber-600/45 italic leading-compact">No sub-periods found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function DashaDrillRow({ node, depth, pathPrefix, onDrill, maxDepth = 4 }: { node: DashaNode; depth: number; pathPrefix: string; onDrill: () => void; maxDepth?: number }) {
    const isActive = node.isCurrent;
    const hasData = node.sublevel && node.sublevel.length > 0;
    // Allow drilling if we have data OR if we are not yet at the deepest level (Prana = depth 4)
    // This allows generating sub-periods on the fly for non-active branches
    const isDrillable = hasData || depth < maxDepth;

    const durationDisplay = useMemo(() => {
        return calculateDuration(node.startDate, node.endDate);
    }, [node.startDate, node.endDate]);

    return (
        <tr
            onClick={isDrillable ? onDrill : undefined}
            className={cn(
                "transition-colors group border-b border-amber-200/40",
                isActive ? "bg-emerald-50/60 font-bold shadow-[inset_2px_0_0_#059669]" : "hover:bg-amber-50/50",
                isDrillable ? "cursor-pointer" : "cursor-default",
                depth > 0 ? "text-[10px]" : "text-[11px]"
            )}
        >
            <td className="px-0.5 py-0.5 align-middle">
                <div className="flex flex-col gap-0.5 w-full">
                    <div className="flex items-center gap-1.5">
                        {isDrillable ? (
                            <ChevronRight className="w-2.5 h-2.5 text-amber-700/70 group-hover:text-amber-700 transition-colors flex-shrink-0" />
                        ) : (
                            // Spacer for alignment if no chevron
                            <span className="w-2.5 inline-block" />
                        )}
                        <div className="flex items-center">
                            {depth > 0 && (
                                <span className={cn(TYPOGRAPHY.planetName, "font-serif text-black shrink-0 tracking-tighter")}>{pathPrefix}</span>
                            )}
                            <span className={cn(TYPOGRAPHY.planetName, "font-serif tracking-tighter flex items-center gap-1.5 text-black")}>
                                <span
                                    className="text-[18px] leading-none min-w-4 text-center"
                                    style={{ color: PLANET_GLYPH_COLORS[node.planet] || '#92400E' }}
                                >
                                    {getPlanetSymbol(node.planet)}
                                </span>
                                <span>{PLANET_ABBREVIATIONS[node.planet] || node.planet}</span>
                            </span>
                        </div>
                        {isActive && (
                            <span className={cn("ml-1 px-1.5 py-0.5 bg-emerald-100 border border-emerald-200 rounded-full leading-none", TYPOGRAPHY.breadcrumb, "text-emerald-700 font-bold text-[9px]")}>
                                A
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden", isActive ? "text-emerald-800" : "text-emerald-700/80", TYPOGRAPHY.dateAndDuration)}>
                {formatDate(node.startDate)}
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden", isActive ? "text-emerald-800" : "text-amber-800/80", TYPOGRAPHY.dateAndDuration)}>
                {formatDate(node.endDate)}
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden", TYPOGRAPHY.dateAndDuration)}>
                <span className={cn(
                    "inline-flex min-w-[38px] justify-center rounded-md border px-1.5 py-0.5 leading-none",
                    isActive
                        ? "border-emerald-200 bg-emerald-100 text-emerald-800"
                        : "border-amber-200/60 bg-amber-50/50 text-amber-900/80"
                )}>
                    {durationDisplay}
                </span>
            </td>
        </tr>
    );
}
