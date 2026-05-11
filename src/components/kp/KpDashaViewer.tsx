"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { ChevronRight, Loader2 } from 'lucide-react';
import { DashaNode, calculateDuration, generateVimshottariSubperiods, parseApiDate, processDashaResponse } from '@/lib/dasha-utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { useDasha } from '@/hooks/queries/useCalculations';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';

interface KpDashaViewerProps {
    className?: string;
}

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿', 'Jupiter': '♃',
    'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
};

const PLANET_ABBREVIATIONS: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me', 'Jupiter': 'Ju',
    'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
};

const LEVEL_LABELS = ["MAHA", "ANTAR", "PRATYANTAR", "SOOKSHMA", "PRANA"];

const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
        const d = parseApiDate(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    } catch {
        return dateStr || '—';
    }
};

export default function KpDashaViewer({ className }: KpDashaViewerProps) {
    const { clientDetails } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [dashaTree, setDashaTree] = useState<DashaNode[]>([]);
    const [navPath, setNavPath] = useState<DashaNode[]>([]);

    const clientId = clientDetails?.id || '';

    const { data: vimshottariResponse, isLoading } = useDasha(
        clientId,
        'mahadasha',
        ayanamsa.toLowerCase()
    );

    // Process data into tree
    useEffect(() => {
        const dashaData = vimshottariResponse?.data;
        if (dashaData) {
            const processedTree = processDashaResponse(dashaData, 2);
            if (processedTree.length > 0) {
                setDashaTree(processedTree.slice(0, 9));
            }
        }
    }, [vimshottariResponse]);

    const pathPrefix = useMemo(() => {
        return navPath.map(n => PLANET_ABBREVIATIONS[n.planet] || n.planet.substring(0, 2)).join('-') + (navPath.length > 0 ? '-' : '');
    }, [navPath]);

    if (isLoading && !dashaTree.length) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-6 h-full", className)}>
                <Loader2 className="w-5 h-5 text-amber-600 animate-spin mb-1" />
                <p className="font-sans text-[12px] text-amber-700/60 italic leading-compact">Processing dasha...</p>
            </div>
        );
    }

    // Determine what to display based on navigation path
    const currentNodes = navPath.length === 0 ? dashaTree : navPath[navPath.length - 1].sublevel || [];
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

    const handleBreadcrumbClick = (index: number) => {
        if (index === -1) {
            setNavPath([]);
        } else {
            setNavPath(navPath.slice(0, index + 1));
        }
    };

    return (
        <div className={cn("w-full flex flex-col overflow-hidden rounded-lg border border-amber-200/60 bg-white shadow-sm h-full", className)}>
            {/* Card Header + Breadcrumbs */}
            <div className="bg-amber-50/30 px-3 py-1.5 border-b border-amber-200/50 shrink-0 flex items-center justify-between gap-3">
                <h3 className={cn(TYPOGRAPHY.value, "text-[14px] text-amber-900 font-semibold leading-tight tracking-wide !mb-0 text-balance shrink-0")}>
                    Vimshottari Dasha
                </h3>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    <button
                        onClick={handleReset}
                        className={cn(
                            "px-1.5 py-0.5 rounded hover:bg-amber-100 transition-colors leading-compact font-serif",
                            navPath.length === 0 ? "font-bold text-amber-900" : "text-amber-700",
                            TYPOGRAPHY.breadcrumb
                        )}
                    >
                        Home
                    </button>
                    {navPath.length > 0 && <ChevronRight className="w-2.5 h-2.5 text-amber-600 flex-shrink-0" />}
                    {navPath.map((node, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <ChevronRight className="w-2.5 h-2.5 text-amber-600 flex-shrink-0" />}
                            <button
                                onClick={() => handleBreadcrumbClick(i)}
                                className={cn(
                                    "px-1.5 py-0.5 rounded hover:bg-amber-100 transition-colors leading-compact font-serif flex items-center gap-1",
                                    i === navPath.length - 1 ? "font-bold" : "",
                                    TYPOGRAPHY.breadcrumb
                                )}
                                style={{ color: PLANET_SVG_FILLS[node.planet] || '#92400E' }}
                            >
                                <span className="text-[13px] font-serif">{PLANET_SYMBOLS[node.planet] || ''}</span>
                                <span>{PLANET_ABBREVIATIONS[node.planet] || node.planet}</span>
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-x-auto scrollbar-hidden min-h-0">
                <table className="w-full border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 bg-amber-50/95 backdrop-blur-sm shadow-sm">
                        <tr className={cn("border-b border-amber-200/60", TYPOGRAPHY.tableHeader)}>
                            <th className="px-0.5 py-0.5 text-left w-[30%]">
                                {currentLevelName}
                            </th>
                            <th className="px-0.5 py-0.5 text-left w-[25%] text-emerald-700/70">Start</th>
                            <th className="px-0.5 py-0.5 text-left w-[25%] text-amber-800/70">End</th>
                            <th className="px-0.5 py-0.5 text-left w-[20%]">Dur</th>
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

function DashaDrillRow({ node, depth, pathPrefix, onDrill }: { node: DashaNode; depth: number; pathPrefix: string; onDrill: () => void }) {
    const isActive = node.isCurrent;
    const hasData = node.sublevel && node.sublevel.length > 0;
    const isDrillable = depth < 2;

    const progress = useMemo(() => {
        if (!isActive || !node.startDate || !node.endDate) return 0;
        const start = new Date(node.startDate).getTime();
        const end = new Date(node.endDate).getTime();
        const now = new Date().getTime();
        if (end <= start) return 0;
        return Math.max(0, Math.min(100, ((now - start) / (end - start)) * 100));
    }, [isActive, node.startDate, node.endDate]);

    const durationDisplay = useMemo(() => {
        return calculateDuration(node.startDate, node.endDate);
    }, [node.startDate, node.endDate]);

    return (
        <tr
            onClick={isDrillable ? onDrill : undefined}
            className={cn(
                "transition-colors group border-b border-amber-200/40",
                isActive ? "bg-amber-50 font-bold" : "hover:bg-amber-50/50",
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
                            <span className="w-2.5 inline-block" />
                        )}
                        <div className="flex items-center">
                            {depth > 0 && (
                                <span className={cn(TYPOGRAPHY.planetName, "font-serif text-amber-700 shrink-0 tracking-tighter")}>{pathPrefix}</span>
                            )}
                            <span className={cn(TYPOGRAPHY.planetName, "font-serif tracking-tighter flex items-center gap-1")} style={{ color: PLANET_SVG_FILLS[node.planet] || '#92400E' }}>
                                <span className="text-[16px]">{PLANET_SYMBOLS[node.planet] || ''}</span>
                                <span className="text-[16px] font-semibold">{PLANET_ABBREVIATIONS[node.planet] || node.planet}</span>
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
            <td className={cn("px-0.5 py-0.5 overflow-hidden text-emerald-700/80", TYPOGRAPHY.dateAndDuration)}>
                {formatDate(node.startDate)}
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden text-amber-800/80", TYPOGRAPHY.dateAndDuration)}>
                {formatDate(node.endDate)}
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden text-amber-700/80", TYPOGRAPHY.dateAndDuration)}>
                {durationDisplay}
            </td>
        </tr>
    );
}
