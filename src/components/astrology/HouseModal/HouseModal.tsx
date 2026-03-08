"use client";

import React from 'react';
import { X, Sparkles, Star, Info, Orbit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getHouseDetails } from '@/data/house-data';
import { Planet } from '../NorthIndianChart/NorthIndianChart';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface HouseModalProps {
    houseNumber: number;
    ascendantSign: number;
    planets: Planet[];
    onClose: () => void;
}

export default function HouseModal({ houseNumber, ascendantSign, planets, onClose }: HouseModalProps) {
    const houseDetails = getHouseDetails(houseNumber, ascendantSign);
    const planetsInHouse = planets.filter(p => p.signId === ((ascendantSign + houseNumber - 2) % 12) + 1);
    const trapRef = useFocusTrap(onClose);

    const titleId = `house-modal-title-${houseNumber}`;

    return (
        <>
            {/* Backdrop with Blur */}
            <div
                className="fixed inset-0 z-[200] bg-ink/30 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[201] flex items-center justify-center p-6 pointer-events-none">
                <div
                    ref={trapRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    className="bg-surface-warm border-[3px] border-gold-primary/45 rounded-[3.5rem] p-12 max-w-3xl w-full relative shadow-[0_50px_150px_rgba(62,42,31,0.5)] pointer-events-auto animate-in zoom-in-95 fade-in duration-500 overflow-hidden outline-none"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-primary/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-active-glow/10 rounded-full blur-[100px] pointer-events-none" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        aria-label="Close house details"
                        className="absolute top-8 right-8 p-4 rounded-2xl bg-ink/5 hover:bg-gold-primary/15 border border-ink/10 hover:border-gold-primary/30 text-ink hover:text-gold-dark transition-all group z-10"
                    >
                        <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Header */}
                    <div className="relative z-10 mb-10">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-dark to-bronze flex items-center justify-center text-white shadow-xl border-2 border-active-glow/40">
                                <span className="text-[30px] font-serif font-black">{houseNumber}</span>
                            </div>
                            <div>
                                <h2 id={titleId} className="text-4xl font-serif text-ink font-black tracking-tight">
                                    {houseDetails.name}
                                </h2>
                                <p className="text-[11px] text-gold-dark uppercase tracking-[0.3em] font-black mt-1">
                                    House {houseNumber} • {houseDetails.sign.name} {houseDetails.sign.symbol}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="relative z-10 space-y-8">

                        {/* Zodiac Sign Information */}
                        <div className="bg-gradient-to-br from-gold-dark/10 to-transparent border border-gold-primary/20 rounded-[2.5rem] p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-xl bg-gold-primary/15 flex items-center justify-center text-gold-dark shrink-0">
                                    <Star className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-dark mb-3">
                                        Zodiac Sign
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-5xl">{houseDetails.sign.symbol}</span>
                                            <div>
                                                <p className="text-[24px] font-serif font-black text-ink">{houseDetails.sign.name}</p>
                                                <p className="text-[14px] text-body/80 font-bold mt-1">
                                                    {houseDetails.sign.element} • {houseDetails.sign.quality}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-[14px] text-body leading-relaxed font-serif italic">
                                            {houseDetails.sign.description}
                                        </p>
                                        <div className="flex items-center gap-2 bg-ink/5 px-4 py-2 rounded-xl w-fit">
                                            <Orbit className="w-4 h-4 text-gold-dark" />
                                            <span className="text-[12px] font-black text-ink">
                                                Ruler: {houseDetails.sign.rulingPlanet}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* House Signification */}
                        <div className="bg-ink/5 border border-ink/10 rounded-[2.5rem] p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-xl bg-ink/10 flex items-center justify-center text-ink shrink-0">
                                    <Info className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-dark mb-3">
                                        House Signification
                                    </h3>
                                    <p className="text-[20px] font-serif text-gold-dark font-bold mb-3">
                                        {houseDetails.signification}
                                    </p>
                                    <p className="text-[14px] text-body leading-relaxed mb-4">
                                        {houseDetails.description}
                                    </p>

                                    {/* Keywords */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {houseDetails.keywords.map((keyword, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-gold-primary/10 border border-gold-primary/15 rounded-full text-[10px] font-black uppercase tracking-wider text-gold-dark"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Life Areas */}
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-body/60 mb-2">
                                            Life Areas Governed
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {houseDetails.areas.map((area, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                                                    <span className="text-[12px] text-ink font-bold">{area}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Planets in House */}
                        <div className="bg-gradient-to-br from-active-glow/20 to-transparent border border-active-glow/40 rounded-[2.5rem] p-8">
                            <div className="flex items-start gap-6">
                                <div className="w-14 h-14 rounded-xl bg-active-glow/30 flex items-center justify-center text-gold-dark shrink-0">
                                    <Sparkles className="w-7 h-7" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-dark mb-4">
                                        Planets Positioned
                                    </h3>
                                    {planetsInHouse.length > 0 ? (
                                        <div className="space-y-3">
                                            {planetsInHouse.map((planet, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between bg-ink/5 px-5 py-3 rounded-xl border border-ink/10"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gold-primary/15 flex items-center justify-center">
                                                            <span className="font-serif font-black text-gold-dark">{planet.name}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-ink">{planet.name}</p>
                                                            {planet.isRetro && (
                                                                <span className="text-[9px] text-gold-dark uppercase tracking-wider font-black">
                                                                    Retrograde
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-[14px] font-bold text-body font-mono">
                                                        {planet.degree}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[14px] text-body/60 italic">
                                            No planets currently positioned in this house.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Decoration */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold-dark to-transparent opacity-30" />
                </div>
            </div>
        </>
    );
}
