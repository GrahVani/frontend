"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';
import { KnowledgeTooltip } from '@/components/knowledge';

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

const RELATIONSHIP_TYPES = [
    { label: 'Fast Friends', key: 'Great Friend' },
    { label: 'Friends', key: 'Friend' },
    { label: 'Neutral', key: 'Neutral' },
    { label: 'Enemies', key: 'Enemy' },
    { label: 'Bitter Enemies', key: 'Great Enemy' },
];

interface MaitriRow {
    label: string;
    compoundKey: string;
}

export default function PanchadhaMaitriTable({ data, className }: PanchadhaMaitriTableProps) {
    if (!data || !data.maitri_chakra) return null;

    const chakra = data.maitri_chakra;

    const columns: DataGridColumn<MaitriRow>[] = [
        {
            key: 'label',
            header: '',
            headerClassName: 'bg-surface-warm/50',
            cellClassName: cn(TYPOGRAPHY.label, "bg-surface-warm/50 !mb-0"),
            width: 'w-32',
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

                return (
                    <div className="flex flex-col gap-1">
                        {list.map((name: string) => (
                            <span key={name}>{name}</span>
                        ))}
                        {list.length === 0 && <span className="text-ink/20">{'\u2014'}</span>}
                    </div>
                );
            },
        })),
    ];

    const rows: MaitriRow[] = RELATIONSHIP_TYPES.map(type => ({
        label: type.label,
        compoundKey: type.key,
    }));

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
                rowClassName={(_, idx) => idx % 2 === 1 ? 'bg-gold-primary/5' : ''}
                cellPadding="p-2"
                headerClassName="bg-surface-warm/30"
                ariaLabel="Panchadha Maitri Chakra compound relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
