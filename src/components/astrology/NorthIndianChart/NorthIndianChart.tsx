"use client";
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_SVG_FILLS } from '@/design-tokens/colors';
import { HOUSE_CENTERS, HOUSE_POLYGONS, SIGN_NUMBER_POSITIONS, ZODIAC_SIGNS } from '@/lib/chart-geometry';
import { getPlanetSymbol, getRetrogradeIndicator } from '@/lib/planet-symbols';

export interface Planet {
    name: string;
    signId: number;
    degree: string;
    isRetro?: boolean;
    house?: number;
    nakshatra?: string;
    pada?: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ASTROLOGER CUSTOMIZATION OPTIONS
// ═══════════════════════════════════════════════════════════════════════════════
export interface ChartDisplayOptions {
    planetDisplayMode?: 'name' | 'symbol' | 'both';
    planetFontSize?: number;
    planetFontWeight?: 'normal' | 'bold' | '600';
    showDegrees?: boolean;
    degreeFormat?: 'full' | 'short';
    degreeFontSize?: number;
    showHouseNumbers?: boolean;
    signNumberFontSize?: number;
    showGridLines?: boolean;
    gridLineColor?: string;
    gridLineWidth?: number;
    showRetrogradeIndicator?: boolean;
    retrogradeStyle?: 'R' | 'R%' | 'circle-R';
    planetSpacing?: 'compact' | 'normal' | 'spacious';
    labelDensity?: 'minimal' | 'normal' | 'detailed';
}

interface NorthIndianChartProps extends ChartDisplayOptions {
    planets: Planet[];
    ascendantSign: number; // 1-12
    className?: string;
    onHouseClick?: (houseNumber: number) => void;
    houseValues?: Record<number, number>; // Map of HouseNumber (1-12) to Value (e.g. Bindus)
    valueType?: 'bindu' | 'none';
    preserveAspectRatio?: string;
}

export default function NorthIndianChart({
    planets,
    ascendantSign,
    className = "",
    onHouseClick,
    houseValues,
    valueType = 'none',
    preserveAspectRatio,
    // Display options with defaults
    planetDisplayMode = 'name',
    planetFontSize = 14,
    planetFontWeight = '600',
    showDegrees = true,
    degreeFormat = 'short',
    degreeFontSize = 9,
    showHouseNumbers = true,
    signNumberFontSize,
    showGridLines = true,
    gridLineColor = '#D4C4A8',
    gridLineWidth = 2,
    showRetrogradeIndicator = true,
    retrogradeStyle = 'R',
    planetSpacing = 'normal',
    labelDensity = 'normal',
}: NorthIndianChartProps) {
    const [hoveredHouse, setHoveredHouse] = useState<number | null>(null);

    // DEBUG: Check props
    // Helpers for Heatmap
    const getHouseColor = (houseNum: number) => {
        if (!houseValues || !houseValues[houseNum]) return "transparent";
        const val = houseValues[houseNum];
        if (valueType === 'bindu') {
            if (val >= 32) return "rgba(16, 185, 129, 0.15)"; // Emerald
            if (val >= 28) return "rgba(208, 140, 96, 0.1)"; // Copper/Gold
            if (val < 20) return "rgba(225, 29, 72, 0.1)"; // Red
        }
        return "transparent";
    };

    // North Indian Style (Diamond Chart)
    // Signs are MUTABLE (Houses are fixed).
    // House 1 is always Top Diamond.
    // Count proceeds anti-clockwise usually.

    const houses = Array.from({ length: 12 }, (_, i) => {
        const houseNum = i + 1; // 1 to 12
        // Calculate sign in house based on Ascendant
        const signNum = ((ascendantSign + i - 1) % 12) || 12;
        return { house: houseNum, sign: signNum };
    });

    const houseCenters = HOUSE_CENTERS;
    const housePolygons = HOUSE_POLYGONS;
    const signNumberPositions = SIGN_NUMBER_POSITIONS;

    const handleHouseClick = (houseNum: number) => {
        if (onHouseClick) {
            onHouseClick(houseNum);
        }
    };

    return (
        <svg viewBox="0 0 400 400" preserveAspectRatio={preserveAspectRatio} className={cn("w-full h-full", className)} role="img" aria-label="North Indian birth chart showing planetary positions in 12 houses">
            <desc>Diamond-shaped North Indian style horoscope chart with planets placed in houses</desc>
            <defs>
                <linearGradient id="chartParchment" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--surface-warm)" />
                    <stop offset="100%" stopColor="var(--softwhite)" />
                </linearGradient>
            </defs>

            {/* Background is handled by parent container */}
            <g
                stroke={showGridLines ? gridLineColor : 'transparent'}
                strokeWidth={showGridLines ? gridLineWidth : 0}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {/* Outer Square Border */}
                <rect x="10" y="10" width="380" height="380" fill="none" />
                {/* Cross Lines (X) */}
                <line x1="10" y1="10" x2="390" y2="390" />
                <line x1="390" y1="10" x2="10" y2="390" />
                {/* Diamond Lines */}
                <line x1="200" y1="10" x2="10" y2="200" />
                <line x1="10" y1="200" x2="200" y2="390" />
                <line x1="200" y1="390" x2="390" y2="200" />
                <line x1="390" y1="200" x2="200" y2="10" />
            </g>

            {/* Clickable Regions & Heatmap for Houses */}
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
                // House 1 is always the Ascendant. 
                // Sign numbers count anti-clockwise starting from the Ascendant's sign in House 1.
                const signId = ((ascendantSign + pos.h - 2) % 12) + 1;

                const boxPlanets = planets
                    .filter(p => (p.house ? p.house === pos.h : p.signId === signId))
                    .sort((a, b) => a.degree.localeCompare(b.degree));
                const isHovered = hoveredHouse === pos.h;

                return (
                    <g key={pos.h} className={cn("transition-all duration-300", isHovered && "opacity-100")}>
                        {/* Sign Number - Positioned at corner/edge of each house segment */}
                        {showHouseNumbers && (
                            <text
                                x={signNumberPositions[pos.h].x}
                                y={signNumberPositions[pos.h].y}
                                fontSize={signNumberFontSize || TYPOGRAPHY.svgSignNumber.fontSize}
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fontWeight={TYPOGRAPHY.svgSignNumber.fontWeight}
                                fill={TYPOGRAPHY.svgSignNumber.fill}
                                fillOpacity="0.9"
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="select-none pointer-events-none"
                            >
                                {signId}
                            </text>
                        )}

                        {/* Ashtakavarga Score / Value */}
                        {houseValues && houseValues[pos.h] !== undefined && (
                            <text
                                x={pos.x}
                                y={pos.y}
                                fontSize="34"
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fontWeight="600"
                                fill={houseValues[pos.h] < 20 ? "var(--status-error)" : houseValues[pos.h] >= 30 ? "var(--status-success)" : "var(--text-ink)"}
                                textAnchor="middle"
                                dominantBaseline="central"
                                className="select-none pointer-events-none"
                            >
                                {houseValues[pos.h]}
                            </text>
                        )}

                        {/* Planets List - Smart Grid Layout based on planet count */}
                        <g transform={`translate(${pos.x}, ${pos.y + (houseValues ? 20 : -5)})`}>
                            {
                                (() => {
                                    const planetCount = boxPlanets.length;

                                    // Spacing multiplier based on planetSpacing setting
                                    const spacingMultiplier = {
                                        'compact': 0.8,
                                        'normal': 1,
                                        'spacious': 1.3
                                    }[planetSpacing] || 1;

                                    // Smart layout algorithm based on planet count
                                    let cols: number;
                                    let hSpacing: number;
                                    let vSpacing: number;
                                    let autoPlanetFontSize: number;
                                    let autoDegreeFontSize: number;
                                    let retroFontSize: number;
                                    let degreeYOffset: number;

                                    if (planetCount === 1) {
                                        // Single planet - comfortable spacing
                                        cols = 1;
                                        hSpacing = 0;
                                        vSpacing = 0;
                                        autoPlanetFontSize = 16;
                                        autoDegreeFontSize = 9;
                                        retroFontSize = 12;
                                        degreeYOffset = 13;
                                    } else if (planetCount === 2) {
                                        // Two planets - side by side
                                        cols = 2;
                                        hSpacing = Math.round(42 * spacingMultiplier);
                                        vSpacing = 0;
                                        autoPlanetFontSize = 15;
                                        autoDegreeFontSize = 9;
                                        retroFontSize = 11;
                                        degreeYOffset = 13;
                                    } else if (planetCount === 3) {
                                        // Three planets - 3-column layout
                                        cols = 3;
                                        hSpacing = Math.round(32 * spacingMultiplier);
                                        vSpacing = 0;
                                        autoPlanetFontSize = 13;
                                        autoDegreeFontSize = 8;
                                        retroFontSize = 10;
                                        degreeYOffset = 12;
                                    } else if (planetCount === 4) {
                                        // Four planets - 2x2 grid (optimal for 4)
                                        cols = 2;
                                        hSpacing = Math.round(36 * spacingMultiplier);
                                        vSpacing = Math.round(26 * spacingMultiplier);
                                        autoPlanetFontSize = 14;
                                        autoDegreeFontSize = 7;
                                        retroFontSize = 10;
                                        degreeYOffset = 11;
                                    } else if (planetCount === 5 || planetCount === 6) {
                                        // 5-6 planets - 3x2 grid
                                        cols = 3;
                                        hSpacing = Math.round(28 * spacingMultiplier);
                                        vSpacing = Math.round(24 * spacingMultiplier);
                                        autoPlanetFontSize = 12;
                                        autoDegreeFontSize = 7;
                                        retroFontSize = 9;
                                        degreeYOffset = 10;
                                    } else {
                                        // 7+ planets - compact mode
                                        cols = 4;
                                        hSpacing = Math.round(24 * spacingMultiplier);
                                        vSpacing = Math.round(22 * spacingMultiplier);
                                        autoPlanetFontSize = 11;
                                        autoDegreeFontSize = 6;
                                        retroFontSize = 8;
                                        degreeYOffset = 9;
                                    }

                                    const rows = Math.ceil(planetCount / cols);

                                    // Use user-defined font sizes or auto-calculated ones
                                    const finalPlanetFontSize = planetFontSize || autoPlanetFontSize;
                                    const finalDegreeFontSize = degreeFontSize || autoDegreeFontSize;

                                    return boxPlanets.map((p, i) => {
                                        const row = Math.floor(i / cols);
                                        const col = i % cols;

                                        // Calculate position in grid with proper centering
                                        const planetsInThisRow = Math.min(cols, planetCount - row * cols);
                                        const rowWidth = (planetsInThisRow - 1) * hSpacing;
                                        const xOffset = (col * hSpacing) - (rowWidth / 2);
                                        const yOffset = (row * vSpacing) - ((rows - 1) * vSpacing / 2);

                                        const planetColor = PLANET_SVG_FILLS[p.name] || 'var(--ink)';
                                        const hasDegree = (showDegrees !== false) && p.degree && p.degree !== '-';

                                        // Get planet label based on display mode
                                        const getPlanetLabel = () => {
                                            const symbol = getPlanetSymbol(p.name);
                                            switch (planetDisplayMode) {
                                                case 'symbol':
                                                    return symbol;
                                                case 'both':
                                                    return `${symbol} ${p.name}`;
                                                case 'name':
                                                default:
                                                    return p.name;
                                            }
                                        };

                                        // Get retrograde indicator
                                        const retroIndicator = (p.isRetro && showRetrogradeIndicator !== false)
                                            ? getRetrogradeIndicator(retrogradeStyle)
                                            : null;



                                        return (
                                            <g key={p.name} transform={`translate(${xOffset}, ${yOffset})`}>
                                                {/* Planet name/symbol and retro on first line */}
                                                <text
                                                    fontSize={finalPlanetFontSize}
                                                    fontFamily={TYPOGRAPHY.svgPlanetName.fontFamily}
                                                    fontWeight={planetFontWeight}
                                                    fill={planetColor}
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                    className={cn(
                                                        "select-none transition-all duration-300",
                                                        isHovered && "font-black"
                                                    )}
                                                >
                                                    {getPlanetLabel()}
                                                    {retroIndicator && (
                                                        <tspan
                                                            fontSize={retroFontSize}
                                                            fontWeight="bold"
                                                            fill="var(--status-error)"
                                                            dx="2"
                                                        >{retroIndicator}</tspan>
                                                    )}
                                                </text>
                                                {/* Degree on separate line below - using custom size */}
                                                {hasDegree && (
                                                    <text
                                                        y={degreeYOffset}
                                                        fontSize={finalDegreeFontSize}
                                                        fontFamily={TYPOGRAPHY.svgPlanetName.fontFamily}
                                                        fontWeight="600"
                                                        fill="var(--text-primary)"
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
        </svg >
    );
}
