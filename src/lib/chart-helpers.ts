import { Planet } from "@/components/astrology/NorthIndianChart";
import { formatPlanetDegree } from "@/lib/utils";

export const signNameToId: Record<string, number> = {
    'Aries': 1, 'Taurus': 2, 'Gemini': 3, 'Cancer': 4, 'Leo': 5, 'Virgo': 6,
    'Libra': 7, 'Scorpio': 8, 'Sagittarius': 9, 'Capricorn': 10, 'Aquarius': 11, 'Pisces': 12
};

export const signIdToName: Record<number, string> = Object.fromEntries(
    Object.entries(signNameToId).map(([k, v]) => [v, k])
);

export interface ProcessedChartData {
    planets: Planet[];
    ascendant: number;
}

export const planetMap: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
    'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl', 'Mandi': 'Man', 'Gulika': 'Gk'
};

export const fullPlanetNames: Record<string, string> = Object.fromEntries(
    Object.entries(planetMap).map(([full, short]) => [short, full])
);

// Add special points
fullPlanetNames['As'] = 'Ascendant';

/**
 * Standardizes chart data parsing for all chart types (D1, D9, etc.)`
 * Extracts Planets and Ascendant Sign ID.
 */
export function parseChartData(chartData: unknown): ProcessedChartData {
    if (!chartData) return { planets: [], ascendant: 1 };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Polymorphic Astro Engine API: duck-typing across many response shapes
    const data = chartData as any;

    // List of potential keys for planetary positions
    let positions = data.transit_positions ||
        data.planetary_positions ||
        data.planets ||
        data.pada_chart ||
        data.data?.transit_positions ||
        data.data?.planetary_positions ||
        data.data?.planets ||
        data.data?.pada_chart ||
        (data['Sun'] || data['Moon'] ? data : null);

    // Deep fallback: Search for planet-like structures
    if (!positions) {
        const potentialKey = Object.keys(data).find(key => {
            const val = data[key] as any;
            return val && typeof val === 'object' && !Array.isArray(val) && (
                (val.Sun && val.Moon) || (val['Sun'] && val['Moon']) || (val[0]?.name === 'Sun')
            );
        });
        if (potentialKey) positions = data[potentialKey];
    }

    // Process Ascendant first so we can use it for house locations
    let ascendant = data.sidereal_lagna_sign || data.data?.sidereal_lagna_sign || 1;
    const asc = data.ascendant || data.data?.natal_ascendant || data.data?.ascendant;

    if (asc) {
        const sign = asc.sign || asc.sign_name || "Aries";
        const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
        ascendant = signNameToId[normalizedSign] || ascendant;
    }

    let planets: Planet[] = [];

    if (positions) {
        // Handle both Array and Object formats
        const entries: [string, Record<string, unknown>][] = Array.isArray(positions)
            ? positions.map((p: Record<string, unknown>) => [String(p.name || p.planet_name || p.label || "??"), p])
            : Object.entries(positions);

        planets = entries.map(([key, value]) => {
            if (!value || typeof value !== 'object') return null;
            const v = value as any;

            // Extract planet name
            const rawName = v?.label || v?.name || v?.planet_name || v?.planet || v?.id || key || "??";
            const rawNameStr = String(rawName);
            const lookupKey = rawNameStr.charAt(0).toUpperCase() + rawNameStr.slice(1).toLowerCase();
            const name = planetMap[lookupKey] || (rawNameStr.length >= 2 && rawNameStr.length <= 4 ? rawNameStr : (rawNameStr.length > 4 ? rawNameStr.substring(0, 3) : rawNameStr));

            const sign = String(v?.sign || v?.sign_name || "");
            const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            const signId = v?.sign_num || signNameToId[normalizedSign] || 1;
            const rawDegree = v?.degrees || v?.longitude || v?.degree || "";
            
            // House Position: use explicit house if available, or calculate relative to Lagna
            const house = (v?.house || v?.house_id) 
                ? parseInt(String(v?.house || v?.house_id)) 
                : (((signId - ascendant + 12) % 12) + 1);

            const isRahuKetu = name === 'Ra' || name === 'Ke';
            const hasRetrograde = v?.retrograde === 'R' || v?.retrograde === true || v?.is_retro === true;

            return {
                name,
                signId,
                degree: formatPlanetDegree(rawDegree as number | string | null | undefined),
                isRetro: isRahuKetu ? false : hasRetrograde,
                house,
                nakshatra: v?.nakshatra || v?.nakshatra_name || "-",
                pada: v?.pada || v?.nakshatra_pada
            };
        }).filter(Boolean) as Planet[];
    }

    // Add Ascendant to planets list
    if (asc) {
        const rawDegree = asc.degrees || asc.longitude || asc.degree;
        if (!planets.some(p => p.name === 'As' || p.name === 'Ascendant')) {
            planets.push({
                name: 'As',
                signId: ascendant,
                degree: formatPlanetDegree(rawDegree),
                isRetro: false,
                house: 1,
                nakshatra: asc.nakshatra || asc.nakshatra_name || "-",
                pada: asc.pada || asc.nakshatra_pada
            });
        }
    } else if (data.sidereal_lagna_sign || data.data?.sidereal_lagna_sign) {
        if (!planets.some(p => p.name === 'As' || p.name === 'Ascendant')) {
            planets.push({
                name: 'As',
                signId: ascendant,
                degree: "",
                isRetro: false,
                house: 1,
                nakshatra: "-"
            });
        }
    }

    return { planets, ascendant };
}
