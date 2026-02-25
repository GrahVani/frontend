"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpPromise } from '@/types/kp.types';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Zodiac symbols for cusp selector
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_NAMES = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

// House significations for astrological interpretation
const HOUSE_SIGNIFICATIONS: Record<number, { topic: string; keywords: string[] }> = {
    1: { topic: 'Self & Personality', keywords: ['Health', 'Body', 'Appearance', 'Vitality'] },
    2: { topic: 'Wealth & Family', keywords: ['Money', 'Speech', 'Food', 'Family Values'] },
    3: { topic: 'Siblings & Courage', keywords: ['Efforts', 'Short Travel', 'Skills', 'Communication'] },
    4: { topic: 'Home & Mother', keywords: ['Property', 'Vehicles', 'Peace', 'Education'] },
    5: { topic: 'Children & Creativity', keywords: ['Love', 'Speculation', 'Intelligence', 'Mantras'] },
    6: { topic: 'Enemies & Health', keywords: ['Diseases', 'Debts', 'Competition', 'Service'] },
    7: { topic: 'Partnership & Marriage', keywords: ['Spouse', 'Business', 'Contracts', 'Foreign'] },
    8: { topic: 'Transformation', keywords: ['Longevity', 'Occult', 'Inheritance', 'Sudden Events'] },
    9: { topic: 'Fortune & Dharma', keywords: ['Luck', 'Father', 'Guru', 'Long Journeys'] },
    10: { topic: 'Career & Status', keywords: ['Profession', 'Fame', 'Authority', 'Government'] },
    11: { topic: 'Gains & Aspirations', keywords: ['Income', 'Friends', 'Elder Siblings', 'Desires'] },
    12: { topic: 'Liberation & Loss', keywords: ['Expenses', 'Foreign', 'Moksha', 'Hospitals'] }
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

    // Get current cusp data
    const currentPromise = useMemo((): KpPromise | null => {
        const arr: KpPromise[] = Array.isArray(promises) ? promises : Object.values(promises || {});
        return arr.find((p) => p.houseNumber === selectedCusp) || null;
    }, [promises, selectedCusp]);

    const currentCuspInfo = useMemo(() => {
        return cusps.find(c => c.cusp === selectedCusp) || null;
    }, [cusps, selectedCusp]);

    // Compute analysis scores
    const analysis = useMemo(() => {
        if (!currentPromise) return null;
        const positiveCount = currentPromise.positiveHouses?.length || 0;
        const negativeCount = currentPromise.negativeHouses?.length || 0;
        const totalInvolved = positiveCount + negativeCount;
        const positiveRatio = totalInvolved > 0 ? (positiveCount / totalInvolved) * 100 : 50;

        // Determine promise level
        let promiseLevel = 'Neutral';
        let promiseColor = 'text-primary';
        if (positiveRatio >= 70) { promiseLevel = 'Very Strong'; promiseColor = 'text-emerald-600'; }
        else if (positiveRatio >= 50) { promiseLevel = 'Strong'; promiseColor = 'text-emerald-500'; }
        else if (positiveRatio >= 30) { promiseLevel = 'Moderate'; promiseColor = 'text-amber-500'; }
        else if (positiveRatio > 0) { promiseLevel = 'Weak'; promiseColor = 'text-orange-500'; }
        else if (negativeCount > 0) { promiseLevel = 'Denied'; promiseColor = 'text-rose-500'; }

        return { positiveCount, negativeCount, totalInvolved, positiveRatio, promiseLevel, promiseColor };
    }, [currentPromise]);

    // Get sign name and format degree
    const signName = currentCuspInfo?.sign || ZODIAC_NAMES[(currentCuspInfo?.signId || 1) - 1] || 'Aries';
    const degreeDisplay = currentCuspInfo?.degreeFormatted || `${(currentCuspInfo?.degree || 0).toFixed(2)}°`;
    const houseInfo = HOUSE_SIGNIFICATIONS[selectedCusp];

    return (
        <div className={cn("space-y-6 animate-in fade-in duration-500", className)}>
            {/* Cusp Selector */}
            <div className="flex items-center justify-center gap-1 p-2 bg-parchment rounded-xl border border-antique overflow-x-auto">
                <button className="p-2 text-primary hover:text-primary transition-colors" onClick={() => setSelectedCusp(Math.max(1, selectedCusp - 1))}>
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
                                "flex flex-col items-center justify-center min-w-[48px] h-14 rounded-lg transition-all duration-300 font-sans tracking-wide",
                                isActive
                                    ? "bg-gradient-to-br from-gold-primary to-gold-dark text-white shadow-md scale-105 ring-1 ring-gold-primary/50"
                                    : "bg-white text-primary hover:bg-parchment hover:text-primary hover:shadow-sm border border-antique shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                            )}
                        >
                            <span className="text-lg mb-0.5">{ZODIAC_SYMBOLS[signIdx] || '♈'}</span>
                            <span className="text-[10px] font-semibold">C{cusp}</span>
                        </button>
                    );
                })}
                <button className="p-2 text-primary hover:text-primary transition-colors" onClick={() => setSelectedCusp(Math.min(12, selectedCusp + 1))}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - SSL Chain Analysis */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-antique shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-sans">Sub-Sub Lord Analysis</h3>
                            <p className="text-[10px] text-primary mt-1">Final confirmation of house promise</p>
                        </div>
                        <span className="px-3 py-1.5 bg-gradient-to-br from-parchment to-softwhite text-primary border border-antique rounded-lg text-xs font-bold font-sans tracking-wide shadow-sm">
                            {selectedCusp}{[1, 21, 31].includes(selectedCusp) ? 'st' : [2, 22].includes(selectedCusp) ? 'nd' : [3, 23].includes(selectedCusp) ? 'rd' : 'th'} House
                        </span>
                    </div>

                    {/* House Topic Banner */}
                    <div className="mb-6 p-4 bg-parchment/50 rounded-xl border border-antique">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-serif font-bold text-primary">{houseInfo?.topic}</h2>
                                <p className="text-3xl font-light text-primary mt-1">{signName} <span className="text-lg">{degreeDisplay}</span></p>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-wrap gap-1 justify-end">
                                    {houseInfo?.keywords.map(k => (
                                        <span key={k} className="px-2 py-0.5 bg-white rounded text-[10px] text-primary border border-antique">{k}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lord Chain - Horizontal Flow */}
                    {currentPromise && (
                        <div className="relative">
                            <div className="flex items-center justify-between">
                                {/* Sign Lord */}
                                <div className="flex-1 text-center p-3 bg-parchment/30 rounded-lg border border-antique/50">
                                    <span className="text-2xl text-primary block">{PLANET_SYMBOLS[currentPromise.chain.signLord.planet] || '☉'}</span>
                                    <span className="text-[10px] text-primary uppercase tracking-wider block mt-1">Sign Lord</span>
                                    <span className="text-sm font-bold text-primary font-serif">{currentPromise.chain.signLord.planet}</span>
                                </div>

                                <div className="w-8 flex-shrink-0 flex items-center justify-center text-antique">→</div>

                                {/* Star Lord */}
                                <div className="flex-1 text-center p-3 bg-parchment/30 rounded-lg border border-antique/50">
                                    <span className="text-2xl text-primary block">{PLANET_SYMBOLS[currentPromise.chain.starLord.planet] || '☉'}</span>
                                    <span className="text-[10px] text-primary uppercase tracking-wider block mt-1">Star Lord</span>
                                    <span className="text-sm font-bold text-primary font-serif">{currentPromise.chain.starLord.planet}</span>
                                </div>

                                <div className="w-8 flex-shrink-0 flex items-center justify-center text-antique">→</div>

                                {/* Sub Lord */}
                                <div className="flex-1 text-center p-3 bg-gold-primary/10 rounded-lg border border-gold-primary/30">
                                    <span className="text-2xl text-gold-dark block">{PLANET_SYMBOLS[currentPromise.chain.subLord.planet] || '☉'}</span>
                                    <span className="text-[10px] text-gold-dark uppercase tracking-wider block mt-1">Sub Lord</span>
                                    <span className="text-sm font-bold text-gold-dark font-serif">{currentPromise.chain.subLord.planet}</span>
                                </div>

                                <div className="w-8 flex-shrink-0 flex items-center justify-center text-primary font-bold">⟹</div>

                                {/* Sub-Sub Lord - HIGHLIGHTED */}
                                <div className="flex-1 text-center p-4 bg-gradient-to-br from-gold-primary to-gold-dark rounded-xl shadow-md border border-gold-dark/30">
                                    <span className="text-3xl text-white block mb-1">{PLANET_SYMBOLS[currentPromise.chain.subSubLord.planet] || '☉'}</span>
                                    <span className="text-[10px] text-white/90 uppercase tracking-wider block mt-1 font-sans font-semibold">Sub-Sub Lord</span>
                                    <span className="text-lg font-bold text-white font-serif tracking-wide">{currentPromise.chain.subSubLord.planet}</span>
                                    <span className="text-[10px] text-white/80 block mt-1 font-sans">Final Confirmer</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Involved Houses Grid */}
                    {currentPromise && (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            {/* Favorable Houses */}
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider font-serif">Supporting Houses</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(currentPromise.positiveHouses || []).length > 0 ? (
                                        currentPromise.positiveHouses.map((h: number) => (
                                            <div key={h} className="flex flex-col items-center">
                                                <span className="w-10 h-10 flex items-center justify-center bg-emerald-500 text-white font-bold rounded-lg shadow-sm text-lg font-serif">
                                                    {h}
                                                </span>
                                                <span className="text-[9px] text-emerald-600 mt-1">{HOUSE_SIGNIFICATIONS[h]?.topic.split(' ')[0]}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-emerald-400 text-sm">None found</span>
                                    )}
                                </div>
                            </div>

                            {/* Adverse Houses */}
                            <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                    <h4 className="text-xs font-bold text-rose-700 uppercase tracking-wider font-serif">Opposing Houses</h4>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(currentPromise.negativeHouses || []).length > 0 ? (
                                        currentPromise.negativeHouses.map((h: number) => (
                                            <div key={h} className="flex flex-col items-center">
                                                <span className="w-10 h-10 flex items-center justify-center bg-rose-500 text-white font-bold rounded-lg shadow-sm text-lg font-serif">
                                                    {h}
                                                </span>
                                                <span className="text-[9px] text-rose-600 mt-1">{HOUSE_SIGNIFICATIONS[h]?.topic.split(' ')[0]}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-rose-400 text-sm">None found</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Promise Meter & Verdict */}
                <div className="bg-white rounded-2xl p-6 border border-antique shadow-sm">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-widest font-serif mb-6">Promise Analysis</h3>

                    {analysis && currentPromise && (
                        <div className="space-y-6">
                            {/* Promise Meter */}
                            <div className="text-center">
                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                        <circle cx="50" cy="50" r="40" className="fill-none stroke-parchment" strokeWidth="8" />
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
                                        <span className="text-2xl font-bold text-primary">{Math.round(analysis.positiveRatio)}%</span>
                                        <span className="text-[10px] text-primary">Positive</span>
                                    </div>
                                </div>
                                <div className={cn("text-lg font-bold font-serif", analysis.promiseColor)}>
                                    {analysis.promiseLevel}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="text-center p-3 bg-emerald-50/80 rounded-lg border border-emerald-200/50 shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                    <span className="text-xl font-bold text-emerald-700">{analysis.positiveCount}</span>
                                    <span className="text-[10px] text-emerald-600 block font-semibold uppercase tracking-wider mt-0.5">Favorable</span>
                                </div>
                                <div className="text-center p-3 bg-rose-50/80 rounded-lg border border-rose-200/50 shadow-sm">
                                    <TrendingDown className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                                    <span className="text-xl font-bold text-rose-700">{analysis.negativeCount}</span>
                                    <span className="text-[10px] text-rose-600 block font-semibold uppercase tracking-wider mt-0.5">Adverse</span>
                                </div>
                            </div>

                            {/* SSL Verdict */}
                            <div className="p-4 bg-gradient-to-br from-parchment to-softwhite border border-antique rounded-xl text-center shadow-sm">
                                <AlertCircle className="w-6 h-6 text-gold-dark mx-auto mb-2" />
                                <h4 className="text-[10px] text-primary uppercase tracking-wider font-semibold font-sans">SSL Verdict</h4>
                                <p className="text-primary font-sans mt-2 text-sm leading-relaxed">
                                    <span className="font-bold font-serif">{currentPromise.chain.subSubLord.planet}</span> as SSL
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
                            <p>No SSL data for House {selectedCusp}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Interpretation Footer */}
            {currentPromise && analysis && (
                <div className="bg-parchment/50 rounded-xl p-4 border border-antique">
                    <p className="text-sm text-primary text-center">
                        <span className="font-bold font-serif text-primary">🔮 Astrological Interpretation:</span>{' '}
                        For <span className="font-medium">{houseInfo?.topic}</span>, the Sub-Sub Lord <span className="font-bold text-primary">{currentPromise.chain.subSubLord.planet}</span> signifies
                        {(currentPromise.positiveHouses || []).length > 0 && (
                            <> houses <span className="text-emerald-600 font-medium">{currentPromise.positiveHouses.join(', ')}</span> (supporting)</>
                        )}
                        {(currentPromise.positiveHouses || []).length > 0 && (currentPromise.negativeHouses || []).length > 0 && ' and '}
                        {(currentPromise.negativeHouses || []).length > 0 && (
                            <> houses <span className="text-rose-600 font-medium">{currentPromise.negativeHouses.join(', ')}</span> (opposing)</>
                        )}
                        . Overall promise is <span className={cn("font-bold", analysis.promiseColor)}>{analysis.promiseLevel.toUpperCase()}</span>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default KpAdvancedSslView;
