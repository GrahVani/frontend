"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarClock,
  ChevronDown,
  Clock,
  Globe,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Sun,
  Unlock,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type StepId = "genuine" | "bounded" | "specific" | "consent" | "harm" | "single" | "ordinary" | "actionable";
type ScenarioKey = "free" | "ex1" | "ex2";
type SystemKey = "kp" | "parashari" | "tajika";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const STEPS: { id: StepId; label: string }[] = [
  { id: "genuine", label: "Genuineness" },
  { id: "bounded", label: "Boundedness" },
  { id: "specific", label: "Specificity" },
  { id: "consent", label: "Consent" },
  { id: "harm", label: "Do-no-harm" },
  { id: "single", label: "Single-matter" },
  { id: "ordinary", label: "Ordinary investigation" },
  { id: "actionable", label: "Actionability" },
];

const VARA_LORDS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

interface City {
  label: string;
  lat: number;
  lng: number;
  baseOffset: number; // minutes east of UTC
}

const CITIES: City[] = [
  { label: "Bengaluru, India", lat: 12.9716, lng: 77.5946, baseOffset: 330 },
  { label: "Mumbai, India", lat: 19.0760, lng: 72.8777, baseOffset: 330 },
  { label: "Delhi, India", lat: 28.7041, lng: 77.1025, baseOffset: 330 },
  { label: "London, UK", lat: 51.5074, lng: -0.1278, baseOffset: 0 },
  { label: "New York, USA", lat: 40.7128, lng: -74.0060, baseOffset: -300 },
  { label: "Los Angeles, USA", lat: 34.0522, lng: -118.2437, baseOffset: -480 },
  { label: "Sydney, Australia", lat: -33.8688, lng: 151.2093, baseOffset: 600 },
  { label: "Tokyo, Japan", lat: 35.6762, lng: 139.6503, baseOffset: 540 },
  { label: "Cape Town, South Africa", lat: -33.9249, lng: 18.4241, baseOffset: 120 },
];

const SCENARIOS: Record<ScenarioKey, { label: string; dateTime: string; astroCity: number; querentCity: number; mode: "astrologer" | "querent"; screening: Record<StepId, boolean>; fixed: boolean; note: string }> = {
  free: {
    label: "Free-text practice",
    dateTime: "",
    astroCity: 0,
    querentCity: 4,
    mode: "astrologer",
    screening: {
      genuine: false, bounded: false, specific: false, consent: false, harm: false, single: false, ordinary: false, actionable: false,
    },
    fixed: false,
    note: "",
  },
  ex1: {
    label: "Example 1: Phone call (screening at 14:52)",
    dateTime: "2026-07-02T14:52:00",
    astroCity: 0,
    querentCity: 1,
    mode: "astrologer",
    screening: {
      genuine: true, bounded: true, specific: true, consent: true, harm: true, single: true, ordinary: true, actionable: true,
    },
    fixed: true,
    note: "The moment is fixed at screening-confirmation (14:52), not at call-start (14:41). The astrologer's own location is used.",
  },
  ex2: {
    label: "Example 2: Written message (read at 09:15 next day)",
    dateTime: "2026-07-03T09:15:00",
    astroCity: 3,
    querentCity: 4,
    mode: "astrologer",
    screening: {
      genuine: true, bounded: true, specific: true, consent: true, harm: true, single: true, ordinary: true, actionable: true,
    },
    fixed: true,
    note: "The moment is fixed when the astrologer reads and screens the message, not when it was sent at 23:03 the previous night.",
  },
};

function toDatetimeLocal(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
}

function parseDateTime(value: string): { year: number; month: number; day: number; hour: number; minute: number; second: number } | null {
  if (!value) return null;
  const [datePart, timePart] = value.split("T");
  if (!datePart || !timePart) return null;
  const [year, month, day] = datePart.split("-").map((n) => parseInt(n, 10));
  const [hour, minute, secondRaw] = timePart.split(":").map((n) => parseInt(n, 10));
  const second = Number.isNaN(secondRaw) ? 0 : secondRaw;
  if ([year, month, day, hour, minute].some((n) => Number.isNaN(n))) return null;
  return { year, month, day, hour, minute, second };
}

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60)).padStart(2, "0");
  const m = String(abs % 60).padStart(2, "0");
  return `UTC${sign}${h}:${m}`;
}

function formatTime(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = Math.floor(wrapped % 60);
  const s = Math.floor((wrapped % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}${s ? `:${String(s).padStart(2, "0")}` : ""}`;
}

function degToRad(d: number) {
  return (d * Math.PI) / 180;
}

function radToDeg(r: number) {
  return (r * 180) / Math.PI;
}

function sunriseMinutes(utcDate: Date, lat: number, lng: number, offsetMinutes: number): number | null {
  const jd = 2440587.5 + utcDate.getTime() / 86400000;
  const T = (jd - 2451545.0) / 36525;

  const L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(degToRad(M)) +
    (0.019993 - 0.000101 * T) * Math.sin(degToRad(2 * M)) +
    0.000289 * Math.sin(degToRad(3 * M));
  const trueLon = L0 + C;

  const obl =
    23 +
    26 / 60 +
    21.448 / 3600 -
    (46.815 / 3600) * T -
    (0.00059 / 3600) * T * T +
    (0.001813 / 3600) * T * T * T;

  const RA = radToDeg(Math.atan2(Math.cos(degToRad(obl)) * Math.sin(degToRad(trueLon)), Math.cos(degToRad(trueLon))));
  const decl = radToDeg(Math.asin(Math.sin(degToRad(obl)) * Math.sin(degToRad(trueLon))));

  let eqtime = 4 * (L0 - RA);
  while (eqtime > 180) eqtime -= 360;
  while (eqtime < -180) eqtime += 360;

  const latRad = degToRad(lat);
  const declRad = degToRad(decl);
  const cosHour =
    Math.cos(degToRad(90.833)) / (Math.cos(latRad) * Math.cos(declRad)) -
    Math.tan(latRad) * Math.tan(declRad);
  if (cosHour < -1 || cosHour > 1) return null; // polar day/night

  const ha = radToDeg(Math.acos(cosHour));
  const sunriseUtcMinutes = 720 - 4 * (lng + ha) - eqtime;
  return sunriseUtcMinutes + offsetMinutes;
}

function gregorianWeekday(year: number, month: number, day: number): number {
  // 0 = Sunday, per JS Date
  const js = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return js.getUTCDay();
}

export function PrashnaTimeRecorder() {
  const [scenario, setScenarioState] = useState<ScenarioKey>("free");
  const [screening, setScreening] = useState<Record<StepId, boolean>>(SCENARIOS.free.screening);
  const [dateTime, setDateTime] = useState<string>(toDatetimeLocal(new Date()));
  const [astroCity, setAstroCity] = useState<number>(SCENARIOS.free.astroCity);
  const [querentCity, setQuerentCity] = useState<number>(SCENARIOS.free.querentCity);
  const [mode, setMode] = useState<"astrologer" | "querent">("astrologer");
  const [isDst, setIsDst] = useState<boolean>(false);
  const [fixed, setFixed] = useState<boolean>(false);
  const [system, setSystem] = useState<SystemKey>("parashari");

  const selectScenario = (key: ScenarioKey) => {
    const s = SCENARIOS[key];
    setScenarioState(key);
    setScreening({ ...s.screening });
    setDateTime(key === "free" ? toDatetimeLocal(new Date()) : s.dateTime);
    setAstroCity(s.astroCity);
    setQuerentCity(s.querentCity);
    setMode(s.mode);
    setIsDst(false);
    setFixed(s.fixed);
  };

  const activeCity = mode === "astrologer" ? CITIES[astroCity] : CITIES[querentCity];
  const offsetMinutes = activeCity.baseOffset + (isDst ? (activeCity.baseOffset >= 0 ? 60 : -60) : 0);

  const parsed = useMemo(() => parseDateTime(dateTime), [dateTime]);

  const utcTimestamp = useMemo(() => {
    if (!parsed) return null;
    return Date.UTC(parsed.year, parsed.month - 1, parsed.day, parsed.hour, parsed.minute, parsed.second) - offsetMinutes * 60000;
  }, [parsed, offsetMinutes]);

  const sunrise = useMemo(() => {
    if (!parsed || utcTimestamp === null) return null;
    return sunriseMinutes(new Date(utcTimestamp), activeCity.lat, activeCity.lng, offsetMinutes);
  }, [parsed, utcTimestamp, activeCity.lat, activeCity.lng, offsetMinutes]);

  const varaInfo = useMemo(() => {
    if (!parsed) return null;
    const recordedMinutes = parsed.hour * 60 + parsed.minute + parsed.second / 60;
    const weekday = gregorianWeekday(parsed.year, parsed.month, parsed.day);
    const preSunrise = sunrise !== null && recordedMinutes < sunrise;
    const varaDay = preSunrise ? (weekday + 6) % 7 : weekday;
    return {
      weekday,
      varaDay,
      varaLord: VARA_LORDS[varaDay],
      preSunrise,
      recordedMinutes,
    };
  }, [parsed, sunrise]);

  const precision = useMemo(() => {
    if (!dateTime) return { level: "empty", label: "No moment entered", color: INK_MUTED } as const;
    const hasSeconds = dateTime.length > 16;
    if (hasSeconds) return { level: "high", label: "Seconds precision — cuspal risk low", color: GREEN } as const;
    return { level: "medium", label: "Minute precision — acceptable for most techniques", color: GOLD } as const;
  }, [dateTime]);

  const screeningComplete = STEPS.every((s) => screening[s.id]);
  const canFix = parsed !== null && screeningComplete && !fixed;

  const toggleScreening = (id: StepId) => {
    setScreening((prev) => ({ ...prev, [id]: !prev[id] }));
    setFixed(false);
  };

  const markAllScreening = (value: boolean) => {
    const next: Record<StepId, boolean> = {
      genuine: value, bounded: value, specific: value, consent: value,
      harm: value, single: value, ordinary: value, actionable: value,
    };
    setScreening(next);
    setFixed(false);
  };

  const fixMoment = () => {
    if (canFix) setFixed(true);
  };

  return (
    <div data-interactive="prashna-time-recorder" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Praśna time recorder</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Fix the moment only after screening is complete
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Record the precise instant a screened question is confirmed, at the casting location, in correct local civil time, then resolve sunrise and vāra.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative" }}>
              <select
                aria-label="Select scenario"
                value={scenario}
                onChange={(e) => selectScenario(e.target.value as ScenarioKey)}
                style={selectStyle}
              >
                {Object.entries(SCENARIOS).map(([key, s]) => (
                  <option key={key} value={key}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
            </div>
            <button
              type="button"
              onClick={() => {
                selectScenario("free");
                setSystem("parashari");
              }}
              style={buttonStyle(false, ACCENT)}
            >
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
            <ShieldCheck size={18} style={{ color: screeningComplete ? GREEN : GOLD }} aria-hidden="true" />
            <p style={{ margin: 0, color: screeningComplete ? GREEN : GOLD, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Screening gate</p>
          </div>
          <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
            The moment cannot be fixed until the question has cleared all eight steps from Lesson 15.1.3.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.45rem" }}>
            {STEPS.map((step) => (
              <label
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.45rem",
                  borderRadius: 6,
                  border: `1px solid ${screening[step.id] ? GREEN : HAIRLINE}`,
                  background: screening[step.id] ? `${GREEN}10` : SURFACE,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={screening[step.id]}
                  onChange={() => toggleScreening(step.id)}
                  style={{ accentColor: GREEN, cursor: "pointer" }}
                />
                <span style={{ fontWeight: 600, color: screening[step.id] ? GREEN : INK_PRIMARY }}>{step.label}</span>
              </label>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.45rem", marginTop: "0.65rem" }}>
            <button type="button" onClick={() => markAllScreening(true)} style={buttonStyle(false, GREEN)}>
              Mark all passed
            </button>
            <button type="button" onClick={() => markAllScreening(false)} style={buttonStyle(false, INK_MUTED)}>
              Clear
            </button>
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
            <Clock size={18} style={{ color: BLUE }} aria-hidden="true" />
            <p style={{ margin: 0, color: BLUE, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Moment entry</p>
          </div>
          <label htmlFor="moment-input" style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Date and time (local civil time)</label>
          <input
            id="moment-input"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => { setDateTime(e.target.value); setFixed(false); }}
            style={{ ...inputStyle, width: "100%", marginBottom: "0.65rem" }}
          />

          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Casting location</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.55rem" }}>
            <button type="button" aria-pressed={mode === "astrologer"} onClick={() => { setMode("astrologer"); setFixed(false); }} style={buttonStyle(mode === "astrologer", BLUE)}>
              <MapPin size={14} aria-hidden="true" />
              Astrologer
            </button>
            <button type="button" aria-pressed={mode === "querent"} onClick={() => { setMode("querent"); setFixed(false); }} style={buttonStyle(mode === "querent", PURPLE)}>
              <Globe size={14} aria-hidden="true" />
              Querent
            </button>
          </div>

          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>{mode === "astrologer" ? "Astrologer's city" : "Querent's city"}</label>
          <div style={{ position: "relative", marginBottom: "0.55rem" }}>
            <select
              value={mode === "astrologer" ? astroCity : querentCity}
              onChange={(e) => {
                const idx = parseInt(e.target.value, 10);
                if (mode === "astrologer") setAstroCity(idx);
                else setQuerentCity(idx);
                setFixed(false);
              }}
              style={selectStyle}
            >
              {CITIES.map((c, i) => (
                <option key={i} value={i}>{c.label}</option>
              ))}
            </select>
            <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.55rem" }}>
            <input
              id="dst-check"
              type="checkbox"
              checked={isDst}
              onChange={(e) => { setIsDst(e.target.checked); setFixed(false); }}
              style={{ accentColor: GOLD, cursor: "pointer" }}
            />
            <label htmlFor="dst-check" style={{ fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
              Daylight-saving time is in effect
            </label>
          </div>

          <button
            type="button"
            onClick={fixMoment}
            disabled={!canFix}
            style={{ ...buttonStyle(canFix, GREEN), width: "100%", justifyContent: "center" }}
          >
            {screeningComplete ? <Unlock size={15} aria-hidden="true" /> : <ShieldCheck size={15} aria-hidden="true" />}
            {screeningComplete ? "Fix the praśna moment" : "Complete screening first"}
          </button>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Moment-fixing decision flow</p>
        <MomentFlowSvg />
      </section>

      {fixed && parsed && varaInfo && (
        <section style={{ ...cardStyle, borderColor: `${GREEN}66`, background: `${GREEN}08` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BadgeCheck size={20} style={{ color: GREEN }} aria-hidden="true" />
                <p style={{ margin: 0, color: GREEN, fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Fixed praśna moment</p>
              </div>
              <h3 style={{ margin: "0.35rem 0 0", color: GREEN, fontSize: "1.25rem", fontWeight: 600 }}>
                {parsed.year}-{String(parsed.month).padStart(2, "0")}-{String(parsed.day).padStart(2, "0")} {" "}
                {String(parsed.hour).padStart(2, "0")}:{String(parsed.minute).padStart(2, "0")}:{String(parsed.second).padStart(2, "0")}
              </h3>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
                {activeCity.label} · {activeCity.lat.toFixed(2)}°, {activeCity.lng.toFixed(2)}° · {formatOffset(offsetMinutes)} {isDst ? "(DST applied)" : ""}
              </p>
            </div>
            <span style={{ ...responseBadgeStyle, background: `${precision.color}18`, color: precision.color, borderColor: precision.color }}>{precision.label}</span>
          </div>

          <div style={{ ...workbenchTwoColumnStyle, marginTop: "0.85rem" }}>
            <div style={{ ...cardStyle, background: SURFACE }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.45rem" }}>
                <Sun size={18} style={{ color: GOLD }} aria-hidden="true" />
                <span style={{ color: GOLD, fontWeight: 700, fontSize: "0.85rem" }}>Sunrise & vāra</span>
              </div>
              {sunrise !== null ? (
                <>
                  <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.95rem" }}>
                    Local sunrise: <strong style={{ fontWeight: 600 }}>{formatTime(sunrise)}</strong>
                  </p>
                  <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "0.95rem" }}>
                    Running vāra: <strong style={{ fontWeight: 600, color: GOLD }}>{varaInfo.varaLord}</strong>
                    {varaInfo.preSunrise && (
                      <span style={{ color: VERMILION, fontSize: "0.85rem" }}> — pre-sunrise; previous day&apos;s lord applies</span>
                    )}
                  </p>
                  {varaInfo.preSunrise && (
                    <div style={{ marginTop: "0.55rem", padding: "0.5rem", borderRadius: 6, background: `${VERMILION}12`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.85rem" }}>
                      <AlertTriangle size={15} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
                      The recorded time is before local sunrise. The vāra resolves to the previous day.
                    </div>
                  )}
                </>
              ) : (
                <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.9rem" }}>Sunrise cannot be computed for this latitude on this date (polar day/night).</p>
              )}
            </div>

            <div style={{ ...cardStyle, background: SURFACE }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.45rem" }}>
                <CalendarClock size={18} style={{ color: BLUE }} aria-hidden="true" />
                <span style={{ color: BLUE, fontWeight: 700, fontSize: "0.85rem" }}>Time discipline</span>
              </div>
              <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.95rem" }}>
                Calendar weekday: <strong style={{ fontWeight: 600 }}>{VARA_LORDS[varaInfo.weekday]}</strong>
              </p>
              <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "0.95rem" }}>
                Applied offset: <strong style={{ fontWeight: 600 }}>{formatOffset(offsetMinutes)}</strong>
              </p>
              {isDst && (
                <p style={{ margin: "0.35rem 0 0", color: GOLD, fontSize: "0.85rem" }}>
                  DST flag is on. Verify that DST was actually in force on this date at this location.
                </p>
              )}
            </div>
          </div>

          {scenario !== "free" && SCENARIOS[scenario].note && (
            <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 6, background: `${ACCENT}10`, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.55 }}>
              <strong style={{ color: ACCENT, fontWeight: 700 }}>Teaching note:</strong> {SCENARIOS[scenario].note}
            </div>
          )}
        </section>
      )}

      {fixed && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Praśna system readiness</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", margin: "0.55rem 0" }}>
            <button type="button" aria-pressed={system === "parashari"} onClick={() => setSystem("parashari")} style={buttonStyle(system === "parashari", BLUE)}>
              Parāśarī
            </button>
            <button type="button" aria-pressed={system === "kp"} onClick={() => setSystem("kp")} style={buttonStyle(system === "kp", PURPLE)}>
              KP
            </button>
            <button type="button" aria-pressed={system === "tajika"} onClick={() => setSystem("tajika")} style={buttonStyle(system === "tajika", GOLD)}>
              Tājika
            </button>
          </div>
          {system === "kp" && (
            <div style={{ padding: "0.65rem", borderRadius: 6, background: `${PURPLE}10`, border: `1px solid ${PURPLE}` }}>
              <label htmlFor="kp-number" style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Querent number (preview only)</label>
              <input id="kp-number" type="number" min={1} max={249} defaultValue={1} disabled style={{ ...inputStyle, width: 120, opacity: 0.7 }} />
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>The 1–249 number is entered here in Chapter 2&apos;s own KP-horary tools.</p>
            </div>
          )}
          {system === "tajika" && (
            <div style={{ padding: "0.65rem", borderRadius: 6, background: `${GOLD}10`, border: `1px solid ${GOLD}` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem" }}>
                Tājika readiness: exact planetary longitudes at the fixed moment are used for orb-based aspect judgement. Preview only here.
              </p>
            </div>
          )}
          {system === "parashari" && (
            <div style={{ padding: "0.65rem", borderRadius: 6, background: `${BLUE}10`, border: `1px solid ${BLUE}` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem" }}>
                Parāśarī readiness: house-lord placement from the fixed Ascendant is the decisive layer. No extra input is required at this stage.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function MomentFlowSvg() {
  return (
    <svg viewBox="0 0 720 110" role="img" aria-label="Screen first, then fix moment: raw question to screening gate, then moment entry, then sunrise and vāra check" style={{ width: "100%", maxHeight: 180, marginTop: "0.5rem", display: "block" }}>
      <rect x="10" y="10" width="700" height="90" rx="8" fill={`${ACCENT}08`} stroke={HAIRLINE} />

      <rect x="30" y="32" width="120" height="46" rx="6" fill={SURFACE} stroke={INK_MUTED} />
      <text x="90" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Raw question</text>
      <text x="90" y="68" textAnchor="middle" fill={INK_MUTED} fontSize="10">client speaks</text>

      <line x1="150" y1="55" x2="190" y2="55" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="190,55 182,50 182,60" fill={HAIRLINE} />

      <rect x="195" y="32" width="130" height="46" rx="6" fill={`${GOLD}10`} stroke={GOLD} />
      <text x="260" y="52" textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={600}>Screening gate</text>
      <text x="260" y="68" textAnchor="middle" fill={INK_MUTED} fontSize="10">8 steps</text>

      <path d="M 260 78 C 260 95, 330 95, 330 78" fill="none" stroke={VERMILION} strokeWidth="2" />
      <text x="295" y="100" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight={600}>failed → revisit</text>

      <line x1="325" y1="55" x2="365" y2="55" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="365,55 357,50 357,60" fill={HAIRLINE} />

      <rect x="370" y="32" width="130" height="46" rx="6" fill={`${GREEN}10`} stroke={GREEN} />
      <text x="435" y="52" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>Fix moment</text>
      <text x="435" y="68" textAnchor="middle" fill={INK_MUTED} fontSize="10">time + place</text>

      <line x1="500" y1="55" x2="540" y2="55" stroke={HAIRLINE} strokeWidth="2" />
      <polygon points="540,55 532,50 532,60" fill={HAIRLINE} />

      <rect x="545" y="32" width="145" height="46" rx="6" fill={`${BLUE}10`} stroke={BLUE} />
      <text x="617" y="52" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>Sunrise &amp; vāra</text>
      <text x="617" y="68" textAnchor="middle" fill={INK_MUTED} fontSize="10">cast when clear</text>
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 6,
  padding: "0.55rem",
  background: "#FFFBF2",
  color: INK_PRIMARY,
  fontSize: "0.9rem",
  fontFamily: "inherit",
};

const selectStyle: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 6,
  background: SURFACE,
  color: INK_PRIMARY,
  padding: "0.55rem 2rem 0.55rem 0.75rem",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const responseBadgeStyle: CSSProperties = {
  display: "inline-block",
  padding: "0.25rem 0.55rem",
  borderRadius: 999,
  border: `1px solid`,
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};
