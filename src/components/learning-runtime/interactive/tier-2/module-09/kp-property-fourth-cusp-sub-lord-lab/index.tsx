"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CircleDot, Crosshair, GitCompare, RotateCcw, ShieldCheck, Sparkles, TriangleAlert } from "lucide-react";

type FocusKey = "cusp" | "convergence" | "divergence" | "discipline";
type ScenarioKey = "chartP1" | "hypothetical";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const FOCUS: Record<FocusKey, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  cusp: {
    label: "Cusp",
    title: "Read the exact cusp degree",
    body: "Chart P1's 4th cusp is Capricorn 17d41m18s, in Shravana, with Saturn as the KP sub-lord.",
    icon: <Crosshair size={16} />,
    color: BLUE,
  },
  convergence: {
    label: "Converge",
    title: "Saturn appears by two independent routes",
    body: "Saturn is both the KP 4th-cusp sub-lord and the classical rasi-lord of Capricorn.",
    icon: <CircleDot size={16} />,
    color: GREEN,
  },
  divergence: {
    label: "Diverge",
    title: "Saturn shifts houses by system",
    body: "Whole-sign places Saturn in the 8th; Placidus-cuspal counting places it in the 7th.",
    icon: <GitCompare size={16} />,
    color: GOLD,
  },
  discipline: {
    label: "Discipline",
    title: "Structural convergence is not a verdict",
    body: "The same planet appearing twice is meaningful, but it is not double evidence and not automatic favourability.",
    icon: <ShieldCheck size={16} />,
    color: VERMILION,
  },
};

const SCENARIOS: Record<ScenarioKey, { label: string; subLord: string; rasiLord: string; wholeHouse: string; placidusHouse: string; color: string }> = {
  chartP1: {
    label: "Chart P1",
    subLord: "Saturn",
    rasiLord: "Saturn",
    wholeHouse: "8th",
    placidusHouse: "7th",
    color: GREEN,
  },
  hypothetical: {
    label: "Different chart",
    subLord: "Moon",
    rasiLord: "Saturn",
    wholeHouse: "8th",
    placidusHouse: "8th",
    color: PURPLE,
  },
};

export function KpPropertyFourthCuspSubLordLab() {
  const [focusKey, setFocusKey] = useState<FocusKey>("cusp");
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>("chartP1");
  const [useExactCusp, setUseExactCusp] = useState(true);
  const [avoidDoubleCount, setAvoidDoubleCount] = useState(true);
  const [labelHouseSystem, setLabelHouseSystem] = useState(true);

  const focus = FOCUS[focusKey];
  const scenario = SCENARIOS[scenarioKey];
  const converges = scenario.subLord === scenario.rasiLord;
  const diverges = scenario.wholeHouse !== scenario.placidusHouse;

  const verdict = useMemo(() => {
    if (!useExactCusp) return { label: "exact cusp needed", color: VERMILION };
    if (!avoidDoubleCount && converges) return { label: "double-counting warning", color: GOLD };
    if (!labelHouseSystem && diverges) return { label: "house system unlabeled", color: VERMILION };
    if (converges) return { label: "Saturn structural convergence", color: GREEN };
    return { label: "sub-lord differs from rasi-lord", color: PURPLE };
  }, [avoidDoubleCount, converges, diverges, labelHouseSystem, useExactCusp]);

  const reading = useMemo(() => {
    if (!useExactCusp) return "Repair the method: KP sub-lord reading depends on the exact 4th cusp degree, not a rounded sign-level estimate.";
    if (!avoidDoubleCount && converges) return "Saturn appears through two independently computed roles, but it remains one planet and one consistent finding, not two weighted votes.";
    if (!labelHouseSystem && diverges) return "State the system every time: Saturn is whole-sign 8th, but Placidus-cuspal 7th.";
    if (scenarioKey === "chartP1") return "Chart P1: 4th cusp Capricorn 17d41m18s, Shravana, sub-lord Saturn. Saturn also rules Capricorn, and its house differs by system.";
    return "Hypothetical contrast: the sub-lord and rasi-lord can differ, so Chart P1's Saturn match is a real computed convergence.";
  }, [avoidDoubleCount, converges, diverges, labelHouseSystem, scenarioKey, useExactCusp]);

  return (
    <div data-interactive="kp-property-fourth-cusp-sub-lord-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>KP property cusp lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Verify the Chart P1 4th cusp sub-lord without over-reading it
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Confirm the exact cusp, compare KP sub-lord with classical rasi-lord, and label the Saturn whole-sign versus Placidus house shift.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusKey("cusp"); setScenarioKey("chartP1"); setUseExactCusp(true); setAvoidDoubleCount(true); setLabelHouseSystem(true); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setFocusKey(key)} style={buttonStyle(focusKey === key, FOCUS[key].color)}>
              {FOCUS[key].icon}
              {FOCUS[key].label}
            </button>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(280px, 0.65fr)", gap: "1rem", alignItems: "start" }}>
        <div style={cardStyle}>
          <KpCuspSvg scenario={scenario} verdict={verdict} converges={converges} diverges={diverges} />
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>lesson lens</p>
            <h3 style={{ margin: 0, color: focus.color, fontSize: "1.06rem", fontWeight: 600 }}>{focus.title}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{focus.body}</p>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>comparison case</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "0.5rem" }}>
              {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setScenarioKey(key)} style={optionStyle(scenarioKey === key, SCENARIOS[key].color)}>
                  <span style={{ fontWeight: 600 }}>{SCENARIOS[key].label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>{SCENARIOS[key].subLord} / {SCENARIOS[key].rasiLord}</span>
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>KP discipline</p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              <ToggleRow title="Use exact cusp" body="Capricorn 17d41m18s, not just Capricorn." color={BLUE} value={useExactCusp} onToggle={() => setUseExactCusp((value) => !value)} />
              <ToggleRow title="Avoid double count" body="Same planet in two roles is not two weighted votes." color={GOLD} value={avoidDoubleCount} onToggle={() => setAvoidDoubleCount((value) => !value)} />
              <ToggleRow title="Label house system" body="Whole-sign 8th and Placidus 7th both need labels." color={VERMILION} value={labelHouseSystem} onToggle={() => setLabelHouseSystem((value) => !value)} />
            </div>
          </section>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start", flexWrap: "wrap" }}>
          <div style={{ color: verdict.color, marginTop: "0.15rem" }}>{verdict.color === VERMILION ? <TriangleAlert size={18} aria-hidden="true" /> : <Sparkles size={18} aria-hidden="true" />}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={eyebrowStyle}>current KP reading</p>
            <h3 style={{ margin: 0, color: verdict.color, fontSize: "1.1rem", fontWeight: 600 }}>{verdict.label}</h3>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{reading}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function KpCuspSvg({ scenario, verdict, converges, diverges }: { scenario: (typeof SCENARIOS)[ScenarioKey]; verdict: { label: string; color: string }; converges: boolean; diverges: boolean }) {
  return (
    <svg viewBox="0 0 760 520" role="img" aria-label="KP fourth cusp sub-lord property diagram" style={{ width: "100%", minHeight: 440, display: "block" }}>
      <rect x="12" y="12" width="736" height="496" rx="20" fill={SURFACE} stroke={HAIRLINE} />
      <text x="380" y="56" textAnchor="middle" fill={GOLD} fontSize="18" fontWeight="700">KP 4TH CUSP PROPERTY CHECK</text>
      <text x="380" y="92" textAnchor="middle" fill={verdict.color} fontSize="22" fontWeight="700">{verdict.label}</text>

      <rect x="46" y="142" width="210" height="112" rx="16" fill={BLUE} fillOpacity="0.1" stroke={BLUE} strokeWidth="1.5" />
      <text x="151" y="178" textAnchor="middle" fill={BLUE} fontSize="16" fontWeight="700">Exact 4th cusp</text>
      <text x="151" y="210" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="600">Cap 17d41m18s</text>
      <text x="151" y="234" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">Shravana / Moon</text>

      <rect x="275" y="142" width="210" height="112" rx="16" fill={converges ? GREEN : PURPLE} fillOpacity="0.1" stroke={converges ? GREEN : PURPLE} strokeWidth="1.5" />
      <text x="380" y="178" textAnchor="middle" fill={converges ? GREEN : PURPLE} fontSize="16" fontWeight="700">Sub-lord vs rasi-lord</text>
      <text x="380" y="211" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="600">{scenario.subLord} / {scenario.rasiLord}</text>
      <text x="380" y="235" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">{converges ? "same planet" : "different planets"}</text>

      <rect x="504" y="142" width="210" height="112" rx="16" fill={diverges ? GOLD : GREEN} fillOpacity="0.1" stroke={diverges ? GOLD : GREEN} strokeWidth="1.5" />
      <text x="609" y="178" textAnchor="middle" fill={diverges ? GOLD : GREEN} fontSize="16" fontWeight="700">Saturn house</text>
      <text x="609" y="211" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight="600">WS {scenario.wholeHouse} / KP {scenario.placidusHouse}</text>
      <text x="609" y="235" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="600">{diverges ? "document divergence" : "same placement"}</text>

      <path d="M150 352 C254 292 506 292 610 352" fill="none" stroke={verdict.color} strokeWidth="6" strokeLinecap="round" />
      <circle cx="380" cy="326" r="34" fill={verdict.color} fillOpacity="0.14" stroke={verdict.color} strokeWidth="1.5" />
      <text x="380" y="333" textAnchor="middle" fill={verdict.color} fontSize="14" fontWeight="700">hold</text>
      <text x="380" y="420" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">Structural convergence tells which planet is central; favourability needs the full Saturn condition.</text>
      <text x="380" y="468" textAnchor="middle" fill={verdict.color} fontSize="15" fontWeight="700">{scenario.label}</text>
    </svg>
  );
}

function ToggleRow({ title, body, color, value, onToggle }: { title: string; body: string; color: string; value: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} style={toggleStyle(value, color)}>
      <span style={{ display: "grid", gap: "0.15rem", textAlign: "left" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</span>
      </span>
      <span style={{ width: 42, height: 23, borderRadius: 999, border: `1px solid ${value ? color : HAIRLINE}`, background: value ? `${color}24` : SURFACE, padding: 2, display: "flex", justifyContent: value ? "flex-end" : "flex-start", flex: "0 0 auto" }}>
        <span style={{ width: 17, height: 17, borderRadius: 999, background: value ? color : INK_MUTED }} />
      </span>
    </button>
  );
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, boxShadow: "var(--gl-shadow-soft)", padding: "1rem" };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.72rem", fontWeight: 600 };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 999, background: active ? `${color}18` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.55rem 0.78rem", cursor: "pointer", fontWeight: 600 };
}

function optionStyle(active: boolean, color: string): CSSProperties {
  return { display: "grid", gap: "0.18rem", textAlign: "left", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}12` : SURFACE, color: active ? color : INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem", border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? `${color}10` : SURFACE, color: INK_SECONDARY, padding: "0.72rem", cursor: "pointer" };
}
