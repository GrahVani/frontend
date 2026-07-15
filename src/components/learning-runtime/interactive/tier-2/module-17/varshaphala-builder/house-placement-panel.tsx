"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  LayoutGrid,
  RotateCcw,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
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

const DEFAULT_LAGNA = 280.0;

interface ChartPoint {
  id: string;
  name: string;
  longitude: number;
}

const DEFAULT_POINTS: ChartPoint[] = [
  { id: "sun", name: "Sun", longitude: 110.0 },
  { id: "moon", name: "Moon", longitude: 15.0 },
  { id: "mercury", name: "Mercury", longitude: 118.0 },
  { id: "venus", name: "Venus", longitude: 95.0 },
  { id: "mars", name: "Mars", longitude: 200.0 },
  { id: "jupiter", name: "Jupiter", longitude: 350.0 },
  { id: "saturn", name: "Saturn", longitude: 302.0 },
  { id: "rahu", name: "Rahu", longitude: 80.0 },
  { id: "ketu", name: "Ketu", longitude: 260.0 },
];

export function HousePlacementPanel({ lagna }: { lagna: number }) {
  const [lagnaInput, setLagnaInput] = useState<number>(normalizeDeg(lagna));
  const [points, setPoints] = useState<ChartPoint[]>(DEFAULT_POINTS);
  const [highlightTrap, setHighlightTrap] = useState<boolean>(true);

  const lagnaSign = Math.floor(normalizeDeg(lagnaInput) / 30);

  const rows = useMemo(() => {
    return points.map((point) => {
      const whole = wholeSignHouse(point.longitude, lagnaInput);
      const equal = equalHouseFromLagna(point.longitude, lagnaInput);
      return { ...point, whole, equal, moved: whole !== equal };
    });
  }, [points, lagnaInput]);

  const trapSigns = useMemo(() => {
    const signMap: Record<number, { names: string[]; whole: Set<number>; equal: Set<number> }> = {};
    rows.forEach((row) => {
      const sign = Math.floor(normalizeDeg(row.longitude) / 30);
      if (!signMap[sign]) signMap[sign] = { names: [], whole: new Set(), equal: new Set() };
      signMap[sign].names.push(row.name);
      signMap[sign].whole.add(row.whole);
      signMap[sign].equal.add(row.equal);
    });
    return Object.entries(signMap)
      .filter(([, data]) => data.equal.size > 1)
      .map(([sign, data]) => ({ sign: Number(sign), names: data.names, houses: Array.from(data.equal).sort((a, b) => a - b) }));
  }, [rows]);

  const wholeSignGrid = useMemo(() => {
    const grid: { house: number; signIndex: number; points: ChartPoint[] }[] = [];
    for (let h = 1; h <= 12; h++) {
      const signIndex = (lagnaSign + h - 1) % 12;
      grid.push({ house: h, signIndex, points: points.filter((p) => wholeSignHouse(p.longitude, lagnaInput) === h) });
    }
    return grid;
  }, [points, lagnaInput, lagnaSign]);

  const updatePointLongitude = (id: string, value: number) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, longitude: clampNumber(value, 0, 360) } : p)));
  };

  const reset = () => {
    setLagnaInput(normalizeDeg(DEFAULT_LAGNA));
    setPoints(DEFAULT_POINTS);
    setHighlightTrap(true);
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>House placement</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Whole-sign counting from the varṣa-Lagna sign
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare the correct whole-sign house with the equal-house-from-Lagna-degree trap. Any two points in the same sign must land in the same whole-sign house.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={twoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Lagna and points</p>
          <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.75rem" }}>
            <label style={fieldStyle}>
              <span style={fieldLabelStyle}>Varṣa-Lagna longitude (sidereal °)</span>
              <input
                type="number"
                step={0.01}
                min={0}
                max={360}
                value={lagnaInput}
                onChange={(e) => setLagnaInput(clampNumber(parseFloat(e.target.value), 0, 360))}
                style={inputStyle}
              />
              <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{formatZodiacal(normalizeDeg(lagnaInput))}</span>
            </label>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
              <span style={fieldLabelStyle}>Chart points</span>
              <button
                type="button"
                aria-pressed={highlightTrap}
                onClick={() => setHighlightTrap((v) => !v)}
                style={smallChipStyle(highlightTrap, VERMILION)}
              >
                {highlightTrap ? "Trap highlighting on" : "Trap highlighting off"}
              </button>
            </div>

            <div style={{ display: "grid", gap: "0.4rem" }}>
              {points.map((point) => (
                <label key={point.id} style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ color: INK_PRIMARY, fontSize: "0.85rem", fontWeight: 500 }}>{point.name}</span>
                  <input
                    type="number"
                    step={0.01}
                    min={0}
                    max={360}
                    value={point.longitude}
                    onChange={(e) => updatePointLongitude(point.id, parseFloat(e.target.value))}
                    style={inputStyle}
                  />
                </label>
              ))}
            </div>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>House comparison</p>
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Point</th>
                  <th style={thStyle}>Longitude</th>
                  <th style={thStyle}>Whole</th>
                  <th style={thStyle}>Equal</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => {
                  return (
                    <tr
                      key={row.id}
                      style={{
                        background: highlightTrap && row.moved ? `${VERMILION}08` : "transparent",
                        borderBottom: `1px solid ${HAIRLINE}`,
                      }}
                    >
                      <td style={tdStyle}>{row.name}</td>
                      <td style={tdStyle}>{formatZodiacal(row.longitude)}</td>
                      <td style={{ ...tdStyle, color: GREEN, fontWeight: 600 }}>{row.whole}</td>
                      <td style={{ ...tdStyle, color: highlightTrap && row.moved ? VERMILION : INK_SECONDARY, fontWeight: 600 }}>{row.equal}</td>
                      <td style={tdStyle}>
                        {row.moved ? (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: VERMILION, fontSize: "0.78rem" }}>
                            <AlertTriangle size={14} aria-hidden="true" />
                            Moved
                          </span>
                        ) : (
                          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: GREEN, fontSize: "0.78rem" }}>
                            <CheckCircle2 size={14} aria-hidden="true" />
                            Match
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {trapSigns.length > 0 && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                <AlertTriangle size={18} aria-hidden="true" />
                <span>
                  Same-sign points split under equal-house:
                  {trapSigns.map((t) => (
                    <span key={t.sign} style={{ display: "block", marginTop: "0.35rem" }}>
                      {t.names.join(", ")} are all in {SIGN_NAMES[t.sign]}, but equal-house assigns them to houses {t.houses.join(" and ")}.
                    </span>
                  ))}
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Whole-sign layout</p>
            <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
              Lagna sign becomes house 1
            </h3>
          </div>
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: INK_MUTED, fontSize: "0.8rem" }}>
            <LayoutGrid size={16} aria-hidden="true" />
            Each card is one whole-sign house
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {wholeSignGrid.map((cell) => (
            <div
              key={cell.house}
              style={{
                padding: "0.65rem",
                borderRadius: 8,
                border: `1px solid ${cell.house === 1 ? ACCENT : HAIRLINE}`,
                background: cell.house === 1 ? `${ACCENT}10` : SURFACE,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ color: cell.house === 1 ? ACCENT : INK_MUTED, fontSize: "0.75rem", fontWeight: 700 }}>House {cell.house}</span>
                <span style={{ color: INK_SECONDARY, fontSize: "0.78rem" }}>{SIGN_NAMES[cell.signIndex]}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.4rem" }}>
                {cell.points.map((p) => (
                  <span
                    key={p.id}
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.15rem 0.4rem",
                      borderRadius: 999,
                      background: `${BLUE}18`,
                      color: BLUE,
                      fontWeight: 600,
                    }}
                  >
                    {p.name}
                  </span>
                ))}
                {cell.points.length === 0 && <span style={{ color: INK_MUTED, fontSize: "0.75rem" }}>empty</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function wholeSignHouse(pointLongitude: number, lagnaLongitude: number): number {
  const pointSign = Math.floor(normalizeDeg(pointLongitude) / 30);
  const lagnaSign = Math.floor(normalizeDeg(lagnaLongitude) / 30);
  return ((pointSign - lagnaSign + 12) % 12) + 1;
}

function equalHouseFromLagna(pointLongitude: number, lagnaLongitude: number): number {
  const diff = (normalizeDeg(pointLongitude) - normalizeDeg(lagnaLongitude) + 360) % 360;
  return Math.floor(diff / 30) + 1;
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
