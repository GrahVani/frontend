"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import { KnowledgeTooltip } from '@/components/knowledge';
import Badge from '@/components/ui/Badge';
import { HeartHandshake, Handshake, Minus, Swords, AlertTriangle } from 'lucide-react';

interface RelationDetail {
    planet: string;
    compound: string;
    natural: string;
    temporary: string;
    position_diff: string;
}

interface MaitriEntry {
    current_sign: string;
    longitude: string;
    relations: RelationDetail[];
}

interface PanchadhaMaitriData {
    maitri_chakra?: Record<string, MaitriEntry>;
    [key: string]: unknown;
}

interface PanchadhaMaitriTableProps {
    data: PanchadhaMaitriData;
    className?: string;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

interface MaitriRow {
    label: string;
    compoundKey: string;
    kind: 'fast_friends' | 'friends' | 'neutral' | 'enemies' | 'bitter_enemies';
}

const ROW_META: Record<string, { icon: React.ReactNode; badge: 'success' | 'error' | 'warning'; border: string; bg: string; label: string }> = {
    fast_friends: {
        icon: <HeartHandshake className="w-4 h-4 text-status-success" />,
        badge: 'success',
        border: 'border-l-[3px] border-l-status-success',
        bg: 'bg-emerald-50/50',
        label: 'Fast Friends',
    },
    friends: {
        icon: <Handshake className="w-4 h-4 text-status-success" />,
        badge: 'success',
        border: 'border-l-[3px] border-l-status-success',
        bg: 'bg-emerald-50/25',
        label: 'Friends',
    },
    neutral: {
        icon: <Minus className="w-4 h-4 text-status-warning" />,
        badge: 'warning',
        border: 'border-l-[3px] border-l-status-warning',
        bg: 'bg-amber-50/40',
        label: 'Neutral',
    },
    enemies: {
        icon: <Swords className="w-4 h-4 text-status-error" />,
        badge: 'error',
        border: 'border-l-[3px] border-l-status-error',
        bg: 'bg-red-50/25',
        label: 'Enemies',
    },
    bitter_enemies: {
        icon: <AlertTriangle className="w-4 h-4 text-status-error" />,
        badge: 'error',
        border: 'border-l-[3px] border-l-status-error',
        bg: 'bg-red-50/50',
        label: 'Bitter Enemies',
    },
};

export default function PanchadhaMaitriTable({ data, className }: PanchadhaMaitriTableProps) {
    if (!data || !data.maitri_chakra) return null;

    const chakra = data.maitri_chakra;

    const rows: MaitriRow[] = [
        { label: 'Fast Friends', compoundKey: 'Great Friend', kind: 'fast_friends' },
        { label: 'Friends', compoundKey: 'Friend', kind: 'friends' },
        { label: 'Neutral', compoundKey: 'Neutral', kind: 'neutral' },
        { label: 'Enemies', compoundKey: 'Enemy', kind: 'enemies' },
        { label: 'Bitter Enemies', compoundKey: 'Great Enemy', kind: 'bitter_enemies' },
    ];

    const columns: DataGridColumn<MaitriRow>[] = [
        {
            key: 'label',
            header: '',
            headerClassName: 'bg-surface-warm/50',
            cellClassName: cn(TYPOGRAPHY.label, "bg-surface-warm/50 !mb-0 !p-0"),
            width: 'w-36',
            render: (row: MaitriRow) => {
                const meta = ROW_META[row.kind];
                return (
                    <div className={cn("flex items-center gap-2 h-full px-3 py-2", meta.border, meta.bg)}>
                        {meta.icon}
                        <span className="font-semibold text-ink/80 text-[12px]">{meta.label}</span>
                    </div>
                );
            },
        },
        ...PLANETS.map(planetName => ({
            key: planetName,
            header: planetName,
            align: 'center' as const,
            cellClassName: cn(TYPOGRAPHY.value, "align-top min-w-[80px] font-normal"),
            render: (row: MaitriRow) => {
                const relations = chakra[planetName]?.relations || [];
                const list = relations
                    .filter(rel => rel.compound === row.compoundKey)
                    .map(rel => rel.planet);

                const meta = ROW_META[row.kind];

                return (
                    <div className="flex flex-col gap-1.5 items-center">
                        {list.map((name: string) => (
                            <Badge key={name} variant={meta.badge} size="sm">
                                {name}
                            </Badge>
                        ))}
                        {list.length === 0 && <span className="text-ink/20">{'\u2014'}</span>}
                    </div>
                );
            },
        })),
    ];

    return (
        <div className={cn("w-full bg-surface-warm border border-gold-primary/15 rounded-xl overflow-hidden shadow-sm", className)}>
            <div className="bg-gold-primary/10 px-4 py-2 border-b border-gold-primary/15 text-center">
                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>
                    <KnowledgeTooltip term="maitri_chakra" unstyled>Panchadha Maitri Chakra</KnowledgeTooltip> <span className="text-[14px] font-normal text-ink/55">(Compound Relationship)</span>
                </h3>
            </div>
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.label}
                rowClassName={(row: MaitriRow) => ROW_META[row.kind].bg}
                cellPadding="p-2"
                headerClassName="bg-surface-warm/30"
                ariaLabel="Panchadha Maitri Chakra compound relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
