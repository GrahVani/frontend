"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import { KnowledgeTooltip } from '@/components/knowledge';

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
                const list = NATURAL_RELATIONSHIPS[planetName]?.[row.kind] || [];
                const meta = ROW_META[row.kind];
                return (
                    <div className="flex flex-col gap-2 items-center">
                        {list.map((name: string) => (
                                                        <span key={name} className={cn(
                                "inline-flex items-center font-semibold rounded-full px-2.5 py-1 text-[13px] border",
                                row.kind === 'friends' || row.kind === 'fast_friends' ? "text-emerald-700 bg-emerald-100 border-emerald-200" :
                                row.kind === 'enemies' || row.kind === 'bitter_enemies' ? "text-red-700 bg-red-100 border-red-200" :
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
                    <KnowledgeTooltip term="graha_overview" unstyled>Naisargik Maitri Chakra</KnowledgeTooltip> <span className="text-[14px] font-normal text-amber-600">(Natural Relationship)</span>
                </h3>
            </div>
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.label}
                rowClassName={(row: RelationRow) => ROW_META[row.kind].bg}
                cellPadding="p-2"
                headerClassName="bg-white/30"
                ariaLabel="Naisargik Maitri Chakra natural relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
