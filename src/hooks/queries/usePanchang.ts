import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { panchangApi, type PanchangRequest } from "@/lib/api/panchang";
import { STALE_TIMES } from "@/lib/api/stale-times";

export interface PanchangData {
    date: string;
    tithi: string;
    nakshatra: string;
    yoga: string;
    karana: string;
    sunrise: string;
    sunset: string;
    rahuKaal: string;
    gulikaKaal: string;
    yamagandam: string;
    abhijitMuhurta: string;
    vara: string;
    raw?: Record<string, unknown>;
}

function getTodayDateStr(): string {
    return new Date().toISOString().slice(0, 10);
}

function extractPanchangFields(data: Record<string, unknown>, date: string): PanchangData {
    const panchanga = (data.panchanga || data) as Record<string, unknown>;
    const times = (data.times || data) as Record<string, unknown>;

    const extractName = (field: unknown): string => {
        if (!field) return '-';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) {
            const obj = field as Record<string, unknown>;
            return String(obj.name || obj.tithi || obj.nakshatra || obj.yoga || obj.karana || '-');
        }
        return String(field);
    };

    const extractTime = (field: unknown): string => {
        if (!field) return '-';
        if (typeof field === 'string') return field;
        if (typeof field === 'object' && field !== null) {
            const obj = field as Record<string, unknown>;
            return String(obj.time || obj.start || '-');
        }
        return String(field);
    };

    return {
        date,
        tithi: extractName(panchanga.tithi),
        nakshatra: extractName(panchanga.nakshatra),
        yoga: extractName(panchanga.yoga),
        karana: extractName(panchanga.karana),
        vara: extractName(panchanga.vara),
        sunrise: extractTime(times.sunrise),
        sunset: extractTime(times.sunset),
        rahuKaal: extractTime(times.rahu_kaal || times.rahuKaal),
        gulikaKaal: extractTime(times.gulika_kaal || times.gulikaKaal),
        yamagandam: extractTime(times.yamagandam),
        abhijitMuhurta: extractTime(times.abhijit_muhurta || times.abhijitMuhurta),
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

export function useMonthlyPanchang(year: number, month: number) {
    return useQuery<PanchangData[]>({
        queryKey: queryKeys.panchang.monthly(year, month),
        queryFn: async () => {
            const daysInMonth = new Date(year, month, 0).getDate();
            const results: PanchangData[] = [];

            for (let day = 1; day <= daysInMonth; day++) {
                const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                try {
                    const response = await panchangApi.getPanchang({
                        birthDate: dateStr,
                        birthTime: '06:00:00',
                    });
                    if (response.success && response.data) {
                        results.push(extractPanchangFields(response.data, dateStr));
                    }
                } catch {
                    // Skip days that fail
                }
            }

            return results;
        },
        staleTime: STALE_TIMES.CALENDAR,
        enabled: false, // Only fetch on explicit request — too many API calls
    });
}
