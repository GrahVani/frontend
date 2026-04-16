"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Planet } from './NorthIndianChart/NorthIndianChart';
import { ChartColorTheme } from '@/store/useAstrologerStore';
import { CHART_THEMES } from '@/design-tokens/colors';
import { getPlanetSymbol } from '@/lib/planet-symbols';

export type ChartColorMode = 'color' | 'blackwhite';

interface CompactSouthIndianChartProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
    colorMode?: ChartColorMode;
    colorTheme?: ChartColorTheme;
    // Theme Overrides
    planetFontSize?: number;
    degreeFontSize?: number;
    planetFontWeight?: string | number;
    showDegrees?: boolean;
    planetDisplayMode?: 'name' | 'symbol' | 'both';
    showHouseNumbers?: boolean;
}

const SIGN_ABBR = [
    "Ar", "Ta", "Ge", "Ca", "Le", "Vi", "Li", "Sc", "Sg", "Cp", "Aq", "Pi"
];

const GRID_MAP = [
    { signId: 12, x: 0, y: 0 }, { signId: 1, x: 1, y: 0 }, { signId: 2, x: 2, y: 0 }, { signId: 3, x: 3, y: 0 },
    { signId: 11, x: 0, y: 1 }, { signId: 4, x: 3, y: 1 },
    { signId: 10, x: 0, y: 2 }, { signId: 5, x: 3, y: 2 },
    { signId: 9, x: 0, y: 3 }, { signId: 8, x: 1, y: 3 }, { signId: 7, x: 2, y: 3 }, { signId: 6, x: 3, y: 3 }
];

const CENTER_BG: Record<string, string> = {
    classic: 'rgba(42, 24, 16, 0.05)',
    modern: 'rgba(99, 102, 241, 0.1)',
    royal: 'rgba(147, 51, 234, 0.1)',
    earth: 'rgba(5, 150, 105, 0.1)',
    ocean: 'rgba(14, 165, 233, 0.1)',
};

const COLOR_THEMES: Record<ChartColorTheme, {
    background: string; border: string; gridLine: string;
    ascLine: string; ascText: string; signText: string;
    planetText: string; centerBg: string; centerText: string;
}> = Object.fromEntries(
    Object.entries(CHART_THEMES).map(([key, t]) => [key, {
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

export default function CompactSouthIndianChart({
    planets,
    ascendantSign,
    className,
    colorMode = 'color',
    colorTheme = 'classic',
    planetFontSize: userPlanetFontSize,
    degreeFontSize: userDegreeFontSize,
    planetFontWeight: userPlanetFontWeight,
    showDegrees = true,
    planetDisplayMode = 'name',
    showHouseNumbers = true,
}: CompactSouthIndianChartProps) {
    const scheme = colorMode === 'blackwhite' 
        ? { background: '#FFFFFF', border: '#000000', gridLine: '#333333', ascLine: '#555555', ascText: '#333333', signText: '#666666', planetText: '#000000', centerBg: 'rgba(0, 0, 0, 0.03)', centerText: '#666666' }
        : COLOR_THEMES[colorTheme];

    return (
        <svg viewBox="0 0 400 400" className={cn("w-full h-full drop-shadow-md overflow-visible", className)} role="img">
            <rect x="0" y="0" width="400" height="400" fill={scheme.background} rx="8" />

            <g stroke={scheme.gridLine} strokeWidth="1" opacity="0.6">
                <rect x="0" y="0" width="400" height="400" fill="none" strokeWidth="2" stroke={scheme.border} rx="8" />
                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
                <line x1="0" y1="100" x2="400" y2="100" />
                <line x1="0" y1="200" x2="400" y2="200" />
                <line x1="0" y1="300" x2="400" y2="300" />
            </g>

            <rect x="100" y="100" width="200" height="200" fill={scheme.centerBg} />
            <text x="200" y="200" textAnchor="middle" fontSize="11" fontWeight="bold" fill={scheme.centerText} opacity="0.5">
                Dashboard View
            </text>

            {GRID_MAP.map((grid) => {
                const isAsc = grid.signId === ascendantSign;
                const boxPlanets = planets.filter(p => p.signId === grid.signId);
                const startX = grid.x * 100;
                const startY = grid.y * 100;
                const houseNum = ((grid.signId - ascendantSign + 12) % 12) + 1;

                return (
                    <g key={grid.signId}>
                        {isAsc && (
                            <text 
                                x={startX + 5} 
                                y={startY + 15} 
                                fontSize={userPlanetFontSize || 9} 
                                style={{ fontSize: `${userPlanetFontSize || 9}px` }} 
                                fontWeight="bold" 
                                fill={scheme.ascText}
                                className="transition-all duration-300"
                            >
                                ASC
                            </text>
                        )}

                        <text 
                            x={startX + 95} 
                            y={startY + 12} 
                            fontSize={userPlanetFontSize || 9} 
                            style={{ fontSize: `${userPlanetFontSize || 9}px` }} 
                            fill={scheme.signText} 
                            textAnchor="end" 
                            fontWeight="600"
                            className="transition-all duration-300"
                        >
                            {SIGN_ABBR[grid.signId - 1]}
                        </text>

                        {showHouseNumbers && (
                            <text 
                                x={startX + 5} 
                                y={startY + 95} 
                                fontSize={userPlanetFontSize || 8} 
                                style={{ fontSize: `${userPlanetFontSize || 8}px` }} 
                                fill={scheme.signText} 
                                opacity="0.4"
                                className="transition-all duration-300"
                            >
                                H{houseNum}
                            </text>
                        )}

                        {boxPlanets.map((p, i) => {
                            const planetSize = userPlanetFontSize || 12;
                            const degreeSize = userDegreeFontSize || 8;
                            const yPos = startY + 32 + (i * (planetSize + 4));
                            
                            const getLabel = () => {
                                const symbol = getPlanetSymbol(p.name);
                                if (planetDisplayMode === 'symbol') return symbol;
                                if (planetDisplayMode === 'both') return `${symbol} ${p.name}`;
                                return p.name;
                            };

                            return (
                                <g key={p.name}>
                                    <text
                                        x={startX + 50}
                                        y={yPos}
                                        textAnchor="middle"
                                        fontSize={planetSize}
                                        style={{ fontSize: `${planetSize}px` }}
                                        fontWeight={userPlanetFontWeight || "600"}
                                        fill={scheme.planetText}
                                        className="select-none transition-all duration-300"
                                    >
                                        {getLabel()}{p.isRetro ? 'ᴿ' : ''}
                                    </text>
                                    {showDegrees && p.degree && p.degree !== '-' && (
                                        <text
                                            x={startX + 50}
                                            y={yPos + (planetSize / 2) + 2}
                                            textAnchor="middle"
                                            fontSize={degreeSize}
                                            style={{ fontSize: `${degreeSize}px` }}
                                            fill={scheme.planetText}
                                            opacity="0.6"
                                            className="transition-all duration-300"
                                        >
                                            {p.degree}
                                        </text>
                                    )}
                                </g>
                            );
                        })}
                    </g>
                );
            })}
        </svg>
    );
}
