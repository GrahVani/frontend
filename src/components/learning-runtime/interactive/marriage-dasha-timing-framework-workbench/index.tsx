"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CalendarClock, Clock3, HeartHandshake, Layers3, RotateCcw, SatelliteDish, Scale, ShieldCheck, Timer, TriangleAlert } from "lucide-react";

type ScenarioId = "convergent" | "dashaOnly" | "weakPromise" | "exactDate";
type FocusId = "promise" | "significators" | "twoYes" | "annual" | "ethics";
type StreamMode = "aligned" | "partial" | "single";

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
    promiseStrong: boolean;
    significatorDasha: boolean;
    transitConfirm: boolean;
    annualRefine: boolean;
    streamMode: StreamMode;
    exactDate: boolean;
    color: string;
    context: string;
  }
> = {
  convergent: {
    label: "Convergent window",
    title: "Promise, dasha, transit, and annual year agree",
    promiseStrong: true,
    significatorDasha: true,
    transitConfirm: true,
    annualRefine: true,
    streamMode: "aligned",
    exactDate: false,
    color: GREEN,
    context: "Venus dasha with 7th-lord bhukti overlaps UL/KP support, Jupiter crosses the 7th, and the annual chart marks the middle year.",
  },
  dashaOnly: {
    label: "Dasha only",
    title: "A significator period without the second yes",
    promiseStrong: true,
    significatorDasha: true,
    transitConfirm: false,
    annualRefine: false,
    streamMode: "partial",
    exactDate: false,
    color: GOLD,
    context: "Marriage is promised and the dasha is relevant, but transit and annual chart have not narrowed the window yet.",
  },
  weakPromise: {
    label: "Weak promise",
    title: "Timing cannot manufacture a clean marriage",
    promiseStrong: false,
    significatorDasha: true,
    transitConfirm: true,
    annualRefine: false,
    streamMode: "single",
    exactDate: false,
    color: BLUE,
    context: "A Venus bhukti appears, but the natal marriage promise is obstructed or delayed, so the timing must be qualified.",
  },
  exactDate: {
    label: "Exact-date error",
    title: "False precision in marriage timing",
    promiseStrong: true,
    significatorDasha: true,
    transitConfirm: true,
    annualRefine: true,
    streamMode: "aligned",
    exactDate: true,
    color: VERMILION,
    context: "The method is turned into a single calendar-day decree instead of a window of likelihood.",
  },
};

const FOCUS: Record<FocusId, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  promise: {
    label: "Promise",
    title: "Timing fires only what is promised",
    body: "A strong marriage promise can be timed cleanly. A weak or obstructed promise gives qualified or later timing.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
  significators: {
    label: "Periods",
    title: "Use marriage-significator dasha periods",
    body: "Venus, the 7th-lord, UL-lord, DK, KP 2-7-11 agents, and D9 indicators carry marriage timing.",
    icon: <Timer size={16} />,
    color: BLUE,
  },
  twoYes: {
    label: "Two yes",
    title: "Dasha opens the window; transit confirms",
    body: "Jupiter or Saturn over the 7th, Venus, or UL gives the slow-planet confirmation.",
    icon: <SatelliteDish size={16} />,
    color: GREEN,
  },
  annual: {
    label: "Annual",
    title: "The annual chart narrows to a likely year",
    body: "Tajika year-refinement helps choose the most prominent year inside the dasha window.",
    icon: <CalendarClock size={16} />,
    color: GOLD,
  },
  ethics: {
    label: "Framing",
    title: "Give a window, not a decree",
    body: "The output is a span of likelihood with agency, never a fixed date or pressured certainty.",
    icon: <HeartHandshake size={16} />,
    color: VERMILION,
  },
};

export function MarriageDashaTimingFrameworkWorkbench() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("convergent");
  const [focus, setFocus] = useState<FocusId>("twoYes");
  const [promiseStrong, setPromiseStrong] = useState(true);
  const [significatorDasha, setSignificatorDasha] = useState(true);
  const [transitConfirm, setTransitConfirm] = useState(true);
  const [annualRefine, setAnnualRefine] = useState(true);
  const [streamMode, setStreamMode] = useState<StreamMode>("aligned");
  const [windowLanguage, setWindowLanguage] = useState(true);
  const [exactDate, setExactDate] = useState(false);
  const [forceUnpromised, setForceUnpromised] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const twoYes = promiseStrong && significatorDasha && transitConfirm && windowLanguage && !exactDate && !forceUnpromised;
  const convergenceScore = Math.max(
    5,
    Math.min(96, (promiseStrong ? 24 : -14) + (significatorDasha ? 28 : -8) + (transitConfirm ? 20 : 0) + (annualRefine ? 12 : 0) + streamScore(streamMode) + (windowLanguage ? 10 : -20) - (exactDate ? 30 : 0) - (forceUnpromised ? 25 : 0)),
  );

  const verdict = useMemo(() => {
    if (exactDate || !windowLanguage) return { label: "false precision warning", color: VERMILION };
    if (forceUnpromised || !promiseStrong) return { label: "qualified or later timing", color: GOLD };
    if (!significatorDasha) return { label: "not a marriage period", color: VERMILION };
    if (twoYes && annualRefine) return { label: "strong likelihood window", color: GREEN };
    if (twoYes) return { label: "confirmed dasha window", color: GREEN };
    if (significatorDasha && !transitConfirm) return { label: "candidate window awaiting trigger", color: GOLD };
    return { label: "timing context only", color: BLUE };
  }, [annualRefine, exactDate, forceUnpromised, promiseStrong, significatorDasha, transitConfirm, twoYes, windowLanguage]);

  const statement = useMemo(() => {
    if (exactDate || !windowLanguage) return "Pause: this has become false precision. State a span of likelihood, not a single calendar date.";
    if (forceUnpromised || !promiseStrong) return "Promise-before-timing: the chart does not support a clean marriage promise, so do not force a clean date. Frame timing as qualified, later, or obstructed.";
    if (!significatorDasha) return "The running period is not ruled by marriage significators. However eventful it is, this is not the main marriage window.";
    if (!transitConfirm) return "The significator dasha opens a candidate window, but the slow-planet transit has not given the second yes yet.";
    if (annualRefine) return `Strong window: marriage promise, significator dasha, transit confirmation, ${streamMode} stream support, and annual year-refinement converge. Present a likely span, not a date.`;
    return "Confirmed window: dasha and transit agree. Add annual-chart year refinement before narrowing the span further.";
  }, [annualRefine, exactDate, forceUnpromised, promiseStrong, significatorDasha, streamMode, transitConfirm, windowLanguage]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setPromiseStrong(next.promiseStrong);
    setSignificatorDasha(next.significatorDasha);
    setTransitConfirm(next.transitConfirm);
    setAnnualRefine(next.annualRefine);
    setStreamMode(next.streamMode);
    setWindowLanguage(!next.exactDate);
    setExactDate(next.exactDate);
    setForceUnpromised(!next.promiseStrong);
  }

  return (
    <div data-interactive="marriage-dasha-timing-framework-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage timing framework</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 700 }}>Find the window, then confirm the trigger</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Combine marriage promise, significator dasha, slow-planet transit, cross-stream convergence, and annual year refinement.
            </p>
          </div>
          <button type="button" onClick={() => { setFocus("twoYes"); loadScenario("convergent"); }} style={buttonStyle(false, PURPLE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioId[]).map((id) => (
            <button key={id} type="button" aria-pressed={scenarioId === id} onClick={() => loadScenario(id)} style={buttonStyle(scenarioId === id, SCENARIOS[id].color)}>
              <Clock3 size={16} aria-hidden="true" />
              {SCENARIOS[id].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${scenario.color}55`, borderRadius: 8, background: `${scenario.color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.08rem", fontWeight: 700 }}>{scenario.title}</h3>
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
          <h3 style={{ margin: 0, color: FOCUS[focus].color, fontSize: "1.05rem", fontWeight: 700 }}>{FOCUS[focus].title}</h3>
          <p style={bodyTextStyle}>{FOCUS[focus].body}</p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Timing convergence</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 700 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 700 }}>{convergenceScore}% signal</span>
          </div>
          <TimingFrameworkSvg focus={focus} promiseStrong={promiseStrong} significatorDasha={significatorDasha} transitConfirm={transitConfirm} annualRefine={annualRefine} exactDate={exactDate || !windowLanguage} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Promise" body={promiseStrong ? "supported" : "qualified"} color={promiseStrong ? GREEN : GOLD} icon={<ShieldCheck size={16} />} />
            <MiniFact title="Dasha" body={significatorDasha ? "significator period" : "unrelated"} color={significatorDasha ? GREEN : VERMILION} icon={<Timer size={16} />} />
            <MiniFact title="Transit" body={transitConfirm ? "second yes" : "waiting"} color={transitConfirm ? GREEN : GOLD} icon={<SatelliteDish size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Core timing gates" icon={<Layers3 size={18} />} color={verdict.color}>
            <Toggle active={promiseStrong} color={promiseStrong ? GREEN : GOLD} icon={<ShieldCheck size={18} />} title="Marriage promise is supported" body={promiseStrong ? "Timing has something clean to activate." : "Promise is weak, delayed, or obstructed."} onClick={() => setPromiseStrong((value) => !value)} />
            <Toggle active={significatorDasha} color={significatorDasha ? GREEN : VERMILION} icon={<Timer size={18} />} title="Dasha belongs to marriage significators" body={significatorDasha ? "Venus, 7th-lord, UL/DK, KP, or D9 agent." : "Period lords are unrelated to marriage."} onClick={() => setSignificatorDasha((value) => !value)} />
            <Toggle active={transitConfirm} color={transitConfirm ? GREEN : GOLD} icon={<SatelliteDish size={18} />} title="Slow transit confirms" body={transitConfirm ? "Jupiter/Saturn touches 7th, Venus, or UL." : "No second yes yet."} onClick={() => setTransitConfirm((value) => !value)} />
            <Toggle active={annualRefine} color={annualRefine ? GREEN : GOLD} icon={<CalendarClock size={18} />} title="Annual chart narrows the year" body={annualRefine ? "Tajika refines the likely year." : "No annual year refinement."} onClick={() => setAnnualRefine((value) => !value)} />
          </Panel>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Cross-stream support</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(["aligned", "partial", "single"] as StreamMode[]).map((mode) => (
              <button key={mode} type="button" aria-pressed={streamMode === mode} onClick={() => setStreamMode(mode)} style={stateButtonStyle(streamMode === mode, streamColor(mode))}>
                <span style={{ fontWeight: 700 }}>{mode}</span>
                <span>{streamNote(mode)}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Framing guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={windowLanguage} color={windowLanguage ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Window language" body={windowLanguage ? "Span of likelihood with agency." : "Framing is too deterministic."} onClick={() => setWindowLanguage((value) => !value)} />
            <Toggle active={exactDate} color={exactDate ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Exact date decree" body={exactDate ? "Error active: false precision." : "No single-day decree."} onClick={() => setExactDate((value) => !value)} />
            <Toggle active={forceUnpromised} color={forceUnpromised ? VERMILION : GREEN} icon={<Scale size={18} />} title="Force unpromised marriage" body={forceUnpromised ? "Error active: timing is manufacturing promise." : "Promise-before-timing is intact."} onClick={() => setForceUnpromised((value) => !value)} />
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

function TimingFrameworkSvg({
  focus,
  promiseStrong,
  significatorDasha,
  transitConfirm,
  annualRefine,
  exactDate,
}: {
  focus: FocusId;
  promiseStrong: boolean;
  significatorDasha: boolean;
  transitConfirm: boolean;
  annualRefine: boolean;
  exactDate: boolean;
}) {
  const steps: Array<{ id: FocusId; label: string; x: number; color: string; active: boolean }> = [
    { id: "promise", label: "Promise", x: 94, color: PURPLE, active: promiseStrong },
    { id: "significators", label: "Dasha", x: 244, color: BLUE, active: significatorDasha },
    { id: "twoYes", label: "Transit", x: 394, color: GREEN, active: transitConfirm },
    { id: "annual", label: "Annual", x: 544, color: GOLD, active: annualRefine },
    { id: "ethics", label: "Window", x: 694, color: VERMILION, active: !exactDate },
  ];

  return (
    <svg viewBox="0 0 780 390" role="img" aria-label="Marriage dasha timing framework diagram" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="744" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="390" y="52" textAnchor="middle" fill={GOLD} fontSize="13" fontWeight="700">PROMISE PLUS DASHA PLUS TRANSIT BECOMES A WINDOW</text>
      <line x1="94" y1="145" x2="694" y2="145" stroke={HAIRLINE} strokeWidth="4" />
      {steps.map((step, index) => {
        const selected = focus === step.id;
        const stroke = step.active ? step.color : VERMILION;
        return (
          <g key={step.id}>
            {index < steps.length - 1 ? <path d={`M ${step.x + 42} 145 L ${steps[index + 1].x - 48} 145`} stroke={stroke} strokeWidth={selected ? 5 : 3} opacity={selected ? 1 : 0.45} /> : null}
            <circle cx={step.x} cy="145" r={selected ? 43 : 36} fill={OPAQUE_LIGHT_FILL[stroke]} stroke={stroke} strokeWidth={selected ? 4 : 2.5} />
            <text x={step.x} y="142" textAnchor="middle" fill={stroke} fontSize="11" fontWeight="700">{step.label}</text>
            <text x={step.x} y="162" textAnchor="middle" fill={INK_MUTED} fontSize="10">{step.active ? "yes" : "no"}</text>
          </g>
        );
      })}
      <path d="M 352 266 C 410 224, 468 224, 526 266" fill="none" stroke={transitConfirm ? GREEN : GOLD} strokeWidth="4" strokeDasharray="8 7" />
      <rect x="90" y="238" width="250" height="56" rx="8" fill={OPAQUE_LIGHT_FILL[significatorDasha ? GREEN : VERMILION]} stroke={significatorDasha ? GREEN : VERMILION} />
      <text x="215" y="262" textAnchor="middle" fill={significatorDasha ? GREEN : VERMILION} fontSize="12" fontWeight="700">Marriage-significator period</text>
      <text x="215" y="282" textAnchor="middle" fill={INK_MUTED} fontSize="11">Venus, 7th lord, UL, DK, KP 2-7-11</text>
      <rect x="540" y="238" width="160" height="56" rx="8" fill={OPAQUE_LIGHT_FILL[exactDate ? VERMILION : GREEN]} stroke={exactDate ? VERMILION : GREEN} />
      <text x="620" y="262" textAnchor="middle" fill={exactDate ? VERMILION : GREEN} fontSize="12" fontWeight="700">{exactDate ? "date decree" : "window"}</text>
      <text x="620" y="282" textAnchor="middle" fill={INK_MUTED} fontSize="11">{annualRefine ? "year refined" : "span open"}</text>
      <text x="390" y="330" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">The dasha activates the promise; transit confirms; annual chart narrows; ethics protects agency.</text>
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
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 700 }}>{title}</span>
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
        <span style={{ fontSize: "0.86rem", fontWeight: 700 }}>{title}</span>
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
    fontWeight: 400,
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
    minHeight: 82,
    fontWeight: 400,
  };
}

function streamScore(mode: StreamMode) {
  if (mode === "aligned") return 18;
  if (mode === "partial") return 8;
  return 0;
}

function streamColor(mode: StreamMode) {
  if (mode === "aligned") return GREEN;
  if (mode === "partial") return GOLD;
  return BLUE;
}

function streamNote(mode: StreamMode) {
  if (mode === "aligned") return "Venus, 7th-lord, UL, KP, and D9 converge.";
  if (mode === "partial") return "Some streams agree, but not all.";
  return "One stream is carrying most of the timing.";
}
