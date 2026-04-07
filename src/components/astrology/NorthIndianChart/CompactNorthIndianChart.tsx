"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';

// Re-use the same Planet interface
export type { Planet } from './NorthIndianChart';
import type { Planet } from './NorthIndianChart';

/**
 * Rectangular geometry for the Compact North Indian Chart.
 * ViewBox: 0 0 600 400  (3:2 aspect ratio)
 *
 * Key points:
 *   Outer rect:  (10,10) to (590,390)  →  580 × 380
 *   Center:      (300, 200)
 *   Diamond vertices (edge midpoints):
 *     Top    (E): (300, 10)
 *     Left   (F): (10, 200)
 *     Bottom (G): (300, 390)
 *     Right  (H): (590, 200)
 *
 *   Inner intersection points (diagonal ∩ diamond edge):
 *     UL: (155, 105)    UR: (445, 105)
 *     LL: (155, 295)    LR: (445, 295)
 */

const COMPACT_HOUSE_CENTERS: readonly { h: number; x: number; y: number }[] = [
    { h: 1, x: 300, y: 105 },  // Top Diamond
    { h: 2, x: 155, y: 42 },   // Top Left Triangle (upper)
    { h: 3, x: 58, y: 105 },  // Top Left Triangle (left)
    { h: 4, x: 155, y: 200 },  // Left Diamond
    { h: 5, x: 58, y: 295 },  // Bottom Left Triangle (left)
    { h: 6, x: 155, y: 358 },  // Bottom Left Triangle (bottom)
    { h: 7, x: 300, y: 295 },  // Bottom Diamond
    { h: 8, x: 445, y: 358 },  // Bottom Right Triangle (bottom)
    { h: 9, x: 542, y: 295 },  // Bottom Right Triangle (right)
    { h: 10, x: 445, y: 200 },  // Right Diamond
    { h: 11, x: 542, y: 105 },  // Top Right Triangle (right)
    { h: 12, x: 445, y: 42 },   // Top Right Triangle (upper)
] as const;

const COMPACT_HOUSE_POLYGONS: Record<number, string> = {
    1: "300,10 155,105 300,200 445,105",
    2: "10,10 300,10 155,105",
    3: "10,10 155,105 10,200",
    4: "10,200 155,105 300,200 155,295",
    5: "10,200 155,295 10,390",
    6: "10,390 155,295 300,390",
    7: "300,390 155,295 300,200 445,295",
    8: "300,390 445,295 590,390",
    9: "590,200 445,295 590,390",
    10: "590,200 445,105 300,200 445,295",
    11: "590,10 445,105 590,200",
    12: "300,10 590,10 445,105",
};

const COMPACT_SIGN_POSITIONS: Record<number, { x: number; y: number }> = {
    1: { x: 300, y: 165 },
    2: { x: 155, y: 78 },
    3: { x: 85, y: 118 },
    4: { x: 215, y: 198 },
    5: { x: 85, y: 288 },
    6: { x: 155, y: 330 },
    7: { x: 300, y: 235 },
    8: { x: 445, y: 330 },
    9: { x: 515, y: 288 },
    10: { x: 390, y: 202 },
    11: { x: 515, y: 118 },
    12: { x: 445, y: 78 },
};

export const COMPACT_HOUSE_CENTERS_MAP: Record<number, { x: number; y: number }> = Object.fromEntries(
    COMPACT_HOUSE_CENTERS.map(c => [c.h, { x: c.x, y: c.y }])
);

interface CompactNorthIndianChartProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
    onHouseClick?: (houseNumber: number) => void;
    houseValues?: Record<number, number>;
    valueType?: 'bindu' | 'none';
    preserveAspectRatio?: string;
    showDegrees?: boolean;
}

export default function CompactNorthIndianChart({
    planets,
    ascendantSign,
    className = "",
    onHouseClick,
    houseValues,
    valueType = 'none',
    preserveAspectRatio,
    showDegrees = true
}: CompactNorthIndianChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

    const getHouseColor = (houseNum: number) => {
        if (!houseValues || !houseValues[houseNum]) return "transparent";
        const val = houseValues[houseNum];
        if (valueType === 'bindu') {
            if (val >= 32) return "rgba(16, 185, 129, 0.15)";
            if (val >= 28) return "rgba(208, 140, 96, 0.1)";
            if (val < 20) return "rgba(225, 29, 72, 0.1)";
        }
        return "transparent";
    };

    const houseCenters = COMPACT_HOUSE_CENTERS;
    const housePolygons = COMPACT_HOUSE_POLYGONS;
    const signNumberPositions = COMPACT_SIGN_POSITIONS;

    const handleHouseClick = (houseNum: number) => {
        if (onHouseClick) {
            onHouseClick(houseNum);
        }
    };

    return (
        <svg viewBox="0 0 600 400" preserveAspectRatio={preserveAspectRatio || "none"} className={cn("w-full h-full", className)} style={{ display: 'block' }} role="img" aria-label="North Indian birth chart showing planetary positions in 12 houses">
            <desc>Diamond-shaped North Indian style horoscope chart (compact rectangular layout)</desc>
            <defs>
                <linearGradient id="compactChartParchment" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--surface-warm)" />
                    <stop offset="100%" stopColor="var(--softwhite)" />
                </linearGradient>
            </defs>

            {/* Rectangular grid lines */}
            <g stroke="var(--header-border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Outer Rectangle Border */}
                <rect x="10" y="10" width="580" height="380" fill="none" />
                {/* Cross Lines (corner to corner diagonals) */}
                <line x1="10" y1="10" x2="590" y2="390" />
                <line x1="590" y1="10" x2="10" y2="390" />
                {/* Diamond Lines (edge midpoints) */}
                <line x1="300" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="300" y2="390" />
                <line x1="300" y1="390" x2="590" y2="200" />
                <line x1="590" y1="200" x2="300" y2="10" />
            </g>

            {/* Clickable Regions & Heatmap */}
            {houseCenters.map((pos) => {
                const signId = ((ascendantSign + pos.h - 2) % 12) + 1;
                return (
                    <polygon
                        key={`poly-${pos.h}`}
                        points={housePolygons[pos.h]}
                        fill={hoveredHouse === pos.h ? "rgba(208, 140, 96, 0.25)" : getHouseColor(pos.h)}
                        stroke="transparent"
                        strokeWidth="0"
                        className={cn("transition-all duration-300", onHouseClick && "cursor-pointer")}
                        onMouseEnter={() => setHoveredHouse(pos.h)}
                        onMouseLeave={() => setHoveredHouse(null)}
                        onClick={() => handleHouseClick(pos.h)}
                        tabIndex={onHouseClick ? 0 : undefined}
                        role={onHouseClick ? "button" : undefined}
                        aria-label={onHouseClick ? `House ${pos.h} - ${ZODIAC_SIGNS[signId - 1]}` : undefined}
                        onKeyDown={onHouseClick ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleHouseClick(pos.h); }
                            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                                e.preventDefault();
                                const next = pos.h === 12 ? 1 : pos.h + 1;
                                (e.currentTarget.parentElement?.querySelector(`[data-house="${next}"]`) as HTMLElement)?.focus();
                            }
                            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                                e.preventDefault();
                                const prev = pos.h === 1 ? 12 : pos.h - 1;
                                (e.currentTarget.parentElement?.querySelector(`[data-house="${prev}"]`) as HTMLElement)?.focus();
                            }
                        } : undefined}
                        data-house={pos.h}
                    />
                );
            })}

            {/* Render Houses & Planets */}
            {houseCenters.map((pos) => {
                const signId = ((ascendantSign + pos.h - 2) % 12) + 1;
                const boxPlanets = planets
                    .filter(p => (p.house ? p.house === pos.h : p.signId === signId))
                    .sort((a, b) => a.degree.localeCompare(b.degree));
                const isHovered = hoveredHouse === pos.h;

                return (
                    <g key={pos.h} className={cn("transition-all duration-300", isHovered && "opacity-100")}>
                        {/* Sign Number */}
                        <text
                            x={signNumberPositions[pos.h].x}
                            y={signNumberPositions[pos.h].y}
                            fontSize="25"
                            fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                            fontWeight="400"
                            fill={TYPOGRAPHY.svgSignNumber.fill}
                            fillOpacity="0.9"
                            textAnchor="middle"
                            dominantBaseline="central"
                            className="select-none pointer-events-none"
                        >
                            {signId}
                        </text>

                        {/* Ashtakavarga Score / Value */}
                        {houseValues && houseValues[pos.h] !== undefined && (
                            <text
                                x={pos.x}
                                y={pos.y}
                                fontSize="34"
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fontWeight="400"
                                fill={houseValues[pos.h] < 20 ? "var(--status-error)" : houseValues[pos.h] >= 30 ? "var(--status-success)" : "var(--text-ink)"}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="select-none pointer-events-none"
                            >
                                {houseValues[pos.h]}
                            </text>
                        )}

                        {/* Planets List - Grid layout: max 2 per row */}
                        <g transform={`translate(${pos.x}, ${pos.y + (houseValues ? 20 : -5)})`}>
                            {
                                (() => {
                                    const planetCount = boxPlanets.length;
                                    const cols = 2;
                                    const rows = Math.ceil(planetCount / cols);
                                    const hSpacing = 48;
                                    const vSpacing = planetCount > 2 ? 34 : 30;
                                    const planetFontSize = planetCount > 4 ? 18 : 20;
                                    const degreeFontSize = planetCount > 4 ? 14 : 16;
                                    const retroFontSize = planetCount > 4 ? 15 : 17;

                                    return boxPlanets.map((p, i) => {
                                        const row = Math.floor(i / cols);
                                        const col = i % cols;
                                        const planetsInThisRow = Math.min(cols, planetCount - row * cols);
                                        const rowWidth = (planetsInThisRow - 1) * hSpacing;
                                        const xOffset = (col * hSpacing) - (rowWidth / 2);
                                        const yOffset = (row * vSpacing) - ((rows - 1) * vSpacing / 2);
                                        const planetColor = PLANET_SVG_FILLS[p.name] || 'var(--ink)';
                                        const hasDegree = (showDegrees || p.name === 'As' || p.name === 'Asc') && p.degree && p.degree !== '-';

                                        return (
                                            <g key={p.name} transform={`translate(${xOffset}, ${yOffset})`}>
                                                <text
                                                    fontSize={planetFontSize}
                                                    fontFamily={TYPOGRAPHY.svgPlanetName.fontFamily}
                                                    fontWeight="400"
                                                    fill={planetColor}
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                    className="select-none transition-all duration-300"
                                                >
                                                    {p.name}
                                                    {p.isRetro && (
                                                        <tspan fontSize={retroFontSize} fontWeight="400" fill="var(--status-error)" dx="1">R</tspan>
                                                    )}
                                                </text>
                                                {hasDegree && (
                                                    <text
                                                        y={12}
                                                        fontSize={degreeFontSize}
                                                        fontFamily={TYPOGRAPHY.svgPlanetName.fontFamily}
                                                        fontWeight="400"
                                                        fill={TYPOGRAPHY.svgDegree.fill}
                                                        textAnchor="middle"
                                                        dominantBaseline="central"
                                                        className="select-none"
                                                    >
                                                        {p.degree}
                                                    </text>
                                                )}
                                            </g>
                                        );
                                    });
                                })()
                            }
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}
