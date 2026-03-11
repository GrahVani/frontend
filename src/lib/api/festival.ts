const FESTIVAL_API_URL = process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL
  ? `${process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL}/festival`
  : 'http://localhost:3014/api/festival';

export interface FestivalQueryParams {
  year?: number;
  month?: number;
  date?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  region?: string | null;
  categories?: string[];
  include_recurring?: boolean;
  limit?: number;
  festival_id?: string;
}

export interface FestivalResponse {
  success: boolean;
  data: any;
  error?: string;
}

async function festivalFetch<T = FestivalResponse>(path: string, body?: unknown): Promise<T> {
  const isGet = !body;
  const response = await fetch(`${FESTIVAL_API_URL}${path}`, {
    method: isGet ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error || `Festival API error: ${response.status}`);
  }

  return response.json();
}

export const festivalApi = {
  getCalendar: (params: FestivalQueryParams): Promise<FestivalResponse> =>
    festivalFetch('/calendar', params),

  getFestivalById: (params: FestivalQueryParams & { festival_id: string }): Promise<FestivalResponse> =>
    festivalFetch('/by-id', params),

  getFestivalsByDate: (params: FestivalQueryParams & { date: string }): Promise<FestivalResponse> =>
    festivalFetch('/by-date', params),

  getFestivalsByMonth: (params: FestivalQueryParams): Promise<FestivalResponse> =>
    festivalFetch('/by-month', params),

  getHolidays: (params: FestivalQueryParams): Promise<FestivalResponse> =>
    festivalFetch('/holidays', params),

  getLunarMonths: (params: Omit<FestivalQueryParams, 'month' | 'date'>): Promise<FestivalResponse> =>
    festivalFetch('/lunar-months', params),

  getEkadashis: (params: FestivalQueryParams): Promise<FestivalResponse> =>
    festivalFetch('/ekadashis', params),

  getSankrantis: (params: FestivalQueryParams): Promise<FestivalResponse> =>
    festivalFetch('/sankrantis', params),

  getMajorFestivals: (params: FestivalQueryParams): Promise<FestivalResponse> =>
    festivalFetch('/major', params),

  getRegionalFestivals: (params: FestivalQueryParams & { region: string }): Promise<FestivalResponse> =>
    festivalFetch('/regional', params),

  getUpcomingFestivals: (params: FestivalQueryParams): Promise<FestivalResponse> =>
    festivalFetch('/upcoming', params),

  getCategories: (): Promise<{ success: boolean; data: { categories: Array<{ id: string; label: string; description: string }> } }> =>
    festivalFetch('/categories'),
};
