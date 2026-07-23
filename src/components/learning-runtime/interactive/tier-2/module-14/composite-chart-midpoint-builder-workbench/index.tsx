"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Calculator,
  GitCompare,
  MapPinned,
  RefreshCw,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type PointKey = "lagna" | "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";
type ViewKey = "formula" | "chart" | "houses";

interface ChartPoint {
  key: PointKey;
  label: string;
  aLabel: string;
  bLabel: string;
  a: number;
  b: number;
  house: string;
  color: string;
}

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const POINTS: ChartPoint[] = [
  { key: "lagna", label: "Lagna", aLabel: "Libra 6°40'00\"", bLabel: "Cancer 15°00'00\"", a: 186.6667, b: 105, house: "H1", color: ACCENT },
  { key: "sun", label: "Sun", aLabel: "Aries 28°10'00\"", bLabel: "Leo 10°00'00\"", a: 28.1667, b: 130, house: "H11", color: BLUE },
  { key: "moon", label: "Moon", aLabel: "Cancer 12°30'00\"", bLabel: "Taurus 18°00'00\"", a: 102.5, b: 48, house: "H11", color: BLUE },
  { key: "mars", label: "Mars", aLabel: "Capricorn 19°00'00\"", bLabel: "Scorpio 24°00'00\"", a: 289, b: 234, house: "H5", color: VERMILION },
  { key: "mercury", label: "Mercury", aLabel: "Aries 15°20'00\"", bLabel: "Libra 8°00'00\"", a: 15.3333, b: 188, house: "H12", color: GREEN },
  { key: "jupiter", label: "Jupiter", aLabel: "Sagittarius 9°00'00\"", bLabel: "Pisces 27°00'00\"", a: 249, b: 357, house: "H7", color: GREEN },
  { key: "venus", label: "Venus", aLabel: "Taurus 22°45'00\"", bLabel: "Cancer 20°00'00\"", a: 52.75, b: 110, house: "H11", color: BLUE },
  { key: "saturn", label: "Saturn", aLabel: "Aquarius 27°30'00\"", bLabel: "Capricorn 5°00'00\"", a: 327.5, b: 275, house: "H7", color: GREEN },
  { key: "rahu", label: "Rahu", aLabel: "Virgo 11°00'00\"", bLabel: "Sagittarius 16°00'00\"", a: 161, b: 256, house: "H3", color: ACCENT },
  { key: "ketu", label: "Ketu", aLabel: "Pisces 11°00'00\"", bLabel: "Gemini 16°00'00\"", a: 341, b: 76, house: "H9", color: VERMILION },
];

const SIGN_NAMES = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

export function CompositeChartMidpointBuilderWorkbench() {
  const [pointKey, setPointKey] = useState<PointKey>("mars");
  const [view, setView] = useState<ViewKey>("formula");
  const [lowerFirst, setLowerFirst] = useState(true);
  const [showNaive, setShowNaive] = useState(false);
  const [houseTable, setHouseTable] = useState(true);
  const [blockTiming, setBlockTiming] = useState(true);

  const selected = POINTS.find((point) => point.key === pointKey) ?? POINTS[0];
  const calc = useMemo(() => calculateMidpoint(selected.a, selected.b, lowerFirst), [lowerFirst, selected.a, selected.b]);
  const branchColor = calc.branch === "forward" ? GREEN : VERMILION;
  const guardReady = houseTable && blockTiming;
  const naiveWrong = angularDistance(calc.naive, calc.midpoint) > 0.2;

  const result = useMemo(() => {
    if (!blockTiming) return "Repair: the builder may construct the composite chart, but it must still block dasha or transit timing from the composite view.";
    if (!houseTable) return "Repair: the lesson asks the learner to derive the whole-sign house table from the Leo composite Lagna.";
    if (showNaive && naiveWrong) return "Good contrast: the naive average is visibly wrong here because it ignores the shorter-arc branch.";
    return "Correct construction path: convert both positions to absolute longitude, choose the shorter-arc branch, then convert the midpoint back to sign and degree.";
  }, [blockTiming, houseTable, naiveWrong, showNaive]);

  return (
    <div data-interactive="composite-chart-midpoint-builder-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Composite chart builder</p>
            <h2 style={headingStyle}>Build MC1 + MC2 with the shorter-arc rule</h2>
            <p style={bodyStyle}>
              Select any point, watch the branch choice, and cross-check the mechanically-derived composite chart and house table.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPointKey("mars");
              setView("formula");
              setLowerFirst(true);
              setShowNaive(false);
              setHouseTable(true);
              setBlockTiming(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 560px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>Shorter-arc diagram</p>
            <div style={segmentedStyle}>
              <ViewButton view={view} target="formula" onSelect={setView} label="Formula" />
              <ViewButton view={view} target="chart" onSelect={setView} label="Chart" />
              <ViewButton view={view} target="houses" onSelect={setView} label="Houses" />
            </div>
          </div>
          <MidpointDiagram point={selected} calc={calc} showNaive={showNaive} view={view} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selected.color }}>
            <Calculator size={16} />
            <p style={eyebrowStyle}>{selected.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{formatLongitude(calc.midpoint)}</h3>
          <p style={bodyStyle}>
            {selected.aLabel} + {selected.bLabel}
          </p>
          <div style={{ ...noticeStyle(branchColor), marginTop: "1rem" }}>
            {calc.branch === "forward" ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{calc.branch === "forward" ? "Branch 1: diff <= 180°" : "Branch 2: shorter arc runs backward"}</span>
          </div>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.9rem" }}>
            <Metric label="A" value={`${calc.a.toFixed(2)}°`} />
            <Metric label="B" value={`${calc.b.toFixed(2)}°`} />
            <Metric label="diff" value={`${calc.diff.toFixed(2)}°`} />
            <Metric label="house" value={selected.house} />
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Point selector</p>
          <div style={pointGridStyle}>
            {POINTS.map((point) => {
              const pointCalc = calculateMidpoint(point.a, point.b, true);
              return (
                <button key={point.key} type="button" onClick={() => setPointKey(point.key)} aria-pressed={pointKey === point.key} style={pointButtonStyle(pointKey === point.key, point.color)}>
                  <span style={{ color: point.color }}>{point.label}</span>
                  <span style={smallTextStyle}>{formatLongitude(pointCalc.midpoint)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Builder controls</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={lowerFirst} onChange={setLowerFirst} label="Use lower longitude as A" body="Recommended convention removes branch-label ambiguity." icon={<SlidersHorizontal size={16} />} />
            <ToggleRow checked={showNaive} onChange={setShowNaive} label="Show naive average comparison" body="Useful for seeing boundary errors near 0°/360°." icon={<GitCompare size={16} />} />
            <ToggleRow checked={houseTable} onChange={setHouseTable} label="Derive whole-sign house table" body="Leo composite Lagna fixes the house count." icon={<MapPinned size={16} />} />
            <ToggleRow checked={blockTiming} onChange={setBlockTiming} label="Block dasha/transit panels" body="Trap #1 still applies after construction." icon={<ShieldAlert size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {guardReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Construction result</p>
            <h3 style={{ ...panelTitleStyle, color: guardReady ? GREEN : VERMILION }}>{guardReady ? "Composite chart cross-check ready" : "Builder guardrail missing"}</h3>
            <p style={bodyStyle}>{result}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompositeChartMidpointBuilderWorkbench;

function MidpointDiagram({ point, calc, showNaive, view }: { point: ChartPoint; calc: ReturnType<typeof calculateMidpoint>; showNaive: boolean; view: ViewKey }) {
  const center = 390;
  const cy = 218;
  const radius = 132;
  const a = polar(center, cy, radius, calc.a);
  const b = polar(center, cy, radius, calc.b);
  const mid = polar(center, cy, radius, calc.midpoint);
  const naive = polar(center, cy, radius, calc.naive);
  const clusterMode = view === "houses";

  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Composite midpoint shorter-arc diagram" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <circle cx={center} cy={cy} r={radius} fill="#FFFCF2" stroke={HAIRLINE} strokeWidth="2" />
      {SIGN_NAMES.map((sign, index) => {
        const start = polar(center, cy, radius + 2, index * 30);
        const label = polar(center, cy, radius + 28, index * 30 + 15);
        return (
          <g key={sign}>
            <line x1={center} y1={cy} x2={start.x} y2={start.y} stroke={HAIRLINE} strokeWidth="1" />
            <text x={label.x} y={label.y} textAnchor="middle" fill={INK_MUTED} fontSize="10">{sign.slice(0, 3)}</text>
          </g>
        );
      })}
      <circle cx={center} cy={cy} r="3" fill={INK_MUTED} />
      <path d={arcPath(center, cy, radius - 22, calc.a, calc.midpoint, calc.branch === "forward")} fill="none" stroke={point.color} strokeWidth="4" strokeLinecap="round" />
      <path d={arcPath(center, cy, radius - 22, calc.midpoint, calc.b, calc.branch === "forward")} fill="none" stroke={point.color} strokeWidth="4" strokeLinecap="round" strokeDasharray="6 7" />
      <PointDot point={a} label="MC1" color={BLUE} />
      <PointDot point={b} label="MC2" color={ACCENT} />
      <PointDot point={mid} label={point.label} color={point.color} />
      {showNaive && (
        <>
          <circle cx={naive.x} cy={naive.y} r="8" fill="#F9E8E3" stroke={VERMILION} strokeWidth="2" />
          <text x={naive.x} y={naive.y - 14} textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="500">naive</text>
        </>
      )}
      <rect x="48" y="42" width="220" height="78" rx="8" fill={softFill(BLUE)} stroke={BLUE} strokeWidth="1.5" />
      <text x="66" y="68" fill={BLUE} fontSize="13" fontWeight="500">Absolute longitudes</text>
      <text x="66" y="91" fill={INK_SECONDARY} fontSize="12">A {calc.a.toFixed(2)}° to B {calc.b.toFixed(2)}°</text>
      <text x="66" y="110" fill={INK_MUTED} fontSize="11">diff = {calc.diff.toFixed(2)}°</text>
      <rect x="510" y="42" width="220" height="78" rx="8" fill={softFill(point.color)} stroke={point.color} strokeWidth="1.5" />
      <text x="528" y="68" fill={point.color} fontSize="13" fontWeight="500">{clusterMode ? "House view" : "Composite result"}</text>
      <text x="528" y="91" fill={INK_SECONDARY} fontSize="12">{formatLongitude(calc.midpoint)}</text>
      <text x="528" y="110" fill={INK_MUTED} fontSize="11">{clusterMode ? `Leo Lagna -> ${point.house}` : calc.branch === "forward" ? "forward shorter arc" : "backward shorter arc"}</text>
      {view === "chart" && <ChartTable />}
      {view === "houses" && <HouseClusters />}
      {view === "formula" && <FormulaPanel calc={calc} />}
    </svg>
  );
}

function FormulaPanel({ calc }: { calc: ReturnType<typeof calculateMidpoint> }) {
  return (
    <g>
      <rect x="232" y="342" width="316" height="48" rx="8" fill={softFill(calc.branch === "forward" ? GREEN : VERMILION)} stroke={calc.branch === "forward" ? GREEN : VERMILION} strokeWidth="1.5" />
      <text x="390" y="362" textAnchor="middle" fill={calc.branch === "forward" ? GREEN : VERMILION} fontSize="13" fontWeight="500">
        {calc.branch === "forward" ? "midpoint = A + diff / 2" : "midpoint = A - (360 - diff) / 2"}
      </text>
      <text x="390" y="381" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">converted back to sign + degree after modulo 360</text>
    </g>
  );
}

function ChartTable() {
  return (
    <g>
      <rect x="54" y="318" width="672" height="64" rx="8" fill="#FFFCF2" stroke={HAIRLINE} />
      <text x="74" y="342" fill={BLUE} fontSize="12" fontWeight="500">H11 cluster</text>
      <text x="74" y="363" fill={INK_SECONDARY} fontSize="11">Sun, Moon, Venus in Gemini</text>
      <text x="318" y="342" fill={GREEN} fontSize="12" fontWeight="500">H7 cluster</text>
      <text x="318" y="363" fill={INK_SECONDARY} fontSize="11">Jupiter, Saturn in Aquarius</text>
      <text x="552" y="342" fill={ACCENT} fontSize="12" fontWeight="500">Lagna</text>
      <text x="552" y="363" fill={INK_SECONDARY} fontSize="11">Leo 25°50&apos;00&quot;</text>
    </g>
  );
}

function HouseClusters() {
  return (
    <g>
      <rect x="74" y="318" width="632" height="64" rx="8" fill="#FFFCF2" stroke={HAIRLINE} />
      <text x="390" y="342" textAnchor="middle" fill={GREEN} fontSize="13" fontWeight="500">Mechanically-derived house flags</text>
      <text x="390" y="365" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">Gemini H11 concentration and Aquarius H7 concentration are derived, not hand-picked.</text>
    </g>
  );
}

function PointDot({ point, label, color }: { point: { x: number; y: number }; label: string; color: string }) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r="10" fill={softFill(color)} stroke={color} strokeWidth="2.2" />
      <text x={point.x} y={point.y - 15} textAnchor="middle" fill={color} fontSize="11" fontWeight="500">{label}</text>
    </g>
  );
}

function ViewButton({ view, target, onSelect, label }: { view: ViewKey; target: ViewKey; onSelect: (view: ViewKey) => void; label: string }) {
  const active = view === target;
  return (
    <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={viewButtonStyle(active)}>
      {label}
    </button>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.35rem" }}>
      <span style={{ ...smallTextStyle, margin: 0 }}>{label}</span>
      <span style={{ color: INK_PRIMARY, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function calculateMidpoint(rawA: number, rawB: number, lowerFirst: boolean) {
  const a = lowerFirst ? Math.min(rawA, rawB) : rawA;
  const b = lowerFirst ? Math.max(rawA, rawB) : rawB;
  const diff = modulo(b - a, 360);
  const branch = diff <= 180 ? "forward" : "backward";
  const midpoint = branch === "forward" ? modulo(a + diff / 2, 360) : modulo(a - (360 - diff) / 2, 360);
  return { a, b, diff, branch, midpoint, naive: modulo((rawA + rawB) / 2, 360) };
}

function formatLongitude(value: number): string {
  const normalized = modulo(value, 360);
  const signIndex = Math.floor(normalized / 30);
  const within = normalized - signIndex * 30;
  const deg = Math.floor(within);
  const totalMinutes = Math.round((within - deg) * 60);
  return `${SIGN_NAMES[signIndex]} ${deg}°${String(totalMinutes).padStart(2, "0")}'00"`;
}

function modulo(value: number, mod: number): number {
  return ((value % mod) + mod) % mod;
}

function angularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

function polar(cx: number, cy: number, radius: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number, clockwise: boolean): string {
  const start = polar(cx, cy, radius, startDeg);
  const end = polar(cx, cy, radius, endDeg);
  const delta = clockwise ? modulo(endDeg - startDeg, 360) : modulo(startDeg - endDeg, 360);
  const largeArc = delta > 180 ? 1 : 0;
  const sweep = clockwise ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const pointGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(118px, 1fr))",
  gap: "0.55rem",
  marginTop: "0.85rem",
};

const segmentedStyle: CSSProperties = {
  display: "inline-grid",
  gridTemplateColumns: "repeat(3, minmax(76px, 1fr))",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  overflow: "hidden",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.94rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.4,
  fontSize: "0.84rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

function viewButtonStyle(active: boolean): CSSProperties {
  return {
    border: 0,
    borderRight: `1px solid ${HAIRLINE}`,
    background: active ? softFill(ACCENT) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    minHeight: 38,
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.86rem",
    fontWeight: 500,
  };
}

function pointButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
    padding: "0.65rem",
    display: "grid",
    gap: "0.2rem",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? softFill(ACCENT) : SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: "0.62rem",
    alignItems: "center",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.7rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontWeight: 500,
  };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
