"use client";
import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { KpNakshatraNadiResponse } from '@/types/kp.types';
import { Sparkles, Compass, Star, Moon, Sun, CircleDot } from 'lucide-react';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_COLORS } from '@/design-tokens/colors';

// Planet data derived from centralized tokens
const PLANET_DATA: Record<string, { symbol: string; color: string; element: string }> = Object.fromEntries(
    Object.entries(PLANET_COLORS).map(([name, c]) => [name, {
        symbol: c.symbol, color: c.gradient, element: c.element,
    }])
);

// Zodiac data
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

// Nakshatra data with their lords and padas
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

// Common interface for planet/cusp data
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

    // Helper to normalize lookups
    const normalize = (val: string) => val?.trim() || '';

    // Get planets and cusps arrays
    const planets = useMemo((): NadiItem[] => {
        if (!nadiData?.planets) return [];
        return (Array.isArray(nadiData.planets) ? nadiData.planets : Object.values(nadiData.planets)) as NadiItem[];
    }, [nadiData]);

    const cusps = useMemo((): NadiItem[] => {
        if (!nadiData?.cusps) return [];
        return (Array.isArray(nadiData.cusps) ? nadiData.cusps : Object.values(nadiData.cusps)) as NadiItem[];
    }, [nadiData]);

    // Get selected item details
    const selectedDetails = useMemo((): NadiItem | null => {
        if (!selectedItem) return null;
        if (activeTab === 'planets') {
            return (planets.find((p: NadiItem) => normalize(p.name || '') === normalize(selectedItem)) as NadiItem) || null;
        }
        return (cusps.find((c: NadiItem) => normalize(c.label || '') === normalize(selectedItem)) as NadiItem) || null;
    }, [selectedItem, activeTab, planets, cusps]);

    if (!nadiData) {
        return <div className="p-8 text-center bg-white rounded-xl text-primary">Loading nadi data...</div>;
    }

    const TabButton = ({ id, label, icon: Icon }: { id: 'planets' | 'cusps', label: string, icon: React.ComponentType<{ className?: string }> }) => (
        <button
            onClick={() => { setActiveTab(id); setSelectedItem(null); }}
            className={cn(
                "flex items-center gap-2 px-6 py-3 tracking-wide transition-all border-b-2",
                TYPOGRAPHY.value,
                "text-sm font-semibold",
                activeTab === id
                    ? "border-gold-primary text-accent-gold bg-gold-soft/10"
                    : "border-transparent text-primary hover:text-primary hover:bg-gold-primary/5"
            )}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className={cn("space-y-0 animate-in fade-in duration-500", className)}>
            {/* Header Tabs */}
            <div className="flex items-center border-b border-antique bg-parchment/60 rounded-t-xl overflow-hidden">
                <TabButton id="planets" label="Planetary nadi" icon={Sparkles} />
                <TabButton id="cusps" label="Cuspal nadi (bhavas)" icon={Compass} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                {/* Left - Selection Grid */}
                <div className="lg:col-span-2 bg-white border-r border-antique/20 p-4">
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
                                                ? "border-gold-primary bg-gold-primary/10 shadow-lg scale-105"
                                                : "border-antique/30 bg-parchment/30 hover:border-antique hover:shadow-md"
                                        )}
                                    >
                                        {planet.isRetro && (
                                            <span className="absolute top-1 right-1 text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">R</span>
                                        )}
                                        <div className={cn(
                                            "w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-2xl text-white shadow-lg bg-gradient-to-br",
                                            pData.color
                                        )}>
                                            {pData.symbol}
                                        </div>
                                        <span className={cn(TYPOGRAPHY.value, "font-bold text-primary text-sm")}>{planet.name}</span>
                                        <span className={cn(TYPOGRAPHY.label, "block text-[10px] text-primary mt-1")}>{planet.sign || 'Unknown'}</span>
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
                                                ? "border-gold-primary bg-gold-primary/10 shadow-lg scale-105"
                                                : "border-antique/30 bg-parchment/30 hover:border-antique hover:shadow-md"
                                        )}
                                    >
                                        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-br from-parchment to-softwhite shadow-sm border border-antique flex items-center justify-center text-primary font-bold">
                                            <span className={TYPOGRAPHY.value}>{cuspNum}</span>
                                        </div>
                                        <span className={cn(TYPOGRAPHY.value, "font-semibold text-primary text-xs")}>{signData.symbol} {cusp.sign}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="mt-8 grid grid-cols-3 gap-6">
                        <div className="bg-parchment/40 rounded-xl p-4 text-center border border-antique border-b-4 shadow-sm flex flex-col items-center justify-center">
                            <Sun className="w-6 h-6 text-accent-gold mb-2" />
                            <span className={cn(TYPOGRAPHY.sectionTitle, "text-3xl leading-none mb-1")}>{planets.length}</span>
                            <span className={cn(TYPOGRAPHY.label, "text-[10px] text-primary uppercase tracking-widest")}>Grahas</span>
                        </div>
                        <div className="bg-parchment/40 rounded-xl p-4 text-center border border-antique border-b-4 shadow-sm flex flex-col items-center justify-center">
                            <CircleDot className="w-6 h-6 text-indigo-500/80 mb-2" />
                            <span className={cn(TYPOGRAPHY.sectionTitle, "text-3xl leading-none mb-1")}>{cusps.length}</span>
                            <span className={cn(TYPOGRAPHY.label, "text-[10px] text-primary uppercase tracking-widest")}>Bhavas</span>
                        </div>
                        <div className="bg-parchment/40 rounded-xl p-4 text-center border border-antique border-b-4 shadow-sm flex flex-col items-center justify-center">
                            <Star className="w-6 h-6 text-gold-dark/80 mb-2" />
                            <span className={cn(TYPOGRAPHY.sectionTitle, "text-3xl leading-none mb-1")}>27</span>
                            <span className={cn(TYPOGRAPHY.label, "text-[10px] text-primary uppercase tracking-widest")}>Nakshatras</span>
                        </div>
                    </div>
                </div>

                {/* Right - Detail Panel */}
                <div className="bg-softwhite p-6 min-h-[400px] border-l border-antique/30">
                    {selectedDetails ? (
                        <div key={selectedItem} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Header */}
                            <div className="text-center">
                                {activeTab === 'planets' ? (
                                    <>
                                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-parchment shadow-xl border border-antique flex items-center justify-center text-3xl text-primary font-bold">
                                            {PLANET_DATA[normalize(selectedDetails.name || '')]?.symbol || '☉'}
                                        </div>
                                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl mb-1")}>{selectedDetails.name}</h2>
                                        {selectedDetails.isRetro && (
                                            <span className={cn(TYPOGRAPHY.label, "inline-block mt-1 text-[10px] bg-rose-100 !text-rose-700 px-2 py-0.5 rounded-full")}>Retrograde</span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-gold-primary to-gold-dark shadow-xl border border-gold-dark/30 flex items-center justify-center text-3xl text-white font-bold">
                                            <span className={TYPOGRAPHY.value}>{(selectedDetails.label || '').replace('Cusp ', '').replace('C', '')}</span>
                                        </div>
                                        <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl")}>{selectedDetails.label}</h2>
                                    </>
                                )}
                            </div>

                            {/* Position Card */}
                            <div className="bg-white rounded-xl p-4 border border-antique shadow-sm">
                                <h4 className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wider mb-3")}>Position</h4>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl">{ZODIAC_DATA[normalize(selectedDetails.sign)]?.symbol || '♈'}</span>
                                        <span className={cn(TYPOGRAPHY.value, "text-xl text-primary")}>{selectedDetails.sign}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(TYPOGRAPHY.value, "font-mono text-lg text-primary")}>{selectedDetails.longitude}</span>
                                        <span className={cn(TYPOGRAPHY.subValue, "block text-[10px]")}>{ZODIAC_DATA[normalize(selectedDetails.sign)]?.element || 'Unknown'} • {ZODIAC_DATA[normalize(selectedDetails.sign)]?.quality || 'Unknown'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Nakshatra Details */}
                            <div className="bg-white rounded-xl p-4 border border-antique shadow-sm">
                                <h4 className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wider mb-3")}>Nakshatra (Star)</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
                                        <Star className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <span className={cn(TYPOGRAPHY.value, "text-lg text-primary")}>{selectedDetails.nakshatraName}</span>
                                        <span className={cn(TYPOGRAPHY.subValue, "block text-sm")}>Lord: <span className="text-ink font-semibold">{selectedDetails.nakshatraLord}</span></span>
                                    </div>
                                </div>
                                {NAKSHATRA_MEANINGS[normalize(selectedDetails.nakshatraName)] && (
                                    <p className={cn(TYPOGRAPHY.subValue, "mt-3 text-xs bg-parchment/50 p-2 rounded-lg italic")}>
                                        "{NAKSHATRA_MEANINGS[normalize(selectedDetails.nakshatraName)]}"
                                    </p>
                                )}
                            </div>

                            {/* Sub Lord - Highlighted */}
                            <div className="bg-gradient-to-br from-gold-primary to-gold-dark rounded-xl p-4 text-white shadow-md border border-gold-dark/30">
                                <h4 className={cn(TYPOGRAPHY.label, "text-[10px] !text-white/90 uppercase tracking-widest mb-2")}>Sub lord (key signifier)</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl shadow-inner text-white">
                                        {PLANET_DATA[normalize(selectedDetails.subLord)]?.symbol || '☉'}
                                    </div>
                                    <div>
                                        <span className={cn(TYPOGRAPHY.value, "text-2xl tracking-wide !text-white font-bold")}>{selectedDetails.subLord}</span>
                                        <span className={cn(TYPOGRAPHY.subValue, "block text-xs !text-white/80 mt-0.5")}>Determines fine timing & results</span>
                                    </div>
                                </div>
                            </div>

                            {/* Lord Chain Summary */}
                            <div className="bg-white rounded-xl p-4 border border-antique shadow-sm">
                                <h4 className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-wider mb-3")}>Stellar chain</h4>
                                <div className="flex items-center justify-between text-center">
                                    <div className="flex-1">
                                        <span className="text-lg">{ZODIAC_DATA[normalize(selectedDetails.sign)]?.symbol || '♈'}</span>
                                        <span className={cn(TYPOGRAPHY.label, "block text-[10px] opacity-60")}>Sign</span>
                                    </div>
                                    <span className="text-antique">→</span>
                                    <div className="flex-1">
                                        <span className="text-lg">{PLANET_DATA[normalize(selectedDetails.nakshatraLord)]?.symbol || '☉'}</span>
                                        <span className={cn(TYPOGRAPHY.label, "block text-[10px] opacity-60")}>Star lord</span>
                                    </div>
                                    <span className="text-antique">→</span>
                                    <div className="flex-1 bg-gold-primary/10 rounded-lg py-1">
                                        <span className="text-lg">{PLANET_DATA[normalize(selectedDetails.subLord)]?.symbol || '☉'}</span>
                                        <span className={cn(TYPOGRAPHY.label, "block text-[10px] !text-gold-dark !font-bold")}>Sub lord</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center text-primary">
                            <Moon className="w-16 h-16 mb-4 opacity-40" />
                            <p className="font-serif text-lg text-primary">Select a {activeTab === 'planets' ? 'planet' : 'cusp'}</p>
                            <p className="text-sm font-sans mt-1">to view detailed Nadi information</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-parchment/30 p-3 text-center border-t border-antique/10 text-xs text-primary rounded-b-xl">
                <Star className="w-3 h-3 inline-block mr-1 text-gold-dark" />
                <strong className="font-serif">Nakshatra nadi system</strong>: Star lords reveal the source, Sub lords determine the result.
            </div>
        </div >
    );
};

export default KpNakshatraNadiFocusedView;
