"use client";

import React from 'react';
import NorthIndianChart from '../astrology/NorthIndianChart/NorthIndianChart';
import { cn } from "@/lib/utils";
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';

interface PlanetaryPosition {
    sign: string;
    degree: number;
    retrograde: boolean;
    house: number;
    positional_status?: string;
}

interface ChartData {
    planetary_positions: Record<string, PlanetaryPosition>;
    ascendant: { sign_number: number; sign?: string };
}

interface ChartAlignmentPanelProps {
    chartData: ChartData;
    planetaryAnalysis: Record<string, unknown>;
}

export default function ChartAlignmentPanel({ chartData, planetaryAnalysis }: ChartAlignmentPanelProps) {
    if (!chartData) return null;

    // Map planets for NorthIndianChart
    const planets = Object.entries(chartData.planetary_positions).map(([name, data]: [string, PlanetaryPosition]) => ({
        name: name.substring(0, 2), // Su, Mo, etc.
        signId: getSignId(data.sign),
        degree: `${Math.floor(data.degree)}°`,
        isRetro: data.retrograde,
        house: data.house
    }));

    const ascendantSign = chartData.ascendant.sign_number + 1;

    // Find highlights
    const highlights = [];
    if (chartData.planetary_positions.Sun?.positional_status === 'Exalted') {
        highlights.push("Exalted Sun in 1st House");
    }

    // Find clusters (houses with 3+ planets)
    const houseCounts: Record<number, number> = {};
    Object.values(chartData.planetary_positions).forEach((p: PlanetaryPosition) => {
        houseCounts[p.house] = (houseCounts[p.house] || 0) + 1;
    });

    const clusters = Object.entries(houseCounts)
        .filter(([_, count]) => count >= 3)
        .map(([house, _]) => `Significant ${getOrdinal(parseInt(house))} House Cluster`);

    return (
        <div className={cn("p-6 h-full relative overflow-hidden group rounded-3xl", "bg-[rgba(254,250,234,0.6)] border border-gold-primary/20 backdrop-blur-md")}>
            {/* Subtle Glow Effect - Adjusted for Light Theme */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-amber-500/10 transition-all duration-700" />

            <h3 className="text-[14px] font-semibold mb-6 flex items-center gap-2 text-ink">
                <span className="w-4 h-4 rounded-full flex items-center justify-center border bg-gold-primary/10 border-gold-primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                </span>
                Birth Chart & Planetary Alignments
            </h3>

            <div className="relative aspect-square w-full max-w-[320px] mx-auto">
                <NorthIndianChart
                    planets={planets}
                    ascendantSign={ascendantSign}
                    className="chart-parchment-theme"
                    showDegrees={true}
                />
            </div>

            <style jsx global>{`
                .chart-parchment-theme g[stroke="var(--header-border)"] {
                    stroke: #3E2A1F; /* Ink */
                    stroke-opacity: 0.8;
                }
                .chart-parchment-theme text {
                    fill: #3E2A1F !important;
                    font-weight: 600;
                }
                .chart-parchment-theme text[font-weight="700"] {
                    fill: #5A3E2B !important;
                }
                /* Highlight certain signs/houses */
                .chart-parchment-theme polygon[fill*="rgba(208, 140, 96"] {
                    fill: rgba(201, 162, 77, 0.1) !important;
                }
            `}</style>

            <div className="mt-8 space-y-3">
                {highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 border border-gold-primary rounded-xl p-3 bg-gold-primary/5">
                        <div className="w-2 h-2 rounded-full bg-gold-primary" />
                        <span className="text-[14px] font-medium text-ink">{h}</span>
                    </div>
                ))}
                {clusters.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 border border-indigo-500/20 rounded-xl p-3 bg-indigo-500/5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                        <span className="text-[14px] font-medium text-ink">{c}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <p className="text-[10px] uppercase tracking-widest font-bold text-ink/45">Karmic Focus Area</p>
                <p className="text-[12px] mt-1 italic text-body">"The 5th house concentration indicates high creative and intelligence merit from past lives."</p>
            </div>
        </div>
    );
}

// Helpers
function getSignId(signName: string): number {
    return (ZODIAC_SIGNS as readonly string[]).indexOf(signName) + 1;
}

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
