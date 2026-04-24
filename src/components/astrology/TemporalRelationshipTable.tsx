"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import { KnowledgeTooltip } from '@/components/knowledge';
import Badge from '@/components/ui/Badge';
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
        icon: <Handshake className="w-4 h-4 text-status-success" />,
        badge: 'success',
        border: 'border-l-[3px] border-l-status-success',
        bg: 'bg-emerald-50/40',
        label: 'Friends',
    },
    enemies: {
        icon: <Swords className="w-4 h-4 text-status-error" />,
        badge: 'error',
        border: 'border-l-[3px] border-l-status-error',
        bg: 'bg-red-50/40',
        label: 'Enemies',
    },
    neutral: {
        icon: <Minus className="w-4 h-4 text-status-warning" />,
        badge: 'warning',
        border: 'border-l-[3px] border-l-status-warning',
        bg: 'bg-amber-50/40',
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
            headerClassName: 'bg-surface-warm/50',
            cellClassName: cn(TYPOGRAPHY.label, "bg-surface-warm/50 !mb-0 !p-0"),
            width: 'w-28',
            render: (row: RelationRow) => {
                const meta = ROW_META[row.kind];
                return (
                    <div className={cn("flex items-center gap-2 h-full px-3 py-2", meta.border, meta.bg)}>
                        {meta.icon}
                        <span className="font-semibold text-ink/80">{meta.label}</span>
                    </div>
                );
            },
        },
        ...PLANETS.map(planetName => ({
            key: planetName,
            header: planetName,
            align: 'center' as const,
            cellClassName: cn(TYPOGRAPHY.value, "align-top min-w-[80px] font-normal"),
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
                    <div className="flex flex-col gap-1.5 items-center">
                        {list.map((name: string) => (
                            <Badge key={name} variant={meta.badge} size="sm">
                                {name}
                            </Badge>
                        ))}
                        {list.length === 0 && <span className="text-ink/30">{'\u2014'}</span>}
                    </div>
                );
            },
        })),
    ];

    return (
        <div className={cn("w-full bg-surface-warm border border-gold-primary/15 rounded-xl overflow-hidden shadow-sm", className)}>
            <div className="bg-gold-primary/10 px-4 py-2 border-b border-gold-primary/15">
                <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-center")}>
                    <KnowledgeTooltip term="graha_overview" unstyled>Tatkalik maitri chakra</KnowledgeTooltip> <span className="text-[14px] font-normal text-ink/55">(Temporal relationship)</span>
                </h3>
            </div>
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.label}
                rowClassName={(row: RelationRow) => ROW_META[row.kind].bg}
                cellPadding="p-2"
                headerClassName="bg-surface-warm/30"
                ariaLabel="Tatkalik Maitri Chakra temporal relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
