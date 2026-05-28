"use client";

import { useState, useMemo } from "react";
import { Sunrise, AlertTriangle, CheckCircle2, BookOpen, RotateCcw } from "lucide-react";

const INDIGO = "#4A6FA5";
const VERMILION = "#A23A1E";
const JADE = "#2F8C5A";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";

function toDMS(dec: number): string {
  const d = Math.floor(Math.abs(dec));
  const mFull = (Math.abs(dec) - d) * 60;
  const m = Math.floor(mFull);
  const s = Math.round((mFull - m) * 60);
  return `${dec < 0 ? "−" : ""}${d}°${m.toString().padStart(2, "0")}′${s.toString().padStart(2, "0")}″`;
}

function fmtTime(decimalHours: number): string {
  const h = Math.floor(decimalHours);
  const m = Math.floor((decimalHours - h) * 60);
  const s = Math.round(((decimalHours - h) * 60 - m) * 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function dayOfYear(y: number, m: number, d: number): number {
  const days = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) days[2] = 29;
  let n = d;
  for (let i = 1; i < m; i++) n += days[i];
  return n;
}

function computeSunrise(lat: number, lon: number, tz: number, year: number, month: number, day: number) {
  const N = dayOfYear(year, month, day);
  const delta = -23.44 * Math.cos(((N + 10) * 360 * Math.PI) / (365 * 180));
  const phiRad = (lat * Math.PI) / 180;
  const deltaRad = (delta * Math.PI) / 180;
  const cosH = -Math.tan(phiRad) * Math.tan(deltaRad);

  // Edge case: polar day / polar night
  if (cosH > 1 || cosH < -1) {
    return { edgeCase: cosH > 1 ? ("polar-night" as const) : ("polar-day" as const), steps: null, sunrise: null };
  }

  const H = (Math.acos(cosH) * 180) / Math.PI;
  const Hhours = H / 15;
  const apparentSunrise = 12 - Hhours;
  const longitudeCorrection = lon / 15;
  const localMeanTime = apparentSunrise - longitudeCorrection;
  const civilTime = localMeanTime + tz;

  const steps = [
    { label: "Day of year (N)", value: N.toString() },
    { label: "Solar declination (δ)", value: `${delta.toFixed(2)}°` },
    { label: "Hour angle (H)", value: `${H.toFixed(2)}° = ${Hhours.toFixed(3)}h` },
    { label: "Local apparent sunrise", value: fmtTime(apparentSunrise) },
    { label: "Longitude correction", value: `${lon.toFixed(2)}° / 15 = ${longitudeCorrection.toFixed(3)}h` },
    { label: "Local mean time", value: fmtTime(localMeanTime) },
    { label: "Civil time (timezone adjusted)", value: fmtTime(civilTime) },
  ];

  return { edgeCase: null, steps, sunrise: fmtTime(civilTime) };
}

const PRESETS = [
  { label: "Mumbai — Equinox", lat: 19.076, lon: 72.877, tz: 5.5, year: 2026, month: 3, day: 21, note: "Expected: ~06:39 IST" },
  { label: "Delhi — June Solstice", lat: 28.613, lon: 77.209, tz: 5.5, year: 2026, month: 6, day: 21, note: "Expected: ~05:26 IST" },
  { label: "Singapore — Dec Solstice", lat: 1.352, lon: 103.819, tz: 8, year: 2026, month: 12, day: 21, note: "Expected: ~07:07 SGT" },
  { label: "Reykjavík — Polar check", lat: 64.146, lon: -21.942, tz: 0, year: 2026, month: 6, day: 21, note: "Near polar day edge case" },
];

export function SunriseAtAnyLatitude() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(3);
  const [day, setDay] = useState(21);
  const [lat, setLat] = useState(19.076);
  const [lon, setLon] = useState(72.877);
  const [tz, setTz] = useState(5.5);
  const [computed, setComputed] = useState(false);

  const result = useMemo(() => {
    if (!computed) return null;
    return computeSunrise(lat, lon, tz, year, month, day);
  }, [computed, lat, lon, tz, year, month, day]);

  function applyPreset(p: typeof PRESETS[0]) {
    setYear(p.year);
    setMonth(p.month);
    setDay(p.day);
    setLat(p.lat);
    setLon(p.lon);
    setTz(p.tz);
    setComputed(true);
  }

  return (
    <div className="w-full" style={{ color: INK_PRIMARY }}>
      {/* Presets */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "var(--gl-surface-2)", color: INK_SECONDARY }}
          >
            <BookOpen size={12} className="inline mr-1" />
            {p.label}
          </button>
        ))}
      </div>

      {/* Input form */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs mb-1" style={{ color: INK_MUTED }}>Year</label>
          <input type="number" value={year} onChange={(e) => { setYear(+e.target.value); setComputed(false); }} className="w-full p-2 rounded text-sm border" style={{ backgroundColor: "var(--gl-surface-2)", borderColor: INK_MUTED, color: INK_PRIMARY }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: INK_MUTED }}>Month</label>
          <input type="number" min={1} max={12} value={month} onChange={(e) => { setMonth(+e.target.value); setComputed(false); }} className="w-full p-2 rounded text-sm border" style={{ backgroundColor: "var(--gl-surface-2)", borderColor: INK_MUTED, color: INK_PRIMARY }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: INK_MUTED }}>Day</label>
          <input type="number" min={1} max={31} value={day} onChange={(e) => { setDay(+e.target.value); setComputed(false); }} className="w-full p-2 rounded text-sm border" style={{ backgroundColor: "var(--gl-surface-2)", borderColor: INK_MUTED, color: INK_PRIMARY }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: INK_MUTED }}>Latitude</label>
          <input type="number" step={0.001} value={lat} onChange={(e) => { setLat(+e.target.value); setComputed(false); }} className="w-full p-2 rounded text-sm border" style={{ backgroundColor: "var(--gl-surface-2)", borderColor: INK_MUTED, color: INK_PRIMARY }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: INK_MUTED }}>Longitude</label>
          <input type="number" step={0.001} value={lon} onChange={(e) => { setLon(+e.target.value); setComputed(false); }} className="w-full p-2 rounded text-sm border" style={{ backgroundColor: "var(--gl-surface-2)", borderColor: INK_MUTED, color: INK_PRIMARY }} />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: INK_MUTED }}>Timezone (UTC+)</label>
          <input type="number" step={0.5} value={tz} onChange={(e) => { setTz(+e.target.value); setComputed(false); }} className="w-full p-2 rounded text-sm border" style={{ backgroundColor: "var(--gl-surface-2)", borderColor: INK_MUTED, color: INK_PRIMARY }} />
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setComputed(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: INDIGO }}
        >
          <Sunrise size={14} />
          Compute sunrise
        </button>
        <button
          onClick={() => { setYear(2026); setMonth(3); setDay(21); setLat(19.076); setLon(72.877); setTz(5.5); setComputed(false); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm"
          style={{ backgroundColor: "var(--gl-surface-2)", color: INK_SECONDARY }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          {result.edgeCase ? (
            <div className="p-4 rounded-lg" style={{ backgroundColor: `${VERMILION}10`, borderLeft: `4px solid ${VERMILION}` }}>
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={16} style={{ color: VERMILION }} />
                <span className="font-semibold text-sm">
                  {result.edgeCase === "polar-day" ? "Polar Day" : "Polar Night"}
                </span>
              </div>
              <p className="text-sm" style={{ color: INK_SECONDARY }}>
                {result.edgeCase === "polar-day"
                  ? "The Sun does not set at this latitude on this date. There is no sunrise to compute."
                  : "The Sun does not rise at this latitude on this date. There is no sunrise to compute."}
              </p>
            </div>
          ) : (
            <>
              <div className="p-4 rounded-lg text-center" style={{ backgroundColor: `${JADE}10`, border: `1px solid ${JADE}40` }}>
                <Sunrise size={24} style={{ color: JADE }} className="mx-auto mb-1" />
                <div className="text-2xl font-bold" style={{ color: JADE }}>{result.sunrise}</div>
                <div className="text-xs" style={{ color: INK_SECONDARY }}>
                  Sunrise at {toDMS(lat)} lat, {toDMS(lon)} lon, UTC{tz >= 0 ? "+" : ""}{tz}
                </div>
              </div>

              <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--gl-surface-1)" }}>
                <div className="text-sm font-semibold mb-2">7-Step Computation</div>
                <div className="space-y-2">
                  {result.steps!.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: INDIGO }}>
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-xs" style={{ color: INK_MUTED }}>{s.label}</div>
                        <div className="text-sm font-medium">{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: "var(--gl-surface-1)" }}>
                <CheckCircle2 size={14} style={{ color: INK_MUTED }} className="mt-0.5 flex-shrink-0" />
                <p className="text-xs" style={{ color: INK_MUTED }}>
                  This is a simplified geometric computation. Astro Engine precise output would be ~3–4 minutes earlier due to atmospheric refraction (50 arc-minutes ≈ 3–4 min). Refraction is deferred to Module 23 (Muhūrta).
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
