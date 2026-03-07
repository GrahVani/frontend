import React from 'react';
import { ChartWithPopup } from '../astrology/NorthIndianChart';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';

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

export default function ChartAlignmentPanel({ chartData }: ChartAlignmentPanelProps) {
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
        <div className={cn("flex flex-col border border-antique shrink-0 overflow-hidden rounded-3xl bg-white/20", COLORS.wbContainer)}>
            {/* Standard Gochar-style Header */}
            <div className={cn("flex items-center justify-between px-4 py-2 h-11 shrink-0", COLORS.wbSectionHeader)}>
                <h3 className={cn(TYPOGRAPHY.sectionTitle)}>Horoscope projection</h3>
                <div className="px-2 py-0.5 bg-header-border/10 rounded border border-header-border/20">
                    <span className={cn(TYPOGRAPHY.label, "text-primary !mb-0")}>Natal</span>
                </div>
            </div>

            <div className="p-6 flex flex-col gap-4">
                <div className="relative aspect-square w-full max-w-[320px] mx-auto">
                    {/* Subtle aura matches Gochar style */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] pointer-events-none bg-amber-400/5" />

                    <ChartWithPopup
                        planets={planets}
                        ascendantSign={ascendantSign}
                        className="w-full h-full"
                        showDegrees={true}
                    />
                </div>

                <div className="space-y-3">
                    {highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-3 border border-gold-primary/30 rounded-xl p-3 bg-gold-primary/5">
                            <div className="w-2 h-2 rounded-full bg-gold-primary" />
                            <p className="text-[12px] font-bold text-ink">{h}</p>
                        </div>
                    ))}
                    {clusters.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 border border-indigo-500/20 rounded-xl p-3 bg-indigo-500/5">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                            <p className="text-[12px] font-bold text-ink">{c}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center pt-2">
                    <p className="text-[9px] uppercase tracking-widest font-black text-amber-900/40">Karmic Focus Area</p>
                    <p className="text-[11px] mt-1 text-ink font-semibold opacity-70">Synthesized planetary alignment reflecting life purpose.</p>
                </div>
            </div>

            <style jsx global>{`
                svg g[stroke="var(--header-border)"] {
                    stroke: #B45309; /* Amber 700 */
                    stroke-opacity: 0.4;
                    stroke-width: 1.2;
                }
                svg text {
                    font-size: 16px !important;
                    font-weight: 600 !important;
                }
            `}</style>
        </div>
    );
}

// Helpers
function getSignId(signName: string): number {
    const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    return signs.indexOf(signName) + 1;
}

function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
