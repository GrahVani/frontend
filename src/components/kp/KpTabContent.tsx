"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import type { KpHouseSignification, KpBhavaRaw, KpRulingPlanetsResponse, KpHoraryResponse } from '@/types/kp.types';
import type {
    KpCuspItem,
    KpPlanetItem,
    KpSignificationItem,
    KpInterlinkItem,
    KpNadiData,
    KpFortunaData,
} from '@/hooks/useKpTransformedData';

// ─── Dynamic Imports with Error Fallbacks (CA-020) ───────────────────

function DynamicErrorFallback({ name }: { name: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-red-700 font-serif">Failed to load {name}</p>
            <p className="text-xs text-muted mt-1">Try refreshing the page</p>
        </div>
    );
}

function DynamicLoadingFallback() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
        </div>
    );
}

const KpPlanetaryTable = dynamic(() => import('@/components/kp/KpPlanetaryTable').catch(() => ({ default: () => <DynamicErrorFallback name="Planetary Table" /> })), { loading: DynamicLoadingFallback });
const SignificationMatrix = dynamic(() => import('@/components/kp/SignificationMatrix').catch(() => ({ default: () => <DynamicErrorFallback name="Signification Matrix" /> })), { loading: DynamicLoadingFallback });
const RulingPlanetsWidget = dynamic(() => import('@/components/kp/RulingPlanetsWidget').catch(() => ({ default: () => <DynamicErrorFallback name="Ruling Planets" /> })), { loading: DynamicLoadingFallback });
const HoraryPanel = dynamic(() => import('@/components/kp/HoraryPanel').catch(() => ({ default: () => <DynamicErrorFallback name="Horary Panel" /> })), { loading: DynamicLoadingFallback });
const BhavaDetailsTable = dynamic(() => import('@/components/kp/BhavaDetailsTable').catch(() => ({ default: () => <DynamicErrorFallback name="Bhava Details" /> })), { loading: DynamicLoadingFallback });
const HouseSignificatorsTable = dynamic(() => import('@/components/kp/HouseSignificatorsTable').catch(() => ({ default: () => <DynamicErrorFallback name="House Significators" /> })), { loading: DynamicLoadingFallback });
const KpFortunaView = dynamic(() => import('@/components/kp/KpFortunaView').then(m => ({ default: m.KpFortunaView })).catch(() => ({ default: () => <DynamicErrorFallback name="Fortuna View" /> })), { loading: DynamicLoadingFallback });
const KpFocusedCuspView = dynamic(() => import('@/components/kp/KpFocusedCuspView').then(m => ({ default: m.KpFocusedCuspView })).catch(() => ({ default: () => <DynamicErrorFallback name="Cusp View" /> })), { loading: DynamicLoadingFallback });
const KpAdvancedSslView = dynamic(() => import('@/components/kp/KpAdvancedSslView').then(m => ({ default: m.KpAdvancedSslView })).catch(() => ({ default: () => <DynamicErrorFallback name="SSL View" /> })), { loading: DynamicLoadingFallback });
const KpNakshatraNadiFocusedView = dynamic(() => import('@/components/kp/KpNakshatraNadiFocusedView').then(m => ({ default: m.KpNakshatraNadiFocusedView })).catch(() => ({ default: () => <DynamicErrorFallback name="Nadi View" /> })), { loading: DynamicLoadingFallback });
const ShodashaVargaTable = dynamic(() => import('@/components/astrology/ShodashaVargaTable').catch(() => ({ default: () => <DynamicErrorFallback name="Ashtakavarga" /> })), { loading: DynamicLoadingFallback });

// ─── Types ───────────────────────────────────────────────────────────

export type KpTab = 'planets-cusps' | 'significations' | 'planetary-significators' | 'bhava-details' | 'ruling-planets' | 'horary' | 'interlinks' | 'advanced-ssl' | 'fortuna' | 'nakshatra-nadi' | 'ashtakavarga';

interface KpTabContentProps {
    activeTab: KpTab;
    // Transformed data
    planetaryData: KpPlanetItem[];
    cuspData: KpCuspItem[];
    houseSignificators: KpHouseSignification[];
    significationData: KpSignificationItem[];
    interlinksData: KpInterlinkItem[];
    sslData: KpInterlinkItem[];
    nadiData: KpNadiData | null;
    fortunaData: KpFortunaData | null;
    bhavaDetails: Record<string, KpBhavaRaw>;
    // Query states
    planetsCuspsLoading: boolean;
    houseSignificationsLoading: boolean;
    planetSignificatorsLoading: boolean;
    bhavaDetailsLoading: boolean;
    interlinksLoading: boolean;
    advancedSslLoading: boolean;
    nakshatraNadiLoading: boolean;
    fortunaLoading: boolean;
    ashtakavargaLoading: boolean;
    // Query data for conditional checks
    interlinksHasData: boolean;
    advancedSslHasData: boolean;
    nakshatraNadiHasData: boolean;
    fortunaHasData: boolean;
    ashtakavargaData: Record<string, unknown> | null;
    // Ruling planets
    rulingPlanetsData: KpRulingPlanetsResponse['data'] | null;
    rulingPlanetsLoading: boolean;
    rulingPlanetsRefetch: () => void;
    rulingPlanetsCalculatedAt?: string;
    // Horary
    onHorarySubmit: (horaryNumber: number, question: string) => void;
    horaryResult?: KpHoraryResponse['data'] | null;
    horaryLoading: boolean;
    horaryError?: string;
}

// ─── Shared Section Wrapper ──────────────────────────────────────────

function TabSection({ title, subtitle, badge, children, noPadding }: {
    title: string;
    subtitle?: string;
    badge?: string;
    children: React.ReactNode;
    noPadding?: boolean;
}) {
    return (
        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
            <div className="bg-border-warm px-3 py-1.5 border-b border-antique flex justify-between items-center">
                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>{title}</h3>
                {subtitle && (
                    <span className={cn(TYPOGRAPHY.subValue, "text-[10px] hidden sm:inline-block")}>{subtitle}</span>
                )}
                {badge && (
                    <div className="px-2 py-0.5 bg-gold-primary/10 rounded border border-gold-primary/20">
                        <span className={cn(TYPOGRAPHY.label, "text-[9px] uppercase tracking-widest")}>{badge}</span>
                    </div>
                )}
            </div>
            <div className={cn("w-full", noPadding ? "" : "")}>
                {children}
            </div>
        </div>
    );
}

function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
        </div>
    );
}

function EmptyMessage({ text }: { text: string }) {
    return <p className="text-primary text-center py-8">{text}</p>;
}

// ─── Main Component ──────────────────────────────────────────────────

export default function KpTabContent(props: KpTabContentProps) {
    const { activeTab } = props;

    switch (activeTab) {
        case 'planets-cusps':
            return (
                <TabSection title="Planetary positions with star & sub lords">
                    {props.planetsCuspsLoading && !props.planetaryData.length ? (
                        <LoadingSpinner />
                    ) : props.planetaryData.length > 0 ? (
                        <KpPlanetaryTable planets={props.planetaryData} className="border-none shadow-none rounded-none" />
                    ) : (
                        <EmptyMessage text="No planetary data available" />
                    )}
                </TabSection>
            );

        case 'significations':
            return (
                <TabSection
                    title="House significations"
                    subtitle="Planets that signify specific houses based on their stellar positions"
                >
                    {props.houseSignificationsLoading && !props.houseSignificators.length ? (
                        <LoadingSpinner />
                    ) : props.houseSignificators.length > 0 ? (
                        <HouseSignificatorsTable data={props.houseSignificators} className="border-none shadow-none rounded-none" />
                    ) : (
                        <EmptyMessage text="No house signification data available" />
                    )}
                </TabSection>
            );

        case 'planetary-significators':
            return (
                <TabSection
                    title="Planetary significators"
                    subtitle="Which houses are signified by each planet - the core of KP prediction"
                >
                    {props.planetSignificatorsLoading && !props.significationData.length ? (
                        <LoadingSpinner />
                    ) : props.significationData.length > 0 ? (
                        <SignificationMatrix significations={props.significationData} className="border-none shadow-none rounded-none" />
                    ) : (
                        <EmptyMessage text="No planetary significator data available" />
                    )}
                </TabSection>
            );

        case 'bhava-details':
            return (
                <TabSection title="Bhava Details" badge="Placidus / KP">
                    {props.bhavaDetailsLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <BhavaDetailsTable bhavaDetails={props.bhavaDetails} className="w-full border-none shadow-none rounded-none" />
                    )}
                </TabSection>
            );

        case 'ruling-planets':
            return (
                <div className="w-full">
                    <RulingPlanetsWidget
                        data={props.rulingPlanetsData || null}
                        isLoading={props.rulingPlanetsLoading}
                        onRefresh={props.rulingPlanetsRefetch}
                        calculatedAt={props.rulingPlanetsCalculatedAt}
                    />
                </div>
            );

        case 'horary':
            return (
                <div className="max-w-2xl mx-auto">
                    <HoraryPanel
                        onSubmit={props.onHorarySubmit}
                        result={props.horaryResult}
                        isLoading={props.horaryLoading}
                        error={props.horaryError}
                    />
                </div>
            );

        case 'interlinks':
            return (
                <TabSection title="Cuspal Interlinks">
                    <div className="p-6">
                        {props.interlinksLoading ? (
                            <LoadingSpinner />
                        ) : props.interlinksHasData ? (
                            <KpFocusedCuspView promises={props.interlinksData} cusps={props.cuspData} />
                        ) : (
                            <EmptyMessage text="No interlinks data available" />
                        )}
                    </div>
                </TabSection>
            );

        case 'advanced-ssl':
            return (
                <TabSection title="Advanced Sub-Sub Lord View">
                    <div className="p-6">
                        {props.advancedSslLoading ? (
                            <LoadingSpinner />
                        ) : props.advancedSslHasData ? (
                            <KpAdvancedSslView promises={props.sslData} cusps={props.cuspData} />
                        ) : (
                            <EmptyMessage text="No Advanced SSL data available" />
                        )}
                    </div>
                </TabSection>
            );

        case 'nakshatra-nadi':
            return (
                <TabSection title="Nakshatra Nadi Coordinates">
                    <div className="p-6">
                        {props.nakshatraNadiLoading ? (
                            <LoadingSpinner />
                        ) : props.nakshatraNadiHasData && props.nadiData ? (
                            <KpNakshatraNadiFocusedView data={{ nadiData: props.nadiData }} />
                        ) : (
                            <EmptyMessage text="No Nakshatra Nadi data available" />
                        )}
                    </div>
                </TabSection>
            );

        case 'fortuna':
            return (
                <TabSection title="Pars Fortuna">
                    <div className="p-6">
                        {props.fortunaLoading ? (
                            <LoadingSpinner />
                        ) : props.fortunaHasData && props.fortunaData ? (
                            <KpFortunaView data={{ fortunaData: props.fortunaData }} />
                        ) : (
                            <EmptyMessage text="No Fortuna data available" />
                        )}
                    </div>
                </TabSection>
            );

        case 'ashtakavarga':
            return (
                <TabSection title="Ashtakavarga Matrix">
                    <div className="p-6">
                        {props.ashtakavargaLoading ? (
                            <LoadingSpinner />
                        ) : props.ashtakavargaData ? (
                            <ShodashaVargaTable data={props.ashtakavargaData} />
                        ) : (
                            <EmptyMessage text="No Ashtakavarga data available" />
                        )}
                    </div>
                </TabSection>
            );

        default:
            return <EmptyMessage text="Select a tab to view data" />;
    }
}
