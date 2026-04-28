"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpPromise } from '@/types/kp.types';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { ZODIAC_SIGNS } from '@/lib/chart-geometry';
import { KnowledgeTooltip } from '@/components/knowledge';

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_NAMES = ZODIAC_SIGNS;

const HOUSE_SIGNIFICATIONS: Record<number, { topic: string; keywords: string[] }> = {
    1: { topic: 'Self & Personality', keywords: ['Health', 'Body', 'Appearance', 'Vitality'] },
    2: { topic: 'Wealth & Family', keywords: ['Money', 'Speech', 'Food', 'Family'] },
    3: { topic: 'Siblings & Courage', keywords: ['Efforts', 'Travel', 'Skills', 'Comm'] },
    4: { topic: 'Home & Mother', keywords: ['Property', 'Vehicles', 'Peace', 'Edu'] },
    5: { topic: 'Children & Creativity', keywords: ['Love', 'Speculation', 'Intel', 'Mantras'] },
    6: { topic: 'Enemies & Health', keywords: ['Diseases', 'Debts', 'Competition', 'Service'] },
    7: { topic: 'Partnership & Marriage', keywords: ['Spouse', 'Business', 'Contracts', 'Foreign'] },
    8: { topic: 'Transformation', keywords: ['Longevity', 'Occult', 'Inheritance', 'Sudden'] },
    9: { topic: 'Fortune & Dharma', keywords: ['Luck', 'Father', 'Guru', 'Journeys'] },
    10: { topic: 'Career & Status', keywords: ['Profession', 'Fame', 'Authority', 'Govt'] },
    11: { topic: 'Gains & Aspirations', keywords: ['Income', 'Friends', 'Siblings', 'Desires'] },
    12: { topic: 'Liberation & Loss', keywords: ['Expenses', 'Foreign', 'Moksha', 'Hospitals'] }
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

interface KpAdvancedSslViewProps {
    promises: KpPromise[];
    cusps?: CuspData[];
    className?: string;
}

export const KpAdvancedSslView: React.FC<KpAdvancedSslViewProps> = ({
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

    const analysis = useMemo(() => {
        if (!currentPromise) return null;
        const positiveCount = currentPromise.positiveHouses?.length || 0;
        const negativeCount = currentPromise.negativeHouses?.length || 0;
        const totalInvolved = positiveCount + negativeCount;
        const positiveRatio = totalInvolved > 0 ? (positiveCount / totalInvolved) * 100 : 50;

        let promiseLevel = 'Neutral';
        let promiseColor = 'text-primary';
        if (positiveRatio >= 70) { promiseLevel = 'Very Strong'; promiseColor = 'text-emerald-600'; }
        else if (positiveRatio >= 50) { promiseLevel = 'Strong'; promiseColor = 'text-emerald-500'; }
        else if (positiveRatio >= 30) { promiseLevel = 'Moderate'; promiseColor = 'text-amber-500'; }
        else if (positiveRatio > 0) { promiseLevel = 'Weak'; promiseColor = 'text-orange-500'; }
        else if (negativeCount > 0) { promiseLevel = 'Denied'; promiseColor = 'text-rose-500'; }

        return { positiveCount, negativeCount, totalInvolved, positiveRatio, promiseLevel, promiseColor };
    }, [currentPromise]);

    const signName = currentCuspInfo?.sign || ZODIAC_NAMES[(currentCuspInfo?.signId || 1) - 1] || 'Aries';
    const degreeDisplay = currentCuspInfo?.degreeFormatted || `${(currentCuspInfo?.degree || 0).toFixed(2)}°`;
    const houseInfo = HOUSE_SIGNIFICATIONS[selectedCusp];

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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Left Panel — SSL Chain */}
                <div className="xl:col-span-2 bg-white rounded-xl p-5 border border-amber-200/60 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <h3 className={cn(TYPOGRAPHY.label, "text-[12px] uppercase tracking-wider")}>
                                <KnowledgeTooltip term="sub_sub_lord">Sub-sub lord</KnowledgeTooltip> analysis
                            </h3>
                            <p className="text-[11px] text-primary/60 mt-0.5 font-medium">Final confirmation of house promise</p>
                        </div>
                        <span className="px-2.5 py-1 bg-amber-50 rounded border border-amber-200/60 text-[12px] text-amber-900 font-medium uppercase tracking-wide">
                            {selectedCusp}{[1, 21, 31].includes(selectedCusp) ? 'st' : [2, 22].includes(selectedCusp) ? 'nd' : [3, 23].includes(selectedCusp) ? 'rd' : 'th'} House
                        </span>
                    </div>

                    {/* House Topic + Degree */}
                    <div className="mb-5 p-4 bg-amber-50/50 rounded-xl border border-amber-200/60">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-[18px] font-semibold text-amber-900">{houseInfo?.topic}</h2>
                                <p className="text-[24px] font-light text-amber-900 mt-1">{signName} <span className="text-[18px] font-medium text-amber-800/70">{degreeDisplay}</span></p>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-end max-w-[140px]">
                                {houseInfo?.keywords.map(k => (
                                    <span key={k} className="px-2 py-0.5 bg-white rounded text-[11px] text-amber-900 font-medium border border-amber-200/60">{k}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lord Chain */}
                    {currentPromise && (
                        <div className="flex items-center justify-between">
                            {/* Sign Lord */}
                            <div className="flex-1 text-center p-3 bg-amber-50/40 rounded-lg border border-amber-200/60">
                                <span className="text-[24px] text-amber-900 block">{PLANET_SYMBOLS[currentPromise.chain.signLord.planet] || '☉'}</span>
                                <span className="block text-[10px] text-amber-700/60 uppercase tracking-wider font-medium mt-1">
                                    <KnowledgeTooltip term="sign_lord">Sign lord</KnowledgeTooltip>
                                </span>
                                <span className="text-[15px] text-amber-900 font-medium">{currentPromise.chain.signLord.planet}</span>
                            </div>

                            <div className="w-6 flex-shrink-0 flex items-center justify-center text-amber-400/60 text-[14px]">→</div>

                            {/* Star Lord */}
                            <div className="flex-1 text-center p-3 bg-amber-50/40 rounded-lg border border-amber-200/60">
                                <span className="text-[24px] text-amber-900 block">{PLANET_SYMBOLS[currentPromise.chain.starLord.planet] || '☉'}</span>
                                <span className="block text-[10px] text-amber-700/60 uppercase tracking-wider font-medium mt-1">
                                    <KnowledgeTooltip term="star_lord">Star lord</KnowledgeTooltip>
                                </span>
                                <span className="text-[15px] text-amber-900 font-medium">{currentPromise.chain.starLord.planet}</span>
                            </div>

                            <div className="w-6 flex-shrink-0 flex items-center justify-center text-amber-400/60 text-[14px]">→</div>

                            {/* Sub Lord */}
                            <div className="flex-1 text-center p-3 bg-amber-100 rounded-lg border border-amber-300/50">
                                <span className="text-[24px] text-amber-800 block">{PLANET_SYMBOLS[currentPromise.chain.subLord.planet] || '☉'}</span>
                                <span className="block text-[10px] text-amber-800 uppercase tracking-wider font-medium mt-1">
                                    <KnowledgeTooltip term="sub_lord" unstyled>Sub lord</KnowledgeTooltip>
                                </span>
                                <span className="text-[15px] text-amber-800 font-medium">{currentPromise.chain.subLord.planet}</span>
                            </div>

                            <div className="w-6 flex-shrink-0 flex items-center justify-center text-amber-900 font-semibold text-[14px]">⟹</div>

                            {/* Sub-Sub Lord */}
                            <div className="flex-1 text-center p-4 bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl shadow-md border border-amber-800/30">
                                <span className="text-[30px] text-white block mb-1">{PLANET_SYMBOLS[currentPromise.chain.subSubLord.planet] || '☉'}</span>
                                <span className="block text-[10px] text-white/90 uppercase tracking-wider font-medium mt-1">
                                    <KnowledgeTooltip term="sub_sub_lord" unstyled>Sub-sub lord</KnowledgeTooltip>
                                </span>
                                <span className="text-[18px] text-white tracking-wide font-semibold">{currentPromise.chain.subSubLord.planet}</span>
                                <span className="block text-[10px] text-white/80 mt-1 font-medium">Final confirmer</span>
                            </div>
                        </div>
                    )}

                    {/* Involved Houses */}
                    {currentPromise && (
                        <div className="mt-5 grid grid-cols-2 gap-4">
                            {/* Supporting */}
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <h4 className="text-[13px] font-semibold text-emerald-700 uppercase tracking-wide">Supporting houses</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(currentPromise.positiveHouses || []).length > 0 ? (
                                        currentPromise.positiveHouses.map((h: number) => (
                                            <div key={h} className="flex flex-col items-center">
                                                <span className="w-9 h-9 flex items-center justify-center bg-emerald-500 text-white font-medium rounded-lg shadow-sm text-[15px]">
                                                    {h}
                                                </span>
                                                <span className="text-[10px] text-emerald-600 mt-1 font-medium">{HOUSE_SIGNIFICATIONS[h]?.topic.split(' ')[0]}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-primary/30 text-[14px] font-medium">—</span>
                                    )}
                                </div>
                            </div>

                            {/* Opposing */}
                            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                    <h4 className="text-[13px] font-semibold text-rose-700 uppercase tracking-wide">Opposing houses</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(currentPromise.negativeHouses || []).length > 0 ? (
                                        currentPromise.negativeHouses.map((h: number) => (
                                            <div key={h} className="flex flex-col items-center">
                                                <span className="w-9 h-9 flex items-center justify-center bg-rose-500 text-white font-medium rounded-lg shadow-sm text-[15px]">
                                                    {h}
                                                </span>
                                                <span className="text-[10px] text-rose-600 mt-1 font-medium">{HOUSE_SIGNIFICATIONS[h]?.topic.split(' ')[0]}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-primary/30 text-[14px] font-medium">—</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel — Promise Meter */}
                <div className="bg-white rounded-xl p-5 border border-amber-200/60 shadow-sm">
                    <h3 className={cn(TYPOGRAPHY.label, "text-[12px] uppercase tracking-wider mb-5")}>Promise analysis</h3>

                    {analysis && currentPromise && (
                        <div className="space-y-5">
                            {/* Promise Meter */}
                            <div className="text-center">
                                <div className="relative w-36 h-36 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" className="fill-none stroke-surface-warm" strokeWidth="8" />
                                        <circle
                                            cx="50" cy="50" r="40"
                                            className={cn(
                                                "fill-none transition-all duration-1000",
                                                analysis.positiveRatio >= 50 ? "stroke-emerald-500" : "stroke-rose-500"
                                            )}
                                            strokeWidth="8"
                                            strokeDasharray={`${analysis.positiveRatio * 2.51} 251`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-[26px] font-semibold text-primary">{Math.round(analysis.positiveRatio)}%</span>
                                        <span className="text-[11px] text-primary/60 font-medium">Positive</span>
                                    </div>
                                </div>
                                <div className={cn("text-[18px] font-semibold", analysis.promiseColor)}>
                                    {analysis.promiseLevel}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 bg-emerald-50/80 rounded-lg border border-emerald-200/50 shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                    <span className="text-[22px] font-semibold text-emerald-700">{analysis.positiveCount}</span>
                                    <span className="text-[11px] text-emerald-600 block font-medium uppercase tracking-wider mt-0.5">Favorable</span>
                                </div>
                                <div className="text-center p-3 bg-rose-50/80 rounded-lg border border-rose-200/50 shadow-sm">
                                    <TrendingDown className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                                    <span className="text-[22px] font-semibold text-rose-700">{analysis.negativeCount}</span>
                                    <span className="text-[11px] text-rose-600 block font-medium uppercase tracking-wider mt-0.5">Adverse</span>
                                </div>
                            </div>

                            {/* SSL Verdict */}
                            <div className="p-4 bg-gradient-to-br from-amber-50 to-white/80 border border-amber-200/60 rounded-xl text-center shadow-sm">
                                <AlertCircle className="w-6 h-6 text-amber-700 mx-auto mb-2" />
                                <h4 className="text-[11px] text-amber-900 uppercase tracking-wider font-semibold">
                                    <KnowledgeTooltip term="sub_sub_lord">SSL</KnowledgeTooltip> verdict
                                </h4>
                                <p className="text-amber-900 mt-2 text-[14px] leading-relaxed font-medium">
                                    <span className="font-semibold font-serif">{currentPromise.chain.subSubLord.planet}</span> as SSL
                                    {analysis.positiveRatio >= 50
                                        ? <span className="text-emerald-600 font-semibold"> confirms</span>
                                        : <span className="text-rose-600 font-semibold"> denies</span>
                                    } the promise for <span className="font-semibold text-primary">{houseInfo?.topic.toLowerCase()}</span>.
                                </p>
                            </div>
                        </div>
                    )}

                    {!currentPromise && (
                        <div className="text-center py-8 text-primary">
                            <Minus className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-[14px] font-medium">No SSL data for House {selectedCusp}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Interpretation Footer */}
            {currentPromise && analysis && (
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200/60">
                    <p className="text-[14px] text-primary text-center font-medium">
                        <span className="inline-block px-2 py-0.5 bg-amber-100 border border-amber-300 rounded text-[11px] text-amber-800 font-semibold uppercase tracking-wide mr-2">Focus</span>
                        For <span className="font-semibold">{houseInfo?.topic}</span>, the <KnowledgeTooltip term="sub_sub_lord">Sub-Sub Lord</KnowledgeTooltip>{' '}
                        <span className="font-semibold text-primary">{currentPromise.chain.subSubLord.planet}</span> signifies
                        {(currentPromise.positiveHouses || []).length > 0 && (
                            <> houses <span className="text-emerald-600 font-semibold">{currentPromise.positiveHouses.join(', ')}</span> (supporting)</>
                        )}
                        {(currentPromise.positiveHouses || []).length > 0 && (currentPromise.negativeHouses || []).length > 0 && ' and '}
                        {(currentPromise.negativeHouses || []).length > 0 && (
                            <> houses <span className="text-rose-600 font-semibold">{currentPromise.negativeHouses.join(', ')}</span> (opposing)</>
                        )}
                        . Overall promise is <span className={cn("font-semibold", analysis.promiseColor)}>{analysis.promiseLevel.toUpperCase()}</span>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default KpAdvancedSslView;
