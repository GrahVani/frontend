// =============================================================================
// MUHURAT ENGINE — Frontend TypeScript Types
// Matches live API responses from astroengine.astrocorp.in/muhurat/*
// =============================================================================

// ─── Enums ──────────────────────────────────────────────

export type EventTypeCode =
  | "VIVAH" | "SAGAI" | "GRIHA_PRAVESH" | "BHOOMI_PUJAN" | "VYAPAAR"
  | "VAHAN" | "UPANAYANA" | "NAAMKARAN" | "ANNAPRASHAN" | "VIDYAARAMBH"
  | "SURGERY" | "YATRA" | "PROPERTY";

export type TraditionCode =
  | "NORTH_INDIAN" | "SOUTH_INDIAN_TAMIL" | "SOUTH_INDIAN_KERALA"
  | "SOUTH_INDIAN_TELUGU" | "SOUTH_INDIAN_KANNADA" | "UNIVERSAL";

export type MuhuratGrade =
  | "Sarvottama" | "Uttama" | "Madhyama" | "Samanya" | "Adhama" | "Tyajya";

export type InterpretLanguage =
  | "english" | "hindi" | "hinglish" | "tamil" | "telugu" | "kannada" | "malayalam";

// ─── Shared Sub-Objects ─────────────────────────────────

export interface PersonInput {
  birth_date: string;
  birth_time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PanchangData {
  tithi: string;
  tithi_index: number;
  tithi_group: string;
  paksha: string;
  nakshatra: string;
  nakshatra_index: number;
  nakshatra_category: string;
  yoga: string;
  yoga_index: number;
  yoga_nature: string;
  karana: string;
  karana_index: number;
  karana_nature: string;
}

export interface ScoreBreakdown {
  panchang_shuddhi: number;
  yoga_matrix: number;
  mahadosha: string; // "PASS" | "FAIL"
  personalization: number;
  compatibility: number;
  lagna_shuddhi: number;
  time_window_penalties: number;
  auspicious_bonus: number;
  total: number;
}

export interface ChoghadiyaQuality {
  system: "CHOGHADIYA";
  active_segment: string;
  is_auspicious: boolean;
  segment_index: number;
  all_day_segments: string[];
}

export interface GowriQuality {
  system: "GOWRI_PANCHANGAM";
  active_segment: string;
  is_auspicious: boolean;
  segment_index: number;
  all_day_segments: string[];
}

export interface BothQuality {
  system: "BOTH";
  choghadiya: ChoghadiyaQuality;
  gowri_panchangam: GowriQuality;
  both_auspicious: boolean;
}

export type TimeQualityData = ChoghadiyaQuality | GowriQuality | BothQuality;

export interface InauspiciousPeriod {
  name: string;
  start_time: string;
  end_time: string;
  start_datetime?: string;
  end_datetime?: string;
  quality: string;
  duration_minutes?: number;
  description?: string;
  note?: string | null;
  muhurat_number?: number;
  position?: number;
  weekday?: string;
}

export interface InauspiciousWindowsData {
  rahu_kaal: string | null;
  yamaganda: string | null;
  gulika_kaal: string | null;
  varjyam: string | null;
  durmuhurta: string | null;
  mandatory_avoid: string[];
  penalty_multipliers: Record<string, number>;
  rahu_kaal_note?: string;
}

export interface AshtakootKoot {
  obtained: number;
  max: number;
}

export interface AshtakootData {
  system: "ASHTAKOOT";
  koots: Record<string, AshtakootKoot>;
  details?: Record<string, string>;
  total: number;
  max: number;
  percentage: number;
  nadi_dosha: boolean;
  nadi_dosha_cancelled: boolean;
}

export interface PoruthamFactor {
  pass: boolean;
  mandatory: boolean;
}

export interface DashaPoruthamData {
  system: "DASHA_PORUTHAM";
  total_passed: number;
  total_poruthams: number;
  mandatory_passed: boolean;
  poruthams: Record<string, PoruthamFactor>;
}

export interface ManglikStatus {
  person1: boolean;
  person2: boolean;
  cancelled: boolean;
  note?: string;
}

export interface CompatibilityData {
  tradition: TraditionCode;
  ashtakoot?: { ashtakoot: AshtakootData } | AshtakootData;
  porutham?: DashaPoruthamData;
  manglik?: ManglikStatus;
  chevvai_dosham?: ManglikStatus;
  nadi_dosha?: boolean;
  nadi_dosha_cancelled?: boolean;
  bhakoot_dosha?: boolean;
  bhakoot_dosha_cancelled?: boolean;
  yoni_animals?: string[];
  yoni_score?: number;
  gana_match?: string;
  mandatory_passed?: boolean;
  mandatory_warning?: string;
  verdict: string;
  matching_system?: string;
  muhurat_score?: number;
  primary_reference?: string;
  tradition_display?: string;
}

export interface RejectionSummary {
  macro_period: Record<string, number>;
  day_level: Record<string, number>;
}

export interface DateVerdict {
  is_suitable: boolean;
  date_display: string;
  event: string;
  summary: string;
  reasons: string[];
  recommendation: string;
}

// ─── Muhurat Result Object ──────────────────────────────

export interface MuhuratResult {
  rank: number;
  score: number;
  grade: MuhuratGrade;
  date: string;
  date_display: string;
  day: string;
  window_start: string;
  window_end: string;
  time_display: string;
  duration_minutes: number;
  lagna: string;
  panchang: PanchangData;
  score_breakdown: ScoreBreakdown;
  time_quality: TimeQualityData;
  inauspicious_windows_today: InauspiciousWindowsData;
  tradition_notes: string[];
  classical_references: string[];
  reasoning: string[];
  warnings: string[];
  compatibility: CompatibilityData | null;
}

// ─── API Response Types ─────────────────────────────────

export interface SearchInfo {
  event_type: string;
  tradition: string;
  days_scanned: number;
  candidates_evaluated: number;
  muhurats_found: number;
  computation_time_ms: number;
}

export interface MuhuratFindResponse {
  tradition: TraditionCode;
  tradition_display: string;
  matching_system: string;
  time_quality_system: string;
  primary_reference: string;
  total_muhurats: number;
  best_score: number;
  best_grade: string;
  search_info: SearchInfo;
  rejection_summary: RejectionSummary;
  compatibility: CompatibilityData | null;
  muhurats: MuhuratResult[];
}

export interface MuhuratEvaluateResponse extends MuhuratFindResponse {
  evaluation: {
    date: string;
    time: string;
    event_type: string;
    tradition: string;
  };
  date_verdict: DateVerdict;
}

export interface MuhuratPanchangResponse {
  date: string;
  time: string;
  panchang: PanchangData;
  vara: string;
}

export interface InauspiciousWindowsResponse {
  date: string;
  weekday: string;
  sun_timings: {
    sunrise: string;
    sunset: string;
    sunrise_datetime?: string;
    sunset_datetime?: string;
    day_duration_hours: number;
    day_duration_formatted: string;
  };
  auspicious_periods: Record<string, InauspiciousPeriod>;
  inauspicious_periods: {
    rahu_kaal: InauspiciousPeriod;
    yamaganda_kaal: InauspiciousPeriod;
    gulika_kaal: InauspiciousPeriod;
    dur_muhurats: InauspiciousPeriod[];
  };
  tradition_annotations: {
    tradition: TraditionCode;
    tradition_display: string;
    mandatory_avoid: string[];
    penalty_multipliers: Record<string, number>;
    rahu_kaal_note?: string;
  };
}

export interface TimeQualityResponse {
  date: string;
  time: string;
  tradition: TraditionCode;
  tradition_display: string;
  sunrise: string;
  sunset: string;
  time_quality: TimeQualityData;
}

export interface EventTypeInfo {
  code: EventTypeCode;
  name: string;
  description: string;
  requires_two_persons: boolean;
}

export interface TraditionInfo {
  code: TraditionCode;
  display: string;
  time_quality_system: string;
  matching_system: string;
  primary_reference: string;
  manglik_term: string;
  mandatory_avoid: string[];
  penalty_multipliers: Record<string, number>;
}

export interface EventTypesResponse {
  event_types: EventTypeInfo[];
  total: number;
  traditions: { code: TraditionCode; name: string }[];
}

export interface TraditionsResponse {
  traditions: TraditionInfo[];
  total: number;
}

// ─── Request Param Types ────────────────────────────────

export interface FindMuhuratParams {
  event_type: EventTypeCode;
  tradition?: TraditionCode;
  from_date: string;
  to_date: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  persons?: PersonInput[];
  max_results?: number;
  preferred_start_time?: string;
  preferred_end_time?: string;
  weekdays_only?: boolean;
  include_interpretation?: boolean;
  user_name?: string;
  preferred_language?: InterpretLanguage;
}

export interface EvaluateDateParams {
  event_type: EventTypeCode;
  tradition?: TraditionCode;
  date: string;
  time?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  persons?: PersonInput[];
  include_interpretation?: boolean;
  user_name?: string;
  preferred_language?: InterpretLanguage;
}

export interface CompatibilityParams {
  tradition?: TraditionCode;
  person1: PersonInput;
  person2: PersonInput;
}

export interface MuhuratPanchangParams {
  date: string;
  time?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface InauspiciousParams {
  date: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  tradition?: TraditionCode;
}

export interface TimeQualityParams {
  date: string;
  time: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  tradition?: TraditionCode;
}

export interface InterpretParams {
  muhurat_data: Record<string, unknown>;
  event_type: EventTypeCode;
  tradition?: TraditionCode;
  language?: InterpretLanguage;
  user_name?: string;
}

// ─── Legacy Compat (used by old components not yet migrated) ──

export type MuhurtaCategory = "wedding" | "property" | "vehicle" | "travel" | "general";
export type MuhurtaQuality = "excellent" | "good" | "average" | "avoid";

export interface MuhurtaTimeWindow {
  name: string;
  startTime: string;
  endTime: string;
  quality: MuhurtaQuality;
  description?: string;
}

export interface MuhurtaResult {
  id: string;
  date: string;
  dayOfWeek: string;
  tithi: string;
  nakshatra: string;
  yoga: string;
  quality: MuhurtaQuality;
  score: number;
  bestTimeWindow: string;
  reasons: string[];
  warnings?: string[];
}

export interface MuhurtaFiltersState {
  startDate: string;
  endDate: string;
  location: string;
  category: MuhurtaCategory;
  latitude?: number;
  longitude?: number;
}

export interface DailyMuhurta {
  date: string;
  sunrise?: string;
  sunset?: string;
  abhijitMuhurta: MuhurtaTimeWindow;
  brahmaMuhurta: MuhurtaTimeWindow;
  rahuKaal: MuhurtaTimeWindow;
  gulikaKaal: MuhurtaTimeWindow;
  yamagandam: MuhurtaTimeWindow;
  generalWindows: MuhurtaTimeWindow[];
}
