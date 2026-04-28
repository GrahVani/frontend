"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

interface AshtakavargaChartProps {
    type: 'sarva' | 'bhinna';
    ascendantSign: number;
    houseValues: Record<number, number>;
    className?: string;
}


export default function AshtakavargaChart({ type = 'sarva', ascendantSign, houseValues, className = "" }: AshtakavargaChartProps) {
    // Find max/min
    let maxH = 1, minH = 1, maxV = 0, minV = 999;
    Object.entries(houseValues).forEach(([h, v]) => {
        if (v > maxV) { maxV = v; maxH = parseInt(h); }
        if (v < minV) { minV = v; minH = parseInt(h); }
    });

    // Color logic: green for the main SAV score, muted for sign index
    const getValueColor = () => {
        return "#F25912";
    };

    const getSignNumberColor = () => {
        return "#03346E";
    };

    // House positions for house values (centered in segments)
    const valuePos = [
        { h: 1, x: 140, y: 50 },
        { h: 2, x: 74, y: 24 },
        { h: 3, x: 24, y: 54 },
        { h: 4, x: 70, y: 140 },
        { h: 5, x: 24, y: 226 },
        { h: 6, x: 74, y: 266 },
        { h: 7, x: 140, y: 230 },
        { h: 8, x: 206, y: 266 },
        { h: 9, x: 256, y: 226 },
        { h: 10, x: 250, y: 140 },
        { h: 11, x: 260, y: 54 },
        { h: 12, x: 206, y: 24 }
    ];

    // House positions for sign numbers (offset to corners for clarity)
    const signPos = [
        { h: 1, x: 140, y: 120 },
        { h: 2, x: 74, y: 54 },
        { h: 3, x: 44, y: 74 },
        { h: 4, x: 120, y: 140 },
        { h: 5, x: 24, y: 186 },
        { h: 6, x: 74, y: 236 },
        { h: 7, x: 140, y: 170 },
        { h: 8, x: 206, y: 236 },
        { h: 9, x: 236, y: 206 },
        { h: 10, x: 170, y: 140 },
        { h: 11, x: 236, y: 74 },
        { h: 12, x: 206, y: 44 }
    ];

    return (
        <div className={cn("flex flex-col items-center w-full", className)}>
            <svg viewBox="0 0 280 280" className="w-full max-w-[380px] drop-shadow-sm transition-all duration-300">
                {/* Background */}
                <rect x="0" y="0" width="280" height="280" fill="var(--surface-warm)" />

                {/* Chart lines */}
                <g stroke="#D97706" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="1" width="278" height="278" />
                    <line x1="0" y1="0" x2="280" y2="280" />
                    <line x1="280" y1="0" x2="0" y2="280" />
                    <line x1="140" y1="0" x2="0" y2="140" />
                    <line x1="0" y1="140" x2="140" y2="280" />
                    <line x1="140" y1="280" x2="280" y2="140" />
                    <line x1="280" y1="140" x2="140" y2="0" />
                </g>

                {/* Values and Sign Numbers */}
                {[...Array(12)].map((_, i) => {
                    const houseNum = i + 1;
                    const vP = valuePos.find(p => p.h === houseNum)!;
                    const sP = signPos.find(p => p.h === houseNum)!;

                    const signIdx = ((ascendantSign + houseNum - 2) % 12);
                    const v = houseValues[houseNum] || 0;
                    const isMax = houseNum === maxH;
                    const isMin = houseNum === minH;
                    const vColor = getValueColor();
                    const sColor = getSignNumberColor();

                    return (
                        <g key={houseNum}>
                            {/* ASC label */}
                            {houseNum === 1 && (
                                <text
                                    x={vP.x}
                                    y={vP.y - 18}
                                    fontSize="11"
                                    fontWeight="700"
                                    fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                    fill="var(--text-accent-gold)"
                                    textAnchor="middle"
                                    className="uppercase tracking-wider"
                                >
                                    Asc
                                </text>
                            )}

                            {/* Value */}
                            <text
                                x={vP.x}
                                y={vP.y}
                                fontSize="12"
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fontWeight="600"
                                fill={vColor}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {v}
                            </text>


                            {/* Sign Number */}
                            <text
                                x={sP.x}
                                y={sP.y}
                                fontSize="12"
                                fontWeight="500"
                                fontFamily={TYPOGRAPHY.svgSignNumber.fontFamily}
                                fill={sColor}
                                textAnchor="middle"
                                dominantBaseline="middle"
                            >
                                {signIdx + 1}
                            </text>
                        </g>
                    );
                })}
            </svg>


        </div>
    );
}
