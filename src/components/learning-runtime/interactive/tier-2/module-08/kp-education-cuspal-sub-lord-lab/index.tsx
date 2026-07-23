"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BookOpen, CircleDot, GraduationCap, Orbit, RotateCcw, School, ShieldCheck, TriangleAlert } from "lucide-react";

type ScenarioId = "chartE1" | "marsShift" | "jupiterShift" | "errorMode" | "roughDegree";
type FocusMode = "doctrine" | "cusps" | "shifts" | "subLords" | "framework";
type CuspKey = "4" | "5" | "9";
type GrahaKey = "mars" | "jupiter";

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

const CUSPS: Record<CuspKey, { label: string; degree: string; nakshatra: string; subLord: string; domain: string; color: string }> = {
  "4": { label: "4th cusp", degree: "Sagittarius 7d55m45s", nakshatra: "Mula / Ketu", subLord: "Jupiter", domain: "foundational education", color: BLUE },
  "5": { label: "5th cusp", degree: "Capricorn 8d08m02s", nakshatra: "Uttara Ashadha / Sun", subLord: "Venus", domain: "applied learning", color: GOLD },
  "9": { label: "9th cusp", degree: "Taurus 7d48m13s", nakshatra: "Krittika / Sun", subLord: "Venus", domain: "higher education", color: PURPLE },
};

const GRAHAS: Record<GrahaKey, { label: string; degree: string; whole: string; placidus: string; reason: string; color: string }> = {
  mars: {
    label: "Mars",
    degree: "Capricorn 8d00m00s",
    whole: "5th",
    placidus: "4th",
    reason: "Mars is before cusp 5 at Capricorn 8d08m02s, so it remains in the 4th cuspal span.",
    color: VERMILION,
  },
  jupiter: {
    label: "Jupiter",
    degree: "Pisces 6d00m00s",
    whole: "7th",
    placidus: "6th",
    reason: "Jupiter is before cusp 7 at Pisces 8d00m00s, so it remains in the 6th cuspal span.",
    color: GREEN,
  },
};

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    title: string;
    activeCusp: CuspKey;
    activeGraha: GrahaKey;
    useExactDegree: boolean;
    holdBothSystems: boolean;
    readBySubLord: boolean;
    color: string;
    context: string;
  }
> = {
  chartE1: {
    label: "Chart E1",
    title: "4/5/9 KP education cusps",
    activeCusp: "4",
    activeGraha: "mars",
    useExactDegree: true,
    holdBothSystems: true,
    readBySubLord: true,
    color: BLUE,
    context: "The 4th cusp has Jupiter as sub-lord; the 5th and 9th cusps have Venus as sub-lord.",
  },
  marsShift: {
    label: "Mars shift",
    title: "Whole-sign 5th, Placidus 4th",
    activeCusp: "5",
    activeGraha: "mars",
    useExactDegree: true,
    holdBothSystems: true,
    readBySubLord: true,
    color: VERMILION,
    context: "Mars at Capricorn 8d00m sits before the 5th cusp begins, so KP places it in the 4th cuspal house.",
  },
  jupiterShift: {
    label: "Jupiter shift",
    title: "Whole-sign 7th, Placidus 6th",
    activeCusp: "9",
    activeGraha: "jupiter",
    useExactDegree: true,
    holdBothSystems: true,
    readBySubLord: true,
    color: GREEN,
    context: "Jupiter at Pisces 6d00m sits before the 7th cusp begins, so KP places it in the 6th cuspal house.",
  },
  errorMode: {
    label: "Error mode",
    title: "Divergence is treated as a mistake",
    activeCusp: "4",
    activeGraha: "mars",
    useExactDegree: true,
    holdBothSystems: false,
    readBySubLord: true,
    color: GOLD,
    context: "Whole-sign and Placidus can validly disagree because they define houses differently. Neither reading is automatically wrong.",
  },
  roughDegree: {
    label: "Rough cusp",
    title: "Sub-lord is read from an approximate degree",
    activeCusp: "5",
    activeGraha: "mars",
    useExactDegree: false,
    holdBothSystems: true,
    readBySubLord: false,
    color: PURPLE,
    context: "In KP, a sub-lord reading is only as reliable as the exact cusp degree underneath it.",
  },
};

const FOCUS_COPY: Record<FocusMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  doctrine: {
    label: "Doctrine",
    title: "The cusp sub-lord is the activation determinant",
    body: "KP reads the exact cusp degree. The sub-lord at that degree decides house promise polarity.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  cusps: {
    label: "Cusps",
    title: "Education uses the 4th, 5th, and 9th cusps",
    body: "Foundational education, applied learning, and higher education are read from three exact Placidus cusps.",
    icon: <School size={16} />,
    color: BLUE,
  },
  shifts: {
    label: "Shifts",
    title: "Two grahas shift house under Placidus",
    body: "Mars and Jupiter fall before the next cusp begins. The other grahas remain in matching houses.",
    icon: <Orbit size={16} />,
    color: GOLD,
  },
  subLords: {
    label: "Sub-lords",
    title: "Chart E1: Jupiter, Venus, Venus",
    body: "The 4th cusp routes to Jupiter; the 5th and 9th both route to Venus.",
    icon: <GraduationCap size={16} />,
    color: PURPLE,
  },
  framework: {
    label: "Framework",
    title: "Hold both systems inside their own rules",
    body: "Whole-sign readings from Chapters 1-3 remain valid; KP Placidus readings are valid inside KP.",
    icon: <TriangleAlert size={16} />,
    color: VERMILION,
  },
};

export function KpEducationCuspalSubLordLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("chartE1");
  const [focusMode, setFocusMode] = useState<FocusMode>("doctrine");
  const [activeCusp, setActiveCusp] = useState<CuspKey>("4");
  const [activeGraha, setActiveGraha] = useState<GrahaKey>("mars");
  const [useExactDegree, setUseExactDegree] = useState(true);
  const [holdBothSystems, setHoldBothSystems] = useState(true);
  const [readBySubLord, setReadBySubLord] = useState(true);

  const scenario = SCENARIOS[scenarioId];
  const cusp = CUSPS[activeCusp];
  const graha = GRAHAS[activeGraha];
  const disciplineScore = Math.max(
    5,
    Math.min(96, 36 + (useExactDegree ? 22 : -18) + (holdBothSystems ? 20 : -22) + (readBySubLord ? 18 : -24)),
  );

  const verdict = useMemo(() => {
    if (!readBySubLord) return { label: "sub-lord doctrine missing", color: VERMILION };
    if (!useExactDegree) return { label: "exact cusp degree needed", color: GOLD };
    if (!holdBothSystems) return { label: "framework conflation warning", color: VERMILION };
    if (activeGraha === "mars") return { label: "Mars shift verified", color: VERMILION };
    return { label: "Jupiter shift verified", color: GREEN };
  }, [activeGraha, holdBothSystems, readBySubLord, useExactDegree]);

  const statement = useMemo(() => {
    if (!readBySubLord) return "Repair the KP method: the exact cuspal sub-lord, not the sign lord or house lord, is the activation-polarity determinant.";
    if (!useExactDegree) return "Use the exact cusp degree before reading the nakshatra and sub-lord. Rough degrees can change the result.";
    if (!holdBothSystems) return "Do not call one system wrong. Whole-sign and Placidus-cuspal houses are different frameworks with different rules.";
    return `${cusp.label} at ${cusp.degree} falls in ${cusp.nakshatra}; its sub-lord is ${cusp.subLord}. ${graha.label} is ${graha.whole} by whole-sign and ${graha.placidus} by Placidus because ${graha.reason}`;
  }, [cusp.degree, cusp.label, cusp.nakshatra, cusp.subLord, graha.label, graha.placidus, graha.reason, graha.whole, holdBothSystems, readBySubLord, useExactDegree]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setActiveCusp(next.activeCusp);
    setActiveGraha(next.activeGraha);
    setUseExactDegree(next.useExactDegree);
    setHoldBothSystems(next.holdBothSystems);
    setReadBySubLord(next.readBySubLord);
  }

  return (
    <div data-interactive="kp-education-cuspal-sub-lord-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP education cusp lab</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.28rem", fontWeight: 600 }}>
              Read Chart E1 by exact Placidus cusps and sub-lords
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Compare whole-sign and Placidus house placement, verify the two shifted grahas, and identify the 4th, 5th, and 9th cuspal sub-lords.
            </p>
          </div>
          <button type="button" onClick={() => { setFocusMode("doctrine"); loadScenario("chartE1"); }} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <BookOpen size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.06rem", fontWeight: 600 }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS_COPY) as FocusMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={focusMode === mode} onClick={() => setFocusMode(mode)} style={buttonStyle(focusMode === mode, FOCUS_COPY[mode].color)}>
              {FOCUS_COPY[mode].icon}
              {FOCUS_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS_COPY[focusMode].color}55`, borderRadius: 8, background: `${FOCUS_COPY[focusMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS_COPY[focusMode].color, fontSize: "1.05rem", fontWeight: 600 }}>{FOCUS_COPY[focusMode].title}</h3>
          <p style={bodyTextStyle}>{FOCUS_COPY[focusMode].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Cusp and shift map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 600 }}>{disciplineScore}% discipline</span>
          </div>
          <KpEducationSvg activeCusp={activeCusp} activeGraha={activeGraha} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Active cusp" body={cusp.label} color={cusp.color} icon={<School size={16} />} />
            <MiniFact title="Sub-lord" body={cusp.subLord} color={cusp.color} icon={<CircleDot size={16} />} />
            <MiniFact title="Shift" body={`${graha.whole} to ${graha.placidus}`} color={graha.color} icon={<Orbit size={16} />} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Education cusps</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            {(Object.keys(CUSPS) as CuspKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={activeCusp === key} onClick={() => setActiveCusp(key)} style={choiceStyle(activeCusp === key, CUSPS[key].color)}>
                <span style={{ fontWeight: 600 }}>{CUSPS[key].label}: {CUSPS[key].subLord}</span>
                <span>{CUSPS[key].domain}</span>
              </button>
            ))}
          </div>
          <p style={bodyTextStyle}>Use exact cusp degrees: 4th Jupiter, 5th Venus, 9th Venus.</p>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>House-system comparison</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            {(Object.keys(GRAHAS) as GrahaKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={activeGraha === key} onClick={() => setActiveGraha(key)} style={choiceStyle(activeGraha === key, GRAHAS[key].color)}>
                <span style={{ fontWeight: 600 }}>{GRAHAS[key].label}</span>
                <span>{GRAHAS[key].whole} whole-sign / {GRAHAS[key].placidus} Placidus</span>
              </button>
            ))}
          </div>
          <p style={bodyTextStyle}>{graha.reason}</p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>KP guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={readBySubLord} color={readBySubLord ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Read by cuspal sub-lord" body={readBySubLord ? "KP doctrine is active." : "Sign lord or house lord is replacing CSL."} onClick={() => setReadBySubLord((value) => !value)} />
            <Toggle active={useExactDegree} color={useExactDegree ? GREEN : GOLD} icon={<CircleDot size={18} />} title="Use exact cusp degree" body={useExactDegree ? "Arc-second degree is trusted." : "Rough degree can change sub-lord."} onClick={() => setUseExactDegree((value) => !value)} />
            <Toggle active={holdBothSystems} color={holdBothSystems ? GREEN : VERMILION} icon={<TriangleAlert size={18} />} title="Hold both systems" body={holdBothSystems ? "Divergence is not an error." : "One framework is invalidating the other."} onClick={() => setHoldBothSystems((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 600 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function KpEducationSvg({ activeCusp, activeGraha }: { activeCusp: CuspKey; activeGraha: GrahaKey }) {
  const cusp = CUSPS[activeCusp];
  const graha = GRAHAS[activeGraha];
  return (
    <svg viewBox="0 0 640 460" role="img" aria-label="KP education cusp and house shift map" style={{ width: "100%", minHeight: 380, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="604" height="424" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="320" y="58" textAnchor="middle" fill={GOLD} fontSize="17" fontWeight="700">CHART E1: KP PLACIDUS CUSPS</text>
      <text x="320" y="80" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">FOR EDUCATION</text>
      <line x1="88" y1="156" x2="552" y2="156" stroke={HAIRLINE} strokeWidth="5" />
      {(Object.keys(CUSPS) as CuspKey[]).map((key, index) => {
        const x = 120 + index * 200;
        const active = key === activeCusp;
        return (
          <g key={key}>
            <circle cx={x} cy="156" r={active ? 46 : 38} fill={`${CUSPS[key].color}14`} stroke={active ? CUSPS[key].color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
            <text x={x} y="149" textAnchor="middle" fill={active ? CUSPS[key].color : INK_SECONDARY} fontSize="14" fontWeight="700">{CUSPS[key].label}</text>
            <text x={x} y="172" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{CUSPS[key].subLord}</text>
          </g>
        );
      })}
      <rect x="62" y="250" width="250" height="86" rx="8" fill={`${cusp.color}12`} stroke={cusp.color} />
      <text x="187" y="277" textAnchor="middle" fill={cusp.color} fontSize="14" fontWeight="700">{cusp.label}: {cusp.degree}</text>
      <text x="187" y="302" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">{cusp.nakshatra}</text>
      <text x="187" y="323" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">Sub-lord: {cusp.subLord}</text>

      <rect x="328" y="250" width="250" height="86" rx="8" fill={`${graha.color}12`} stroke={graha.color} />
      <text x="453" y="277" textAnchor="middle" fill={graha.color} fontSize="14" fontWeight="700">{graha.label}: {graha.degree}</text>
      <text x="453" y="302" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">Whole-sign: {graha.whole}</text>
      <text x="453" y="323" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="600">Placidus: {graha.placidus}</text>

      <path d="M 312 293 C 326 274, 332 274, 328 293" fill="none" stroke={graha.color} strokeWidth="4" strokeLinecap="round" />
      <text x="320" y="372" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight="600">
        <tspan x="320" dy="0">Mars and Jupiter shift because they sit before</tspan>
        <tspan x="320" dy="20">the next Placidus cusp begins.</tspan>
      </text>
      <text x="320" y="420" textAnchor="middle" fill={GREEN} fontSize="14" fontWeight="700">Both frameworks are valid in their own rules.</text>
    </svg>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <span style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</span>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function choiceStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.68rem",
    display: "grid",
    gap: "0.25rem",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
  };
}
