"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Planet } from './NorthIndianChart/NorthIndianChart';
import { ChartColorTheme } from '@/store/useAstrologerStore';
import { CHART_THEMES } from '@/design-tokens/colors';

export type ChartColorMode = 'color' | 'blackwhite';

interface SouthIndianChartProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
    colorMode?: ChartColorMode;
    colorTheme?: ChartColorTheme;
}

const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const SIGN_ABBR = [
    "Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
];

// Fixed grid positions for South Indian (Signs are FIXED, not Houses)
const GRID_MAP = [
    { signId: 12, x: 0, y: 0 }, { signId: 1, x: 1, y: 0 }, { signId: 2, x: 2, y: 0 }, { signId: 3, x: 3, y: 0 },
    { signId: 11, x: 0, y: 1 }, { signId: 4, x: 3, y: 1 },
    { signId: 10, x: 0, y: 2 }, { signId: 5, x: 3, y: 2 },
    { signId: 9, x: 0, y: 3 }, { signId: 8, x: 1, y: 3 }, { signId: 7, x: 2, y: 3 }, { signId: 6, x: 3, y: 3 }
];

// SVG-specific center background opacities per theme
const CENTER_BG: Record<string, string> = {
    classic: 'rgba(42, 24, 16, 0.05)',
    modern: 'rgba(99, 102, 241, 0.1)',
    royal: 'rgba(147, 51, 234, 0.1)',
    earth: 'rgba(5, 150, 105, 0.1)',
    ocean: 'rgba(14, 165, 233, 0.1)',
};

// Color themes derived from centralized tokens + SVG-specific centerBg
const COLOR_THEMES: Record<ChartColorTheme, {
    background: string; border: string; gridLine: string;
    ascLine: string; ascText: string; signText: string;
    planetText: string; centerBg: string; centerText: string;
}> = Object.fromEntries(
    Object.entries(CHART_THEMES).map(([key, t]) => [key, {
        // Classic theme uses CSS variables for parchment consistency
        background: key === 'classic' ? 'var(--surface-warm)' : t.background,
        border: key === 'classic' ? 'var(--ink)' : t.border,
        gridLine: key === 'classic' ? 'var(--ink)' : t.gridLine,
        ascLine: key === 'classic' ? 'var(--header-border)' : t.ascLine,
        ascText: key === 'classic' ? 'var(--header-border)' : t.ascText,
        signText: key === 'classic' ? 'var(--text-tertiary)' : t.signText,
        planetText: key === 'classic' ? 'var(--ink)' : t.planetText,
        centerBg: CENTER_BG[key] ?? CENTER_BG.classic,
        centerText: key === 'classic' ? 'var(--text-tertiary)' : t.centerText,
    }])
) as Record<ChartColorTheme, {
    background: string; border: string; gridLine: string;
    ascLine: string; ascText: string; signText: string;
    planetText: string; centerBg: string; centerText: string;
}>;

// B&W scheme (for printing)
const BW_SCHEME = {
    background: '#FFFFFF',
    border: '#000000',
    gridLine: '#333333',
    ascLine: '#555555',
    ascText: '#333333',
    signText: '#666666',
    planetText: '#000000',
    centerBg: 'rgba(0, 0, 0, 0.03)',
    centerText: '#666666'
};

export default function SouthIndianChart({
    planets,
    ascendantSign,
    className,
    colorMode = 'color',
    colorTheme = 'classic'
}: SouthIndianChartProps) {
    // Use B&W if colorMode is blackwhite, otherwise use selected theme
    const scheme = colorMode === 'blackwhite' ? BW_SCHEME : COLOR_THEMES[colorTheme];

    return (
        <svg viewBox="0 0 400 400" className={cn("w-full h-full drop-shadow-lg overflow-visible", className)} role="img" aria-label="South Indian birth chart with fixed sign positions">
            <desc>Grid-based South Indian style horoscope chart with fixed sign positions and planets placed in signs</desc>
            {/* Background */}
            <rect x="0" y="0" width="400" height="400" fill={scheme.background} rx="8" />

            {/* Grid Lines */}
            <g stroke={scheme.gridLine} strokeWidth="1.5" opacity="0.6">
                <rect x="0" y="0" width="400" height="400" fill="none" strokeWidth="3" stroke={scheme.border} rx="8" />
                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
                <line x1="0" y1="100" x2="400" y2="100" />
                <line x1="0" y1="200" x2="400" y2="200" />
                <line x1="0" y1="300" x2="400" y2="300" />
            </g>

            {/* Inner Center Box */}
            <rect x="100" y="100" width="200" height="200" fill={scheme.centerBg} />

            {/* Chart Title in Center */}
            <text
                x="200"
                y="190"
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill={scheme.centerText}
                opacity="0.6"
                fontFamily="serif"
            >
                South Indian
            </text>
            <text
                x="200"
                y="208"
                textAnchor="middle"
                fontSize="10"
                fill={scheme.centerText}
                opacity="0.4"
                fontFamily="serif"
            >
                Fixed Signs
            </text>

            {/* Render Signs & Planets */}
            {GRID_MAP.map((grid) => {
                const isAsc = grid.signId === ascendantSign;
                const boxPlanets = planets.filter(p => p.signId === grid.signId);
                const startX = grid.x * 100;
                const startY = grid.y * 100;

                // Calculate house number for this sign
                const houseNum = ((grid.signId - ascendantSign + 12) % 12) + 1;

                return (
                    <g key={grid.signId}>
                        {/* Ascendant Marker (Diagonal line in corner) */}
                        {isAsc && (
                            <g>
                                <line
                                    x1={startX + 2}
                                    y1={startY + 2}
                                    x2={startX + 25}
                                    y2={startY + 25}
                                    stroke={scheme.ascLine}
                                    strokeWidth="2.5"
                                />
                                <text
                                    x={startX + 8}
                                    y={startY + 18}
                                    fontSize="9"
                                    fontWeight="bold"
                                    fill={scheme.ascText}
                                >
                                    ASC
                                </text>
                            </g>
                        )}

                        {/* Sign Abbreviation (Top-right of cell) */}
                        <text
                            x={startX + 92}
                            y={startY + 12}
                            fontSize="9"
                            fill={scheme.signText}
                            textAnchor="end"
                            fontFamily="serif"
                            fontWeight="600"
                        >
                            {SIGN_ABBR[grid.signId - 1]}
                        </text>

                        {/* House Number (Bottom-left, small) */}
                        <text
                            x={startX + 5}
                            y={startY + 95}
                            fontSize="8"
                            fill={scheme.signText}
                            opacity="0.5"
                            fontFamily="sans-serif"
                        >
                            H{houseNum}
                        </text>

                        {/* Planets */}
                        {boxPlanets.map((p, i) => (
                            <text
                                key={p.name}
                                x={startX + 50}
                                y={startY + 35 + (i * 14)}
                                textAnchor="middle"
                                fontSize="12"
                                fontWeight="bold"
                                fill={scheme.planetText}
                                fontFamily="serif"
                                className="select-none"
                            >
                                {p.name}{p.isRetro ? 'ᴿ' : ''}
                            </text>
                        ))}
                    </g>
                );
            })}
        </svg>
    );
}
