"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, CalendarClock, Eye, GitMerge, HandHeart, HeartHandshake, Layers3, Orbit, RotateCcw, Scale, ShieldCheck, TriangleAlert } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

type ScenarioId = "twoYesYear" | "annualOnly" | "lalKitabRemedy" | "overclaim";
type FocusId = "tajika" | "twoYes" | "lalKitab" | "remedy" | "layering";
type AspectMode = "ithasala" | "isarapha" | "none";
type VenusState = "awake" | "sleeping" | "blind";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const SCENARIOS: Record<
  ScenarioId,
  {
    label: string;
    title: string;
    dashaActive: boolean;
    munthaSeventh: boolean;
    yearLordVenus: boolean;
    aspect: AspectMode;
    venusState: VenusState;
    lalKitabRemedyNeed: boolean;
    overclaim: boolean;
    color: string;
    context: string;
  }
> = {
  twoYesYear: {
    label: "Two-yes year",
    title: "Dasha window plus annual chart agreement",
    dashaActive: true,
    munthaSeventh: true,
    yearLordVenus: true,
    aspect: "ithasala",
    venusState: "awake",
    lalKitabRemedyNeed: false,
    overclaim: false,
    color: GREEN,
    context: "The marriage dasha is active, muntha highlights the annual 7th, and Ithasala shows the matter coming together.",
  },
  annualOnly: {
    label: "Annual-only signal",
    title: "A varshaphala signal without the dasha yes",
    dashaActive: false,
    munthaSeventh: true,
    yearLordVenus: true,
    aspect: "ithasala",
    venusState: "awake",
    lalKitabRemedyNeed: false,
    overclaim: false,
    color: GOLD,
    context: "The annual chart looks marriage-prominent, but the dasha has not opened the marriage window.",
  },
  lalKitabRemedy: {
    label: "Lal Kitab support",
    title: "Marriage obstruction with remedy-honest framing",
    dashaActive: true,
    munthaSeventh: false,
    yearLordVenus: true,
    aspect: "none",
    venusState: "blind",
    lalKitabRemedyNeed: true,
    overclaim: false,
    color: BLUE,
    context: "The primary streams remain central, while Lal Kitab adds a recognition-level Venus obstruction and simple optional upaya.",
  },
  overclaim: {
    label: "Overclaim error",
    title: "Guaranteed marriage from overlay misuse",
    dashaActive: false,
    munthaSeventh: true,
    yearLordVenus: false,
    aspect: "ithasala",
    venusState: "blind",
    lalKitabRemedyNeed: true,
    overclaim: true,
    color: VERMILION,
    context: "A practitioner promises marriage next year from an annual signal and sells an expensive Lal Kitab remedy.",
  },
};

const FOCUS: Record<FocusId, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  tajika: {
    label: "Tajika",
    title: "Varshaphala refines the marriage year",
    body: "Muntha, year-lord, annual 7th/Venus, and Ithasala are read at recognition level inside the annual chart.",
    icon: <Orbit size={16} />,
    color: GOLD,
  },
  twoYes: {
    label: "Two yes",
    title: "Dasha yes plus annual yes",
    body: "The annual chart narrows a marriage-active dasha window. Annual alone is not enough for a confident year call.",
    icon: <BadgeCheck size={16} />,
    color: GREEN,
  },
  lalKitab: {
    label: "Lal Kitab",
    title: "Read the Lal Kitab note in its own frame",
    body: "Lal Kitab contributes its own marriage indicators and planetary-state language without being mixed into other streams.",
    icon: <Eye size={16} />,
    color: BLUE,
  },
  remedy: {
    label: "Remedy",
    title: "Upaya is optional support, never a guarantee",
    body: "A Lal Kitab marriage remedy must remain simple, optional, inexpensive, and free from fear-selling.",
    icon: <HandHeart size={16} />,
    color: PURPLE,
  },
  layering: {
    label: "Layering",
    title: "Supplementary overlays, not substitutes",
    body: "Tajika and Lal Kitab are recognition-level overlays layered with the primary marriage streams.",
    icon: <Layers3 size={16} />,
    color: VERMILION,
  },
};

const VENUS_STATE: Record<VenusState, { label: string; color: string; note: string }> = {
  awake: { label: "Awake Venus", color: GREEN, note: "Marriage support is active in the Lal Kitab overlay." },
  sleeping: { label: "Sleeping Venus", color: GOLD, note: "Marriage support is present but muted or delayed." },
  blind: { label: "Blind Venus", color: VERMILION, note: "The overlay flags obstruction and a remedy orientation." },
};

export function MarriageTajikaLalKitabOverlayWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("twoYesYear");
  const [focus, setFocus] = useState<FocusId>("twoYes");
  const [dashaActive, setDashaActive] = useState(true);
  const [munthaSeventh, setMunthaSeventh] = useState(true);
  const [yearLordVenus, setYearLordVenus] = useState(true);
  const [aspectMode, setAspectMode] = useState<AspectMode>("ithasala");
  const [venusState, setVenusState] = useState<VenusState>("awake");
  const [readLalKitabOwnTerms, setReadLalKitabOwnTerms] = useState(true);
  const [simpleOptionalRemedy, setSimpleOptionalRemedy] = useState(true);
  const [layerNotSubstitute, setLayerNotSubstitute] = useState(true);
  const [guaranteedDate, setGuaranteedDate] = useState(false);
  const [fearSelling, setFearSelling] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const annualYes = munthaSeventh && yearLordVenus && aspectMode === "ithasala";
  const twoYes = dashaActive && annualYes;
  const remedySafe = readLalKitabOwnTerms && simpleOptionalRemedy && !fearSelling;
  const methodOk = layerNotSubstitute && remedySafe && !guaranteedDate;
  const venus = VENUS_STATE[venusState];
  const overlayScore = Math.max(
    5,
    Math.min(96, (dashaActive ? 28 : 0) + (annualYes ? 30 : aspectMode === "isarapha" ? 10 : 4) + (venusState === "awake" ? 16 : venusState === "sleeping" ? 8 : 2) + (methodOk ? 18 : -25)),
  );

  const verdict = useMemo(() => {
    if (fearSelling || guaranteedDate || scenario.overclaim) return { label: "overlay overclaim refused", color: VERMILION };
    if (!layerNotSubstitute) return { label: "layering warning", color: VERMILION };
    if (!readLalKitabOwnTerms) return { label: "stream mixing warning", color: GOLD };
    if (twoYes) return { label: "marriage year likely window", color: GREEN };
    if (annualYes && !dashaActive) return { label: "annual signal only", color: GOLD };
    if (venusState === "blind") return { label: "supportive remedy overlay", color: BLUE };
    return { label: "supplementary context", color: PURPLE };
  }, [annualYes, dashaActive, fearSelling, guaranteedDate, layerNotSubstitute, readLalKitabOwnTerms, scenario.overclaim, twoYes, venusState]);

  const statement = useMemo(() => {
    if (fearSelling || guaranteedDate || scenario.overclaim) {
      return "Stop: the overlays are being used as a decree or sales tool. No guaranteed marriage year, no expensive fear-sold remedy, and no standalone overlay verdict.";
    }
    if (!layerNotSubstitute) return "Pause: Tajika and Lal Kitab are supplementary recognition-level overlays. They cannot replace the primary marriage streams.";
    if (!readLalKitabOwnTerms) return "Pause: Lal Kitab must be read in its own terms, not mixed into Parashari, Jaimini, Venus, or KP rules.";
    if (!simpleOptionalRemedy) return "Pause: upaya must be supportive, optional, and inexpensive.";
    if (twoYes) return "Honest reading: the dasha opens the marriage period and the Tajika annual chart gives a second yes. Hold this as a likely year window, not a fixed date.";
    if (annualYes && !dashaActive) return "Honest reading: the annual chart is marriage-prominent, but without the dasha yes it remains a lonely signal.";
    if (venusState === "blind") return "Honest reading: Lal Kitab adds a marriage-obstruction note and optional simple upaya, while the main marriage judgment remains with the primary streams.";
    if (aspectMode === "isarapha") return "Honest reading: the annual aspect is separating, so the marriage matter may be passing rather than coming together this year.";
    return "Honest reading: use both overlays as modest context and keep the final judgment layered with agency.";
  }, [annualYes, aspectMode, dashaActive, fearSelling, guaranteedDate, layerNotSubstitute, readLalKitabOwnTerms, scenario.overclaim, simpleOptionalRemedy, twoYes, venusState]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setDashaActive(next.dashaActive);
    setMunthaSeventh(next.munthaSeventh);
    setYearLordVenus(next.yearLordVenus);
    setAspectMode(next.aspect);
    setVenusState(next.venusState);
    setReadLalKitabOwnTerms(true);
    setSimpleOptionalRemedy(true);
    setLayerNotSubstitute(true);
    setGuaranteedDate(next.overclaim);
    setFearSelling(next.overclaim);
  }

  return (
    <div data-interactive="marriage-tajika-lal-kitab-overlay-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage overlay discipline</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>Use Tajika and Lal Kitab as supplementary overlays</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Refine a dasha-flagged marriage year with the annual chart, then add Lal Kitab only as a distinct remedy-honest overlay.
            </p>
          </div>
          <button type="button" onClick={() => { setFocus("twoYes"); loadScenario("twoYesYear"); }} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <CalendarClock size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.14rem" }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(FOCUS) as FocusId[]).map((id) => (
            <button key={id} type="button" aria-pressed={focus === id} onClick={() => setFocus(id)} style={buttonStyle(focus === id, FOCUS[id].color)}>
              {FOCUS[id].icon}
              {FOCUS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${FOCUS[focus].color}55`, borderRadius: 8, background: `${FOCUS[focus].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: FOCUS[focus].color, fontSize: "1.1rem" }}>{FOCUS[focus].title}</h3>
          <p style={bodyTextStyle}>{FOCUS[focus].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Overlay convergence map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.18rem" }}>{verdict.label}</h3>
            </div>
            <strong style={{ color: verdict.color }}>{overlayScore}% signal</strong>
          </div>
          <OverlayFlowSvg focus={focus} dashaActive={dashaActive} annualYes={annualYes} venusState={venusState} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Dasha" body={dashaActive ? "marriage-active" : "not active"} color={dashaActive ? GREEN : GOLD} icon={<Scale size={16} />} />
            <MiniFact title="Annual chart" body={annualYes ? "Tajika yes" : aspectMode} color={annualYes ? GREEN : GOLD} icon={<GitMerge size={16} />} />
            <MiniFact title="Lal Kitab" body={venus.label} color={venus.color} icon={<Eye size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Tajika year refinement" icon={<Orbit size={18} />} color={annualYes ? GREEN : GOLD}>
            <Toggle active={dashaActive} color={dashaActive ? GREEN : VERMILION} icon={<Scale size={18} />} title="Dasha marriage window" body={dashaActive ? "Primary timing says yes." : "Annual chart has no dasha field."} onClick={() => setDashaActive((value) => !value)} />
            <Toggle active={munthaSeventh} color={munthaSeventh ? GREEN : GOLD} icon={<CalendarClock size={18} />} title="Muntha on annual 7th/Venus" body={munthaSeventh ? "Marriage year is highlighted." : "Muntha does not emphasize marriage."} onClick={() => setMunthaSeventh((value) => !value)} />
            <Toggle active={yearLordVenus} color={yearLordVenus ? GREEN : GOLD} icon={<HeartHandshake size={18} />} title="Year-lord engages 7th/Venus" body={yearLordVenus ? "Annual ruler supports marriage matter." : "Year-lord is not marriage-engaged."} onClick={() => setYearLordVenus((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Tajika and Lal Kitab switches</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Panel title="Tajika aspect" icon={<GitMerge size={18} />} color={aspectMode === "ithasala" ? GREEN : aspectMode === "isarapha" ? GOLD : VERMILION}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(["ithasala", "isarapha", "none"] as AspectMode[]).map((mode) => (
                  <button key={mode} type="button" aria-pressed={aspectMode === mode} onClick={() => setAspectMode(mode)} style={buttonStyle(aspectMode === mode, mode === "ithasala" ? GREEN : mode === "isarapha" ? GOLD : VERMILION)}>
                    {mode}
                  </button>
                ))}
              </div>
            </Panel>
            <Panel title="Lal Kitab Venus state" icon={<Eye size={18} />} color={venus.color}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 115px), 1fr))", gap: "0.5rem" }}>
                {(Object.keys(VENUS_STATE) as VenusState[]).map((state) => (
                  <button key={state} type="button" aria-pressed={venusState === state} onClick={() => setVenusState(state)} style={stateButtonStyle(venusState === state, VENUS_STATE[state].color)}>
                    <strong style={{ fontWeight: 700 }}>{VENUS_STATE[state].label}</strong>
                    <span>{VENUS_STATE[state].note}</span>
                  </button>
                ))}
              </div>
            </Panel>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Overlay guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={readLalKitabOwnTerms} color={readLalKitabOwnTerms ? GREEN : VERMILION} icon={<Layers3 size={18} />} title="Read Lal Kitab in its own terms" body={readLalKitabOwnTerms ? "No stream mixing." : "Rules are being mixed indiscriminately."} onClick={() => setReadLalKitabOwnTerms((value) => !value)} />
            <Toggle active={simpleOptionalRemedy} color={simpleOptionalRemedy ? GREEN : GOLD} icon={<HandHeart size={18} />} title="Simple optional remedy" body={simpleOptionalRemedy ? "Supportive, optional, inexpensive." : "Remedy frame is too strong."} onClick={() => setSimpleOptionalRemedy((value) => !value)} />
            <Toggle active={layerNotSubstitute} color={layerNotSubstitute ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Layer, not substitute" body={layerNotSubstitute ? "Primary streams remain central." : "Overlay is replacing the main reading."} onClick={() => setLayerNotSubstitute((value) => !value)} />
            <Toggle active={guaranteedDate} color={guaranteedDate ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Guaranteed date" body={guaranteedDate ? "Error active: false precision." : "Window, not fixed date."} onClick={() => setGuaranteedDate((value) => !value)} />
            <Toggle active={fearSelling} color={fearSelling ? VERMILION : GREEN} icon={<HandHeart size={18} />} title="Fear-selling remedy" body={fearSelling ? "Error active: exploitative upaya." : "No fear-selling."} onClick={() => setFearSelling((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.18rem" }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function OverlayFlowSvg({ focus, dashaActive, annualYes, venusState, methodOk }: { focus: FocusId; dashaActive: boolean; annualYes: boolean; venusState: VenusState; methodOk: boolean }) {
  const steps: Array<{ id: FocusId; label: string; x: number; color: string }> = [
    { id: "tajika", label: "Annual", x: 94, color: GOLD },
    { id: "twoYes", label: "Two yes", x: 244, color: GREEN },
    { id: "lalKitab", label: "Lal Kitab", x: 394, color: BLUE },
    { id: "remedy", label: "Upaya", x: 544, color: PURPLE },
    { id: "layering", label: "Layered", x: 694, color: VERMILION },
  ];
  const venus = VENUS_STATE[venusState];

  return (
    <svg viewBox="0 0 780 390" role="img" aria-label="Tajika and Lal Kitab marriage overlay workflow" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="390" y="52" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">OVERLAYS REFINE AND SUPPORT; THEY DO NOT DECREE</text>
      <line x1="94" y1="145" x2="694" y2="145" stroke={HAIRLINE} strokeWidth="4" />
      {steps.map((step, index) => {
        const active = focus === step.id;
        return (
          <g key={step.id}>
            {index < steps.length - 1 ? <path d={`M ${step.x + 46} 145 L ${steps[index + 1].x - 52} 145`} stroke={step.color} strokeWidth={active ? 5 : 3} opacity={active ? 1 : 0.45} /> : null}
            <circle cx={step.x} cy="145" r={active ? 47 : 41} fill={OPAQUE_LIGHT_FILL[step.color]} stroke={step.color} strokeWidth={active ? 4 : 2.5} />
            <text x={step.x} y="140" textAnchor="middle" fill={step.color} fontSize="14" fontWeight="700">{step.label}</text>
            <text x={step.x} y="162" textAnchor="middle" fill={INK_MUTED} fontSize="13">{index + 1}</text>
          </g>
        );
      })}
      <rect x="78" y="235" width="190" height="60" rx="8" fill={OPAQUE_LIGHT_FILL[dashaActive ? GREEN : GOLD]} stroke={dashaActive ? GREEN : GOLD} />
      <text x="173" y="258" textAnchor="middle" fill={dashaActive ? GREEN : GOLD} fontSize="15" fontWeight="700">Dasha field</text>
      <text x="173" y="281" textAnchor="middle" fill={INK_MUTED} fontSize="13">{dashaActive ? "primary yes" : "not open"}</text>
      <rect x="295" y="235" width="190" height="60" rx="8" fill={OPAQUE_LIGHT_FILL[annualYes ? GREEN : GOLD]} stroke={annualYes ? GREEN : GOLD} />
      <text x="390" y="258" textAnchor="middle" fill={annualYes ? GREEN : GOLD} fontSize="15" fontWeight="700">Annual chart</text>
      <text x="390" y="281" textAnchor="middle" fill={INK_MUTED} fontSize="13">{annualYes ? "second yes" : "qualified"}</text>
      <rect x="512" y="235" width="190" height="60" rx="8" fill={OPAQUE_LIGHT_FILL[methodOk ? venus.color : VERMILION]} stroke={methodOk ? venus.color : VERMILION} />
      <text x="607" y="258" textAnchor="middle" fill={methodOk ? venus.color : VERMILION} fontSize="15" fontWeight="700">Lal Kitab note</text>
      <text x="607" y="281" textAnchor="middle" fill={INK_MUTED} fontSize="13">{methodOk ? venus.label : "guardrail"}</text>
      <text x="390" y="332" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">Two-yes narrows a year; Lal Kitab adds optional support; the primary streams remain central.</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color, flexShrink: 0 }}>{icon}</span>
      <span>
        <strong style={{ display: "block", fontWeight: 700, marginBottom: "0.15rem" }}>{title}</strong>
        <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <strong style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</strong>
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
    fontWeight: 700,
    cursor: "pointer",
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
  };
}

function stateButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: active ? color : INK_PRIMARY,
    padding: "0.7rem",
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
    cursor: "pointer",
    minHeight: 96,
  };
}
