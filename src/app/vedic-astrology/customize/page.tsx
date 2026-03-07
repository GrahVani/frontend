"use client";

import React, { useState, useMemo } from 'react';
import {
    LayoutGrid,
    Sparkles,
    History,
    Settings2,
    Maximize2,
    Loader2,
    Search,
    RefreshCw,
    Shield,
    Calendar,
    Table as TableIcon,
    Zap,
    Hexagon,
    Target,
    BarChart2,
    ChevronDown
} from 'lucide-react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi, CHART_METADATA, DASHA_TYPES } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from "@/design-tokens/typography";
import { parseChartData, signIdToName, fullPlanetNames } from '@/lib/chart-helpers';

// Components
import { ChartWithPopup } from '@/components/astrology/NorthIndianChart';
import SouthIndianChart from '@/components/astrology/SouthIndianChart';
import VimshottariTreeGrid from '@/components/astrology/VimshottariTreeGrid';
import BirthPanchanga from '@/components/astrology/BirthPanchanga';
import PlanetaryTable from '@/components/astrology/PlanetaryTable';
import AshtakavargaMatrix from '@/components/astrology/AshtakavargaMatrix';
import dynamic from 'next/dynamic';

const YogaAnalysisView = dynamic(() => import('@/components/astrology/YogaAnalysis'));
const DoshaAnalysis = dynamic(() => import('@/components/astrology/DoshaAnalysis'));
const ShadbalaDashboard = dynamic(() => import('@/components/astrology/ShadbalaDashboard'));

// KP Components — lazy loaded (below fold)
const KpPlanetaryTable = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpPlanetaryTable })));
const KpCuspalChart = dynamic(() => import('@/components/kp').then(m => ({ default: m.KpCuspalChart })), { ssr: false });
const SignificationMatrix = dynamic(() => import('@/components/kp').then(m => ({ default: m.SignificationMatrix })));
const RulingPlanetsWidget = dynamic(() => import('@/components/kp').then(m => ({ default: m.RulingPlanetsWidget })));
const BhavaDetailsTable = dynamic(() => import('@/components/kp').then(m => ({ default: m.BhavaDetailsTable })));

// Hooks
import {
    useDasha,
    useAshtakavarga,
    useShadbala,
} from '@/hooks/queries/useCalculations';
import {
    useKpPlanetsCusps,
    useKpRulingPlanets,
    useKpBhavaDetails,
    useKpSignifications,
} from '@/hooks/queries/useKP';
import { processDashaResponse, RawDashaPeriod } from '@/lib/dasha-utils';

type SectionId =
    | 'vedic-foundation' | 'vedic-charts' | 'vedic-dashas' | 'vedic-analysis' | 'vedic-strength'
    | 'kp-foundation' | 'kp-structures' | 'kp-insights' | 'kp-ruling';

const ANALYSIS_ITEMS = [
    { id: 'gaja_kesari', name: 'Gaja Kesari Yoga', category: 'yoga' },
    { id: 'pancha_mahapurusha', name: 'Maha Purusha Yogas', category: 'yoga' },
    { id: 'sade_sati', name: 'Sade Sati', category: 'dosha' },
    { id: 'angarak', name: 'Angarak Dosha', category: 'dosha' },
    { id: 'dhaiya', name: 'Dhaiya (Kantaka Shani)', category: 'dosha' },
    { id: 'ashtakavarga', name: 'Ashtakavarga', category: 'matrix' },
    { id: 'shadbala', name: 'Shadbala Strengths', category: 'system' }
];

const FOUNDATION_ITEMS = [
    { id: 'panchanga', name: 'Birth Panchanga', icon: Calendar },
    { id: 'planets', name: 'Planetary Positions', icon: TableIcon }
];

export default function CustomizePage() {
    const { clientDetails, processedCharts, isGeneratingCharts, refreshCharts } = useVedicClient();
    const { ayanamsa, chartStyle, chartColorTheme } = useAstrologerStore();

    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSection, setActiveSection] = useState<string>('');
    const [isNavModalOpen, setIsNavModalOpen] = useState(false);

    const activeSystem = ayanamsa.toLowerCase();
    const isKpSystem = activeSystem.includes('kp');
    const clientId = clientDetails?.id || '';

    // --- VEDIC DATA ---
    const { data: dashaResponse, isLoading: dashaLoading } = useDasha(
        !isKpSystem ? clientId : '',
        'mahadasha',
        activeSystem
    );

    const { data: ashtakavargaData, isLoading: ashtakavargaLoading } = useAshtakavarga(
        (!isKpSystem) ? clientId : '',
        activeSystem,
        'sarva'
    );

    const { data: shadbalaResult, isLoading: shadbalaLoading } = useShadbala(
        (!isKpSystem && ayanamsa === 'Lahiri') ? clientId : ''
    );

    // --- KP DATA ---
    const { data: kpPlanetsCusps, isLoading: kpPlanetsLoading } = useKpPlanetsCusps(isKpSystem ? clientId : '');
    const { data: kpRulingPlanets, isLoading: kpRulingLoading } = useKpRulingPlanets(isKpSystem ? clientId : '');
    const { data: kpBhavaDetails, isLoading: kpBhavaLoading } = useKpBhavaDetails(isKpSystem ? clientId : '');
    const { data: kpSignifications, isLoading: kpSignificationsLoading } = useKpSignifications(isKpSystem ? clientId : '');

    // Normalize Shadbala Data
    const normalizedShadbala = useMemo(() => {
        const raw = (shadbalaResult?.data?.data || shadbalaResult?.data || shadbalaResult) as any;
        if (!raw || !raw.shadbala_virupas) return null;

        const planets: any[] = [];
        const planetKeys = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
        const MIN_BALA: Record<string, number> = { 'Sun': 6.5, 'Moon': 6.0, 'Mars': 5.0, 'Mercury': 7.0, 'Jupiter': 6.5, 'Venus': 7.5, 'Saturn': 5.0 };

        planetKeys.forEach(p => {
            const details = (raw[`${p}_details`] || {}) as Record<string, number>;
            const virupas = (raw.shadbala_virupas?.[p]) || 0;
            const rupas = (raw.shadbala_rupas?.[p]) || 0;
            const rank = (raw.relative_rank?.[p]) || 0;
            const strength = (raw.strength_summary?.[p]) || 'Weak';
            const ishKas = (raw.ishta_kashta_phala?.[p]) || { Ishta: 0, Kashta: 0 };

            const kalaBala = [
                details['Ayana Bala'] || 0, details['Natonnata Bala'] || 0, details['Paksha Bala'] || 0,
                details['Tri-Bhaga Bala'] || 0, details['Kaala_Dina_Bala'] || 0, details['Varsha_Bala'] || 0,
                details['Maasa_Bala'] || 0, details['Vaara_Bala'] || 0, details['Hora_Bala'] || 0
            ].reduce((a, b) => a + b, 0);

            planets.push({
                planet: p, sthalaBala: details['STHANA TOTAL'] || 0, digBala: details['Dig Bala'] || 0,
                kalaBala, cheshtaBala: details['Chesta Bala'] || 0, naisargikaBala: details['Naisargika Bala'] || 0,
                drikBala: details['Drik Bala'] || 0, totalBala: virupas, rupaBala: rupas,
                minBalaRequired: (MIN_BALA[p] || 6.0) * 60, ratio: rupas / (MIN_BALA[p] || 6.0),
                rank, isStrong: strength === 'Strong', ishtaKashta: { ishta: ishKas.Ishta || 0, kashta: ishKas.Kashta || 0 }
            });
        });

        return { planets, ayanamsa: 'Lahiri', system: 'Chitrapaksha', raw };
    }, [shadbalaResult]);

    // Sidebar navigation items
    const sections = useMemo(() => {
        if (isKpSystem) {
            return [
                { id: 'kp-ruling', name: 'Ruling Planets', icon: Sparkles, desc: 'Real-time stellar forces governing the moment' },
                { id: 'kp-foundation', name: 'Planets & Cusps', icon: Target, desc: 'Detailed planetary positions and sub-lord analysis' },
                { id: 'kp-structures', name: 'Cuspal Chart', icon: LayoutGrid, desc: 'KP house geometries and bhava details' },
                { id: 'kp-insights', name: 'Significations', icon: Zap, desc: 'Planetary and house thematic significations' },
            ];
        }

        const chartItems = [
            { id: 'D1', name: 'D1 - Rashi', icon: LayoutGrid, desc: 'The fundamental physical existence' },
            { id: 'D2', name: 'D2 - Hora', icon: LayoutGrid, desc: 'Wealth and prosperity' },
            { id: 'D3', name: 'D3 - Drekkana', icon: LayoutGrid, desc: 'Siblings and courage' },
            { id: 'D4', name: 'D4 - Chaturthamsha', icon: LayoutGrid, desc: 'Fortune and fixed assets' },
            { id: 'D7', name: 'D7 - Saptamsha', icon: LayoutGrid, desc: 'Progeny and creative fruits' },
            { id: 'D9', name: 'D9 - Navamsha', icon: LayoutGrid, desc: 'The internal fruit and marriage' },
            { id: 'D10', name: 'D10 - Dashamsha', icon: LayoutGrid, desc: 'Career and public achievements' },
            { id: 'D12', name: 'D12 - Dwadashamsha', icon: LayoutGrid, desc: 'Parents and ancestry' },
            { id: 'D16', name: 'D16 - Shodashamsha', icon: LayoutGrid, desc: 'Vehicles and comforts' },
            { id: 'D20', name: 'D20 - Vimshamsha', icon: LayoutGrid, desc: 'Spiritual progress and devotion' },
            { id: 'D24', name: 'D24 - Chaturvimshamsha', icon: LayoutGrid, desc: 'Learning and knowledge' },
            { id: 'D27', name: 'D27 - Saptavimshamsha', icon: LayoutGrid, desc: 'General strength and vitality' },
            { id: 'D30', name: 'D30 - Trimshamsha', icon: LayoutGrid, desc: 'Evils and misfortunes' },
            { id: 'D40', name: 'D40 - Khavedamsha', icon: LayoutGrid, desc: 'Auspicious/Inauspicious effects' },
            { id: 'D45', name: 'D45 - Akshavedamsha', icon: LayoutGrid, desc: 'General character and fruits' },
            { id: 'D60', name: 'D60 - Shashtiamsha', icon: LayoutGrid, desc: 'Past karma and detailed results' }
        ];

        return [
            ...chartItems,
            { id: 'vedic-dashas', name: 'Time Cycles', icon: History, desc: 'Vimshottari Dasha chronological mapping' },
            { id: 'vedic-analysis', name: 'Yoga & Dosha', icon: Sparkles, desc: 'Special planetary combinations and status' },
            ...(ayanamsa === 'Lahiri' ? [{ id: 'vedic-strength', name: 'Shadbala', icon: BarChart2, desc: 'Mathematical strength of planets' }] : [])
        ];
    }, [isKpSystem, ayanamsa]);

    const handleSectionSelect = (id: string) => {
        setActiveSection(id);
        setIsNavModalOpen(false);
    };

    // Derived Data for Foundation components
    const d1Data = useMemo(() => {
        const d1Chart = processedCharts[`D1_${activeSystem}`]?.chartData;
        return parseChartData(d1Chart);
    }, [processedCharts, activeSystem]);

    const planetaryTableData = useMemo(() => {
        return d1Data.planets.map(p => ({
            planet: fullPlanetNames[p.name] || p.name,
            sign: signIdToName[p.signId] || '-',
            degree: p.degree,
            nakshatra: p.nakshatra || '-',
            nakshatraPart: p.pada ? (typeof p.pada === 'number' ? p.pada : parseInt(String(p.pada).replace('Pada ', ''))) : undefined,
            house: p.house || 0,
            isRetro: p.isRetro
        }));
    }, [d1Data]);

    const birthPanchangaData = processedCharts['birth_panchanga_universal']?.chartData;

    // Chart Parsing Helpers
    const getChartProps = (id: string) => {
        const chartData = processedCharts[`${id}_${activeSystem}`]?.chartData || null;
        return parseChartData(chartData);
    };

    if (!clientDetails) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-12 bg-white/50 backdrop-blur-md rounded-[2rem] border border-antique shadow-inner mx-4 my-8">
                <Shield className="w-16 h-16 text-antique mb-6 opacity-30" />
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "text-primary")}>Select a Profile</h2>
                <p className={cn(TYPOGRAPHY.label, "max-w-xs mx-auto")}>Choose a client from the global explorer to begin comprehensive celestial analysis.</p>
            </div>
        );
    }

    // Aggregate Section Renderer
    const renderVedicSections = () => {
        switch (activeSection) {
            case 'vedic-dashas':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Chronological Cycles" subtitle="Vimshottari Dasha Hierarchy" icon={<History className="w-6 h-6" />} />
                        <div className="bg-white p-8 rounded-[2.5rem] border border-antique shadow-sm max-w-4xl mx-auto">
                            <VimshottariTreeGrid
                                data={dashaResponse ? processDashaResponse(dashaResponse as unknown as RawDashaPeriod).slice(0, 9) : []}
                                isLoading={dashaLoading}
                                className="border-none shadow-none"
                            />
                        </div>
                    </section>
                );
            case 'vedic-analysis':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Stellar Insights" subtitle="Yoga, Dosha & Ashtakavarga Matrix" icon={<Sparkles className="w-6 h-6" />} />
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnalysisPanel title="Gaja Kesari Analysis">
                                    <YogaAnalysisView clientId={clientId} yogaType="gaja_kesari" ayanamsa={activeSystem} />
                                </AnalysisPanel>
                                <AnalysisPanel title="Sade Sati Status">
                                    <DoshaAnalysis clientId={clientId} doshaType="sade_sati" ayanamsa={activeSystem} />
                                </AnalysisPanel>
                            </div>
                            {ashtakavargaData && (
                                <div className="bg-white p-8 rounded-[2.5rem] border border-antique shadow-sm">
                                    <h4 className={cn(TYPOGRAPHY.value, "text-center mb-6 text-xl")}>Sarvashtakavarga Matrix</h4>
                                    <AshtakavargaMatrix type="sarva" data={ashtakavargaData as any} />
                                </div>
                            )}
                        </div>
                    </section>
                );
            case 'vedic-strength':
                if (ayanamsa !== 'Lahiri') return null;
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Planetary Potencies" subtitle="Shadbala Strength Analysis" icon={<BarChart2 className="w-6 h-6" />} />
                        <div className="bg-white p-6 rounded-[2.5rem] border border-antique shadow-sm">
                            {shadbalaLoading ? <Loader2 className="w-10 h-10 animate-spin mx-auto text-antique" /> :
                                normalizedShadbala ? <ShadbalaDashboard displayData={normalizedShadbala} /> :
                                    <p className="text-center opacity-40 py-12">Shadbala data unavailable.</p>
                            }
                        </div>
                    </section>
                );
            default:
                // Check if it's a D-chart
                if (activeSection.startsWith('D')) {
                    return (
                        <section className="space-y-8 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                            <SectionHeader title={`${activeSection} Matrix`} subtitle={CHART_METADATA[activeSection as keyof typeof CHART_METADATA]?.name || 'Divisional Chart'} icon={<LayoutGrid className="w-6 h-6" />} />
                            <ChartBox
                                title={`${activeSection} - ${CHART_METADATA[activeSection as keyof typeof CHART_METADATA]?.name || activeSection}`}
                                chartId={activeSection}
                                chartProps={getChartProps(activeSection)}
                                theme={chartColorTheme}
                                style={chartStyle}
                            />
                        </section>
                    );
                }

                // Empty state prompting selection
                return (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-12">
                        <div className="w-20 h-20 bg-parchment/50 rounded-[2rem] flex items-center justify-center mb-8 border border-antique shadow-inner">
                            <LayoutGrid className="w-8 h-8 text-antique opacity-50" />
                        </div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl text-primary mb-2")}>Select a Chart</h3>
                        <p className={cn(TYPOGRAPHY.label, "max-w-md mx-auto opacity-60")}>Open the Celestial Navigator above to choose a specific divisional chart or astrological component for deep analysis.</p>
                        <button
                            onClick={() => setIsNavModalOpen(true)}
                            className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Open Navigator
                        </button>
                    </div>
                );
        }
    };

    {/* Dasha Section */ }
    <section id="vedic-dashas" className="space-y-8">
        <SectionHeader title="Chronological Cycles" subtitle="Vimshottari Dasha Hierarchy" icon={<History className="w-6 h-6" />} />
        <div className="bg-white p-8 rounded-[2.5rem] border border-antique shadow-sm max-w-4xl mx-auto">
            <VimshottariTreeGrid
                data={dashaResponse ? processDashaResponse(dashaResponse as unknown as RawDashaPeriod).slice(0, 9) : []}
                isLoading={dashaLoading}
                className="border-none shadow-none"
            />
        </div>
    </section>

    {/* Analysis Section */ }
    <section id="vedic-analysis" className="space-y-8">
        <SectionHeader title="Stellar Insights" subtitle="Yoga, Dosha & Ashtakavarga Matrix" icon={<Sparkles className="w-6 h-6" />} />
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnalysisPanel title="Gaja Kesari Analysis">
                    <YogaAnalysisView clientId={clientId} yogaType="gaja_kesari" ayanamsa={activeSystem} />
                </AnalysisPanel>
                <AnalysisPanel title="Sade Sati Status">
                    <DoshaAnalysis clientId={clientId} doshaType="sade_sati" ayanamsa={activeSystem} />
                </AnalysisPanel>
            </div>
            {ashtakavargaData && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-antique shadow-sm">
                    <h4 className={cn(TYPOGRAPHY.value, "text-center mb-6 text-xl")}>Sarvashtakavarga Matrix</h4>
                    <AshtakavargaMatrix type="sarva" data={ashtakavargaData as any} />
                </div>
            )}
        </div>
    </section>

    {/* Shadbala Section */ }
    {
        ayanamsa === 'Lahiri' && (
            <section id="vedic-strength" className="space-y-8">
                <SectionHeader title="Planetary Potencies" subtitle="Shadbala Strength Analysis" icon={<BarChart2 className="w-6 h-6" />} />
                <div className="bg-white p-6 rounded-[2.5rem] border border-antique shadow-sm">
                    {shadbalaLoading ? <Loader2 className="w-10 h-10 animate-spin mx-auto text-antique" /> :
                        normalizedShadbala ? <ShadbalaDashboard displayData={normalizedShadbala} /> :
                            <p className="text-center opacity-40 py-12">Shadbala data unavailable.</p>
                    }
                </div>
            </section>
        )
    };

    const renderKpSections = () => {
        switch (activeSection) {
            case 'kp-ruling':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Ruling Forces" subtitle="Stellar Time-Dynamics (RP)" icon={<Sparkles className="w-6 h-6" />} />
                        <div className="max-w-4xl mx-auto">
                            <RulingPlanetsWidget data={kpRulingPlanets?.data || null} isLoading={kpRulingLoading} className="shadow-2xl border-antique !bg-white/80" />
                        </div>
                    </section>
                );
            case 'kp-foundation':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Cuspal Foundation" subtitle="Planetary Positions & Sub-Lords" icon={<Target className="w-6 h-6" />} />
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            <div className="md:col-span-12 bg-white p-6 rounded-3xl border border-antique shadow-sm">
                                <KpPlanetaryTable
                                    planets={Object.entries(kpPlanetsCusps?.data?.planets || {}).map(([name, p]) => ({
                                        name,
                                        fullName: name,
                                        sign: p.sign,
                                        signId: 1, // Defaulting as we don't have signId in Raw
                                        degree: parseFloat(p.longitude.split(' ')[1] || '0'),
                                        degreeFormatted: p.longitude,
                                        house: p.house,
                                        nakshatra: p.nakshatra,
                                        nakshatraLord: p.star_lord,
                                        subLord: p.sub_lord,
                                        isRetrograde: p.is_retro
                                    }))}
                                    className="border-none"
                                />
                            </div>
                        </div>
                    </section>
                );
            case 'kp-structures':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Cuspal Geometries" subtitle="North Indian KP Chart & Bhava Details" icon={<LayoutGrid className="w-6 h-6" />} />
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                            <div className="md:col-span-5 flex justify-center">
                                <div className="w-full max-w-md aspect-square bg-white border border-antique rounded-[2.5rem] p-10 shadow-xl overflow-hidden">
                                    <KpCuspalChart
                                        planets={Object.entries(kpPlanetsCusps?.data?.planets || {}).map(([name, p]) => ({
                                            name: name.substring(0, 2),
                                            degree: p.longitude.split(' ')[1] || p.longitude,
                                            house: p.house,
                                            signId: 1,
                                            isRetro: p.is_retro
                                        }))}
                                        houseSigns={Object.values(kpPlanetsCusps?.data?.house_cusps || {}).map(c => 1) || Array(12).fill(1)}
                                        className="h-full w-full"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-antique shadow-sm">
                                <BhavaDetailsTable bhavaDetails={kpBhavaDetails?.data?.bhava_details || {}} className="border-none shadow-none" />
                            </div>
                        </div>
                    </section>
                );
            case 'kp-insights':
                return (
                    <section className="space-y-8 animate-in fade-in duration-500">
                        <SectionHeader title="Thematic Matrices" subtitle="Planetary & House Significations" icon={<Zap className="w-6 h-6" />} />
                        <div className="bg-white p-8 rounded-[2.5rem] border border-antique shadow-sm">
                            <SignificationMatrix significations={kpSignifications?.data?.significations || []} />
                        </div>
                    </section>
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-12">
                        <div className="w-20 h-20 bg-parchment/50 rounded-[2rem] flex items-center justify-center mb-8 border border-antique shadow-inner">
                            <Zap className="w-8 h-8 text-antique opacity-50" />
                        </div>
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-2xl text-primary mb-2")}>Select KP Analysis</h3>
                        <p className={cn(TYPOGRAPHY.label, "max-w-md mx-auto opacity-60")}>Open the Celestial Navigator above to choose a KP module for deep exploration.</p>
                        <button
                            onClick={() => setIsNavModalOpen(true)}
                            className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center gap-3"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Open Navigator
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col gap-8 p-6 min-h-screen bg-softwhite/50 animate-in fade-in duration-700">
            {/* STICKY TOP NAVIGATION BAR */}
            <div className="sticky top-0 z-50 w-full">
                <div className="bg-white/80 backdrop-blur-xl border border-antique rounded-[2.5rem] p-4 lg:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Settings2 className="w-5 h-5" />
                        </div>
                        <div className="hidden sm:block">
                            <h2 className={cn(TYPOGRAPHY.sectionTitle, "!mb-0 !text-lg text-primary font-black")}>AstraLab</h2>
                            <p className="text-[9px] text-accent-gold uppercase font-bold tracking-[0.2em]">{ayanamsa} Explorer</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <p className={cn(TYPOGRAPHY.label, "text-[10px] uppercase tracking-widest opacity-50 mb-1 absolute -top-5 left-2")}>Navigate Section</p>
                            <button
                                onClick={() => setIsNavModalOpen(true)}
                                className="w-full pl-5 pr-12 py-3.5 bg-parchment/40 border border-antique rounded-2xl text-xs font-bold text-primary flex items-center justify-between hover:bg-antique/10 transition-all shadow-sm group"
                            >
                                <span>{sections.find(s => s.id === activeSection)?.name || "Explore Lahiri..."}</span>
                                <div className="p-1 px-2.5 bg-primary/5 rounded-lg text-[10px] text-accent-gold border border-antique group-hover:bg-primary group-hover:text-white transition-all uppercase tracking-tighter font-black">Open Navigator</div>
                            </button>
                        </div>

                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-antique" />
                            <input
                                type="text"
                                placeholder="Filter insights..."
                                className="w-full pl-11 pr-4 py-3.5 bg-parchment/40 border border-antique rounded-2xl text-[11px] focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={refreshCharts}
                            disabled={isGeneratingCharts}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={cn("w-3.5 h-3.5", isGeneratingCharts && "animate-spin")} />
                            Sync
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN DASHBOARD */}
            <div className="flex-1">
                <main className="space-y-12">
                    {/* Dynamic Sections */}
                    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 fill-mode-both">
                        {isKpSystem ? renderKpSections() : renderVedicSections()}
                    </div>
                </main>
            </div>
            {/* NAVIGATION MODAL */}
            <NavigationModal
                isOpen={isNavModalOpen}
                onClose={() => setIsNavModalOpen(false)}
                sections={sections}
                onSelect={handleSectionSelect}
                activeId={activeSection}
                ayanamsa={ayanamsa}
            />
        </div>
    );
}

// Helper Components
function SectionHeader({ title, subtitle, icon }: { title: string, subtitle: string, icon: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <div className="w-14 h-14 rounded-2xl bg-parchment border border-antique flex items-center justify-center text-accent-gold shadow-md">
                {icon}
            </div>
            <div className="space-y-1">
                <h3 className="text-2xl font-black text-primary tracking-tight uppercase leading-none">{title}</h3>
                <p className={cn(TYPOGRAPHY.label, "text-xs tracking-[0.2em] font-bold opacity-60")}>{subtitle}</p>
            </div>
            <div className="w-12 h-1 bg-antique rounded-full" />
        </div>
    );
}

function ChartBox({ title, chartId, chartProps, theme, style }: any) {
    const { planets, ascendant } = chartProps;
    return (
        <div className="w-full max-w-md bg-white border border-antique rounded-[2.5rem] p-8 shadow-xl relative group hover:shadow-2xl transition-all duration-500">
            <h4 className={cn(TYPOGRAPHY.value, "text-center mb-6 text-sm opacity-60 uppercase tracking-widest")}>{title}</h4>
            <div className="aspect-square relative">
                {style === 'South Indian' ? (
                    <SouthIndianChart ascendantSign={ascendant} planets={planets} colorMode="color" colorTheme={theme} />
                ) : (
                    <ChartWithPopup ascendantSign={ascendant} planets={planets} className="bg-transparent border-none w-full h-full" showDegrees={chartId === 'D1'} />
                )}
            </div>
            <div className="absolute top-6 right-6 p-2.5 rounded-xl bg-parchment border border-antique opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-sm">
                <Maximize2 className="w-4 h-4 text-primary" />
            </div>
        </div>
    );
}

function AnalysisPanel({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-antique shadow-sm h-full flex flex-col">
            <h4 className={cn(TYPOGRAPHY.value, "mb-4 text-sm font-black uppercase tracking-tight text-primary/40 border-b border-antique pb-3")}>{title}</h4>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
}

function ChevronRight({ className }: { className?: string }) {
    return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>;
}

// Modal Component
function NavigationModal({ isOpen, onClose, sections, onSelect, activeId, ayanamsa }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-md" onClick={onClose} aria-hidden="true" />

            <div className="relative w-full max-w-2xl bg-white border border-antique rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Modal Header */}
                <div className="p-8 border-b border-antique flex items-center justify-between bg-softwhite">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl">
                            <LayoutGrid className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-primary tracking-tight uppercase leading-none mb-1">Celestial Navigator</h2>
                            <p className="text-[10px] text-accent-gold uppercase font-bold tracking-[0.2em]">{ayanamsa} Optimization Hub</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-antique/20 rounded-xl transition-all text-primary/40 hover:text-primary"
                    >
                        <RefreshCw className="w-5 h-5 rotate-45" />
                    </button>
                </div>

                {/* Modal Grid */}
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {sections.map((section: any) => (
                        <button
                            key={section.id}
                            onClick={() => onSelect(section.id)}
                            className={cn(
                                "flex items-start gap-4 p-5 rounded-[1.5rem] border transition-all text-left group",
                                activeId === section.id
                                    ? "bg-primary border-primary shadow-xl ring-2 ring-primary/20"
                                    : "bg-parchment/30 border-antique hover:border-primary/40 hover:bg-white"
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-xl transition-all",
                                activeId === section.id ? "bg-accent-gold text-white" : "bg-white text-antique group-hover:text-primary shadow-sm"
                            )}>
                                <section.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className={cn(
                                    "text-xs font-black uppercase tracking-tight mb-1",
                                    activeId === section.id ? "text-white" : "text-primary"
                                )}>
                                    {section.name}
                                </p>
                                <p className={cn(
                                    "text-[10px] leading-snug font-medium line-clamp-1",
                                    activeId === section.id ? "text-white/60" : "text-primary/40"
                                )}>
                                    {section.desc}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-parchment/20 text-center border-t border-antique">
                    <p className="text-[9px] text-bronze uppercase font-black tracking-widest opacity-50">Select a cosmic alignment to recalibrate your view</p>
                </div>
            </div>
        </div>
    );
}
