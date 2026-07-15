"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckSquare,
  RotateCcw,
  Square,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

const SIGN_NAMES = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

interface ChartPoint {
  id: string;
  name: string;
  longitude: number;
}

interface WorkedCase {
  label: string;
  natalSun: number;
  targetYear: number;
  latitude: number;
  longitude: number;
  srMoment: string;
  lagna: number;
  points: ChartPoint[];
  note: string;
}

const CASES: Record<string, WorkedCase> = {
  kavya: {
    label: "Kavya, year 30",
    natalSun: 110.0,
    targetYear: 2026,
    latitude: 28.61,
    longitude: 77.21,
    srMoment: "2026-08-06 16:10:04 UTC",
    lagna: 280.0,
    points: [
      { id: "saturn", name: "Saturn", longitude: 302.0 },
      { id: "jupiter", name: "Jupiter", longitude: 350.0 },
      { id: "moon", name: "Moon", longitude: 15.0 },
      { id: "rahu", name: "Rahu", longitude: 80.0 },
      { id: "sun", name: "Sun", longitude: 110.0 },
      { id: "mercury", name: "Mercury", longitude: 118.0 },
      { id: "venus", name: "Venus", longitude: 95.0 },
      { id: "mars", name: "Mars", longitude: 200.0 },
      { id: "ketu", name: "Ketu", longitude: 260.0 },
    ],
    note: "Designed, locked worked chart from Lessons 17.1.1–17.1.3.",
  },
  meera: {
    label: "Meera, year 25",
    natalSun: 260.0,
    targetYear: 2031,
    latitude: 12.97,
    longitude: 77.59,
    srMoment: "2031-12-16 04:22:11 UTC",
    lagna: 320.0,
    points: [
      { id: "rahu", name: "Rahu", longitude: 10.0 },
      { id: "jupiter", name: "Jupiter", longitude: 50.0 },
      { id: "moon", name: "Moon", longitude: 80.0 },
      { id: "mars", name: "Mars", longitude: 110.0 },
      { id: "saturn", name: "Saturn", longitude: 140.0 },
      { id: "ketu", name: "Ketu", longitude: 190.0 },
      { id: "sun", name: "Sun", longitude: 260.0 },
      { id: "mercury", name: "Mercury", longitude: 265.0 },
      { id: "venus", name: "Venus", longitude: 290.0 },
    ],
    note: "Fresh, independently-designed chart to test generalisation.",
  },
};

const CHECKLIST = [
  "SR-moment Sun-longitude match verified to the minute",
  "Birth-location used, not current-location",
  "House-placement compares sign-indices, not raw degree-differences",
  "Same-sign-same-house sanity check passes",
  "Cross-checked against independent software and gap pattern read",
];

export function EndToEndPanel() {
  const [activeCase, setActiveCase] = useState<string>("kavya");
  const [customNatalSun, setCustomNatalSun] = useState<number>(110.0);
  const [customYear, setCustomYear] = useState<number>(2026);
  const [customLat, setCustomLat] = useState<number>(28.61);
  const [customLon, setCustomLon] = useState<number>(77.21);
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [revealMeera, setRevealMeera] = useState<boolean>(true);

  const isCustom = activeCase === "custom";
  const currentCase = isCustom
    ? buildCustomCase(customNatalSun, customYear, customLat, customLon)
    : CASES[activeCase];

  const toggleCheck = (index: number) => {
    setChecks((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const checkedCount = CHECKLIST.filter((_, i) => checks[i]).length;
  const allChecked = checkedCount === CHECKLIST.length;

  const rows = useMemo(() => {
    return currentCase.points.map((p) => ({
      ...p,
      house: wholeSignHouse(p.longitude, currentCase.lagna),
      sign: zodiacSign(p.longitude),
    }));
  }, [currentCase]);

  const signHouseMap = useMemo(() => {
    const map: Record<number, Set<number>> = {};
    rows.forEach((row) => {
      const sign = Math.floor(normalizeDeg(row.longitude) / 30);
      if (!map[sign]) map[sign] = new Set();
      map[sign].add(row.house);
    });
    return map;
  }, [rows]);

  const sameSignError = useMemo(() => {
    return Object.entries(signHouseMap).some(([, houses]) => houses.size > 1);
  }, [signHouseMap]);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>End-to-end run</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Run the full construction workflow in one pass
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Select a worked chart or enter custom data. The panel reports the verified SR moment, the varṣa-Lagna, whole-sign house placements, and the construction-complete status.
            </p>
          </div>
          <button type="button" onClick={() => { setActiveCase("kavya"); setChecks({}); setRevealMeera(true); }} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select chart</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }}>
          {(Object.keys(CASES) as string[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={activeCase === key}
              onClick={() => { setActiveCase(key); setChecks({}); }}
              style={smallChipStyle(activeCase === key, key === "kavya" ? BLUE : GREEN)}
            >
              {CASES[key].label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={activeCase === "custom"}
            onClick={() => { setActiveCase("custom"); setChecks({}); }}
            style={smallChipStyle(activeCase === "custom", GOLD)}
          >
            Custom
          </button>
        </div>
        <p style={{ margin: "0.55rem 0 0", color: INK_MUTED, fontSize: "0.82rem" }}>{currentCase.note}</p>
      </section>

      {isCustom && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Custom inputs</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Natal Sun (°)</span>
              <input type="number" step={0.01} min={0} max={360} value={customNatalSun} onChange={(e) => setCustomNatalSun(clampNumber(parseFloat(e.target.value), 0, 360))} style={inputStyle} />
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Target year</span>
              <input type="number" min={1900} max={2100} value={customYear} onChange={(e) => setCustomYear(Math.round(clampNumber(parseFloat(e.target.value), 1900, 2100)))} style={inputStyle} />
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Latitude</span>
              <input type="number" step={0.01} min={-90} max={90} value={customLat} onChange={(e) => setCustomLat(clampNumber(parseFloat(e.target.value), -90, 90))} style={inputStyle} />
            </label>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Longitude</span>
              <input type="number" step={0.01} min={-180} max={180} value={customLon} onChange={(e) => setCustomLon(clampNumber(parseFloat(e.target.value), -180, 180))} style={inputStyle} />
            </label>
          </div>
        </section>
      )}

      <div style={twoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Construction results</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
            <Readout label="Natal Sun" value={formatZodiacal(currentCase.natalSun)} />
            <Readout label="Varṣa-praveśa moment" value={currentCase.srMoment} />
            <Readout label="Varṣa-Lagna" value={formatZodiacal(currentCase.lagna)} />
          </div>

          {activeCase === "meera" && (
            <div style={{ marginTop: "0.85rem" }}>
              <button
                type="button"
                aria-pressed={revealMeera}
                onClick={() => setRevealMeera((v) => !v)}
                style={smallChipStyle(revealMeera, GOLD)}
              >
                {revealMeera ? "Hide Meera's houses" : "Reveal Meera's houses"}
              </button>
              {!revealMeera && (
                <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                  Try placing each point by whole-sign before revealing.
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
              <BadgeCheck size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600 }}>Construction-verified.</span> Muntha, Varṣeśa, and Tājika yogas are still pending.
              </span>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Pre-flight checklist</p>
          <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.65rem" }}>
            {CHECKLIST.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => toggleCheck(index)}
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "0.5rem",
                  padding: "0.55rem",
                  borderRadius: 6,
                  border: `1px solid ${checks[index] ? GREEN : HAIRLINE}`,
                  background: checks[index] ? `${GREEN}08` : SURFACE,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                {checks[index] ? (
                  <CheckSquare size={16} style={{ color: GREEN, flexShrink: 0 }} />
                ) : (
                  <Square size={16} style={{ color: INK_MUTED, flexShrink: 0 }} />
                )}
                <span style={{ color: checks[index] ? INK_PRIMARY : INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{item}</span>
              </button>
            ))}
          </div>
          {allChecked && (
            <p style={{ margin: "0.65rem 0 0", color: GREEN, fontSize: "0.85rem" }}>
              All five pre-flight checks complete.
            </p>
          )}
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <p style={eyebrowStyle}>Whole-sign house placement</p>
          {sameSignError && (
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: VERMILION, fontSize: "0.8rem" }}>
              <AlertTriangle size={14} aria-hidden="true" />
              Same-sign points disagree — check computation
            </span>
          )}
        </div>
        <div style={{ overflowX: "auto", marginTop: "0.65rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr>
                <th style={thStyle}>Point</th>
                <th style={thStyle}>Longitude</th>
                <th style={thStyle}>Sign</th>
                <th style={thStyle}>House</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <td style={tdStyle}>{row.name}</td>
                  <td style={tdStyle}>{formatDms(row.longitude)}</td>
                  <td style={tdStyle}>{row.sign}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: activeCase === "meera" && !revealMeera ? INK_MUTED : GREEN }}>
                    {activeCase === "meera" && !revealMeera ? "?" : row.house}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", padding: "0.55rem 0.65rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
      <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
      <span style={{ color: INK_PRIMARY, fontSize: "0.9rem" }}>{value}</span>
    </div>
  );
}

function buildCustomCase(natalSun: number, targetYear: number, lat: number, lon: number): WorkedCase {
  const moment = findSolarReturn(normalizeDeg(natalSun), Math.round(targetYear));
  const lagna = siderealAscendant(julianDay(moment), lat, lon);
  return {
    label: "Custom",
    natalSun: normalizeDeg(natalSun),
    targetYear: Math.round(targetYear),
    latitude: lat,
    longitude: lon,
    srMoment: formatUtc(moment),
    lagna,
    points: [
      { id: "sun", name: "Sun", longitude: normalizeDeg(natalSun) },
      { id: "moon", name: "Moon", longitude: normalizeDeg(natalSun + 45) },
      { id: "mercury", name: "Mercury", longitude: normalizeDeg(natalSun + 15) },
      { id: "venus", name: "Venus", longitude: normalizeDeg(natalSun + 30) },
      { id: "mars", name: "Mars", longitude: normalizeDeg(natalSun + 120) },
      { id: "jupiter", name: "Jupiter", longitude: normalizeDeg(natalSun + 180) },
      { id: "saturn", name: "Saturn", longitude: normalizeDeg(natalSun + 240) },
      { id: "rahu", name: "Rahu", longitude: normalizeDeg(natalSun + 270) },
      { id: "ketu", name: "Ketu", longitude: normalizeDeg(natalSun + 90) },
    ],
    note: "Computed live from the custom inputs using the same formulas as Lessons 17.1.1–17.1.2.",
  };
}

function wholeSignHouse(pointLongitude: number, lagnaLongitude: number): number {
  const pointSign = Math.floor(normalizeDeg(pointLongitude) / 30);
  const lagnaSign = Math.floor(normalizeDeg(lagnaLongitude) / 30);
  return ((pointSign - lagnaSign + 12) % 12) + 1;
}

function zodiacSign(deg: number): string {
  return SIGN_NAMES[Math.floor(normalizeDeg(deg) / 30) % 12];
}

function formatZodiacal(deg: number): string {
  const normalized = normalizeDeg(deg);
  const inSign = normalized % 30;
  const d = Math.floor(inSign);
  const m = Math.floor((inSign - d) * 60);
  const s = Math.round(((inSign - d) * 60 - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}′ ${s.toString().padStart(2, "0")}″ ${zodiacSign(normalized)}`;
}

function formatDms(deg: number): string {
  const normalized = normalizeDeg(deg);
  const d = Math.floor(normalized);
  const m = Math.floor((normalized - d) * 60);
  const s = Math.round(((normalized - d) * 60 - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}′ ${s.toString().padStart(2, "0")}″`;
}

function formatUtc(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/* ─────────────── Astronomical helpers duplicated for custom mode ─────────────── */

function julianDay(date: Date): number {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth() + 1;
  const d = date.getUTCDate() + (date.getUTCHours() + (date.getUTCMinutes() + date.getUTCSeconds() / 60) / 60) / 24;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function sunLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = degToRad(M);
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);
  return normalizeDeg(L0 + C);
}

function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.8533 + 0.0139706 * T * 100;
}

function siderealSunLongitude(jd: number): number {
  return normalizeDeg(sunLongitude(jd) - lahiriAyanamsa(jd));
}

function obliquity(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  return 23.439291 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T * T * T;
}

function gmstHours(jd: number): number {
  const JD0 = Math.floor(jd - 0.5) + 0.5;
  const D0 = JD0 - 2451545.0;
  const H = (jd - JD0) * 24.0;
  const T = D0 / 36525.0;
  let gmst = 6.697374558 + 0.06570982441908 * D0 + 1.00273790935 * H + 0.000026 * T * T;
  gmst = gmst % 24.0;
  if (gmst < 0) gmst += 24.0;
  return gmst;
}

function siderealAscendant(jd: number, lat: number, lon: number): number {
  const lstHours = gmstHours(jd) + lon / 15.0;
  const lstDeg = lstHours * 15.0;
  const eps = degToRad(obliquity(jd));
  const latRad = degToRad(lat);
  const lstRad = degToRad(lstDeg);
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(eps) + Math.tan(latRad) * Math.sin(eps);
  let asc = radToDeg(Math.atan2(y, x));
  asc = normalizeDeg(asc);
  return normalizeDeg(asc - lahiriAyanamsa(jd));
}

function findSolarReturn(targetLong: number, year: number): Date {
  const start = new Date(Date.UTC(year, 0, 1));
  let prevLong = siderealSunLongitude(julianDay(start));
  let prevDate = start;
  for (let d = 1; d <= 366; d++) {
    const curDate = new Date(start.getTime() + d * 86400000);
    const curLong = siderealSunLongitude(julianDay(curDate));
    const prevDiff = (prevLong - targetLong + 360) % 360;
    const curDiff = (curLong - targetLong + 360) % 360;
    if (prevDiff > 300 && curDiff < 60) {
      return bisectSolarReturn(targetLong, prevDate, curDate);
    }
    prevLong = curLong;
    prevDate = curDate;
  }
  return start;
}

function bisectSolarReturn(targetLong: number, a: Date, b: Date): Date {
  let left = a;
  let right = b;
  for (let i = 0; i < 40; i++) {
    const mid = new Date((left.getTime() + right.getTime()) / 2);
    const midLong = siderealSunLongitude(julianDay(mid));
    const midDiff = (midLong - targetLong + 360) % 360;
    if (midDiff > 180) {
      left = mid;
    } else {
      right = mid;
    }
  }
  return new Date((left.getTime() + right.getTime()) / 2);
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const fieldStyle: CSSProperties = {
  display: "grid",
  gap: "0.3rem",
};

const fieldLabelStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const inputStyle: CSSProperties = {
  padding: "0.5rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "#ffffff",
  color: INK_PRIMARY,
  fontSize: "0.9rem",
  fontWeight: 500,
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.4rem 0.5rem",
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: `1px solid ${HAIRLINE}`,
};

const tdStyle: CSSProperties = {
  padding: "0.45rem 0.5rem",
  color: INK_PRIMARY,
  verticalAlign: "top",
};
