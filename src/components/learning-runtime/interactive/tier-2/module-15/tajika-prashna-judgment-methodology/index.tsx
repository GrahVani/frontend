"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

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

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

const PLANETS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"] as const;
type Planet = (typeof PLANETS)[number];

const PLANET_DATA: Record<Planet, { speed: number; deeptamsa: number; color: string }> = {
  Sun: { speed: 1.0, deeptamsa: 15, color: VERMILION },
  Moon: { speed: 13.2, deeptamsa: 12, color: BLUE },
  Mars: { speed: 0.5, deeptamsa: 8, color: VERMILION },
  Mercury: { speed: 1.4, deeptamsa: 7, color: GREEN },
  Jupiter: { speed: 0.08, deeptamsa: 9, color: GREEN },
  Venus: { speed: 1.2, deeptamsa: 7, color: GOLD },
  Saturn: { speed: 0.03, deeptamsa: 9, color: PURPLE },
};

type Classification = "vartamana" | "bhavi" | "bhavi-obstructed" | "purna" | "isarpha" | "exact";

interface BodyState {
  planet: Planet;
  sign: number;
  degree: number;
  speed: number;
}

function wrapDeg(deg: number) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

function classify(
  faster: Planet,
  slower: Planet,
  fasterAbs: number,
  slowerAbs: number,
): {
  applying: boolean;
  separating: boolean;
  separation: number;
  combinedOrb: number;
  withinOrb: boolean;
  crossing: boolean;
  classification: Classification;
} {
  const combinedOrb = PLANET_DATA[faster].deeptamsa + PLANET_DATA[slower].deeptamsa;
  let applying = false;
  let separating = false;
  let separation = 0;

  if (Math.abs(fasterAbs - slowerAbs) < 0.0001) {
    separation = 0;
    applying = false;
    separating = false;
  } else if (fasterAbs < slowerAbs) {
    applying = true;
    separation = slowerAbs - fasterAbs;
  } else {
    separating = true;
    separation = fasterAbs - slowerAbs;
  }

  const withinOrb = separation <= combinedOrb;
  const fasterSign = Math.floor(fasterAbs / 30) % 12;
  const slowerSign = Math.floor(slowerAbs / 30) % 12;
  const crossing = applying && (fasterSign !== slowerSign || (fasterAbs % 30) + separation > 30);

  let classification: Classification = "isarpha";
  if (separation === 0) {
    classification = "exact";
  } else if (applying) {
    if (withinOrb && !crossing) classification = "vartamana";
    else if (withinOrb && crossing) classification = "bhavi-obstructed";
    else classification = "bhavi";
  } else if (separating) {
    if (withinOrb) classification = "purna";
    else classification = "isarpha";
  }

  return { applying, separating, separation, combinedOrb, withinOrb, crossing, classification };
}

const CLASS_LABEL: Record<Classification, { label: string; color: string; note: string }> = {
  vartamana: { label: "Vartamāna Ithasāla", color: GREEN, note: "Applying and already within combined orb — the strongest present-trend signal." },
  bhavi: { label: "Bhāvi Ithasāla", color: GOLD, note: "Applying, but not yet within combined orb — the matter may form later if motion continues." },
  "bhavi-obstructed": { label: "Bhāvi — sign-change obstruction", color: VERMILION, note: "Applying and within orb, but a sign boundary lies between the faster planet and exact aspect." },
  purna: { label: "Pūrṇa Ithasāla", color: BLUE, note: "Freshly exact and just separating — effects are still recent, not faded." },
  isarpha: { label: "Īsarpha", color: VERMILION, note: "Separating and out of orb — the trend is fading." },
  exact: { label: "Exact aspect", color: PURPLE, note: "The two significators share the same degree; read as a Pūrṇa threshold." },
};

export function TajikaPrashnaJudgmentMethodology() {
  const [querent, setQuerent] = useState<BodyState>({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
  const [quesited, setQuesited] = useState<BodyState>({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });

  const qAbs = wrapDeg(querent.sign * 30 + querent.degree);
  const sAbs = wrapDeg(quesited.sign * 30 + quesited.degree);

  const fasterPlanet = querent.speed >= quesited.speed ? querent.planet : quesited.planet;
  const slowerPlanet = fasterPlanet === querent.planet ? quesited.planet : querent.planet;
  const fasterAbs = fasterPlanet === querent.planet ? qAbs : sAbs;
  const slowerAbs = slowerPlanet === querent.planet ? qAbs : sAbs;

  const result = useMemo(
    () => classify(fasterPlanet, slowerPlanet, fasterAbs, slowerAbs),
    [fasterPlanet, slowerPlanet, fasterAbs, slowerAbs],
  );

  const setExample1 = () => {
    setQuerent({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
    setQuesited({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
  };

  const setExample2 = () => {
    // Example 2 assumes Venus is moving slowly/retrograde so Mars is the faster closing planet.
    setQuerent({ planet: "Mars", sign: 0, degree: 27, speed: PLANET_DATA.Mars.speed });
    setQuesited({ planet: "Venus", sign: 1, degree: 3, speed: 0.1 });
  };

  const reset = () => {
    setQuerent({ planet: "Mercury", sign: 2, degree: 8, speed: PLANET_DATA.Mercury.speed });
    setQuesited({ planet: "Jupiter", sign: 2, degree: 14, speed: PLANET_DATA.Jupiter.speed });
  };

  return (
    <div data-interactive="tajika-prashna-judgment-methodology" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tājika praśna judgment methodology</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Applying, separating, and the three sub-types
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Enter two significator longitudes. The tool identifies the faster planet, computes applying or separating motion, checks the combined deeptāṃśa orb, and classifies the result as Vartamāna, Bhāvi, Pūrṇa, or Īsarpha.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button type="button" onClick={setExample1} style={buttonStyle(false, BLUE)}>
              <Sparkles size={15} aria-hidden="true" />
              Example 1
            </button>
            <button type="button" onClick={setExample2} style={buttonStyle(false, BLUE)}>
              <Sparkles size={15} aria-hidden="true" />
              Example 2
            </button>
            <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
              <RotateCcw size={15} aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <BodyPanel label="Querent" body={querent} onChange={setQuerent} />
        <BodyPanel label="Quesited" body={quesited} onChange={setQuesited} />
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Verdict</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.55rem", alignItems: "stretch" }}>
          <VerdictPill label={result.applying ? "Applying" : result.separating ? "Separating" : "Exact"} color={result.applying ? GREEN : result.separating ? VERMILION : PURPLE} icon={<RefreshCw size={16} aria-hidden="true" />} />
          <VerdictPill label={`Separation ${result.separation.toFixed(1)}°`} color={INK_PRIMARY} icon={<ArrowRight size={16} aria-hidden="true" />} />
          <VerdictPill label={`Combined orb ${result.combinedOrb}°`} color={GOLD} icon={<BadgeCheck size={16} aria-hidden="true" />} />
          <VerdictPill label={result.withinOrb ? "Within orb" : "Out of orb"} color={result.withinOrb ? GREEN : VERMILION} icon={result.withinOrb ? <BadgeCheck size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />} />
        </div>

        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: "1px solid " + CLASS_LABEL[result.classification].color, background: CLASS_LABEL[result.classification].color + "10" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BadgeCheck size={18} style={{ color: CLASS_LABEL[result.classification].color }} aria-hidden="true" />
            <span style={{ color: CLASS_LABEL[result.classification].color, fontWeight: 600, fontSize: "1.05rem" }}>
              {CLASS_LABEL[result.classification].label}
            </span>
          </div>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{CLASS_LABEL[result.classification].note}</p>
        </div>

        {result.crossing && (
          <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + VERMILION, background: VERMILION + "10", color: VERMILION, fontSize: "0.9rem" }}>
            <AlertTriangle size={16} style={{ verticalAlign: "middle", marginRight: 4 }} aria-hidden="true" />
            Sign-change boundary: the faster planet must cross into the next sign before the aspect completes. This is flagged as a potential obstruction, not a clean same-sign yoga.
          </div>
        )}
      </section>

      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Zodiac motion diagram</p>
          <MotionDiagram faster={fasterPlanet} slower={slowerPlanet} fasterAbs={fasterAbs} slowerAbs={slowerAbs} result={result} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 280px" }}>
          <p style={eyebrowStyle}>Computation walkthrough</p>
          <ol style={{ margin: "0.45rem 0 0", paddingLeft: "1.1rem", color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
            <li>Identify the faster planet by effective daily motion: <span style={{ color: PLANET_DATA[fasterPlanet].color, fontWeight: 600 }}>{fasterPlanet}</span> ({(fasterPlanet === querent.planet ? querent.speed : quesited.speed).toFixed(2)}°/day) moves faster than <span style={{ color: PLANET_DATA[slowerPlanet].color, fontWeight: 600 }}>{slowerPlanet}</span> ({(slowerPlanet === querent.planet ? querent.speed : quesited.speed).toFixed(2)}°/day).</li>
            <li>{result.applying ? "The faster planet is behind and closing the gap." : result.separating ? "The faster planet has passed and is moving away." : "The two planets share the same degree."}</li>
            <li>Current separation = {result.separation.toFixed(1)}°.</li>
            <li>Combined orb = {PLANET_DATA[fasterPlanet].deeptamsa}° + {PLANET_DATA[slowerPlanet].deeptamsa}° = {result.combinedOrb}°.</li>
            <li>{result.withinOrb ? "Separation is within combined orb." : "Separation exceeds combined orb."}</li>
            <li>Classification: {CLASS_LABEL[result.classification].label}.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

function BodyPanel({ label, body, onChange }: { label: string; body: BodyState; onChange: (b: BodyState) => void }) {
  const data = PLANET_DATA[body.planet];
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>{label}</p>
      <div style={{ display: "grid", gap: "0.55rem" }}>
        <div style={{ position: "relative" }}>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Planet</label>
          <select value={body.planet} onChange={(e) => {
            const planet = e.target.value as Planet;
            onChange({ ...body, planet, speed: PLANET_DATA[planet].speed });
          }} style={selectStyle}>
            {PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, bottom: 10, pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
        </div>

        <div style={{ position: "relative" }}>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Sign</label>
          <select value={body.sign} onChange={(e) => onChange({ ...body, sign: parseInt(e.target.value, 10) })} style={selectStyle}>
            {SIGNS.map((s, i) => <option key={i} value={i}>{s}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 10, bottom: 10, pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
        </div>

        <div>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Degree (0–30)</label>
          <input type="number" min={0} max={30} step={0.1} value={body.degree} onChange={(e) => onChange({ ...body, degree: Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)) })} style={inputStyle} />
        </div>

        <div>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Effective speed (°/day)</label>
          <input type="number" step={0.01} value={body.speed} onChange={(e) => onChange({ ...body, speed: parseFloat(e.target.value) || 0 })} style={inputStyle} />
        </div>

        <div style={{ border: "1px solid " + data.color, borderRadius: 6, padding: "0.45rem", background: data.color + "10" }}>
          <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Deeptāṃśa</p>
          <p style={{ margin: "0.1rem 0 0", color: data.color, fontSize: "0.9rem", fontWeight: 600 }}>{data.deeptamsa}°</p>
        </div>
      </div>
    </section>
  );
}

function VerdictPill({ label, color, icon }: { label: string; color: string; icon: ReactNode }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.65rem", borderRadius: 6, border: "1px solid " + color, background: color + "10", color, fontWeight: 600, fontSize: "0.9rem" }}>
      {icon}
      {label}
    </div>
  );
}

function MotionDiagram({ faster, slower, fasterAbs, slowerAbs, result }: { faster: Planet; slower: Planet; fasterAbs: number; slowerAbs: number; result: ReturnType<typeof classify> }) {
  // Show a window from the faster planet's sign start minus padding to slower+padding
  const start = Math.floor(fasterAbs / 30) * 30 - 5;
  const end = Math.ceil(slowerAbs / 30) * 30 + 5;
  const width = Math.max(end - start, 70);
  const scale = 520 / width;

  function x(deg: number) {
    return (deg - start) * scale;
  }

  const y = 90;
  const fX = x(fasterAbs);
  const sX = x(slowerAbs);
  const fasterColor = PLANET_DATA[faster].color;
  const slowerColor = PLANET_DATA[slower].color;

  // sign boundary ticks
  const ticks: number[] = [];
  for (let d = Math.ceil(start / 30) * 30; d <= end; d += 30) {
    ticks.push(d);
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg viewBox={`0 0 520 180`} role="img" aria-label={`Motion diagram: ${faster} at ${fasterAbs.toFixed(1)} degrees and ${slower} at ${slowerAbs.toFixed(1)} degrees`} style={{ width: "100%", minWidth: 320, height: "auto" }}>
        <line x1={0} y1={y} x2={520} y2={y} stroke={HAIRLINE} strokeWidth={1} />
        {ticks.map((d, i) => (
          <g key={i}>
            <line x1={x(d)} y1={y - 8} x2={x(d)} y2={y + 8} stroke={HAIRLINE} strokeWidth={1} />
            <text x={x(d)} y={y + 24} fill={INK_MUTED} fontSize={10} fontWeight={600} textAnchor="middle">{SIGNS[(d / 30) % 12]} {d % 30 === 0 ? "0°" : ""}</text>
          </g>
        ))}

        {/* combined orb zone around faster */}
        <rect x={x(fasterAbs)} y={y - 18} width={result.combinedOrb * scale} height={36} fill={GOLD} opacity={0.08} />
        <line x1={x(fasterAbs + result.combinedOrb)} y1={y - 18} x2={x(fasterAbs + result.combinedOrb)} y2={y + 18} stroke={GOLD} strokeWidth={1} strokeDasharray="3 3" />

        {/* arrow from faster toward slower */}
        {result.separation > 0 && (
          <g>
            <line x1={fX + 8} y1={y} x2={sX - 8} y2={y} stroke={result.applying ? GREEN : VERMILION} strokeWidth={2} markerEnd={`url(#arrowhead-${result.applying ? "app" : "sep"})`} />
            <defs>
              <marker id={`arrowhead-app`} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={GREEN} />
              </marker>
              <marker id={`arrowhead-sep`} markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={VERMILION} />
              </marker>
            </defs>
          </g>
        )}

        {/* faster marker */}
        <circle cx={fX} cy={y} r={7} fill={fasterColor} />
        <text x={fX} y={y - 16} fill={fasterColor} fontSize={11} fontWeight={600} textAnchor="middle">{faster}</text>
        <text x={fX} y={y - 28} fill={INK_MUTED} fontSize={10} fontWeight={600} textAnchor="middle">{fasterAbs.toFixed(1)}°</text>

        {/* slower marker */}
        <circle cx={sX} cy={y} r={7} fill={slowerColor} />
        <text x={sX} y={y + 34} fill={slowerColor} fontSize={11} fontWeight={600} textAnchor="middle">{slower}</text>
        <text x={sX} y={y + 46} fill={INK_MUTED} fontSize={10} fontWeight={600} textAnchor="middle">{slowerAbs.toFixed(1)}°</text>
      </svg>
    </div>
  );
}

const cardStyle: CSSProperties = { background: SURFACE, border: "1px solid " + HAIRLINE, borderRadius: 8, padding: "0.9rem 1rem" };
const eyebrowStyle: CSSProperties = { color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 0.25rem" };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 600,
    padding: "0.35rem 0.65rem", borderRadius: 6, cursor: "pointer",
    border: "1px solid " + color, background: active ? color : "transparent", color: active ? "white" : color,
  };
}

const selectStyle: CSSProperties = {
  width: "100%", appearance: "none", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE,
  borderRadius: 6, padding: "0.4rem 1.6rem 0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};

const inputStyle: CSSProperties = {
  width: "100%", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE, borderRadius: 6,
  padding: "0.4rem 0.55rem", fontSize: "0.9rem", fontWeight: 500,
};
