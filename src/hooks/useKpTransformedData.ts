/**
 * useKpTransformedData
 * Extracts all KP data transformation logic from the KP dashboard page.
 * Transforms raw API responses (planets-cusps, significations, interlinks, etc.)
 * into component-ready shapes used by the tab content components.
 */
import React from 'react';
import { parseChartData, signNameToId } from '@/lib/chart-helpers';
import type { Planet } from '@/components/astrology/NorthIndianChart';
import type { KpHouseSignification, KpBhavaRaw } from '@/types/kp.types';

// ─── Types ───────────────────────────────────────────────────────────

/** Planet type used for visual chart rendering (re-exported from NorthIndianChart) */
export type KpVisualPlanet = Planet;

export interface KpD1Data {
    planets: Planet[];
    ascendant: number;
}

export interface KpCuspItem {
    cusp: number;
    sign: string;
    signId: number;
    degree: number;
    degreeFormatted: string;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
}

export interface KpPlanetItem {
    name: string;
    fullName: string;
    sign: string;
    signId: number;
    degree: number;
    degreeFormatted?: string;
    house: number;
    nakshatra: string;
    nakshatraLord: string;
    subLord: string;
    isRetrograde: boolean;
}

export interface KpSignificationItem {
    planet: string;
    houses: number[];
    levelA: number[];
    levelB: number[];
    levelC: number[];
    levelD: number[];
    strong: boolean;
}

export interface KpInterlinkItem {
    houseNumber: number;
    topic: string;
    chain: {
        signLord: { planet: string; isRetro: boolean };
        starLord: { planet: string; isRetro: boolean };
        subLord: { planet: string; isRetro: boolean };
        subSubLord: { planet: string; isRetro: boolean };
    };
    positiveHouses: number[];
    negativeHouses: number[];
    strength: string;
    verdict: string;
}

export interface KpNadiData {
    planets: {
        name: string;
        isRetro: boolean;
        longitude: string;
        sign: string;
        nakshatraLord: string;
        nakshatraName: string;
        subLord: string;
    }[];
    cusps: {
        label: string;
        longitude: string;
        sign: string;
        nakshatraLord: string;
        nakshatraName: string;
        subLord: string;
    }[];
}

export interface KpFortunaData {
    calculation: {
        component: string;
        dms: string;
        longitude: number;
        sign: string;
        house: number;
    }[];
    fortunaHouse: {
        sign: string;
        houseNumber: number;
        cuspLongitude: string;
    };
}

export interface KpSummaryPlanet {
    name: string;
    sign: string;
    isRetrograde: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────

/** Parse "268 5' 50\"" DMS string to decimal degrees */
function parseDms(dms: string): number {
    if (!dms) return 0;
    const match = dms.match(/(\d+)[°\s]+(\d+)['\s]+(\d+)/);
    if (match) {
        return parseFloat(match[1]) + parseFloat(match[2]) / 60 + parseFloat(match[3]) / 3600;
    }
    return parseFloat(dms) || 0;
}

// ─── Query Result Types (loose — the hook accepts raw query results) ──

interface QueryResult<T = unknown> {
    data?: T;
    isLoading?: boolean;
}

interface KpTransformedDataInput {
    processedCharts: Record<string, { chartData?: Record<string, unknown> } | undefined>;
    planetsCuspsQuery: QueryResult<{ data?: Record<string, unknown>; calculatedAt?: string }>;
    houseSignificationsQuery: QueryResult<{ data?: Record<string, unknown> }>;
    planetSignificatorsQuery: QueryResult<{ data?: Record<string, unknown> }>;
    bhavaDetailsQuery: QueryResult<{ data?: Record<string, unknown> }>;
    rulingPlanetsQuery: QueryResult<{ data?: Record<string, unknown> }>;
    interlinksQuery: QueryResult<{ data?: Record<string, unknown> }>;
    advancedSslQuery: QueryResult<{ data?: Record<string, unknown> }>;
    nakshatraNadiQuery: QueryResult<{ data?: Record<string, unknown> }>;
    fortunaQuery: QueryResult<{ data?: Record<string, unknown> }>;
}

// ─── Main Hook ───────────────────────────────────────────────────────

export function useKpTransformedData(input: KpTransformedDataInput) {
    const {
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
    } = input;

    // ── D1 Visual Chart Data ─────────────────────────────────────────
    const d1Data: KpD1Data = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic API response
        const apiData = planetsCuspsQuery.data?.data as any;
        if (apiData) {
            const { ascendant, planets } = apiData;
            let ascSignId = 1;

            if (ascendant) {
                const signName = ascendant.sign;
                const normalized = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
                ascSignId = signNameToId[normalized] || 1;
            }

            const visualPlanets: KpVisualPlanet[] = [];
            if (planets && !Array.isArray(planets)) {
                Object.entries(planets).forEach(([name, p]: [string, any]) => {
                    const normalizedSign = p.sign.charAt(0).toUpperCase() + p.sign.slice(1).toLowerCase();
                    visualPlanets.push({
                        name: name.substring(0, 2),
                        signId: signNameToId[normalizedSign] || 1,
                        degree: p.longitude?.split('°')[0] + '°' || "0°",
                        isRetro: p.is_retro || false,
                        house: p.house,
                        // @ts-ignore - extending Planet interface for KP display
                        starLord: p.star_lord || p.nakshatra_lord || '',
                        // @ts-ignore
                        subLord: p.sub_lord || '',
                    });
                });
            }

            visualPlanets.push({
                name: 'As',
                signId: ascSignId,
                degree: ascendant?.longitude?.split('°')[0] + '°' || "0°",
                isRetro: false,
                house: 1,
                // @ts-ignore
                starLord: ascendant?.star_lord || ascendant?.nakshatra_lord || '',
                // @ts-ignore
                subLord: ascendant?.sub_lord || '',
            });

            return { planets: visualPlanets, ascendant: ascSignId };
        }

        // Fallback to processedCharts - check kp_planets_cusps_kp first for KP data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const kpCuspsRaw = (processedCharts['kp_planets_cusps_kp']?.chartData as any)?.data || processedCharts['kp_planets_cusps_kp']?.chartData;
        if (kpCuspsRaw?.planets) {
            const { ascendant, planets } = kpCuspsRaw;
            let ascSignId = 1;

            if (ascendant) {
                const signName = ascendant.sign;
                const normalized = signName.charAt(0).toUpperCase() + signName.slice(1).toLowerCase();
                ascSignId = signNameToId[normalized] || 1;
            }

            const visualPlanets: KpVisualPlanet[] = [];
            if (planets && !Array.isArray(planets)) {
                Object.entries(planets).forEach(([name, p]: [string, any]) => {
                    const normalizedSign = p.sign.charAt(0).toUpperCase() + p.sign.slice(1).toLowerCase();
                    visualPlanets.push({
                        name: name.substring(0, 2),
                        signId: signNameToId[normalizedSign] || 1,
                        degree: p.longitude?.split('°')[0] + '°' || "0°",
                        isRetro: p.is_retro || false,
                        house: p.house,
                        // @ts-ignore
                        starLord: p.star_lord || p.nakshatra_lord || '',
                        // @ts-ignore
                        subLord: p.sub_lord || '',
                    });
                });
            }

            visualPlanets.push({
                name: 'As',
                signId: ascSignId,
                degree: ascendant?.longitude?.split('°')[0] + '°' || "0°",
                isRetro: false,
                house: 1,
                // @ts-ignore
                starLord: ascendant?.star_lord || ascendant?.nakshatra_lord || '',
                // @ts-ignore
                subLord: ascendant?.sub_lord || '',
            });

            return { planets: visualPlanets, ascendant: ascSignId };
        }

        // Final fallback to D1_kp
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

    // ── Cusp Data ────────────────────────────────────────────────────
    const cuspData: KpCuspItem[] = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawCusps = (planetsCuspsQuery.data?.data as any)?.house_cusps;
        if (rawCusps) {
            return Object.entries(rawCusps).map(([key, c]: [string, any]) => ({
                cusp: parseInt(key),
                sign: c.sign,
                signId: signNameToId[c.sign] || 1,
                degree: parseDms(c.longitude),
                degreeFormatted: c.longitude,
                nakshatra: c.nakshatra,
                nakshatraLord: c.star_lord,
                subLord: c.sub_lord,
            })).sort((a, b) => a.cusp - b.cusp);
        }

        // Fallback to D1_kp houses
        const d1Kp = processedCharts['D1_kp'];
        if (d1Kp?.chartData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (d1Kp.chartData as any).data || d1Kp.chartData;
            const houses = data.houses || data.observations || [];
            if (Array.isArray(houses) && houses.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return houses.map((h: any) => ({
                    cusp: h.house || h.house_number,
                    sign: h.sign || h.sign_name,
                    signId: h.sign_id || 1,
                    degree: h.degree || h.longitude,
                    degreeFormatted: h.degreeFormatted,
                    nakshatra: h.nakshatra || '-',
                    nakshatraLord: h.nakshatra_lord || '-',
                    subLord: h.sub_lord || '-',
                }));
            }
        }
        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // ── Planetary Data ───────────────────────────────────────────────
    const planetaryData: KpPlanetItem[] = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawResponse = (planetsCuspsQuery.data?.data as any) || (processedCharts['kp_planets_cusps_kp']?.chartData as any)?.data || processedCharts['kp_planets_cusps_kp']?.chartData;
        const rawPlanets = rawResponse?.planets || rawResponse?.planetary_positions;

        if (rawPlanets && !Array.isArray(rawPlanets)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return Object.entries(rawPlanets).map(([name, val]: [string, any]) => ({
                name,
                fullName: name,
                sign: String(val.sign || '-'),
                signId: signNameToId[val.sign as string] || 1,
                degree: parseDms(String(val.longitude || val.degreeFormatted || val.degree || '')),
                degreeFormatted: String(val.longitude || val.degreeFormatted || val.degree || ''),
                house: Number(val.house || val.bhava || 1),
                nakshatra: String(val.nakshatra || '-'),
                nakshatraLord: String(val.star_lord || val.nakshatra_lord || val.nakshatraLord || '-'),
                subLord: String(val.sub_lord || val.subLord || '-'),
                isRetrograde: !!(val.is_retro || val.is_retrograde || val.isRetrograde),
            }));
        }

        if (Array.isArray(rawPlanets)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return rawPlanets.map((p: any) => ({
                name: String(p.name || p.planet || ''),
                fullName: String(p.full_name || p.name || p.planet || ''),
                sign: String(p.sign || '-'),
                signId: p.sign_id || p.signId || signNameToId[p.sign] || 1,
                degree: typeof p.degree === 'number' ? p.degree : parseFloat(p.degree) || 0,
                degreeFormatted: String(p.degreeFormatted || p.longitude || p.degree || `${(p.degree || 0).toFixed(2)}°`),
                house: Number(p.house || p.bhava || 1),
                nakshatra: String(p.nakshatra || '-'),
                nakshatraLord: String(p.star_lord || p.nakshatra_lord || p.nakshatraLord || '-'),
                subLord: String(p.sub_lord || p.subLord || '-'),
                isRetrograde: !!(p.isRetrograde || p.is_retro || p.is_retrograde),
            }));
        }

        return [];
    }, [planetsCuspsQuery.data, processedCharts]);

    // ── House Significators ──────────────────────────────────────────
    const houseSignificators: KpHouseSignification[] = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawResponse = (planetsCuspsQuery.data?.data as any) || (houseSignificationsQuery.data?.data as any) || (processedCharts['kp_house_significations_kp']?.chartData as any)?.data || processedCharts['kp_house_significations_kp']?.chartData;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const planetsResponse = (planetsCuspsQuery.data?.data as any) || (processedCharts['kp_planets_cusps_kp']?.chartData as any)?.data || processedCharts['kp_planets_cusps_kp']?.chartData;

        const newSignifications = rawResponse?.house_significations || rawResponse?.significators;

        if (newSignifications && planetsResponse?.planets) {
            const normalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : '';

            const planetStarLords: Record<string, string> = {};
            const rawPlanets = planetsResponse.planets;
            if (Array.isArray(rawPlanets)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rawPlanets.forEach((p: any) => {
                    planetStarLords[normalize(p.name || p.planet)] = normalize(p.star_lord || p.nakshatra_lord || '');
                });
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Object.entries(rawPlanets).forEach(([k, v]: [string, any]) => {
                    planetStarLords[normalize(k)] = normalize(v.star_lord || v.nakshatra_lord || '');
                });
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // ── Signification Data (Planet View) ─────────────────────────────
    const significationData: KpSignificationItem[] = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawResponse = (planetSignificatorsQuery.data?.data as any) || (processedCharts['kp_planet_significators_kp']?.chartData as any)?.data || processedCharts['kp_planet_significators_kp']?.chartData;
        const apiData = rawResponse?.planet_significators || rawResponse;

        const KNOWN_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'];

        if (apiData && typeof apiData === 'object' && !Array.isArray(apiData) && Object.keys(apiData).length > 0) {
            const targetData = apiData.planet_significators || apiData.significators || apiData;
            const hasPlanetKeys = Object.keys(targetData).some((key: string) =>
                KNOWN_PLANETS.includes(key) || KNOWN_PLANETS.includes(key.charAt(0).toUpperCase() + key.slice(1).toLowerCase())
            );

            if (hasPlanetKeys) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return Object.entries(targetData)
                    .filter(([key]) => KNOWN_PLANETS.includes(key) || KNOWN_PLANETS.includes(key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()))
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                                ...(details.levelD || details["Weak"] || details.weak || []),
                            ].map(Number))).sort((a: number, b: number) => a - b),
                            strong: (details.levelA || details["Very Strong"] || details.very_strong || []).length > 0,
                        };
                    });
            }
        }

        // Fallback: Pivot houseSignificators to Planet View
        const planetMap: Record<string, { A: number[]; B: number[]; C: number[]; D: number[] }> = {};
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
            strong: levels.A.length > 0 || levels.B.length > 0,
        }));
    }, [houseSignificators, planetSignificatorsQuery.data, processedCharts]);

    // ── Interlinks ───────────────────────────────────────────────────
    const interlinksData: KpInterlinkItem[] = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (interlinksQuery.data?.data as any) || (processedCharts['kp_interlinks_kp']?.chartData as any)?.data || processedCharts['kp_interlinks_kp']?.chartData;
        if (!raw) return [];

        const houseLords = raw.houses?.houses || {};

        if (raw.cuspal_interlinks?.house_relationships) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return Object.entries(raw.cuspal_interlinks.house_relationships).map(([house, data]: [string, any]) => {
                const hLords = houseLords[house] || {};
                return {
                    houseNumber: parseInt(house),
                    topic: `House ${house}`,
                    chain: {
                        signLord: { planet: hLords.sign_lord || '-', isRetro: false },
                        starLord: { planet: hLords.star_lord || '-', isRetro: false },
                        subLord: { planet: hLords.sub_lord || '-', isRetro: false },
                        subSubLord: { planet: hLords.sub_sub_lord || '-', isRetro: false },
                    },
                    positiveHouses: (data.favorable || []).map(Number),
                    negativeHouses: (data.adverse || []).map(Number),
                    strength: 'Neutral',
                    verdict: 'Neutral',
                };
            });
        }

        const analysis = raw.cuspal_interlinks_analysis || raw.cuspal_interlinks?.cuspal_interlinks_analysis;
        if (!analysis) return [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.entries(analysis).map(([house, item]: [string, any]) => ({
            houseNumber: parseInt(house),
            topic: ((item.interpretation as string)?.split('-')[0]?.trim()) || `House ${house}`,
            chain: {
                signLord: { planet: item.cusp_lords?.sign_lord || '-', isRetro: false },
                starLord: { planet: item.cusp_lords?.star_lord || '-', isRetro: false },
                subLord: { planet: item.cusp_lords?.sub_lord || '-', isRetro: false },
                subSubLord: { planet: item.cusp_lords?.sub_sub_lord || '-', isRetro: false },
            },
            positiveHouses: (item.combined_positive_links || []).map(Number),
            negativeHouses: (item.combined_negative_links || []).map(Number),
            strength: item.promise_strength || 'Neutral',
            verdict: item.promise_strength || 'Neutral',
        }));
    }, [interlinksQuery.data, processedCharts]);

    // ── SSL Data ─────────────────────────────────────────────────────
    const sslData: KpInterlinkItem[] = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (advancedSslQuery.data?.data as any) || (processedCharts['kp_interlinks_advanced_kp']?.chartData as any)?.data || processedCharts['kp_interlinks_advanced_kp']?.chartData;
        if (!raw) return [];

        const analysis = raw.cuspal_interlinks_analysis || raw.cuspal_interlinks?.cuspal_interlinks_analysis;
        if (!analysis) return [];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return Object.entries(analysis).map(([house, item]: [string, any]) => ({
            houseNumber: parseInt(house),
            topic: `House ${house}`,
            chain: {
                signLord: { planet: item.cusp_lords?.sign_lord || '-', isRetro: false },
                starLord: { planet: item.cusp_lords?.star_lord || '-', isRetro: false },
                subLord: { planet: item.cusp_lords?.sub_lord || '-', isRetro: false },
                subSubLord: { planet: item.cusp_lords?.sub_sub_lord || '-', isRetro: false },
            },
            positiveHouses: (item.combined_positive_links || []).map(Number),
            negativeHouses: (item.combined_negative_links || []).map(Number),
            strength: item.promise_strength || 'Neutral',
            verdict: item.promise_strength || 'Neutral',
        }));
    }, [advancedSslQuery.data, processedCharts]);

    // ── Nakshatra Nadi ───────────────────────────────────────────────
    const nadiData: KpNadiData | null = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (nakshatraNadiQuery.data?.data as any) || (processedCharts['kp_nakshatra_nadi_kp']?.chartData as any)?.data || processedCharts['kp_nakshatra_nadi_kp']?.chartData;
        if (!raw || !raw.planets || !raw.houses) return null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const planets = Object.entries(raw.planets || {}).map(([name, p]: [string, any]) => ({
            name,
            isRetro: p?.is_retrograde || p?.is_retro || false,
            longitude: p?.position_dms || p?.longitude || '0°0\'0"',
            sign: p?.sign_name || p?.sign || 'Unknown',
            nakshatraLord: p?.nakshatra_lord || p?.star_lord || '-',
            nakshatraName: p?.nakshatra_name || p?.nakshatra || '-',
            subLord: p?.sub_lord || '-',
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cusps = Object.entries(raw.houses || {}).map(([key, h]: [string, any]) => {
            let label = key.replace('House_', '').replace('H', '');
            if (key === 'MC') label = '10';
            if (key === 'Ascendant' || key === 'Lagna') label = '1';
            return {
                label,
                longitude: h?.position_dms || h?.longitude || '0°0\'0"',
                sign: h?.sign_name || h?.sign || 'Unknown',
                nakshatraLord: h?.nakshatra_lord || h?.star_lord || '-',
                nakshatraName: h?.nakshatra_name || h?.nakshatra || '-',
                subLord: h?.sub_lord || '-',
            };
        }).sort((a, b) => {
            const numA = parseInt(a.label) || (a.label === '1' ? 1 : a.label === 'Ascendant' ? 1 : 99);
            const numB = parseInt(b.label) || (b.label === '1' ? 1 : b.label === 'Ascendant' ? 1 : 99);
            return numA - numB;
        });

        return { planets, cusps };
    }, [nakshatraNadiQuery.data, processedCharts]);

    // ── Fortuna ──────────────────────────────────────────────────────
    const fortunaData: KpFortunaData | null = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (fortunaQuery.data?.data as any) || (processedCharts['kp_fortuna_kp']?.chartData as any)?.data || processedCharts['kp_fortuna_kp']?.chartData;
        if (!raw || !raw.details) return null;

        const calculation = [
            { component: 'Ascendant', dms: '-', longitude: raw.details.ascendant.longitude, sign: raw.details.ascendant.sign, house: raw.details.ascendant.house },
            { component: 'Moon', dms: '-', longitude: raw.details.moon.longitude, sign: raw.details.moon.sign, house: raw.details.moon.house },
            { component: 'Sun', dms: '-', longitude: raw.details.sun.longitude, sign: raw.details.sun.sign, house: raw.details.sun.house },
        ];

        return {
            calculation,
            fortunaHouse: {
                sign: raw.fortuna_sign,
                houseNumber: raw.fortuna_house,
                cuspLongitude: `${raw.fortuna_longitude?.toFixed(2)}`,
            },
        };
    }, [fortunaQuery.data, processedCharts]);

    // ── Bhava Details ────────────────────────────────────────────────
    const bhavaDetails: Record<string, KpBhavaRaw> = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (bhavaDetailsQuery.data?.data as any) || (processedCharts['kp_bhava_details_kp']?.chartData as any)?.data || processedCharts['kp_bhava_details_kp']?.chartData;
        if (raw?.bhava_details) return raw.bhava_details as Record<string, KpBhavaRaw>;
        return {} as Record<string, KpBhavaRaw>;
    }, [bhavaDetailsQuery.data, processedCharts]);

    // ── Summary Helpers ──────────────────────────────────────────────
    const summaryPlanets: KpSummaryPlanet[] = React.useMemo(() => {
        return planetaryData.map(p => ({
            name: p.fullName || p.name,
            sign: p.sign,
            isRetrograde: !!p.isRetrograde,
        }));
    }, [planetaryData]);

    const lagnaInfo = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const asc = (planetsCuspsQuery.data?.data as any)?.ascendant;
        return { sign: asc?.sign || '\u2014', lord: '\u2014' };
    }, [planetsCuspsQuery.data]);

    const moonInfo = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const moon = (planetsCuspsQuery.data?.data as any)?.planets?.Moon;
        return {
            sign: moon?.sign || '\u2014',
            nakshatra: moon?.nakshatra || '\u2014',
            starLord: moon?.star_lord || '\u2014',
        };
    }, [planetsCuspsQuery.data]);

    const ayanamsaInfo = React.useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ay = (rulingPlanetsQuery.data?.data as any)?.ayanamsa;
        if (ay?.value) {
            const deg = Math.floor(ay.value);
            const min = Math.floor((ay.value % 1) * 60);
            const sec = Math.round(((ay.value % 1) * 60 % 1) * 60);
            return `${deg}°${min}'${sec}"`;
        }
        return '\u2014';
    }, [rulingPlanetsQuery.data]);

    const cuspalTableData = React.useMemo(() => {
        return cuspData.map(c => ({
            house: c.cusp,
            sign: c.sign,
            degree: c.degreeFormatted || `${c.degree?.toFixed(2)}°`,
            starLord: c.nakshatraLord || '\u2014',
            subLord: c.subLord || '\u2014',
        }));
    }, [cuspData]);

    return {
        d1Data,
        cuspData,
        planetaryData,
        houseSignificators,
        significationData,
        interlinksData,
        sslData,
        nadiData,
        fortunaData,
        bhavaDetails,
        summaryPlanets,
        lagnaInfo,
        moonInfo,
        ayanamsaInfo,
        cuspalTableData,
    };
}
