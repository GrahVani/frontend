"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ChevronDown,
  Dices,
  Grid3X3,
  ListTree,
  RotateCcw,
  Search,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewMode = "zodiac" | "construction";
type ScenarioKey = "free" | "ex1" | "ex2";

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

const LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"] as const;
const NAKSHATRA_LORDS = [
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
  "Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury",
] as const;
const YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const SIGN_NAMES = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_SHORT = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
const SIGN_LORDS = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];
const LORD_COLORS: Record<string, string> = {
  Ketu: PURPLE, Venus: GOLD, Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Rahu: PURPLE, Jupiter: GREEN, Saturn: PURPLE, Mercury: GREEN,
};
const SIGN_COLORS = [
  VERMILION, GOLD, GREEN, BLUE, VERMILION, GREEN, GOLD, VERMILION, GOLD, BLUE, BLUE, GREEN,
];

interface KpRow {
  number: number;
  nakshatraIndex: number;
  starLord: string;
  subLord: string;
  startMin: number;
  endMin: number;
  split: boolean;
}

function buildTable(): KpRow[] {
  const rows: KpRow[] = [];
  for (let n = 0; n < 27; n++) {
    const nakStart = n * 800;
    const starLord = NAKSHATRA_LORDS[n];
    const startIdx = LORDS.indexOf(starLord);
    let cursor = nakStart;
    for (let i = 0; i < 9; i++) {
      const subLord = LORDS[(startIdx + i) % 9];
      const span = (YEARS[subLord] / 120) * 800;
      const start = cursor;
      const end = cursor + span;
      const startSign = Math.floor(start / 1800);
      const endSign = Math.floor((end - 1e-9) / 1800);
      if (startSign !== endSign) {
        const boundary = (startSign + 1) * 1800;
        if (boundary > start + 1e-9 && boundary < end - 1e-9) {
          rows.push({ number: rows.length + 1, nakshatraIndex: n, starLord, subLord, startMin: start, endMin: boundary, split: true });
          rows.push({ number: rows.length + 1, nakshatraIndex: n, starLord, subLord, startMin: boundary, endMin: end, split: true });
        } else {
          rows.push({ number: rows.length + 1, nakshatraIndex: n, starLord, subLord, startMin: start, endMin: end, split: false });
        }
      } else {
        rows.push({ number: rows.length + 1, nakshatraIndex: n, starLord, subLord, startMin: start, endMin: end, split: false });
      }
      cursor = end;
    }
  }
  return rows;
}

function formatDms(totalMinutes: number) {
  const sign = Math.floor(totalMinutes / 1800);
  const remainder = totalMinutes - sign * 1800;
  const deg = Math.floor(remainder / 60);
  const min = Math.floor(remainder % 60);
  const sec = Math.round((remainder - Math.floor(remainder)) * 60);
  return { sign, deg, min, sec, signName: SIGN_NAMES[sign] };
}

function formatDmsStr(totalMinutes: number) {
  const { deg, min, sec } = formatDms(totalMinutes);
  const s = sec === 60 ? 0 : sec;
  const m = sec === 60 ? min + 1 : min;
  const d = m === 60 ? deg + 1 : deg;
  const finalM = m === 60 ? 0 : m;
  return d + "°" + String(finalM).padStart(2, "0") + "'" + String(s).padStart(2, "0") + '"';
}

function findRow(rows: KpRow[], num: number): KpRow | null {
  return rows[num - 1] ?? null;
}

const SCENARIOS: Record<ScenarioKey, { label: string; number: number | null; note: string }> = {
  free: { label: "Free practice", number: null, note: "" },
  ex1: { label: "Example 1: number 200", number: 200, note: "Row 200: 17°46′40″ Capricorn, star-lord Moon, sub-lord Mercury, sign-lord Saturn." },
  ex2: { label: "Example 2: number 45", number: 45, note: "Row 45: 4°53′20″ Gemini, star-lord Mars, sub-lord Sun, sign-lord Mercury." },
};

export function KpHoraryNumberSelector() {
  const rows = useMemo(() => buildTable(), []);
  const [scenario, setScenario] = useState<ScenarioKey>("free");
  const [selected, setSelected] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("zodiac");

  const selectScenario = (key: ScenarioKey) => {
    setScenario(key);
    const num = SCENARIOS[key].number;
    setSelected(num);
    setInput(num === null ? "" : String(num));
    setError(null);
  };

  const validateAndSelect = (raw: string) => {
    setInput(raw);
    if (raw === "") {
      setError(null);
      setSelected(null);
      return;
    }
    const n = parseInt(raw, 10);
    if (Number.isNaN(n) || String(n) !== raw || n < 1 || n > 249) {
      setError("Enter a whole number from 1 to 249.");
      setSelected(null);
      return;
    }
    setError(null);
    setSelected(n);
    if (SCENARIOS[scenario].number !== n) setScenario("free");
  };

  const row = selected ? findRow(rows, selected) : null;

  return (
    <div data-interactive="kp-horary-number-selector" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP horary number selector</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              See how 243 raw sub-arcs become 249 rows
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Pick a number 1–249, watch the Ascendant arc resolve, then switch to the construction view to see the six sign-boundary splits that turn 243 into 249.
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
              onClick={() => { selectScenario("free"); setView("zodiac"); }}
              style={buttonStyle(false, ACCENT)}
            >
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <label htmlFor="number-input" style={{ ...eyebrowStyle, display: "block", marginBottom: "0.45rem" }}>Querent number</label>
          <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.55rem" }}>
            <input
              id="number-input"
              type="text"
              inputMode="numeric"
              value={input}
              onChange={(e) => validateAndSelect(e.target.value)}
              placeholder="1–249"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => {
                const n = Math.floor(Math.random() * 249) + 1;
                validateAndSelect(String(n));
              }}
              style={buttonStyle(false, PURPLE)}
              aria-label="Pick a random number"
              title="Random number"
            >
              <Dices size={16} aria-hidden="true" />
            </button>
          </div>
          {error && (
            <div style={{ padding: "0.5rem", borderRadius: 6, background: VERMILION + "12", border: "1px solid " + VERMILION, color: VERMILION, fontSize: "0.85rem", marginBottom: "0.55rem" }}>
              <AlertTriangle size={15} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
              {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", margin: "0.65rem 0" }}>
            <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>Or click a square</span>
            <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>{selected ?? "—"} / 249</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(34px, 1fr))", gap: "0.25rem", maxHeight: 280, overflow: "auto", padding: "0.25rem", border: "1px solid " + HAIRLINE, borderRadius: 6, background: "#FFFBF2" }}>
            {rows.map((r) => {
              const active = selected === r.number;
              return (
                <button
                  key={r.number}
                  type="button"
                  aria-pressed={active}
                  onClick={() => { validateAndSelect(String(r.number)); }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    border: "1px solid " + (active ? ACCENT : HAIRLINE),
                    borderRadius: 4,
                    background: active ? ACCENT + "30" : r.split ? PURPLE + "12" : SURFACE,
                    color: active ? ACCENT : r.split ? PURPLE : INK_PRIMARY,
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title={"Row " + r.number}
                >
                  {r.number}
                </button>
              );
            })}
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem", lineHeight: 1.5 }}>
            Split rows (one segment of a sign-crossing sub-arc) are tinted purple in the grid.
          </p>
        </section>

        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Arc resolver</p>
              <h3 style={{ margin: "0.15rem 0 0", fontSize: "1.15rem", fontWeight: 600 }}>
                {row ? "Row " + row.number : "Select a number"}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button type="button" aria-pressed={view === "zodiac"} onClick={() => setView("zodiac")} style={buttonStyle(view === "zodiac", BLUE)}>
                <Search size={14} aria-hidden="true" />
                Zodiac
              </button>
              <button type="button" aria-pressed={view === "construction"} onClick={() => setView("construction")} style={buttonStyle(view === "construction", PURPLE)}>
                <ListTree size={14} aria-hidden="true" />
                Construction
              </button>
            </div>
          </div>

          {row ? (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "0.55rem", margin: "0.75rem 0" }}>
                <LordBadge label="Sign lord" lord={SIGN_LORDS[formatDms(row.startMin).sign]} color={SIGN_COLORS[formatDms(row.startMin).sign]} />
                <LordBadge label="Star lord" lord={row.starLord} color={LORD_COLORS[row.starLord]} />
                <LordBadge label="Sub lord" lord={row.subLord} color={LORD_COLORS[row.subLord]} />
              </div>
              <div style={{ ...cardStyle, background: ACCENT + "08", marginBottom: "0.75rem" }}>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.9rem" }}>
                  <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Ascendant convention:</strong> fix the horary Ascendant at the row&apos;s start degree.
                </p>
                <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, fontSize: "1.1rem", fontWeight: 600 }}>
                  {formatDmsStr(row.startMin)} {formatDms(row.startMin).signName}
                </p>
                <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
                  Arc {formatDmsStr(row.startMin)} – {formatDmsStr(row.endMin)} {formatDms(row.endMin).signName} · {formatDmsStr(row.endMin - row.startMin)} span
                </p>
                {row.split && (
                  <p style={{ margin: "0.35rem 0 0", color: PURPLE, fontSize: "0.85rem", fontWeight: 600 }}>
                    This is one part of a sign-boundary split row.
                  </p>
                )}
              </div>
              {view === "zodiac" ? <ZodiacArcSvg row={row} /> : <ConstructionSvg rows={rows} selected={selected} />}
            </>
          ) : (
            <div style={{ padding: "2rem", textAlign: "center", color: INK_MUTED, border: "1px dashed " + HAIRLINE, borderRadius: 8, marginTop: "0.75rem" }}>
              <Grid3X3 size={32} aria-hidden="true" style={{ marginBottom: "0.5rem" }} />
              <p style={{ margin: 0, fontWeight: 600 }}>Enter or click a number 1–249 to resolve its arc.</p>
            </div>
          )}
        </section>
      </div>

      {scenario !== "free" && SCENARIOS[scenario].note && (
        <section style={{ ...cardStyle, background: ACCENT + "08", borderColor: HAIRLINE }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BadgeCheck size={18} style={{ color: GREEN }} aria-hidden="true" />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{SCENARIOS[scenario].note}</p>
          </div>
        </section>
      )}
    </div>
  );
}

function LordBadge({ label, lord, color }: { label: string; lord: string; color: string }) {
  return (
    <div style={{ border: "1px solid " + color + "44", borderRadius: 8, background: color + "10", padding: "0.65rem", textAlign: "center" }}>
      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <p style={{ margin: "0.2rem 0 0", color, fontSize: "1.05rem", fontWeight: 600 }}>{lord}</p>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (Math.PI / 180) * angleDeg;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return "M " + cx + " " + cy + " L " + start.x + " " + start.y + " A " + r + " " + r + " 0 " + largeArcFlag + " 0 " + end.x + " " + end.y + " Z";
}

function ZodiacArcSvg({ row }: { row: KpRow }) {
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 140;
  const rInner = 95;
  // Aries at -90° (top), increasing clockwise
  const startAngle = (row.startMin / 21600) * 360 - 90;
  const endAngle = (row.endMin / 21600) * 360 - 90;

  return (
    <svg viewBox="0 0 320 320" role="img" aria-label="Zodiac arc for selected row" style={{ width: "100%", maxHeight: 360, display: "block", margin: "0 auto" }}>
      <rect x="10" y="10" width="300" height="300" rx="8" fill={ACCENT + "08"} stroke={HAIRLINE} />
      {SIGN_NAMES.map((_, i) => {
        const a1 = (i / 12) * 360 - 90;
        const a2 = ((i + 1) / 12) * 360 - 90;
        const p1 = polar(cx, cy, rOuter, a1);
        const p2 = polar(cx, cy, rOuter, a2);
        const p3 = polar(cx, cy, rInner, a2);
        const p4 = polar(cx, cy, rInner, a1);
        const labelPos = polar(cx, cy, (rOuter + rInner) / 2, (a1 + a2) / 2);
        return (
          <g key={i}>
            <path d={"M " + p1.x + " " + p1.y + " A " + rOuter + " " + rOuter + " 0 0 1 " + p2.x + " " + p2.y + " L " + p3.x + " " + p3.y + " A " + rInner + " " + rInner + " 0 0 0 " + p4.x + " " + p4.y + " Z"} fill={SIGN_COLORS[i] + "10"} stroke={SIGN_COLORS[i]} strokeWidth="1" />
            <text x={labelPos.x} y={labelPos.y + 4} textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>{SIGN_SHORT[i]}</text>
          </g>
        );
      })}
      <path d={describeArc(cx, cy, rOuter + 8, startAngle, endAngle)} fill={GOLD + "30"} stroke={GOLD} strokeWidth="3" />
      <circle cx={cx} cy={cy} r="4" fill={ACCENT} />
      <text x={cx} y={size - 22} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>
        Row {row.number} · {formatDmsStr(row.startMin)} {formatDms(row.startMin).signName}
      </text>
    </svg>
  );
}

function ConstructionSvg({ rows, selected }: { rows: KpRow[]; selected: number | null }) {
  const width = 1000;
  const height = 90;
  const pad = 20;
  const barHeight = 44;
  const barY = 20;
  const total = 21600;

  const splitRows = rows.filter((r) => r.split);

  return (
    <svg viewBox="0 0 1000 90" role="img" aria-label="Construction of 249 rows from 243 raw sub-arcs plus six sign-boundary splits" style={{ width: "100%", maxHeight: 260, display: "block", overflow: "auto" }}>
      <rect x="8" y="8" width="984" height="74" rx="8" fill={ACCENT + "08"} stroke={HAIRLINE} />
      {rows.map((r) => {
        const x = pad + (r.startMin / total) * (width - 2 * pad);
        const w = Math.max(1, ((r.endMin - r.startMin) / total) * (width - 2 * pad));
        const isSelected = selected === r.number;
        return (
          <rect
            key={r.number}
            x={x}
            y={barY}
            width={w}
            height={barHeight}
            fill={SIGN_COLORS[formatDms(r.startMin).sign] + (isSelected ? "50" : "25")}
            stroke={isSelected ? GOLD : "transparent"}
            strokeWidth={isSelected ? 2 : 0}
          />
        );
      })}
      {/* Sign-boundary lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = pad + ((i * 1800) / total) * (width - 2 * pad);
        return <line key={i} x1={x} y1={barY - 4} x2={x} y2={barY + barHeight + 4} stroke={INK_MUTED} strokeWidth="1" />;
      })}
      {/* Split markers */}
      {splitRows.map((r) => {
        const x = pad + (r.startMin / total) * (width - 2 * pad);
        return (
          <g key={"split-" + r.number}>
            <line x1={x} y1={barY - 6} x2={x} y2={barY + barHeight + 6} stroke={PURPLE} strokeWidth="2" />
            <text x={x + 3} y={barY + barHeight + 16} fill={PURPLE} fontSize="9" fontWeight={600}>split</text>
          </g>
        );
      })}
      <text x={width / 2} y={height - 8} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>
        243 raw Vimśottarī sub-arcs + {splitRows.length / 2} sign-boundary splits = 249 rows
      </text>
    </svg>
  );
}

const cardStyle: CSSProperties = {
  border: "1px solid " + HAIRLINE,
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
  border: "1px solid " + HAIRLINE,
  borderRadius: 6,
  padding: "0.55rem",
  background: "#FFFBF2",
  color: INK_PRIMARY,
  fontSize: "0.95rem",
  fontFamily: "inherit",
};

const selectStyle: CSSProperties = {
  appearance: "none",
  WebkitAppearance: "none",
  border: "1px solid " + HAIRLINE,
  borderRadius: 6,
  background: SURFACE,
  color: INK_PRIMARY,
  padding: "0.55rem 2rem 0.55rem 0.75rem",
  fontSize: "0.85rem",
  fontWeight: 600,
  cursor: "pointer",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: "1px solid " + (active ? color : HAIRLINE),
    background: active ? color : SURFACE,
    color: active ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
