// Panchang API — standalone panchang calculations (no client required)
// Calls Astro Engine directly — panchang is a public endpoint, no auth needed.
//
// NOTE: The Astro Engine backend is currently returning 503 (unavailable). When
// it comes back up, the endpoints below match the routes found in:
//   - astro_engine/engine/routes/LahairiAyanmasa.py   (/panchanga)
//   - astro_engine/engine/routes/MuhuratEngine.py     (/muhurat/*)

const ASTRO_ENGINE_URL = process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL || 'https://api-astro.grahvani.in';

export interface PanchangRequest {
    birthDate: string;    // YYYY-MM-DD (the date to calculate panchang for)
    birthTime: string;    // HH:MM:SS (time at that date, e.g. sunrise time)
    latitude: number;
    longitude: number;
    timezoneOffset: number; // Hours from UTC (e.g. 5.5 for IST)
}

export interface PanchangResponse {
    success: boolean;
    data: Record<string, unknown>;
    cached: boolean;
}

// Default location: Delhi, India (fallback for dashboard widget)
const DEFAULT_LOCATION = {
    latitude: 28.6139,
    longitude: 77.209,
    timezoneOffset: 5.5,
};

/**
 * Best-effort conversion from a numeric UTC offset to an IANA timezone string.
 * Astro Engine expects IANA timezone identifiers (e.g. "Asia/Kolkata").
 */
function offsetToTimezone(offset: number): string {
    // Common fixed-offset mappings; fallback to Etc/GMT if unknown.
    const map: Record<number, string> = {
        5.5: 'Asia/Kolkata',
        5: 'Asia/Karachi',
        6: 'Asia/Dhaka',
        6.5: 'Asia/Yangon',
        7: 'Asia/Bangkok',
        8: 'Asia/Singapore',
        9: 'Asia/Tokyo',
        9.5: 'Australia/Darwin',
        10: 'Australia/Sydney',
        10.5: 'Australia/Lord_Howe',
        11: 'Pacific/Noumea',
        12: 'Pacific/Auckland',
        13: 'Pacific/Apia',
        '-12': 'Etc/GMT+12',
        '-11': 'Pacific/Midway',
        '-10': 'Pacific/Honolulu',
        '-9': 'America/Anchorage',
        '-8': 'America/Los_Angeles',
        '-7': 'America/Denver',
        '-6': 'America/Chicago',
        '-5': 'America/New_York',
        '-4': 'America/Halifax',
        '-3': 'America/Sao_Paulo',
        '-2': 'America/Noronha',
        '-1': 'Atlantic/Azores',
        0: 'UTC',
        1: 'Europe/Berlin',
        2: 'Europe/Athens',
        3: 'Europe/Moscow',
        4: 'Asia/Dubai',
    };
    return map[offset] ?? `Etc/GMT${offset <= 0 ? '+' : '-'}${Math.abs(offset)}`;
}

interface AstroEnginePanchangBody {
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    timezone: string;
}

interface AstroEngineMuhuratBody {
    date: string;
    latitude: number;
    longitude: number;
    timezone: string;
    tradition?: string;
    time?: string;
}

function toAstroEnginePanchangBody(req: PanchangRequest): AstroEnginePanchangBody {
    return {
        date: req.birthDate,
        time: req.birthTime,
        latitude: req.latitude,
        longitude: req.longitude,
        timezone: offsetToTimezone(req.timezoneOffset),
    };
}

function toAstroEngineMuhuratBody(req: PanchangRequest, tradition = 'NORTH_INDIAN'): AstroEngineMuhuratBody {
    return {
        date: req.birthDate,
        latitude: req.latitude,
        longitude: req.longitude,
        timezone: offsetToTimezone(req.timezoneOffset),
        tradition,
        time: req.birthTime,
    };
}

function todayRequest(overrides?: Partial<PanchangRequest>): PanchangRequest {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    return {
        birthDate: `${yyyy}-${mm}-${dd}`,
        birthTime: `${hh}:${min}:00`,
        ...DEFAULT_LOCATION,
        ...overrides,
    };
}

/** Direct Astro Engine fetch — no auth token, no gateway proxy */
async function panchangFetch(path: string, body: string): Promise<PanchangResponse> {
    try {
        const response = await fetch(`${ASTRO_ENGINE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        if (!response.ok) {
            // Return a graceful failure instead of throwing — lets UI handle empty state
            return {
                success: false,
                data: {},
                cached: false,
            };
        }

        const payload = await response.json();

        // The legacy /panchanga route in LahairiAyanmasa.py returns
        // { status: "success", panchanga: {...}, times: {...} } rather than
        // the MuhuratEngine wrapper { success: true, data: {...} }.
        if (payload && typeof payload.status === 'string') {
            return {
                success: payload.status === 'success',
                data: {
                    panchanga: payload.panchanga ?? {},
                    times: payload.times ?? {},
                    input: payload.input,
                    note: payload.note,
                },
                cached: false,
            };
        }

        return payload as PanchangResponse;
    } catch {
        // Network failure (service down, CORS, etc.) — return graceful failure
        return {
            success: false,
            data: {},
            cached: false,
        };
    }
}

export const panchangApi = {
    // Lahiri Ayanamsa blueprint route — returns full panchanga + sunrise/sunset/moonrise/moonset.
    getPanchang: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        panchangFetch('/panchanga', JSON.stringify(toAstroEnginePanchangBody(todayRequest(req)))),

    // MuhuratEngine /time-quality returns the active Choghadiya/Gowri segment.
    // NOTE: it does NOT return full day/night arrays; the useChoghadiya hook will
    // receive a single segment and should be updated if full-day data is required.
    getChoghadiya: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        panchangFetch('/muhurat/time-quality', JSON.stringify(toAstroEngineMuhuratBody(todayRequest(req)))),

    // No matching Astro Engine endpoint exists for standalone Hora.
    // Returning empty data so dependent UI can render its empty state.
    getHora: (_req?: Partial<PanchangRequest>): Promise<PanchangResponse> => // eslint-disable-line @typescript-eslint/no-unused-vars
        Promise.resolve({ success: true, data: {}, cached: false }),

    // MuhuratEngine /inauspicious-windows returns Rahu Kaal, Gulika, Yamaganda,
    // Abhijit, Dur Muhurat, Pradosh Kaal, etc.
    getMuhurat: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        panchangFetch('/muhurat/inauspicious-windows', JSON.stringify(toAstroEngineMuhuratBody(todayRequest(req)))),

    // No matching Astro Engine endpoint exists for full-day Lagna times.
    // Returning empty data so dependent UI can render its empty state.
    getLagnaTimes: (_req?: Partial<PanchangRequest>): Promise<PanchangResponse> => // eslint-disable-line @typescript-eslint/no-unused-vars
        Promise.resolve({ success: true, data: {}, cached: false }),
};
