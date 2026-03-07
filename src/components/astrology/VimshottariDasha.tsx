"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, Star, Zap, Loader2 } from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { clientApi } from '@/lib/api'; // Keep for now if we do manual expansion triggers, or remove if fully hookified
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { useDasha } from '@/hooks/queries/useCalculations';

interface DashaLevel {
    planet: string;
    start: string;
    end: string;
    sublevels?: DashaLevel[];
}

interface VimshottariDashaProps {
    compact?: boolean;
}

// Helper for date formatting
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
        return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return dateStr; }
};

export default function VimshottariDasha({ compact = false }: VimshottariDashaProps) {
    const { clientDetails } = useVedicClient();
    const { ayanamsa, chartStyle, recentClientIds } = useAstrologerStore();
    const settings = { ayanamsa, chartStyle, recentClientIds };
    const [dashaData, setDashaData] = useState<DashaLevel[]>([]);
    const [expanded, setExpanded] = useState<string[]>([]);
    const [currentMaha, setCurrentMaha] = useState<string>('');

    // Initial Query
    const { data: initialData, isLoading: loading } = useDasha(
        clientDetails?.id || '',
        'deep',
        settings.ayanamsa.toLowerCase()
    );

    // Sync initial data
    useEffect(() => {
        if (initialData) {
            const rawList = (initialData.dasha_list || initialData.data?.mahadashas || [])
                .slice(0, 9); // Vimshottari has exactly 9 planetary lords per cycle
            // Map backend data to UI format
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic backend response shapes
            const mapped: DashaLevel[] = rawList.map((d: any) => ({
                planet: d.planet,
                start: d.start_date || d.startDate || '',
                end: d.end_date || d.endDate || '',
                sublevels: d.sublevels?.map((s: any) => ({
                    planet: s.planet,
                    start: s.start_date || s.startDate || '',
                    end: s.end_date || s.endDate || '',
                    sublevels: []
                }))
            }));

            setDashaData(mapped);

            // Find current active mahadasha
            const now = new Date();
            const current = mapped.find((d: DashaLevel) => new Date(d.start) <= now && new Date(d.end) >= now);
            if (current) {
                setCurrentMaha(current.planet);
                // Auto-expand current if not already set
                if (expanded.length === 0) {
                    setExpanded([current.planet]);
                }
            }
        }
    }, [initialData]);

    const fetchLevel = async (
        parent: DashaLevel,
        depth: number,
        path: string[]
    ) => {
        if (!clientDetails?.id || parent.sublevels?.length) return;

        const levels = ['mahadasha', 'antardasha', 'pratyantardasha', 'sookshma', 'prana'];
        const nextLevel = levels[depth + 1];
        if (!nextLevel) return;

        try {
            const context: Record<string, string> = {};
            if (path.length > 0) context.mahaLord = path[0];
            if (path.length > 1) context.antarLord = path[1];
            if (path.length > 2) context.pratyantarLord = path[2];
            if (path.length > 3) context.sookshmaLord = path[3];

            const result = await clientApi.generateDasha(
                clientDetails.id,
                nextLevel,
                settings.ayanamsa,
                false,
                context
            );

            const rawList = result.dasha_list || result.data?.mahadashas || [];
            if (!rawList.length) return;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic backend response
            const newSublevels: DashaLevel[] = rawList.map((d: any) => ({
                planet: d.planet,
                start: d.start_date || d.startDate || '',
                end: d.end_date || d.endDate || '',
                sublevels: []
            }));

            const updateTree = (nodes: DashaLevel[], currentPath: string[]): DashaLevel[] => {
                return nodes.map(node => {
                    if (node.planet === currentPath[0]) {
                        if (currentPath.length === 1) {
                            return { ...node, sublevels: newSublevels };
                        } else {
                            return { ...node, sublevels: updateTree(node.sublevels || [], currentPath.slice(1)) };
                        }
                    }
                    return node;
                });
            };

            setDashaData(prev => updateTree(prev, path));

        } catch (error) { }
    };

    const toggle = (id: string, level: DashaLevel, depth: number, path: string[]) => {
        setExpanded(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
        if (!expanded.includes(id)) {
            fetchLevel(level, depth, [...path]);
        }
    };

    const renderBreadcrumbs = () => {
        if (compact) return null;
        return (
            <div className="flex items-center gap-2 mb-6 text-sm overflow-x-auto sticky top-[72px] bg-white z-10 py-2 border-b border-header-border/10">
                <button
                    onClick={() => setExpanded([])}
                    className={cn("hover:text-header-border transition-colors font-semibold uppercase tracking-widest text-xs", expanded.length === 0 ? "text-header-border" : "text-ink/60")}
                >
                    Mahadasha
                </button>
                {expanded.map((id, idx) => {
                    const label = id.split('-').pop();
                    return (
                        <React.Fragment key={id}>
                            <ChevronRight className="w-3 h-3 text-header-border/40" />
                            <span className="font-semibold uppercase tracking-widest text-xs text-header-border whitespace-nowrap">
                                {label}
                            </span>
                        </React.Fragment>
                    )
                })}
            </div>
        );
    };

    if (loading && !dashaData.length) {
        return (
            <div className={cn(
                "bg-white border border-header-border/20 rounded-[2.5rem] p-8 backdrop-blur-3xl h-full flex items-center justify-center shadow-xl",
                compact && "p-6 rounded-[2rem] shadow-2xl"
            )}>
                <Loader2 className="w-8 h-8 text-header-border animate-spin" role="status" aria-label="Loading dasha data" />
            </div>
        );
    }

    return (
        <div className={cn(
            "bg-white border border-header-border/20 rounded-[1.5rem] p-4 backdrop-blur-3xl min-h-full flex flex-col shadow-xl",
            compact && "p-3 rounded-[1rem] bg-white shadow-2xl"
        )}>
            <div className="sticky top-0 bg-white z-20 pb-4 border-b border-header-border/10 mb-4">
                <div className="flex items-center justify-between">
                    <div>
                        {!compact ? (
                            <>
                                <h3 className="text-xs font-semibold text-header-border uppercase tracking-[0.3em] mb-1">Vimshottari System</h3>
                                <h2 className="text-2xl font-serif text-ink font-bold tracking-tight italic">Temporal Matrix</h2>
                            </>
                        ) : (
                            <div>
                                <h2 className="text-lg font-serif text-ink font-bold tracking-tight">{currentMaha} Mahadasha</h2>
                                <p className="text-2xs text-copper-dark uppercase tracking-[0.3em] font-semibold mt-1">Time Lord Sequence</p>
                            </div>
                        )}
                    </div>
                    {
                        !compact && currentMaha && (
                            <div className="bg-active-glow/10 px-4 py-1.5 rounded-full border border-active-glow/30 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-active-glow animate-pulse" />
                                <span className="text-[9px] font-semibold text-active-glow uppercase tracking-widest">Active: {currentMaha}</span>
                            </div>
                        )
                    }
                </div>
            </div>

            {renderBreadcrumbs()}

            <div className="flex-1 pr-4 space-y-3 mt-4" role="tree" aria-label="Vimshottari dasha periods">
                {dashaData
                    .filter(d => !compact || d.planet === currentMaha)
                    .map((d) => (
                        <DashaItem
                            key={d.planet}
                            level={d}
                            depth={0}
                            expanded={expanded}
                            onToggle={toggle}
                            compact={compact}
                            path={[d.planet]}
                        />
                    ))}
            </div>
        </div >
    );
}

function DashaItem({ level, depth, expanded, onToggle, compact = false, path }: {
    level: DashaLevel,
    depth: number,
    expanded: string[],
    onToggle: (id: string, level: DashaLevel, depth: number, path: string[]) => void,
    compact?: boolean,
    path: string[]
}) {
    const uniqueId = path.join('-');
    const isExpanded = expanded.includes(uniqueId);
    const canExpand = (level.sublevels && level.sublevels.length > 0) || depth < 4;
    const now = new Date();
    const isActive = new Date(level.start) <= now && new Date(level.end) >= now;

    return (
        <div className="space-y-2" role="treeitem" aria-expanded={canExpand ? isExpanded : undefined} aria-label={`${level.planet} dasha period${isActive ? ' (current)' : ''}`}>
            <div
                onClick={() => !compact && canExpand && onToggle(uniqueId, level, depth, path)}
                className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer border group",
                    depth === 0 ? "bg-surface-modal border-header-border/10 hover:bg-softwhite shadow-sm" : "bg-transparent border-transparent hover:bg-surface-modal/50",
                    isExpanded && depth === 0 && !compact && "bg-softwhite border-header-border/30",
                    isActive && depth > 0 && "bg-active-glow/20 border-active-glow/40",
                    compact && "p-2 cursor-default"
                )}
            >
                <div className="flex items-center gap-4">
                    {!compact && canExpand && (
                        <ChevronRight className={cn("w-4 h-4 text-header-border transition-transform duration-300", isExpanded && "rotate-90")} />
                    )}
                    {!compact && !canExpand && <div className="w-4" />}

                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                        depth === 0 ? "bg-header-border/10 text-header-border" : "bg-header-border/5 text-header-border/40",
                        compact && "w-7 h-7 rounded-md",
                        isActive && "bg-active-glow text-ink shadow-lg"
                    )}>
                        <Star className={cn("w-4 h-4", compact && "w-3.5 h-3.5")} />
                    </div>

                    <div>
                        <h4 className={cn("font-serif font-bold tracking-tight flex items-center gap-2",
                            depth === 0 ? "text-base text-ink" : "text-sm text-body",
                            compact && (depth === 0 ? "text-sm" : "text-xs")
                        )}>
                            {level.planet}
                            {isActive && <span className="text-[9px] bg-ink text-active-glow px-1.5 py-0.5 rounded uppercase tracking-wider">Current</span>}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3 h-3 text-header-border/60" />
                            <span className="text-2xs font-semibold text-bronze/40 uppercase tracking-widest">{formatDate(level.start)} — {formatDate(level.end)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className={cn(
                    "ml-10 border-l border-header-border/20 pl-4 space-y-2 animate-in slide-in-from-left-2 duration-300",
                    compact && "ml-4 pl-3"
                )}>
                    {level.sublevels && level.sublevels.length > 0 ? (
                        level.sublevels.map((s) => (
                            <DashaItem
                                key={s.planet}
                                level={s}
                                depth={depth + 1}
                                expanded={expanded}
                                onToggle={onToggle}
                                compact={compact}
                                path={[...path, s.planet]}
                            />
                        ))
                    ) : (
                        <div className="flex items-center gap-2 p-2" role="status" aria-label="Loading sub-periods">
                            <Loader2 className="w-4 h-4 text-header-border animate-spin" />
                            <span className="text-xs text-header-border">Loading sub-periods...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
