// Muhurat Engine API — proxied through astro-engine service
// 9 endpoints covering find, evaluate, compatibility, panchang, inauspicious, time-quality, interpret

import type {
  FindMuhuratParams,
  EvaluateDateParams,
  CompatibilityParams,
  MuhuratPanchangParams,
  InauspiciousParams,
  TimeQualityParams,
  InterpretParams,
  MuhuratFindResponse,
  MuhuratEvaluateResponse,
  CompatibilityData,
  EventTypesResponse,
  TraditionsResponse,
  MuhuratPanchangResponse,
  InauspiciousWindowsResponse,
  TimeQualityResponse,
} from "@/types/muhurta.types";

const ASTRO_ENGINE_URL = process.env.NEXT_PUBLIC_ASTRO_ENGINE_URL || "https://api-astro.grahvani.in";
const BASE = `${ASTRO_ENGINE_URL}/api/muhurat`;

interface ApiResult<T> {
  success: boolean;
  data: T;
  cached: boolean;
}

async function muhuratFetch<T>(path: string, body?: unknown): Promise<T> {
  const options: RequestInit = {
    headers: { "Content-Type": "application/json" },
  };

  if (body !== undefined) {
    options.method = "POST";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE}${path}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error || errorData?.upstream?.error?.message || `Muhurat API error: ${response.status}`
    );
  }

  const result: ApiResult<T> = await response.json();
  if (!result.success) {
    throw new Error("Muhurat API returned unsuccessful response");
  }
  return result.data;
}

export const muhuratApi = {
  // ─── Core Endpoints ───────────────────────────────────

  findMuhurats: (params: FindMuhuratParams) =>
    muhuratFetch<MuhuratFindResponse>("/find", params),

  evaluateDate: (params: EvaluateDateParams) =>
    muhuratFetch<MuhuratEvaluateResponse>("/evaluate", params),

  checkCompatibility: (params: CompatibilityParams) =>
    muhuratFetch<CompatibilityData>("/compatibility", params),

  getEventTypes: () =>
    muhuratFetch<EventTypesResponse>("/event-types"),

  getInterpretation: (params: InterpretParams) =>
    muhuratFetch<string>("/interpret", params),

  // ─── Utility Endpoints ────────────────────────────────

  getTraditions: () =>
    muhuratFetch<TraditionsResponse>("/traditions"),

  getPanchang: (params: MuhuratPanchangParams) =>
    muhuratFetch<MuhuratPanchangResponse>("/panchang", params),

  getInauspiciousWindows: (params: InauspiciousParams) =>
    muhuratFetch<InauspiciousWindowsResponse>("/inauspicious-windows", params),

  getTimeQuality: (params: TimeQualityParams) =>
    muhuratFetch<TimeQualityResponse>("/time-quality", params),
};

// ─── Legacy Exports (backward compat for old pages) ─────

import { panchangApi, type PanchangRequest } from "./panchang";
import type { DailyMuhurta, MuhurtaTimeWindow, MuhurtaFiltersState, MuhurtaResult } from "@/types/muhurta.types";

const DEFAULT_LOCATION = { latitude: 28.6139, longitude: 77.209, timezoneOffset: 5.5 };

export async function fetchDailyMuhurta(
  date?: string,
  location?: Partial<PanchangRequest>,
): Promise<DailyMuhurta> {
  const targetDate = date || new Date().toISOString().slice(0, 10);
  const req: Partial<PanchangRequest> = {
    birthDate: targetDate,
    birthTime: "06:00:00",
    ...DEFAULT_LOCATION,
    ...location,
  };

  const [panchangRes, muhuratRes] = await Promise.allSettled([
    panchangApi.getPanchang(req),
    panchangApi.getMuhurat(req),
  ]);

  const panchang = panchangRes.status === "fulfilled" ? panchangRes.value.data : {};
  const muhurat = muhuratRes.status === "fulfilled" ? muhuratRes.value.data : {};

  return normalizeDailyMuhurta(targetDate, panchang, muhurat);
}

export async function searchCategoryMuhurta(_filters: MuhurtaFiltersState): Promise<MuhurtaResult[]> {
  // Legacy stub — the old client-side scoring is deprecated.
  // New code should use muhuratApi.findMuhurats() instead.
  return [];
}

// ─── Legacy Normalizer (minimal, keeps old dashboard working) ──

function normalizeDailyMuhurta(date: string, panchang: Record<string, unknown>, muhurat: Record<string, unknown>): DailyMuhurta {
  const str = (obj: unknown, key: string): string => {
    if (obj && typeof obj === "object" && key in obj) return String((obj as Record<string, unknown>)[key] ?? "");
    return "";
  };

  const extractTime = (obj: unknown, startKey: string, endKey: string): { start: string; end: string } => {
    if (!obj || typeof obj !== "object") return { start: "", end: "" };
    const o = obj as Record<string, unknown>;
    return { start: String(o[startKey] ?? ""), end: String(o[endKey] ?? "") };
  };

  const makeWindow = (name: string, times: { start: string; end: string }, quality: "excellent" | "good" | "average" | "avoid"): MuhurtaTimeWindow => ({
    name,
    startTime: times.start,
    endTime: times.end,
    quality,
  });

  const m = muhurat as Record<string, unknown>;

  const abhijit = extractTime(m?.abhijit_muhurat || m?.abhijit, "start_time", "end_time");
  const rahu = extractTime(m?.rahu_kaal || m?.rahu_kalam, "start", "end");
  const gulika = extractTime(m?.gulika_kaal || m?.gulika, "start", "end");
  const yama = extractTime(m?.yamagandam || m?.yamaganda, "start", "end");

  const sunrise = str(m, "sunrise") || str(panchang, "sunrise") || "06:00";

  return {
    date,
    sunrise,
    sunset: str(m, "sunset") || str(panchang, "sunset") || "18:00",
    abhijitMuhurta: makeWindow("Abhijit Muhurta", abhijit, "excellent"),
    brahmaMuhurta: makeWindow("Brahma Muhurta", { start: "", end: "" }, "excellent"),
    rahuKaal: makeWindow("Rahu Kaal", rahu, "avoid"),
    gulikaKaal: makeWindow("Gulika Kaal", gulika, "avoid"),
    yamagandam: makeWindow("Yamagandam", yama, "avoid"),
    generalWindows: [],
  };
}
