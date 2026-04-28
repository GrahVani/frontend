"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_SVG_FILLS, CHART_THEMES } from '@/design-tokens/colors';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';

// Re-use the same Planet interface
export type { Planet } from './NorthIndianChart';
import type { Planet } from './NorthIndianChart';
import { getPlanetSymbol } from '@/lib/planet-symbols';

export interface CompactNorthIndianChartProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
    onHouseClick?: (houseNumber: number) => void;
    houseValues?: Record<number, number>;
    valueType?: 'bindu' | 'none';
    preserveAspectRatio?: string;
    showDegrees?: boolean;
    planetFontSize?: number;
    degreeFontSize?: number;
    planetFontWeight?: string | number;
    planetDisplayMode?: 'name' | 'symbol' | 'both';
    showHouseNumbers?: boolean;
    planetSpacing?: 'compact' | 'normal' | 'spacious';
    colorTheme?: 'classic' | 'modern' | 'royal' | 'earth' | 'ocean';
}

const COMPACT_HOUSE_CENTERS: readonly { h: number; x: number; y: number }[] = [
    { h: 1, x: 300, y: 105 },  { h: 2, x: 155, y: 42 },   { h: 3, x: 58, y: 105 },
    { h: 4, x: 155, y: 200 },  { h: 5, x: 58, y: 295 },  { h: 6, x: 155, y: 358 },
    { h: 7, x: 300, y: 295 },  { h: 8, x: 445, y: 358 },  { h: 9, x: 542, y: 295 },
    { h: 10, x: 445, y: 200 }, { h: 11, x: 542, y: 105 }, { h: 12, x: 445, y: 42 },
] as const;

export const COMPACT_HOUSE_CENTERS_MAP: Record<number, { x: number; y: number }> = Object.fromEntries(
    COMPACT_HOUSE_CENTERS.map(c => [c.h, { x: c.x, y: c.y }])
);

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
    1: { x: 300, y: 165 }, 2: { x: 155, y: 78 },   3: { x: 85, y: 118 },
    4: { x: 215, y: 198 }, 5: { x: 85, y: 288 },   6: { x: 155, y: 330 },
    7: { x: 300, y: 235 }, 8: { x: 445, y: 330 },  9: { x: 515, y: 288 },
    10: { x: 390, y: 202 }, 11: { x: 515, y: 118 }, 12: { x: 445, y: 78 },
};

export default function CompactNorthIndianChart({
    planets,
    ascendantSign,
    className = "",
    onHouseClick,
    houseValues,
    valueType = 'none',
    preserveAspectRatio,
    showDegrees = false,
    planetFontSize: userPlanetFontSize,
    degreeFontSize: userDegreeFontSize,
    planetFontWeight: userPlanetFontWeight,
    planetDisplayMode = 'name',
    showHouseNumbers = true,
    planetSpacing = 'normal',
    colorTheme: userColorTheme = 'classic'
}: CompactNorthIndianChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);
    const theme = CHART_THEMES[userColorTheme] || CHART_THEMES.classic;

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

    return (
        <svg viewBox="0 0 600 400" preserveAspectRatio={preserveAspectRatio || "none"} className={cn("w-full h-full", className)} role="img" style={{ background: theme.background }}>
            <g stroke={theme.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="10" y="10" width="580" height="380" fill="none" />
                <line x1="10" y1="10" x2="590" y2="390" />
                <line x1="590" y1="10" x2="10" y2="390" />
                <line x1="300" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="300" y2="390" />
                <line x1="300" y1="390" x2="590" y2="200" />
                <line x1="590" y1="200" x2="300" y2="10" />
            </g>

            {COMPACT_HOUSE_CENTERS.map((pos) => {
                const signId = ((ascendantSign + pos.h - 2) % 12) + 1;
                const boxPlanets = planets
                    .filter(p => (p.house ? p.house === pos.h : p.signId === signId))
                    .sort((a, b) => a.degree.localeCompare(b.degree));
                
                const planetCount = boxPlanets.length;
                const isHovered = hoveredHouse === pos.h;

                // Dynamic sizing logic
                let cols: number;
                let hSpacing: number;
                let vSpacing: number;
                let planetFontSize: number;
                let degreeFontSize: number;
                let retroFontSize: number;
                let degreeYOffset: number;

                if (planetCount === 1) {
                    cols = 1; hSpacing = 0; vSpacing = 0;
                    planetFontSize = userPlanetFontSize || 22;
                    degreeFontSize = userDegreeFontSize || 14;
                    retroFontSize = Math.max(10, planetFontSize * 0.8);
                    degreeYOffset = 20;
                } else if (planetCount === 2) {
                    cols = 2; hSpacing = 52; vSpacing = 0;
                    planetFontSize = userPlanetFontSize || 20;
                    degreeFontSize = userDegreeFontSize || 13;
                    retroFontSize = Math.max(8, planetFontSize * 0.8);
                    degreeYOffset = 19;
                } else if (planetCount === 3) {
                    cols = 3; hSpacing = 40; vSpacing = 0;
                    planetFontSize = userPlanetFontSize || 17;
                    degreeFontSize = userDegreeFontSize || 11;
                    retroFontSize = Math.max(8, planetFontSize * 0.8);
                    degreeYOffset = 17;
                } else if (planetCount === 4) {
                    cols = 2; hSpacing = 46; vSpacing = 38;
                    planetFontSize = userPlanetFontSize || 19;
                    degreeFontSize = userDegreeFontSize || 10;
                    retroFontSize = Math.max(8, planetFontSize * 0.8);
                    degreeYOffset = 18;
                } else if (planetCount <= 6) {
                    cols = 3; hSpacing = 36; vSpacing = 34;
                    planetFontSize = userPlanetFontSize || 15;
                    degreeFontSize = userDegreeFontSize || 10;
                    retroFontSize = Math.max(8, planetFontSize * 0.8);
                    degreeYOffset = 16;
                } else {
                    cols = 4; hSpacing = 30; vSpacing = 30;
                    planetFontSize = userPlanetFontSize || 14;
                    degreeFontSize = userDegreeFontSize || 9;
                    retroFontSize = Math.max(8, planetFontSize * 0.8);
                    degreeYOffset = 15;
                }

                const rows = Math.ceil(planetCount / cols);
                const spacingModifier = planetSpacing === 'compact' ? 0.8 : planetSpacing === 'spacious' ? 1.2 : 1.0;
                const hSpacingAdjusted = hSpacing * spacingModifier;
                const vSpacingAdjusted = vSpacing * spacingModifier;

                return (
                    <g key={pos.h} className={cn("transition-all duration-300", isHovered && "opacity-100")}>
                        {/* Clickable Area */}
                        <polygon
                            points={COMPACT_HOUSE_POLYGONS[pos.h]}
                            fill={isHovered ? "rgba(208, 140, 96, 0.25)" : getHouseColor(pos.h)}
                            className={cn("transition-all duration-300", onHouseClick && "cursor-pointer")}
                            onMouseEnter={() => setHoveredHouse(pos.h)}
                            onMouseLeave={() => setHoveredHouse(null)}
                            onClick={() => onHouseClick?.(pos.h)}
                        />

                        {/* House Numbers (Zodiac Signs) - Same size as planets as requested */}
                        {showHouseNumbers && (
                            <text
                                x={COMPACT_SIGN_POSITIONS[pos.h].x}
                                y={COMPACT_SIGN_POSITIONS[pos.h].y}
                                fontSize={planetFontSize}
                                style={{ fontSize: `${planetFontSize}px` }}
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fontWeight={userPlanetFontWeight || TYPOGRAPHY.svgSignNumber.fontWeight}
                                fill={theme.signText}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="select-none pointer-events-none transition-all duration-300"
                            >
                                {signId}
                            </text>
                        )}

                        {/* Ashtakavarga Score */}
                        {houseValues && houseValues[pos.h] !== undefined && (
                            <text
                                x={pos.x} y={pos.y}
                                fontSize="34" style={{ fontSize: "34px" }}
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fontWeight="400"
                                fill={houseValues[pos.h] < 20 ? "var(--status-error)" : houseValues[pos.h] >= 30 ? "var(--status-success)" : theme.planetText}
                                textAnchor="middle" dominantBaseline="central"
                                className="select-none pointer-events-none"
                            >
                                {houseValues[pos.h]}
                            </text>
                        )}

                        {/* Planets */}
                        <g transform={`translate(${pos.x}, ${pos.y + (houseValues ? 20 : -5)})`}>
                            {boxPlanets.map((p, i) => {
                                const row = Math.floor(i / cols);
                                const col = i % cols;
                                const planetsInThisRow = Math.min(cols, planetCount - row * cols);
                                const rowWidth = (planetsInThisRow - 1) * hSpacingAdjusted;
                                const xOffset = (col * hSpacingAdjusted) - (rowWidth / 2);
                                const yOffset = (row * vSpacingAdjusted) - ((rows - 1) * vSpacingAdjusted / 2);
                                
                                const getLabel = () => {
                                    const symbol = getPlanetSymbol(p.name);
                                    if (planetDisplayMode === 'symbol') return symbol;
                                    if (planetDisplayMode === 'both') return `${symbol} ${p.name}`;
                                    return p.name;
                                };

                                return (
                                    <g key={p.name} transform={`translate(${xOffset}, ${yOffset})`}>
                                        <text
                                            fontSize={planetFontSize}
                                            style={{ fontSize: `${planetFontSize}px` }}
                                            fontWeight={userPlanetFontWeight || "600"}
                                            fill={PLANET_SVG_FILLS[p.name] || theme.planetText}
                                            textAnchor="middle" dominantBaseline="central"
                                            className="select-none transition-all duration-300"
                                        >
                                            {getLabel()}
                                            {p.isRetro && (
                                                <tspan fontSize={retroFontSize} style={{ fontSize: `${retroFontSize}px` }} fill="var(--status-error)" dx="1">R</tspan>
                                            )}
                                        </text>
                                        {(showDegrees || p.name === 'As') && p.degree && p.degree !== '-' && (
                                            <text
                                                y={degreeYOffset}
                                                fontSize={degreeFontSize}
                                                style={{ fontSize: `${degreeFontSize}px` }}
                                                fontWeight="700" fill="var(--text-primary)"
                                                textAnchor="middle" dominantBaseline="central"
                                                className="select-none"
                                            >
                                                {p.degree}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}
