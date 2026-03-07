"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { Shield, Zap, TrendingDown, Anchor } from 'lucide-react';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';

export interface DetailedPlanetInfo {
    planet: string;
    sign: string;
    degree: string;
    nakshatra: string;
    pada: number;
    nakshatraLord: string;
    house: number;
    isRetro?: boolean;
    dignity?: 'Exalted' | 'Debilitated' | 'Moolatrikona' | 'Own Sign' | 'Friend' | 'Neutral' | 'Enemy';
    isCombust?: boolean;
    shadbala?: number;
    avastha?: string;
    karaka?: string;
}

interface PlanetaryAnalyticsProps {
    planets: DetailedPlanetInfo[];
}

const DIGNITY_STYLES: Record<string, string> = {
    'Exalted': 'bg-green-500/10 text-green-700 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
    'Debilitated': 'bg-red-500/10 text-red-600 border-red-500/30',
    'Moolatrikona': 'bg-active-glow/20 text-[#A06D00] border-active-glow/50',
    'Own Sign': 'bg-blue-500/10 text-blue-700 border-blue-500/30',
    'Friend': 'bg-ink/5 text-ink/70 border-ink/10',
    'Neutral': 'bg-ink/5 text-ink/40 border-ink/10',
    'Enemy': 'bg-slate-500/10 text-slate-600 border-slate-500/20',
};

function DignityBadge({ dignity }: { dignity?: DetailedPlanetInfo['dignity'] }) {
    if (!dignity) return <span className={cn(TYPOGRAPHY.label, "opacity-20 lowercase")}>{'\u2014'}</span>;
    return (
        <div className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border lowercase",
            TYPOGRAPHY.label,
            DIGNITY_STYLES[dignity] || DIGNITY_STYLES['Neutral']
        )}>
            {dignity === 'Exalted' && <Zap className="w-2 h-2" />}
            {dignity === 'Debilitated' && <Anchor className="w-2 h-2" />}
            {dignity}
        </div>
    );
}

const COLUMNS: DataGridColumn<DetailedPlanetInfo>[] = [
    {
        key: 'planet',
        header: 'Graha',
        sortable: true,
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => (
            <div className="flex items-center gap-3">
                <div className={cn(
                    "w-2 h-2 rounded-full",
                    row.isRetro ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-header-border"
                )} />
                <span className={cn(TYPOGRAPHY.planetName, "text-lg tracking-tight")}>{row.planet}</span>
                {row.isRetro && <TrendingDown className="w-3 h-3 text-red-500 animate-pulse" />}
            </div>
        ),
    },
    {
        key: 'degree',
        header: 'Longitude',
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => (
            <span className={cn(TYPOGRAPHY.value, "text-xs font-mono bg-ink/5 px-2 py-1 rounded border border-ink/10 font-normal")}>{row.degree}</span>
        ),
    },
    {
        key: 'sign',
        header: 'Sign (Rashi)',
        sortable: true,
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => (
            <div className="flex flex-col">
                <span className={cn(TYPOGRAPHY.value)}>{row.sign}</span>
                <span className={cn(TYPOGRAPHY.label, "lowercase opacity-50")}>House {row.house}</span>
            </div>
        ),
    },
    {
        key: 'nakshatra',
        header: 'Nakshatra',
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => (
            <div className="flex flex-col">
                <span className={cn(TYPOGRAPHY.value)}>{row.nakshatra} - {row.pada}</span>
                <span className={cn(TYPOGRAPHY.label, "text-copper-dark lowercase")}>Lord: {row.nakshatraLord}</span>
            </div>
        ),
    },
    {
        key: 'shadbala',
        header: 'Shadbala',
        sortable: true,
        sortFn: (a, b) => (a.shadbala || 0) - (b.shadbala || 0),
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => (
            <div className="flex flex-col gap-1 w-24">
                <div className="flex justify-between items-end">
                    <span className={cn(TYPOGRAPHY.value, "text-xs")}>{row.shadbala || 0}</span>
                    <span className={cn(TYPOGRAPHY.label, "text-bronze lowercase")}>Rupas</span>
                </div>
                <div className="w-full h-1.5 bg-ink/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-header-border to-bronze rounded-full"
                        style={{ width: `${Math.min(((row.shadbala || 0) / 8) * 100, 100)}%` }}
                    />
                </div>
            </div>
        ),
    },
    {
        key: 'avastha',
        header: 'Avastha',
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => (
            <span className={cn(TYPOGRAPHY.value, "text-xs italic font-normal")}>{row.avastha || '\u2014'}</span>
        ),
    },
    {
        key: 'dignity',
        header: 'Dignity',
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => <DignityBadge dignity={row.dignity} />,
    },
    {
        key: 'karaka',
        header: 'Karaka',
        cellClassName: 'px-6',
        headerClassName: 'px-6',
        render: (row) => row.karaka ? (
            <span className={cn(TYPOGRAPHY.label, "bg-ink text-softwhite px-2 py-0.5 rounded border border-header-border/50 lowercase shadow-sm")}>
                {row.karaka}
            </span>
        ) : (
            <span className={cn(TYPOGRAPHY.label, "opacity-20 lowercase")}>{'\u2014'}</span>
        ),
    },
];

export default function PlanetaryAnalytics({ planets }: PlanetaryAnalyticsProps) {
    return (
        <div className="bg-[#FFFFFF]/60 border border-header-border/30 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md group">
            <div className="p-6 border-b border-header-border/20 flex items-center justify-between bg-gradient-to-r from-header-border/10 to-transparent">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-header-border" />
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-sm lowercase")}>Planetary State Mastery</h3>
                </div>
                <div className={cn(TYPOGRAPHY.label, "bg-header-border/10 text-header-border px-3 py-1 rounded-full border border-header-border/30 lowercase")}>
                    Live Computation
                </div>
            </div>
            <DataGrid
                columns={COLUMNS}
                data={planets}
                rowKey={(row) => row.planet}
                cellPadding="p-4"
                ariaLabel="Planetary state analysis table"
            />
        </div>
    );
}
