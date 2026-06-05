"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, Landmark, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#7A5BA6";

type PatternKey = "obstacle" | "support" | "calling" | "repair";
type SubstrateTone = "supportive" | "mixed" | "heavy";
type TimeStatus = "rectified" | "uncertain" | "rough";
type PathKey = "karma" | "bhakti" | "jnana" | "yoga";

const PATTERNS: Record<PatternKey, { label: string; d1: string; what: string }> = {
  obstacle: {
    label: "Recurring obstacle",
    d1: "D1 shows a repeated friction pattern in visible life.",
    what: "The WHAT is the manifest pattern: delays, resistance, or repeated effort in a domain.",
  },
  support: {
    label: "Natural support",
    d1: "D1 shows ease, help, or stable promise in a life area.",
    what: "The WHAT is the visible support: opportunity, protection, or smoother manifestation.",
  },
  calling: {
    label: "Life calling",
    d1: "D1 shows a strong directional pull toward a duty or vocation.",
    what: "The WHAT is the outer shape of purpose: role, field, responsibility, and public expression.",
  },
  repair: {
    label: "Repair theme",
    d1: "D1 shows a place where conscious repair and discipline are repeatedly required.",
    what: "The WHAT is the life curriculum: where attention, humility, and practice are needed.",
  },
};

const SUBSTRATES: Record<SubstrateTone, { label: string; why: string; color: string }> = {
  supportive: {
    label: "Supportive substrate",
    why: "D60 suggests inherited ground that helps the D1 pattern flower more easily.",
    color: GREEN,
  },
  mixed: {
    label: "Mixed substrate",
    why: "D60 suggests both support and old pressure beneath the D1 pattern; read the exact layer carefully.",
    color: GOLD,
  },
  heavy: {
    label: "Heavy substrate",
    why: "D60 suggests deeper inherited pressure beneath the D1 pattern, to be worked with rather than feared.",
    color: VERMILION,
  },
};

const PATHS: Record<PathKey, { label: string; body: string; color: string }> = {
  karma: { label: "Karma", body: "right action, service, responsibility", color: BLUE },
  bhakti: { label: "Bhakti", body: "devotion, surrender, softening pride", color: VERMILION },
  jnana: { label: "Jnana", body: "discernment, study, clear seeing", color: PURPLE },
  yoga: { label: "Yoga", body: "discipline, practice, embodied steadiness", color: GREEN },
};

export function D1D60Comparator() {
  const [patternKey, setPatternKey] = useState<PatternKey>("obstacle");
  const [substrateTone, setSubstrateTone] = useState<SubstrateTone>("mixed");
  const [timeStatus, setTimeStatus] = useState<TimeStatus>("rectified");
  const [pathKey, setPathKey] = useState<PathKey>("yoga");
  const [showHighest, setShowHighest] = useState(true);
  const [showAgency, setShowAgency] = useState(true);

  const pattern = PATTERNS[patternKey];
  const substrate = SUBSTRATES[substrateTone];
  const path = PATHS[pathKey];
  const canReadD60 = timeStatus === "rectified";
  const activeColor = canReadD60 ? substrate.color : VERMILION;
  const synthesis = useMemo(() => getSynthesis(patternKey, substrateTone, timeStatus, pathKey), [pathKey, patternKey, substrateTone, timeStatus]);

  const reset = () => {
    setPatternKey("obstacle");
    setSubstrateTone("mixed");
    setTimeStatus("rectified");
    setPathKey("yoga");
    setShowHighest(true);
    setShowAgency(true);
  };

  return (
    <div data-interactive="d1-d60-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D1 and D60 doctrinal comparator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>D1 shows the what; D60 points to the why</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare a visible D1 pattern with the D60 substrate beneath it. The lesson is doctrinal: D60 is the deepest explanatory layer, not a second event-prediction machine.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Selected pattern</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>{pattern.label}</h3>
            </div>
            <strong style={{ color: activeColor }}>{canReadD60 ? "D60 permitted" : "D60 withheld"}</strong>
          </div>

          <D1D60Svg pattern={pattern.label} substrate={substrate.label} canReadD60={canReadD60} substrateColor={substrate.color} showHighest={showHighest} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem" }}>
            <ContrastCard label="D1" title="The WHAT" body={pattern.what} color={BLUE} />
            <ContrastCard label="D60" title="The WHY" body={canReadD60 ? substrate.why : "Birth time is not rectified, so the D60 explanation is withheld."} color={activeColor} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Choose D1 pattern" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: "0.45rem" }}>
              {(Object.keys(PATTERNS) as PatternKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setPatternKey(key)} style={buttonStyle(patternKey === key, BLUE)}>
                  {PATTERNS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{pattern.d1}</p>
          </Panel>

          <Panel title="Choose D60 substrate" icon={<Landmark size={18} />} color={substrate.color}>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {(Object.keys(SUBSTRATES) as SubstrateTone[]).map((key) => (
                <button key={key} type="button" onClick={() => setSubstrateTone(key)} style={buttonStyle(substrateTone === key, SUBSTRATES[key].color)}>
                  {SUBSTRATES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{substrate.why}</p>
          </Panel>

          <Panel title="Birth-time precondition" icon={<AlertTriangle size={18} />} color={canReadD60 ? GREEN : VERMILION}>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {(["rectified", "uncertain", "rough"] as TimeStatus[]).map((item) => (
                <button key={item} type="button" onClick={() => setTimeStatus(item)} style={buttonStyle(timeStatus === item, item === "rectified" ? GREEN : item === "uncertain" ? GOLD : VERMILION)}>
                  {item === "rectified" ? "Rectified" : item === "uncertain" ? "Uncertain" : "Rough time"}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {canReadD60 ? "The D60 doctrine may be discussed, still with humility." : "Do not invoke D60 authority on unrectified time. This is false precision."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <Panel title="Highest division claim" icon={<Sparkles size={18} />} color={showHighest ? GOLD : BLUE}>
          <button type="button" onClick={() => setShowHighest((value) => !value)} style={buttonStyle(showHighest, GOLD)}>
            {showHighest ? "Highest claim shown" : "Show highest claim"}
          </button>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {showHighest
              ? "Parashara's claim is depth, not license to overclaim: the finer division reaches the subtler karmic pattern."
              : "Without the doctrinal claim, the comparator still holds the D1/D60 contrast: what versus why."}
          </p>
        </Panel>

        <Panel title="Substrate is modifiable" icon={<ShieldCheck size={18} />} color={showAgency ? GREEN : VERMILION}>
          <button type="button" onClick={() => setShowAgency((value) => !value)} style={buttonStyle(showAgency, GREEN)}>
            {showAgency ? "Agency framing on" : "Show agency framing"}
          </button>
          {showAgency ? (
            <>
              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                {(Object.keys(PATHS) as PathKey[]).map((key) => (
                  <button key={key} type="button" onClick={() => setPathKey(key)} style={buttonStyle(pathKey === key, PATHS[key].color)}>
                    {PATHS[key].label}
                  </button>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                {path.label}: {path.body}. Substrate is inherited ground to work with, not a sentence to serve.
              </p>
            </>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Without agency framing, D60 language drifts toward fatalism. Turn the framing back on before interpreting.</p>
          )}
        </Panel>
      </div>

      <section style={{ ...surfaceStyle, borderColor: `${activeColor}66`, background: `${activeColor}10` }}>
        <p style={eyebrowStyle}>Doctrinal synthesis</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 600 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function D1D60Svg({ pattern, substrate, canReadD60, substrateColor, showHighest }: { pattern: string; substrate: string; canReadD60: boolean; substrateColor: string; showHighest: boolean }) {
  return (
    <svg viewBox="0 0 620 430" role="img" aria-label="D1 what and D60 why doctrinal comparison" style={{ ...svgStyle, maxHeight: 460 }}>
      <rect x="34" y="34" width="552" height="356" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="66" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="800">
        {showHighest ? "D60: highest division as deepest explanatory layer" : "D1 and D60 must be read together"}
      </text>

      <rect x="60" y="116" width="210" height="150" rx="8" fill={`${BLUE}14`} stroke={BLUE} strokeWidth="2.4" />
      <text x="165" y="151" textAnchor="middle" fill={BLUE} fontSize="24" fontWeight="800">D1</text>
      <text x="165" y="181" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="800">WHAT</text>
      <text x="165" y="217" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="750">{pattern}</text>
      <text x="165" y="242" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="700">gross life pattern</text>

      <line x1="286" y1="192" x2="334" y2="192" stroke={canReadD60 ? substrateColor : HAIRLINE} strokeWidth="5" strokeLinecap="round" />
      <text x="310" y="172" textAnchor="middle" fill={canReadD60 ? substrateColor : VERMILION} fontSize="13" fontWeight="750">
        {canReadD60 ? "explained by" : "withheld"}
      </text>

      <rect x="350" y="116" width="210" height="150" rx="8" fill={`${substrateColor}14`} stroke={canReadD60 ? substrateColor : VERMILION} strokeWidth="2.4" />
      <text x="455" y="151" textAnchor="middle" fill={canReadD60 ? substrateColor : VERMILION} fontSize="24" fontWeight="800">D60</text>
      <text x="455" y="181" textAnchor="middle" fill={INK_PRIMARY} fontSize="17" fontWeight="800">WHY</text>
      <text x="455" y="217" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="750">{canReadD60 ? substrate : "not usable"}</text>
      <text x="455" y="242" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="700">subtle karmic ground</text>

      <text x="310" y="322" textAnchor="middle" fill={canReadD60 ? GREEN : VERMILION} fontSize="15" fontWeight="800">
        {canReadD60 ? (
          <>
            <tspan x="310">Substrate conditions probability.</tspan>
            <tspan x="310" dy="21">It does not determine the ending.</tspan>
          </>
        ) : (
          <>
            <tspan x="310">Rectify first.</tspan>
            <tspan x="310" dy="21">Do not read D60 from rough time.</tspan>
          </>
        )}
      </text>
    </svg>
  );
}

function ContrastCard({ label, title, body, color }: { label: string; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.9rem" }}>
      <p style={{ ...eyebrowStyle, color }}>{label}</p>
      <strong style={{ display: "block", color, marginTop: "0.25rem" }}>{title}</strong>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function getSynthesis(patternKey: PatternKey, substrateTone: SubstrateTone, timeStatus: TimeStatus, pathKey: PathKey) {
  if (timeStatus !== "rectified") {
    return "D1 can still be discussed, but D60 authority is withheld until birth time is rectified. Calling D60 the highest division does not excuse false precision.";
  }
  const d1 = PATTERNS[patternKey].label.toLowerCase();
  const d60 = SUBSTRATES[substrateTone].label.toLowerCase();
  const path = PATHS[pathKey].label;
  return `Read the ${d1} as the D1's visible WHAT, then use the ${d60} as the D60's underlying WHY. This is starting-condition language: it conditions probability and invites ${path} practice, but it is not destiny or a new event prediction.`;
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
    minHeight: 38,
  };
}

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.78rem",
  fontWeight: 800,
};

const svgStyle: CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
  margin: "0.85rem 0",
};
