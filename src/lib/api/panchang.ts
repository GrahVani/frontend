// Panchang API — standalone panchang calculations (no client required)
// Calls Astro Engine directly — panchang is a public endpoint, no auth needed.

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
    const response = await fetch(`${ASTRO_ENGINE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
    });

    if (!response.ok) {
        throw new Error(`Panchang API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export const panchangApi = {
    getPanchang: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        panchangFetch('/api/panchanga', JSON.stringify(todayRequest(req))),

    getChoghadiya: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        panchangFetch('/api/panchanga/choghadiya', JSON.stringify(todayRequest(req))),

    getHora: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        panchangFetch('/api/panchanga/hora', JSON.stringify(todayRequest(req))),

    getMuhurat: (req?: Partial<PanchangRequest>): Promise<PanchangResponse> =>
        panchangFetch('/api/panchanga/muhurat', JSON.stringify(todayRequest(req))),
};
