"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import { KnowledgeTooltip } from '@/components/knowledge';

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
        icon: <HeartHandshake className="w-5 h-5 text-status-success" />,
        badge: 'success',
        border: 'border-l-[3px] border-l-status-success',
        bg: 'bg-emerald-50/80',
        label: 'Fast Friends',
    },
    friends: {
        icon: <Handshake className="w-5 h-5 text-status-success" />,
        badge: 'success',
        border: 'border-l-[3px] border-l-status-success',
        bg: 'bg-emerald-50/60',
        label: 'Friends',
    },
    neutral: {
        icon: <Minus className="w-5 h-5 text-status-warning" />,
        badge: 'warning',
        border: 'border-l-[3px] border-l-status-warning',
        bg: 'bg-amber-50/80',
        label: 'Neutral',
    },
    enemies: {
        icon: <Swords className="w-5 h-5 text-status-error" />,
        badge: 'error',
        border: 'border-l-[3px] border-l-status-error',
        bg: 'bg-red-50/60',
        label: 'Enemies',
    },
    bitter_enemies: {
        icon: <AlertTriangle className="w-5 h-5 text-status-error" />,
        badge: 'error',
        border: 'border-l-[3px] border-l-status-error',
        bg: 'bg-red-50/80',
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
            headerClassName: 'bg-white/50',
            cellClassName: cn(TYPOGRAPHY.label, "bg-white/50 !mb-0 !p-0"),
            width: 'w-36',
            render: (row: MaitriRow) => {
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
            render: (row: MaitriRow) => {
                const relations = chakra[planetName]?.relations || [];
                const list = relations
                    .filter(rel => rel.compound === row.compoundKey)
                    .map(rel => rel.planet);

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
                        {list.length === 0 && <span className="text-amber-300 text-[14px]">{'\u2014'}</span>}
                    </div>
                );
            },
        })),
    ];

    return (
        <div className={cn("w-full bg-white border border-amber-200/60 rounded-xl overflow-hidden shadow-sm", className)}>
            <div className="bg-amber-50/60 px-4 py-2 border-b border-amber-200/60 text-center">
                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>
                    <KnowledgeTooltip term="maitri_chakra" unstyled>Panchadha Maitri Chakra</KnowledgeTooltip> <span className="text-[14px] font-normal text-amber-600">(Compound Relationship)</span>
                </h3>
            </div>
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.label}
                rowClassName={(row: MaitriRow) => ROW_META[row.kind].bg}
                cellPadding="p-2"
                headerClassName="bg-white/30"
                ariaLabel="Panchadha Maitri Chakra compound relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
