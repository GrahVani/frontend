"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { parseChartData, signIdToName } from '@/lib/chart-helpers';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Star,
    Moon,
    Sun,
    Activity,
    Hexagon,
    Shield,
    Anchor,
    Feather,
    Disc,
    Zap,
    RefreshCcw,
    CalendarDays,
    Sunrise,
    Sunset,
    Loader2,
    AlertTriangle,
    Sparkle,
    Heart
} from 'lucide-react';


import { TYPOGRAPHY } from '@/design-tokens/typography';

// ============================================================================
// PANCHANGA OVERVIEW PAGE — Full-page view with 3 sections
// ============================================================================

// Icon components for Avakhada items
function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function TypeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 7 4 4 20 4 20 7" />
            <line x1="9" x2="15" y1="20" y2="20" />
            <line x1="12" x2="12" y1="4" y2="20" />
        </svg>
    );
}

// Avakhada field mapping
const AVAKHADA_ITEMS = [
    { key: 'varna', label: 'Varna', sanskrit: 'वर्ण', icon: Shield, desc: 'Class / Temperament', color: 'from-amber-500/10 to-orange-500/10', accent: 'text-amber-600' },
    { key: 'vashya', label: 'Vashya', sanskrit: 'वश्य', icon: Anchor, desc: 'Control / Nature', color: 'from-blue-500/10 to-cyan-500/10', accent: 'text-blue-600' },
    { key: 'yoni', label: 'Yoni', sanskrit: 'योनि', icon: Hexagon, desc: 'Instinct / Animal Symbol', color: 'from-emerald-500/10 to-green-500/10', accent: 'text-emerald-600' },
    { key: 'gana', label: 'Gana', sanskrit: 'गण', icon: UsersIcon, desc: 'Nature / Temperament Group', color: 'from-violet-500/10 to-purple-500/10', accent: 'text-violet-600' },
    { key: 'nadi', label: 'Nadi', sanskrit: 'नाडी', icon: Activity, desc: 'Health / Energy Channel', color: 'from-rose-500/10 to-pink-500/10', accent: 'text-rose-600' },
    { key: 'symbol_tatva', label: 'Tatva', sanskrit: 'तत्व', icon: Feather, desc: 'Element', color: 'from-teal-500/10 to-emerald-500/10', accent: 'text-teal-600' },
    { key: 'rashi_lord', label: 'Rashi Lord', sanskrit: 'राशि स्वामी', icon: Sun, desc: 'Sign Ruler', color: 'from-orange-500/10 to-red-500/10', accent: 'text-orange-600' },
    { key: 'rashi', label: 'Rashi', sanskrit: 'राशि', icon: Moon, desc: 'Moon Sign', color: 'from-indigo-500/10 to-blue-500/10', accent: 'text-indigo-600' },
    { key: 'nakshatra', label: 'Nakshatra', sanskrit: 'नक्षत्र', icon: Star, desc: 'Birth Star', color: 'from-yellow-500/10 to-amber-500/10', accent: 'text-yellow-600' },
    { key: 'pada', label: 'Pada', sanskrit: 'पाद', icon: Disc, desc: 'Quarter', color: 'from-slate-500/10 to-gray-500/10', accent: 'text-slate-600' },
    { key: 'namakshar', label: 'Namakshar', sanskrit: 'नामाक्षर', icon: TypeIcon, desc: 'Sound / First Letter', color: 'from-cyan-500/10 to-sky-500/10', accent: 'text-cyan-600' },
    { key: 'paya_rashi', label: 'Paya (Rashi)', sanskrit: 'पाया (राशि)', icon: Disc, desc: 'Base Metal', color: 'from-stone-500/10 to-neutral-500/10', accent: 'text-stone-600' },
    { key: 'paya_nakshatra', label: 'Paya (Nakshatra)', sanskrit: 'पाया (नक्षत्र)', icon: Disc, desc: 'Star Metal', color: 'from-zinc-500/10 to-gray-500/10', accent: 'text-zinc-600' },
];

// Helper for formatting
const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch { return dateStr; }
};

const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    try {
        if (timeStr.includes('T')) {
            const timePart = timeStr.split('T')[1];
            const cleanTime = timePart.replace('Z', '').split('+')[0].split('.')[0];
            const [hours, minutes] = cleanTime.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${minutes} ${ampm}`;
        }
        const date = new Date(`1970-01-01T${timeStr}`);
        if (!isNaN(date.getTime())) {
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        }
        return timeStr;
    } catch { return timeStr; }
};

export default function PanchangaOverviewPage() {
    const { clientDetails, processedCharts, isLoadingCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const activeSystem = ayanamsa.toLowerCase();

    // Avakhada data state
    const [avakhadaData, setAvakhadaData] = useState<Record<string, unknown> | null>(null);
    const [avakhadaLoading, setAvakhadaLoading] = useState(true);
    const [avakhadaError, setAvakhadaError] = useState<string | null>(null);

    // D1 chart data for Lagna, Moon, Sun
    const d1Data = useMemo(() => {
        const key = `D1_${activeSystem}`;
        return parseChartData(processedCharts[key]?.chartData);
    }, [processedCharts, activeSystem]);

    // Birth Panchanga data
    const birthPanchangaData = processedCharts['birth_panchanga_universal']?.chartData;
    const panchanga = birthPanchangaData?.panchanga;
    const times = birthPanchangaData?.times;

    // Fetch Avakhada data
    useEffect(() => {
        const fetchAvakhada = async () => {
            if (!clientDetails?.id) return;
            setAvakhadaLoading(true);
            setAvakhadaError(null);
            try {
                const result = await clientApi.getAvakhadaChakra(clientDetails.id);
                const rawData = (result as Record<string, any>).chartData || (result as Record<string, any>).data || result;
                const cleanData = (rawData as Record<string, any>).avakhada_chakra || rawData;
                setAvakhadaData(cleanData);
            } catch (err: unknown) {
                setAvakhadaError(err instanceof Error ? err.message : "Failed to load Avakhada Chakra");
            } finally {
                setAvakhadaLoading(false);
            }
        };
        fetchAvakhada();
    }, [clientDetails?.id]);

    // Loading state
    if (!clientDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-2 border-gold-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const moonPlanet = d1Data.planets.find(p => p.name === "Mo");
    const sunPlanet = d1Data.planets.find(p => p.name === "Su");

    return (
        <div className="space-y-5 animate-in fade-in duration-500 pb-8">

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* PAGE HEADER                                                */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <div className={TYPOGRAPHY.breadcrumb}>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/vedic-astrology/overview" className="hover:text-gold-primary transition-colors flex items-center gap-1">
                                <ArrowLeft className="w-3 h-3" />
                                Kundali
                            </Link>
                            <span className="text-primary">/</span>
                            <span>Panchanga Overview</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-ink tracking-tight">Panchanga Overview</h1>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 2: BIRTH PANCHANGA — Expanded Premium Layout       */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="border border-antique rounded-2xl overflow-hidden shadow-sm bg-surface-warm">
                <div className="bg-border-warm px-5 py-3 border-b border-antique flex items-center gap-3">
                    <div className="p-1.5 bg-white/60 rounded-lg shadow-xs">
                        <Sparkle className="w-4 h-4 text-header-border" />
                    </div>
                    <div>
                        <h3 className={TYPOGRAPHY.sectionTitle}>Birth Panchanga</h3>
                        <p className={cn(TYPOGRAPHY.subValue, "text-primary")}>Five-fold daily cosmic markers at the moment of birth</p>
                    </div>
                </div>

                {!panchanga ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin mx-auto mb-3" />
                        <p className="text-xs font-serif text-primary">Loading birth panchanga data...</p>
                    </div>
                ) : (
                    <div className="p-5">
                        {/* Main 5 Panchangas */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
                            {/* Tithi */}
                            <PanchangaCard
                                label="Tithi"
                                sanskrit="तिथि"
                                value={panchanga.tithi?.name || '—'}
                                subValue={panchanga.tithi?.paksha}
                                description="Lunar day — phase of the Moon relative to the Sun"
                                icon={Moon}
                                gradient="from-indigo-50 to-blue-50"
                                iconColor="text-indigo-500"
                                borderColor="border-indigo-200/60"
                            />
                            {/* Nakshatra */}
                            <PanchangaCard
                                label="Nakshatra"
                                sanskrit="नक्षत्र"
                                value={panchanga.nakshatra?.name || '—'}
                                subValue={panchanga.nakshatra?.pada ? `Pada ${panchanga.nakshatra.pada}` : undefined}
                                description="Birth star — lunar mansion at birth moment"
                                icon={Star}
                                gradient="from-amber-50 to-yellow-50"
                                iconColor="text-amber-500"
                                borderColor="border-amber-200/60"
                            />
                            {/* Yoga */}
                            <PanchangaCard
                                label="Yoga"
                                sanskrit="योग"
                                value={panchanga.yoga?.name || '—'}
                                description="Luni-solar combination — Sun & Moon angular distance"
                                icon={RefreshCcw}
                                gradient="from-teal-50 to-emerald-50"
                                iconColor="text-teal-500"
                                borderColor="border-teal-200/60"
                            />
                            {/* Karana */}
                            <PanchangaCard
                                label="Karana"
                                sanskrit="करण"
                                value={panchanga.karana?.name || '—'}
                                description="Half-tithi — sub-division of the lunar day"
                                icon={CalendarDays}
                                gradient="from-rose-50 to-pink-50"
                                iconColor="text-rose-500"
                                borderColor="border-rose-200/60"
                            />
                            {/* Vara */}
                            <PanchangaCard
                                label="Vara"
                                sanskrit="वार"
                                value={panchanga.vara?.name || '—'}
                                description="Weekday — planetary ruler of the birth day"
                                icon={Sun}
                                gradient="from-orange-50 to-amber-50"
                                iconColor="text-orange-500"
                                borderColor="border-orange-200/60"
                            />
                        </div>

                        {/* Sunrise / Sunset Row */}
                        {times && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50/80 to-transparent rounded-xl border border-amber-200/30">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                        <Sunrise className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <p className={TYPOGRAPHY.label}>Sunrise</p>
                                        <p className={TYPOGRAPHY.value}>{times.sunrise?.time || '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50/80 to-transparent rounded-xl border border-indigo-200/30">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                        <Sunset className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className={TYPOGRAPHY.label}>Sunset</p>
                                        <p className={TYPOGRAPHY.value}>{times.sunset?.time || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* SECTION 3: AVAKHADA CHAKRA — Full-Width Detailed Grid      */}
            {/* ═══════════════════════════════════════════════════════════ */}
            <div className="border border-antique rounded-2xl overflow-hidden shadow-sm bg-surface-warm">
                <div className="bg-border-warm px-5 py-3 border-b border-antique flex items-center gap-3">
                    <div className="p-1.5 bg-white/60 rounded-lg shadow-xs">
                        <Star className="w-4 h-4 text-header-border" />
                    </div>
                    <div>
                        <h3 className={TYPOGRAPHY.sectionTitle}>
                            Avakhada Chakra
                        </h3>
                        <p className={cn(TYPOGRAPHY.subValue, "text-primary")}>
                            Foundational classification — compatibility & character attributes
                        </p>
                    </div>
                </div>

                {avakhadaLoading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin mx-auto mb-3" />
                        <p className="text-xs font-serif text-primary italic">Consulting the Stars...</p>
                    </div>
                ) : avakhadaError || !avakhadaData ? (
                    <div className="p-8 text-center space-y-3">
                        <div className="bg-red-50 p-3 rounded-xl inline-block">
                            <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <h4 className="font-serif font-bold text-red-900">Unavailable</h4>
                        <p className="text-red-600">{avakhadaError || "Data not found"}</p>
                    </div>
                ) : (
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                {
                                    key: "varna",
                                    label: "Varna",
                                    description: "Represents the inherent temperament, ego, and spiritual inclination of the individual. It is categorized into four types (Brahmin, Kshatriya, Vaishya, Shudra).",
                                    getInChart: (val: string) => val?.toLowerCase() === 'brahmin' ? "Brahmin indicates a natural inclination towards intellectual pursuits, teaching, learning, and spiritual or philosophical matters. In compatibility, it reflects the \"ego level\" of the partners." : null,
                                    icon: Shield, color: 'from-amber-500/10 to-orange-500/10', borderColor: 'border-amber-200/50', bgColor: 'bg-amber-100/50', textColor: 'text-amber-900', titleColor: 'text-amber-700'
                                },
                                {
                                    key: "vashya",
                                    label: "Vashya",
                                    description: "Translates to \"control\" or \"attraction.\" It classifies signs into different categories (bipeds, quadrupeds, insects, water-dwelling, etc.) to evaluate mutual attraction and power dynamics in a relationship.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'jalachara' ? "Jalachara (Water-dwelling) is derived from the Moon being in Cancer." : null,
                                    icon: Anchor, color: 'from-blue-500/10 to-cyan-500/10', borderColor: 'border-blue-200/50', bgColor: 'bg-blue-100/50', textColor: 'text-blue-900', titleColor: 'text-blue-700'
                                },
                                {
                                    key: "nakshatra_pada",
                                    label: "Nakshatra - Pada",
                                    description: "The exact lunar mansion (out of 27) the Moon occupied at birth. Each Nakshatra is divided into 4 quarters called Padas.",
                                    getInChart: (val: string) => (val?.toLowerCase().includes('ashlesha') && val?.includes('2')) ? "The Moon was in Ashlesha Nakshatra, specifically in its 2nd quarter. This is the precise coordinate used to calculate many of the other factors in this table." : null,
                                    icon: Star, color: 'from-yellow-500/10 to-amber-500/10', borderColor: 'border-yellow-200/50', bgColor: 'bg-yellow-100/50', textColor: 'text-yellow-900', titleColor: 'text-yellow-700'
                                },
                                {
                                    key: "yoni",
                                    label: "Yoni",
                                    description: "Translates to \"source\" or \"female reproductive organ,\" but in this context, it assigns an animal archetype to the Nakshatra. It is primarily used to assess physical, sexual, and instinctual compatibility (Yoni Koota) between partners to ensure there is no natural enmity (like Dog and Hare).",
                                    getInChart: (val: string) => val?.toLowerCase() === 'marjara' ? "Marjara means Cat." : null,
                                    icon: Hexagon, color: 'from-emerald-500/10 to-green-500/10', borderColor: 'border-emerald-200/50', bgColor: 'bg-emerald-100/50', textColor: 'text-emerald-900', titleColor: 'text-emerald-700'
                                },
                                {
                                    key: "rashi_lord",
                                    label: "Rashish",
                                    description: "The planetary lord or ruler of the person's Moon sign (Rashi).",
                                    getInChart: (val: string, rashi: string) => (rashi?.toLowerCase() === 'cancer' && val?.toLowerCase() === 'moon') ? "Because the Rashi is Cancer, the planetary ruler is the Moon (Chandra)." : null,
                                    icon: Moon, color: 'from-indigo-500/10 to-blue-500/10', borderColor: 'border-indigo-200/50', bgColor: 'bg-indigo-100/50', textColor: 'text-indigo-900', titleColor: 'text-indigo-700'
                                },
                                {
                                    key: "gana",
                                    label: "Gana",
                                    description: "Classifies the temperament of the Nakshatra into three categories: Deva (Divine), Manushya (Human), or Rakshasa (Demon/Fierce). It indicates how a person reacts to challenges.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'rakshasa' ? "Rakshasa indicates a strong-willed, independent, fiercely protective, and highly intuitive nature that can be unyielding or aggressive when pushed." : null,
                                    icon: UsersIcon, color: 'from-violet-500/10 to-purple-500/10', borderColor: 'border-violet-200/50', bgColor: 'bg-violet-100/50', textColor: 'text-violet-900', titleColor: 'text-violet-700'
                                },
                                {
                                    key: "rashi",
                                    label: "Rashi",
                                    description: "The Zodiac sign (out of 12) where the Moon was placed at birth. It governs the mind, emotions, and psychological disposition.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'cancer' ? "Cancer (Karka), a water sign indicating emotional depth and sensitivity." : null,
                                    icon: Moon, color: 'from-sky-500/10 to-blue-500/10', borderColor: 'border-sky-200/50', bgColor: 'bg-sky-100/50', textColor: 'text-sky-900', titleColor: 'text-sky-700'
                                },
                                {
                                    key: "nadi",
                                    label: "Nadi",
                                    description: "Represents the physiological and neurobiological constitution of the individual, roughly correlating to the three Ayurvedic doshas (Vata, Pitta, Kapha). It is the most heavily weighted factor (8 points) in marriage compatibility to ensure genetic and energetic health of progeny.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'antya' ? "Antya (ending) generally corresponds to Kapha (phlegm/water) energy." : null,
                                    icon: Activity, color: 'from-rose-500/10 to-pink-500/10', borderColor: 'border-rose-200/50', bgColor: 'bg-rose-100/50', textColor: 'text-rose-900', titleColor: 'text-rose-700'
                                },
                                {
                                    key: "varga",
                                    label: "Varga",
                                    description: "Similar to Yoni, this assigns an animal classification (often based on the starting letter of the name) used to check for mutual friendships or enmities in basic daily interactions.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'shwana' ? "Shwana means Dog." : null,
                                    icon: UsersIcon, color: 'from-stone-500/10 to-neutral-500/10', borderColor: 'border-stone-200/50', bgColor: 'bg-stone-100/50', textColor: 'text-stone-900', titleColor: 'text-stone-700'
                                },
                                {
                                    key: "yunja",
                                    label: "Yunja",
                                    description: "Relates to the \"connection\" or binding energy of the Nakshatra, sometimes used to see the flow of prosperity or energy.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'madya' ? "Madya means middle." : null,
                                    icon: Zap, color: 'from-fuchsia-500/10 to-pink-500/10', borderColor: 'border-fuchsia-200/50', bgColor: 'bg-fuchsia-100/50', textColor: 'text-fuchsia-900', titleColor: 'text-fuchsia-700'
                                },
                                {
                                    key: "symbol_tatva",
                                    label: "Hansak / Tatwa",
                                    description: "The elemental nature of the Moon sign (Fire, Earth, Air, or Water).",
                                    getInChart: (val: string, rashi: string) => val?.toLowerCase() === 'jala' ? `Jala means Water, aligning with the ${rashi || 'Cancer'} Rashi.` : null,
                                    icon: Feather, color: 'from-teal-500/10 to-emerald-500/10', borderColor: 'border-teal-200/50', bgColor: 'bg-teal-100/50', textColor: 'text-teal-900', titleColor: 'text-teal-700'
                                },
                                {
                                    key: "namakshar",
                                    label: "Naamakshar",
                                    description: "The highly auspicious starting phonetic sound or syllable for the person's given name. This is directly dictated by the Nakshatra Pada. Traditional pundits use this heavily for naming and quick compatibility checks.",
                                    getInChart: () => null,
                                    icon: TypeIcon, color: 'from-cyan-500/10 to-sky-500/10', borderColor: 'border-cyan-200/50', bgColor: 'bg-cyan-100/50', textColor: 'text-cyan-900', titleColor: 'text-cyan-700'
                                },
                                {
                                    key: "paya",
                                    label: "Paya (Rashi/Nakshatra)",
                                    description: "Refers to the \"footing\" or foundation on which the Moon arrived at birth. It predicts the general ease, wealth, and auspiciousness of the person's early life.",
                                    getInChart: (val: string) => (val?.toLowerCase().includes('silver') || val?.toLowerCase().includes('copper')) ? "Silver is considered highly auspicious and prosperous, while Copper is also very positive, indicating stability." : null,
                                    icon: Disc, color: 'from-slate-500/10 to-gray-500/10', borderColor: 'border-slate-200/50', bgColor: 'bg-slate-100/50', textColor: 'text-slate-900', titleColor: 'text-slate-700'
                                }
                            ].map((item, idx) => {
                                let value = '';
                                if (item.key === 'nakshatra_pada') {
                                    const nakshatra = String(avakhadaData?.nakshatra || avakhadaData?.Nakshatra || '');
                                    const pada = String(avakhadaData?.pada || avakhadaData?.Pada || '');
                                    value = [nakshatra, pada].filter(Boolean).join(' - ');
                                } else if (item.key === 'paya') {
                                    const rashi = String(avakhadaData?.paya_rashi || avakhadaData?.Paya_Rashi || '');
                                    const nakshatra = String(avakhadaData?.paya_nakshatra || avakhadaData?.Paya_Nakshatra || '');
                                    value = [rashi, nakshatra].filter(Boolean).join('/');
                                } else {
                                    value = String(avakhadaData?.[item.key] || avakhadaData?.[item.key.toLowerCase()] || avakhadaData?.[item.label] || '');
                                }

                                if (!value) return null;

                                const rashi = String(avakhadaData?.rashi || avakhadaData?.Rashi || '');
                                const inChart = item.getInChart(value, rashi);

                                return (
                                    <div key={item.key} className={cn("rounded-2xl border p-5 flex flex-col h-full bg-gradient-to-br shadow-sm hover:shadow-md transition-shadow", item.color, item.borderColor)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("p-2 rounded-xl bg-white/80 shadow-sm", item.titleColor)}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <h4 className={TYPOGRAPHY.planetName}>{item.label}</h4>
                                            </div>
                                            <span className={cn(TYPOGRAPHY.value, item.titleColor)}>{value}</span>
                                        </div>
                                        <p className="text-sm font-medium text-primary leading-relaxed mb-5 flex-grow font-sans">
                                            {item.description}
                                        </p>
                                        {inChart && (
                                            <div className={cn("mt-auto p-4 rounded-xl border border-white/20", item.bgColor)}>
                                                <div className="flex items-center gap-1.5 mb-2">
                                                    <Sparkle className={cn("w-4 h-4 text-accent-gold", item.titleColor)} />
                                                    <span className={cn("font-bold text-xs uppercase tracking-wider font-sans", item.titleColor)}>In this chart</span>
                                                </div>
                                                <p className={cn("text-sm font-medium leading-relaxed font-sans", item.textColor)}>
                                                    {inChart}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function PanchangaCard({
    label, sanskrit, value, subValue, description, icon: Icon, gradient, iconColor, borderColor
}: {
    label: string;
    sanskrit: string;
    value: string;
    subValue?: string;
    description: string;
    icon: React.ElementType;
    gradient: string;
    iconColor: string;
    borderColor: string;
}) {
    return (
        <div className={cn(
            "bg-gradient-to-br rounded-xl p-4 border transition-all hover:shadow-md group",
            gradient, borderColor
        )}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className={TYPOGRAPHY.label}>{label}</p>
                    <p className={cn(TYPOGRAPHY.subValue, "text-primary mt-0.5")}>{sanskrit}</p>
                </div>
                <div className="p-1.5 bg-white/80 rounded-lg shadow-xs group-hover:shadow-sm transition-shadow">
                    <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
            </div>
            <p className={TYPOGRAPHY.value}>{value}</p>
            {subValue && (
                <p className={TYPOGRAPHY.subValue}>{subValue}</p>
            )}
            <p className={cn(TYPOGRAPHY.subValue, "text-primary mt-2 whitespace-normal leading-snug")}>{description}</p>
        </div>
    );
}
