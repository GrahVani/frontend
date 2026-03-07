import React from 'react';
import { Planet } from './NorthIndianChart/NorthIndianChart';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import DataGrid, { type DataGridColumn } from '@/components/ui/DataGrid';

interface PlanetComparisonTableProps {
    planetsA: Planet[];
    planetsB: Planet[];
    chartAName?: string;
    chartBName?: string;
}

const ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANET_ORDER = ['Asc', 'Su', 'Mo', 'Ma', 'Me', 'Ju', 'Ve', 'Sa', 'Ra', 'Ke'];

interface ComparisonRow {
    name: string;
    planetA?: Planet;
    planetB?: Planet;
    [key: string]: unknown;
}

export default function PlanetComparisonTable({
    planetsA,
    planetsB,
    chartAName = "Chart A",
    chartBName = "Chart B"
}: PlanetComparisonTableProps) {
    const getPlanetData = (list: Planet[], name: string) => list.find(p => p.name === name);

    const rows: ComparisonRow[] = PLANET_ORDER
        .map(name => ({
            name,
            planetA: getPlanetData(planetsA, name),
            planetB: getPlanetData(planetsB, name),
        }))
        .filter(r => r.planetA || r.planetB);

    const renderPlanetCell = (planet?: Planet) => {
        if (!planet) return '\u2014';
        return (
            <span className="flex items-center gap-2">
                <span>{ZODIAC_SIGNS[planet.signId - 1]}</span>
                <span className="text-xs">({planet.degree})</span>
                {planet.isRetro && <span className="text-xs text-red-600 font-bold">(R)</span>}
            </span>
        );
    };

    const columns: DataGridColumn<ComparisonRow>[] = [
        {
            key: 'name',
            header: 'Planet',
            cellClassName: 'font-bold text-ink',
        },
        {
            key: 'chartA',
            header: chartAName,
            cellClassName: 'text-body',
            render: (row) => renderPlanetCell(row.planetA),
        },
        {
            key: 'chartB',
            header: chartBName,
            cellClassName: 'text-body',
            render: (row) => renderPlanetCell(row.planetB),
        },
    ];

    return (
        <div className="w-full border border-divider rounded-md overflow-hidden bg-softwhite">
            <DataGrid
                columns={columns}
                data={rows}
                rowKey={(row) => row.name}
                cellPadding="py-2 px-4"
                headerClassName="border-b border-divider bg-header-gradient"
                ariaLabel="Planet comparison between two charts"
                scrollShadows={true}
            />
        </div>
    );
}
