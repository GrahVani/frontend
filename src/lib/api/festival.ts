import axios from 'axios';
import type { Festival } from '@/types/calendar.types';

const FESTIVAL_API_URL = process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL 
  ? `${process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL}/festival`
  : 'http://localhost:3014/api/festival'; // Fallback to local astro-engine proxy

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
  data: any; // More flexible to handle different structures from Python API
  error?: string;
}

const festivalClient = axios.create({
  baseURL: FESTIVAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const festivalApi = {
  // 1. Full Festival Calendar
  getCalendar: async (params: FestivalQueryParams): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/calendar', params);
    return data;
  },

  // 2. Festival by ID
  getFestivalById: async (params: FestivalQueryParams & { festival_id: string }): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/by-id', params);
    return data;
  },

  // 3. Festivals by Date
  getFestivalsByDate: async (params: FestivalQueryParams & { date: string }): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/by-date', params);
    return data;
  },

  // 4. Festivals by Month
  getFestivalsByMonth: async (params: FestivalQueryParams): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/by-month', params);
    return data;
  },

  // 5. Government Holidays
  getHolidays: async (params: FestivalQueryParams): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/holidays', params);
    return data;
  },

  // 6. Lunar Month Mapping
  getLunarMonths: async (params: Omit<FestivalQueryParams, 'month' | 'date'>): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/lunar-months', params);
    return data;
  },

  // 7. All Ekadashis
  getEkadashis: async (params: FestivalQueryParams): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/ekadashis', params);
    return data;
  },

  // 8. All Sankrantis
  getSankrantis: async (params: FestivalQueryParams): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/sankrantis', params);
    return data;
  },

  // 9. Major Festivals
  getMajorFestivals: async (params: FestivalQueryParams): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/major', params);
    return data;
  },

  // 10. Regional Festivals
  getRegionalFestivals: async (params: FestivalQueryParams & { region: string }): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/regional', params);
    return data;
  },

  // 11. Upcoming Festivals
  getUpcomingFestivals: async (params: FestivalQueryParams): Promise<FestivalResponse> => {
    const { data } = await festivalClient.post('/upcoming', params);
    return data;
  },

  // 12. Available Categories
  getCategories: async (): Promise<{ success: boolean; data: { categories: Array<{ id: string; label: string; description: string }> } }> => {
    const { data } = await festivalClient.get('/categories');
    return data;
  }
};
