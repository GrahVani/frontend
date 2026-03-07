/**
 * Transit page helpers — types, mappers, and date utilities.
 */

import { parseChartData, signIdToName } from '@/lib/chart-helpers';

export interface TransitPlanet {
    planet: string;
    sign: string;
    degree: string;
    house: number;
    status: string;
    isRetro: boolean;
    nakshatra: string;
}

export type DurationTab = 'day' | 'week' | 'month' | 'year' | 'custom';

export const TRANSIT_PLANET_ORDER = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export const PLANET_SYMBOLS: Record<string, string> = {
    'Sun': '\u2609', 'Moon': '\u263D', 'Mars': '\u2642', 'Mercury': '\u263F',
    'Jupiter': '\u2643', 'Venus': '\u2640', 'Saturn': '\u2644', 'Rahu': '\u260A', 'Ketu': '\u260B',
};

/** Map API chart data to transit format using robust parser */
export function mapChartToTransits(chartData: unknown, natalAscendant: number): TransitPlanet[] {
    const { planets } = parseChartData(chartData || {});
    if (planets.length === 0) return [];

    return planets
        .filter(p => p.name !== 'As')
        .map(p => {
            const normalized = p.signId;
            const house = ((normalized - natalAscendant + 12) % 12) + 1;
            return {
                planet: p.name,
                sign: signIdToName[p.signId] || 'Unknown',
                degree: p.degree,
                house,
                status: 'Neutral',
                isRetro: p.isRetro || false,
                nakshatra: p.nakshatra || '\u2014',
            };
        });
}

export function getDateRange(tab: DurationTab): { start: string; end: string } {
    const today = new Date();
    const end = new Date(today);
    switch (tab) {
        case 'day': break;
        case 'week': end.setDate(end.getDate() + 6); break;
        case 'month': end.setDate(end.getDate() + 29); break;
        case 'year': end.setDate(end.getDate() + 364); break;
    }
    return {
        start: today.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
    };
}

export function getSafeDateRange(tab: DurationTab, custom?: { start: string; end: string }): { start: string; end: string } {
    if (tab === 'custom' && custom) return custom;
    return getDateRange(tab);
}

export function formatDateLabel(dateStr: string): { day: string; monthYear: string; weekday: string; isToday: boolean } {
    const parts = dateStr.split('-');
    if (parts.length !== 3) return { day: '?', monthYear: '', weekday: '', isToday: false };
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const dayNum = parseInt(parts[2]);
    const dateObj = new Date(year, month, dayNum);
    const todayStr = new Date().toISOString().split('T')[0];
    return {
        day: String(dayNum),
        monthYear: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        weekday: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: dateStr === todayStr,
    };
}
