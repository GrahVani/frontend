"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Planet } from '../astrology/NorthIndianChart/NorthIndianChart';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';
import { HOUSE_CENTERS, HOUSE_POLYGONS, SIGN_NUMBER_POSITIONS } from '@/lib/chart-geometry';

export interface KpCuspDetail {
    house: number;
    degreeFormatted: string;
    sign: string;
    signId: number;
}

export interface KpCuspalChartProps {
    planets: Planet[]; // Planets mapped to houses
    houseSigns: number[]; // Array of 12 sign IDs, one for each house (1-12)
    cuspDetails?: KpCuspDetail[];
    className?: string;
    preserveAspectRatio?: string;
    onHouseClick?: (houseNumber: number) => void;
    planetFontSize?: number;
    degreeFontSize?: number;
    signNumberFontSize?: number;
    showDegrees?: boolean;
}

/**
 * KpCuspalChart
 * Specialized North Indian Chart for KP System
 * - Supports Unequal House Signs (KP/Placidus) via houseSigns prop
 * - House 1 is always top diamond
 * - Signs are displayed based on the Cusp sign
 */
export default function KpCuspalChart({
    planets,
    houseSigns,
    cuspDetails,
    className = "",
    preserveAspectRatio,
    onHouseClick,
    planetFontSize = 17,
    degreeFontSize = 11,
    signNumberFontSize = 17,
    showDegrees = false,
}: KpCuspalChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

    const houseCenters = HOUSE_CENTERS;
    const housePolygons = HOUSE_POLYGONS;
    const signNumberPositions = SIGN_NUMBER_POSITIONS;

    const cuspMap = React.useMemo(() => {
        if (!cuspDetails) return {} as Record<number, KpCuspDetail>;
        return Object.fromEntries(cuspDetails.map(c => [c.house, c]));
    }, [cuspDetails]);

    const handleHouseClick = (houseNum: number) => {
        if (onHouseClick) {
            onHouseClick(houseNum);
        }
    };

    return (
        <svg viewBox="9 9 382 382" preserveAspectRatio={preserveAspectRatio} className={cn("w-full h-full", className)} role="img" aria-label="KP Cuspal birth chart showing planetary positions in houses">
            <desc>KP System cuspal chart with unequal house signs and planetary placements</desc>
            <defs>
                <linearGradient id="kpChartBg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--surface-warm)" />
                    <stop offset="100%" stopColor="var(--softwhite)" />
                </linearGradient>
            </defs>

            {/* Background is handled by parent container but we keep SVG geometry */}
            <g stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Outer Square Border */}
                <rect x="10" y="10" width="380" height="380" fill="url(#kpChartBg)" />
                {/* Cross Lines (X) */}
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                {/* Diamond Lines */}
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Clickable Regions */}
            {houseCenters.map((pos) => (
                <polygon
                    key={`poly-${pos.h}`}
                    points={housePolygons[pos.h]}
                    fill={hoveredHouse === pos.h ? "rgba(208, 140, 96, 0.25)" : "transparent"}
                    stroke="transparent"
                    strokeWidth="0"
                    className={cn("transition-all duration-300", onHouseClick && "cursor-pointer")}
                    onMouseEnter={() => setHoveredHouse(pos.h)}
                    onMouseLeave={() => setHoveredHouse(null)}
                    onClick={() => handleHouseClick(pos.h)}
                />
            ))}

            {/* Render Houses & Planets */}
            {houseCenters.map((pos) => {
                // Get Sign for this House from Prop (or default to 1)
                const signId = houseSigns[pos.h - 1] || 1;

                // Simple filtering: Planets in this house OR Planets with this Sign (if house not specified)
                // For KP Cusp chart, we usually plot planets based on usage relative to the cusp logic.
                // Assuming `planets` prop passed here will have `house` set correctly by parent.
                const boxPlanets = planets
                    .filter(p => (p.house ? p.house === pos.h : p.signId === signId))
                    .sort((a, b) => a.degree.localeCompare(b.degree));

                const isHovered = hoveredHouse === pos.h;

                return (
                    <g key={pos.h} className={cn("transition-all duration-300", isHovered && "opacity-100")}>
                        {/* Planets List */}
                        <g transform={`translate(${pos.x}, ${pos.y})`}>
                            {
                                boxPlanets.map((p, i) => {
                                    const spacing = boxPlanets.length > 5 ? 13 : 17;
                                    const yOffset = (i * spacing) - ((boxPlanets.length - 1) * (spacing / 2));
                                    const planetColor = PLANET_SVG_FILLS[p.name] || 'var(--ink)';
                                    const displayLabel = p.chartLabel || p.name;

                                    return (
                                        <g key={p.name} transform={`translate(0, ${yOffset})`}>
                                            <text
                                                fontSize={planetFontSize}
                                                fontFamily={TYPOGRAPHY.svgPlanetName.fontFamily}
                                                fontWeight={isHovered ? "800" : TYPOGRAPHY.svgPlanetName.fontWeight}
                                                fill={planetColor}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                className="select-none transition-all duration-300"
                                            >
                                                {displayLabel}
                                                {p.isRetro && (
                                                    <tspan fontSize={Math.max(8, planetFontSize - 3)} fontWeight="bold" fill="var(--status-error)" dx="1">R</tspan>
                                                )}
                                                {showDegrees && (
                                                    <tspan
                                                        fontSize={degreeFontSize}
                                                        fontWeight={TYPOGRAPHY.svgDegree.fontWeight}
                                                        fill="var(--ink)"
                                                        dx="2"
                                                    >
                                                        {p.degree}
                                                    </tspan>
                                                )}
                                            </text>
                                        </g>
                                    );
                                })
                            }
                        </g>

                        {/* Sign Number */}
                        <g transform={`translate(${signNumberPositions[pos.h].x}, ${signNumberPositions[pos.h].y})`}>
                            <text
                                fontSize={signNumberFontSize}
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fontWeight="700"
                                fill="var(--text-muted)"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="select-none pointer-events-none"
                            >
                                {signId}
                            </text>
                        </g>
                    </g>
                );
            })}
        </svg>
    );
}
