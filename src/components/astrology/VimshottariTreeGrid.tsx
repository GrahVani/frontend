"use client";

import React, { useMemo, useState } from 'react';
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { DashaNode, isDateRangeCurrent, calculateDuration, generateVimshottariSubperiods, parseApiDate } from '@/lib/dasha-utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface VimshottariTreeGridProps {
    data: DashaNode[];
    isLoading?: boolean;
    className?: string;
}

const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': 'â˜‰', 'Moon': 'â˜½', 'Mars': 'â™‚', 'Mercury': 'â˜¿', 'Jupiter': 'â™ƒ',
    'Venus': 'â™€', 'Saturn': 'â™„', 'Rahu': 'â˜Š', 'Ketu': 'â˜‹',
};

const LEVEL_LABELS = ["MAHA", "ANTAR", "PRATYANTAR", "SOOKSHMA", "PRANA"];

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

export default function VimshottariTreeGrid({ data, isLoading, className }: VimshottariTreeGridProps) {
    // State to track the navigation path (array of selected nodes)
    const [navPath, setNavPath] = useState<DashaNode[]>([]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-gold-primary animate-spin mb-1" />
                <p className="font-sans text-xs text-muted-refined italic leading-compact">Processing dasha...</p>
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
        <div className={cn("w-full flex flex-col overflow-hidden rounded-lg border border-border-warm/20 bg-white shadow-sm", className)}>
            {/* Navigation Header / Breadcrumbs */}
            {navPath.length > 0 && (
                <div className="bg-parchment/30 border-b border-border-warm/10 p-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {navPath.map((node, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <ChevronRight className="w-2.5 h-2.5 text-primary/70 flex-shrink-0" />}
                            <button
                                onClick={() => setNavPath(navPath.slice(0, i + 1))}
                                className={cn("px-1.5 py-0.5 rounded hover:bg-gold-primary/10 transition-colors leading-compact", TYPOGRAPHY.breadcrumb)}
                            >
                                {node.planet}
                            </button>
                        </React.Fragment>
                    ))}
                </div>
            )}

            <div className="flex-1 overflow-x-auto scrollbar-hidden">
                <table className="w-full border-collapse table-fixed">
                    <thead className="sticky top-0 z-20 bg-parchment/95 backdrop-blur-sm shadow-sm">
                        <tr className={cn("border-b border-border-warm/10", TYPOGRAPHY.tableHeader)}>
                            <th className="px-0.5 py-0.5 text-left w-[30%]">{currentLevelName}</th>
                            <th className="px-0.5 py-0.5 text-left w-[25%]">Start</th>
                            <th className="px-0.5 py-0.5 text-left w-[25%]">End</th>
                            <th className="px-0.5 py-0.5 text-left w-[20%]">Dur</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/5">
                        {currentNodes.length > 0 ? (
                            currentNodes.map((node, idx) => (
                                <DashaDrillRow
                                    key={node.planet + idx}
                                    node={node}
                                    depth={navPath.length}
                                    onDrill={() => handleDrillDown(node)}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-4 text-center font-sans text-xs text-muted-refined italic leading-compact">No sub-periods found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

function DashaDrillRow({ node, depth, onDrill }: { node: DashaNode; depth: number; onDrill: () => void }) {
    const isActive = node.isCurrent;
    const hasData = node.sublevel && node.sublevel.length > 0;
    // Allow drilling if we have data OR if we are not yet at the deepest level (Prana = depth 4)
    // This allows generating sub-periods on the fly for non-active branches
    const isDrillable = hasData || depth < 4;

    // Calculate progress for active rows
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
                "transition-colors group border-b border-border-warm/5",
                isActive ? "bg-gold-primary/10 font-bold" : "hover:bg-gold-primary/5 text-ink",
                isDrillable ? "cursor-pointer" : "cursor-default",
                depth > 0 ? "text-[10px]" : "text-[11px]"
            )}
        >
            <td className="px-0.5 py-0.5 align-middle">
                <div className="flex flex-col gap-0.5 w-full">
                    <div className="flex items-center gap-1.5">
                        {isDrillable ? (
                            <ChevronRight className="w-2.5 h-2.5 text-primary/70 group-hover:text-accent-gold transition-colors flex-shrink-0" />
                        ) : (
                            // Spacer for alignment if no chevron
                            <span className="w-2.5 inline-block" />
                        )}
                        <span className={TYPOGRAPHY.planetName}>
                            {node.planet}
                        </span>
                        {isActive && (
                            <span className={cn("ml-1 px-1.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full leading-none", TYPOGRAPHY.breadcrumb, "text-green-700 font-bold text-[9px]")}>
                                A
                            </span>
                        )}
                    </div>
                </div>
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden", TYPOGRAPHY.dateAndDuration)}>
                {formatDate(node.startDate)}
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden", TYPOGRAPHY.dateAndDuration)}>
                {formatDate(node.endDate)}
            </td>
            <td className={cn("px-0.5 py-0.5 overflow-hidden", TYPOGRAPHY.dateAndDuration)}>
                {durationDisplay}
            </td>
        </tr>
    );
}
