"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Search,
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

const LAGNA_TOL = 0.5;
const PLANET_TOL = 0.5;
const SUN_SENSITIVITY_ARCMIN_PER_MIN = 0.25;
const LAGNA_DEG_PER_MIN = 0.25;

interface ChartPoint {
  id: string;
  name: string;
  hand: number;
  software: number;
}

const DEFAULT_POINTS: ChartPoint[] = [
  { id: "lagna", name: "Varṣa-Lagna", hand: 280.0, software: 280.03 },
  { id: "sun", name: "Sun", hand: 110.0, software: 110.0 },
  { id: "moon", name: "Moon", hand: 15.0, software: 15.01 },
  { id: "mercury", name: "Mercury", hand: 118.0, software: 118.02 },
  { id: "venus", name: "Venus", hand: 95.0, software: 95.02 },
  { id: "mars", name: "Mars", hand: 200.0, software: 200.01 },
  { id: "jupiter", name: "Jupiter", hand: 350.0, software: 350.03 },
  { id: "saturn", name: "Saturn", hand: 302.0, software: 302.02 },
  { id: "rahu", name: "Rahu", hand: 80.0, software: 80.01 },
  { id: "ketu", name: "Ketu", hand: 260.0, software: 260.02 },
];

const SCENARIOS = {
  withinTolerance: {
    label: "Within tolerance (Example 1)",
    values: { lagna: 280.03, sun: 110.0, moon: 15.01, mercury: 118.02, venus: 95.02, mars: 200.01, jupiter: 350.03, saturn: 302.02, rahu: 80.01, ketu: 260.02 },
  },
  timingError: {
    label: "Timing error (Example 2)",
    values: { lagna: 284.3, sun: 110.02, moon: 17.0, mercury: 120.0, venus: 97.0, mars: 202.0, jupiter: 352.0, saturn: 304.0, rahu: 82.0, ketu: 262.0 },
  },
  ayanamsha: {
    label: "Ayanāṁśa mismatch",
    values: { lagna: 283.5, sun: 113.5, moon: 18.5, mercury: 121.5, venus: 98.5, mars: 203.5, jupiter: 353.5, saturn: 305.5, rahu: 83.5, ketu: 263.5 },
  },
  custom: {
    label: "Custom software values",
    values: {},
  },
};

type ScenarioKey = keyof typeof SCENARIOS;

export function CrossCheckPanel() {
  const [points, setPoints] = useState<ChartPoint[]>(DEFAULT_POINTS);
  const [scenario, setScenario] = useState<ScenarioKey>("withinTolerance");
  const [timingMin, setTimingMin] = useState<number>(10);

  const rows = useMemo(() => {
    return points.map((p) => {
      const gap = shortestAngleDiff(p.software, p.hand);
      const tol = p.id === "lagna" ? LAGNA_TOL : PLANET_TOL;
      const ok = Math.abs(gap) <= tol;
      return { ...p, gap, tol, ok };
    });
  }, [points]);

  const allOk = rows.every((r) => r.ok);
  const lagnaRow = rows.find((r) => r.id === "lagna")!;
  const sunRow = rows.find((r) => r.id === "sun")!;

  const diagnosis = useMemo(() => {
    if (allOk) {
      return {
        label: "Within tolerance",
        color: GREEN,
        body: "All gaps are inside the working tolerance. The by-hand and software outputs agree; proceed with the usual boundary-proximity check.",
      };
    }

    const beyond = rows.filter((r) => !r.ok);
    const lagnaBeyond = !lagnaRow.ok;
    const sunBeyond = !sunRow.ok;
    const nonLagnaBeyond = beyond.filter((r) => r.id !== "lagna");

    const uniform = rows.length > 1 && stdDev(rows.map((r) => r.gap)) < 0.15;
    if (uniform && beyond.length >= 8) {
      return {
        label: "Ayanāṁśa mismatch likely",
        color: GOLD,
        body: "A near-constant offset across most points suggests the two sides used different ayanāṁśas. Confirm both use the same sidereal ayanāṁśa.",
      };
    }

    if (lagnaBeyond && !sunBeyond && nonLagnaBeyond.every((r) => Math.abs(r.gap) < 2.0)) {
      return {
        label: "SR-moment timing error likely",
        color: VERMILION,
        body: "The Lagna gap is large while the Sun gap is small. This is the differential-sensitivity signature of a timing error. Re-verify the varṣa-praveśa moment to the minute.",
      };
    }

    if (lagnaBeyond && beyond.length >= 2 && beyond.length <= 4) {
      return {
        label: "Birth-location or isolated computational error possible",
        color: GOLD,
        body: "The Lagna is affected and only a few points show large gaps. Re-check that both sides used birth-location, not current-location, and inspect any point near a 30°-from-Lagna boundary for the equal-house trap.",
      };
    }

    return {
      label: "Discrepancy needs manual pattern reading",
      color: GOLD,
      body: "Compare the gap pattern against the §4.3 table: uniform offset (ayanāṁśa), Lagna-only large gap (timing), location-dependent angles (birth-location), same-sign points split (equal-house trap), or longitudes agreeing while houses disagree (house-system mismatch).",
    };
  }, [allOk, lagnaRow, rows, sunRow]);

  const applyScenario = (key: ScenarioKey) => {
    setScenario(key);
    if (key === "custom") return;
    const values = SCENARIOS[key].values as Record<string, number>;
    setPoints((prev) => prev.map((p) => ({ ...p, software: values[p.id] ?? p.software })));
  };

  const updateSoftware = (id: string, value: number) => {
    setScenario("custom");
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, software: clampNumber(value, 0, 360) } : p)));
  };

  const reset = () => {
    setPoints(DEFAULT_POINTS);
    setScenario("withinTolerance");
    setTimingMin(10);
  };

  const estimatedLagnaShift = timingMin * LAGNA_DEG_PER_MIN;

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Software cross-check</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Compare by-hand values against a second source
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Enter by-hand and software longitudes, then read the gap pattern. The tolerance is ±0.5° for the Lagna and for planets.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scenario</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.55rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={scenario === key}
              onClick={() => applyScenario(key)}
              style={smallChipStyle(scenario === key, key === "withinTolerance" ? GREEN : key === "timingError" ? VERMILION : key === "ayanamsha" ? GOLD : BLUE)}
            >
              {SCENARIOS[key].label}
            </button>
          ))}
        </div>
      </section>

      <div style={twoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Point-by-point comparison</p>
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Point</th>
                  <th style={thStyle}>By hand</th>
                  <th style={thStyle}>Software</th>
                  <th style={thStyle}>Gap</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${HAIRLINE}`, background: row.ok ? "transparent" : `${VERMILION}06` }}>
                    <td style={tdStyle}>{row.name}</td>
                    <td style={tdStyle}>{formatDms(row.hand)}</td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        step={0.01}
                        min={0}
                        max={360}
                        value={row.software}
                        onChange={(e) => updateSoftware(row.id, parseFloat(e.target.value))}
                        style={{ ...inputStyle, width: "90px", fontSize: "0.8rem" }}
                      />
                    </td>
                    <td style={{ ...tdStyle, color: row.ok ? GREEN : VERMILION, fontWeight: 600 }}>
                      {row.gap >= 0 ? "+" : ""}{row.gap.toFixed(2)}°
                    </td>
                    <td style={tdStyle}>
                      {row.ok ? (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: GREEN, fontSize: "0.78rem" }}>
                          <CheckCircle2 size={14} aria-hidden="true" />
                          Pass
                        </span>
                      ) : (
                        <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: VERMILION, fontSize: "0.78rem" }}>
                          <AlertTriangle size={14} aria-hidden="true" />
                          Fail
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${diagnosis.color}10`, border: `1px solid ${diagnosis.color}`, color: diagnosis.color, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
              {allOk ? <BadgeCheck size={18} aria-hidden="true" /> : <Search size={18} aria-hidden="true" />}
              <span>
                <span style={{ fontWeight: 600 }}>{diagnosis.label}.</span> {diagnosis.body}
              </span>
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Timing converter</p>
          <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.75rem" }}>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Suspected timing error (minutes)</span>
              <input
                type="number"
                step={1}
                value={timingMin}
                onChange={(e) => setTimingMin(clampNumber(parseFloat(e.target.value), -120, 120))}
                style={inputStyle}
              />
            </label>
            <div style={{ padding: "0.75rem", borderRadius: 8, background: `${BLUE}10`, border: `1px solid ${BLUE}`, color: BLUE, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                <Clock size={18} aria-hidden="true" />
                <span>
                  A {Math.abs(timingMin)}-minute {timingMin >= 0 ? "late" : "early"} SR moment shifts the Lagna by roughly {Math.abs(estimatedLagnaShift).toFixed(2)}° (using ~1° per 4 minutes) and the Sun by roughly {Math.abs(timingMin * SUN_SENSITIVITY_ARCMIN_PER_MIN).toFixed(1)} arc-minutes.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function shortestAngleDiff(a: number, b: number): number {
  let d = ((a - b + 360) % 360);
  if (d > 180) d -= 360;
  return d;
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

function formatDms(deg: number): string {
  const normalized = normalizeDeg(deg);
  const d = Math.floor(normalized);
  const m = Math.floor((normalized - d) * 60);
  const s = Math.round(((normalized - d) * 60 - m) * 60);
  return `${d}° ${m.toString().padStart(2, "0")}′ ${s.toString().padStart(2, "0")}″`;
}

function stdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
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
