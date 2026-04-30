"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import { KnowledgeTooltip } from '@/components/knowledge';

import { Handshake, Swords, Minus } from 'lucide-react';

interface TemporalRelationEntry {
    planet: string;
    relations?: Record<string, string>;
    friends?: string[];
    Friends?: string[];
    enemies?: string[];
    Enemies?: string[];
}

interface TemporalRelationshipData {
    tatkalik_maitri_chakra?: TemporalRelationEntry[];
    [key: string]: unknown;
}

interface TemporalRelationshipTableProps {
    data: TemporalRelationshipData | TemporalRelationEntry[];
    className?: string;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

interface RelationRow {
    label: string;
    kind: 'friends' | 'enemies' | 'neutral';
}

function getRelationList(entries: TemporalRelationEntry[], planetName: string, kind: 'friends' | 'enemies'): string[] {
    const entry = entries.find(e => e.planet === planetName);
    if (!entry) return [];

    if (entry.relations) {
        const matchValue = kind === 'friends' ? 'Friend' : 'Enemy';
        return Object.entries(entry.relations)
            .filter(([p, rel]) => rel === matchValue && p !== planetName)
            .map(([p]) => p);
    }

    if (kind === 'friends') return entry.friends || entry.Friends || [];
    return entry.enemies || entry.Enemies || [];
}

function getNeutralList(entries: TemporalRelationEntry[], planetName: string): string[] {
    const entry = entries.find(e => e.planet === planetName);
    if (!entry) return [];

    const friends = getRelationList(entries, planetName, 'friends');
    const enemies = getRelationList(entries, planetName, 'enemies');

    return PLANETS.filter(p => p !== planetName && !friends.includes(p) && !enemies.includes(p));
}

const ROW_META: Record<string, { icon: React.ReactNode; badge: 'success' | 'error' | 'warning'; border: string; bg: string; label: string }> = {
    friends: {
        icon: <Handshake className="w-5 h-5 text-status-success" />,
        badge: 'success',
        border: 'border-l-[3px] border-l-status-success',
        bg: 'bg-emerald-50/80',
        label: 'Friends',
    },
    enemies: {
        icon: <Swords className="w-5 h-5 text-status-error" />,
        badge: 'error',
        border: 'border-l-[3px] border-l-status-error',
        bg: 'bg-red-50/80',
        label: 'Enemies',
    },
    neutral: {
        icon: <Minus className="w-5 h-5 text-status-warning" />,
        badge: 'warning',
        border: 'border-l-[3px] border-l-status-warning',
        bg: 'bg-amber-50/80',
        label: 'Neutral',
    },
};

export default function TemporalRelationshipTable({ data, className }: TemporalRelationshipTableProps) {
    if (!data) return null;

    const entries: TemporalRelationEntry[] = Array.isArray(data) ? data : ((data as TemporalRelationshipData).tatkalik_maitri_chakra || []);

    const rows: RelationRow[] = [
        { label: 'Friends', kind: 'friends' },
        { label: 'Enemies', kind: 'enemies' },
        { label: 'Neutral', kind: 'neutral' },
    ];

    const columns: DataGridColumn<RelationRow>[] = [
        {
            key: 'label',
            header: '',
            headerClassName: 'bg-white/50',
            cellClassName: cn(TYPOGRAPHY.label, "bg-white/50 !mb-0 !p-0"),
            width: 'w-32',
            render: (row: RelationRow) => {
                const meta = ROW_META[row.kind];
                return (
                    <div className={cn("flex items-center gap-2 h-full px-3 py-2.5", meta.border, meta.bg)}>
                        {meta.icon}
                        <span className="font-semibold text-amber-900 text-[15px]">{meta.label}</span>
                    </div>
                );
            },
        },
        ...PLANETS.map(planetName => ({
            key: planetName,
            header: planetName,
            align: 'center' as const,
            headerClassName: 'text-[16px] font-semibold',
            cellClassName: cn(TYPOGRAPHY.value, "align-top min-w-[80px] font-normal text-[15px]"),
            render: (row: RelationRow) => {
                let list: string[] = [];
                if (row.kind === 'friends') {
                    list = getRelationList(entries, planetName, 'friends');
                } else if (row.kind === 'enemies') {
                    list = getRelationList(entries, planetName, 'enemies');
                } else {
                    list = getNeutralList(entries, planetName);
                }

                const meta = ROW_META[row.kind];

                return (
                    <div className="flex flex-col gap-2 items-center">
                        {list.map((name: string) => (
                                                        <span key={name} className={cn(
                                "inline-flex items-center font-semibold rounded-full px-2.5 py-1 text-[13px] border",
                                row.kind === 'friends' ? "text-emerald-700 bg-emerald-100 border-emerald-200" :
                                row.kind === 'enemies' ? "text-red-700 bg-red-100 border-red-200" :
                                "text-amber-700 bg-amber-100 border-amber-200"
                            )}>{name}</span>
                        ))}
                        {list.length === 0 && <span className="text-amber-400 text-[14px]">{'\u2014'}</span>}
                    </div>
                );
            },
        })),
    ];

    return (
        <div className={cn("w-full bg-white border border-amber-200/60 rounded-xl overflow-hidden shadow-sm", className)}>
            <div className="bg-amber-50/60 px-4 py-2 border-b border-amber-200/60">
                <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-center")}>
                    <KnowledgeTooltip term="graha_overview" unstyled>Tatkalik maitri chakra</KnowledgeTooltip> <span className="text-[14px] font-normal text-amber-600">(Temporal relationship)</span>
                </h3>
            </div>
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.label}
                rowClassName={(row: RelationRow) => ROW_META[row.kind].bg}
                cellPadding="p-2"
                headerClassName="bg-white/30"
                ariaLabel="Tatkalik Maitri Chakra temporal relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
