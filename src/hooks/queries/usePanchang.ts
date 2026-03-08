import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { panchangApi, type PanchangRequest } from "@/lib/api/panchang";
import { STALE_TIMES } from "@/lib/api/stale-times";

// ─── Shared Helpers ───────────────────────────────────────────────

function getTodayDateStr(): string {
    return new Date().toISOString().slice(0, 10);
}

function str(v: unknown): string {
    if (!v) return '-';
    if (typeof v === 'string') return v;
    return String(v);
}

function num(v: unknown): number | undefined {
    return typeof v === 'number' ? v : undefined;
}

function obj(v: unknown): Record<string, unknown> {
    return (v && typeof v === 'object' && v !== null) ? v as Record<string, unknown> : {};
}

// ─── Panchang Types & Hook ────────────────────────────────────────

export interface PanchangDetail {
    name: string;
    endTime?: string;
    endDate?: string;
    pada?: number;
    paksha?: string;
    number?: number;
    progress?: number;
    lord?: string;
    type?: string;
    deity?: string;
    gana?: string;
    symbol?: string;
    meaning?: string;
    special?: string;
}

export interface PanchangData {
    date: string;
    tithi: PanchangDetail;
    nakshatra: PanchangDetail;
    yoga: PanchangDetail;
    karana: PanchangDetail;
    sunrise: string;
    sunset: string;
    moonrise?: string;
    moonset?: string;
    vara: PanchangDetail;
    raw?: Record<string, unknown>;
}

function extractDetail(field: unknown): PanchangDetail {
    if (!field) return { name: '-' };
    if (typeof field === 'string') return { name: field };
    const o = obj(field);
    return {
        name: str(o.name || o.tithi || o.nakshatra || o.yoga || o.karana || '-'),
        endTime: o.end_time ? str(o.end_time) : undefined,
        endDate: o.end_date ? str(o.end_date) : undefined,
        pada: num(o.pada),
        paksha: o.paksha ? str(o.paksha) : undefined,
        number: num(o.number),
        progress: num(o.progress_percent),
        lord: o.lord ? str(o.lord) : undefined,
        type: o.type ? str(o.type) : undefined,
        deity: o.deity ? str(o.deity) : undefined,
        gana: o.gana ? str(o.gana) : undefined,
        symbol: o.symbol ? str(o.symbol) : undefined,
        meaning: o.meaning ? str(o.meaning) : undefined,
        special: o.special ? str(o.special) : (o.significance ? str(o.significance) : undefined),
    };
}

/** Extract time from nested objects like { time: "01:10:15", method: "..." } */
function extractNestedTime(field: unknown): string {
    if (!field) return '-';
    if (typeof field === 'string') return field;
    const o = obj(field);
    return str(o.time || o.start || o.start_time || '-');
}

function extractPanchangFields(data: Record<string, unknown>, date: string): PanchangData {
    const panchanga = obj(data.panchanga || data);
    const times = obj(data.times || data);

    return {
        date,
        tithi: extractDetail(panchanga.tithi),
        nakshatra: extractDetail(panchanga.nakshatra),
        yoga: extractDetail(panchanga.yoga),
        karana: extractDetail(panchanga.karana),
        vara: extractDetail(panchanga.vara),
        sunrise: extractNestedTime(times.sunrise),
        sunset: extractNestedTime(times.sunset),
        moonrise: extractNestedTime(times.moonrise),
        moonset: extractNestedTime(times.moonset),
        raw: data,
    };
}

export function usePanchang(date?: string, location?: Partial<PanchangRequest>) {
    const targetDate = date ?? getTodayDateStr();

    return useQuery<PanchangData>({
        queryKey: queryKeys.panchang.daily(targetDate),
        queryFn: async () => {
            const response = await panchangApi.getPanchang({
                birthDate: targetDate,
                birthTime: '06:00:00',
                ...location,
            });
            if (!response.success || !response.data) {
                throw new Error('Panchang data unavailable');
            }
            return extractPanchangFields(response.data, targetDate);
        },
        staleTime: STALE_TIMES.CALENDAR,
        retry: 2,
    });
}

// ─── Choghadiya Types & Hook ──────────────────────────────────────

export interface ChoghadiyaPeriod {
    type: string;       // Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg
    nature: string;     // Shubha, Ashubha, Mishra
    quality: string;    // Most Auspicious, Auspicious, Inauspicious, etc.
    deity: string;
    color: string;
    start: string;
    end: string;
    description: string;
    bestFor: string;
    avoid: string;
    durationMinutes: number;
    isCurrent?: boolean;
}

function extractChoghadiya(data: Record<string, unknown>): { day: ChoghadiyaPeriod[]; current?: ChoghadiyaPeriod } {
    const day: ChoghadiyaPeriod[] = [];

    function mapPeriod(p: Record<string, unknown>, markCurrent = false): ChoghadiyaPeriod {
        return {
            type: str(p.type),
            nature: str(p.nature),
            quality: str(p.quality),
            deity: str(p.deity),
            color: str(p.color),
            start: str(p.start || p.start_time),
            end: str(p.end || p.end_time),
            description: str(p.description),
            bestFor: str(p.best_for),
            avoid: str(p.avoid),
            durationMinutes: typeof p.duration_minutes === 'number' ? p.duration_minutes : 0,
            isCurrent: markCurrent,
        };
    }

    // Current choghadiya
    const currentRaw = obj(data.current_choghadiya);
    const current = currentRaw.type ? mapPeriod(currentRaw, true) : undefined;

    // Day choghadiya array
    const dayArr = data.day_choghadiya;
    if (Array.isArray(dayArr)) {
        for (const item of dayArr) {
            const p = obj(item);
            if (p.type) {
                const period = mapPeriod(p);
                // Mark if this matches the current choghadiya
                if (current && period.start === current.start) {
                    period.isCurrent = true;
                }
                day.push(period);
            }
        }
    }

    // Night choghadiya
    const nightArr = data.night_choghadiya;
    if (Array.isArray(nightArr)) {
        for (const item of nightArr) {
            const p = obj(item);
            if (p.type) {
                day.push(mapPeriod(p));
            }
        }
    }

    return { day, current };
}

export function useChoghadiya(date?: string) {
    const targetDate = date ?? getTodayDateStr();

    return useQuery<{ day: ChoghadiyaPeriod[]; current?: ChoghadiyaPeriod }>({
        queryKey: queryKeys.panchang.choghadiya(targetDate),
        queryFn: async () => {
            const response = await panchangApi.getChoghadiya({
                birthDate: targetDate,
                birthTime: '06:00:00',
            });
            if (!response.success || !response.data) return { day: [] };
            return extractChoghadiya(response.data);
        },
        staleTime: STALE_TIMES.CALENDAR,
        retry: 1,
    });
}

// ─── Hora Types & Hook ────────────────────────────────────────────

export interface HoraPeriod {
    planet: string;
    sanskritName: string;
    start: string;
    end: string;
    quality: string;
    rank: number;
    color: string;
    bestFor: string;
    avoid: string;
    nature: string;
    isCurrent: boolean;
    progress?: number;
}

function extractHora(data: Record<string, unknown>): { periods: HoraPeriod[]; current?: HoraPeriod } {
    const periods: HoraPeriod[] = [];

    function mapHora(h: Record<string, unknown>, markCurrent = false): HoraPeriod {
        return {
            planet: str(h.hora_lord),
            sanskritName: str(h.sanskrit_name),
            start: str(h.start || h.start_time),
            end: str(h.end || h.end_time),
            quality: str(h.quality),
            rank: typeof h.rank === 'number' ? h.rank : 99,
            color: str(h.color),
            bestFor: str(h.best_for),
            avoid: str(h.avoid),
            nature: str(h.nature),
            isCurrent: markCurrent,
            progress: num(h.progress_percent),
        };
    }

    // Current hora
    const currentRaw = obj(data.current_hora);
    const current = currentRaw.hora_lord ? mapHora(currentRaw, true) : undefined;

    // Day hora
    const dayArr = data.day_hora;
    if (Array.isArray(dayArr)) {
        for (const item of dayArr) {
            const h = obj(item);
            if (h.hora_lord) {
                const period = mapHora(h);
                if (current && period.start === current.start) {
                    period.isCurrent = true;
                    period.progress = current.progress;
                }
                periods.push(period);
            }
        }
    }

    // Night hora
    const nightArr = data.night_hora;
    if (Array.isArray(nightArr)) {
        for (const item of nightArr) {
            const h = obj(item);
            if (h.hora_lord) periods.push(mapHora(h));
        }
    }

    return { periods, current };
}

export function useHora(date?: string) {
    const targetDate = date ?? getTodayDateStr();

    return useQuery<{ periods: HoraPeriod[]; current?: HoraPeriod }>({
        queryKey: queryKeys.panchang.hora(targetDate),
        queryFn: async () => {
            const response = await panchangApi.getHora({
                birthDate: targetDate,
                birthTime: '06:00:00',
            });
            if (!response.success || !response.data) return { periods: [] };
            return extractHora(response.data);
        },
        staleTime: STALE_TIMES.CALENDAR,
        retry: 1,
    });
}

// ─── Muhurta Types & Hook ─────────────────────────────────────────

export interface MuhurtaTiming {
    name: string;
    start: string;
    end: string;
    quality: string;
    description: string;
    duration?: number;
}

export interface MuhurtaData {
    rahuKaal?: MuhurtaTiming;
    gulikaKaal?: MuhurtaTiming;
    yamaganda?: MuhurtaTiming;
    abhijitMuhurat?: MuhurtaTiming;
    pradoshKaal?: MuhurtaTiming;
    durMuhurats: MuhurtaTiming[];
    sunrise: string;
    sunset: string;
    dayDuration?: string;
}

function extractMuhurtaTiming(field: unknown): MuhurtaTiming | undefined {
    const o = obj(field);
    if (!o.name && !o.start_time) return undefined;
    return {
        name: str(o.name),
        start: str(o.start_time || o.start),
        end: str(o.end_time || o.end),
        quality: str(o.quality),
        description: str(o.description),
        duration: num(o.duration_minutes),
    };
}

function extractMuhurta(data: Record<string, unknown>): MuhurtaData {
    const inauspicious = obj(data.inauspicious_periods);
    const auspicious = obj(data.auspicious_periods);
    const sun = obj(data.sun_timings);

    const durArr = inauspicious.dur_muhurats;
    const durMuhurats: MuhurtaTiming[] = [];
    if (Array.isArray(durArr)) {
        for (const item of durArr) {
            const t = extractMuhurtaTiming(item);
            if (t) durMuhurats.push(t);
        }
    }

    return {
        rahuKaal: extractMuhurtaTiming(inauspicious.rahu_kaal),
        gulikaKaal: extractMuhurtaTiming(inauspicious.gulika_kaal),
        yamaganda: extractMuhurtaTiming(inauspicious.yamaganda_kaal),
        abhijitMuhurat: extractMuhurtaTiming(auspicious.abhijit_muhurat),
        pradoshKaal: extractMuhurtaTiming(auspicious.pradosh_kaal),
        durMuhurats,
        sunrise: str(sun.sunrise),
        sunset: str(sun.sunset),
        dayDuration: sun.day_duration_formatted ? str(sun.day_duration_formatted) : undefined,
    };
}

export function useMuhurta(date?: string) {
    const targetDate = date ?? getTodayDateStr();

    return useQuery<MuhurtaData>({
        queryKey: queryKeys.muhurta.daily(targetDate),
        queryFn: async () => {
            const response = await panchangApi.getMuhurat({
                birthDate: targetDate,
                birthTime: '06:00:00',
            });
            if (!response.success || !response.data) {
                throw new Error('Muhurta data unavailable');
            }
            return extractMuhurta(response.data);
        },
        staleTime: STALE_TIMES.CALENDAR,
        retry: 1,
    });
}

// ─── Lagna Times Types & Hook ─────────────────────────────────────

export interface LagnaPeriod {
    lagnaName: string;
    sanskritName: string;
    lagnaNumber: number;
    lord: string;
    element: string;
    quality: string;
    start: string;
    end: string;
    bestFor: string;
    avoidFor: string;
    characteristics: string;
    durationMinutes: number;
    isCurrent: boolean;
    progress?: number;
}

function extractLagna(data: Record<string, unknown>): { schedule: LagnaPeriod[]; current?: LagnaPeriod } {
    const schedule: LagnaPeriod[] = [];

    function mapLagna(l: Record<string, unknown>, markCurrent = false): LagnaPeriod {
        return {
            lagnaName: str(l.lagna_name),
            sanskritName: str(l.sanskrit_name),
            lagnaNumber: typeof l.lagna_number === 'number' ? l.lagna_number : 0,
            lord: str(l.lord),
            element: str(l.element),
            quality: str(l.quality),
            start: str(l.start_time || l.start_time_vedic),
            end: str(l.end_time || l.end_time_vedic),
            bestFor: str(l.best_for),
            avoidFor: str(l.avoid_for),
            characteristics: str(l.characteristics),
            durationMinutes: typeof l.duration_minutes === 'number' ? l.duration_minutes : 0,
            isCurrent: markCurrent,
            progress: num(l.progress_percent),
        };
    }

    const currentRaw = obj(data.current_lagna);
    const current = currentRaw.lagna_name ? mapLagna(currentRaw, true) : undefined;

    const arr = data.full_day_schedule;
    if (Array.isArray(arr)) {
        for (const item of arr) {
            const l = obj(item);
            if (l.lagna_name) {
                const period = mapLagna(l);
                if (current && period.start === current.start) {
                    period.isCurrent = true;
                    period.progress = current.progress;
                }
                schedule.push(period);
            }
        }
    }

    return { schedule, current };
}

export function useLagnaTimes(date?: string) {
    const targetDate = date ?? getTodayDateStr();

    return useQuery<{ schedule: LagnaPeriod[]; current?: LagnaPeriod }>({
        queryKey: queryKeys.panchang.lagna(targetDate),
        queryFn: async () => {
            const response = await panchangApi.getLagnaTimes({
                birthDate: targetDate,
                birthTime: '06:00:00',
            });
            if (!response.success || !response.data) return { schedule: [] };
            return extractLagna(response.data);
        },
        staleTime: STALE_TIMES.CALENDAR,
        retry: 1,
    });
}

// ─── Monthly Panchang ─────────────────────────────────────────────

export function useMonthlyPanchang(year: number, month: number) {
    return useQuery<PanchangData[]>({
        queryKey: queryKeys.panchang.monthly(year, month),
        queryFn: async () => {
            const daysInMonth = new Date(year, month, 0).getDate();
            const results: PanchangData[] = [];
            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                try {
                    const response = await panchangApi.getPanchang({ birthDate: dateStr, birthTime: '06:00:00' });
                    if (response.success && response.data) {
                        results.push(extractPanchangFields(response.data, dateStr));
                    }
                } catch { /* skip */ }
            }
            return results;
        },
        staleTime: STALE_TIMES.CALENDAR,
        enabled: false,
    });
}
