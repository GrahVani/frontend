"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpPromise } from '@/types/kp.types';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_NAMES = ZODIAC_SIGNS;

// House topics for interpretation
const HOUSE_TOPICS: Record<number, string> = {
    1: 'Self & Personality',
    2: 'Wealth & Family',
    3: 'Siblings & Courage',
    4: 'Home & Mother',
    5: 'Children & Education',
    6: 'Health & Enemies',
    7: 'Partnership & Marriage',
    8: 'Longevity & Transformation',
    9: 'Fortune & Father',
    10: 'Career & Status',
    11: 'Gains & Friends',
    12: 'Loss & Liberation'
};

// Planet symbols
const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '☉', 'Moon': '☽', 'Mars': '♂', 'Mercury': '☿', 'Jupiter': '♃',
    'Venus': '♀', 'Saturn': '♄', 'Rahu': '☊', 'Ketu': '☋',
    'Su': '☉', 'Mo': '☽', 'Ma': '♂', 'Me': '☿', 'Ju': '♃',
    'Ve': '♀', 'Sa': '♄', 'Ra': '☊', 'Ke': '☋'
};

interface CuspData {
    cusp: number;
    sign: string;
    signId: number;
    degree?: number;
    degreeFormatted?: string;
}

interface KpFocusedCuspViewProps {
    promises: KpPromise[];
    cusps?: CuspData[];
    className?: string;
}

export const KpFocusedCuspView: React.FC<KpFocusedCuspViewProps> = ({
    promises,
    cusps = [],
    className
}) => {
    const [selectedCusp, setSelectedCusp] = useState(1);

    // Get current cusp data
    const currentPromise = useMemo((): KpPromise | null => {
        const arr: KpPromise[] = Array.isArray(promises) ? promises : Object.values(promises || {});
        return arr.find((p) => p.houseNumber === selectedCusp) || null;
    }, [promises, selectedCusp]);

    const currentCuspInfo = useMemo(() => {
        return cusps.find(c => c.cusp === selectedCusp) || null;
    }, [cusps, selectedCusp]);

    // Compute neutral houses (1-12 excluding positive and negative)
    const neutralHouses = useMemo(() => {
        if (!currentPromise) return [];
        const positive = new Set(currentPromise.positiveHouses || []);
        const negative = new Set(currentPromise.negativeHouses || []);
        return Array.from({ length: 12 }, (_, i) => i + 1)
            .filter(h => !positive.has(h) && !negative.has(h));
    }, [currentPromise]);

    // Get sign name and format degree
    const signName = currentCuspInfo?.sign || ZODIAC_NAMES[(currentCuspInfo?.signId || 1) - 1] || 'Aries';
    const degreeDisplay = currentCuspInfo?.degreeFormatted || `${(currentCuspInfo?.degree || 0).toFixed(2)}°`;

    return (
        <div className={cn("space-y-6 animate-in fade-in duration-500", className)}>
            {/* Cusp Selector */}
            <div className="flex items-center justify-center gap-1 p-2 bg-surface-warm rounded-xl border border-gold-primary/20 overflow-x-auto">
                <button className="p-2 text-ink hover:text-ink transition-colors" onClick={() => setSelectedCusp(Math.max(1, selectedCusp - 1))}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(cusp => {
                    const cuspInfo = cusps.find(c => c.cusp === cusp);
                    const signIdx = (cuspInfo?.signId || cusp) - 1;
                    const isActive = selectedCusp === cusp;
                    return (
                        <button
                            key={cusp}
                            onClick={() => setSelectedCusp(cusp)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[48px] h-14 rounded-lg transition-all duration-300",
                                TYPOGRAPHY.value,
                                isActive
                                    ? "bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-md scale-105"
                                    : "bg-white/50 text-ink hover:bg-white hover:shadow-sm border border-gold-primary/20"
                            )}
                        >
                            <span className="text-[18px]">{ZODIAC_SYMBOLS[signIdx] || '♈'}</span>
                            <span className={cn(TYPOGRAPHY.label, "text-[10px] tracking-wide")}>C{cusp}</span>
                        </button>
                    );
                })}
                <button className="p-2 text-ink hover:text-ink transition-colors" onClick={() => setSelectedCusp(Math.min(12, selectedCusp + 1))}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Panel - Focused Cusp Script */}
                <div className="bg-white rounded-2xl p-6 border border-gold-primary/20 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wide")}>Focused Cusp Script</h3>
                        <span className={cn(TYPOGRAPHY.value, "px-2 py-1 bg-surface-warm rounded border border-gold-primary/20 text-[10px] text-ink uppercase tracking-wide")}>
                            {selectedCusp}{selectedCusp === 1 ? 'st' : selectedCusp === 2 ? 'nd' : selectedCusp === 3 ? 'rd' : 'th'} House ({HOUSE_TOPICS[selectedCusp]})
                        </span>
                    </div>

                    {/* Cusp Position */}
                    <div className="mb-8">
                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[30px] tracking-tight")}>
                            {signName} <span className={cn(TYPOGRAPHY.value, "text-[24px] font-normal ml-1")}>{degreeDisplay}</span>
                        </h2>
                    </div>

                    {/* Lord Chain */}
                    {currentPromise && (
                        <div className="relative pl-8 font-sans">
                            {/* Vertical Line */}
                            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-separator to-transparent border-l border-dashed border-gold-primary/15" />

                            {/* Sign Lord */}
                            <div className="relative flex items-center gap-3 py-3">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-surface-warm border border-gold-primary/20" />
                                <span className="text-[20px] text-ink">{PLANET_SYMBOLS[currentPromise.chain.signLord.planet] || '☉'}</span>
                                <div>
                                    <span className={cn(TYPOGRAPHY.label, "text-[10px] block opacity-70 uppercase tracking-wide")}>Sign Lord</span>
                                    <span className={cn(TYPOGRAPHY.value, "text-[16px]")}>{currentPromise.chain.signLord.planet}</span>
                                    {currentPromise.chain.signLord.isRetro && <span className="text-rose-600 ml-1 text-[12px] font-medium">(R)</span>}
                                </div>
                            </div>

                            {/* Star Lord */}
                            <div className="relative flex items-center gap-3 py-3">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-surface-warm border border-gold-primary/20" />
                                <span className="text-[20px] text-ink">{PLANET_SYMBOLS[currentPromise.chain.starLord.planet] || '☉'}</span>
                                <div>
                                    <span className={cn(TYPOGRAPHY.label, "text-[10px] block opacity-70 uppercase tracking-wide")}>Star Lord</span>
                                    <span className={cn(TYPOGRAPHY.value, "text-[16px]")}>{currentPromise.chain.starLord.planet}</span>
                                    {currentPromise.chain.starLord.isRetro && <span className="text-rose-600 ml-1 text-[12px] font-medium">(R)</span>}
                                </div>
                            </div>

                            {/* Sub Lord - Highlighted */}
                            <div className="relative flex items-center gap-3 py-3 my-2">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-gold-primary border-2 border-gold-dark shadow-sm" />
                                <div className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark rounded-xl shadow-md border border-gold-dark/30 text-white">
                                    <span className="text-[24px]">{PLANET_SYMBOLS[currentPromise.chain.subLord.planet] || '☉'}</span>
                                    <div>
                                        <span className={cn(TYPOGRAPHY.label, "text-[10px] !text-white/90 block uppercase tracking-widest !font-bold")}>Sub Lord</span>
                                        <span className={cn(TYPOGRAPHY.value, "text-[18px] !text-white font-bold")}>{currentPromise.chain.subLord.planet}</span>
                                        {currentPromise.chain.subLord.isRetro && <span className="text-rose-200 ml-1 text-[12px] font-medium">(R)</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Sub-Sub Lord */}
                            <div className="relative flex items-center gap-3 py-3">
                                <div className="absolute left-[-20px] w-3 h-3 rounded-full bg-surface-warm border border-gold-primary/20" />
                                <span className="text-[20px] text-ink">{PLANET_SYMBOLS[currentPromise.chain.subSubLord.planet] || '☉'}</span>
                                <div>
                                    <span className={cn(TYPOGRAPHY.label, "text-[10px] block opacity-70 uppercase tracking-wide")}>Sub-Sub Lord</span>
                                    <span className={cn(TYPOGRAPHY.value, "text-[16px]")}>{currentPromise.chain.subSubLord.planet}</span>
                                    {currentPromise.chain.subSubLord.isRetro && <span className="text-rose-600 ml-1 text-[12px] font-medium">(R)</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {!currentPromise && (
                        <div className="text-center py-8 text-ink font-sans text-[14px]">
                            <p>No interlink data for House {selectedCusp}</p>
                        </div>
                    )}
                </div>

                {/* Right Panel - Cuspal Interlinks Promise */}
                <div className="bg-white rounded-2xl p-6 border border-gold-primary/20 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wide")}>Cuspal Interlinks Promise</h3>
                        <span className={cn(TYPOGRAPHY.value, "px-2 py-1 bg-surface-warm rounded border border-gold-primary/20 text-[10px] text-ink uppercase tracking-wide")}>
                            (CIL View)
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Favorable Links */}
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100/50 rounded-xl">
                            <h4 className={cn(TYPOGRAPHY.label, "text-[10px] !text-emerald-700 uppercase tracking-wide mb-3")}>
                                Favorable Links <span className="text-emerald-500 !font-normal ml-1 lowercase">(Fruition/Gain)</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {(currentPromise?.positiveHouses || []).length > 0 ? (
                                    currentPromise?.positiveHouses.map((h: number) => (
                                        <span key={h} className={cn(TYPOGRAPHY.value, "flex items-center justify-center w-9 h-9 bg-emerald-100 text-emerald-800 font-bold rounded-lg shadow-sm text-[14px] border border-emerald-200")}>
                                            {h}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-emerald-400 text-[14px]">None</span>
                                )}
                            </div>
                        </div>

                        {/* Adverse Links */}
                        <div className="p-4 bg-rose-50/50 border border-rose-100/50 rounded-xl">
                            <h4 className={cn(TYPOGRAPHY.label, "text-[10px] !text-rose-700 uppercase tracking-wide mb-3")}>
                                Adverse Links <span className="text-rose-400 !font-normal ml-1 lowercase">(Negation/Stress)</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {(currentPromise?.negativeHouses || []).length > 0 ? (
                                    currentPromise?.negativeHouses.map((h: number) => (
                                        <span key={h} className={cn(TYPOGRAPHY.value, "flex items-center justify-center w-9 h-9 bg-rose-100 text-rose-800 font-bold rounded-lg shadow-sm text-[14px] border border-rose-200")}>
                                            {h}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-rose-400 text-[14px]">None</span>
                                )}
                            </div>
                        </div>

                        {/* Neutral/Supporting */}
                        <div className="p-4 bg-surface-warm border border-gold-primary/20 rounded-xl">
                            <h4 className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wide mb-3")}>
                                Neutral/Supporting
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {neutralHouses.length > 0 ? (
                                    neutralHouses.map(h => (
                                        <span key={h} className={cn(TYPOGRAPHY.value, "flex items-center justify-center w-9 h-9 bg-white text-ink rounded-lg border border-gold-primary/20 shadow-sm text-[14px]")}>
                                            {h}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-ink text-[14px]">None</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Interpretation Footer */}
            {currentPromise && (
                <div className="bg-surface-warm rounded-xl p-5 border border-gold-primary/20 shadow-sm mx-auto max-w-4xl">
                    <p className={cn(TYPOGRAPHY.subValue, "text-[15px] leading-relaxed")}>
                        <span className={cn(TYPOGRAPHY.label, "text-[12px] !text-gold-dark !font-bold uppercase tracking-wide mr-2 border border-gold-soft bg-gold-soft/10 px-2 py-0.5 rounded-md")}>Interpretation Focus</span>
                        The <strong className="font-bold text-ink">{selectedCusp}{selectedCusp === 1 ? 'st' : selectedCusp === 2 ? 'nd' : selectedCusp === 3 ? 'rd' : 'th'} Cusp Sub Lord</strong> ({currentPromise.chain.subLord.planet})
                        {currentPromise.positiveHouses.length > 0 && (
                            <> strongly links to <span className="text-emerald-700 font-bold px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 mx-1">{currentPromise.positiveHouses.join(', ')}</span>, indicating <span className="text-emerald-700 font-bold">positive promise</span> for {HOUSE_TOPICS[selectedCusp]?.toLocaleLowerCase()} matters</>
                        )}
                        {currentPromise.negativeHouses.length > 0 && currentPromise.positiveHouses.length > 0 && ', but also '}
                        {currentPromise.negativeHouses.length > 0 && currentPromise.positiveHouses.length === 0 && ' links to '}
                        {currentPromise.negativeHouses.length > 0 && (
                            <><span className="text-rose-700 font-bold px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100 mx-1">{currentPromise.negativeHouses.join(', ')}</span> indicating <span className="text-rose-700 font-bold">challenges</span></>
                        )}
                        {currentPromise.positiveHouses.length === 0 && currentPromise.negativeHouses.length === 0 && (
                            <> has a <span className="text-ink font-medium">neutral influence</span> on {HOUSE_TOPICS[selectedCusp]?.toLocaleLowerCase()} matters</>
                        )}
                        .
                    </p>
                </div>
            )}
        </div>
    );
};

export default KpFocusedCuspView;
