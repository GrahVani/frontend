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
import dynamic from 'next/dynamic';
import {
    KpDashboardHeader,
    KpChartSummaryPanel,
    KpDashboardSidebar,
} from '@/components/kp';
import type { KpSection } from '@/components/kp/KpDashboardSidebar';
import ShodashaVargaTable from '@/components/astrology/ShodashaVargaTable';
import { ChartWithPopup } from '@/components/astrology/NorthIndianChart';
import { TYPOGRAPHY } from '@/design-tokens/typography';
import { COLORS } from '@/design-tokens/colors';

// Dynamically import tab-specific KP components (only one tab renders at a time)
const KpPlanetaryTable = dynamic(() => import('@/components/kp/KpPlanetaryTable'));
const KpCuspalChart = dynamic(() => import('@/components/kp/KpCuspalChart'));
const SignificationMatrix = dynamic(() => import('@/components/kp/SignificationMatrix'));
const RulingPlanetsWidget = dynamic(() => import('@/components/kp/RulingPlanetsWidget'));
const HoraryPanel = dynamic(() => import('@/components/kp/HoraryPanel'));
const BhavaDetailsTable = dynamic(() => import('@/components/kp/BhavaDetailsTable'));
const HouseSignificatorsTable = dynamic(() => import('@/components/kp/HouseSignificatorsTable'));
const KpFortunaView = dynamic(() => import('@/components/kp/KpFortunaView').then(m => ({ default: m.KpFortunaView })));
const KpFocusedCuspView = dynamic(() => import('@/components/kp/KpFocusedCuspView').then(m => ({ default: m.KpFocusedCuspView })));
const KpAdvancedSslView = dynamic(() => import('@/components/kp/KpAdvancedSslView').then(m => ({ default: m.KpAdvancedSslView })));
const KpNakshatraNadiFocusedView = dynamic(() => import('@/components/kp/KpNakshatraNadiFocusedView').then(m => ({ default: m.KpNakshatraNadiFocusedView })));
import { parseChartData, signNameToId } from '@/lib/chart-helpers';
import { KpHouseSignification } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import {
    Loader2,
    LayoutGrid,
    Grid3x3,
    Home,
    Clock,
    HelpCircle,
    Star,
    ArrowLeft,
    Compass,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type KpTab = 'planets-cusps' | 'significations' | 'planetary-significators' | 'bhava-details' | 'ruling-planets' | 'horary' | 'interlinks' | 'advanced-ssl' | 'fortuna' | 'nakshatra-nadi' | 'ashtakavarga';

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

/**
 * KP Astrology Dashboard
 * Complete KP system interface with all 5 routes
 */
export default function KpDashboardPage() {
    const { clientDetails, processedCharts } = useVedicClient();
    const { ayanamsa } = useAstrologerStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<KpTab>('planets-cusps');
    const [viewMode, setViewMode] = useState<'dashboard' | 'detailed'>('detailed');
    const [activeSidebarSection, setActiveSidebarSection] = useState<KpSection>('dashboard');

    const clientId = clientDetails?.id || '';

    // Synchronize activeTab with URL search params
    React.useEffect(() => {
        const tab = searchParams.get('tab') as KpTab;
        if (tab && ['planets-cusps', 'significations', 'planetary-significators', 'bhava-details', 'ruling-planets', 'horary', 'interlinks', 'advanced-ssl', 'fortuna', 'nakshatra-nadi', 'ashtakavarga'].includes(tab)) {
            setActiveTab(tab);
            setViewMode('detailed');
        } else if (!tab) {
            // Reset to defaults if no tab is specified (e.g. clicking "KP System" link)
            setActiveTab('planets-cusps');
            setViewMode('detailed');
        }
    }, [searchParams]);

    // Queries - planetsCusps is always needed for the chart
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

    // D1 Data for Visual Chart - Prioritize live KP data
    const d1Data = React.useMemo(() => {
        // 1. Try Live KP Data
        if (planetsCuspsQuery.data?.data) {
            const { ascendant, planets } = planetsCuspsQuery.data.data;
            let ascSignId = 1;

            // Parse Ascendant
            if (ascendant) {
                const signName = ascendant.sign;
                // Normalize sign name (e.g. "Aries" -> "Aries")
                const normalized = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
                ascSignId = signNameToId[normalized] || 1;
            }

            // Parse Planets
            const visualPlanets: { name: string; signId: number; degree: string; isRetro: boolean; house: number }[] = [];
            // Handle Record<string, Planet>
            if (planets && !Array.isArray(planets)) {
                Object.entries(planets).forEach(([name, p]) => {
                    if (['Uranus', 'Neptune', 'Pluto'].includes(name)) return; // Exclude outer

                    const signName = p.sign;
                    const normalizedSign = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();

                    visualPlanets.push({
                        name: name.substring(0, 2), // Chart expects short names like 'Su', 'Mo'
                        signId: signNameToId[normalizedSign] || 1,
                        degree: p.longitude?.split('°')[0] + '°' || "0°", // Visual chart expects string
                        isRetro: p.is_retro || false,
                        house: p.house
                    });
                });
            }

            // Add Ascendant as a planet point 'As'
            visualPlanets.push({
                name: 'As',
                signId: ascSignId,
                degree: ascendant?.longitude?.split('°')[0] + '°' || "0°",
                isRetro: false,
                house: 1
            });

            return { planets: visualPlanets, ascendant: ascSignId };
        }

        // 2. Fallback to processedCharts
        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            const parsed = parseChartData(d1Kp.chartData);
            parsed.planets = parsed.planets.filter(p =>
                !['Uranus', 'Neptune', 'Pluto', 'Ur', 'Ne', 'Pl'].some(n => p.name.includes(n))
            );
            return parsed;
        }
        return { planets: [], ascendant: 1 };
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP Cusp Data - fallback to D1_kp houses if API fails
    // Helper to parse "268° 5' 50\"" to decimal
    const parseDms = (dms: string): number => {
        if (!dms) return 0;
        const match = dms.match(/(\d+)[°\s]+(\d+)['\s]+(\d+)/);
        if (match) {
            return parseFloat(match[1]) + parseFloat(match[2]) / 60 + parseFloat(match[3]) / 3600;
        }
        return parseFloat(dms) || 0;
    };

    // KP Cusp Data - Transform API object to Array
    const cuspData = React.useMemo(() => {
        const rawCusps = planetsCuspsQuery.data?.data?.house_cusps;
        if (rawCusps) {
            return Object.entries(rawCusps).map(([key, c]) => ({
                cusp: parseInt(key),
                sign: c.sign,
                signId: signNameToId[c.sign] || 1,
                degree: parseDms(c.longitude),
                degreeFormatted: c.longitude, // Use the provided DMS string
                nakshatra: c.nakshatra,
                nakshatraLord: c.star_lord, // Map JSON star_lord -> nakshatraLord
                subLord: c.sub_lord,      // Map JSON sub_lord -> subLord
            })).sort((a, b) => a.cusp - b.cusp);
        }

        // Fallback to D1_kp houses
        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            const data = d1Kp.chartData.data || d1Kp.chartData;
            const houses = data.houses || data.observations || [];

            if (Array.isArray(houses) && houses.length > 0) {
                return houses.map((h: any) => ({
                    cusp: h.house || h.house_number,
                    sign: h.sign || h.sign_name,
                    signId: h.sign_id || 1,
                    degree: h.degree || h.longitude,
                    degreeFormatted: h.degreeFormatted,
                    nakshatra: h.nakshatra || '-',
                    nakshatraLord: h.nakshatra_lord || '-',
                    subLord: h.sub_lord || '-'
                }));
            }
        }
        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP Planetary Data - Transform API object to Array
    const planetaryData = React.useMemo(() => {
        const rawResponse = planetsCuspsQuery.data?.data || processedCharts['kp_planets_cusps_kp']?.chartData?.data || processedCharts['kp_planets_cusps_kp']?.chartData;
        const rawPlanets = rawResponse?.planets || rawResponse?.planetary_positions;

        // Check if it's the new Record format (check if keys are strings like "Sun")
        if (rawPlanets && !Array.isArray(rawPlanets)) {
            return Object.entries(rawPlanets).map(([name, val]) => {
                const p = val as Record<string, string | number | boolean | undefined>;
                return {
                    name,
                    fullName: name,
                    sign: p.sign,
                    signId: signNameToId[p.sign as string] || 1,
                    degree: parseDms(String(p.longitude || p.degreeFormatted || p.degree || '')),
                    degreeFormatted: p.longitude || p.degreeFormatted || p.degree,
                    house: p.house || p.bhava,
                    nakshatra: p.nakshatra,
                    nakshatraLord: p.star_lord || p.nakshatra_lord || p.nakshatraLord,
                    subLord: p.sub_lord || p.subLord,
                    isRetrograde: p.is_retro || p.is_retrograde || p.isRetrograde || false
                };
            });
        }

        // Handle Array format (legacy or fallback)
        if (Array.isArray(rawPlanets)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rawPlanets.map((p: any) => ({
                name: p.name || p.planet,
                fullName: p.full_name || p.name || p.planet,
                sign: p.sign || '-',
                signId: p.sign_id || p.signId || signNameToId[p.sign] || 1,
                degree: typeof p.degree === 'number' ? p.degree : parseFloat(p.degree) || 0,
                degreeFormatted: p.degreeFormatted || p.longitude || p.degree || `${(p.degree || 0).toFixed(2)}°`,
                house: p.house || p.bhava || 1,
                nakshatra: p.nakshatra || '-',
                nakshatraLord: p.star_lord || p.nakshatra_lord || p.nakshatraLord || '-',
                subLord: p.sub_lord || p.subLord || '-',
                isRetrograde: p.isRetrograde || p.is_retro || p.is_retrograde || false
            }));
        }

        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // KP House Significator Data (House View)
    const houseSignificators = React.useMemo(() => {
        const rawResponse = planetsCuspsQuery.data?.data || houseSignificationsQuery.data?.data || processedCharts['kp_house_significations_kp']?.chartData?.data || processedCharts['kp_house_significations_kp']?.chartData;
        const planetsResponse = planetsCuspsQuery.data?.data || processedCharts['kp_planets_cusps_kp']?.chartData?.data || processedCharts['kp_planets_cusps_kp']?.chartData;

        // Check for new API format: house_significations inside the query response
        const newSignifications = rawResponse?.house_significations || rawResponse?.significators;

        if (newSignifications && planetsResponse?.planets) {
            const normalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

            // Create map of Planet -> StarLord
            const planetStarLords: Record<string, string> = {};
            const rawPlanets = planetsResponse.planets;
            if (Array.isArray(rawPlanets)) {
                rawPlanets.forEach((p: any) => {
                    planetStarLords[normalize(p.name || p.planet)] = normalize(p.star_lord || p.nakshatra_lord || '');
                });
            } else {
                Object.entries(rawPlanets).forEach(([k, v]: [string, any]) => {
                    planetStarLords[normalize(k)] = normalize(v.star_lord || v.nakshatra_lord || '');
                });
            }

            return Object.entries(newSignifications).map(([houseKey, hData]: [string, any]) => {
                const houseNum = parseInt(houseKey);
                if (isNaN(houseNum)) return null;

                const occupants: string[] = Array.isArray(hData.occupants) ? hData.occupants.map(normalize) : [];
                const lord: string = normalize(hData.lord);
                const nakshatraPlanets: string[] = Array.isArray(hData.nakshatra_planets) ? hData.nakshatra_planets.map(normalize) : [];

                const levelA: string[] = hData.A || [];
                const levelB: string[] = hData.B || occupants;
                const levelC: string[] = hData.C || [];
                const levelD: string[] = hData.D || (lord ? [lord] : []);

                if (levelA.length === 0 && levelC.length === 0 && nakshatraPlanets.length > 0) {
                    nakshatraPlanets.forEach(planet => {
                        const starLord = planetStarLords[planet];
                        if (!starLord) return;
                        if (occupants.includes(starLord)) levelA.push(planet);
                        if (starLord === lord) levelC.push(planet);
                    });
                }

                return {
                    house: houseNum,
                    levelA: Array.from(new Set(levelA)),
                    levelB: Array.from(new Set(levelB)),
                    levelC: Array.from(new Set(levelC)),
                    levelD: Array.from(new Set(levelD)),
                } as KpHouseSignification;
            }).filter((h): h is KpHouseSignification => h !== null).sort((a, b) => a.house - b.house);
        }

        return [];
    }, [planetsCuspsQuery.data, houseSignificationsQuery.data, processedCharts]);

    // KP Signification Data (Planet View)
    const significationData = React.useMemo(() => {
        const rawResponse = planetSignificatorsQuery.data?.data || processedCharts['kp_planet_significators_kp']?.chartData?.data || processedCharts['kp_planet_significators_kp']?.chartData;
        const apiData = rawResponse?.planet_significators || rawResponse;

        const KNOWN_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'];

        // If API provides direct matrix data
        if (apiData && typeof apiData === 'object' && !Array.isArray(apiData) && Object.keys(apiData).length > 0) {
            // Check if it's the actual matrix (keys are planets) or if the matrix is nested in another object
            const targetData = apiData.planet_significators || apiData.significators || apiData;

            // Only use this direct data path if it actually contains planet keys
            const hasPlanetKeys = Object.keys(targetData).some(key =>
                KNOWN_PLANETS.includes(key) || KNOWN_PLANETS.includes(key.charAt(0).toUpperCase() + key.slice(1).toLowerCase())
            );

            if (hasPlanetKeys) {
                return Object.entries(targetData)
                    .filter(([key]) => KNOWN_PLANETS.includes(key) || KNOWN_PLANETS.includes(key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()))
                    .map(([planet, details]: [string, any]) => {
                        const normalizedPlanet = planet.charAt(0).toUpperCase() + planet.slice(1).toLowerCase();
                        return {
                            planet: normalizedPlanet,
                            levelA: details.levelA || details["Very Strong"] || details.very_strong || [],
                            levelB: details.levelB || details["Strong"] || details.strong || [],
                            levelC: details.levelC || details["Normal"] || details.normal || [],
                            levelD: details.levelD || details["Weak"] || details.weak || [],
                            houses: Array.from(new Set([
                                ...(details.levelA || details["Very Strong"] || details.very_strong || []),
                                ...(details.levelB || details["Strong"] || details.strong || []),
                                ...(details.levelC || details["Normal"] || details.normal || []),
                                ...(details.levelD || details["Weak"] || details.weak || [])
                            ].map(Number))).sort((a: number, b: number) => a - b),
                            strong: (details.levelA || details["Very Strong"] || details.very_strong || []).length > 0
                        };
                    });
            }
        }

        // Fallback: Pivot houseSignificators to Planet View (Client-side calculation)
        const planetMap: Record<string, { A: number[], B: number[], C: number[], D: number[] }> = {};
        const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

        planets.forEach(p => { planetMap[p] = { A: [], B: [], C: [], D: [] }; });

        houseSignificators.forEach(h => {
            h.levelA.forEach((p: string) => { if (planetMap[p]) planetMap[p].A.push(h.house); });
            h.levelB.forEach((p: string) => { if (planetMap[p]) planetMap[p].B.push(h.house); });
            h.levelC.forEach((p: string) => { if (planetMap[p]) planetMap[p].C.push(h.house); });
            h.levelD.forEach((p: string) => { if (planetMap[p]) planetMap[p].D.push(h.house); });
        });

        return Object.entries(planetMap).map(([planet, levels]) => ({
            planet,
            houses: [...levels.A, ...levels.B, ...levels.C, ...levels.D].sort((a, b) => a - b),
            levelA: levels.A.sort((a, b) => a - b),
            levelB: levels.B.sort((a, b) => a - b),
            levelC: levels.C.sort((a, b) => a - b),
            levelD: levels.D.sort((a, b) => a - b),
            strong: (levels.A.length > 0 || levels.B.length > 0)
        }));
    }, [houseSignificators, planetSignificatorsQuery.data, processedCharts]);

    // --- DATA TRANSFORMATION HELPERS ---

    // 1. Interlinks Transformer
    const interlinksData = React.useMemo(() => {
        const raw = interlinksQuery.data?.data || processedCharts['kp_interlinks_kp']?.chartData?.data || processedCharts['kp_interlinks_kp']?.chartData;
        if (!raw) return [];

        const houseLords = raw.houses?.houses || {};

        // Try house_relationships (Basic Interlinks)
        if (raw.cuspal_interlinks?.house_relationships) {
            return Object.entries(raw.cuspal_interlinks.house_relationships).map(([house, data]: [string, any]) => {
                const hLords = houseLords[house] || {};
                return {
                    houseNumber: parseInt(house),
                    topic: `House ${house}`,
                    chain: {
                        signLord: { planet: hLords.sign_lord || '-', isRetro: false },
                        starLord: { planet: hLords.star_lord || '-', isRetro: false },
                        subLord: { planet: hLords.sub_lord || '-', isRetro: false },
                        subSubLord: { planet: hLords.sub_sub_lord || '-', isRetro: false }
                    },
                    positiveHouses: (data.favorable || []).map(Number),
                    negativeHouses: (data.adverse || []).map(Number),
                    strength: 'Neutral',
                    verdict: 'Neutral'
                };
            });
        }

        // Try analysis (Advanced)
        const analysis = raw.cuspal_interlinks_analysis || raw.cuspal_interlinks?.cuspal_interlinks_analysis;
        if (!analysis) return [];

        return Object.entries(analysis).map(([house, item]: [string, any]) => ({
            houseNumber: parseInt(house),
            topic: ((item.interpretation as string)?.split('-')[0]?.trim()) || `House ${house}`,
            chain: {
                signLord: { planet: item.cusp_lords?.sign_lord || '-', isRetro: false },
                starLord: { planet: item.cusp_lords?.star_lord || '-', isRetro: false },
                subLord: { planet: item.cusp_lords?.sub_lord || '-', isRetro: false },
                subSubLord: { planet: item.cusp_lords?.sub_sub_lord || '-', isRetro: false }
            },
            positiveHouses: (item.combined_positive_links || []).map(Number),
            negativeHouses: (item.combined_negative_links || []).map(Number),
            strength: item.promise_strength || 'Neutral',
            verdict: item.promise_strength || 'Neutral'
        }));
    }, [interlinksQuery.data, processedCharts]);

    // 2. SSL Transformer
    const sslData = React.useMemo(() => {
        const raw = advancedSslQuery.data?.data || processedCharts['kp_interlinks_advanced_kp']?.chartData?.data || processedCharts['kp_interlinks_advanced_kp']?.chartData;
        if (!raw) return [];

        const analysis = raw.cuspal_interlinks_analysis || raw.cuspal_interlinks?.cuspal_interlinks_analysis;
        if (!analysis) return [];

        return Object.entries(analysis).map(([house, item]: [string, any]) => ({
            houseNumber: parseInt(house),
            topic: `House ${house}`,
            chain: {
                signLord: { planet: item.cusp_lords?.sign_lord || '-', isRetro: false },
                starLord: { planet: item.cusp_lords?.star_lord || '-', isRetro: false },
                subLord: { planet: item.cusp_lords?.sub_lord || '-', isRetro: false },
                subSubLord: { planet: item.cusp_lords?.sub_sub_lord || '-', isRetro: false }
            },
            positiveHouses: (item.combined_positive_links || []).map(Number),
            negativeHouses: (item.combined_negative_links || []).map(Number),
            strength: item.promise_strength || 'Neutral',
            verdict: item.promise_strength || 'Neutral'
        }));
    }, [advancedSslQuery.data, processedCharts]);

    // 3. Nakshatra Nadi Transformer
    const nadiData = React.useMemo(() => {
        const raw = nakshatraNadiQuery.data?.data || processedCharts['kp_nakshatra_nadi_kp']?.chartData?.data || processedCharts['kp_nakshatra_nadi_kp']?.chartData;
        if (!raw || !raw.planets || !raw.houses) return null;

        // Transform Planets
        const planets = Object.entries(raw.planets || {}).map(([name, p]: [string, any]) => ({
            name: name,
            isRetro: p?.is_retrograde || p?.is_retro || false,
            longitude: p?.position_dms || p?.longitude || '0°0\'0"',
            sign: p?.sign_name || p?.sign || 'Unknown',
            nakshatraLord: p?.nakshatra_lord || p?.star_lord || '-',
            nakshatraName: p?.nakshatra_name || p?.nakshatra || '-',
            subLord: p?.sub_lord || '-'
        }));

        // Transform Cusps
        const cusps = Object.entries(raw.houses || {}).map(([key, h]: [string, any]) => {
            let label = key.replace('House_', '').replace('H', '');
            if (key === 'MC') label = '10';
            if (key === 'Ascendant' || key === 'Lagna') label = '1';

            return {
                label: label,
                longitude: h?.position_dms || h?.longitude || '0°0\'0"',
                sign: h?.sign_name || h?.sign || 'Unknown',
                nakshatraLord: h?.nakshatra_lord || h?.star_lord || '-',
                nakshatraName: h?.nakshatra_name || h?.nakshatra || '-',
                subLord: h?.sub_lord || '-'
            };
        }).sort((a, b) => {
            const numA = parseInt(a.label) || (a.label === '1' ? 1 : a.label === 'Ascendant' ? 1 : 99);
            const numB = parseInt(b.label) || (b.label === '1' ? 1 : b.label === 'Ascendant' ? 1 : 99);
            return numA - numB;
        });

        return { planets, cusps };
    }, [nakshatraNadiQuery.data, processedCharts]);

    // 4. Fortuna Transformer
    const fortunaData = React.useMemo(() => {
        const raw = fortunaQuery.data?.data || processedCharts['kp_fortuna_kp']?.chartData?.data || processedCharts['kp_fortuna_kp']?.chartData;
        if (!raw || !raw.details) return null;

        // Construct calculation array
        const calculation = [
            { component: 'Ascendant', dms: '-', longitude: raw.details.ascendant.longitude, sign: raw.details.ascendant.sign, house: raw.details.ascendant.house },
            { component: 'Moon', dms: '-', longitude: raw.details.moon.longitude, sign: raw.details.moon.sign, house: raw.details.moon.house },
            { component: 'Sun', dms: '-', longitude: raw.details.sun.longitude, sign: raw.details.sun.sign, house: raw.details.sun.house }
        ];

        return {
            calculation,
            fortunaHouse: {
                sign: raw.fortuna_sign,
                houseNumber: raw.fortuna_house,
                cuspLongitude: `${raw.fortuna_longitude?.toFixed(2)}`
            }
        };

    }, [fortunaQuery.data, processedCharts]);



    // KP Bhava Data
    // We now use the raw API response directly for the table
    const bhavaDetails = React.useMemo(() => {
        const raw = bhavaDetailsQuery.data?.data || processedCharts['kp_bhava_details_kp']?.chartData?.data || processedCharts['kp_bhava_details_kp']?.chartData;
        if (raw?.bhava_details) {
            return raw.bhava_details;
        }
        return {};
    }, [bhavaDetailsQuery.data, processedCharts]);

    // KP Debug Logs
    if (ayanamsa !== 'KP') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <Star className="w-12 h-12 text-muted mb-4" />
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

    // --- Dashboard Helper: Extract key data for summary panels ---
    const summaryPlanets = React.useMemo(() => {
        return planetaryData.map(p => ({
            name: p.fullName || p.name,
            sign: p.sign,
            isRetrograde: p.isRetrograde,
        }));
    }, [planetaryData]);

    const lagnaInfo = React.useMemo(() => {
        const asc = planetsCuspsQuery.data?.data?.ascendant;
        return {
            sign: asc?.sign || '—',
            lord: '—',
        };
    }, [planetsCuspsQuery.data]);

    const moonInfo = React.useMemo(() => {
        const moon = planetsCuspsQuery.data?.data?.planets?.Moon;
        return {
            sign: moon?.sign || '—',
            nakshatra: moon?.nakshatra || '—',
            starLord: moon?.star_lord || '—',
        };
    }, [planetsCuspsQuery.data]);

    const ayanamsaInfo = React.useMemo(() => {
        const ay = rulingPlanetsQuery.data?.data?.ayanamsa;
        if (ay?.value) {
            const deg = Math.floor(ay.value);
            const min = Math.floor((ay.value % 1) * 60);
            const sec = Math.round(((ay.value % 1) * 60 % 1) * 60);
            return `${deg}°${min}'${sec}""`;
        }
        return '—';
    }, [rulingPlanetsQuery.data]);

    // Cuspal table data for the dashboard view
    const cuspalTableData = React.useMemo(() => {
        return cuspData.map(c => ({
            house: c.cusp,
            sign: c.sign,
            degree: c.degreeFormatted || `${c.degree?.toFixed(2)}°`,
            starLord: c.nakshatraLord || '—',
            subLord: c.subLord || '—',
        }));
    }, [cuspData]);

    // Handle sidebar navigation scroll
    const handleSidebarSection = (section: KpSection) => {
        setActiveSidebarSection(section);
        const el = document.getElementById(`kp-section-${section}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pt-4">
            {/* Header */}
            {(activeTab as string) !== 'ashtakavarga' && (activeTab as string) !== 'horary' && (
                <div className="flex items-center justify-between">
                    <div>

                        <h1 className={TYPOGRAPHY.sectionTitle}>KP dashboard</h1>
                    </div>
                    <div className="flex items-center gap-3">
                    </div>
                </div>
            )
            }

            {/* Dashboard removed */}


            {/* ==================== DETAILED VIEW (Existing Tab-Based) ==================== */}
            {
                viewMode === 'detailed' && (
                    <div className="space-y-6">
                        {/* Tabs - Persistent at the top, starting from left */}
                        {(activeTab as string) !== 'ashtakavarga' && (activeTab as string) !== 'horary' && (
                            <div className="flex flex-wrap gap-1.5 p-1 bg-parchment rounded-xl border border-antique sticky top-[6.5rem] z-20 shadow-sm">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            setActiveTab(tab.id);
                                            const params = new URLSearchParams(searchParams.toString());
                                            params.set('tab', tab.id);
                                            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                                        }}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all",
                                            TYPOGRAPHY.value,
                                            "text-xs font-semibold", // Keeping size/weight as button specific
                                            activeTab === tab.id
                                                ? cn("text-white shadow-md border-transparent", COLORS.wbActiveTab)
                                                : "text-primary hover:text-ink hover:bg-white/50 border-transparent"
                                        )}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                            {/* Left Column: Persistent Cuspal Chart - Hidden in Ashtakavarga for full-width view */}
                            {activeTab !== 'ashtakavarga' && (
                                <div className="xl:col-span-4 sticky top-[10.5rem]">
                                    <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                        <div className="bg-border-warm px-3 py-1.5 border-b border-antique">
                                            <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Cuspal chart</h3>
                                        </div>
                                        <div className="w-full">
                                            {planetsCuspsQuery.isLoading && !cuspData.length ? (
                                                <div className="flex items-center justify-center py-12">
                                                    <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                </div>
                                            ) : cuspData.length > 0 ? (
                                                <div className="w-full h-[450px]">
                                                    <KpCuspalChart
                                                        planets={d1Data.planets}
                                                        houseSigns={cuspData.map(c => c.signId)}
                                                        className="w-full h-full bg-transparent border-none"
                                                    />
                                                </div>
                                            ) : (
                                                <p className="text-primary text-center py-8">No cusp data available</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Right Column: Content Area - Expanded to full width in Ashtakavarga */}
                            <div className={cn(
                                activeTab === 'ashtakavarga' ? "xl:col-span-12" : "xl:col-span-8"
                            )}>
                                {/* Tab Content */}
                                <div className="min-h-[400px]">
                                    {/* Planets & Cusps */}
                                    {activeTab === 'planets-cusps' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            {/* Planets Table */}
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Planetary positions with star & sub lords</h3>
                                            </div>
                                            <div className="w-full">
                                                {planetsCuspsQuery.isLoading && !planetaryData.length ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : planetaryData.length > 0 ? (
                                                    <KpPlanetaryTable planets={planetaryData} className="border-none shadow-none rounded-none" />
                                                ) : (
                                                    <p className="text-primary text-center py-8">No planetary data available</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* House Significations */}
                                    {activeTab === 'significations' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique flex justify-between items-center">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>House significations</h3>
                                                <span className={cn(TYPOGRAPHY.subValue, "text-[10px] hidden sm:inline-block")}>Planets that signify specific houses based on their stellar positions</span>
                                            </div>
                                            <div className="w-full">
                                                {houseSignificationsQuery.isLoading && !houseSignificators.length ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : houseSignificators.length > 0 ? (
                                                    <HouseSignificatorsTable data={houseSignificators} className="border-none shadow-none rounded-none" />
                                                ) : (
                                                    <p className="text-primary text-center py-8">No house signification data available</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Planetary Significators */}
                                    {activeTab === 'planetary-significators' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique flex justify-between items-center">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Planetary significators</h3>
                                                <span className={cn(TYPOGRAPHY.subValue, "text-[10px] hidden sm:inline-block")}>Which houses are signified by each planet - the core of KP prediction</span>
                                            </div>
                                            <div className="w-full">
                                                {planetSignificatorsQuery.isLoading && !significationData.length ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : significationData.length > 0 ? (
                                                    <SignificationMatrix significations={significationData} className="border-none shadow-none rounded-none" />
                                                ) : (
                                                    <p className="text-primary text-center py-8">No planetary significator data available</p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Bhava Details */}
                                    {activeTab === 'bhava-details' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique flex justify-between items-center">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Bhava Details</h3>
                                                <div className="px-2 py-0.5 bg-gold-primary/10 rounded border border-gold-primary/20">
                                                    <span className={cn(TYPOGRAPHY.label, "text-[9px] uppercase tracking-widest")}>Placidus / KP</span>
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                {bhavaDetailsQuery.isLoading ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : (
                                                    <BhavaDetailsTable bhavaDetails={bhavaDetails} className="w-full border-none shadow-none rounded-none" />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ruling Planets */}
                                    {activeTab === 'ruling-planets' && (
                                        <div className="w-full">
                                            <RulingPlanetsWidget
                                                data={rulingPlanetsQuery.data?.data || null}
                                                isLoading={rulingPlanetsQuery.isLoading}
                                                onRefresh={() => rulingPlanetsQuery.refetch()}
                                                calculatedAt={rulingPlanetsQuery.data?.calculatedAt}
                                            />
                                        </div>
                                    )}

                                    {/* Horary */}
                                    {activeTab === 'horary' && (
                                        <div className="max-w-2xl mx-auto">
                                            <HoraryPanel
                                                onSubmit={(horaryNumber, question) => {
                                                    horaryMutation.mutate({ clientId, horaryNumber, question });
                                                }}
                                                result={horaryMutation.data?.data}
                                                isLoading={horaryMutation.isPending}
                                                error={horaryMutation.error?.message}
                                            />
                                        </div>
                                    )}

                                    {/* Cuspal Interlinks */}
                                    {activeTab === 'interlinks' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Cuspal Interlinks</h3>
                                            </div>
                                            <div className="w-full p-6">
                                                {interlinksQuery.isLoading ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : (
                                                    interlinksQuery.data?.data ? (
                                                        <KpFocusedCuspView promises={interlinksData} cusps={cuspData} />
                                                    ) : (
                                                        <p className="text-muted text-center py-8">No interlinks data available</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Advanced SSL */}
                                    {activeTab === 'advanced-ssl' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Advanced Sub-Sub Lord View</h3>
                                            </div>
                                            <div className="w-full p-6">
                                                {advancedSslQuery.isLoading ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : (
                                                    advancedSslQuery.data?.data ? (
                                                        <KpAdvancedSslView promises={sslData} cusps={cuspData} />
                                                    ) : (
                                                        <p className="text-muted text-center py-8">No Advanced SSL data available</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Nakshatra Nadi */}
                                    {activeTab === 'nakshatra-nadi' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Nakshatra Nadi Coordinates</h3>
                                            </div>
                                            <div className="w-full p-6">
                                                {nakshatraNadiQuery.isLoading ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : (
                                                    nakshatraNadiQuery.data?.data && nadiData ? (
                                                        <KpNakshatraNadiFocusedView data={{ nadiData }} />
                                                    ) : (
                                                        <p className="text-muted text-center py-8">No Nakshatra Nadi data available</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Pars Fortuna */}
                                    {activeTab === 'fortuna' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Pars Fortuna</h3>
                                            </div>
                                            <div className="w-full p-6">
                                                {fortunaQuery.isLoading ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : (
                                                    fortunaQuery.data?.data && fortunaData ? (
                                                        <KpFortunaView data={{ fortunaData }} />
                                                    ) : (
                                                        <p className="text-muted text-center py-8">No Fortuna data available</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ashtakavarga */}
                                    {activeTab === 'ashtakavarga' && (
                                        <div className="border border-antique rounded-lg overflow-hidden shadow-sm flex flex-col bg-surface-warm">
                                            <div className="bg-border-warm px-3 py-1.5 border-b border-antique">
                                                <h3 className={cn(TYPOGRAPHY.value, "text-lg text-primary leading-tight tracking-wide")}>Ashtakavarga Matrix</h3>
                                            </div>
                                            <div className="w-full p-6">
                                                {ashtakavargaQuery.isLoading ? (
                                                    <div className="flex items-center justify-center py-12">
                                                        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
                                                    </div>
                                                ) : (
                                                    ashtakavargaQuery.data?.data || ashtakavargaQuery.data ? (
                                                        <ShodashaVargaTable data={ashtakavargaQuery.data?.data || ashtakavargaQuery.data} />
                                                    ) : (
                                                        <p className="text-muted text-center py-8">No Ashtakavarga data available</p>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Debug Box */}
                                <div className="mt-8 pt-8 border-t border-antique/20">
                                    <details className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-white/5">
                                        <summary className="p-4 text-white font-mono text-xs cursor-pointer hover:bg-slate-800 transition-colors flex items-center justify-between">
                                            <span className="flex items-center gap-2">
                                                <Star className="w-3 h-3 text-gold-primary" />
                                                🛠️ KP Storage & Debug Inspector
                                            </span>
                                            <span className="text-[10px] opacity-50 uppercase tracking-widest">Click to Expand</span>
                                        </summary>
                                        <div className="p-6 bg-slate-950 space-y-6">
                                            {/* Storage Status Grid */}
                                            <div>
                                                <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Database Storage Status</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                    {[
                                                        { id: 'D1_kp', label: 'Natal Chart (KP)' },
                                                        { id: 'kp_planets_cusps_kp', label: 'Planets & Cusps' },
                                                        { id: 'kp_significations_kp', label: 'Significations' },
                                                        { id: 'kp_house_significations_kp', label: 'House Table' },
                                                        { id: 'kp_planet_significators_kp', label: 'Planet Matrix' },
                                                        { id: 'kp_bhava_details_kp', label: 'Bhava Details' },
                                                        { id: 'kp_interlinks_kp', label: 'Interlinks' },
                                                        { id: 'kp_interlinks_advanced_kp', label: 'Advanced SSL' },
                                                        { id: 'kp_interlinks_sl_kp', label: 'Interlinks (SL)' },
                                                        { id: 'kp_nakshatra_nadi_kp', label: 'Nakshatra Nadi' },
                                                        { id: 'kp_fortuna_kp', label: 'Pars Fortuna' },
                                                        { id: 'kp_ruling_planets_kp', label: 'Ruling Planets' },
                                                        { id: 'dasha_chara_kp', label: 'Chara Dasha' },
                                                        { id: 'shodasha_varga_signs_kp', label: 'Shodasha Varga' },
                                                    ].map((item) => {
                                                        const isSaved = !!processedCharts[item.id];
                                                        return (
                                                            <div key={item.id} className={cn(
                                                                "p-2 rounded border text-[10px] font-mono flex items-center justify-between gap-2",
                                                                isSaved
                                                                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                                                    : "bg-rose-500/10 border-rose-500/30 text-rose-400 opacity-60"
                                                            )}>
                                                                <span className="truncate">{item.label}</span>
                                                                <span className="flex-shrink-0">{isSaved ? '✅ SAVED' : '❌ MISS'}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Raw API Response Viewers */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Active Tab Query State</h4>
                                                    <div className="bg-black/40 rounded p-3 h-[200px] overflow-auto border border-white/5 scrollbar-thin">
                                                        <pre className="text-green-500 text-[10px] leading-relaxed">
                                                            {activeTab === 'interlinks' && JSON.stringify(interlinksQuery.data, null, 2)}
                                                            {activeTab === 'advanced-ssl' && JSON.stringify(advancedSslQuery.data, null, 2)}
                                                            {activeTab === 'nakshatra-nadi' && JSON.stringify(nakshatraNadiQuery.data, null, 2)}
                                                            {activeTab === 'fortuna' && JSON.stringify(fortunaQuery.data, null, 2)}
                                                            {activeTab === 'planets-cusps' && JSON.stringify(planetsCuspsQuery.data, null, 2)}
                                                            {activeTab === 'planetary-significators' && JSON.stringify(planetSignificatorsQuery.data, null, 2)}
                                                            {activeTab === 'significations' && JSON.stringify(houseSignificationsQuery.data, null, 2)}
                                                            {activeTab === 'bhava-details' && JSON.stringify(bhavaDetailsQuery.data, null, 2)}
                                                            {activeTab === 'ruling-planets' && JSON.stringify(rulingPlanetsQuery.data, null, 2)}
                                                            {activeTab === 'ashtakavarga' && JSON.stringify(ashtakavargaQuery.data, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] uppercase tracking-[0.2em] text-gold-primary mb-3 font-bold">Full Payload Inspector</h4>
                                                    <div className="bg-black/40 rounded p-3 h-[200px] overflow-auto border border-white/5 scrollbar-thin">
                                                        <pre className="text-blue-400 text-[10px] leading-relaxed">
                                                            {JSON.stringify({
                                                                processedKeys: Object.keys(processedCharts).filter(k => k.toLowerCase().includes('kp') || k.startsWith('D1')),
                                                                ayanamsa,
                                                                clientId,
                                                                tab: activeTab
                                                            }, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </details>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
