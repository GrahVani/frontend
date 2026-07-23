"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Calculator,
  Clock3,
  GitCompare,
  MapPinned,
  Orbit,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type MethodKey = "ashta" | "synastry" | "composite";
type ReadingKey = "house" | "aspect" | "dignity" | "dasha" | "transit";
type TraditionKey = "midpoint" | "davison";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const METHODS: Record<MethodKey, { label: string; object: string; operation: string; icon: ReactNode; color: string }> = {
  ashta: {
    label: "Ashta-kuta",
    object: "A fixed compatibility score from both Moon positions.",
    operation: "Scores two charts without making a third chart.",
    icon: <Calculator size={16} />,
    color: ACCENT,
  },
  synastry: {
    label: "Synastry",
    object: "Two natal charts compared directly.",
    operation: "Overlays chart-to-chart houses, grahas, and aspects.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  composite: {
    label: "Composite",
    object: "A computed relational artifact.",
    operation: "Averages corresponding points into one midpoint chart.",
    icon: <Orbit size={16} />,
    color: GREEN,
  },
};

const READINGS: Record<ReadingKey, { label: string; allowed: boolean; body: string; icon: ReactNode }> = {
  house: {
    label: "House placement",
    allowed: true,
    body: "Usable when framed as the relationship's own emphasis, not either person's natal promise.",
    icon: <MapPinned size={16} />,
  },
  aspect: {
    label: "Aspect pattern",
    allowed: true,
    body: "Usable inside the composite frame because the computed chart is read as an internally consistent artifact.",
    icon: <Orbit size={16} />,
  },
  dignity: {
    label: "Dignity language",
    allowed: true,
    body: "Usable as borrowed reading vocabulary, with the modern origin disclosed honestly.",
    icon: <Sparkles size={16} />,
  },
  dasha: {
    label: "Dasha timing",
    allowed: false,
    body: "Not usable: dasha depends on a real birth event and elapsed Moon balance. The composite has no birth event.",
    icon: <Clock3 size={16} />,
  },
  transit: {
    label: "Transit trigger",
    allowed: false,
    body: "Not usable as natal-style timing because the composite Lagna is a midpoint, not a real horizon at birth.",
    icon: <ShieldAlert size={16} />,
  },
};

const METHOD_ORDER: MethodKey[] = ["ashta", "synastry", "composite"];
const READING_ORDER: ReadingKey[] = ["house", "aspect", "dignity", "dasha", "transit"];

export function CompositeChartPitfallWorkbench() {
  const [method, setMethod] = useState<MethodKey>("composite");
  const [reading, setReading] = useState<ReadingKey>("dasha");
  const [tradition, setTradition] = useState<TraditionKey>("midpoint");
  const [originNamed, setOriginNamed] = useState(true);
  const [artifactFramed, setArtifactFramed] = useState(true);
  const [birthMachineryBlocked, setBirthMachineryBlocked] = useState(true);

  const selectedMethod = METHODS[method];
  const selectedReading = READINGS[reading];
  const guardReady = originNamed && artifactFramed && birthMachineryBlocked;
  const trapActive = method === "composite" && !selectedReading.allowed && !birthMachineryBlocked;

  const result = useMemo(() => {
    if (!originNamed) return "Repair: name the composite chart as a 20th-century Western midpoint technique, not a classical Parashari source.";
    if (!artifactFramed) return "Repair: the composite describes a relationship artifact. It does not belong to a third person.";
    if (!birthMachineryBlocked) return "Repair: block dasha and transit timing. They require a real birth event that the composite chart does not have.";
    if (!selectedReading.allowed) return "Good catch: this reading belongs outside composite scope even when the chart looks natal.";
    return "Clean reading: the method is named honestly, the object is relational, and the chosen reading stays inside composite scope.";
  }, [artifactFramed, birthMachineryBlocked, originNamed, selectedReading.allowed]);

  return (
    <div data-interactive="composite-chart-pitfall-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Composite chart concept</p>
            <h2 style={headingStyle}>A relational artifact is not a third natal chart</h2>
            <p style={bodyStyle}>
              Compare the three relationship-analysis objects, then test which readings stay valid when a chart has no birth event behind it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMethod("composite");
              setReading("dasha");
              setTradition("midpoint");
              setOriginNamed(true);
              setArtifactFramed(true);
              setBirthMachineryBlocked(true);
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
          <p style={eyebrowStyle}>Object of analysis</p>
          <CompositeDiagram method={method} tradition={tradition} trapActive={trapActive} />
          <div style={methodGridStyle}>
            {METHOD_ORDER.map((key) => (
              <button key={key} type="button" onClick={() => setMethod(key)} aria-pressed={method === key} style={choiceButtonStyle(method === key, METHODS[key].color)}>
                <span style={{ color: METHODS[key].color }}>{METHODS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{METHODS[key].label}</span>
                  <span style={smallTextStyle}>{METHODS[key].operation}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selectedMethod.color }}>
            {selectedMethod.icon}
            <p style={eyebrowStyle}>{selectedMethod.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{selectedMethod.object}</h3>
          <p style={bodyStyle}>{selectedMethod.operation}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "1rem" }}>
            <button type="button" onClick={() => setTradition("midpoint")} aria-pressed={tradition === "midpoint"} style={miniButtonStyle(tradition === "midpoint", GREEN)}>
              Midpoint
            </button>
            <button type="button" onClick={() => setTradition("davison")} aria-pressed={tradition === "davison"} style={miniButtonStyle(tradition === "davison", BLUE)}>
              Davison
            </button>
          </div>
          <p style={smallTextStyle}>
            {tradition === "midpoint"
              ? "Canonical here: transparent midpoint averaging of corresponding points."
              : "Named alternative: time-space midpoint, still not a real birth."}
          </p>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Reading scope gate</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            {READING_ORDER.map((key) => (
              <button key={key} type="button" onClick={() => setReading(key)} aria-pressed={reading === key} style={readingButtonStyle(reading === key, READINGS[key].allowed ? GREEN : VERMILION)}>
                <span style={{ color: READINGS[key].allowed ? GREEN : VERMILION }}>{READINGS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{READINGS[key].label}</span>
                  <span style={smallTextStyle}>{READINGS[key].body}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Trap #1 guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={originNamed} onChange={setOriginNamed} label="Name the modern origin" body="Do not imply a BPHS or Jaimini lineage for midpoint construction." icon={<Users size={16} />} />
            <ToggleRow checked={artifactFramed} onChange={setArtifactFramed} label="Frame it as relational artifact" body="The composite belongs to the relationship, not to a third person." icon={<Orbit size={16} />} />
            <ToggleRow checked={birthMachineryBlocked} onChange={setBirthMachineryBlocked} label="Block birth-event machinery" body="Dasha and natal-style transit timing require a real birth event." icon={<Clock3 size={16} />} />
          </div>
          <div style={{ ...noticeStyle(guardReady && !trapActive ? GREEN : VERMILION), marginTop: "1rem" }}>
            {guardReady && !trapActive ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{guardReady && !trapActive ? "pitfall avoided" : "composite-as-natal risk"}</span>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {guardReady && !trapActive ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Classifier result</p>
            <h3 style={{ ...panelTitleStyle, color: guardReady && !trapActive ? GREEN : VERMILION }}>
              {guardReady && !trapActive ? "The category boundary is clean" : "Trap #1 is open"}
            </h3>
            <p style={bodyStyle}>{result}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CompositeChartPitfallWorkbench;

function CompositeDiagram({ method, tradition, trapActive }: { method: MethodKey; tradition: TraditionKey; trapActive: boolean }) {
  const methodColor = METHODS[method].color;

  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Composite chart, synastry, and compatibility score distinction" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <ChartCircle x={170} y={145} label="Chart A" color={BLUE} active={method !== "ashta"} />
      <ChartCircle x={610} y={145} label="Chart B" color={ACCENT} active={method !== "ashta"} />
      {method === "synastry" ? (
        <>
          <path d="M 232 145 C 318 90, 462 90, 548 145" fill="none" stroke={BLUE} strokeWidth="3" strokeDasharray="7 7" />
          <path d="M 232 170 C 320 235, 460 235, 548 170" fill="none" stroke={ACCENT} strokeWidth="3" strokeDasharray="7 7" />
          <text x="390" y="106" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight="500">direct comparison</text>
        </>
      ) : method === "composite" ? (
        <>
          <path d="M 232 150 C 310 210, 470 210, 548 150" fill="none" stroke={GREEN} strokeWidth="3" />
          <path d="M 232 124 C 308 78, 472 78, 548 124" fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="6 6" />
          <ChartCircle x={390} y={265} label={tradition === "midpoint" ? "Midpoint chart" : "Davison chart"} color={GREEN} active />
          <text x="390" y="226" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="500">{tradition === "midpoint" ? "computed average" : "time-space midpoint"}</text>
        </>
      ) : (
        <>
          <rect x="292" y="215" width="196" height="78" rx="8" fill={softFill(ACCENT)} stroke={ACCENT} strokeWidth="2" />
          <text x="390" y="246" textAnchor="middle" fill={ACCENT} fontSize="15" fontWeight="500">36-point score</text>
          <text x="390" y="270" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">no third chart</text>
        </>
      )}
      <rect x="247" y="334" width="286" height="50" rx="8" fill={trapActive ? "#F9E8E3" : softFill(methodColor)} stroke={trapActive ? VERMILION : methodColor} strokeWidth="2" />
      <text x="390" y="355" textAnchor="middle" fill={trapActive ? VERMILION : methodColor} fontSize="14" fontWeight="500">
        {trapActive ? "Trap #1: composite-as-natal" : METHODS[method].label}
      </text>
      <text x="390" y="375" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">
        {trapActive ? "birth machinery applied to no birth" : METHODS[method].object}
      </text>
    </svg>
  );
}

function ChartCircle({ x, y, label, color, active }: { x: number; y: number; label: string; color: string; active: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="66" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <circle cx={x} cy={y} r="42" fill="none" stroke={active ? color : HAIRLINE} strokeWidth="1.2" />
      <path d={`M ${x - 42} ${y} L ${x + 42} ${y} M ${x} ${y - 42} L ${x} ${y + 42}`} stroke={active ? color : HAIRLINE} strokeWidth="1" />
      <text x={x} y={y + 5} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="14" fontWeight="500">{label}</text>
    </g>
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

const methodGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))",
  gap: "0.65rem",
  marginTop: "0.85rem",
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

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
    padding: "0.72rem",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function readingButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.6rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function miniButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.86rem",
    fontWeight: 500,
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
