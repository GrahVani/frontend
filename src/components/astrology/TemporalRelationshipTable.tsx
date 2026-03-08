"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';

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
    [key: string]: unknown;
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

export default function TemporalRelationshipTable({ data, className }: TemporalRelationshipTableProps) {
    if (!data) return null;

    const entries: TemporalRelationEntry[] = Array.isArray(data) ? data : ((data as TemporalRelationshipData).tatkalik_maitri_chakra || []);

    const rows: RelationRow[] = [
        { label: 'Friends' },
        { label: 'Enemies' },
    ];

    const columns: DataGridColumn<RelationRow>[] = [
        {
            key: 'label',
            header: '',
            headerClassName: 'bg-surface-warm/50',
            cellClassName: cn(TYPOGRAPHY.label, "bg-surface-warm/50 !mb-0"),
            width: 'w-24',
        },
        ...PLANETS.map(planetName => ({
            key: planetName,
            header: planetName,
            align: 'center' as const,
            cellClassName: cn(TYPOGRAPHY.value, "align-top min-w-[80px] font-normal"),
            render: (row: RelationRow) => {
                const kind = row.label === 'Friends' ? 'friends' : 'enemies';
                const list = getRelationList(entries, planetName, kind as 'friends' | 'enemies');
                return (
                    <div className="flex flex-col gap-1">
                        {list.map((name: string) => (
                            <span key={name}>{name}</span>
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
                    Tatkalik maitri chakra <span className="text-[14px] font-normal text-ink/55">(Temporal relationship)</span>
                </h3>
            </div>
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.label}
                rowClassName={(_, idx) => idx === 1 ? 'bg-gold-primary/5' : ''}
                cellPadding="p-2"
                headerClassName="bg-surface-warm/30"
                ariaLabel="Tatkalik Maitri Chakra temporal relationship table"
                stickyHeader={false}
            />
        </div>
    );
}
