"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Clock,
    ShieldAlert,
    ShieldCheck,
    AlertTriangle,
    Flame,
    HeartHandshake,
    Zap,
    TrendingUp,
    TrendingDown,
    ScrollText,
    Info,
    Calendar,
    HandHeart,
    Bell,
    CheckCircle2,
    XCircle,
    Star,
    Gem,
    BookOpen,
    Shield,
    Activity,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { PLANET_COLORS, getPlanetColor } from '@/design-tokens/colors';
import SadhanaChartPanel from '@/components/upaya/SadhanaChartPanel';
import styles from './RemedialShared.module.css';
import { useVedicClient } from '@/context/VedicClientContext';
import { KnowledgeTooltip } from '@/components/knowledge';

// ============================================================================
// Type Definitions — Maps the NEW JSON structure
// ============================================================================

interface StrengthAnalytics {
    current_rupas: number;
    is_combust: boolean;
    is_mathematically_weak: boolean;
    required_rupas: number;
}

interface GemstoneDetail {
    primary: string;
    weight: string;
}

interface PrescribedRemedy {
    type: string;
    text?: string;
    count?: number;
    rationale: string;
    item?: string;
    details?: GemstoneDetail;
    items?: string[];
}

interface PlanetaryAnalysisEntry {
    functional_role: string;
    prescribed_remedies: PrescribedRemedy[];
    strength_analytics: StrengthAnalytics;
}

interface DoshaReportEntry {
    description: string;
    present: boolean;
    severity: string;
}

interface DoshaRemedyEntry {
    dosha_name: string;
    remedies: string[];
    severity: string;
}

interface VimshottariDashaPeriod {
    planet: string;
    start_date: string;
    end_date: string;
    duration_years: number;
}

interface VimshottariDashas {
    birth_dasha_lord: string;
    current_dasha: VimshottariDashaPeriod;
    mahadashas: VimshottariDashaPeriod[];
}

interface YogaEntry {
    effect: string;
    planets: string[];
    present: boolean;
}

interface MetadataInfo {
    ascendant: string;
    ayanamsa: string;
    node_precision: string;
    strength_logic: string;
}

interface VedicRemediesJSON {
    planetary_analysis: Record<string, PlanetaryAnalysisEntry>;
    dosha_report: Record<string, DoshaReportEntry>;
    dosha_remedies: Record<string, DoshaRemedyEntry>;
    safety_warnings: string[];
    vimshottari_dashas: VimshottariDashas;
    yogas_report: Record<string, YogaEntry>;
    metadata: MetadataInfo;
    shadbala_rupas: Record<string, number>;
    success: boolean;
}

interface VedicRemediesDashboardProps {
    data: Record<string, unknown>;
}

// ============================================================================
// Utility Helpers
// ============================================================================

const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
        case 'high': return { badge: 'bg-rose-50 text-rose-700 border-rose-100', dot: 'bg-rose-500', bar: '#F43F5E' };
        case 'medium': return { badge: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500', bar: '#F59E0B' };
        case 'low': return { badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500', bar: '#10B981' };
        default: return { badge: 'bg-primary/5 text-primary border-primary/10', dot: 'bg-primary/30', bar: '#94A3B8' };
    }
};

const getFunctionalRoleStyle = (role?: string) => {
    const r = role || '';
    if (r.includes('Benefic')) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    if (r.includes('Malefic')) return 'bg-rose-50 text-rose-700 border-rose-100';
    return 'bg-blue-50 text-blue-700 border-blue-100';
};

const getRupaBarColor = (current: number, required: number, isWeak: boolean) => {
    if (isWeak) return '#F43F5E';
    if (current >= required * 1.3) return '#8B5CF6';
    if (current >= required) return '#10B981';
    return '#F59E0B';
};

// ============================================================================
// Section: Current Dasha Card
// ============================================================================
const CurrentDashaCard = ({ dashas }: { dashas: VimshottariDashas }) => {
    const { current_dasha, birth_dasha_lord } = dashas;
    const planetTheme = getPlanetColor(current_dasha.planet);

    const start = new Date(current_dasha.start_date).getTime();
    const end = new Date(current_dasha.end_date).getTime();
    const now = Date.now();
    const progress = Math.min(Math.max(((now - start) / (end - start)) * 100, 0), 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("p-4 relative overflow-hidden flex flex-col rounded-2xl border border-amber-200/60", styles.glassPanel)}
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 bg-gradient-to-br", planetTheme.gradient)}>
                        <span className="text-xl font-serif leading-none mt-0.5">{planetTheme.symbol}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 leading-none mb-1">
                            <h2 className="text-[22px] font-semibold text-primary">{current_dasha.planet}</h2>
                            <span className="text-[14px] tracking-[0.1em] text-primary uppercase">Mahadasha</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[14px] text-primary">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(current_dasha.start_date).getFullYear()} – {new Date(current_dasha.end_date).getFullYear()}</span>
                            <span className="text-primary mx-1">·</span>
                            <span>{current_dasha.duration_years} yrs</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 min-w-[140px] max-w-[200px] flex-1">
                    <div className="flex justify-between w-full text-[11px] tracking-wider text-primary">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-primary/5 relative overflow-hidden border border-primary/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={cn("h-full relative shadow-sm bg-gradient-to-r", planetTheme.gradient)}
                        />
                    </div>
                </div>
            </div>

            {/* Birth Dasha Lord info */}
            <div className="mt-2.5 flex items-center gap-2 text-[14px] text-primary">
                <Star className="w-4 h-4" />
                <span>Birth Dasha Lord: <span className="text-primary font-medium">{birth_dasha_lord}</span></span>
            </div>
        </motion.div>
    );
};

// ============================================================================
// Section: Planetary Analysis Grid (Shadbala Strength + Functional Role)
// ============================================================================
const PlanetaryStrengthGrid = ({ analysis, shadbala }: { analysis: Record<string, PlanetaryAnalysisEntry>; shadbala: Record<string, number> }) => {
    const planets = Object.entries(analysis).sort((a, b) => {
        if (a[1].strength_analytics.is_mathematically_weak !== b[1].strength_analytics.is_mathematically_weak)
            return a[1].strength_analytics.is_mathematically_weak ? -1 : 1;
        return a[1].strength_analytics.current_rupas - b[1].strength_analytics.current_rupas;
    });

    return (
        <div className={cn("p-3 relative overflow-hidden flex flex-col rounded-2xl border border-amber-200/60", styles.glassPanel)}>
            <div className="flex items-center justify-between mb-3 px-1">
                <div>
                    <h3 className="text-[18px] font-semibold tracking-tight flex items-center gap-2 text-primary">
                        <Zap className="w-5 h-5 text-purple-600 fill-purple-600/20" />
                        Planetary
                    </h3>
                    <p className="text-[13px] tracking-wide text-primary mt-0.5">Strength · Status · Afflictions</p>
                </div>
                <div className="flex items-center gap-3 text-[13px] font-medium">
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Strong</span>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-100">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Weak</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {planets.map(([name, data], idx) => {
                    const theme = PLANET_COLORS[name] || PLANET_COLORS.Sun;
                    const sa = data.strength_analytics;
                    const barColor = getRupaBarColor(sa.current_rupas, sa.required_rupas, sa.is_mathematically_weak);
                    const rupaPercent = Math.min((sa.current_rupas / 10) * 100, 100);

                    return (
                        <motion.div
                            key={name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.04 }}
                            className={cn(
                                "group relative border rounded-xl p-2.5 transition-all flex flex-col gap-1.5 bg-white/30 hover:bg-white",
                                sa.is_mathematically_weak ? "border-rose-100 shadow-sm" : "border-amber-100 hover:border-amber-300/60"
                            )}
                        >
                            {/* Planet + Score */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-white font-serif text-sm shadow-md bg-gradient-to-br", theme.gradient)}>
                                        {theme.symbol}
                                    </div>
                                    <h4 className="text-[16px] font-semibold text-primary tracking-tight leading-none">{name}</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-[17px] font-semibold text-primary" style={{ color: barColor }}>{sa.current_rupas.toFixed(1)}</span>
                                    <span className="text-[12px] text-primary ml-0.5">R</span>
                                </div>
                            </div>

                            {/* Rupa Bar */}
                            <div className="relative h-1.5 rounded-full bg-primary/5 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${rupaPercent}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: barColor }}
                                />
                                {/* Required marker */}
                                <div
                                    className="absolute top-0 h-full w-px bg-primary/20"
                                    style={{ left: `${(sa.required_rupas / 10) * 100}%` }}
                                    title={`Required: ${sa.required_rupas} Rupas`}
                                />
                            </div>

                            {/* Functional Status */}
                            <div className={cn(
                                "text-[13px] px-2 py-1.5 rounded-md border text-center truncate font-medium",
                                getFunctionalRoleStyle(data.functional_role)
                            )}>
                                {data.functional_role === 'Benefic' ? 'Functional Benefic' :
                                    data.functional_role === 'Malefic' ? 'Functional Malefic' :
                                        data.functional_role || 'Neutral'}
                            </div>

                            {/* Afflictions */}
                            <div className="flex flex-wrap gap-1 min-h-[22px] content-start">
                                {sa.is_combust && (
                                    <span className="text-[12px] px-2 py-0.5 bg-rose-500/[0.04] text-rose-700 border border-rose-500/20 rounded-md flex items-center gap-1.5">
                                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> Combust
                                    </span>
                                )}
                                {sa.is_mathematically_weak && (
                                    <span className="text-[12px] px-2 py-0.5 bg-rose-500/[0.04] text-rose-700 border border-rose-500/20 rounded-md flex items-center gap-1.5">
                                        <TrendingDown className="w-3.5 h-3.5 shrink-0" /> Weak
                                    </span>
                                )}
                                {!sa.is_combust && !sa.is_mathematically_weak && (
                                    <span className="text-[12px] text-primary px-1">Neutral</span>
                                )}
                            </div>

                            {sa.is_mathematically_weak && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-rose-400/30 rounded-full blur-[1px]" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// Section: Dosha Report (Active Doshas Detected)
// ============================================================================
const DoshaReportSection = ({ doshaReport, doshaRemedies }: { doshaReport: Record<string, DoshaReportEntry>; doshaRemedies: Record<string, DoshaRemedyEntry> }) => {
    const doshaList = Object.entries(doshaReport).filter(([, d]) => d.present);
    if (doshaList.length === 0) return null;

    return (
        <div className={cn("p-3 relative overflow-hidden rounded-2xl border border-amber-200/60", styles.glassPanel)}>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ScrollText className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-[18px] font-semibold text-primary tracking-tight leading-none mb-1">Active Doshas</h3>
                    <p className="text-[13px] tracking-wide text-primary">Karmic afflictions detected · with remedies</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {doshaList.map(([key, dosha], idx) => {
                    const sevStyles = getSeverityColor(dosha.severity);
                    const remedies = doshaRemedies[key];

                    return (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.06 }}
                            className="group border rounded-xl p-3 transition-all bg-white/30 hover:bg-white border-amber-200/60 hover:border-amber-300/60"
                        >
                            {/* Dosha Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center border border-amber-200/60">
                                        <ShieldAlert className="w-5 h-5 text-rose-500" />
                                    </div>
                                    <h4 className="text-[16px] font-semibold tracking-tight text-primary">
                                        {key.replace(/_/g, ' ')}
                                    </h4>
                                </div>
                                <span className={cn("text-[13px] font-medium tracking-wide px-3 py-0.5 rounded-full border", sevStyles.badge)}>
                                    {dosha.severity.toUpperCase()}
                                </span>
                            </div>

                            {/* Description */}
                            <p className="text-[14px] text-primary leading-relaxed mb-3 px-1">{dosha.description}</p>

                            {/* Remedies for this dosha */}
                            {remedies && remedies.remedies.length > 0 && (
                                <div className="space-y-1.5 mt-2">
                                    <p className="text-[12px] font-semibold tracking-widest text-primary uppercase px-1">Prescribed Remedies</p>
                                    {remedies.remedies.map((remedy, i) => {
                                        const getIcon = (text: string) => {
                                            const t = text.toLowerCase();
                                            if (t.includes('puja') || t.includes('worship') || t.includes('tarpan')) return <Bell className="w-4 h-4 text-purple-600" />;
                                            if (t.includes('mantra') || t.includes('chalisa') || t.includes('recite')) return <Flame className="w-4 h-4 text-orange-600" />;
                                            if (t.includes('donate') || t.includes('feed')) return <HeartHandshake className="w-4 h-4 text-pink-600" />;
                                            return <HandHeart className="w-4 h-4 text-emerald-600" />;
                                        };
                                        return (
                                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-white shadow-sm rounded-lg border border-amber-200/60 hover:border-amber-300 transition-all">
                                                <div className="w-8 h-8 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                                                    {getIcon(remedy)}
                                                </div>
                                                <span className="text-[14px] font-medium text-primary leading-tight">{remedy}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// Section: Planetary Remedies (Mantras, Gemstones, Charity)
// ============================================================================
const PlanetaryRemediesGrid = ({ analysis }: { analysis: Record<string, PlanetaryAnalysisEntry> }) => {
    const planets = Object.entries(analysis).filter(([, entry]) => entry.prescribed_remedies.length > 0);
    if (planets.length === 0) return null;

    return (
        <div className={cn("p-3 relative overflow-hidden rounded-2xl border border-amber-200/60", styles.glassPanel)}>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                    <h3 className="text-[18px] font-semibold text-primary tracking-tight leading-none mb-1">Planetary Remedies</h3>
                    <p className="text-[13px] tracking-wide text-primary">Mantras · Gemstones · Charity (Daana)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {planets.map(([planet, entry], idx) => {
                    const theme = getPlanetColor(planet);
                    const sa = entry.strength_analytics;
                    const mantras = entry.prescribed_remedies.filter(r => r.type === 'Mantra');
                    const gemstones = entry.prescribed_remedies.filter(r => r.type === 'Gemstone');
                    const charities = entry.prescribed_remedies.filter(r => r.type === 'Charity (Daana)');

                    return (
                        <motion.div
                            key={planet}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="group border rounded-xl p-3 transition-all bg-white/30 hover:bg-white border-amber-100 hover:border-amber-300/60"
                        >
                            {/* Planet Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center text-white font-serif text-lg shadow-md bg-gradient-to-br", theme.gradient)}>
                                        {theme.symbol}
                                    </div>
                                    <div>
                                        <h4 className="text-[16px] font-semibold text-primary tracking-tight leading-none mb-1">{planet}</h4>
                                        <span className={cn(
                                            "text-[12px] px-2 py-0.5 rounded-full border inline-block font-medium",
                                            getFunctionalRoleStyle(entry.functional_role)
                                        )}>
                                            {entry.functional_role}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[12px] font-medium text-primary tracking-widest">STR</span>
                                    <span className="text-[18px] font-semibold text-primary">{sa.current_rupas.toFixed(1)}</span>
                                </div>
                            </div>

                            {/* Remedy Cards Row */}
                            <div className="flex gap-2 flex-wrap">
                                {mantras.map((m, mi) => (
                                    <div key={`m-${mi}`} className="flex-1 min-w-[200px] bg-orange-50/40 border border-orange-100/50 rounded-lg p-3 hover:bg-orange-50/80 transition-colors">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Flame className="w-4 h-4 text-orange-600" />
                                            <span className="text-[12px] font-semibold tracking-wider text-orange-700 uppercase">Mantra</span>
                                        </div>
                                        <p className="text-[15px] leading-snug text-primary font-medium mb-2">"{m.text}"</p>
                                        <div className="flex flex-wrap gap-1">
                                            <span className="text-[12px] px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-medium">
                                                {(m.count || 0).toLocaleString()} chants
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-primary mt-2 leading-relaxed">{m.rationale}</p>
                                    </div>
                                ))}
                                {gemstones.map((g, gi) => (
                                    <div key={`g-${gi}`} className="flex-1 min-w-[200px] bg-violet-50/40 border border-violet-100/50 rounded-lg p-3 hover:bg-violet-50/80 transition-colors">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Gem className="w-4 h-4 text-violet-600" />
                                            <span className="text-[12px] font-semibold tracking-wider text-violet-700 uppercase">Gemstone</span>
                                        </div>
                                        <p className="text-[16px] font-bold text-primary mb-1">{g.details?.primary || g.item}</p>
                                        {g.details?.weight && (
                                            <span className="text-[12px] px-3 py-1 rounded-full bg-violet-100 text-violet-900 font-medium inline-block mb-1">
                                                {g.details.weight}
                                            </span>
                                        )}
                                        <p className="text-[12px] text-primary mt-1.5 leading-relaxed">{g.rationale}</p>
                                    </div>
                                ))}
                                {charities.map((c, ci) => (
                                    <div key={`c-${ci}`} className="flex-1 min-w-[200px] bg-pink-50/40 border border-pink-100/50 rounded-lg p-3 hover:bg-pink-50/80 transition-colors">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <HeartHandshake className="w-4 h-4 text-pink-600" />
                                            <span className="text-[12px] font-semibold tracking-wider text-pink-700 uppercase">Charity (Daana)</span>
                                        </div>
                                        <p className="text-[15px] text-primary font-medium leading-snug mb-2">
                                            <span className="text-[12px] tracking-tight text-primary mr-1.5">Items:</span>
                                            {(c.items || []).join(', ')}
                                        </p>
                                        <p className="text-[12px] text-primary mt-1 leading-relaxed">{c.rationale}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// Section: Yogas Report
// ============================================================================
const YogasSection = ({ yogas }: { yogas: Record<string, YogaEntry> }) => {
    const yogaList = Object.entries(yogas).filter(([, y]) => y.present);
    if (yogaList.length === 0) return null;

    return (
        <div className={cn("p-3 relative overflow-hidden rounded-2xl border border-amber-200/60", styles.glassPanel)}>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-[15px] font-semibold text-primary tracking-tight leading-none mb-1">Active Yogas</h3>
                    <p className="text-[11px] tracking-wider text-primary">Beneficial planetary combinations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {yogaList.map(([key, yoga], idx) => (
                    <motion.div
                        key={key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border rounded-xl p-3 bg-white/30 hover:bg-white border-amber-200/60 hover:border-amber-300/60 transition-all"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-indigo-100">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                                </div>
                                <h4 className="text-[14px] font-semibold tracking-tight text-primary">
                                    {key.replace(/_/g, ' ')}
                                </h4>
                            </div>
                            <span className="text-[11px] tracking-wider px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-100">
                                ACTIVE
                            </span>
                        </div>
                        <p className="text-[12px] text-primary leading-relaxed px-1 mb-2">{yoga.effect}</p>
                        <div className="flex items-center gap-1.5 px-1">
                            <span className="text-[10px] tracking-widest text-primary uppercase">Planets:</span>
                            {yoga.planets.map(p => {
                                const pTheme = getPlanetColor(p);
                                return (
                                    <span key={p} className={cn("text-[11px] px-2 py-0.5 rounded-md font-medium", pTheme.bgSoft, pTheme.textOnSoft)}>
                                        {p}
                                    </span>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// Section: Mahadasha Timeline
// ============================================================================
const MahadashaTimeline = ({ mahadashas, currentPlanet }: { mahadashas: VimshottariDashaPeriod[]; currentPlanet: string }) => {
    return (
        <div className={cn("p-3 relative overflow-hidden rounded-2xl border border-amber-200/60", styles.glassPanel)}>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-[18px] font-semibold text-primary tracking-tight leading-none mb-1">Mahadasha Timeline</h3>
                    <p className="text-[13px] tracking-wide text-primary">Complete Vimshottari Dasha Sequence</p>
                </div>
            </div>

            <div className="flex gap-1.5 items-end flex-wrap">
                {mahadashas.map((dasha, idx) => {
                    const theme = getPlanetColor(dasha.planet);
                    const isCurrent = dasha.planet === currentPlanet;
                    const now = Date.now();
                    const end = new Date(dasha.end_date).getTime();
                    const isPast = now > end;

                    const minWidth = 48;
                    const widthPx = Math.max(minWidth, dasha.duration_years * 5);

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ delay: idx * 0.06 }}
                            style={{ width: `${widthPx}px`, minWidth: `${minWidth}px` }}
                            className={cn(
                                "flex flex-col items-center gap-1 py-2 px-1 rounded-lg border transition-all",
                                isCurrent ? "bg-amber-50 border-amber-200 shadow-md ring-1 ring-amber-300/50" :
                                    isPast ? "bg-primary/[0.02] border-primary/5 opacity-60" :
                                        "bg-white/40 border-amber-100 hover:bg-white/70"
                            )}
                        >
                            <div className={cn(
                                "w-7 h-7 rounded-md flex items-center justify-center text-white font-serif text-[13px] shadow-sm bg-gradient-to-br",
                                theme.gradient,
                                isPast && "opacity-50"
                            )}>
                                {theme.symbol}
                            </div>
                            <span className={cn("text-[13px] font-medium text-primary", isPast && "text-primary")}>{dasha.planet.slice(0, 3)}</span>
                            <span className="text-[12px] font-medium text-primary">{dasha.duration_years}y</span>
                            <span className="text-[11px] text-primary font-mono">
                                {new Date(dasha.start_date).getFullYear()}
                            </span>
                            {isCurrent && (
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// Section: Safety Warnings
// ============================================================================
const SafetyWarningsSection = ({ warnings }: { warnings: string[] }) => {
    if (!warnings || warnings.length === 0) return null;

    return (
        <div className={cn("p-3 relative overflow-hidden rounded-2xl border border-rose-100", styles.glassPanel)}>
            <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                    <h3 className="text-[18px] font-semibold text-primary tracking-tight leading-none mb-1">Alerts</h3>
                    <p className="text-[13px] tracking-wide text-primary">Critical gemstone restrictions</p>
                </div>
            </div>

            <div className="space-y-1.5">
                {warnings.map((warning, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex items-start gap-3 px-4 py-3 bg-rose-50/30 border border-rose-100 rounded-lg"
                    >
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <p className="text-[15px] font-medium text-rose-900 leading-snug">{warning.replace(/STRICT\s+PROHIBITION:\s*/gi, '')}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// Section: Metadata Footer
// ============================================================================
const MetadataFooter = ({ meta }: { meta: MetadataInfo }) => {
    return (
        <div className="flex items-center gap-6 flex-wrap px-4 py-3 bg-primary/[0.03] rounded-xl border border-amber-200/60">
            <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <span className="text-[13px] font-medium text-primary">Ascendant:</span>
                <span className="text-[15px] font-bold text-primary">{meta.ascendant}</span>
            </div>
            <div className="w-px h-4 bg-primary/10" />
            <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-primary">Ayanamsa:</span>
                <span className="text-[15px] font-bold text-primary">{meta.ayanamsa}</span>
            </div>
            <div className="w-px h-4 bg-primary/10" />
            <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-primary">Node:</span>
                <span className="text-[15px] font-bold text-primary">{meta.node_precision}</span>
            </div>
            <div className="w-px h-4 bg-primary/10 flex-shrink-0" />
            <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium text-primary">Strength:</span>
                <span className="text-[15px] font-bold text-primary truncate max-w-[250px]">{meta.strength_logic}</span>
            </div>
        </div>
    );
};

// ============================================================================
// Main VedicRemediesDashboard — Full JSON Mapping
// ============================================================================
const VedicRemediesDashboard: React.FC<VedicRemediesDashboardProps> = ({ data }) => {
    const { processedCharts } = useVedicClient();

    // Cast to typed structure
    const typedData = data as unknown as VedicRemediesJSON;

    const planetaryAnalysis = typedData?.planetary_analysis || {};
    const doshaReport = typedData?.dosha_report || {};
    const doshaRemedies = typedData?.dosha_remedies || {};
    const safetyWarnings = typedData?.safety_warnings || [];
    const vimshottariDashas = typedData?.vimshottari_dashas || { birth_dasha_lord: '', current_dasha: { planet: '', start_date: '', end_date: '', duration_years: 0 }, mahadashas: [] };
    const yogasReport = typedData?.yogas_report || {};
    const metadata = typedData?.metadata || { ascendant: '', ayanamsa: '', node_precision: '', strength_logic: '' };
    const shabdalaRupas = typedData?.shadbala_rupas || {};

    // Fallback for D1 Chart
    const d1Chart = processedCharts["D1_lahiri"]?.chartData;

    return (
        <div className={cn("h-full overflow-hidden flex flex-col", styles.dashboardContainer)} style={{ margin: 0, borderRadius: '1rem' }}>
            {/* Header Area */}
            <div className="flex items-center justify-between border-b border-amber-300/60 px-5 py-2.5 shrink-0 bg-amber-50/50">
                <div className="flex items-center gap-3">
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-[24px] font-bold tracking-tight !mb-0")}>
                        Vedic <KnowledgeTooltip term="general_upaya">Remedies</KnowledgeTooltip>
                    </h2>
                    {metadata.ascendant && (
                        <span className="text-[13px] font-bold tracking-[0.1em] text-primary bg-primary/[0.05] px-3 py-1 rounded-full uppercase border border-primary/5">
                            {metadata.ascendant} LAGNA
                        </span>
                    )}
                </div>
            </div>

            {/* Main Split Layout: 30% Chart | 70% Data */}
            <div className="flex-1 flex overflow-hidden min-h-0">

                {/* LEFT SIDE: Only Chart — Fixed, No Scroll, 30% */}
                <div className="w-[30%] shrink-0 flex flex-col overflow-hidden border-r border-amber-200/60">
                    <SadhanaChartPanel
                        chartData={d1Chart}
                        doshaStatus={{}}
                    />
                </div>

                {/* RIGHT SIDE: Scrollable Content, 70% */}
                <div className="w-[70%] overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(180,83,9,0.2) transparent' }}>
                    <div className="p-3 space-y-2">

                        {/* 1. Current Dasha Period */}
                        {vimshottariDashas.current_dasha?.planet && (
                            <CurrentDashaCard dashas={vimshottariDashas} />
                        )}

                        {/* 2. Planetary Vigor (Strength Grid with Shadbala) */}
                        {Object.keys(planetaryAnalysis).length > 0 && (
                            <PlanetaryStrengthGrid analysis={planetaryAnalysis} shadbala={shabdalaRupas} />
                        )}

                        {/* 3. Active Doshas + Dosha Remedies Combined */}
                        <DoshaReportSection doshaReport={doshaReport} doshaRemedies={doshaRemedies} />

                        {/* 4. Planetary Remedies (Mantras + Gemstones + Charity) */}
                        <PlanetaryRemediesGrid analysis={planetaryAnalysis} />

                        {/* 5. Active Yogas */}
                        <YogasSection yogas={yogasReport} />

                        {/* 6. Mahadasha Timeline */}
                        {vimshottariDashas.mahadashas?.length > 0 && (
                            <MahadashaTimeline
                                mahadashas={vimshottariDashas.mahadashas}
                                currentPlanet={vimshottariDashas.current_dasha?.planet}
                            />
                        )}

                        {/* 7. Safety Warnings */}
                        <SafetyWarningsSection warnings={safetyWarnings} />

                        {/* 8. Metadata Footer */}
                        {metadata.ascendant && (
                            <MetadataFooter meta={metadata} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VedicRemediesDashboard;
