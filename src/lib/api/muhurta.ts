// Muhurta API — auspicious timing calculations
// Uses the panchang proxy endpoints for daily and category-specific muhurta

import { panchangApi, type PanchangRequest } from './panchang';
import type {
    DailyMuhurta,
    MuhurtaTimeWindow,
    MuhurtaResult,
    MuhurtaCategory,
    MuhurtaQuality,
    MuhurtaFiltersState,
} from '@/types/muhurta.types';

const DEFAULT_LOCATION = { latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5 };

// ============ DAILY MUHURTA ============

export async function fetchDailyMuhurta(
    date?: string,
    location?: Partial<PanchangRequest>,
): Promise<DailyMuhurta> {
    const targetDate = date || new Date().toISOString().slice(0, 10);
    const req: Partial<PanchangRequest> = {
        birthDate: targetDate,
        birthTime: '06:00:00',
        ...DEFAULT_LOCATION,
        ...location,
    };

    // Fetch panchang + muhurat in parallel
    const [panchangRes, muhuratRes] = await Promise.allSettled([
        panchangApi.getPanchang(req),
        panchangApi.getMuhurat(req),
    ]);

    const panchang = panchangRes.status === 'fulfilled' ? panchangRes.value.data : {};
    const muhurat = muhuratRes.status === 'fulfilled' ? muhuratRes.value.data : {};

    return normalizeDailyMuhurta(targetDate, panchang, muhurat);
}

function normalizeDailyMuhurta(
    date: string,
    panchang: Record<string, unknown>,
    muhurat: Record<string, unknown>,
): DailyMuhurta {
    const times = (panchang.times || panchang) as Record<string, unknown>;
    const muhuratData = (muhurat.muhurat || muhurat) as Record<string, unknown>;

    const extractTime = (field: unknown): string => {
        if (!field) return '-';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) {
            const obj = field as Record<string, unknown>;
            return String(obj.time || obj.start || obj.value || '-');
        }
        return String(field);
    };

    const extractTimeRange = (field: unknown): { start: string; end: string } => {
        if (!field) return { start: '-', end: '-' };
        if (typeof field === 'object' && field !== null) {
            const obj = field as Record<string, unknown>;
            return {
                start: extractTime(obj.start || obj.startTime),
                end: extractTime(obj.end || obj.endTime),
            };
        }
        return { start: '-', end: '-' };
    };

    const abhijit = extractTimeRange(muhuratData.abhijit || muhuratData.abhijit_muhurta || times.abhijit_muhurta);
    const rahu = extractTimeRange(times.rahu_kaal || times.rahuKaal);
    const gulika = extractTimeRange(times.gulika_kaal || times.gulikaKaal);
    const yama = extractTimeRange(times.yamagandam);

    const sunrise = extractTime(times.sunrise);
    const brahmaMuhurtaStart = sunrise !== '-' ? deriveBrahmaMuhurta(sunrise) : { start: '04:48 AM', end: '05:36 AM' };

    // Extract general muhurta windows from the response
    const generalWindows = extractGeneralWindows(muhuratData);

    return {
        date,
        sunrise: sunrise !== '-' ? sunrise : undefined,
        sunset: extractTime(times.sunset) !== '-' ? extractTime(times.sunset) : undefined,
        abhijitMuhurta: {
            name: 'Abhijit Muhurta',
            startTime: abhijit.start,
            endTime: abhijit.end,
            quality: 'excellent',
            description: 'The victorious muhurta — ideal for all auspicious activities.',
        },
        brahmaMuhurta: {
            name: 'Brahma Muhurta',
            startTime: brahmaMuhurtaStart.start,
            endTime: brahmaMuhurtaStart.end,
            quality: 'excellent',
            description: 'Sacred early morning window for spiritual practices.',
        },
        rahuKaal: {
            name: 'Rahu Kaal',
            startTime: rahu.start,
            endTime: rahu.end,
            quality: 'avoid',
            description: 'Inauspicious period governed by Rahu — avoid new beginnings.',
        },
        gulikaKaal: {
            name: 'Gulika Kaal',
            startTime: gulika.start,
            endTime: gulika.end,
            quality: 'avoid',
            description: 'Malefic period of Gulika — avoid important decisions.',
        },
        yamagandam: {
            name: 'Yamagandam',
            startTime: yama.start,
            endTime: yama.end,
            quality: 'avoid',
            description: 'Period ruled by Yama — avoid risky activities.',
        },
        generalWindows,
    };
}

function deriveBrahmaMuhurta(sunrise: string): { start: string; end: string } {
    // Brahma Muhurta = 96 minutes before sunrise, lasts 48 minutes
    // This is approximate — exact calculation requires sunrise time parsing
    try {
        const match = sunrise.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!match) return { start: '04:48 AM', end: '05:36 AM' };

        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        if (match[3]?.toUpperCase() === 'PM' && hours < 12) hours += 12;

        const sunriseMinutes = hours * 60 + minutes;
        const brahmaStart = sunriseMinutes - 96;
        const brahmaEnd = sunriseMinutes - 48;

        const fmt = (m: number) => {
            const h = Math.floor(m / 60);
            const min = m % 60;
            const period = h >= 12 ? 'PM' : 'AM';
            const h12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
            return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${period}`;
        };

        return { start: fmt(brahmaStart), end: fmt(brahmaEnd) };
    } catch {
        return { start: '04:48 AM', end: '05:36 AM' };
    }
}

function extractGeneralWindows(data: Record<string, unknown>): MuhurtaTimeWindow[] {
    const windows = data.windows || data.general || data.auspicious;
    if (Array.isArray(windows)) {
        return windows.map((w: Record<string, unknown>) => ({
            name: String(w.name || 'Auspicious Window'),
            startTime: String(w.startTime || w.start || '-'),
            endTime: String(w.endTime || w.end || '-'),
            quality: (String(w.quality || 'good') as MuhurtaQuality),
            description: String(w.description || ''),
        }));
    }
    return [];
}

// ============ CATEGORY MUHURTA SEARCH ============

const MAX_DAYS = 30;

export async function searchCategoryMuhurta(
    filters: MuhurtaFiltersState,
): Promise<MuhurtaResult[]> {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    const dayCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const limitedDays = Math.min(dayCount, MAX_DAYS);

    const results: MuhurtaResult[] = [];

    for (let i = 0; i < limitedDays; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);

        try {
            const panchangRes = await panchangApi.getPanchang({
                birthDate: dateStr,
                birthTime: '06:00:00',
                latitude: filters.latitude ?? DEFAULT_LOCATION.latitude,
                longitude: filters.longitude ?? DEFAULT_LOCATION.longitude,
                timezoneOffset: DEFAULT_LOCATION.timezoneOffset,
            });

            if (panchangRes.success && panchangRes.data) {
                const result = evaluateDate(dateStr, panchangRes.data, filters.category);
                if (result && result.quality !== 'avoid') {
                    results.push(result);
                }
            }
        } catch {
            // Skip days that fail
        }
    }

    return results.sort((a, b) => b.score - a.score);
}

function evaluateDate(
    dateStr: string,
    data: Record<string, unknown>,
    category: MuhurtaCategory,
): MuhurtaResult | null {
    const panchanga = (data.panchanga || data) as Record<string, unknown>;
    const times = (data.times || data) as Record<string, unknown>;

    const getName = (field: unknown): string => {
        if (!field) return '-';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) return String((field as Record<string, unknown>).name || '-');
        return String(field);
    };

    const tithi = getName(panchanga.tithi);
    const nakshatra = getName(panchanga.nakshatra);
    const yoga = getName(panchanga.yoga);
    const dayOfWeek = new Date(dateStr + 'T12:00:00').toLocaleDateString('en', { weekday: 'long' });

    const { score, quality, reasons, warnings } = scoreMuhurta(tithi, nakshatra, yoga, dayOfWeek, category);

    const extractTime = (field: unknown): string => {
        if (!field) return '-';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) return String((field as Record<string, unknown>).time || '-');
        return String(field);
    };

    const abhijitTime = extractTime(times.abhijit_muhurta || times.abhijitMuhurta);

    return {
        id: `muhurta-${dateStr}`,
        date: dateStr,
        dayOfWeek,
        tithi,
        nakshatra,
        yoga,
        quality,
        score,
        bestTimeWindow: abhijitTime !== '-' ? abhijitTime : 'Abhijit Muhurta',
        reasons,
        warnings: warnings.length > 0 ? warnings : undefined,
    };
}

// ============ VEDIC MUHURTA SCORING ============

const AUSPICIOUS_NAKSHATRAS = [
    'Rohini', 'Mrigashira', 'Pushya', 'Hasta', 'Chitra',
    'Swati', 'Anuradha', 'Revati', 'Ashwini', 'Magha',
    'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada', 'Shravana', 'Dhanishta',
];

const AUSPICIOUS_TITHIS = [
    'Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Purnima',
];

const AUSPICIOUS_YOGAS = ['Siddha', 'Amrita', 'Shubha', 'Shukla', 'Brahma', 'Indra'];

const CATEGORY_FAVORABLE_DAYS: Record<MuhurtaCategory, string[]> = {
    wedding: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    property: ['Monday', 'Thursday', 'Friday'],
    vehicle: ['Wednesday', 'Thursday', 'Friday'],
    travel: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
    general: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
};

function scoreMuhurta(
    tithi: string,
    nakshatra: string,
    yoga: string,
    dayOfWeek: string,
    category: MuhurtaCategory,
): { score: number; quality: MuhurtaQuality; reasons: string[]; warnings: string[] } {
    let score = 50; // Base score
    const reasons: string[] = [];
    const warnings: string[] = [];

    // Nakshatra check
    if (AUSPICIOUS_NAKSHATRAS.some(n => nakshatra.includes(n))) {
        score += 20;
        reasons.push(`Auspicious nakshatra: ${nakshatra}`);
    } else {
        score -= 10;
        warnings.push(`Nakshatra ${nakshatra} is not traditionally auspicious`);
    }

    // Tithi check
    if (AUSPICIOUS_TITHIS.some(t => tithi.includes(t))) {
        score += 15;
        reasons.push(`Favorable tithi: ${tithi}`);
    } else if (tithi.includes('Amavasya')) {
        score -= 20;
        warnings.push('Amavasya (new moon) — generally inauspicious');
    }

    // Yoga check
    if (AUSPICIOUS_YOGAS.some(y => yoga.includes(y))) {
        score += 15;
        reasons.push(`Auspicious yoga: ${yoga}`);
    }

    // Day of week check (category-specific)
    const favorableDays = CATEGORY_FAVORABLE_DAYS[category] || CATEGORY_FAVORABLE_DAYS.general;
    if (favorableDays.includes(dayOfWeek)) {
        score += 10;
        reasons.push(`${dayOfWeek} is favorable for ${category}`);
    } else if (dayOfWeek === 'Tuesday' || dayOfWeek === 'Saturday') {
        score -= 10;
        warnings.push(`${dayOfWeek} is generally avoided for auspicious activities`);
    }

    // Clamp score
    score = Math.max(0, Math.min(100, score));

    const quality: MuhurtaQuality = score >= 80 ? 'excellent'
        : score >= 60 ? 'good'
        : score >= 40 ? 'average'
        : 'avoid';

    return { score, quality, reasons, warnings };
}
