"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import { KnowledgeTooltip } from '@/components/knowledge';
import Badge from '@/components/ui/Badge';
import { Handshake, Swords, Minus } from 'lucide-react';

interface RelationRow {
    label: string;
    kind: 'friends' | 'enemies' | 'neutral';
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

const NATURAL_RELATIONSHIPS: Record<string, { friends: string[], enemies: string[], neutral: string[] }> = {
    Sun: {
        friends: ['Moon', 'Mars', 'Jupiter'],
        enemies: ['Venus', 'Saturn', 'Rahu', 'Ketu'],
        neutral: ['Mercury'],
    },
    Moon: {
        friends: ['Sun', 'Mercury'],
        enemies: ['Rahu', 'Ketu'],
        neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    },
    Mars: {
        friends: ['Sun', 'Moon', 'Jupiter', 'Ketu'],
        enemies: ['Mercury', 'Rahu'],
        neutral: ['Venus', 'Saturn'],
    },
    Mercury: {
        friends: ['Sun', 'Venus'],
        enemies: ['Moon'],
        neutral: ['Mars', 'Jupiter', 'Saturn', 'Rahu', 'Ketu'],
    },
    Jupiter: {
        friends: ['Sun', 'Moon', 'Mars', 'Rahu'],
        enemies: ['Mercury', 'Venus'],
        neutral: ['Saturn', 'Ketu'],
    },
    Venus: {
        friends: ['Mercury', 'Saturn', 'Rahu', 'Ketu'],
        enemies: ['Sun', 'Moon'],
        neutral: ['Mars', 'Jupiter'],
    },
    Saturn: {
        friends: ['Mercury', 'Venus', 'Rahu'],
        enemies: ['Sun', 'Moon', 'Mars', 'Ketu'],
        neutral: ['Jupiter'],
    },
    Rahu: {
        friends: ['Jupiter', 'Venus', 'Saturn'],
        enemies: ['Sun', 'Moon', 'Mars', 'Ketu'],
        neutral: ['Mercury'],
    },
    Ketu: {
        friends: ['Mars', 'Venus'],
        enemies: ['Sun', 'Moon', 'Saturn', 'Rahu'],
        neutral: ['Jupiter', 'Mercury'],
    },
};

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

export default function NaisargikMaitriTable({ className }: { className?: string }) {
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
                const list = NATURAL_RELATIONSHIPS[planetName]?.[row.kind] || [];
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
                    <KnowledgeTooltip term="graha_overview" unstyled>Naisargik Maitri Chakra</KnowledgeTooltip> <span className="text-[14px] font-normal text-ink/55">(Natural Relationship)</span>
                </h3>
            </div>
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.label}
                rowClassName={(row: RelationRow) => ROW_META[row.kind].bg}
                cellPadding="p-2"
                headerClassName="bg-surface-warm/30"
                ariaLabel="Naisargik Maitri Chakra natural relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
