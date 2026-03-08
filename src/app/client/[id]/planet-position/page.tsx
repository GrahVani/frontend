"use client";

import React from 'react';
import PlanetaryTable, { PlanetaryInfo } from "@/components/astrology/PlanetaryTable";
import { Info, Sparkles } from 'lucide-react';

export default function PlanetPositionPage() {

    const mockPlanetaryData: PlanetaryInfo[] = [
        { planet: 'Ascendant', sign: 'Cancer', degree: '14°32\'', nakshatra: 'Pushya', nakshatraPart: 2, house: 1 },
        { planet: 'Sun', sign: 'Leo', degree: '05°12\'', nakshatra: 'Magha', nakshatraPart: 1, house: 2 },
        { planet: 'Moon', sign: 'Leo', degree: '10°45\'', nakshatra: 'Magha', nakshatraPart: 3, house: 2 },
        { planet: 'Mars', sign: 'Leo', degree: '22°18\'', nakshatra: 'P.Phalguni', nakshatraPart: 2, house: 2 },
        { planet: 'Mercury', sign: 'Virgo', degree: '02°10\'', nakshatra: 'U.Phalguni', nakshatraPart: 3, house: 3 },
        { planet: 'Jupiter', sign: 'Cancer', degree: '12°35\'', nakshatra: 'Pushya', nakshatraPart: 1, house: 1 },
        { planet: 'Venus', sign: 'Virgo', degree: '18°22\'', nakshatra: 'Hasta', nakshatraPart: 1, house: 3 },
        { planet: 'Saturn', sign: 'Aquarius', degree: '29°05\'', nakshatra: 'P.Bhadra', nakshatraPart: 4, house: 8, isRetro: true },
        { planet: 'Rahu', sign: 'Scorpio', degree: '15°00\'', nakshatra: 'Anuradha', nakshatraPart: 2, house: 5, isRetro: true },
        { planet: 'Ketu', sign: 'Taurus', degree: '15°00\'', nakshatra: 'Rohini', nakshatraPart: 4, house: 11, isRetro: true },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Card */}
            <div
                className="rounded-lg p-6 shadow-sm relative overflow-hidden border border-gold-primary/20 bg-header-gradient"
            >
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Sparkles className="w-5 h-5 text-gold-dark" />
                    <h1 className="font-serif text-[24px] font-bold text-softwhite">Planetary Positions</h1>
                </div>
                <p className="text-softwhite/80 font-serif italic text-[14px] max-w-2xl relative z-10">
                    Detailed analysis of celestial bodies at the moment of birth. The specific nakshatra, pada, and degrees determine the unique strength and manifestation of each planet.
                </p>
            </div>

            {/* Planetary Table */}
            <div className="shadow-sm">
                <PlanetaryTable planets={mockPlanetaryData} className="border-0 shadow-none rounded-b-none" />
            </div>

            {/* Bottom Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Shadbala Strength */}
                <div className="prem-card rounded-lg p-6">
                    <h3 className="font-serif text-[18px] font-bold text-ink mb-6">Planetary Strength (Shadbala)</h3>

                    <div className="space-y-4">
                        <StrengthBar label="SUN" value={75} />
                        <StrengthBar label="MOON" value={75} />
                        <StrengthBar label="MARS" value={75} />
                        <StrengthBar label="MERCURY" value={60} />
                    </div>

                    <p className="mt-6 text-[10px] text-ink/45 italic font-serif">
                        * Shadbala analysis provides a mathematical score for planetary potency.
                    </p>
                </div>

                {/* Retrograde Note */}
                <div className="bg-gold-primary/10 prem-card rounded-lg p-6 flex gap-4">
                    <div className="shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full border border-gold-dark flex items-center justify-center text-gold-dark bg-transparent">
                            <Info className="w-3 h-3" />
                        </div>
                    </div>
                    <div>
                        <h4 className="font-serif text-[14px] font-bold text-ink uppercase tracking-wider mb-2">Note on Retrogrades</h4>
                        <p className="text-ink/45 text-[14px] font-serif leading-relaxed">
                            Planets marked with <span className="text-red-600 font-bold">(R)</span> are in retrograde motion. In Vedic astrology, retrograde planets are considered strong as they are closer to Earth, often bringing deep-seated traits or karmic requirements to the surface.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}

function StrengthBar({ label, value }: { label: string; value: number }) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[12px] font-bold font-serif tracking-widest text-body">
                <span>{label}</span>
                <span>{value}%</span>
            </div>
            <div className="h-2 w-full bg-gold-primary/15 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gold-dark rounded-full"
                    style={{ width: `${value}%` }}
                />
            </div>
        </div>
    );
}
