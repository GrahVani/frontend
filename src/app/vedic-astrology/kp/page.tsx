"use client";

import React, { useState } from 'react';
import { useVedicClient } from '@/context/VedicClientContext';
import { useAstrologerStore } from '@/store/useAstrologerStore';
import {
    useKpPlanetsCusps,
    useKpRulingPlanets,
    useKpBhavaDetails,
    useKpHouseSignifications,
    useKpPlanetSignificators,
    useKpHoraryMutation,
    useKpInterlinks,
    useKpAdvancedInterlinks,
    useKpNakshatraNadi,
    useKpFortuna,
} from '@/hooks/queries/useKP';
import { useAshtakavarga } from '@/hooks/queries/useCalculations';
import { useKpTransformedData } from '@/hooks/useKpTransformedData';
import dynamic from 'next/dynamic';
import type { KpSection } from '@/components/kp/KpDashboardSidebar';
import KpTabContent from '@/components/kp/KpTabContent';
import type { KpTab } from '@/components/kp/KpTabContent';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';
import { Loader2, LayoutGrid, Grid3x3, Home, Clock, HelpCircle, Star } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

// Lazy-load the chart
const KpCuspalChart = dynamic(() => import('@/components/kp/KpCuspalChart'), {
    loading: () => <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 text-gold-primary animate-spin" /></div>,
});

// ─── Tab Definitions ─────────────────────────────────────────────────

const tabs: { id: KpTab; label: string; icon: React.ReactNode }[] = [
    { id: 'planets-cusps', label: 'Planets & Cusps', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'significations', label: 'House Significations', icon: <Star className="w-4 h-4" /> },
    { id: 'planetary-significators', label: 'Planetary Significators', icon: <Grid3x3 className="w-4 h-4" /> },
    { id: 'bhava-details', label: 'Bhava Details', icon: <Home className="w-4 h-4" /> },
    { id: 'interlinks', label: 'Interlinks', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'advanced-ssl', label: 'Advanced SSL', icon: <Star className="w-4 h-4" /> },
    { id: 'nakshatra-nadi', label: 'Nakshatra Nadi', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'fortuna', label: 'Pars Fortuna', icon: <Clock className="w-4 h-4" /> },
    { id: 'ruling-planets', label: 'Ruling Planets', icon: <Clock className="w-4 h-4" /> },
];

const VALID_TABS = tabs.map(t => t.id) as string[];

// ─── Page Component ──────────────────────────────────────────────────

export default function KpDashboardPage() {
    const { clientDetails, processedCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<KpTab>('planets-cusps');
    const [activeSidebarSection, setActiveSidebarSection] = useState<KpSection>('dashboard');

    const clientId = clientDetails?.id || '';

    // URL <-> tab sync
    React.useEffect(() => {
        const tab = searchParams.get('tab') as KpTab;
        if (tab && VALID_TABS.includes(tab)) {
            setActiveTab(tab);
        } else if (!tab) {
            setActiveTab('planets-cusps');
        }
    }, [searchParams]);

    // ── Queries ──────────────────────────────────────────────────────

    const planetsCuspsQuery = useKpPlanetsCusps(clientId);
    const houseSignificationsQuery = useKpHouseSignifications(clientId, { enabled: activeTab === 'significations' });
    const planetSignificatorsQuery = useKpPlanetSignificators(clientId, { enabled: activeTab === 'planetary-significators' || activeTab === 'significations' });
    const bhavaDetailsQuery = useKpBhavaDetails(clientId, { enabled: activeTab === 'bhava-details' });
    const rulingPlanetsQuery = useKpRulingPlanets(clientId, { enabled: activeTab === 'ruling-planets' || activeSidebarSection === 'ruling-planets' || activeSidebarSection === 'dashboard' });
    const horaryMutation = useKpHoraryMutation();
    const interlinksQuery = useKpInterlinks(clientId, { enabled: activeTab === 'interlinks' });
    const advancedSslQuery = useKpAdvancedInterlinks(clientId, { enabled: activeTab === 'advanced-ssl' });
    const nakshatraNadiQuery = useKpNakshatraNadi(clientId, { enabled: activeTab === 'nakshatra-nadi' });
    const fortunaQuery = useKpFortuna(clientId, { enabled: activeTab === 'fortuna' });
    const ashtakavargaQuery = useAshtakavarga(clientId, ayanamsa, 'shodasha');

    // ── Data Transformation (extracted hook) ─────────────────────────

    const transformed = useKpTransformedData({
        processedCharts,
        planetsCuspsQuery,
        houseSignificationsQuery,
        planetSignificatorsQuery,
        bhavaDetailsQuery,
        rulingPlanetsQuery,
        interlinksQuery,
        advancedSslQuery,
        nakshatraNadiQuery,
        fortunaQuery,
    });

    // ── Guard Clauses ────────────────────────────────────────────────

    if (ayanamsa !== 'KP') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Star className="w-12 h-12 text-ink/45 mb-4" />
                <h2 className={cn(TYPOGRAPHY.sectionTitle, "mb-2")}>KP system not selected</h2>
                <p className={cn(TYPOGRAPHY.subValue, "max-w-md")}>
                    Please select <strong className="text-ink">KP (Krishnamurti)</strong> from the Ayanamsa dropdown in the header to access KP features.
                </p>
            </div>
        );
    }

    if (!clientDetails) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
            </div>
        );
    }

    // ── Tab Change Handler ───────────────────────────────────────────

    const handleTabChange = (tabId: KpTab) => {
        setActiveTab(tabId);
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tabId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const showHeader = activeTab !== 'ashtakavarga' && activeTab !== 'horary';



    // ── Render ───────────────────────────────────────────────────────

    return (
        <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-2 animate-in fade-in duration-500 pt-0 overflow-hidden">
            {/* Header & Tab Bar (Consolidated for vertical space) */}
            {showHeader && (
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2 bg-background/90 backdrop-blur-md pb-1 -mx-2 px-2 md:-mx-4 md:px-4 pt-1 shrink-0">
                    <h1 className={cn(TYPOGRAPHY.sectionTitle, "shrink-0 mb-0 opacity-80 text-[14px]")}>KP dashboard</h1>

                    <div className="flex gap-1 p-0.5 prem-card rounded-lg shadow-sm overflow-x-auto scrollbar-thin max-w-full">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all whitespace-nowrap shrink-0",
                                    TYPOGRAPHY.value,
                                    "text-[11px] font-semibold",
                                    activeTab === tab.id
                                        ? cn("text-white shadow-md border-transparent", COLORS.wbActiveTab)
                                        : "text-ink hover:text-ink hover:bg-white/50 border-transparent"
                                )}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Content Grid: Chart + Tab Content */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch flex-1 min-h-0 overflow-hidden">
                {/* Left: Persistent Cuspal Chart */}
                {activeTab !== 'ashtakavarga' && (
                    <div className="xl:col-span-4 h-full relative">
                        <div className="prem-card rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm h-full max-h-full">
                            <div className="bg-gold-primary/10 px-3 py-1 border-b border-gold-primary/15 shrink-0">
                                <h3 className={cn(TYPOGRAPHY.value, "text-[16px] text-ink leading-tight tracking-wide")}>Cuspal chart</h3>
                            </div>
                            <div className="flex-1 min-h-0 bg-transparent">
                                {planetsCuspsQuery.isLoading && !transformed.cuspData.length ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                    </div>
                                ) : transformed.cuspData.length > 0 ? (
                                    <div className="w-full h-full p-2 flex items-center justify-center">
                                        <KpCuspalChart
                                            planets={transformed.d1Data.planets}
                                            houseSigns={transformed.cuspData.map(c => c.signId)}
                                            className="w-full h-full max-w-full max-h-full aspect-square bg-transparent border-none"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-ink text-center py-4 text-[12px]">No cusp data available</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Right: Tab Content */}
                <div className={cn("flex-1 min-h-0 flex flex-col h-full overflow-hidden", activeTab === 'ashtakavarga' ? "xl:col-span-12" : "xl:col-span-8")}>
                    <div className="flex-1 min-h-0">
                        <KpTabContent
                            activeTab={activeTab}
                            planetaryData={transformed.planetaryData}
                            cuspData={transformed.cuspData}
                            houseSignificators={transformed.houseSignificators}
                            significationData={transformed.significationData}
                            interlinksData={transformed.interlinksData}
                            sslData={transformed.sslData}
                            nadiData={transformed.nadiData}
                            fortunaData={transformed.fortunaData}
                            bhavaDetails={transformed.bhavaDetails}
                            planetsCuspsLoading={planetsCuspsQuery.isLoading}
                            houseSignificationsLoading={houseSignificationsQuery.isLoading}
                            planetSignificatorsLoading={planetSignificatorsQuery.isLoading}
                            bhavaDetailsLoading={bhavaDetailsQuery.isLoading}
                            interlinksLoading={interlinksQuery.isLoading}
                            advancedSslLoading={advancedSslQuery.isLoading}
                            nakshatraNadiLoading={nakshatraNadiQuery.isLoading}
                            fortunaLoading={fortunaQuery.isLoading}
                            ashtakavargaLoading={ashtakavargaQuery.isLoading}
                            interlinksHasData={!!interlinksQuery.data?.data}
                            advancedSslHasData={!!advancedSslQuery.data?.data}
                            nakshatraNadiHasData={!!nakshatraNadiQuery.data?.data}
                            fortunaHasData={!!fortunaQuery.data?.data}
                            ashtakavargaData={(ashtakavargaQuery.data?.data || ashtakavargaQuery.data || null) as Record<string, unknown> | null}
                            rulingPlanetsData={rulingPlanetsQuery.data?.data ?? null}
                            rulingPlanetsLoading={rulingPlanetsQuery.isLoading}
                            rulingPlanetsRefetch={() => rulingPlanetsQuery.refetch()}
                            rulingPlanetsCalculatedAt={rulingPlanetsQuery.data?.calculatedAt}
                            onHorarySubmit={(horaryNumber, question) => {
                                horaryMutation.mutate({ clientId, horaryNumber, question });
                            }}
                            horaryResult={horaryMutation.data?.data}
                            horaryLoading={horaryMutation.isPending}
                            horaryError={horaryMutation.error?.message}
                        />
                    </div>


                </div>
            </div>
        </div>
    );
}
