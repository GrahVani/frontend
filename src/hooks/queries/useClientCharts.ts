import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";

export interface ChartEntry {
    chartType: string;
    chartData: Record<string, unknown>;
    chartConfig?: { ayanamsa?: string; system?: string };
    ayanamsa?: string;
    system?: string;
    [key: string]: unknown;
}

export interface ChartLookup {
    [key: string]: ChartEntry;
}

export function useClientCharts(clientId?: string) {
    return useQuery({
        queryKey: queryKeys.charts.byClient(clientId ?? ''),
        queryFn: async () => {
            if (!clientId) return [];
            return await clientApi.getCharts(clientId);
        },
        enabled: !!clientId,
        staleTime: 60000, // Keep cache for 1 min — mutations auto-invalidate on success
        refetchInterval: false,
        select: (data) => {
            if (!Array.isArray(data)) return {};

            const lookup: ChartLookup = {};
            const lahiriDCharts: string[] = [];
            // List of lagna charts that should also be aliased from Lahiri for KP
            const LAGNA_CHARTS = ['moon_chart', 'sun_chart', 'arudha_lagna', 'bhava_lagna', 'hora_lagna', 'sripathi_bhava', 'kp_bhava', 'equal_bhava', 'karkamsha_d1', 'karkamsha_d9'];

            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- polymorphic chart record from API
            data.forEach((c: any) => {
                // Prioritize ayanamsa field, fallback to system for backward compatibility with DB records
                const ayanamsa = (c.ayanamsa || c.chartConfig?.ayanamsa || c.system || c.chartConfig?.system || 'lahiri').toLowerCase();
                const key = `${c.chartType}_${ayanamsa}`;
                lookup[key] = c;

                if (ayanamsa === 'lahiri' && (c.chartType.match(/^D\d+$/i) || c.chartType.toLowerCase() === 'natal' || LAGNA_CHARTS.includes(c.chartType.toLowerCase()))) {
                    lahiriDCharts.push(c.chartType);
                }
            });

            // Auto-alias Lahiri D-Charts and Lagna Charts as KP (force override to ensure old db copies are replaced)
            lahiriDCharts.forEach(chartType => {
                const kpKey = `${chartType}_kp`;
                // Always use Lahiri charts for KP, even if an old KP chart exists
                lookup[kpKey] = lookup[`${chartType}_lahiri`];
            });

            return lookup;
        }
    });
}
