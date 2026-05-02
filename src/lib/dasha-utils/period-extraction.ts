/**
 * Period extraction and sign-lord mapping for Dasha systems.
 * Handles the wild variety of API response shapes across 12+ dasha systems.
 */

import type { RawDashaPeriod } from './types';
import { isDateRangeCurrent } from './date-helpers';

/**
 * Get the lord of a zodiac sign (0-indexed or name).
 * Essential for systems like Chara where sub-nodes may only provide sign indices.
 */
export function getSignLord(sign: number | string): string {
    const mapping: Record<number, string> = {
        0: 'Mars', 1: 'Venus', 2: 'Mercury', 3: 'Moon', 4: 'Sun', 5: 'Mercury',
        6: 'Venus', 7: 'Mars', 8: 'Jupiter', 9: 'Saturn', 10: 'Saturn', 11: 'Jupiter'
    };
    const nameMapping: Record<string, string> = {
        'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury', 'Cancer': 'Moon',
        'Leo': 'Sun', 'Virgo': 'Mercury', 'Libra': 'Venus', 'Scorpio': 'Mars',
        'Sagittarius': 'Jupiter', 'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
    };

    if (typeof sign === 'number') return mapping[sign % 12] || 'Unknown';
    if (typeof sign === 'string') {
        const clean = sign.trim();
        if (nameMapping[clean]) return nameMapping[clean];
        const num = parseInt(clean);
        if (!isNaN(num)) return mapping[num % 12] || 'Unknown';
    }
    return 'Unknown';
}

/** Robustly find sublevels in a dasha node regardless of naming convention. */
export function getSublevels(node: RawDashaPeriod): RawDashaPeriod[] | null {
    if (!node) return null;
    const sublevels = node.sublevels ||
        node.antardashas ||
        node.pratyantardashas ||
        node.pratyantara_dashas ||
        node.sookshma_dashas ||
        node.sookshmadashas ||
        node.prandashas ||
        node.pran_dashas ||
        node.sub_periods ||
        node.sublevel ||
        node.timeline ||
        node.periods;
    return Array.isArray(sublevels) ? sublevels : null;
}

/** Resolve planet name from a raw period record — handles 20+ field name variations */
export function resolvePlanetName(p: RawDashaPeriod): string {
    return p.planet || p.lord || p.sign_lord || p.dasha_lord || p.mahadasha_lord ||
        p.antardasha_lord || p.antar_lord || p.ad_lord || p.sub_planet || p.subplanet ||
        p.name || p.planet_name || p.sign_name || p.mahadasha || p.antardasha || p.antar ||
        p.pratyantardasha || p.pratyantar || p.sookshmadasha || p.sookshma_dasha ||
        p.sookshma || p.prandasha || p.pran_dasha || p.prana ||
        (p.sign !== undefined ? getSignLord(p.sign) : (p.sign_name ? getSignLord(p.sign_name) : 'Unknown'));
}

/** Resolve start date from a raw period record */
export function resolveStartDate(p: RawDashaPeriod): string {
    return p.start_date || p.startDate || p.start || p.starting || p.starting_date ||
        p.beginning || p.beginning_date || p.mahadasha_beginning || p.mahadasha_starting_date ||
        p.from || p.from_date || p.start_date_utc;
}

/** Resolve end date from a raw period record */
export function resolveEndDate(p: RawDashaPeriod): string {
    return p.end_date || p.endDate || p.end || p.ending || p.ending_date ||
        p.mahadasha_ending || p.mahadasha_ending_date || p.to || p.to_date || p.end_date_utc;
}

/**
 * Recursively find the first available array in a nested object.
 * Essential for systems like Tribhagi where dasha periods are buried deep.
 */export function extractPeriodsArray(data: RawDashaPeriod | RawDashaPeriod[]): RawDashaPeriod[] {
    if (!data) return [];
    if (Array.isArray(data)) return data;

    if (typeof data === 'object') {
        // Dwadashottari wrapped structure
        if (data.detailed_mahadashas_with_antardashas && Array.isArray(data.detailed_mahadashas_with_antardashas)) {
            return data.detailed_mahadashas_with_antardashas.map((item: RawDashaPeriod) => ({
                ...(item.mahadasha || {}),
                antardashas: item.antardashas || []
            }));
        }

        // Panchottari
        const pData = data.panchottari_dasha || data.panchottari;
        if (pData) {
            if (pData.mahadashas) return pData.mahadashas;
            if (Array.isArray(pData)) return pData;
        }

        // Shodashottari
        const sData = data.shodashottari_dasha || data.shodashottari;
        if (sData) {
            if (sData.mahadashas) return sData.mahadashas;
            if (sData.timeline) return sData.timeline;
            if (Array.isArray(sData)) return sData;
        }

        // Dwadashottari
        const dData = data.dwadashottari_dasha || data.dwadashottari;
        if (dData) {
            if (dData.mahadashas) return dData.mahadashas;
            if (Array.isArray(dData)) return dData;
        }

        // Ashtottari
        const aData = data.ashtottari_dasha || data.ashtottari || data.ashtottari_antar;
        if (aData) {
            if (aData.mahadashas) return aData.mahadashas;
            if (Array.isArray(aData)) return aData;
        }

        // Chaturshitisama
        const cData = data.chaturshitisama_dasha || data.chaturshitisama || data.calculate_chaturshitisama_dasha;
        if (cData) {
            if (cData.mahadashas) return cData.mahadashas;
            if (Array.isArray(cData)) return cData;
        }

        // Satabdika
        const satData = data.satabdika_dasha || data.satabdika || data.shatabdika_dasha;
        if (satData) {
            if (satData.mahadashas) return satData.mahadashas;
            if (satData.periods) return satData.periods;
            if (Array.isArray(satData)) return satData;
        }

        // True Chitra specialized dashas
        if (data.dwisaptati_sama && Array.isArray(data.dwisaptati_sama)) return data.dwisaptati_sama;
        if (data.dwisaptati && Array.isArray(data.dwisaptati)) return data.dwisaptati;
        // Shasthihayani
        const shasthiData = data.shasthihayani_dasha || data.shastihayani_dasha || data.shastihayani || data.dasha_calculation;
        if (shasthiData) {
            if (shasthiData.lifespan_sequence) return shasthiData.lifespan_sequence;
            if (shasthiData.mahadashas) return shasthiData.mahadashas;
            if (Array.isArray(shasthiData)) return shasthiData;
        }

        // Shattrimshatsama
        const stData = data.shattrimshatsama_dasha || data.shattrimshatsama;
        if (stData) {
            if (stData.mahadashas) return stData.mahadashas;
            if (Array.isArray(stData)) return stData;
        }

        // Dwisaptati (144 yr) — MUST be before Chaturshitisama as both use dasha_table
        if (data.mahadashas && data.mahadashas.data && data.mahadashas.data.dasha_table && (data.mahadashas.data.meta?.system_years === 144 || data.mahadashas.meta?.system_years === 144)) {
            return data.mahadashas.data.dasha_table.map((m: RawDashaPeriod, idx: number) => ({
                planet: m.mahadasha,
                startDate: m.start,
                endDate: m.end,
                raw: { ...m, cycle: idx < 8 ? 1 : 2 },
                sublevels: (m.antardashas || []).map((a: RawDashaPeriod) => ({
                    planet: a.antar_lord, startDate: a.start, endDate: a.end, raw: a
                }))
            }));
        }

        // Chaturshitisama (84 yr)
        if (data.mahadashas && data.mahadashas.data && data.mahadashas.data.dasha_table && (data.mahadashas.data.meta?.system_years === 84 || data.mahadashas.data.meta?.system_years === 84)) {
            return data.mahadashas.data.dasha_table.map((m: RawDashaPeriod) => ({
                planet: m.mahadasha_lord, startDate: m.mahadasha_beginning, endDate: m.mahadasha_ending,
                duration: m.duration, raw: m,
                sublevels: (m.antardashas || []).map((a: RawDashaPeriod) => ({
                    planet: a.antardasha_lord, startDate: a.beginning, endDate: a.ending, raw: a
                }))
            }));
        }

        // Satabdika (100 yr)
        if (data.mahadashas && data.mahadashas.data && data.mahadashas.data.satabdika_dasha) {
            return data.mahadashas.data.satabdika_dasha.map((m: RawDashaPeriod) => ({
                planet: m.lord, startDate: m.start_date, endDate: m.end_date, raw: m,
                sublevels: (m.antardashas || []).map((a: RawDashaPeriod) => ({
                    planet: a.lord, startDate: a.start_date, endDate: a.end_date, raw: a
                }))
            }));
        }

        // True Chitra Ashtottari: nested inside ashtottari_data.dasha_sequence
        if (data.ashtottari_data && data.ashtottari_data.dasha_sequence && Array.isArray(data.ashtottari_data.dasha_sequence)) {
            return data.ashtottari_data.dasha_sequence;
        }

        // True Chitra Tribhagi: Can be a flat array or an array of cycles
        if (data.tribhagi_dasha && Array.isArray(data.tribhagi_dasha)) {
            // Check if it's an array of cycle objects (each containing a mahadashas array)
            if (data.tribhagi_dasha.length > 0 && (data.tribhagi_dasha[0].mahadashas || data.tribhagi_dasha[0].periods)) {
                return data.tribhagi_dasha.flatMap((cycle: any, idx: number) => {
                    const periods = cycle.mahadashas || cycle.periods || [];
                    return periods.map((m: any) => ({
                        ...m,
                        cycle: cycle.cycle_number || cycle.cycle || idx + 1
                    }));
                });
            }
            return data.tribhagi_dasha;
        }

        // True Chitra Prana Dasha (returns vimshottari_dasha key with recursive sub_periods)
        if (data.vimshottari_dasha && Array.isArray(data.vimshottari_dasha)) {
            return data.vimshottari_dasha;
        }
        if (data.prana_dasha && Array.isArray(data.prana_dasha)) {
            return data.prana_dasha;
        }
        if (data.sub_periods && Array.isArray(data.sub_periods)) {
            return data.sub_periods;
        }

        // Generic timeline/dasha_table fallback
        const dashaContainer = data.mahadashas?.data || data.mahadashas || data;
        const targetList = dashaContainer.timeline || dashaContainer.dasha_system || dashaContainer.dasha_table || dashaContainer.dasha_list || dashaContainer.schedule || dashaContainer.dasha_schedule;

        if (Array.isArray(targetList)) {
            return targetList.map((m: RawDashaPeriod) => {
                const startDate = resolveStartDate(m);
                const endDate = resolveEndDate(m);
                const isCurrent = isDateRangeCurrent(startDate, endDate);
                return {
                    planet: resolvePlanetName(m),
                    startDate, endDate, isCurrent,
                    type: m.type,
                    isBalance: m.type === "Balance" || m.is_balance === true || m.balance_at_birth === true,
                    duration: m.duration ? (typeof m.duration === 'number' ? `${m.duration}y` : m.duration) : undefined,
                    raw: m,
                    sublevel: (m.antardashas || m.sublevels || m.sublevel || m.antar_dashas || []).map((a: RawDashaPeriod) => ({
                        planet: resolvePlanetName(a),
                        startDate: resolveStartDate(a),
                        endDate: resolveEndDate(a),
                        isCurrent: isDateRangeCurrent(resolveStartDate(a), resolveEndDate(a)),
                        duration: a.duration_months ? `${a.duration_months}m` : undefined,
                        raw: a
                    }))
                };
            });
        }

        // Exhaustive key search
        const keysToTry = [
            'astronomical_data', 'dasha_details', 'dashas', 'mahadashas', 'periods', 'lifespan_sequence', 'dasha_calculation',
            'tribhagi_timeline', 'tribhagi_dashas_janma',
            'tribhagi_dasha', 'tribhagi', 'tribhagi_40', 'tribhagi-40', 'tribhagi_40_years',
            'panchottari_dasha', 'panchottari', 'ashtottari_dasha', 'ashtottari_antar',
            'ashtottari_pd', 'ashtottari_pratyantardasha', 'ashtottari', 'ashthottari',
            'chara_dasha', 'yogini_dasha', 'shastihayani_timeline', 'shasthihayani_timeline',
            'shashtihayani_dasha', 'shastihayani_dasha', 'shasthihayani_dasha',
            'shashtihayani', 'shastihayani', 'shasthihayani', 'dasha_dates',
            'shattrimshatsama_dasha', 'shattrimshatsama', 'dwadashottari_dasha',
            'dwadashottari_antar', 'dwadashottari', 'dwisaptati_dasha', 'dwisaptati',
            'dwisaptatisama', 'satabdika_dasha', 'satabdika', 'chaturshitisama_dasha',
            'chaturshitisama', 'pratyantardashas', 'pratyantara_dashas', 'sookshma_dashas',
            'data', 'dasha_list', 'timeline', 'schedule', 'dasha_schedule',
            'shodashottari_dasha', 'shodashottari', 'tribhagi_40_dashas',
            'dasha_cycle', 'vimshottari_dasha', 'vimshottari'
        ];

        for (const key of keysToTry) {
            if (data[key]) {
                if ((key === 'chara_dasha' || key === 'shodashottari_dasha') && !Array.isArray(data[key]) && data[key].mahadashas) {
                    const result = extractPeriodsArray(data[key].mahadashas);
                    if (result.length > 0) return result;
                } else if (key === 'shodashottari_dasha' && !Array.isArray(data[key]) && data[key].timeline) {
                    const result = extractPeriodsArray(data[key].timeline);
                    if (result.length > 0) return result;
                } else {
                    const result = extractPeriodsArray(data[key]);
                    if (result.length > 0) return result;
                }
            }
        }

        // Final fallback: first array property
        const firstArrayKey = Object.keys(data).find(k => Array.isArray(data[k]) && data[k].length > 0);
        if (firstArrayKey) return data[firstArrayKey];
    }

    return [];
}
