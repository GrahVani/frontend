"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    X, Loader2, AlertCircle, Sparkles, Layers, Shield, Globe, Gem, Star
} from 'lucide-react';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import type { CustomizeChartItem, WidgetSize } from '@/hooks/useCustomizeCharts';
import type { ShadbalaData } from '@/app/vedic-astrology/shadbala/page';
import type { PushkaraData } from '@/app/vedic-astrology/pushkara-navamsha/page';
import type { CharaKarakasResponse } from '@/app/vedic-astrology/chara-karakas/page';
import { useVedicClient } from '@/context/VedicClientContext';
import dynamic from 'next/dynamic';

// Lazy load the heavy dashboard components
const ShadbalaDashboard = dynamic(() => import('@/app/vedic-astrology/shadbala/page').then(m => ({ default: m.ShadbalaDashboard })));
const PushkaraDashboard = dynamic(() => import('@/app/vedic-astrology/pushkara-navamsha/page').then(m => ({ default: m.PushkaraDashboard })));
const KarakaDashboard = dynamic(() => import('@/app/vedic-astrology/chara-karakas/page').then(m => ({ default: m.KarakaDashboard })));
const YogaAnalysisView = dynamic(() => import('@/components/astrology/YogaAnalysis'));
const DoshaAnalysis = dynamic(() => import('@/components/astrology/DoshaAnalysis'));
const DailyTransitView = dynamic(() => import('@/components/transits/DailyTransitView'));
const UpayaDashboard = dynamic(() => import('@/components/upaya/UpayaDashboard'));
const SudarshanChakraFinal = dynamic(() => import('@/components/astrology/SudarshanChakraFinal'));
const ShodashaVargaTable = dynamic(() => import('@/components/astrology/ShodashaVargaTable'));

// ═══════════════════════════════════════════════════════════════════════════════
// WIDGET BOX COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface WidgetBoxProps {
    widget: CustomizeChartItem;
    onRemove: () => void;
    clientId: string;
    activeSystem: string;
    size?: WidgetSize;
    collapsed?: boolean;
    onSizeChange?: (size: WidgetSize) => void;
    onDuplicate?: () => void;
    onCollapseToggle?: () => void;
}

const SIZE_OPTIONS: { key: WidgetSize; label: string }[] = [
    { key: 'small', label: 'S' },
    { key: 'medium', label: 'M' },
    { key: 'large', label: 'L' },
    { key: 'full', label: 'F' },
];

function SizeToggle({ size, onChange }: { size: WidgetSize; onChange?: (s: WidgetSize) => void }) {
    return (
        <div className="flex items-center bg-surface-warm rounded-lg p-0.5">
            {SIZE_OPTIONS.map(opt => (
                <button
                    key={opt.key}
                    onClick={() => onChange?.(opt.key)}
                    className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px] font-bold transition-all min-w-[20px]",
                        size === opt.key
                            ? "bg-primary text-white shadow-sm"
                            : "text-ink/40 hover:text-ink hover:bg-white"
                    )}
                    title={`Size: ${opt.label}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

// Helper for widget card shell
function WidgetCard({
    widget,
    onRemove,
    children,
    className,
    size = 'medium',
    collapsed = false,
    onSizeChange,
    onDuplicate,
    onCollapseToggle,
}: {
    widget: CustomizeChartItem;
    onRemove: () => void;
    children: React.ReactNode;
    className?: string;
    size?: WidgetSize;
    collapsed?: boolean;
    onSizeChange?: (s: WidgetSize) => void;
    onDuplicate?: () => void;
    onCollapseToggle?: () => void;
}) {
    const getCategoryColor = () => {
        switch (widget.category) {
            case 'widget_shadbala': return 'bg-indigo-100 text-indigo-700';
            case 'widget_pushkara': return 'bg-emerald-100 text-emerald-700';
            case 'widget_karaka': return 'bg-amber-100 text-amber-700';
            case 'widget_chakra': return 'bg-violet-100 text-violet-700';
            case 'widget_shodasha': return 'bg-teal-100 text-teal-700';
            case 'widget_yoga': return 'bg-pink-100 text-pink-700';
            case 'widget_dosha': return 'bg-rose-100 text-rose-700';
            case 'widget_transit': return 'bg-cyan-100 text-cyan-700';
            case 'widget_remedy': return 'bg-gold-primary/10 text-gold-dark';
            default: return 'bg-surface-warm text-ink';
        }
    };

    const getCategoryLabel = () => {
        switch (widget.category) {
            case 'widget_shadbala': return 'Shadbala';
            case 'widget_pushkara': return 'Pushkara';
            case 'widget_karaka': return 'Karaka';
            case 'widget_chakra': return 'Chakra';
            case 'widget_shodasha': return 'Shodasha';
            case 'widget_yoga': return 'Yoga';
            case 'widget_dosha': return 'Dosha';
            case 'widget_transit': return 'Transit';
            case 'widget_remedy': return 'Remedy';
            default: return 'Widget';
        }
    };

    return (
        <div className={cn(
            "bg-white prem-card rounded-[2.5rem] p-6 shadow-xl relative group hover:shadow-2xl transition-all duration-300 flex flex-col",
            className
        )}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4 shrink-0 gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider", getCategoryColor())}>
                            {getCategoryLabel()}
                        </span>
                        {widget.lahiriOnly && (
                            <span className="text-[9px] font-bold text-amber-600 uppercase tracking-wider">Lahiri Only</span>
                        )}
                    </div>
                    <h4 className={cn(TYPOGRAPHY.value, "mt-2 text-[14px] font-black text-ink truncate")}>{widget.name}</h4>
                    <p className="text-[10px] text-ink/50 line-clamp-1">{widget.description}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    <SizeToggle size={size} onChange={onSizeChange} />
                    <button
                        onClick={onRemove}
                        className="p-1.5 rounded-lg text-ink/30 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Remove widget"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {!collapsed && (
                <div className={cn(
                    "flex-1 relative bg-surface-warm/30 rounded-3xl min-h-[220px]",
                    widget.category === 'widget_chakra' ? 'overflow-visible' : 'overflow-hidden'
                )}>
                    {children}
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHADBALA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function ShadbalaWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId, size, collapsed, onSizeChange, onDuplicate, onCollapseToggle } = props;
    const [data, setData] = useState<ShadbalaData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!clientId) return;
        setLoading(true);
        clientApi.getShadbala(clientId)
            .then((res: any) => {
                const rawData = res.data?.data || res.chartData?.data || res.data || res.chartData || res;
                if (rawData && rawData.shadbala_virupas) {
                    const planets: any[] = [];
                    const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
                    planetKeys.forEach(p => {
                        const details = rawData[`${p}_details`] || {};
                        const virupas = rawData.shadbala_virupas?.[p] || 0;
                        const rupas = rawData.shadbala_rupas?.[p] || 0;
                        const rank = rawData.relative_rank?.[p] || 0;
                        const strength = rawData.strength_summary?.[p] || 'Weak';
                        const ishKas = rawData.ishta_kashta_phala?.[p] || { Ishta: 0, Kashta: 0 };
                        const pctReq = rawData.percentage_of_required?.[p] || 0;

                        planets.push({
                            planet: p,
                            sthalaBala: details['STHANA TOTAL'] || 0,
                            digBala: details['Dig Bala'] || 0,
                            kalaBala: Object.values({
                                ayana: details['Ayana Bala'] || 0,
                                natonnata: details['Natonnata Bala'] || 0,
                                paksha: details['Paksha Bala'] || 0,
                                triBhaga: details['Tri-Bhaga Bala'] || 0,
                                kaalaDina: details['Kaala_Dina_Bala'] || 0,
                                hora: details['Hora_Bala'] || 0,
                                maasa: details['Maasa_Bala'] || 0,
                                varsha: details['Varsha_Bala'] || 0
                            }).reduce((a: number, b: number) => a + b, 0),
                            cheshtaBala: details['Chesta Bala'] || 0,
                            naisargikaBala: details['Naisargika Bala'] || 0,
                            drikBala: details['Drik Bala'] || 0,
                            totalBala: virupas,
                            rupaBala: rupas,
                            minBalaRequired: ({'Sun': 6.5, 'Moon': 6.0, 'Mars': 5.0, 'Mercury': 7.0, 'Jupiter': 6.5, 'Venus': 7.5, 'Saturn': 5.0}[p] || 6.0) * 60,
                            ratio: rupas / ({'Sun': 6.5, 'Moon': 6.0, 'Mars': 5.0, 'Mercury': 7.0, 'Jupiter': 6.5, 'Venus': 7.5, 'Saturn': 5.0}[p] || 6.0),
                            rank,
                            isStrong: strength === 'Strong',
                            percentOfRequired: pctReq,
                            ishtaKashta: { ishta: ishKas.Ishta || 0, kashta: ishKas.Kashta || 0 },
                            sthanaSubBalas: {
                                uchcha: details['Uchcha Bala'] || 0,
                                saptavarga: details['Saptavarga Bala'] || 0,
                                ojayugma: details['Ojayugma Bala'] || 0,
                                kendra: details['Kendra Bala'] || 0,
                                drekkana: details['Drekkana Bala'] || 0
                            },
                            kalaSubBalas: {
                                ayana: details['Ayana Bala'] || 0,
                                natonnata: details['Natonnata Bala'] || 0,
                                paksha: details['Paksha Bala'] || 0,
                                triBhaga: details['Tri-Bhaga Bala'] || 0,
                                kaalaDina: details['Kaala_Dina_Bala'] || 0,
                                hora: details['Hora_Bala'] || 0,
                                maasa: details['Maasa_Bala'] || 0,
                                varsha: details['Varsha_Bala'] || 0
                            }
                        });
                    });
                    setData({
                        planets,
                        ayanamsa: 'Lahiri',
                        system: 'Chitrapaksha',
                        userName: '',
                        raw: rawData
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [clientId]);

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-3" />
                    <p className="text-[11px] text-ink/50">Calculating Shadbala...</p>
                </div>
            ) : data ? (
                <div className="h-full overflow-auto custom-scrollbar p-2">
                    <ShadbalaDashboard displayData={data} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-gold-dark/30 mb-3" />
                    <p className="text-[11px] text-ink/50">Shadbala data unavailable</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUSHKARA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function PushkaraWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId } = props;
    const [data, setData] = useState<PushkaraData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!clientId) return;
        setLoading(true);
        clientApi.getPushkaraNavamsha(clientId)
            .then((res: any) => {
                const raw = res.data?.data || res.data || res;
                if (raw && raw.planets) {
                    const planets: Record<string, any> = {};
                    Object.entries(raw.planets).forEach(([name, pData]: [string, any]) => {
                        planets[name] = { ...pData, name };
                    });
                    setData({
                        ...raw,
                        planets,
                        ascendant: { ...raw.ascendant, name: 'Ascendant' }
                    });
                }
            })
            .finally(() => setLoading(false));
    }, [clientId]);

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                    <p className="text-[11px] text-ink/50">Analyzing Pushkara positions...</p>
                </div>
            ) : data ? (
                <div className="h-full overflow-auto custom-scrollbar p-2">
                    <PushkaraDashboard data={data} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-emerald-300 mb-3" />
                    <p className="text-[11px] text-ink/50">Pushkara data unavailable</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// KARAKA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function KarakaWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId } = props;
    const [data, setData] = useState<CharaKarakasResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!clientId) return;
        setLoading(true);
        clientApi.getCharaKarakas(clientId)
            .then((res: any) => {
                const raw = res.data?.data || res.data || res;
                if (raw) {
                    if (raw.karakas) {
                        setData(raw);
                    } else if (raw.all_planet_positions) {
                        const planetsToProcess = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
                        const planetPositions = raw.all_planet_positions;
                        const extractedPlanets = planetsToProcess
                            .filter(name => planetPositions[name])
                            .map(name => ({
                                name,
                                degreeVal: planetPositions[name].degree_in_sign,
                                degreeFormatted: planetPositions[name].dms_in_sign || '',
                                sign: planetPositions[name].sign_name || ''
                            }))
                            .sort((a, b) => b.degreeVal - a.degreeVal);

                        const karakaShort = ['AK', 'AmK', 'BK', 'MK', 'PuK', 'GK', 'DK'];
                        const karakaFull = ['Atma Karaka', 'Amatya Karaka', 'Bhatra Karaka', 'Matra Karaka', 'Putra Karaka', 'Gnati Karaka', 'Dara Karaka'];

                        const computedKarakas = extractedPlanets.map((p, i) => ({
                            planet: p.name,
                            karaka_full: karakaFull[i] || 'Karaka',
                            karaka_short: karakaShort[i] || 'K',
                            degree: p.degreeFormatted,
                            sign: p.sign
                        }));

                        setData({ karakas: computedKarakas, all_planet_positions: raw.all_planet_positions });
                    }
                }
            })
            .finally(() => setLoading(false));
    }, [clientId]);

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-3" />
                    <p className="text-[11px] text-ink/50">Calculating Karakas...</p>
                </div>
            ) : data ? (
                <div className="h-full overflow-auto custom-scrollbar p-2">
                    <KarakaDashboard data={data} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-300 mb-3" />
                    <p className="text-[11px] text-ink/50">Karaka data unavailable</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAKRA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function ChakraWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId, activeSystem } = props;
    const { processedCharts, isLoadingCharts } = useVedicClient();
    const key = `sudarshana_${activeSystem}`;
    const raw = processedCharts[key]?.chartData;
    const chakraData = raw?.data || raw;
    const loading = !chakraData && isLoadingCharts;

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-3" />
                    <p className="text-[11px] text-ink/50">Synchronizing chakra layers...</p>
                </div>
            ) : chakraData ? (
                <div className="h-full flex items-center justify-center p-4 overflow-visible">
                    <SudarshanChakraFinal data={chakraData} className="w-full h-full max-w-[520px] max-h-[520px]" />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Layers className="w-8 h-8 text-violet-300 mb-3" />
                    <p className="text-[11px] text-ink/50">Sudarshan Chakra not generated yet</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHODASHA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function ShodashaWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId, activeSystem } = props;
    const { processedCharts, isLoadingCharts } = useVedicClient();
    const shodashaKey = `ashtakavarga_shodasha_${activeSystem}`;
    const shodashaKpKey = `shodasha_varga_signs_${activeSystem}`;
    const raw = processedCharts[shodashaKey]?.chartData || processedCharts[shodashaKpKey]?.chartData;
    const shodashaData = raw ? (raw.data || raw) : null;
    const loading = !shodashaData && isLoadingCharts;

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-3" />
                    <p className="text-[11px] text-ink/50">Loading Shodashvarga...</p>
                </div>
            ) : shodashaData ? (
                <div className="h-full overflow-auto custom-scrollbar p-2">
                    <ShodashaVargaTable data={shodashaData as Record<string, unknown>} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Layers className="w-8 h-8 text-teal-300 mb-3" />
                    <p className="text-[11px] text-ink/50">Shodashvarga data unavailable</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// YOGA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function YogaWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId, activeSystem } = props;
    return (
        <WidgetCard {...props}>
            <div className="h-full overflow-auto custom-scrollbar p-4">
                <YogaAnalysisView clientId={clientId} yogaType="all" ayanamsa={activeSystem} />
            </div>
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOSHA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function DoshaWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId, activeSystem } = props;
    return (
        <WidgetCard {...props}>
            <div className="h-full overflow-auto custom-scrollbar p-4">
                <DoshaAnalysis clientId={clientId} doshaType="all" ayanamsa={activeSystem} />
            </div>
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSIT WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function TransitWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId } = props;
    return (
        <WidgetCard {...props}>
            <div className="h-full overflow-auto custom-scrollbar">
                <DailyTransitView clientId={clientId} />
            </div>
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REMEDY WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function RemedyWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId } = props;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const type = widget.id === 'widget_remedy_gemstone' ? 'gemstone' : 'mantra';

    useEffect(() => {
        if (!clientId) return;
        setLoading(true);
        clientApi.generateChart(clientId, `remedy:${type}`, 'lahiri')
            .then((res: any) => {
                setData(res.data || res.chartData || res);
            })
            .finally(() => setLoading(false));
    }, [clientId, type]);

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gold-primary animate-spin mb-3" />
                    <p className="text-[11px] text-ink/50">Loading remedies...</p>
                </div>
            ) : data ? (
                <div className="h-full overflow-auto custom-scrollbar">
                    <UpayaDashboard data={data} compact />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Gem className="w-8 h-8 text-gold-primary/30 mb-3" />
                    <p className="text-[11px] text-ink/50">Remedy data unavailable</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERER HELPER
// ═══════════════════════════════════════════════════════════════════════════════
export function renderWidget(
    item: CustomizeChartItem & {
        instanceId: string;
        size: WidgetSize;
        collapsed: boolean;
        onRemove: () => void;
        onSizeChange?: (s: WidgetSize) => void;
        onDuplicate?: () => void;
        onCollapseToggle?: () => void;
    },
    clientId: string,
    activeSystem: string
) {
    const props: WidgetBoxProps = {
        widget: item,
        onRemove: item.onRemove,
        clientId,
        activeSystem,
        size: item.size,
        collapsed: item.collapsed,
        onSizeChange: item.onSizeChange,
        onDuplicate: item.onDuplicate,
        onCollapseToggle: item.onCollapseToggle,
    };

    switch (item.category) {
        case 'widget_shadbala': return <ShadbalaWidget key={item.instanceId} {...props} />;
        case 'widget_pushkara': return <PushkaraWidget key={item.instanceId} {...props} />;
        case 'widget_karaka': return <KarakaWidget key={item.instanceId} {...props} />;
        case 'widget_chakra': return <ChakraWidget key={item.instanceId} {...props} />;
        case 'widget_shodasha': return <ShodashaWidget key={item.instanceId} {...props} />;
        case 'widget_yoga': return <YogaWidget key={item.instanceId} {...props} />;
        case 'widget_dosha': return <DoshaWidget key={item.instanceId} {...props} />;
        case 'widget_transit': return <TransitWidget key={item.instanceId} {...props} />;
        case 'widget_remedy': return <RemedyWidget key={item.instanceId} {...props} />;
        default: return null;
    }
}

// Export size class helper
export function getWidgetSizeClasses(size?: WidgetSize) {
    switch (size) {
        case 'small':
        case 'medium':
            return '';
        case 'large':
            return 'md:col-span-2';
        case 'wide':
            return 'md:col-span-2';
        case 'full':
            return 'md:col-span-2 xl:col-span-3';
        default:
            return '';
    }
}
