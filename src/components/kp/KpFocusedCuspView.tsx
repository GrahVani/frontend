"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpPromise } from '@/types/kp.types';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';
import { KnowledgeTooltip } from '@/components/knowledge';
import { ChevronRight } from 'lucide-react';

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_NAMES = ZODIAC_SIGNS;

const HOUSE_TOPICS: Record<number, string> = {
    1: 'Self', 2: 'Wealth', 3: 'Siblings', 4: 'Home',
    5: 'Children', 6: 'Health', 7: 'Marriage', 8: 'Longevity',
    9: 'Fortune', 10: 'Career', 11: 'Gains', 12: 'Loss'
};

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

    const currentPromise = useMemo((): KpPromise | null => {
        const arr: KpPromise[] = Array.isArray(promises) ? promises : Object.values(promises || {});
        return arr.find((p) => p.houseNumber === selectedCusp) || null;
    }, [promises, selectedCusp]);

    const currentCuspInfo = useMemo(() => {
        return cusps.find(c => c.cusp === selectedCusp) || null;
    }, [cusps, selectedCusp]);

    const neutralHouses = useMemo(() => {
        if (!currentPromise) return [];
        const positive = new Set(currentPromise.positiveHouses || []);
        const negative = new Set(currentPromise.negativeHouses || []);
        return Array.from({ length: 12 }, (_, i) => i + 1)
            .filter(h => !positive.has(h) && !negative.has(h));
    }, [currentPromise]);

    const signName = currentCuspInfo?.sign || ZODIAC_NAMES[(currentCuspInfo?.signId || 1) - 1] || 'Aries';
    const degreeDisplay = currentCuspInfo?.degreeFormatted || `${(currentCuspInfo?.degree || 0).toFixed(2)}°`;

    const lordChain = currentPromise ? [
        { key: 'signLord', label: 'Sign Lord', term: 'sign_lord' as const, data: currentPromise.chain.signLord },
        { key: 'starLord', label: 'Star Lord', term: 'star_lord' as const, data: currentPromise.chain.starLord },
        { key: 'subLord', label: 'Sub Lord', term: 'sub_lord' as const, data: currentPromise.chain.subLord, highlight: true },
        { key: 'subSubLord', label: 'Sub-Sub Lord', term: 'sub_sub_lord' as const, data: currentPromise.chain.subSubLord },
    ] : [];

    return (
        <div className={cn("space-y-5 animate-in fade-in duration-500", className)}>
            {/* Cusp Selector */}
            <div className="flex items-center justify-center gap-1 p-1.5 bg-amber-50/60 rounded-xl border border-amber-200/60 overflow-x-auto">
                <button className="p-1.5 text-amber-700 hover:text-amber-900 transition-colors shrink-0" onClick={() => setSelectedCusp(Math.max(1, selectedCusp - 1))}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
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
                                "flex flex-col items-center justify-center min-w-[48px] h-14 rounded-lg transition-all duration-200 shrink-0",
                                isActive
                                    ? "bg-amber-600 text-white shadow-md scale-105"
                                    : "bg-white/60 text-amber-900 hover:bg-white hover:shadow-sm border border-amber-200/60"
                            )}
                        >
                            <span className="text-[20px] leading-none">{ZODIAC_SYMBOLS[signIdx] || '♈'}</span>
                            <span className="text-[11px] font-medium mt-0.5">C{cusp}</span>
                        </button>
                    );
                })}
                <button className="p-1.5 text-amber-700 hover:text-amber-900 transition-colors shrink-0" onClick={() => setSelectedCusp(Math.min(12, selectedCusp + 1))}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Left — Cusp Script */}
                <div className="bg-white rounded-xl p-5 border border-amber-200/60 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <span className={cn(TYPOGRAPHY.label, "text-[12px] uppercase tracking-wider")}>Focused Cusp Script</span>
                        <span className="px-2.5 py-1 bg-amber-50 rounded border border-amber-200/60 text-[12px] text-amber-900 font-medium uppercase tracking-wide">
                            {selectedCusp}H · {HOUSE_TOPICS[selectedCusp]}
                        </span>
                    </div>

                    {/* Degree */}
                    <div className="flex items-baseline gap-2 mb-6">
                        <span className="text-[34px] font-serif font-bold text-amber-900 tracking-tight">{signName}</span>
                        <span className="text-[22px] text-amber-800/70 font-medium">{degreeDisplay}</span>
                    </div>

                    {/* Lord Chain — Horizontal */}
                    {currentPromise && (
                        <div className="flex flex-wrap items-center gap-1">
                            {lordChain.map((lord, idx) => (
                                <React.Fragment key={lord.key}>
                                    {idx > 0 && (
                                        <ChevronRight className="w-4 h-4 text-amber-400/60 shrink-0" />
                                    )}
                                    <div className={cn(
                                        "flex items-center gap-2.5 px-4 py-3 rounded-lg shrink-0",
                                        lord.highlight
                                            ? "bg-amber-600 text-white shadow-sm"
                                            : "bg-amber-50 border border-amber-200/60"
                                    )}>
                                        <span className={cn("text-[20px] font-serif", lord.highlight ? "text-white" : "text-amber-900")}>
                                            {PLANET_SYMBOLS[lord.data.planet] || '☉'}
                                        </span>
                                        <div>
                                            <span className={cn("block text-[11px] uppercase tracking-wider font-medium", lord.highlight ? "text-white/80" : "text-amber-700/60")}>
                                                <KnowledgeTooltip term={lord.term} unstyled>{lord.label}</KnowledgeTooltip>
                                            </span>
                                            <span className={cn("text-[15px] font-medium leading-tight", lord.highlight ? "text-white" : "text-amber-900")}>
                                                {lord.data.planet}
                                                {lord.data.isRetro && <span className={cn("ml-0.5 text-[12px]", lord.highlight ? "text-rose-200" : "text-rose-500")}>R</span>}
                                            </span>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {!currentPromise && (
                        <div className="text-center py-6 text-amber-900 text-[14px] font-medium">
                            No interlink data for House {selectedCusp}
                        </div>
                    )}
                </div>

                {/* Right — Interlinks Promise */}
                <div className="bg-white rounded-xl p-5 border border-amber-200/60 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <span className={cn(TYPOGRAPHY.label, "text-[12px] uppercase tracking-wider")}>Cuspal Interlinks Promise</span>
                        <span className="px-2.5 py-1 bg-amber-50 rounded border border-amber-200/60 text-[12px] text-amber-900 font-medium uppercase tracking-wide">CIL</span>
                    </div>

                    {currentPromise && (
                        <>
                            {/* Links Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Favorable */}
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[13px] font-semibold text-emerald-700 uppercase tracking-wide">Favorable</span>
                                        <span className="text-[12px] text-emerald-500">(gain)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(currentPromise.positiveHouses || []).length > 0 ? (
                                            currentPromise.positiveHouses.map((h: number) => (
                                                <span key={h} className="inline-flex items-center justify-center w-9 h-9 bg-emerald-50 text-emerald-700 font-medium rounded-md text-[15px] border border-emerald-200 shadow-sm">
                                                    {h}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[13px] text-amber-700/30">—</span>
                                        )}
                                    </div>
                                </div>

                                {/* Adverse */}
                                <div>
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                        <span className="text-[13px] font-semibold text-rose-700 uppercase tracking-wide">Adverse</span>
                                        <span className="text-[12px] text-rose-500">(stress)</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(currentPromise.negativeHouses || []).length > 0 ? (
                                            currentPromise.negativeHouses.map((h: number) => (
                                                <span key={h} className="inline-flex items-center justify-center w-9 h-9 bg-rose-50 text-rose-700 font-medium rounded-md text-[15px] border border-rose-200 shadow-sm">
                                                    {h}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-[13px] text-amber-700/30">—</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Neutral */}
                            {neutralHouses.length > 0 && (
                                <div className="mb-3">
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                                        <span className="text-[13px] font-semibold text-amber-900 uppercase tracking-wide">Neutral</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {neutralHouses.map(h => (
                                            <span key={h} className="inline-flex items-center justify-center w-9 h-9 bg-white text-amber-900 font-medium rounded-md text-[15px] border border-amber-200/60 shadow-sm">
                                                {h}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interpretation */}
                            <div className="pt-3 border-t border-gold-primary/10">
                                <p className="text-[15px] text-primary leading-relaxed font-medium">
                                    <span className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-300 rounded text-[12px] text-amber-800 font-semibold uppercase tracking-wide mr-1.5">Focus</span>
                                    {selectedCusp}{selectedCusp === 1 ? 'st' : selectedCusp === 2 ? 'nd' : selectedCusp === 3 ? 'rd' : 'th'} cusp
                                    {' '}<KnowledgeTooltip term="sub_lord">Sub Lord</KnowledgeTooltip> ({currentPromise.chain.subLord.planet})
                                    {currentPromise.positiveHouses.length > 0 && (
                                        <> links favorably to <span className="text-emerald-700 font-semibold">{currentPromise.positiveHouses.join(', ')}</span></>
                                    )}
                                    {currentPromise.negativeHouses.length > 0 && currentPromise.positiveHouses.length > 0 && ' and adversely to '}
                                    {currentPromise.negativeHouses.length > 0 && currentPromise.positiveHouses.length === 0 && ' links adversely to '}
                                    {currentPromise.negativeHouses.length > 0 && (
                                        <span className="text-rose-700 font-semibold">{currentPromise.negativeHouses.join(', ')}</span>
                                    )}
                                    {' '}for {HOUSE_TOPICS[selectedCusp]?.toLowerCase()}.
                                </p>
                            </div>
                        </>
                    )}

                    {!currentPromise && (
                        <div className="text-center py-6 text-amber-900 text-[14px] font-medium">
                            No interlink promise data
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KpFocusedCuspView;
