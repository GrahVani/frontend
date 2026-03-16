"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { parseChartData } from '@/lib/chart-helpers';
import type { BirthPanchangaData } from '@/components/astrology/BirthPanchanga';
import Link from 'next/link';
import {
    ArrowLeft,
    Clock,
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
    Sparkle,
} from 'lucide-react';

import { 
    usePanchang, 
    type PanchangDetail 
} from "@/hooks/queries/usePanchang";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { KnowledgeTooltip } from '@/components/knowledge';

// --- Icons for Avakhada ---
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

const PLANET_SYM: Record<string, string> = {
    Sun: '☉', Moon: '☽', Mars: '♂', Mercury: '☿', Jupiter: '♃',
    Venus: '♀', Saturn: '♄', Rahu: '☊', Ketu: '☋',
};
const PLANET_CLR: Record<string, string> = {
    Sun: '#B8650A', Moon: '#4A6FA5', Mars: '#A93226', Mercury: '#2D8B4E',
    Jupiter: '#B8860B', Venus: '#7E57C2', Saturn: '#455A64', Rahu: '#5D4037', Ketu: '#795548',
};
const PANCH_ACCENT: Record<string, string> = {
    Tithi: '#4A6FA5', Nakshatra: '#B8860B', Yoga: '#2E8B8B',
    Karana: '#8B5A2B', Vara: '#B8650A',
};

function shortTime(t: string): string {
    if (!t || t === '-') return '-';
    const p = t.split(':');
    return p.length >= 2 ? `${p[0]}:${p[1]}` : t;
}

// ============================================================================
// COMPONENT: DailyPanchangCard (The 5 segments moved from dashboard)
// ============================================================================
function DailyPanchangCard({ detail, label, icon, accent, term }: {
    detail: PanchangDetail; label: string; icon: string; accent: string; term?: string;
}) {
    const pct = typeof detail.progress === 'number' ? Math.min(100, detail.progress) : null;
    return (
        <div className="prem-card overflow-hidden relative" style={{ borderTop: `3px solid ${accent}` }}>
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(180deg, ${accent}30 0%, ${accent}08 50%, transparent 100%)` }} />
            <div className="relative p-5">
                <div className="flex items-center gap-2.5 mb-3">
                    <span className="text-[24px] leading-none" style={{ color: accent }}>{icon}</span>
                    <span className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: accent }}>
                        {term ? <KnowledgeTooltip term={term} unstyled>{label}</KnowledgeTooltip> : label}
                    </span>
                    {typeof detail.number === 'number' && (
                        <span className="text-[10px] font-mono font-bold ml-auto px-1.5 py-0.5 rounded"
                            style={{ color: accent, backgroundColor: `${accent}15` }}>
                            #{detail.number}
                        </span>
                    )}
                </div>
                <div className="text-[22px] font-serif font-bold text-ink leading-tight">{detail.name}</div>

                {detail.endTime && detail.endTime !== '-' && (
                    <div className="mt-3 text-[11px] font-bold text-ink flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gold-dark" />
                        Ends {shortTime(detail.endTime)}
                    </div>
                )}
                {pct !== null && (
                    <div className="mt-3 h-1.5 bg-surface-warm rounded-full overflow-hidden">
                        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: accent }} />
                    </div>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// COMPONENT: BirthPanchangaCard
// ============================================================================
function BirthPanchangaCard({
    label, sanskrit, value, subValue, description, icon: Icon, gradient, iconColor, borderColor
}: {
    label: React.ReactNode;
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
        <div className={cn("bg-gradient-to-br rounded-xl p-4 border transition-all hover:shadow-md group", gradient, borderColor)}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className={TYPOGRAPHY.label}>{label}</p>
                    <p className={cn(TYPOGRAPHY.subValue, "text-ink mt-0.5")}>{sanskrit}</p>
                </div>
                <div className="p-1.5 bg-white/80 rounded-lg shadow-xs group-hover:shadow-sm transition-shadow">
                    <Icon className={cn("w-4 h-4", iconColor)} />
                </div>
            </div>
            <p className={TYPOGRAPHY.value}>{value}</p>
            {subValue && ( <p className={TYPOGRAPHY.subValue}>{subValue}</p> )}
            <p className={cn(TYPOGRAPHY.subValue, "text-ink mt-2 whitespace-normal leading-snug")}>{description}</p>
        </div>
    );
}

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function PanchangaOverviewPage() {
    const { clientDetails, processedCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const activeSystem = ayanamsa.toLowerCase();

    // Today's Data
    const { data: dailyPanchang, isLoading: pLoading } = usePanchang();

    // Avakhada data state
    const [avakhadaData, setAvakhadaData] = useState<Record<string, any> | null>(null);
    const [avakhadaLoading, setAvakhadaLoading] = useState(true);

    // Birth Panchanga data
    const birthPanchangaData = processedCharts['birth_panchanga_universal']?.chartData as unknown as BirthPanchangaData | undefined;
    const panchanga = birthPanchangaData?.panchanga;
    const times = birthPanchangaData?.times;

    // Fetch Avakhada data
    useEffect(() => {
        const fetchAvakhada = async () => {
            if (!clientDetails?.id) return;
            setAvakhadaLoading(true);
            try {
                const result = await clientApi.getAvakhadaChakra(clientDetails.id);
                const rawData = (result as any).chartData || (result as any).data || result;
                setAvakhadaData((rawData as any).avakhada_chakra || rawData);
            } catch (err) { console.error(err); } finally { setAvakhadaLoading(false); }
        };
        fetchAvakhada();
    }, [clientDetails?.id]);

    if (!clientDetails) { return <div className="p-12 text-center font-bold font-serif text-ink italic"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-primary mb-2" /> Loading Client Context...</div>; }

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
                <div>
                    <div className={TYPOGRAPHY.breadcrumb}>
                        <div className="flex items-center gap-2 mb-1">
                            <Link href="/vedic-astrology/overview" className="hover:text-gold-primary flex items-center gap-1 transition-colors font-bold">
                                <ArrowLeft className="w-3 h-3" /> Kundali
                            </Link>
                            <span className="text-ink">/</span>
                            <span>Panchanga</span>
                        </div>
                    </div>
                    <h1 className="text-[28px] font-serif font-bold text-ink tracking-tight">
                        <KnowledgeTooltip term="panchanga" unstyled>Panchanga</KnowledgeTooltip> Analysis
                    </h1>
                </div>
                <div className="text-[14px] font-serif italic text-ink font-bold">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
            </div>

            {/* ── SECTION 1: TODAY'S PANCHANGA (The 5 Segments) ── */}
            <div className="space-y-4">
                <h2 className="text-[18px] font-serif font-bold text-ink flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gold-dark" /> Today's Five Limbs
                </h2>
                {pLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-32 bg-surface-warm animate-pulse rounded-2xl" />)}
                    </div>
                ) : dailyPanchang ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <DailyPanchangCard detail={dailyPanchang.tithi} label="Tithi" icon="☾" accent={PANCH_ACCENT.Tithi} term="tithi" />
                        <DailyPanchangCard detail={dailyPanchang.nakshatra} label="Nakshatra" icon="✦" accent={PANCH_ACCENT.Nakshatra} term="nakshatra" />
                        <DailyPanchangCard detail={dailyPanchang.yoga} label="Yoga" icon="⊕" accent={PANCH_ACCENT.Yoga} term="panchanga_yoga" />
                        <DailyPanchangCard detail={dailyPanchang.karana} label="Karana" icon="◈" accent={PANCH_ACCENT.Karana} term="karana" />
                        <DailyPanchangCard detail={dailyPanchang.vara} label="Vara" icon="☉" accent={PANCH_ACCENT.Vara} term="vara" />
                    </div>
                ) : null}
            </div>

            {/* ── SECTION 2: BIRTH PANCHANGA (Client Specific) ── */}
            <div className="prem-card rounded-2xl overflow-hidden bg-surface-warm">
                <div className="bg-gold-primary/10 px-5 py-3 border-b border-gold-primary/15">
                    <h3 className={TYPOGRAPHY.sectionTitle}>
                        Birth <KnowledgeTooltip term="panchanga" unstyled>Panchanga</KnowledgeTooltip> for {clientDetails.name}
                    </h3>
                </div>
                <div className="p-5">
                    {panchanga ? (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-5">
                            <BirthPanchangaCard label="Tithi" sanskrit="तिथि" value={panchanga.tithi?.name || '—'} subValue={panchanga.tithi?.paksha} description="Lunar phase at birth" icon={Moon} gradient="from-indigo-50 to-blue-50" iconColor="text-indigo-500" borderColor="border-indigo-200" />
                            <BirthPanchangaCard label="Nakshatra" sanskrit="नक्षत्र" value={panchanga.nakshatra?.name || '—'} subValue={panchanga.nakshatra?.pada ? `Pada ${panchanga.nakshatra.pada}` : undefined} description="Birth star at birth moment" icon={Star} gradient="from-amber-50 to-yellow-50" iconColor="text-amber-500" borderColor="border-amber-200" />
                            <BirthPanchangaCard label="Yoga" sanskrit="योग" value={panchanga.yoga?.name || '—'} description="Sun-Moon angular relationship" icon={RefreshCcw} gradient="from-teal-50 to-emerald-50" iconColor="text-teal-500" borderColor="border-teal-200" />
                            <BirthPanchangaCard label="Karana" sanskrit="करण" value={panchanga.karana?.name || '—'} description="Sub-division of the lunar day" icon={CalendarDays} gradient="from-rose-50 to-pink-50" iconColor="text-rose-500" borderColor="border-rose-200" />
                            <BirthPanchangaCard label="Vara" sanskrit="वार" value={panchanga.vara?.name || '—'} description="Planetary ruler of birth day" icon={Sun} gradient="from-orange-50 to-amber-50" iconColor="text-orange-500" borderColor="border-orange-200" />
                        </div>
                    ) : <Loader2 className="animate-spin mx-auto text-gold-primary" />}
                    
                    {times && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50/80 to-transparent rounded-xl border border-amber-200/30">
                                <Sunrise className="w-5 h-5 text-amber-500" />
                                <div><p className={TYPOGRAPHY.label}>Sunrise</p><p className={TYPOGRAPHY.value}>{times.sunrise?.time || '—'}</p></div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50/80 to-transparent rounded-xl border border-indigo-200/30">
                                <Sunset className="w-5 h-5 text-indigo-500" />
                                <div><p className={TYPOGRAPHY.label}>Sunset</p><p className={TYPOGRAPHY.value}>{times.sunset?.time || '—'}</p></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── SECTION 3: AVAKHADA CHAKRA (Full Restored Version) ── */}
            <div className="prem-card rounded-2xl overflow-hidden bg-surface-warm">
                <div className="bg-gold-primary/10 px-5 py-3 border-b border-gold-primary/15">
                    <h3 className={TYPOGRAPHY.sectionTitle}>
                        <KnowledgeTooltip term="avakhada_chakra" unstyled>Avakhada Chakra</KnowledgeTooltip>
                    </h3>
                </div>
                
                {avakhadaLoading ? (
                    <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gold-primary" /></div>
                ) : avakhadaData && (
                    <div className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {[
                                {
                                    key: "varna",
                                    label: "Varna",
                                    description: "Represents the inherent temperament, ego, and spiritual inclination. Categorized into Brahmin, Kshatriya, Vaishya, Shudra.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'brahmin' ? "Indicates a natural inclination towards intellectual pursuits, teaching, learning, and spiritual matters." : null,
                                    icon: Shield, color: 'from-amber-500/10 to-orange-500/10', borderColor: 'border-amber-200/50', bgColor: 'bg-amber-100/50', textColor: 'text-amber-900', titleColor: 'text-amber-700'
                                },
                                {
                                    key: "vashya",
                                    label: "Vashya",
                                    description: "Translates to \"control\" or \"attraction.\" Evaluates mutual attraction and power dynamics in relationships.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'jalachara' ? "Jalachara (Water-dwelling) aligns with the water element of the Moon Sign." : null,
                                    icon: Anchor, color: 'from-blue-500/10 to-cyan-500/10', borderColor: 'border-blue-200/50', bgColor: 'bg-blue-100/50', textColor: 'text-blue-900', titleColor: 'text-blue-700'
                                },
                                {
                                    key: "nakshatra_pada",
                                    label: "Nakshatra - Pada",
                                    description: "The exact lunar mansion the Moon occupied at birth. Divided into 4 quarters (Padas).",
                                    getInChart: () => "Key coordinate for all calculations in this table.",
                                    icon: Star, color: 'from-yellow-500/10 to-amber-500/10', borderColor: 'border-yellow-200/50', bgColor: 'bg-yellow-100/50', textColor: 'text-yellow-900', titleColor: 'text-yellow-700'
                                },
                                {
                                    key: "yoni",
                                    label: "Yoni",
                                    description: "Assigns an animal archetype to the Nakshatra to assess instinctual and physical compatibility.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'marjara' ? "Marjara means Cat archetype." : null,
                                    icon: Hexagon, color: 'from-emerald-500/10 to-green-500/10', borderColor: 'border-emerald-200/50', bgColor: 'bg-emerald-100/50', textColor: 'text-emerald-900', titleColor: 'text-emerald-700'
                                },
                                {
                                    key: "gana",
                                    label: "Gana",
                                    description: "Temperament: Deva (Divine), Manushya (Human), or Rakshasa (Demon/Fierce). Reaction to challenges.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'rakshasa' ? "Indicates a strong-willed, independent, and highly protective nature." : null,
                                    icon: UsersIcon, color: 'from-violet-500/10 to-purple-500/10', borderColor: 'border-violet-200/50', bgColor: 'bg-violet-100/50', textColor: 'text-violet-900', titleColor: 'text-violet-700'
                                },
                                {
                                    key: "nadi",
                                    label: "Nadi",
                                    description: "Constitution: correlates to Ayurvedic doshas (Vata, Pitta, Kapha). Essential for genetic health.",
                                    getInChart: (val: string) => val?.toLowerCase() === 'antya' ? "Antya corresponds to Kapha (water/stability) energy." : null,
                                    icon: Activity, color: 'from-rose-500/10 to-pink-500/10', borderColor: 'border-rose-200/50', bgColor: 'bg-rose-100/50', textColor: 'text-rose-900', titleColor: 'text-rose-700'
                                },
                                {
                                    key: "rashi",
                                    label: "Rashi",
                                    description: "The Zodiac sign of the Moon at birth. Governs psychology, mind, and emotions.",
                                    getInChart: (val: string) => `${val} is the emotional foundation of this chart.`,
                                    icon: Moon, color: 'from-sky-500/10 to-blue-500/10', borderColor: 'border-sky-200/50', bgColor: 'bg-sky-100/50', textColor: 'text-sky-900', titleColor: 'text-sky-700'
                                },
                                {
                                    key: "rashi_lord",
                                    label: "Rashish (Lord)",
                                    description: "The planetary ruler of the Moon sign (Rashi).",
                                    getInChart: (val: string) => `${val} is the primary ruler of the mental state.`,
                                    icon: Sun, color: 'from-orange-500/10 to-red-500/10', borderColor: 'border-orange-200/50', bgColor: 'bg-orange-100/50', textColor: 'text-orange-900', titleColor: 'text-orange-700'
                                },
                                {
                                    key: "namakshar",
                                    label: "Naamakshar",
                                    description: "Auspicious phonetic syllable for naming, dictated by Nakshatra Pada.",
                                    getInChart: (val: string) => `Sound "${val}" is the spiritual seed for this identity.`,
                                    icon: TypeIcon, color: 'from-cyan-500/10 to-sky-500/10', borderColor: 'border-cyan-200/50', bgColor: 'bg-cyan-100/50', textColor: 'text-cyan-900', titleColor: 'text-cyan-700'
                                },
                                {
                                    key: "paya",
                                    label: "Paya (Footing)",
                                    description: "Refers to the \"footing\" on which the Moon arrived (Silver, Gold, Copper, etc.).",
                                    getInChart: (val: string) => val?.toLowerCase().includes('silver') ? "Silver Paya is considered highly auspicious and prosperous." : null,
                                    icon: Disc, color: 'from-stone-500/10 to-stone-500/5', borderColor: 'border-stone-200/50', bgColor: 'bg-stone-50/50', textColor: 'text-ink', titleColor: 'text-stone-700'
                                }
                            ].map((item) => {
                                let value = '';
                                if (item.key === 'nakshatra_pada') {
                                    value = `${avakhadaData?.nakshatra || avakhadaData?.Nakshatra || '—'} - Pada ${avakhadaData?.pada || avakhadaData?.Pada || '—'}`;
                                } else if (item.key === 'paya') {
                                    value = `${avakhadaData?.paya_rashi || avakhadaData?.Paya_Rashi || '—'} / ${avakhadaData?.paya_nakshatra || avakhadaData?.Paya_Nakshatra || '—'}`;
                                } else {
                                    value = String(avakhadaData?.[item.key] || avakhadaData?.[item.key.toLowerCase()] || avakhadaData?.[item.label] || '—');
                                }

                                const inChart = item.getInChart(value);

                                return (
                                    <div key={item.key} className={cn("rounded-2xl border p-5 flex flex-col h-full bg-gradient-to-br shadow-sm transition-all", item.color, item.borderColor)}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("p-2 rounded-xl bg-white/80 shadow-sm", item.titleColor)}>
                                                    <item.icon className="w-5 h-5" />
                                                </div>
                                                <h4 className="text-[15px] font-sans font-bold text-ink">{item.label}</h4>
                                            </div>
                                            <span className={cn("text-[18px] font-serif font-bold", item.titleColor)}>{value}</span>
                                        </div>
                                        <p className="text-[13px] font-medium text-ink/70 leading-relaxed mb-5 flex-grow font-sans">
                                            {item.description}
                                        </p>
                                        {inChart && (
                                            <div className={cn("mt-auto p-4 rounded-xl border border-white/20", item.bgColor)}>
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <Sparkle className={cn("w-3.5 h-3.5", item.titleColor)} />
                                                    <span className={cn("font-bold text-[11px] tracking-wider font-sans", item.titleColor)}>IN THIS CHART</span>
                                                </div>
                                                <p className={cn("text-[13px] font-medium leading-relaxed font-sans", item.textColor)}>
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
