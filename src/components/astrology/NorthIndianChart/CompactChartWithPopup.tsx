"use client";

import React, { useState, useRef, useEffect } from 'react';
import CompactNorthIndianChart, { COMPACT_HOUSE_CENTERS_MAP } from './CompactNorthIndianChart';
import type { Planet } from './NorthIndianChart';
import { X, Sparkles } from 'lucide-react';
import { getHouseDetails } from '@/data/house-data';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';
import { createPortal } from 'react-dom';

interface CompactChartWithPopupProps {
    planets: Planet[];
    ascendantSign: number;
    className?: string;
    preserveAspectRatio?: string;
    showDegrees?: boolean;
    planetFontSize?: number;
    degreeFontSize?: number;
    planetFontWeight?: string | number;
    planetDisplayMode?: 'name' | 'symbol' | 'both';
    showHouseNumbers?: boolean;
    planetSpacing?: 'compact' | 'normal' | 'spacious';
    colorTheme?: 'classic' | 'modern' | 'royal' | 'earth' | 'ocean';
}

export default function CompactChartWithPopup({ 
    planets, 
    ascendantSign, 
    className = "", 
    preserveAspectRatio, 
    showDegrees = true,
    planetFontSize,
    degreeFontSize,
    planetFontWeight,
    planetDisplayMode,
    showHouseNumbers,
    planetSpacing,
    colorTheme = 'classic'
}: CompactChartWithPopupProps) {
    const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
    const [mounted, setMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleHouseClick = (houseNum: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const center = COMPACT_HOUSE_CENTERS_MAP[houseNum] || { x: 300, y: 200 };

            // Convert SVG coordinates (0-600 x, 0-400 y) to viewport pixels
            const xPercent = center.x / 600;
            const yPercent = center.y / 400;

            const clientX = rect.left + (xPercent * rect.width);
            const clientY = rect.top + (yPercent * rect.height);

            setPopupPosition({ x: clientX, y: clientY });
            setSelectedHouse(houseNum);
        }
    };

    const closePopup = () => setSelectedHouse(null);

    const houseDetails = selectedHouse ? getHouseDetails(selectedHouse, ascendantSign) : null;
    const planetsInHouse = selectedHouse
        ? planets
            .filter(p => (p.house ? p.house === selectedHouse : p.signId === ((ascendantSign + selectedHouse - 2) % 12) + 1))
            .sort((a, b) => a.degree.localeCompare(b.degree))
        : [];

    // Smart Positioning Logic
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
    const isRightSide = popupPosition.x > viewportWidth / 2;
    const POPUP_HEIGHT = 280;
    const GAP = 25;

    let topPos = popupPosition.y - (POPUP_HEIGHT / 2);
    if (topPos < GAP) topPos = GAP;
    if (topPos + POPUP_HEIGHT > viewportHeight - GAP) {
        topPos = viewportHeight - POPUP_HEIGHT - GAP;
    }

    const style: React.CSSProperties = {
        top: Math.max(GAP, Math.min(topPos, viewportHeight - POPUP_HEIGHT - GAP)),
        position: 'fixed',
        zIndex: 9999
    };

    if (isRightSide) {
        style.right = (viewportWidth - popupPosition.x) + GAP;
    } else {
        style.left = popupPosition.x + GAP;
    }

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <CompactNorthIndianChart
                planets={planets}
                ascendantSign={ascendantSign}
                preserveAspectRatio={preserveAspectRatio}
                onHouseClick={handleHouseClick}
                showDegrees={showDegrees}
                planetFontSize={planetFontSize}
                degreeFontSize={degreeFontSize}
                planetFontWeight={planetFontWeight}
                planetDisplayMode={planetDisplayMode}
                showHouseNumbers={showHouseNumbers}
                planetSpacing={planetSpacing}
                colorTheme={colorTheme}
            />

            {/* Portal Overlay Popup */}
            {mounted && selectedHouse && houseDetails && createPortal(
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[9990] cursor-default"
                        onClick={closePopup}
                        aria-hidden="true"
                    />

                    {/* Popup Card */}
                    <div
                        className="w-64 bg-white/95 backdrop-blur-md border border-gold-primary/30 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200"
                        style={style}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="compact-chart-popup-house-title"
                    >
                        <button
                            onClick={closePopup}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-ink text-white flex items-center justify-center hover:bg-gold-dark transition-colors shadow-sm z-10"
                            aria-label="Close popup"
                        >
                            <X className="w-3 h-3" />
                        </button>

                        <div className="flex items-center gap-3 mb-3 pb-2 border-b border-gold-primary/15">
                            <div className={cn("w-8 h-8 rounded-lg bg-gold-primary flex items-center justify-center text-white shadow-sm shrink-0", TYPOGRAPHY.value)}>
                                {selectedHouse}
                            </div>
                            <div className="min-w-0">
                                <h3 id="compact-chart-popup-house-title" className={cn("truncate", TYPOGRAPHY.sectionTitle)} title={houseDetails.name}>{houseDetails.name}</h3>
                                <p className={cn("truncate", TYPOGRAPHY.label)} title={houseDetails.sign.name}>
                                    {houseDetails.sign.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-surface-warm/40 rounded-lg p-2 mb-3 border border-gold-primary/15">
                            <div className="flex items-center gap-2">
                                <div className="text-[20px] leading-none">{houseDetails.sign.symbol}</div>
                                <div>
                                    <div className={cn("leading-tight", TYPOGRAPHY.value)} style={{ fontSize: '10px' }}>{houseDetails.sign.rulingPlanet}</div>
                                    <div className={cn("leading-tight", TYPOGRAPHY.label)} style={{ fontSize: '8px' }}><KnowledgeTooltip term="ruling_planet" unstyled>Ruler</KnowledgeTooltip></div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={cn(TYPOGRAPHY.value)} style={{ fontSize: '9px' }}>{houseDetails.sign.element}</div>
                                <div className={cn(TYPOGRAPHY.label)} style={{ fontSize: '8px' }}>{houseDetails.sign.quality}</div>
                            </div>
                        </div>

                        {planetsInHouse.length > 0 ? (
                            <div className="">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                    <Sparkles className="w-3 h-3 text-gold-primary" />
                                    <span className={TYPOGRAPHY.label}><KnowledgeTooltip term="planets_in_house" unstyled>Planets Here</KnowledgeTooltip></span>
                                </div>
                                <div className="space-y-1">
                                    {planetsInHouse.map((p, i) => (
                                        <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-gold-primary/5 hover:bg-gold-primary/10 transition-colors border border-transparent hover:border-gold-primary/20">
                                            <span className={TYPOGRAPHY.value}>{p.name} {p.isRetro && <span className="text-red-500 ml-0.5 text-[9px]">(R)</span>}</span>
                                            <span className={TYPOGRAPHY.subValue}>
                                                {p.degree}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="py-2 text-center text-[10px] text-ink/45 italic bg-surface-warm rounded-lg border border-gold-primary/10">
                                <KnowledgeTooltip term="empty_house" unstyled>Empty House</KnowledgeTooltip>
                            </div>
                        )}
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}
