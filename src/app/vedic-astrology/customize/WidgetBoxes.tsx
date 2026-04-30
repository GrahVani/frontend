"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    X, Loader2, AlertCircle, Sparkles, Layers, Shield, Gem, Star, Table2, Map as MapIcon
} from 'lucide-react';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import type { CustomizeChartItem, WidgetSize } from '@/hooks/useCustomizeCharts';
// ShadbalaData type now handled by ShadbalaCustomizeWidget
import type { PushkaraData } from '@/app/vedic-astrology/pushkara-navamsha/page';
import type { CharaKarakasResponse } from '@/app/vedic-astrology/chara-karakas/page';
import SudarshanChakraFinal from '@/components/astrology/SudarshanChakraFinal';
import ShodashaVargaTable from '@/components/astrology/ShodashaVargaTable';
import IntegratedDashaViewer from '@/components/astrology/IntegratedDashaViewer';
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';
import AshtakavargaChart from '@/components/astrology/AshtakavargaChart';
import { parseChartData, signNameToId } from '@/lib/chart-helpers';
import { isChartCompatible, type AyanamsaSystem } from './ayana-types';
import AyanamsaSelect from './AyanamsaSelect';

import { useVedicClient } from '@/context/VedicClientContext';
import { useShadbala, useAshtakavarga, useDasha, useOtherDasha } from '@/hooks/queries/useCalculations';
import dynamic from 'next/dynamic';

// Lazy load the heavy dashboard components
const ShadbalaCustomizeWidget = dynamic(() => import('./ShadbalaCustomizeWidget'));
const PushkaraDashboard = dynamic(() => import('@/app/vedic-astrology/pushkara-navamsha/page').then(m => ({ default: m.PushkaraDashboard })));
const KarakaDashboard = dynamic(() => import('@/app/vedic-astrology/chara-karakas/page').then(m => ({ default: m.KarakaDashboard })));
const YogaAnalysisView = dynamic(() => import('@/components/astrology/YogaAnalysis'));
const DoshaAnalysis = dynamic(() => import('@/components/astrology/DoshaAnalysis'));
const DailyTransitView = dynamic(() => import('@/components/transits/DailyTransitView'));
const UpayaDashboard = dynamic(() => import('@/components/upaya/UpayaDashboard'));

// KP Hooks
import {
    useKpPlanetsCusps,
    useKpRulingPlanets,
    useKpBhavaDetails,
    useKpHouseSignifications,
    useKpPlanetSignificators,
    useKpInterlinks,
    useKpAdvancedInterlinks,
    useKpNakshatraNadi,
    useKpFortuna
} from '@/hooks/queries/useKP';
import { useKpTransformedData } from '@/hooks/useKpTransformedData';

// KP Components
const KpPlanetaryTable = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpPlanetaryTable })));
const KpPlanetaryWidget = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpPlanetaryWidget })));
const KpCuspsWidget = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpCuspsWidget })));
const KpCuspalChart = dynamic(() => import('@/components/kp/KpCuspalChart'), { ssr: false });
const SignificationMatrix = dynamic(() => import('@/components/kp').then(m => ({ default: m.SignificationMatrix })));
const HouseSignificatorsTable = dynamic(() => import('@/components/kp').then(m => ({ default: m.HouseSignificatorsTable })));
const RulingPlanetsWidget = dynamic(() => import('@/components/kp').then(m => ({ default: m.RulingPlanetsWidget })));
const BhavaDetailsTable = dynamic(() => import('@/components/kp').then(m => ({ default: m.BhavaDetailsTable })));
const KpFortunaView = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpFortunaView })));
const KpAdvancedSslView = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpAdvancedSslView })));
const KpNakshatraNadiFocusedView = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpNakshatraNadiFocusedView })));
const KpFocusedCuspView = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpFocusedCuspView })));
const PremiumAshtakavargaMatrix = dynamic(() => import('@/components/astrology/PremiumAshtakavargaMatrix'));

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
    onAyanamsaChange?: (ayanamsa: AyanamsaSystem) => void;
}

const SIZE_OPTIONS: { key: WidgetSize; label: string }[] = [
    { key: 'small', label: 'S' },
    { key: 'medium', label: 'M' },
    { key: 'large', label: 'L' },
    { key: 'full', label: 'F' },
];

// ── Widget Scale Configuration ──────────────────────────────────────────────
// Controls how content (fonts, tables, spacing) scales with S/M/L/F sizes.
// Uses CSS zoom for automatic proportional scaling of ALL child content.
export const WIDGET_SCALE_CONFIG: Record<WidgetSize, { zoom: number; minHeight: string; headerText: string; titleMaxW: string }> = {
    small: { zoom: 0.85, minHeight: '220px', headerText: 'text-[8px]', titleMaxW: 'max-w-[90px]' },
    medium: { zoom: 1.0, minHeight: '240px', headerText: 'text-[9px]', titleMaxW: 'max-w-[100px]' },
    large: { zoom: 1.2, minHeight: '300px', headerText: 'text-[11px]', titleMaxW: 'max-w-[180px]' },
    wide: { zoom: 1.15, minHeight: '280px', headerText: 'text-[10px]', titleMaxW: 'max-w-[160px]' },
    full: { zoom: 1.4, minHeight: '360px', headerText: 'text-[12px]', titleMaxW: 'max-w-[240px]' },
    custom: { zoom: 1.0, minHeight: '200px', headerText: 'text-[10px]', titleMaxW: 'max-w-[120px]' },
};

function SizeToggle({ size, onChange }: { size: WidgetSize; onChange?: (s: WidgetSize) => void }) {
    return (
        <div className="flex items-center bg-amber-50 rounded-lg p-0.5">
            {SIZE_OPTIONS.map(opt => (
                <button
                    key={opt.key}
                    onClick={() => onChange?.(opt.key)}
                    className={cn(
                        "px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-all min-w-[20px]",
                        size === opt.key
                            ? "bg-primary text-white shadow-sm"
                            : "text-amber-900/40 hover:text-amber-900 hover:bg-white"
                    )}
                    title={`Size: ${opt.label}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
}

function WidgetCard({
    widget,
    onRemove,
    children,
    className,
    size = 'medium',
    collapsed = false,
    onSizeChange,
    onCollapseToggle,
    activeSystem,
    onAyanamsaChange,
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
    activeSystem?: string;
    onAyanamsaChange?: (a: AyanamsaSystem) => void;
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
            case 'widget_remedy': return 'bg-amber-50 text-amber-700';
            case 'kp_module': return 'bg-orange-100 text-orange-700';
            default: return 'bg-amber-50 text-amber-900';
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
            case 'kp_module': return 'KP System';
            default: return 'Widget';
        }
    };

    const isCompatible = isChartCompatible(widget.id, activeSystem || 'Lahiri');

    const scaleConfig = WIDGET_SCALE_CONFIG[size] || WIDGET_SCALE_CONFIG.medium;

    return (
        <div className={cn(
            "bg-[#FDFBF7] border border-amber-200/60 rounded p-1 shadow-sm relative group hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden",
            className
        )} style={{ height: 'calc((100vh - 200px) / 2)', minHeight: scaleConfig.minHeight }}
            data-widget-size={size}
        >
            {/* High-Density Header — Premium Redesign */}
            <div 
                className="flex items-center justify-between shrink-0 px-2 py-1.5 border-b"
                style={{
                    background: 'linear-gradient(180deg, #F8F3EB 0%, #F0E8DA 100%)',
                    borderBottomColor: '#D4C4A8',
                }}
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={cn(
                        "px-1.5 py-0.5 rounded font-medium tracking-wider shrink-0 shadow-sm",
                        scaleConfig.headerText,
                        getCategoryColor()
                    )} style={{ fontSize: `max(7px, ${7 * scaleConfig.zoom}px)` }}>
                        {getCategoryLabel()}
                    </span>
                    <h4 className={cn(
                        "font-medium text-[#3E2A1F] tracking-tight truncate",
                        scaleConfig.titleMaxW
                    )} style={{ fontSize: `max(9px, ${10 * scaleConfig.zoom}px)` }}>
                        {widget.name}
                    </h4>
                    {onAyanamsaChange && (
                        <div className="ml-1 shrink-0">
                            <AyanamsaSelect
                                value={activeSystem || 'Lahiri'}
                                onChange={onAyanamsaChange}
                                compact
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Size Selector — High Density Pill */}
                    <div className={cn(
                        "flex items-center px-1 py-0.5 rounded-lg border border-[#C9B896] shrink-0",
                        scaleConfig.headerText
                    )}>
                        {(['S', 'M', 'L', 'F'] as const).map((s, idx) => (
                            <React.Fragment key={s}>
                                <button
                                    onClick={() => {
                                        if (!onSizeChange) return;
                                        const map: Record<string, WidgetSize> = { S: 'small', M: 'medium', L: 'large', F: 'full' };
                                        onSizeChange(map[s]);
                                    }}
                                    className={cn(
                                        "px-1.5 py-0.5 rounded transition-all font-medium text-[9px]",
                                        (size === 'small' && s === 'S') ||
                                            (size === 'medium' && s === 'M') ||
                                            (size === 'large' && s === 'L') ||
                                            (size === 'full' && s === 'F')
                                            ? "bg-[#D4C4A8] text-[#3E2A1F] shadow-sm"
                                            : "text-[#5A4A3A]/40 hover:text-[#5A4A3A]"
                                    )}
                                >
                                    {s}
                                </button>
                                {idx < 3 && <div className="w-px h-2.5 bg-[#C9B896]/50 mx-0.5" />}
                            </React.Fragment>
                        ))}
                    </div>
                    
                    <button
                        onClick={onRemove}
                        className="w-6 h-6 flex items-center justify-center rounded-lg border border-[#D4C4A8] hover:bg-red-50 hover:border-red-300 text-[#7A6A5A] hover:text-red-500 transition-all active:scale-95 shadow-sm"
                        title="Remove"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Content Area - flex-1 handles layout, inner div applies zoom for content scaling */}
            {!collapsed && (
                <div
                    className={cn(
                        "flex-1 relative bg-transparent rounded min-h-0",
                        widget.category === 'widget_chakra' ? 'overflow-visible' : 'overflow-auto'
                    )}
                >
                    <div style={{ zoom: scaleConfig.zoom }}>
                        {!isCompatible ? (
                            <div className="flex flex-col items-center justify-center p-6 text-center" style={{ minHeight: `${100 / scaleConfig.zoom}%` }}>
                                <Shield className="w-8 h-8 text-amber-700/40 mb-3" />
                                <p className="text-[10px] font-medium uppercase text-amber-700/60 tracking-wider mb-1 leading-tight px-4">
                                    {widget.name}
                                </p>
                                <p className="text-[8px] font-medium text-amber-900/40 uppercase tracking-[0.15em] px-2">
                                    Not compatible with {activeSystem}
                                </p>
                            </div>
                        ) : children}
                    </div>
                </div>
            )}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHADBALA WIDGET CONTENT (no card wrapper - for use in ResizableWidgetBox)
// ═══════════════════════════════════════════════════════════════════════════════
function ShadbalaWidgetContent({ activeSystem }: { activeSystem: string }) {
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // Fetch from database (processedCharts) instead of API
    const shadbalaKey = `shadbala_${activeSystem.toLowerCase()}`;
    const shadbalaRaw = processedCharts[shadbalaKey]?.chartData;
    const shadbalaResult = shadbalaRaw?.data || shadbalaRaw;
    const loading = !shadbalaResult && isLoadingCharts;

    const data = useMemo(() => {
        const rawData = shadbalaResult as any;
        if (!rawData || !rawData.shadbala_virupas) return null;

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
                minBalaRequired: ({ 'Sun': 6.5, 'Moon': 6.0, 'Mars': 5.0, 'Mercury': 7.0, 'Jupiter': 6.5, 'Venus': 7.5, 'Saturn': 5.0 }[p] || 6.0) * 60,
                ratio: rupas / ({ 'Sun': 6.5, 'Moon': 6.0, 'Mars': 5.0, 'Mercury': 7.0, 'Jupiter': 6.5, 'Venus': 7.5, 'Saturn': 5.0 }[p] || 6.0),
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
        return {
            planets,
            ayanamsa: 'Lahiri',
            system: 'Chitrapaksha',
            userName: '',
            raw: rawData
        };
    }, [shadbalaResult]);

    if (loading) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
                <p className="text-[11px] text-amber-900/50">Calculating Shadbala...</p>
            </div>
        );
    }

    if (data) {
        return (
            <div className="h-full overflow-hidden">
                <ShadbalaCustomizeWidget displayData={data} />
            </div>
        );
    }

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="w-8 h-8 text-amber-700/30 mb-3" />
            <p className="text-[11px] text-amber-900/50">Shadbala data unavailable</p>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHADBALA WIDGET (with card wrapper)
// ═══════════════════════════════════════════════════════════════════════════════
export function ShadbalaWidget(props: WidgetBoxProps) {
    return (
        <WidgetCard {...props}>
            <ShadbalaWidgetContent activeSystem={props.activeSystem} />
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
                    <p className="text-[11px] text-amber-900/50">Analyzing Pushkara positions...</p>
                </div>
            ) : data ? (
                <div className="h-full overflow-auto custom-scrollbar p-2">
                    <PushkaraDashboard data={data} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-emerald-300 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Pushkara data unavailable</p>
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
                    <p className="text-[11px] text-amber-900/50">Calculating Karakas...</p>
                </div>
            ) : data ? (
                <div className="h-full overflow-auto custom-scrollbar p-2">
                    <KarakaDashboard data={data} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-300 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Karaka data unavailable</p>
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
    const key = `sudarshana_${activeSystem.toLowerCase()}`;
    const raw = processedCharts[key]?.chartData;
    const chakraData = raw?.data || raw;
    const loading = !chakraData && isLoadingCharts;

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-3" />
                    <p className="text-[11px] text-amber-900/50">Synchronizing chakra layers...</p>
                </div>
            ) : chakraData ? (
                <div className="h-full flex items-center justify-center p-4 overflow-visible">
                    <SudarshanChakraFinal data={chakraData} className="w-full h-full max-w-[520px] max-h-[520px]" />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Layers className="w-8 h-8 text-violet-300 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Sudarshan Chakra not generated yet</p>
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
    const shodashaKey = `ashtakavarga_shodasha_${activeSystem.toLowerCase()}`;
    const shodashaKpKey = `shodasha_varga_signs_${activeSystem.toLowerCase()}`;
    const raw = processedCharts[shodashaKey]?.chartData || processedCharts[shodashaKpKey]?.chartData;
    const shodashaData = raw ? (raw.data || raw) : null;
    const loading = !shodashaData && isLoadingCharts;

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-3" />
                    <p className="text-[11px] text-amber-900/50">Loading Shodashvarga...</p>
                </div>
            ) : shodashaData ? (
                <div className="h-full overflow-auto custom-scrollbar p-2">
                    <ShodashaVargaTable data={shodashaData as Record<string, unknown>} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Layers className="w-8 h-8 text-teal-300 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Shodashvarga data unavailable</p>
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
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // Fetch from database (processedCharts) instead of API
    const yogaKey = `yoga_all_${activeSystem.toLowerCase()}`;
    const yogaRaw = processedCharts[yogaKey]?.chartData;
    const yogaData = yogaRaw?.data || yogaRaw;
    const loading = !yogaData && isLoadingCharts;

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
                    <p className="text-[11px] text-amber-900/50">Loading yoga analysis...</p>
                </div>
            ) : yogaData ? (
                <div className="h-full overflow-auto custom-scrollbar p-4">
                    <YogaAnalysisView clientId={clientId} yogaType="all" ayanamsa={activeSystem} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Sparkles className="w-8 h-8 text-pink-300 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Yoga data not generated yet</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOSHA WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function DoshaWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId, activeSystem } = props;
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // Fetch from database (processedCharts) instead of API
    const doshaKey = `dosha_all_${activeSystem.toLowerCase()}`;
    const doshaRaw = processedCharts[doshaKey]?.chartData;
    const doshaData = doshaRaw?.data || doshaRaw;
    const loading = !doshaData && isLoadingCharts;

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-3" />
                    <p className="text-[11px] text-amber-900/50">Loading dosha analysis...</p>
                </div>
            ) : doshaData ? (
                <div className="h-full overflow-auto custom-scrollbar p-4">
                    <DoshaAnalysis clientId={clientId} doshaType="all" ayanamsa={activeSystem} />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Shield className="w-8 h-8 text-rose-300 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Dosha data not generated yet</p>
                </div>
            )}
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
// DASHA WIDGET CONTENT (no card wrapper - for use in ResizableWidgetBox)
// ═══════════════════════════════════════════════════════════════════════════════
function DashaWidgetContent({ widget, clientId, activeSystem }: { widget: CustomizeChartItem; clientId: string; activeSystem: string }) {
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // Fetch from database (processedCharts) - key pattern: {dashaType}_{ayanamsa}
    const dashaKey = `${widget.id}_${activeSystem.toLowerCase()}`;
    const dashaRaw = processedCharts[dashaKey]?.chartData;
    const dashaData = dashaRaw?.data || dashaRaw;
    const loading = !dashaData && isLoadingCharts;

    if (loading) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-3" />
                <p className="text-[11px] text-amber-900/50">Loading {widget.name}...</p>
            </div>
        );
    }

    if (!dashaData) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-8 h-8 text-purple-300 mb-3" />
                <p className="text-[11px] text-amber-900/50">{widget.name} not generated</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto custom-scrollbar">
            <IntegratedDashaViewer
                dashaType={widget.id}
                clientId={clientId}
                ayanamsa={activeSystem}
                dashaData={dashaData}
                isLoading={false}
                compact
            />
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHA WIDGET (with card wrapper)
// ═══════════════════════════════════════════════════════════════════════════════
export function DashaWidget(props: WidgetBoxProps) {
    const { widget, clientId, activeSystem } = props;

    return (
        <WidgetCard {...props}>
            <DashaWidgetContent widget={widget} clientId={clientId} activeSystem={activeSystem} />
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// REMEDY WIDGET
// ═══════════════════════════════════════════════════════════════════════════════
export function RemedyWidget(props: WidgetBoxProps) {
    const { widget, onRemove, clientId, activeSystem } = props;
    const { processedCharts, isLoadingCharts } = useVedicClient();

    // Fetch from database (processedCharts) instead of API
    const type = widget.id === 'widget_remedy_gemstone' ? 'gemstone' : 'mantra';
    const remedyKey = `remedy_${type}_${(activeSystem || 'lahiri').toLowerCase()}`;
    const remedyRaw = processedCharts[remedyKey]?.chartData;
    const data = remedyRaw?.data || remedyRaw;
    const loading = !data && isLoadingCharts;

    return (
        <WidgetCard {...props}>
            {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-3" />
                    <p className="text-[11px] text-amber-900/50">Loading remedies...</p>
                </div>
            ) : data ? (
                <div className="h-full overflow-auto custom-scrollbar">
                    <UpayaDashboard data={data} compact />
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <Gem className="w-8 h-8 text-amber-600/30 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Remedy data unavailable</p>
                </div>
            )}
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// KP MODULE WIDGET CONTENT (no card wrapper - for use in ResizableWidgetBox)
// ═══════════════════════════════════════════════════════════════════════════════
function KpModuleWidgetContent({ widget, activeSystem }: { widget: CustomizeChartItem; activeSystem: string }) {
    const { processedCharts } = useVedicClient();

    // Use transformed data hook
    const transformed = useKpTransformedData({
        processedCharts,
        planetsCuspsQuery: { data: null, isLoading: false } as any,
        houseSignificationsQuery: { data: null, isLoading: false } as any,
        planetSignificatorsQuery: { data: null, isLoading: false } as any,
        bhavaDetailsQuery: { data: null, isLoading: false } as any,
        rulingPlanetsQuery: { data: null, isLoading: false } as any,
        interlinksQuery: { data: null, isLoading: false } as any,
        advancedSslQuery: { data: null, isLoading: false } as any,
        nakshatraNadiQuery: { data: null, isLoading: false } as any,
        fortunaQuery: { data: null, isLoading: false } as any,
    });

    switch (widget.id) {
        case 'kp_planets':
            return <KpPlanetaryWidget planets={transformed.planetaryData} className="h-full border-none" />;

        case 'kp_cusps':
            // Extract house signs from cusp data for KpCuspalChart
            const houseSigns = transformed.cuspData.map(c => c.signId);
            // Ensure we have 12 houses, fill with default if needed
            while (houseSigns.length < 12) houseSigns.push(1);
            return (
                <div className="flex-1 min-h-0 relative w-full h-full">
                    <div className="w-full h-full p-0 flex items-center justify-center overflow-hidden">
                        <KpCuspalChart
                            planets={transformed.d1Data.planets}
                            houseSigns={houseSigns}
                            cuspDetails={transformed.cuspData.map(c => ({
                                house: c.cusp,
                                degreeFormatted: c.degreeFormatted,
                                sign: c.sign,
                                signId: c.signId,
                            }))}
                            className="w-full h-full"
                        />
                    </div>
                </div>
            );

        case 'kp_house_significations':
            return (
                <div className="h-full overflow-auto p-2">
                    <HouseSignificatorsTable data={transformed.houseSignificators} className="border-none shadow-none" />
                </div>
            );

        case 'kp_planetary_significators':
            return (
                <div className="h-full overflow-auto p-2">
                    <SignificationMatrix
                        significations={transformed.significationData}
                        className="border-none"
                    />
                </div>
            );

        case 'kp_bhava_details':
            return (
                <div className="h-full overflow-auto p-2">
                    <BhavaDetailsTable bhavaDetails={transformed.bhavaDetails} className="border-none shadow-none" />
                </div>
            );

        case 'kp_interlinks':
            return (
                <div className="h-full overflow-auto p-4 shrink-0">
                    <KpFocusedCuspView promises={transformed.interlinksData} cusps={transformed.cuspData} />
                </div>
            );

        case 'kp_advanced_ssl':
            return (
                <div className="h-full overflow-auto p-4 flex-1">
                    <KpAdvancedSslView promises={transformed.sslData} cusps={transformed.cuspData} />
                </div>
            );

        case 'kp_nakshatra_nadi':
            if (!transformed.nadiData) return (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-orange-200 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Nakshatra Nadi data pending</p>
                </div>
            );
            return (
                <div className="h-full overflow-auto p-4">
                    <KpNakshatraNadiFocusedView data={{ nadiData: transformed.nadiData }} />
                </div>
            );

        case 'kp_fortuna':
            if (!transformed.fortunaData) return (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-orange-200 mb-3" />
                    <p className="text-[11px] text-amber-900/50">Fortuna data pending</p>
                </div>
            );
            return (
                <div className="h-full overflow-auto p-4">
                    <KpFortunaView data={{ fortunaData: transformed.fortunaData }} />
                </div>
            );

        case 'kp_ruling_planets':
            const rpRaw = processedCharts['kp_ruling_planets_kp']?.chartData;
            const rpData = (rpRaw && typeof rpRaw === 'object' && Object.keys(rpRaw).length > 0) ? (rpRaw.data || rpRaw) : null;
            return (
                <div className="h-full p-2">
                    <RulingPlanetsWidget data={rpData as any} isLoading={false} className="h-full shadow-none border-none !bg-transparent" />
                </div>
            );

        case 'kp_ashtakavarga':
            const avRaw = processedCharts['kp_ashtakavarga_shodasha_kp']?.chartData || processedCharts['ashtakavarga_shodasha_kp']?.chartData;
            const avData = avRaw?.data || avRaw || null;
            return (
                <div className="h-full p-2 overflow-auto">
                    <div className="text-[10px] text-orange-600 font-bold mb-2 uppercase tracking-widest text-center">KP Ashtakavarga Matrix</div>
                    <PremiumAshtakavargaMatrix
                        data={avData as any}
                        type="sarva"
                    />
                </div>
            );

        default:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-orange-200 mb-3" />
                    <p className="text-[11px] text-amber-900/50">KP Module visualization pending</p>
                </div>
            );
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// KP MODULE WIDGET (with card wrapper)
// ═══════════════════════════════════════════════════════════════════════════════
export function KpModuleWidget(props: WidgetBoxProps) {
    return (
        <WidgetCard {...props}>
            <KpModuleWidgetContent widget={props.widget} activeSystem={props.activeSystem} />
        </WidgetCard>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDERER HELPER - Returns full widget with card wrapper
// ═══════════════════════════════════════════════════════════════════════════════
export function renderWidget(
    item: CustomizeChartItem & {
        instanceId: string;
        size: WidgetSize;
        collapsed: boolean;
        ayanamsa?: string;
        onRemove: () => void;
        onSizeChange?: (s: WidgetSize) => void;
        onDuplicate?: () => void;
        onCollapseToggle?: () => void;
        onAyanamsaChange?: (a: string) => void;
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
        onAyanamsaChange: item.onAyanamsaChange,
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
        case 'dasha': return <DashaWidget key={item.instanceId} {...props} />;
        case 'kp_module': return <KpModuleWidget key={item.instanceId} {...props} />;
        default: return null;
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT-ONLY COMPONENTS (no card wrapper - for use in ResizableWidgetBox)
// ═══════════════════════════════════════════════════════════════════════════════

// Chakra Content Only
function ChakraWidgetContent({ activeSystem }: { activeSystem: string }) {
    const { processedCharts, isLoadingCharts } = useVedicClient();
    const key = `sudarshana_${activeSystem.toLowerCase()}`;
    const raw = processedCharts[key]?.chartData;
    const chakraData = raw?.data || raw;
    const loading = !chakraData && isLoadingCharts;

    if (loading) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-3" />
                <p className="text-[11px] text-amber-900/50">Synchronizing chakra layers...</p>
            </div>
        );
    }

    if (!chakraData) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Layers className="w-8 h-8 text-violet-300 mb-3" />
                <p className="text-[11px] text-amber-900/50">Sudarshan Chakra not generated yet</p>
            </div>
        );
    }

    return (
        <div className="h-full flex items-center justify-center p-4 overflow-visible">
            <SudarshanChakraFinal data={chakraData} className="w-full h-full max-w-[520px] max-h-[520px]" />
        </div>
    );
}

// Shodasha Content Only
function ShodashaWidgetContent({ activeSystem }: { activeSystem: string }) {
    const { processedCharts, isLoadingCharts } = useVedicClient();
    const shodashaKey = `ashtakavarga_shodasha_${activeSystem.toLowerCase()}`;
    const shodashaKpKey = `shodasha_varga_signs_${activeSystem.toLowerCase()}`;
    const raw = processedCharts[shodashaKey]?.chartData || processedCharts[shodashaKpKey]?.chartData;
    const shodashaData = raw ? (raw.data || raw) : null;
    const loading = !shodashaData && isLoadingCharts;

    if (loading) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-teal-500 animate-spin mb-3" />
                <p className="text-[11px] text-amber-900/50">Loading Shodashvarga...</p>
            </div>
        );
    }

    if (!shodashaData) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Layers className="w-8 h-8 text-teal-300 mb-3" />
                <p className="text-[11px] text-amber-900/50">Shodashvarga data unavailable</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto custom-scrollbar p-2">
            <ShodashaVargaTable data={shodashaData as Record<string, unknown>} />
        </div>
    );
}

// Ashtakavarga Content Only
function AshtakavargaWidgetContent({ widget, activeSystem }: { widget: CustomizeChartItem; activeSystem: string }) {
    const { processedCharts, isLoadingCharts } = useVedicClient();
    const isSarva = widget.id === 'ashtakavarga_sarva';
    const key = isSarva ? `ashtakavarga_sarva_${activeSystem.toLowerCase()}` : `ashtakavarga_bhinna_${activeSystem.toLowerCase()}`;
    const raw = processedCharts[key]?.chartData;
    const fullData = raw ? (raw.data || raw) : null as any;
    const loading = !fullData && isLoadingCharts;

    // Get selected planet state to sync chart and matrix
    // We default to Lagna for BAV if not specified
    const [selectedPlanet, setSelectedPlanet] = React.useState<string>("Lagna");

    // Fetch D1 for ascendant
    const d1Key = `D1_${activeSystem.toLowerCase()}`;
    const d1Raw = processedCharts[d1Key]?.chartData;
    const { ascendant: ascSign } = React.useMemo(() => parseChartData(d1Raw), [d1Raw]);

    const houseValues: Record<number, number> = React.useMemo(() => {
        if (!fullData) return {};
        const scores: Record<number, number> = {};

        if (isSarva) {
            const sarvaData = fullData.sarvashtakavarga || fullData.sarvashtakavarga_summary || fullData.ashtakvarga || fullData;
            const signs = sarvaData.signs || sarvaData.houses_matrix || sarvaData.houses || sarvaData.sarvashtakavarga_summary || {};
            const houseMatrix = sarvaData.house_strength_matrix || fullData.house_strength_matrix;

            if (Array.isArray(houseMatrix)) {
                houseMatrix.forEach((h: any) => {
                    const signId = signNameToId[h.sign_name as string] || h.house_number as number;
                    if (signId && signId >= 1 && signId <= 12) scores[signId] = (h.total_points as number) || 0;
                });
            } else if (typeof signs === 'object' && !Array.isArray(signs)) {
                Object.entries(signs).forEach(([s, v]) => {
                    const signId = signNameToId[s] || signNameToId[s.charAt(0).toUpperCase() + s.slice(1)] ||
                        (s.startsWith('House') ? ((ascSign + parseInt(s.split(' ')[1]) - 2) % 12) + 1 : parseInt(s));
                    if (signId && signId >= 1 && signId <= 12) scores[signId] = v as number;
                });
            }
        } else {
            const bhinnaRoot = fullData.bhinnashtakavarga || fullData.ashtakvarga || fullData;
            const planetKey = selectedPlanet === 'Lagna' ? 'Ascendant' : selectedPlanet;
            const tables = bhinnaRoot.tables || [];
            const specificTable = Array.isArray(tables) ? tables.find((t: any) => t.planet === planetKey || t.planet === selectedPlanet) : null;

            let planetData = specificTable?.total_bindus || bhinnaRoot[planetKey] || bhinnaRoot[planetKey.toLowerCase()] || {};
            if (planetData && typeof planetData === 'object' && !Array.isArray(planetData)) {
                if (planetData.total) planetData = planetData.total;
                else if (planetData.total_bindus) planetData = planetData.total_bindus;
                else if (planetData.bindus && Array.isArray(planetData.bindus)) planetData = planetData.bindus;
            }

            if (Array.isArray(planetData)) {
                planetData.forEach((v, idx) => { scores[idx + 1] = v; });
            } else {
                Object.entries(planetData).forEach(([s, v]) => {
                    const signId = signNameToId[s] || signNameToId[s.charAt(0).toUpperCase() + s.slice(1)] || parseInt(s);
                    if (signId && signId >= 1 && signId <= 12) {
                        scores[signId] = (typeof v === 'number' ? v : (v as any).total as number) || 0;
                    }
                });
            }
        }

        const hVals: Record<number, number> = {};
        if (Object.keys(scores).length > 0 && ascSign) {
            for (let h = 1; h <= 12; h++) {
                const s = ((ascSign + h - 2) % 12) + 1;
                hVals[h] = scores[s] || 0;
            }
        }
        return hVals;
    }, [fullData, isSarva, selectedPlanet, ascSign]);

    if (loading) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-3" />
                <p className="text-[11px] text-amber-900/50">Loading Ashtakavarga...</p>
            </div>
        );
    }

    if (!fullData) {
        return (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Table2 className="w-8 h-8 text-emerald-300 mb-3" />
                <p className="text-[11px] text-amber-900/50">{widget.name} not generated yet</p>
            </div>
        );
    }

    return (
        <div className="h-full p-2 overflow-auto custom-scrollbar-slim flex flex-col">
            <div className="grid grid-cols-[1.2fr_3fr] gap-3 flex-1 min-h-0 pb-4">
                {/* Visual Chart Area */}
                <div className="flex flex-col min-w-0 h-full">
                    <div className="flex items-center gap-1.5 px-0.5 pb-1 shrink-0">
                        <MapIcon className="w-3 h-3 text-emerald-600" />
                        <span className="text-[9px] font-black uppercase text-amber-900/60 tracking-wider">
                            Distribution
                        </span>
                    </div>
                    <div className="bg-amber-50/30 rounded-lg p-1 border border-amber-200/60 flex items-center justify-center flex-1 min-h-0">
                        <AshtakavargaChart
                            type={isSarva ? 'sarva' : 'bhinna'}
                            ascendantSign={ascSign || 1}
                            houseValues={houseValues}
                            className="w-full h-full max-w-[200px]"
                        />
                    </div>
                </div>

                {/* Matrix Table Area */}
                <div className="flex flex-col h-full space-y-1">
                    <div className="flex items-center gap-1.5 px-0.5 shrink-0">
                        <Table2 className="w-3 h-3 text-emerald-600" />
                        <span className="text-[9px] font-black uppercase text-amber-900/60 tracking-wider">
                            Bindu Matrix
                        </span>
                    </div>
                    <PremiumAshtakavargaMatrix
                        data={fullData as any}
                        type={isSarva ? 'sarva' : 'bhinna'}
                        planet={selectedPlanet}
                        onPlanetChange={setSelectedPlanet}
                        className="border-none flex-1 min-h-0"
                    />
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT RENDERER - Returns only the inner content (no card wrapper)
// For use inside ResizableWidgetBox
// ═══════════════════════════════════════════════════════════════════════════════
export function renderWidgetContent(
    item: CustomizeChartItem & {
        instanceId: string;
        size: WidgetSize;
        collapsed: boolean;
        ayanamsa?: string;
        onRemove: () => void;
        onSizeChange?: (s: WidgetSize) => void;
        onDuplicate?: () => void;
        onCollapseToggle?: () => void;
        onAyanamsaChange?: (a: string) => void;
    },
    clientId: string,
    activeSystem: string
): React.ReactNode {
    // Use widget-specific ayanamsa if set, otherwise fall back to global activeSystem
    const widgetAyanamsa = item.ayanamsa || activeSystem;

    // Build props for widgets that need the full WidgetBoxProps
    const props: WidgetBoxProps = {
        widget: item,
        onRemove: item.onRemove,
        clientId,
        activeSystem: widgetAyanamsa,
        size: item.size,
        collapsed: item.collapsed,
        onSizeChange: item.onSizeChange,
        onDuplicate: item.onDuplicate,
        onCollapseToggle: item.onCollapseToggle,
        onAyanamsaChange: item.onAyanamsaChange,
    };

    switch (item.category) {
        case 'dasha':
            return <DashaWidgetContent widget={item} clientId={clientId} activeSystem={widgetAyanamsa} />;
        case 'widget_chakra':
            return <ChakraWidgetContent activeSystem={widgetAyanamsa} />;
        case 'widget_shodasha':
            return <ShodashaWidgetContent activeSystem={widgetAyanamsa} />;
        case 'ashtakavarga':
            return <AshtakavargaWidgetContent widget={item} activeSystem={widgetAyanamsa} />;
        // For other widgets, use the full widget component (it has its own WidgetCard)
        case 'widget_shadbala':
            return <ShadbalaWidgetContent activeSystem={widgetAyanamsa} />;
        case 'widget_pushkara':
            return <PushkaraWidget {...props} />;
        case 'widget_karaka':
            return <KarakaWidget {...props} />;
        case 'widget_yoga':
            return <YogaWidget {...props} />;
        case 'widget_dosha':
            return <DoshaWidget {...props} />;
        case 'widget_transit':
            return <TransitWidget {...props} />;
        case 'widget_remedy':
            return <RemedyWidget {...props} />;
        case 'kp_module':
            return <KpModuleWidgetContent widget={item} activeSystem={widgetAyanamsa} />;
        default:
            return (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <AlertCircle className="w-8 h-8 text-amber-700/30 mb-3" />
                    <p className="text-[11px] text-amber-900/50">{item.name} content</p>
                </div>
            );
    }
}

// Export size class helper — controls grid column span
export function getWidgetSizeClasses(size?: WidgetSize) {
    switch (size) {
        case 'small':
            return '';
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
