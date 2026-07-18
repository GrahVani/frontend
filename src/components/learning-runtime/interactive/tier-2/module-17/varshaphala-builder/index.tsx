"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  Clock,
  Compass,
  Gauge,
  RotateCcw,
  Sun,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";
import { useLessonSlug } from "@/components/learning-runtime/interactive/tier-1/module-4/rashi-attribute-wheel";
import { HousePlacementPanel } from "./house-placement-panel";
import { CrossCheckPanel } from "./cross-check-panel";
import { EndToEndPanel } from "./end-to-end-panel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

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

const NUDGES = [-15, -5, -1, 0, 1, 5, 15] as const;

type PanelKey = "solar-return" | "house-placement" | "cross-check" | "end-to-end";

const PANEL_FOR_SLUG: Record<string, PanelKey> = {
  "the-varsha-pravesha-moment-and-sub-minute-precision-requirement": "solar-return",
  "annual-lagna-identification-and-house-cusps": "house-placement",
  "cross-checking-annual-chart-output-against-software": "cross-check",
  "worked-example-annual-chart-construction-end-to-end": "end-to-end",
};

const PANEL_HEADING: Record<PanelKey, { title: string; subtitle: string }> = {
  "solar-return": {
    title: "Locate the solar-return moment, then test its precision",
    subtitle: "The varṣa-praveśa moment is the instant the transiting Sun returns to the natal Sun's sidereal longitude. A few minutes of timing error barely moves the Sun, but it can shift — or even flip — the varṣa-Lagna.",
  },
  "house-placement": {
    title: "Place the varṣa-Lagna and every planet into whole-sign houses",
    subtitle: "Count by sign index, not by raw degree difference. The Lagna's exact degree is its position within its sign; house 1 is the whole sign that contains it.",
  },
  "cross-check": {
    title: "Cross-check by-hand output against software",
    subtitle: "Use a tolerance and a discrepancy-pattern table to decide whether a difference is acceptable, a timing error, an ayanāṁśa mismatch, or a house-system trap.",
  },
  "end-to-end": {
    title: "Run the full construction workflow end-to-end",
    subtitle: "Chain the solar-return finder, house-placer, and cross-check on Kavya, Meera, or your own chart. Construction-complete is not yet interpretation-complete.",
  },
};

interface VarshaphalaBuilderProps {
  initialPanel?: PanelKey;
  lockToInitialPanel?: boolean;
}

export function VarshaphalaBuilder({ initialPanel: initialPanelProp, lockToInitialPanel = false }: VarshaphalaBuilderProps = {}) {
  const lessonSlug = useLessonSlug();
  const initialPanel = initialPanelProp ?? PANEL_FOR_SLUG[lessonSlug] ?? "solar-return";

  const [natalSun, setNatalSun] = useState<number>(110.0);
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [latitude, setLatitude] = useState<number>(28.61);
  const [longitude, setLongitude] = useState<number>(77.21);
  const [offsetMin, setOffsetMin] = useState<number>(0);
  const [activePanel, setActivePanel] = useState<PanelKey>(initialPanel);
  const showHeaderReset = !lockToInitialPanel || activePanel === "solar-return";

  const baseMoment = useMemo(() => {
    try {
      return findSolarReturn(normalizeDeg(natalSun), Math.round(targetYear));
    } catch {
      return null;
    }
  }, [natalSun, targetYear]);

  const currentMoment = useMemo(() => {
    if (!baseMoment) return null;
    return addMinutes(baseMoment, offsetMin);
  }, [baseMoment, offsetMin]);

  const baseLagna = useMemo(() => {
    if (!baseMoment) return null;
    return siderealAscendant(julianDay(baseMoment), latitude, longitude);
  }, [baseMoment, latitude, longitude]);

  const currentSun = useMemo(() => {
    if (!currentMoment) return null;
    return siderealSunLongitude(julianDay(currentMoment));
  }, [currentMoment]);

  const currentLagna = useMemo(() => {
    if (!currentMoment) return null;
    return siderealAscendant(julianDay(currentMoment), latitude, longitude);
  }, [currentMoment, latitude, longitude]);

  const sunDiffArcmin = useMemo(() => {
    if (currentSun === null) return null;
    return shortestAngleDiff(currentSun, normalizeDeg(natalSun)) * 60;
  }, [currentSun, natalSun]);

  const lagnaShiftDeg = useMemo(() => {
    if (currentLagna === null || baseLagna === null) return null;
    return shortestAngleDiff(currentLagna, baseLagna);
  }, [currentLagna, baseLagna]);

  const boundaryInfo = useMemo(() => {
    if (currentLagna === null) return null;
    const degInSign = currentLagna % 30;
    const distance = Math.min(degInSign, 30 - degInSign);
    const side = degInSign < 15 ? "start" : "end";
    return { distance, side, degInSign };
  }, [currentLagna]);

  const reset = () => {
    setNatalSun(110.0);
    setTargetYear(2026);
    setLatitude(28.61);
    setLongitude(77.21);
    setOffsetMin(0);
  };

  return (
    <div data-interactive="varshaphala-builder" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Varṣaphala builder</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              {PANEL_HEADING[activePanel].title}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {PANEL_HEADING[activePanel].subtitle}
            </p>
          </div>
          {showHeaderReset && (
            <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          )}
        </div>
      </section>

      {!lockToInitialPanel && (
        <section style={cardStyle}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              aria-pressed={activePanel === "solar-return"}
              onClick={() => setActivePanel("solar-return")}
              style={smallChipStyle(activePanel === "solar-return", BLUE)}
            >
              Solar-return finder
            </button>
            <button
              type="button"
              aria-pressed={activePanel === "house-placement"}
              onClick={() => setActivePanel("house-placement")}
              style={smallChipStyle(activePanel === "house-placement", GREEN)}
            >
              House placement
            </button>
            <button
              type="button"
              aria-pressed={activePanel === "cross-check"}
              onClick={() => setActivePanel("cross-check")}
              style={smallChipStyle(activePanel === "cross-check", VERMILION)}
            >
              Cross-check
            </button>
            <button
              type="button"
              aria-pressed={activePanel === "end-to-end"}
              onClick={() => setActivePanel("end-to-end")}
              style={smallChipStyle(activePanel === "end-to-end", GOLD)}
            >
              End-to-end
            </button>
          </div>
        </section>
      )}

      {activePanel === "solar-return" && (
        <>

      {/* Inputs + results */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Inputs</p>

          <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.75rem" }}>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Natal Sun longitude (sidereal °)</span>
              <input
                type="number"
                step={0.01}
                min={0}
                max={360}
                value={natalSun}
                onChange={(e) => { setOffsetMin(0); setNatalSun(clampNumber(parseFloat(e.target.value), 0, 360)); }}
                style={inputStyle}
              />
              <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{formatZodiacal(normalizeDeg(natalSun))}</span>
            </label>

            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Target year</span>
              <input
                type="number"
                min={1900}
                max={2100}
                value={targetYear}
                onChange={(e) => { setOffsetMin(0); setTargetYear(Math.round(clampNumber(parseFloat(e.target.value), 1900, 2100))); }}
                style={inputStyle}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Latitude</span>
                <input
                  type="number"
                  step={0.01}
                  min={-90}
                  max={90}
                  value={latitude}
                  onChange={(e) => { setOffsetMin(0); setLatitude(clampNumber(parseFloat(e.target.value), -90, 90)); }}
                  style={inputStyle}
                />
              </label>
              <label style={fieldStyle}>
                <span style={fieldLabelStyle}>Longitude</span>
                <input
                  type="number"
                  step={0.01}
                  min={-180}
                  max={180}
                  value={longitude}
                  onChange={(e) => { setOffsetMin(0); setLongitude(clampNumber(parseFloat(e.target.value), -180, 180)); }}
                  style={inputStyle}
                />
              </label>
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <p style={fieldLabelStyle}>Nudge the found moment</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.35rem" }}>
              {NUDGES.map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={offsetMin === n}
                  onClick={() => setOffsetMin(n)}
                  style={smallChipStyle(offsetMin === n, n === 0 ? GREEN : n < 0 ? BLUE : GOLD)}
                >
                  {n === 0 ? "Exact" : `${n > 0 ? "+" : ""}${n} min`}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Results</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Readout icon={<Clock size={18} />} label="Varṣa-praveśa moment" color={BLUE}>
              {currentMoment ? formatUtc(currentMoment) : "—"}
            </Readout>

            <Readout icon={<Sun size={18} />} label="Transiting Sun" color={GOLD}>
              {currentSun !== null ? (
                <span>
                  {formatZodiacal(currentSun)}
                  {sunDiffArcmin !== null && (
                    <span style={{ color: sunDiffArcmin === 0 ? GREEN : GOLD, marginLeft: "0.5rem" }}>
                      ({sunDiffArcmin >= 0 ? "+" : ""}{sunDiffArcmin.toFixed(1)} arc-min)
                    </span>
                  )}
                </span>
              ) : (
                "—"
              )}
            </Readout>

            <Readout icon={<Compass size={18} />} label="Varṣa-Lagna" color={GREEN}>
              {currentLagna !== null ? (
                <span>
                  {formatZodiacal(currentLagna)}
                  {lagnaShiftDeg !== null && offsetMin !== 0 && (
                    <span style={{ color: Math.abs(lagnaShiftDeg) < 1 ? GREEN : Math.abs(lagnaShiftDeg) < 3 ? GOLD : VERMILION, marginLeft: "0.5rem" }}>
                      ({lagnaShiftDeg >= 0 ? "+" : ""}{lagnaShiftDeg.toFixed(2)}°)
                    </span>
                  )}
                </span>
              ) : (
                "—"
              )}
            </Readout>

            {boundaryInfo && boundaryInfo.distance < 1 && (
              <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <AlertTriangle size={18} aria-hidden="true" />
                  <span>
                    Boundary proximity: the varṣa-Lagna is {boundaryInfo.distance.toFixed(2)}° from the {boundaryInfo.side === "start" ? "start" : "end"} of {zodiacSign(currentLagna ?? 0)}. A small timing error could change which sign rises.
                  </span>
                </div>
              </div>
            )}

            {boundaryInfo && boundaryInfo.distance >= 1 && boundaryInfo.distance < 3 && (
              <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GOLD}10`, border: `1px solid ${GOLD}`, color: GOLD, fontSize: "0.9rem" }}>
                <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  <Gauge size={18} aria-hidden="true" />
                  <span>
                    The varṣa-Lagna is {boundaryInfo.distance.toFixed(2)}° from a sign cusp. Extra verification is advisable.
                  </span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Diagram */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Precision cascade</p>
            <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
              Same timing error, two very different effects
            </h3>
          </div>
        </div>
        {currentSun !== null && currentLagna !== null && sunDiffArcmin !== null && lagnaShiftDeg !== null && boundaryInfo !== null && (
          <PrecisionDiagram
            sunDiffArcmin={sunDiffArcmin}
            lagnaShiftDeg={lagnaShiftDeg}
            lagnaDegInSign={boundaryInfo.degInSign}
          />
        )}
      </section>
        </>
      )}

      {activePanel === "house-placement" && (
        <HousePlacementPanel lagna={currentLagna ?? 280.0} />
      )}

      {activePanel === "cross-check" && (
        <CrossCheckPanel />
      )}

      {activePanel === "end-to-end" && (
        <EndToEndPanel />
      )}
    </div>
  );
}

function PrecisionDiagram({
  sunDiffArcmin,
  lagnaShiftDeg,
  lagnaDegInSign,
}: {
  sunDiffArcmin: number;
  lagnaShiftDeg: number;
  lagnaDegInSign: number;
}) {
  const width = 560;
  const left = 60;
  const right = 500;
  const trackLen = right - left;

  const sunX = 280 + clampNumber(sunDiffArcmin, -15, 15) * (trackLen / 2 / 15);
  const lagnaX = left + clampNumber(lagnaDegInSign, 0, 30) * (trackLen / 30);

  return (
    <svg viewBox={`0 0 ${width} 220`} role="img" aria-label="Dual precision diagram: Sun offset in arc-minutes and Lagna position within its sign" style={{ width: "100%", maxHeight: 260, margin: "0.85rem auto 0", display: "block" }}>
      {/* Sun track */}
      <text x={left} y={26} fill={INK_MUTED} fontSize="12" fontWeight={600}>Sun offset from exact return</text>
      <line x1={left} y1={50} x2={right} y2={50} stroke={HAIRLINE} strokeWidth="2" />
      {[-15, -10, -5, 0, 5, 10, 15].map((t) => {
        const x = 280 + t * (trackLen / 2 / 15);
        return (
          <g key={t}>
            <line x1={x} y1={44} x2={x} y2={56} stroke={HAIRLINE} strokeWidth="1.5" />
            <text x={x} y={72} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>{t === 0 ? "0" : `${t}′`}</text>
          </g>
        );
      })}
      <polygon points={`${sunX - 6},38 ${sunX + 6},38 ${sunX},48`} fill={GOLD} />
      <text x={sunX} y={28} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={600}>{sunDiffArcmin.toFixed(1)}′</text>

      {/* Lagna sign ruler */}
      <text x={left} y={118} fill={INK_MUTED} fontSize="12" fontWeight={600}>Lagna position within its current sign</text>
      <rect x={left} y={132} width={trackLen} height="28" rx="4" fill={`${GREEN}08`} stroke={HAIRLINE} />
      {/* boundary zones */}
      <rect x={left} y={132} width={trackLen / 30} height="28" fill={`${VERMILION}18`} />
      <rect x={right - trackLen / 30} y={132} width={trackLen / 30} height="28" fill={`${VERMILION}18`} />
      <line x1={left} y1={132} x2={left} y2={160} stroke={VERMILION} strokeWidth="2" />
      <line x1={right} y1={132} x2={right} y2={160} stroke={VERMILION} strokeWidth="2" />
      <line x1={lagnaX} y1={128} x2={lagnaX} y2={164} stroke={GREEN} strokeWidth="3" />
      <polygon points={`${lagnaX - 6},124 ${lagnaX + 6},124 ${lagnaX},132`} fill={GREEN} />
      <text x={left} y={180} fill={INK_MUTED} fontSize="10" fontWeight={600}>0° cusp</text>
      <text x={right} y={180} textAnchor="end" fill={INK_MUTED} fontSize="10" fontWeight={600}>30° cusp</text>
      <text x={lagnaX} y={120} textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>{lagnaDegInSign.toFixed(2)}°</text>

      {/* Lagna shift annotation */}
      <text x={left} y={205} fill={INK_SECONDARY} fontSize="11" fontWeight={600}>
        Lagna shift from exact return: {lagnaShiftDeg >= 0 ? "+" : ""}{lagnaShiftDeg.toFixed(2)}°
      </text>
    </svg>
  );
}

function Readout({
  icon,
  label,
  color,
  children,
}: {
  icon: ReactNode;
  label: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "start", gap: "0.65rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${color}33`, background: `${color}08` }}>
      <span style={{ color, flexShrink: 0, marginTop: "0.1rem" }}>{icon}</span>
      <div>
        <div style={{ color: INK_MUTED, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
        <div style={{ color: INK_PRIMARY, fontSize: "0.95rem", marginTop: "0.15rem", lineHeight: 1.45 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─────────────── Astronomical helpers (demonstration-only) ─────────────── */

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
  const trueLong = L0 + C;
  return normalizeDeg(trueLong);
}

function lahiriAyanamsa(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Approximate Lahiri ayanamsa: ~23°51′ at J2000, drifting with precession.
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

/* ─────────────── Utility helpers ─────────────── */

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function shortestAngleDiff(a: number, b: number): number {
  let d = ((a - b + 360) % 360);
  if (d > 180) d -= 360;
  return d;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

function clampNumber(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
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

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

function formatUtc(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`;
}

/* ─────────────── Styles ─────────────── */

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
