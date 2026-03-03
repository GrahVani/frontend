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

const planetMap: Record<string, string> = {
    'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
    'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa', 'Rahu': 'Ra', 'Ketu': 'Ke',
    'Uranus': 'Ur', 'Neptune': 'Ne', 'Pluto': 'Pl', 'Mandi': 'Man', 'Gulika': 'Gk'
};

/**
 * Standardizes chart data parsing for all chart types (D1, D9, etc.)`
 * Extracts Planets and Ascendant Sign ID.
 */
export function parseChartData(chartData: Record<string, unknown> | object): ProcessedChartData {
    if (!chartData) return { planets: [], ascendant: 1 };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Polymorphic Astro Engine API: duck-typing across many response shapes
    const data = chartData as any;

    // 1. Identify where the planet list is
    let positions = data.transit_positions ||
        data.planetary_positions ||
        data.planets ||
        data.data?.transit_positions ||
        data.data?.planetary_positions ||
        data.data?.planets ||
        (data['Sun'] || data['Moon'] ? data : null);

    // Deep fallback: Duck-typing for direct map without known keys
    if (!positions) {
        // Search first level values for something that looks like a planet map
        const potentialKey = Object.keys(data).find(key => {
            const val = data[key] as any;
            // Check if value is object and has planet-like properties (Sun/Moon are universal)
            return val && typeof val === 'object' && !Array.isArray(val) && (
                (val.Sun && val.Moon) ||
                (val['Sun'] && val['Moon']) ||
                (val[0]?.name === 'Sun')
            );
        });

        if (potentialKey) {
            positions = data[potentialKey];
        } else {
            // Check standard planet names in keys
            const isPlanetMap = Object.keys(data).some(k =>
                ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(k)
            );
            if (isPlanetMap) {
                positions = data;
            }
        }
    }

    let planets: Planet[] = [];

    if (positions) {
        // Handle both Array and Object formats
        const entries: [string, Record<string, unknown>][] = Array.isArray(positions)
            ? positions.map((p: Record<string, unknown>) => [String(p.name || p.planet_name || "??"), p])
            : Object.entries(positions);

        planets = entries.map(([key, value]) => {
            // Skip non-planet keys if mixed object (e.g. "ayanamsa" or "meta" keys)
            if (!value || typeof value !== 'object') return null;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic planet record from polymorphic API
            const v = value as any;

            // Extract planet name
            const rawName = v?.name || v?.planet_name || v?.planet || v?.label || v?.id || key || "??";

            // Normalize for lookup (Capitalize first letter, rest lowercase)
            const rawNameStr = String(rawName);
            const lookupKey = rawNameStr.charAt(0).toUpperCase() + rawNameStr.slice(1).toLowerCase();
            const name = planetMap[lookupKey] || (rawNameStr.length > 3 ? rawNameStr.substring(0, 2) : rawNameStr);

            const sign = String(v?.sign || v?.sign_name || "");
            const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
            const rawDegree = v?.degrees || v?.longitude || v?.degree;
            // Parse house if available
            const house = v?.house ? parseInt(String(v.house)) : undefined;

            // Rahu and Ketu are always retrograde - don't show marker (Vedic convention)
            const isRahuKetu = name === 'Ra' || name === 'Ke';
            const hasRetrograde = v?.retrograde === 'R' || v?.retrograde === true || v?.is_retro === true;

            return {
                name,
                signId: signNameToId[normalizedSign] || 1,
                degree: formatPlanetDegree(rawDegree as number | string | null | undefined),
                isRetro: isRahuKetu ? false : hasRetrograde,
                house,
                nakshatra: v?.nakshatra || v?.nakshatra_name,
                pada: v?.pada || v?.nakshatra_pada
            };
        }).filter(Boolean) as Planet[];
    }

    // Process Ascendant
    let ascendant = 1; // Default Aries
    const asc = data.ascendant || data.data?.natal_ascendant || data.data?.ascendant;

    if (asc) {
        const sign = asc.sign || asc.sign_name || "Aries";
        const normalizedSign = sign.charAt(0).toUpperCase() + sign.slice(1).toLowerCase();
        ascendant = signNameToId[normalizedSign] || 1;

        // Add Ascendant to planets list so it renders as a point "As"
        const rawDegree = asc.degrees || asc.longitude || asc.degree;
        planets.push({
            name: 'As',
            signId: ascendant,
            degree: formatPlanetDegree(rawDegree),
            isRetro: false,
            house: 1
        });
    }

    return { planets, ascendant };
}
