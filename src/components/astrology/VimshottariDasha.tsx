"use client";

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ChevronRight, Calendar, Star, Zap, Loader2 } from 'lucide-react';
import { getPlanetSymbol } from '@/lib/planet-symbols';
import { useVedicClient } from '@/context/VedicClientContext';
import { clientApi } from '@/lib/api'; // Keep for now if we do manual expansion triggers, or remove if fully hookified
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { useDasha } from '@/hooks/queries/useCalculations';
import { captureException } from '@/lib/monitoring';
import { KnowledgeTooltip } from '@/components/knowledge';

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

        } catch (error) {
            captureException(error, { tags: { section: 'vimshottari-dasha', action: 'fetch-sublevel' } });
        }
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
            <div className="flex items-center gap-2 mb-6 text-[14px] overflow-x-auto">
                <button
                    onClick={() => setExpanded([])}
                    className={cn("hover:text-amber-800 transition-colors font-semibold uppercase tracking-widest text-[12px]", expanded.length === 0 ? "text-amber-800" : "text-amber-600/60")}
                >
                    <KnowledgeTooltip term="dasha_mahadasha">Mahadasha</KnowledgeTooltip>
                </button>
                {expanded.map((id, idx) => {
                    const label = id.split('-').pop();
                    return (
                        <React.Fragment key={id}>
                            <ChevronRight className="w-3 h-3 text-amber-500" />
                            <span className="font-semibold uppercase tracking-widest text-[12px] text-amber-800 whitespace-nowrap">
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
                "bg-white border border-amber-200/60 rounded-[2.5rem] p-4 backdrop-blur-3xl h-full flex items-center justify-center shadow-xl",
                compact && "p-3 rounded-[2rem] shadow-2xl"
            )}>
                <Loader2 className="w-8 h-8 text-amber-700 animate-spin" role="status" aria-label="Loading dasha data" />
            </div>
        );
    }

    return (
        <div className={cn(
            "bg-white border border-amber-200/60 rounded-[2.5rem] p-4 backdrop-blur-3xl h-full overflow-hidden flex flex-col shadow-xl",
            compact && "p-3 rounded-[2rem] bg-white shadow-2xl"
        )}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    {!compact ? (
                        <>
                            <h3 className="text-[12px] font-semibold text-amber-700 uppercase tracking-[0.3em] mb-1"><KnowledgeTooltip term="dasha_vimshottari">Vimshottari System</KnowledgeTooltip></h3>
                            <h2 className="text-[24px] font-serif text-amber-900 font-bold tracking-tight italic">Temporal Matrix</h2>
                        </>
                    ) : (
                        <div>
                            <h2 className="text-[18px] font-serif text-amber-900 font-bold tracking-tight">{currentMaha} Mahadasha</h2>
                            <p className="text-2xs text-amber-600 uppercase tracking-[0.3em] font-semibold mt-1">Time Lord Sequence</p>
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
            </div >

            {renderBreadcrumbs()}

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-3" role="tree" aria-label="Vimshottari dasha periods">
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
                            maxDepth={settings.ayanamsa.toLowerCase() === 'kp' ? 2 : 4}
                        />
                    ))}
            </div>
        </div >
    );
}

function DashaItem({ level, depth, expanded, onToggle, compact = false, path, maxDepth = 4 }: {
    level: DashaLevel,
    depth: number,
    expanded: string[],
    onToggle: (id: string, level: DashaLevel, depth: number, path: string[]) => void,
    compact?: boolean,
    path: string[]
    maxDepth?: number;
}) {
    const uniqueId = path.join('-');
    const isExpanded = expanded.includes(uniqueId);
    const canExpand = (level.sublevels && level.sublevels.length > 0) || depth < maxDepth;
    const now = new Date();
    const isActive = new Date(level.start) <= now && new Date(level.end) >= now;

    return (
        <div className="space-y-2" role="treeitem" aria-expanded={canExpand ? isExpanded : undefined} aria-label={`${level.planet} dasha period${isActive ? ' (current)' : ''}`}>
            <div
                onClick={() => !compact && canExpand && onToggle(uniqueId, level, depth, path)}
                className={cn(
                    "flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer border group",
                    depth === 0 ? "bg-white border-amber-200/50 hover:bg-amber-50/50 shadow-sm" : "bg-transparent border-transparent hover:bg-amber-50/30",
                    isExpanded && depth === 0 && !compact && "bg-amber-50/50 border-amber-300/50",
                    isActive && depth > 0 && "bg-green-50 border-green-200/40",
                    compact && "p-2 cursor-default"
                )}
            >
                <div className="flex items-center gap-4">
                    {!compact && canExpand && (
                        <ChevronRight className={cn("w-4 h-4 text-amber-700 transition-transform duration-300", isExpanded && "rotate-90")} />
                    )}
                    {!compact && !canExpand && <div className="w-4" />}

                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all text-[14px] font-bold border",
                        depth === 0 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-amber-50 text-amber-400 border-amber-100",
                        compact && "w-7 h-7 rounded-lg text-[12px]",
                        isActive && "bg-green-100 text-green-700 border-green-200 shadow-sm"
                    )}>
                        {getPlanetSymbol(level.planet)}
                    </div>

                    <div>
                        <h4 className={cn("font-serif font-bold tracking-tight flex items-center gap-2",
                            depth === 0 ? "text-[16px] text-amber-900" : "text-[14px] text-amber-700",
                            compact && (depth === 0 ? "text-[14px]" : "text-[13px]")
                        )}>
                            {level.planet}
                            {isActive && <span className="text-[8px] bg-green-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">Current</span>}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <Calendar className="w-3 h-3 text-amber-500" />
                            <span className="text-2xs font-semibold text-amber-500 uppercase tracking-widest">{formatDate(level.start)} — {formatDate(level.end)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className={cn(
                    "ml-8 border-l border-amber-200/50 pl-3 space-y-1.5 animate-in slide-in-from-left-2 duration-300",
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
                                maxDepth={maxDepth}
                            />
                        ))
                    ) : (
                        <div className="flex items-center gap-2 p-2" role="status" aria-label="Loading sub-periods">
                            <Loader2 className="w-4 h-4 text-amber-700 animate-spin" />
                            <span className="text-[12px] text-amber-700">Loading sub-periods...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
