"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    ArrowLeft,
    Loader2,
    AlertTriangle,
    Star,
    Crown,
    Circle,
    Gem,
    CheckCircle2,
    XCircle,
    TrendingUp,
    Shield,
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";

// ============================================================================
// Types
// ============================================================================

interface PushkaraInfo {
    is_pushkara: boolean;
    is_pushkara_bhaga: boolean;
    is_vargottama: boolean;
    pushkara_range: string | null;
    ruling_navamsha: string | null;
}

interface PlanetData {
    name: string;
    degree_formatted: string;
    degree_in_sign: number;
    longitude: number;
    navamsha_degree: number;
    navamsha_sign: string;
    navamsha_sign_number: number;
    pushkara_navamsha: PushkaraInfo;
    sign: string;
    sign_number: number;
}

interface PushkaraSummary {
    ascendant_in_pushkara: boolean;
    planets_in_pushkara: string[];
    planets_in_pushkara_bhaga: string[];
    total_planets_in_pushkara: number;
    total_pushkara_bhaga: number;
    vargottama_pushkaras: string[];
}

interface PushkaraData {
    ascendant: PlanetData;
    planets: Record<string, PlanetData>;
    pushkara_summary: PushkaraSummary;
    birth_details: Record<string, unknown>;
    calculation_settings: Record<string, unknown>;
    user_name: string;
}

// ============================================================================
// Constants
// ============================================================================

const PLANET_COLORS: Record<string, { primary: string; bg: string; border: string; twText: string }> = {
    'Sun': { primary: '#F97316', bg: 'rgba(249, 115, 22, 0.08)', border: 'rgba(249, 115, 22, 0.25)', twText: 'text-orange-500' },
    'Moon': { primary: '#64748B', bg: 'rgba(100, 116, 139, 0.08)', border: 'rgba(100, 116, 139, 0.25)', twText: 'text-ink/45' },
    'Mars': { primary: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.25)', twText: 'text-red-500' },
    'Mercury': { primary: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)', twText: 'text-emerald-500' },
    'Jupiter': { primary: '#EAB308', bg: 'rgba(234, 179, 8, 0.08)', border: 'rgba(234, 179, 8, 0.25)', twText: 'text-yellow-500' },
    'Venus': { primary: '#D946EF', bg: 'rgba(217, 70, 239, 0.08)', border: 'rgba(217, 70, 239, 0.25)', twText: 'text-fuchsia-500' },
    'Saturn': { primary: '#334155', bg: 'rgba(51, 65, 85, 0.08)', border: 'rgba(51, 65, 85, 0.25)', twText: 'text-ink' },
    'Rahu': { primary: '#6366F1', bg: 'rgba(99, 102, 241, 0.08)', border: 'rgba(99, 102, 241, 0.25)', twText: 'text-indigo-500' },
    'Ketu': { primary: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.25)', twText: 'text-violet-500' },
    'Ascendant': { primary: '#C9A24D', bg: 'rgba(201, 162, 77, 0.08)', border: 'rgba(201, 162, 77, 0.25)', twText: 'text-gold-primary' },
};

const PLANET_ABBR: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
    'Rahu': 'Ra', 'Ketu': 'Ke', 'Ascendant': 'As'
};

const SIGN_SYMBOLS: Record<string, string> = {
    'Aries': '♈', 'Taurus': '♉', 'Gemini': '♊', 'Cancer': '♋',
    'Leo': '♌', 'Virgo': '♍', 'Libra': '♎', 'Scorpio': '♏',
    'Sagittarius': '♐', 'Capricorn': '♑', 'Aquarius': '♒', 'Pisces': '♓'
};

// ============================================================================
// Page Component
// ============================================================================

export default function PushkaraNavamshaPage() {
    const { clientDetails } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<PushkaraData | null>(null);

    const clientId = clientDetails?.id || '';

    const fetchData = async () => {
        if (!clientId) return;
        setLoading(true);
        setError(null);
        try {
            const result = await clientApi.getPushkaraNavamsha(clientId) as any;
            const rawData = result.data?.data || result.chartData?.data || result.data || result.chartData || result;

            if (rawData && rawData.planets) {
                // Normalize planet names (add name field)
                const planets: Record<string, PlanetData> = {};
                Object.entries(rawData.planets).forEach(([name, pData]: [string, any]) => {
                    planets[name] = { ...pData, name };
                });
                setData({
                    ...rawData,
                    planets,
                    ascendant: { ...rawData.ascendant, name: 'Ascendant' },
                });
            } else {
                setError("No Pushkara Navamsha data found.");
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load Pushkara Navamsha data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ayanamsa === 'Lahiri' && clientId) {
            fetchData();
        }
    }, [clientId, ayanamsa]);

    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Sparkles className="w-12 h-12 text-ink mb-4" />
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "!text-ink !mb-2")}>Pushkara Navamsha — Lahiri Only</h2>
                <p className={cn(TYPOGRAPHY.subValue, "!text-ink !text-[14px] max-w-md !mt-0")}>
                    Pushkara Navamsha analysis is currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                </p>
                <Link href="/vedic-astrology/overview" className={cn(TYPOGRAPHY.label, "!mt-6 !text-[14px] !text-gold-dark hover:!text-gold-primary transition-colors flex items-center gap-1")}>
                    <ArrowLeft className="w-4 h-4" /> Back to Kundali
                </Link>
            </div>
        );
    }

    if (!clientDetails) return null;

    return (
        <div className="space-y-4 animate-in fade-in duration-500 pb-12 pt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "!text-ink font-bold")}>Pushkara Navamsha</h1>
                    <p className={cn(TYPOGRAPHY.label, "!text-ink/60 !mb-0 mt-1 italic")}>Auspicious Navamsha divisions — blessings from past karma</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 prem-card rounded-3xl">
                    <Loader2 className="w-10 h-10 text-gold-primary animate-spin mb-4" />
                    <p className={cn(TYPOGRAPHY.subValue, "!text-ink italic tracking-wide !mt-0")}>Analyzing Pushkara positions...</p>
                </div>
            ) : error ? (
                <div className="p-10 bg-red-50 border border-red-100 rounded-3xl text-center">
                    <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-red-900 !mb-2")}>Analysis Error</h3>
                    <p className={cn(TYPOGRAPHY.subValue, "!text-red-600 max-w-md mx-auto !mb-6")}>{error}</p>
                    <button onClick={fetchData} className={cn(TYPOGRAPHY.label, "px-6 py-2.5 bg-red-100 text-red-700 rounded-xl !text-[14px] !font-bold hover:bg-red-200 transition-colors")}>
                        Retry
                    </button>
                </div>
            ) : data ? (
                <PushkaraDashboard data={data} />
            ) : null}
        </div>
    );
}

// ============================================================================
// Dashboard Component
// ============================================================================

function PushkaraDashboard({ data }: { data: PushkaraData }) {
    const summary = data.pushkara_summary;

    // Sort planets: pushkara first, then rest
    const allPlanets: PlanetData[] = [
        ...Object.values(data.planets).filter(p => p.pushkara_navamsha.is_pushkara),
        ...Object.values(data.planets).filter(p => !p.pushkara_navamsha.is_pushkara),
    ];

    return (
        <div className="space-y-5">
            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1: Summary Stats
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Planets in Pushkara */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={cn(
                        "bg-white border rounded-2xl p-5 shadow-sm relative overflow-hidden group",
                        summary.total_planets_in_pushkara > 0
                            ? "border-emerald-200"
                            : "border-gold-primary/20"
                    )}
                >
                    {summary.total_planets_in_pushkara > 0 && (
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-50 rounded-bl-[40px] -mr-3 -mt-3 transition-all group-hover:scale-110" />
                    )}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Star className={cn("w-4 h-4", summary.total_planets_in_pushkara > 0 ? "text-emerald-600" : "text-ink/35")} />
                            <h3 className={cn(TYPOGRAPHY.label, "!text-[10px] !mb-0 !font-bold tracking-[0.15em] uppercase !text-ink")}>In Pushkara</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={cn(TYPOGRAPHY.value, "text-[30px] !font-bold", summary.total_planets_in_pushkara > 0 ? "!text-emerald-500" : "!text-ink")}>
                                {summary.total_planets_in_pushkara}
                            </span>
                            <span className={cn(TYPOGRAPHY.subValue, "!text-ink/60 !mt-0")}>planet{summary.total_planets_in_pushkara !== 1 ? 's' : ''}</span>
                        </div>
                        {summary.planets_in_pushkara.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {summary.planets_in_pushkara.map(p => (
                                    <span key={p} className={cn(TYPOGRAPHY.label, "!text-[10px] !font-bold px-2 py-0.5 rounded-full bg-emerald-50 !text-emerald-700 border border-emerald-100 !mb-0")}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Pushkara Bhaga */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className={cn(
                        "bg-white border rounded-2xl p-5 shadow-sm relative overflow-hidden group",
                        summary.total_pushkara_bhaga > 0
                            ? "border-amber-200"
                            : "border-gold-primary/20"
                    )}
                >
                    {summary.total_pushkara_bhaga > 0 && (
                        <div className="absolute top-0 right-0 w-20 h-20 bg-amber-50 rounded-bl-[40px] -mr-3 -mt-3 transition-all group-hover:scale-110" />
                    )}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Crown className={cn("w-4 h-4", summary.total_pushkara_bhaga > 0 ? "text-amber-600" : "text-ink/35")} />
                            <h3 className={cn(TYPOGRAPHY.label, "!text-[10px] !mb-0 !font-bold tracking-[0.15em] uppercase !text-ink")}>Pushkara Bhaga</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={cn(TYPOGRAPHY.value, "text-[30px] !font-bold", summary.total_pushkara_bhaga > 0 ? "!text-amber-600" : "!text-ink")}>
                                {summary.total_pushkara_bhaga}
                            </span>
                            <span className={cn(TYPOGRAPHY.subValue, "!text-ink/60 !mt-0")}>exact degree{summary.total_pushkara_bhaga !== 1 ? 's' : ''}</span>
                        </div>
                        {summary.planets_in_pushkara_bhaga.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {summary.planets_in_pushkara_bhaga.map(p => (
                                    <span key={p} className={cn(TYPOGRAPHY.label, "!text-[10px] !font-bold px-2 py-0.5 rounded-full bg-amber-50 !text-amber-700 border border-amber-100 !mb-0")}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Vargottama Pushkaras */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className={cn(
                        "bg-white border rounded-2xl p-5 shadow-sm relative overflow-hidden group",
                        summary.vargottama_pushkaras.length > 0
                            ? "border-violet-200"
                            : "border-gold-primary/20"
                    )}
                >
                    {summary.vargottama_pushkaras.length > 0 && (
                        <div className="absolute top-0 right-0 w-20 h-20 bg-violet-50 rounded-bl-[40px] -mr-3 -mt-3 transition-all group-hover:scale-110" />
                    )}
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Gem className={cn("w-4 h-4", summary.vargottama_pushkaras.length > 0 ? "text-violet-600" : "text-ink/35")} />
                            <h3 className={cn(TYPOGRAPHY.label, "!text-[10px] !mb-0 !font-bold tracking-[0.15em] uppercase !text-ink")}>Vargottama Pushkara</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className={cn(TYPOGRAPHY.value, "text-[30px] !font-bold", summary.vargottama_pushkaras.length > 0 ? "!text-violet-600" : "!text-ink")}>
                                {summary.vargottama_pushkaras.length}
                            </span>
                            <span className={cn(TYPOGRAPHY.subValue, "!text-ink/60 !mt-0")}>double blessed</span>
                        </div>
                        {summary.vargottama_pushkaras.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {summary.vargottama_pushkaras.map(p => (
                                    <span key={p} className={cn(TYPOGRAPHY.label, "!text-[10px] !font-bold px-2 py-0.5 rounded-full bg-violet-50 !text-violet-700 border border-violet-100 !mb-0")}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2: Ascendant Card
            ═══════════════════════════════════════════════════════════════ */}
            <AscendantCard planet={data.ascendant} />

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3: Planet Cards Grid
            ═══════════════════════════════════════════════════════════════ */}
            <div className="prem-card rounded-3xl overflow-hidden">
                <div className="p-4 border-b border-gold-primary/15 bg-surface-warm/10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold-primary" />
                    <h3 className={cn(TYPOGRAPHY.label, "!text-[12px] font-bold tracking-wider !text-ink !mb-0")}>Planetary Pushkara Analysis</h3>
                    <span className={cn(TYPOGRAPHY.label, "text-[9px] ml-auto !font-bold !text-ink/35 tracking-wider !mb-0")}>
                        {summary.total_planets_in_pushkara} OF {Object.keys(data.planets).length} IN PUSHKARA
                    </span>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allPlanets.map((planet, idx) => (
                        <PlanetPushkaraCard key={planet.name} planet={planet} index={idx} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Ascendant Card
// ============================================================================

function AscendantCard({ planet }: { planet: PlanetData }) {
    const isPushkara = planet.pushkara_navamsha.is_pushkara;
    const colors = PLANET_COLORS['Ascendant'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "bg-white border rounded-2xl p-5 shadow-sm relative overflow-hidden",
                isPushkara ? "border-gold-primary/40" : "border-gold-primary/20"
            )}
        >
            {isPushkara && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-50/40 via-transparent to-amber-50/40 pointer-events-none" />
            )}
            <div className="relative z-10 flex items-center gap-4">
                <div
                    className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-serif font-bold text-[18px] shadow-sm border-2",
                        isPushkara ? "border-gold-primary/50" : "border-gold-primary/20"
                    )}
                    style={{ backgroundColor: colors.bg, color: colors.primary }}
                >
                    As
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={cn(TYPOGRAPHY.value, "!text-[14px] font-bold !text-ink")}>Ascendant (Lagna)</h4>
                        {isPushkara ? (
                            <span className={cn(TYPOGRAPHY.label, "text-[9px] !font-bold px-2 py-0.5 rounded-full bg-emerald-50 !text-emerald-600 border border-emerald-100 flex items-center gap-1 !mb-0")}>
                                <Star className="w-2.5 h-2.5" /> PUSHKARA
                            </span>
                        ) : (
                            <span className={cn(TYPOGRAPHY.label, "text-[9px] !font-bold px-2 py-0.5 rounded-full bg-surface-warm !text-ink/35 border border-gold-primary/10 !mb-0")}>
                                NOT IN PUSHKARA
                            </span>
                        )}
                    </div>
                    <div className={cn(TYPOGRAPHY.subValue, "flex items-center gap-4 mt-1.5 !text-ink/70 !mt-1")}>
                        <span className="font-bold">{SIGN_SYMBOLS[planet.sign] || ''} {planet.sign}</span>
                        <span>{planet.degree_formatted}</span>
                        <span className="text-ink/50">→ Nav: {planet.navamsha_sign}</span>
                    </div>
                    {isPushkara && planet.pushkara_navamsha.pushkara_range && (
                        <p className={cn(TYPOGRAPHY.subValue, "text-[10px] !text-emerald-600 !font-bold mt-1.5 tracking-wider !mt-1")}>
                            Range: {planet.pushkara_navamsha.pushkara_range} • Ruling: {planet.pushkara_navamsha.ruling_navamsha}
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// Planet Pushkara Card
// ============================================================================

function PlanetPushkaraCard({ planet, index }: { planet: PlanetData; index: number }) {
    const isPushkara = planet.pushkara_navamsha.is_pushkara;
    const isPushkaraBhaga = planet.pushkara_navamsha.is_pushkara_bhaga;
    const isVargottama = planet.pushkara_navamsha.is_vargottama;
    const colors = PLANET_COLORS[planet.name] || PLANET_COLORS['Sun'];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={cn(
                "relative rounded-2xl p-4 border transition-all duration-300 group",
                isPushkara
                    ? "bg-white border-2 shadow-md hover:shadow-lg"
                    : "bg-white/60 border border-gold-primary/15 hover:bg-white hover:border-gold-primary/20"
            )}
            style={{
                borderColor: isPushkara ? colors.border : undefined,
            }}
        >
            {/* Pushkara Glow */}
            {isPushkara && (
                <div
                    className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at top left, ${colors.primary}15, transparent 60%)` }}
                />
            )}

            <div className="relative z-10">
                {/* Header Row */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[14px] shadow-sm border transition-transform group-hover:scale-105",
                                isPushkara ? "border-current" : "border-gold-primary/15"
                            )}
                            style={{
                                backgroundColor: isPushkara ? colors.bg : 'rgba(0,0,0,0.02)',
                                color: isPushkara ? colors.primary : 'var(--ink)',
                                borderColor: isPushkara ? colors.border : undefined,
                            }}
                        >
                            {PLANET_ABBR[planet.name] || planet.name[0]}
                        </div>
                        <div>
                            <h4 className={cn(
                                TYPOGRAPHY.value,
                                "!text-[14px] font-bold tracking-tight",
                                isPushkara ? "" : "!text-ink/35"
                                , isPushkara && "!text-ink"
                            )}>
                                {planet.name}
                            </h4>
                            <p className={cn(
                                TYPOGRAPHY.subValue,
                                "text-[10px] !font-bold !mt-0",
                                isPushkara ? "!text-ink/60" : "!text-ink/25"
                            )}>
                                {planet.degree_formatted}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    {isPushkara ? (
                        <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                    ) : (
                        <XCircle className="w-4 h-4 text-ink/25" />
                    )}
                </div>

                {/* Sign & Navamsha */}
                <div className={cn(
                    TYPOGRAPHY.subValue,
                    "flex items-center gap-3 !mt-0 mb-2",
                    isPushkara ? "!text-ink/70" : "!text-ink/25"
                )}>
                    <div className="flex items-center gap-1">
                        <span className="text-[14px]">{SIGN_SYMBOLS[planet.sign] || ''}</span>
                        <span className="font-bold">{planet.sign}</span>
                    </div>
                    <span className={isPushkara ? "text-ink/30" : "text-ink/15"}>→</span>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-ink/40">NAV</span>
                        <span className="font-bold">{planet.navamsha_sign}</span>
                    </div>
                </div>

                {/* Pushkara Details */}
                {isPushkara && (
                    <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
                        {planet.pushkara_navamsha.pushkara_range && (
                            <div className={cn(TYPOGRAPHY.subValue, "flex items-center gap-2 text-[10px] mb-1.5 !mt-0")}>
                                <span className="font-bold text-ink/50 tracking-wider">RANGE</span>
                                <span className={cn("font-bold", colors.twText)}>{planet.pushkara_navamsha.pushkara_range}</span>
                            </div>
                        )}
                        {planet.pushkara_navamsha.ruling_navamsha && (
                            <div className={cn(TYPOGRAPHY.subValue, "flex items-center gap-2 text-[10px] mb-1.5 !mt-0")}>
                                <span className="font-bold text-ink/50 tracking-wider">RULING</span>
                                <span className={cn("font-bold", colors.twText)}>
                                    {SIGN_SYMBOLS[planet.pushkara_navamsha.ruling_navamsha] || ''} {planet.pushkara_navamsha.ruling_navamsha}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {isPushkaraBhaga && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 tracking-wider">
                                    BHAGA
                                </span>
                            )}
                            {isVargottama && (
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-100 tracking-wider">
                                    VARGOTTAMA
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Non-pushkara indicator */}
                {!isPushkara && (
                    <div className="mt-2 pt-2 border-t border-gold-primary/10">
                        <p className={cn(TYPOGRAPHY.subValue, "text-[9px] !font-bold !text-ink/25 tracking-wider !mt-0 uppercase")}>NOT IN PUSHKARA NAVAMSHA</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
