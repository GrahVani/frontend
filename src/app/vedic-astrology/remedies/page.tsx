"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
    Gem,
    Sparkles,
    HandHeart,
    Scroll,
    Flame,
    Shield,
    BookOpen,
    Loader2,
    AlertTriangle,
    ArrowLeft,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import { clientApi } from '@/lib/api';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import dynamic from 'next/dynamic';

const DashboardLoading = () => <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-amber-500 animate-spin" /></div>;
const UpayaDashboard = dynamic(() => import('@/components/upaya/UpayaDashboard'), { loading: DashboardLoading });
const YantraDashboard = dynamic(() => import('@/components/upaya/YantraDashboard'), { loading: DashboardLoading });
const LalKitabDashboard = dynamic(() => import('@/components/upaya/LalKitabDashboard'), { loading: DashboardLoading });
const VedicRemediesDashboard = dynamic(() => import('@/components/upaya/VedicRemediesDashboard'), { loading: DashboardLoading });
const MantraAnalysisDashboard = dynamic(() => import('@/components/upaya/MantraAnalysisDashboard'), { loading: DashboardLoading });

// ============================================================================
// Remedy Type Definitions (Lahiri-Exclusive — 5 Endpoints)
// ============================================================================

interface RemedyTab {
    id: string;
    apiType: string; // What to pass to generateChart
    name: string;
    sanskrit: string;
    description: string;
    icon: React.ReactNode;
}

const REMEDY_TABS: RemedyTab[] = [
    {
        id: 'gemstone',
        apiType: 'remedy:gemstone',
        name: 'Gemstones',
        sanskrit: 'रत्न चिकित्सा',
        description: 'Planetary gemstone prescriptions for strengthening weak planets',
        icon: <Gem className="w-4 h-4" />
    },
    {
        id: 'mantra',
        apiType: 'remedy:mantra',
        name: 'Mantras',
        sanskrit: 'मंत्र साधना',
        description: 'Sacred syllables for planetary propitiation',
        icon: <Flame className="w-4 h-4" />
    },
    {
        id: 'yantra',
        apiType: 'remedy:yantra',
        name: 'Yantra',
        sanskrit: 'यंत्र',
        description: 'Sacred geometric diagrams for cosmic alignment',
        icon: <Shield className="w-4 h-4" />
    },
    {
        id: 'vedic_remedies',
        apiType: 'remedy:vedic_remedies',
        name: 'Vedic Remedies',
        sanskrit: 'वैदिक उपाय',
        description: 'Traditional Vedic remedial prescriptions and rituals',
        icon: <BookOpen className="w-4 h-4" />
    },
    {
        id: 'lal_kitab',
        apiType: 'remedy:lal_kitab',
        name: 'Lal Kitab',
        sanskrit: 'लाल कितब',
        description: 'Unique remedies from the Lal Kitab tradition',
        icon: <Scroll className="w-4 h-4" />
    },
];

// ============================================================================
// Generic Remedy Data Renderer
// ============================================================================
function RemedyDataView({ data, type }: { data: Record<string, unknown>; type: string }) {
    if (!data) {
        return (
            <div className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <p className="text-[14px] text-amber-800">No remedy data available for this type.</p>
            </div>
        );
    }

    // Special view for Gemstones (Dashboard style)
    if (type === 'gemstone') {
        return <UpayaDashboard data={data} />;
    }

    // Special view for Yantras (Sadhana Dashboard style)
    if (type === 'yantra') {
        return <YantraDashboard data={data} />;
    }

    // Special view for Lal Kitab (Remedial Dashboard style)
    if (type === 'lal_kitab') {
        return <LalKitabDashboard data={data} />;
    }

    // Special view for Vedic Remedies (Royal Purple Dashboard style)
    if (type === 'vedic_remedies' || type === 'vedic') {
        return <VedicRemediesDashboard data={data} />;
    }

    // Special view for Mantra Analysis (Sacred Sadhana Dashboard style)
    if (type === 'mantra') {
        return <MantraAnalysisDashboard data={data} />;
    }

    // Try to extract the actual remedy content from various response formats
    const remedyContent = data.data || data.remedies || data;

    // If it's an object with named keys (common pattern from astro engine)
    if (typeof remedyContent === 'object' && !Array.isArray(remedyContent)) {
        return (
            <div className="space-y-4">
                {Object.entries(remedyContent).map(([key, value]: [string, unknown]) => {
                    // Skip metadata keys
                    if (['ayanamsa', 'system', 'cached', 'chart_type', 'birth_details'].includes(key)) return null;

                    return (
                        <div key={key} className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <h3 className={cn(TYPOGRAPHY.sectionTitle, "mb-3 flex items-center gap-2 text-amber-900")}>
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                {key.replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                            </h3>
                            {typeof value === 'string' ? (
                                <p className={TYPOGRAPHY.value}>{value}</p>
                            ) : typeof value === 'object' && value !== null ? (
                                <div className="space-y-2">
                                    {Array.isArray(value) ? (
                                        value.map((item: unknown, i: number) => (
                                            <div key={i} className="bg-white rounded-xl border border-amber-200/60 shadow-sm p-4">
                                                {typeof item === 'string' ? (
                                                    <p className={TYPOGRAPHY.value}>{item}</p>
                                                ) : (typeof item === 'object' && item !== null) ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                        {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                                                            <div key={k} className="text-[14px]">
                                                                <span className={TYPOGRAPHY.label}>{k.replace(/_/g, ' ')}: </span>
                                                                <span className={TYPOGRAPHY.value}>{String(v)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className={TYPOGRAPHY.value}>{String(item)}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        Object.entries(value).map(([k, v]) => (
                                            <div key={k} className="flex items-start gap-2 text-[14px] bg-amber-50/60 rounded-lg p-3">
                                                <span className={cn(TYPOGRAPHY.label, "min-w-[120px]")}>{k.replace(/_/g, ' ')}</span>
                                                <span className={TYPOGRAPHY.value}>{typeof v === 'object' ? JSON.stringify(v, null, 2) : String(v)}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <p className={TYPOGRAPHY.value}>{String(value)}</p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // If it's an array
    if (Array.isArray(remedyContent)) {
        return (
            <div className="space-y-3">
                {remedyContent.map((item: unknown, i: number) => (
                    <div key={i} className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
                        {typeof item === 'string' ? (
                            <p className={TYPOGRAPHY.value}>{item}</p>
                        ) : (typeof item === 'object' && item !== null) ? (
                            <div className="space-y-2">
                                {Object.entries(item as Record<string, unknown>).map(([k, v]) => (
                                    <div key={k} className="flex items-start gap-2 text-[14px]">
                                        <span className={cn(TYPOGRAPHY.label, "min-w-[120px]")}>{k.replace(/_/g, ' ')}</span>
                                        <span className={TYPOGRAPHY.value}>{String(v)}</span>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ))}
            </div>
        );
    }

    // Fallback: render as formatted JSON
    return (
        <div className="bg-amber-50/60 rounded-xl p-6 border border-amber-200/60">
            <pre className="text-[12px] text-amber-800/70 whitespace-pre-wrap overflow-auto max-h-96">
                {JSON.stringify(remedyContent, null, 2)}
            </pre>
        </div>
    );
}

// ============================================================================
// Main Remedies Page (Upaya)
// ============================================================================
export default function RemediesPage() {
    const { clientDetails, processedCharts, isLoadingCharts, isRefreshingCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const [activeTab, setActiveTab] = useState('gemstone');
    const [error, setError] = useState<string | null>(null);
    
    // Get remedy data from database (processedCharts)
    const remedyKey = `remedy_${activeTab}_${ayanamsa.toLowerCase()}`;
    const remedyRaw = processedCharts[remedyKey]?.chartData;
    const remedyData = useMemo(() => {
        const data = remedyRaw?.data || remedyRaw;
        return (data || {}) as Record<string, Record<string, unknown>>;
    }, [remedyRaw]);
    const loading = !remedyData && (isLoadingCharts || isRefreshingCharts);

    // Handle refresh - trigger charts refresh
    const handleRefresh = () => {
        window.location.reload();
    };

    const [selectedPlanet, setSelectedPlanet] = useState<string>('');
    const [selectedHouse, setSelectedHouse] = useState<string>('');

    const PLANETS = [
        "Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"
    ];

    const HOUSES = Array.from({ length: 12 }, (_, i) => String(i + 1));

    const clientId = clientDetails?.id || '';
    const activeRemedyTab = REMEDY_TABS.find(t => t.id === activeTab)!;

    // Data is now fetched from database (processedCharts) - no API calls needed
    // The system automatically fetches remedies when client is loaded

    // System check — Remedies are Lahiri-exclusive
    if (ayanamsa !== 'Lahiri') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-10 max-w-md">
                    <Gem className="w-12 h-12 text-amber-600 mb-4 mx-auto" />
                    <h2 className={cn(TYPOGRAPHY.sectionTitle, "mb-2 text-amber-900")}>Upaya — Lahiri only</h2>
                    <p className={cn(TYPOGRAPHY.value, "max-w-md text-amber-700")}>
                        Remedial prescriptions are currently available exclusively with the <strong>Lahiri Ayanamsa</strong>.
                        Please switch to Lahiri from the header dropdown to access remedies.
                    </p>
                </div>
            </div>
        );
    }

    if (!clientDetails) return null;

    const isFixedLayoutTab = ['mantra', 'yantra', 'vedic_remedies', 'lal_kitab'].includes(activeTab);

    return (
        <div className={cn("min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 animate-in fade-in duration-500", isFixedLayoutTab ? "h-[calc(100vh-140px)] overflow-hidden flex flex-col gap-2" : "space-y-6 pb-10")}>

            {/* Remedy Type Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl border border-amber-200/60 shadow-sm">
                {REMEDY_TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all",
                            TYPOGRAPHY.label,
                            "!font-bold !mb-0",
                            activeTab === tab.id
                                ? cn("text-white shadow-md", COLORS.wbActiveTab)
                                : "text-amber-800 hover:text-amber-900 hover:bg-amber-50/60"
                        )}
                    >
                        <span className={activeTab === tab.id ? "text-white" : "text-amber-600"}>{tab.icon}</span>
                        <span>{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* Lal Kitab Specific Inputs */}
            {activeTab === 'lal_kitab' && (
                <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border border-amber-200/60 shadow-sm animate-in slide-in-from-top-2">
                    <div className="flex flex-col gap-1.5">
                        <label className={cn(TYPOGRAPHY.label, "mb-0 text-amber-700")}>Select planet</label>
                        <select
                            value={selectedPlanet}
                            onChange={(e) => setSelectedPlanet(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-amber-200 bg-white text-[14px] text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-200 min-w-[150px]"
                        >
                            <option value="">-- All / General --</option>
                            {PLANETS.map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className={cn(TYPOGRAPHY.label, "mb-0 text-amber-700")}>Select house</label>
                        <select
                            value={selectedHouse}
                            onChange={(e) => setSelectedHouse(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-amber-200 bg-white text-[14px] text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-200 min-w-[150px]"
                        >
                            <option value="">-- All / General --</option>
                            {HOUSES.map(h => (
                                <option key={h} value={h}>{h} House</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-amber-500 text-white text-[14px] font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 shadow-sm"
                            disabled={isRefreshingCharts}
                        >
                            <RefreshCw className={cn("w-4 h-4", isRefreshingCharts && "animate-spin")} />
                            {isRefreshingCharts ? 'Loading...' : 'Get remedies'}
                        </button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className={cn(isFixedLayoutTab ? "flex-1 min-h-0 overflow-hidden" : "min-h-[300px]")}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-amber-200/60 shadow-sm">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
                        <p className={cn(TYPOGRAPHY.subValue, "italic text-amber-700")}>Consulting planetary prescriptions...</p>
                    </div>
                ) : error ? (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center">
                        <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-red-900 mb-1")}>Prescription unavailable</h3>
                        <p className={cn(TYPOGRAPHY.subValue, "text-red-600 max-w-md mx-auto !text-[12px]")}>{error}</p>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshingCharts}
                            className={cn(TYPOGRAPHY.label, "mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg !text-[12px] !font-bold hover:bg-red-200 transition-colors !mb-0 disabled:opacity-50")}
                        >
                            {isRefreshingCharts ? 'Loading...' : 'Try again'}
                        </button>
                    </div>
                ) : remedyData ? (
                    <RemedyDataView data={remedyData} type={activeTab} />
                ) : activeTab === 'lal_kitab' ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-amber-200/60 shadow-sm animate-in fade-in">
                        <Scroll className="w-10 h-10 text-amber-500 mb-4 opacity-70" />
                        <h3 className={cn(TYPOGRAPHY.sectionTitle, "mb-2 text-amber-900")}>Lal Kitab remedies</h3>
                        <p className={cn(TYPOGRAPHY.value, "max-w-md text-center mb-6 text-amber-700")}>
                            Lal Kitab remedies are highly specific. Please select a Planet and a House above to view the precise remedial measures.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-amber-200/60 shadow-sm">
                        <Gem className="w-8 h-8 text-amber-600 mb-3" />
                        <p className={cn(TYPOGRAPHY.value, "text-amber-700")}>Select a remedy type to view prescriptions</p>
                    </div>
                )}
            </div>
        </div>
    );
}
