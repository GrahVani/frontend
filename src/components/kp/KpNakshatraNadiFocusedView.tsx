"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpNakshatraNadiResponse } from '@/types/kp.types';
import { Sparkles, Compass, Star, Moon, Sun, CircleDot } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_COLORS } from '@/design-tokens/colors';
import { KnowledgeTooltip } from '@/components/knowledge';

const PLANET_DATA: Record<string, { symbol: string; color: string; element: string }> = Object.fromEntries(
    Object.entries(PLANET_COLORS).map(([name, c]) => [name, {
        symbol: c.symbol, color: c.gradient, element: c.element,
    }])
);

const ZODIAC_DATA: Record<string, { symbol: string; element: string; quality: string }> = {
    'Aries': { symbol: '♈', element: 'Fire', quality: 'Cardinal' },
    'Taurus': { symbol: '♉', element: 'Earth', quality: 'Fixed' },
    'Gemini': { symbol: '♊', element: 'Air', quality: 'Mutable' },
    'Cancer': { symbol: '♋', element: 'Water', quality: 'Cardinal' },
    'Leo': { symbol: '♌', element: 'Fire', quality: 'Fixed' },
    'Virgo': { symbol: '♍', element: 'Earth', quality: 'Mutable' },
    'Libra': { symbol: '♎', element: 'Air', quality: 'Cardinal' },
    'Scorpio': { symbol: '♏', element: 'Water', quality: 'Fixed' },
    'Sagittarius': { symbol: '♐', element: 'Fire', quality: 'Mutable' },
    'Capricorn': { symbol: '♑', element: 'Earth', quality: 'Cardinal' },
    'Aquarius': { symbol: '♒', element: 'Air', quality: 'Fixed' },
    'Pisces': { symbol: '♓', element: 'Water', quality: 'Mutable' },
};

const NAKSHATRA_MEANINGS: Record<string, string> = {
    'Ashwini': 'Swift healing, new beginnings',
    'Bharani': 'Transformation, restraint',
    'Krittika': 'Purification, cutting ties',
    'Rohini': 'Growth, beauty, fertility',
    'Mrigashira': 'Searching, exploration',
    'Ardra': 'Storms, breakthroughs',
    'Punarvasu': 'Return, renewal',
    'Pushya': 'Nourishment, prosperity',
    'Ashlesha': 'Clinging, intensity',
    'Magha': 'Ancestors, authority',
    'Purva Phalguni': 'Pleasure, creativity',
    'Uttara Phalguni': 'Contracts, unions',
    'Hasta': 'Skill, craftsmanship',
    'Chitra': 'Brilliance, design',
    'Swati': 'Independence, movement',
    'Vishakha': 'Determination, goals',
    'Anuradha': 'Devotion, friendship',
    'Jyeshtha': 'Seniority, protection',
    'Mula': 'Roots, destruction',
    'Purva Ashadha': 'Invincibility, water',
    'Uttara Ashadha': 'Final victory',
    'Shravana': 'Learning, listening',
    'Dhanishta': 'Wealth, music',
    'Shatabhisha': 'Hundred healers',
    'Purva Bhadrapada': 'Scorching, purification',
    'Uttara Bhadrapada': 'Warrior, depths',
    'Revati': 'Wealth, safe passage',
};

interface NadiItem {
    name?: string;
    label?: string;
    sign: string;
    longitude: string;
    nakshatraName: string;
    nakshatraLord: string;
    subLord: string;
    isRetro?: boolean;
}

interface KpNakshatraNadiFocusedViewProps {
    data: KpNakshatraNadiResponse;
    className?: string;
}

export const KpNakshatraNadiFocusedView: React.FC<KpNakshatraNadiFocusedViewProps> = ({ data, className }) => {
    const [activeTab, setActiveTab] = useState<'planets' | 'cusps'>('planets');
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const { nadiData } = data;

    const normalize = (val: string) => val?.trim() || '';

    const planets = useMemo((): NadiItem[] => {
        if (!nadiData?.planets) return [];
        return (Array.isArray(nadiData.planets) ? nadiData.planets : Object.values(nadiData.planets)) as NadiItem[];
    }, [nadiData]);

    const cusps = useMemo((): NadiItem[] => {
        if (!nadiData?.cusps) return [];
        return (Array.isArray(nadiData.cusps) ? nadiData.cusps : Object.values(nadiData.cusps)) as NadiItem[];
    }, [nadiData]);

    const selectedDetails = useMemo((): NadiItem | null => {
        if (!selectedItem) return null;
        if (activeTab === 'planets') {
            return (planets.find((p: NadiItem) => normalize(p.name || '') === normalize(selectedItem)) as NadiItem) || null;
        }
        return (cusps.find((c: NadiItem) => normalize(c.label || '') === normalize(selectedItem)) as NadiItem) || null;
    }, [selectedItem, activeTab, planets, cusps]);

    if (!nadiData) {
        return <div className="p-8 text-center bg-white rounded-xl text-primary text-[14px] font-medium">Loading nadi data...</div>;
    }

    const TabButton = ({ id, label, icon: Icon }: { id: 'planets' | 'cusps', label: string, icon: React.ComponentType<{ className?: string }> }) => (
        <button
            onClick={() => { setActiveTab(id); setSelectedItem(null); }}
            className={cn(
                "flex items-center gap-2 px-6 py-3 tracking-wide transition-all border-b-2",
                activeTab === id
                    ? "border-gold-primary text-gold-dark bg-gold-soft/10"
                    : "border-transparent text-primary hover:text-primary hover:bg-gold-primary/5"
            )}
        >
            <Icon className="w-4 h-4" />
            <span className="text-[14px] font-semibold">{label}</span>
        </button>
    );

    return (
        <div className={cn("space-y-0 animate-in fade-in duration-500", className)}>
            {/* Header Tabs */}
            <div className="flex items-center border-b border-amber-200/50 bg-amber-50/60 rounded-t-xl overflow-hidden">
                <TabButton id="planets" label="Planetary nadi" icon={Sparkles} />
                <TabButton id="cusps" label="Cuspal nadi (bhavas)" icon={Compass} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Left - Selection Grid */}
                <div className="lg:col-span-2 bg-white border-r border-amber-200/50 p-5">
                    {activeTab === 'planets' ? (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {planets.map((planet: NadiItem) => {
                                const name = normalize(planet.name || '');
                                const pData = PLANET_DATA[name] || { symbol: '☉', color: 'from-gray-400 to-gray-500', element: 'Unknown' };
                                const isSelected = selectedItem === planet.name;
                                return (
                                    <button
                                        key={planet.name || name}
                                        onClick={() => setSelectedItem(planet.name || name)}
                                        className={cn(
                                            "relative p-4 rounded-xl transition-all duration-300 border-2 text-center group",
                                            isSelected
                                                ? "border-amber-500 bg-amber-50 shadow-lg scale-105"
                                                : "border-amber-200/60 bg-amber-50/30 hover:border-amber-400/60 hover:shadow-md"
                                        )}
                                    >
                                        {planet.isRetro && (
                                            <span className="absolute top-1 right-1 text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-semibold">R</span>
                                        )}
                                        <div className={cn(
                                            "w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-[24px] text-white shadow-lg bg-gradient-to-br",
                                            pData.color
                                        )}>
                                            {pData.symbol}
                                        </div>
                                        <span className="font-semibold text-amber-900 text-[14px]">{planet.name}</span>
                                        <span className="block text-[11px] text-amber-700/70 mt-1 font-medium">{planet.sign || 'Unknown'}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {cusps.map((cusp: NadiItem) => {
                                const signName = normalize(cusp.sign);
                                const signData = ZODIAC_DATA[signName] || { symbol: '♈', element: 'Fire', quality: 'Cardinal' };
                                const isSelected = selectedItem === cusp.label;
                                const cuspNum = (cusp.label || '').replace('Cusp ', '').replace('C', '');
                                return (
                                    <button
                                        key={cusp.label || `cusp-${cuspNum}`}
                                        onClick={() => setSelectedItem(cusp.label || '')}
                                        className={cn(
                                            "relative p-3 rounded-xl transition-all duration-300 border-2 text-center",
                                            isSelected
                                                ? "border-amber-500 bg-amber-50 shadow-lg scale-105"
                                                : "border-amber-200/60 bg-amber-50/30 hover:border-amber-400/60 hover:shadow-md"
                                        )}
                                    >
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-amber-50 to-white/80 shadow-sm border border-amber-200/60 flex items-center justify-center text-amber-900 font-semibold">
                                            <span className="text-[14px]">{cuspNum}</span>
                                        </div>
                                        <span className="font-semibold text-amber-900 text-[12px]">{signData.symbol} {cusp.sign}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-4">
                        <div className="bg-amber-50/60 rounded-xl p-4 text-center border border-amber-200/60 border-b-4 shadow-sm flex flex-col items-center justify-center">
                            <Sun className="w-6 h-6 text-amber-700 mb-2" />
                            <span className="text-[28px] font-semibold text-amber-900 leading-none mb-1">{planets.length}</span>
                            <span className="text-[11px] text-amber-700 uppercase tracking-widest font-medium">Grahas</span>
                        </div>
                        <div className="bg-amber-50/60 rounded-xl p-4 text-center border border-amber-200/60 border-b-4 shadow-sm flex flex-col items-center justify-center">
                            <CircleDot className="w-6 h-6 text-amber-600/80 mb-2" />
                            <span className="text-[28px] font-semibold text-amber-900 leading-none mb-1">{cusps.length}</span>
                            <span className="text-[11px] text-amber-700 uppercase tracking-widest font-medium">Bhavas</span>
                        </div>
                        <div className="bg-amber-50/60 rounded-xl p-4 text-center border border-amber-200/60 border-b-4 shadow-sm flex flex-col items-center justify-center">
                            <Star className="w-6 h-6 text-amber-700/80 mb-2" />
                            <span className="text-[28px] font-semibold text-amber-900 leading-none mb-1">27</span>
                            <span className="text-[11px] text-amber-700 uppercase tracking-widest font-medium">
                                <KnowledgeTooltip term="nakshatra">Nakshatras</KnowledgeTooltip>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right - Detail Panel */}
                <div className="bg-amber-50/60 p-5 min-h-[400px] border-l border-amber-200/50">
                    {selectedDetails ? (
                        <div key={selectedItem} className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Header */}
                            <div className="text-center">
                                {activeTab === 'planets' ? (
                                    <>
                                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-amber-50 shadow-xl border border-amber-200/60 flex items-center justify-center text-[30px] text-amber-900 font-semibold">
                                            {PLANET_DATA[normalize(selectedDetails.name || '')]?.symbol || '☉'}
                                        </div>
                                        <h2 className="text-[24px] font-semibold text-amber-900 mb-1">{selectedDetails.name}</h2>
                                        {selectedDetails.isRetro && (
                                            <span className="inline-block mt-1 text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">Retrograde</span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 shadow-xl border border-amber-800/30 flex items-center justify-center text-[30px] text-white font-semibold">
                                            <span>{(selectedDetails.label || '').replace('Cusp ', '').replace('C', '')}</span>
                                        </div>
                                        <h2 className="text-[24px] font-semibold text-amber-900">{selectedDetails.label}</h2>
                                    </>
                                )}
                            </div>

                            {/* Position Card */}
                            <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-sm">
                                <h4 className="text-[11px] uppercase tracking-wider text-amber-700/60 font-medium mb-3">Position</h4>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-[28px]">{ZODIAC_DATA[normalize(selectedDetails.sign)]?.symbol || '♈'}</span>
                                        <span className="text-[20px] text-amber-900 font-medium">{selectedDetails.sign}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[18px] text-amber-900 font-medium">{selectedDetails.longitude}</span>
                                        <span className="block text-[11px] text-amber-700/60 font-medium">{ZODIAC_DATA[normalize(selectedDetails.sign)]?.element || 'Unknown'} · {ZODIAC_DATA[normalize(selectedDetails.sign)]?.quality || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nakshatra Details */}
                            <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-sm">
                                <h4 className="text-[11px] uppercase tracking-wider text-amber-700/60 font-medium mb-3">
                                    <KnowledgeTooltip term="nakshatra">Nakshatra</KnowledgeTooltip> (Star)
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md shrink-0">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className="text-[18px] text-amber-900 font-medium">{selectedDetails.nakshatraName}</span>
                                        <span className="block text-[14px] text-amber-800/70 font-medium">Lord: <span className="text-amber-900 font-semibold">{selectedDetails.nakshatraLord}</span></span>
                                    </div>
                                </div>
                                {NAKSHATRA_MEANINGS[normalize(selectedDetails.nakshatraName)] && (
                                    <p className="mt-3 text-[13px] text-amber-800/70 bg-amber-50/50 p-2.5 rounded-lg italic font-medium">
                                        "{NAKSHATRA_MEANINGS[normalize(selectedDetails.nakshatraName)]}"
                                    </p>
                                )}
                            </div>

                            {/* Sub Lord */}
                            <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-4 text-white shadow-md border border-amber-800/30">
                                <h4 className="text-[11px] text-white/90 uppercase tracking-widest font-medium mb-2">
                                    <KnowledgeTooltip term="sub_lord" unstyled>Sub lord</KnowledgeTooltip> (key signifier)
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-[24px] shadow-inner text-white shrink-0">
                                        {PLANET_DATA[normalize(selectedDetails.subLord)]?.symbol || '☉'}
                                    </div>
                                    <div>
                                        <span className="text-[24px] tracking-wide text-white font-semibold">{selectedDetails.subLord}</span>
                                        <span className="block text-[12px] text-white/80 mt-0.5 font-medium">Determines fine timing & results</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lord Chain Summary */}
                            <div className="bg-white rounded-xl p-4 border border-amber-200/60 shadow-sm">
                                <h4 className="text-[11px] uppercase tracking-wider text-amber-700/60 font-medium mb-3">Stellar chain</h4>
                                <div className="flex items-center justify-between text-center">
                                    <div className="flex-1">
                                        <span className="text-[20px]">{ZODIAC_DATA[normalize(selectedDetails.sign)]?.symbol || '♈'}</span>
                                        <span className="block text-[10px] text-amber-700/60 font-medium mt-0.5">Sign</span>
                                    </div>
                                    <span className="text-gold-primary/40 text-[14px]">→</span>
                                    <div className="flex-1">
                                        <span className="text-[20px]">{PLANET_DATA[normalize(selectedDetails.nakshatraLord)]?.symbol || '☉'}</span>
                                        <span className="block text-[10px] text-amber-700/60 font-medium mt-0.5">
                                            <KnowledgeTooltip term="star_lord">Star lord</KnowledgeTooltip>
                                        </span>
                                    </div>
                                    <span className="text-gold-primary/40 text-[14px]">→</span>
                                    <div className="flex-1 bg-gold-primary/10 rounded-lg py-1">
                                        <span className="text-[20px]">{PLANET_DATA[normalize(selectedDetails.subLord)]?.symbol || '☉'}</span>
                                        <span className="block text-[10px] text-amber-800 font-semibold mt-0.5">
                                            <KnowledgeTooltip term="sub_lord" unstyled>Sub lord</KnowledgeTooltip>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-amber-900">
                            <Moon className="w-16 h-16 mb-4 opacity-40" />
                            <p className="font-serif text-[18px] text-amber-900 font-medium">Select a {activeTab === 'planets' ? 'planet' : 'cusp'}</p>
                            <p className="text-[14px] font-sans mt-1 text-amber-800/70 font-medium">to view detailed Nadi information</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-amber-50/40 p-3 text-center border-t border-amber-200/40 text-[13px] text-amber-900 rounded-b-xl font-medium">
                <Star className="w-3.5 h-3.5 inline-block mr-1 text-amber-700" />
                <span className="font-semibold">
                    <KnowledgeTooltip term="kp_nakshatra_nadi">Nakshatra nadi</KnowledgeTooltip> system
                </span>: <KnowledgeTooltip term="star_lord">Star lords</KnowledgeTooltip> reveal the source, <KnowledgeTooltip term="sub_lord">Sub lords</KnowledgeTooltip> determine the result.
            </div>
        </div >
    );
};

export default KpNakshatraNadiFocusedView;
