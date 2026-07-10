"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CalendarClock, Clock3, GitMerge, HeartHandshake, Layers3, RotateCcw, SatelliteDish, ShieldCheck, TriangleAlert } from "lucide-react";
import { workbenchTwoColumnStyle, workbenchDiagramLayoutStyle } from "../lib/layouts";

type ScenarioId = "convergentCase" | "singleYesVariation" | "promiseSkipped" | "exactDateError" | "scopeRoute";
type ViewMode = "chart" | "promise" | "timing" | "synthesis" | "frame";
type Confidence = "strong" | "moderateStrong" | "moderate" | "weak";

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
    promiseChecked: boolean;
    dashaYes: boolean;
    transitYes: boolean;
    annualYes: boolean;
    scopeFlag: boolean;
    exactDate: boolean;
    color: string;
    context: string;
  }
> = {
  convergentCase: {
    label: "Full case",
    title: "Strong promise with convergent timing",
    promiseChecked: true,
    dashaYes: true,
    transitYes: true,
    annualYes: true,
    scopeFlag: false,
    exactDate: false,
    color: GREEN,
    context: "Libra Lagna case: strong promise across streams, Venus mahadasha with Mars bhukti, Jupiter over the 7th, and annual chart pointing to the prominent year.",
  },
  singleYesVariation: {
    label: "Single timing yes",
    title: "Strong promise but broader timing",
    promiseChecked: true,
    dashaYes: true,
    transitYes: false,
    annualYes: false,
    scopeFlag: false,
    exactDate: false,
    color: GOLD,
    context: "The promise remains strong, but transit and annual chart do not confirm the dasha window. Timing confidence drops and the window widens.",
  },
  promiseSkipped: {
    label: "Promise skipped",
    title: "Timing is attempted too early",
    promiseChecked: false,
    dashaYes: true,
    transitYes: true,
    annualYes: true,
    scopeFlag: false,
    exactDate: false,
    color: VERMILION,
    context: "The student jumps to Venus dasha and Jupiter transit without first establishing the natal marriage promise.",
  },
  exactDateError: {
    label: "Exact date error",
    title: "A window is over-stated as a date",
    promiseChecked: true,
    dashaYes: true,
    transitYes: true,
    annualYes: true,
    scopeFlag: false,
    exactDate: true,
    color: VERMILION,
    context: "The convergent method is misframed as a single date, which violates the window-of-likelihood discipline.",
  },
  scopeRoute: {
    label: "Scope route",
    title: "A disclosure pauses the timing reading",
    promiseChecked: true,
    dashaYes: true,
    transitYes: true,
    annualYes: true,
    scopeFlag: true,
    exactDate: false,
    color: PURPLE,
    context: "If coercion, abuse, crisis, or severe distress appears during the consultation, the reading pauses and routes to real support.",
  },
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  chart: {
    label: "Chart",
    title: "The illustrative chart is designed to teach method",
    body: "Libra Lagna, 7th-lord Mars in the 11th with Jupiter aspect, strong Venus, strong D9, supported UL, and KP 2-7-11.",
    icon: <Layers3 size={16} />,
    color: BLUE,
  },
  promise: {
    label: "Promise",
    title: "Promise is established before timing",
    body: "Parashari, D9/Venus, Jaimini, and KP converge on a well-promised marriage.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  timing: {
    label: "Timing",
    title: "Timing uses significator dasha plus confirmation",
    body: "Venus mahadasha and Mars bhukti open the window; Jupiter transit and annual chart narrow it.",
    icon: <Clock3 size={16} />,
    color: GOLD,
  },
  synthesis: {
    label: "Synthesis",
    title: "Promise confidence and timing confidence stay separate",
    body: "A strong promise can pair with strong timing, or with moderate timing when only one timing yes appears.",
    icon: <GitMerge size={16} />,
    color: PURPLE,
  },
  frame: {
    label: "Frame",
    title: "The answer is a window with agency",
    body: "No exact date, no never, no deadline. The client receives a confident span and practical agency.",
    icon: <HeartHandshake size={16} />,
    color: VERMILION,
  },
};

const STREAMS: Array<{ label: string; reading: string; confidence: Confidence; color: string }> = [
  { label: "Parashari", reading: "7th-lord Mars in 11th, aspected by Jupiter; Venus dignified in 2nd.", confidence: "strong", color: GREEN },
  { label: "D9 / Venus", reading: "D9 Lagna strong, D9 7th benefic, D9 Venus well-placed, Venus vargottama.", confidence: "strong", color: GREEN },
  { label: "Jaimini", reading: "UL benefic-aspected and 2nd-from-UL supported.", confidence: "moderateStrong", color: GOLD },
  { label: "KP", reading: "7th CSL signifies 2, 7, and 11.", confidence: "strong", color: GREEN },
];

export function WhenWillIMarrySynthesisLab() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>("convergentCase");
  const [viewMode, setViewMode] = useState<ViewMode>("promise");
  const [promiseChecked, setPromiseChecked] = useState(true);
  const [dashaYes, setDashaYes] = useState(true);
  const [transitYes, setTransitYes] = useState(true);
  const [annualYes, setAnnualYes] = useState(true);
  const [separateConfidences, setSeparateConfidences] = useState(true);
  const [windowLanguage, setWindowLanguage] = useState(true);
  const [exactDate, setExactDate] = useState(false);
  const [scopeFlag, setScopeFlag] = useState(false);

  const scenario = SCENARIOS[scenarioId];
  const timingYesCount = [dashaYes, transitYes, annualYes].filter(Boolean).length;
  const promiseConfidence: Confidence = promiseChecked ? "strong" : "weak";
  const timingConfidence: Confidence = !promiseChecked ? "weak" : timingYesCount >= 3 ? "strong" : timingYesCount === 2 ? "moderate" : timingYesCount === 1 ? "moderate" : "weak";
  const methodOk = promiseChecked && separateConfidences && windowLanguage && !exactDate && !scopeFlag;

  const verdict = useMemo(() => {
    if (scopeFlag) return { label: "route before timing", color: PURPLE };
    if (exactDate || !windowLanguage) return { label: "false precision warning", color: VERMILION };
    if (!promiseChecked) return { label: "promise missing", color: VERMILION };
    if (!separateConfidences) return { label: "confidence collapse warning", color: GOLD };
    if (timingYesCount >= 3) return { label: "strong promise, strong timing", color: GREEN };
    if (timingYesCount === 1) return { label: "strong promise, moderate timing", color: GOLD };
    return { label: "strong promise, qualified timing", color: BLUE };
  }, [exactDate, promiseChecked, scopeFlag, separateConfidences, timingYesCount, windowLanguage]);

  const statement = useMemo(() => {
    if (scopeFlag) return "Pause the timing reading and route the person to appropriate support before continuing.";
    if (exactDate || !windowLanguage) return "Repair the frame: give the Venus-Mars span and prominent year as a window of likelihood, not a single date.";
    if (!promiseChecked) return "The method is out of order. Establish the four-stream marriage promise before timing the event.";
    if (!separateConfidences) return "Keep promise and timing confidence separate. Strong promise with weaker timing means a wider window, not maybe never.";
    if (timingYesCount >= 3) return "Final answer: marriage is well-promised, and the most likely window opens about 14 months from now for roughly a year, with the prominent annual year strongest.";
    if (timingYesCount === 1) return "Variation answer: marriage remains strongly promised, but timing is less sharply defined. Widen the dasha window and lower timing confidence to moderate.";
    return "The promise is strong, but timing needs more confirmation before narrowing the window.";
  }, [exactDate, promiseChecked, scopeFlag, separateConfidences, timingYesCount, windowLanguage]);

  function loadScenario(id: ScenarioId) {
    const next = SCENARIOS[id];
    setScenarioId(id);
    setPromiseChecked(next.promiseChecked);
    setDashaYes(next.dashaYes);
    setTransitYes(next.transitYes);
    setAnnualYes(next.annualYes);
    setSeparateConfidences(true);
    setWindowLanguage(!next.exactDate);
    setExactDate(next.exactDate);
    setScopeFlag(next.scopeFlag);
  }

  return (
    <div data-interactive="when-will-i-marry-synthesis-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: when will I marry?</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 700 }}>Run the timing question end to end</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 930 }}>
              Establish promise across four streams, build the Venus-Mars timing window, test two-yes confirmation, and frame a non-fatalistic window.
            </p>
          </div>
          <button type="button" onClick={() => { setViewMode("promise"); loadScenario("convergentCase"); }} style={buttonStyle(false, PURPLE)}>
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
          <h3 style={{ margin: 0, color: scenario.color, fontSize: "1.08rem", fontWeight: 700 }}>{scenario.title}</h3>
          <p style={bodyTextStyle}>{scenario.context}</p>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.05rem", fontWeight: 700 }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Promise and timing confidence</p>
              <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 700 }}>{verdict.label}</h3>
            </div>
            <span style={{ color: verdict.color, fontWeight: 700 }}>{timingYesCount}/3 timing yes</span>
          </div>
          <MarriageCaseSvg promiseChecked={promiseChecked} dashaYes={dashaYes} transitYes={transitYes} annualYes={annualYes} methodOk={methodOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 145px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Promise" body={promiseConfidence} color={promiseChecked ? GREEN : VERMILION} icon={<ShieldCheck size={16} />} />
            <MiniFact title="Timing" body={timingConfidence} color={timingYesCount >= 3 ? GREEN : timingYesCount === 1 ? GOLD : BLUE} icon={<Clock3 size={16} />} />
            <MiniFact title="Frame" body={windowLanguage && !exactDate ? "window" : "repair"} color={windowLanguage && !exactDate ? GREEN : VERMILION} icon={<HeartHandshake size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Four-stream promise" icon={<Layers3 size={18} />} color={promiseChecked ? GREEN : VERMILION}>
            {STREAMS.map((stream) => (
              <StreamRow key={stream.label} label={stream.label} reading={stream.reading} confidence={stream.confidence} color={stream.color} />
            ))}
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Timing layer</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={promiseChecked} color={promiseChecked ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Promise established first" body={promiseChecked ? "All four streams are read before timing." : "Timing is being attempted too early."} onClick={() => setPromiseChecked((value) => !value)} />
            <Toggle active={dashaYes} color={dashaYes ? GREEN : GOLD} icon={<Clock3 size={18} />} title="Venus dasha / Mars bhukti" body={dashaYes ? "Marriage-significator window opens." : "No significator period."} onClick={() => setDashaYes((value) => !value)} />
            <Toggle active={transitYes} color={transitYes ? GREEN : GOLD} icon={<SatelliteDish size={18} />} title="Jupiter transit over 7th" body={transitYes ? "Slow-planet second yes." : "No transit confirmation."} onClick={() => setTransitYes((value) => !value)} />
            <Toggle active={annualYes} color={annualYes ? GREEN : GOLD} icon={<CalendarClock size={18} />} title="Annual chart narrows year" body={annualYes ? "Muntha/Ithasala highlights the year." : "Annual chart is neutral."} onClick={() => setAnnualYes((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Synthesis guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.75rem" }}>
            <Toggle active={separateConfidences} color={separateConfidences ? GREEN : GOLD} icon={<GitMerge size={18} />} title="Separate promise and timing confidence" body={separateConfidences ? "Strong promise can pair with moderate timing." : "Promise and timing are collapsed."} onClick={() => setSeparateConfidences((value) => !value)} />
            <Toggle active={windowLanguage} color={windowLanguage ? GREEN : VERMILION} icon={<HeartHandshake size={18} />} title="Window language" body={windowLanguage ? "Span of likelihood with agency." : "Language is too exact."} onClick={() => setWindowLanguage((value) => !value)} />
            <Toggle active={exactDate} color={exactDate ? VERMILION : GREEN} icon={<TriangleAlert size={18} />} title="Exact date output" body={exactDate ? "Error active: false precision." : "No date decree."} onClick={() => setExactDate((value) => !value)} />
            <Toggle active={scopeFlag} color={scopeFlag ? PURPLE : GREEN} icon={<TriangleAlert size={18} />} title="Scope disclosure" body={scopeFlag ? "Pause and route before timing." : "No scope interruption."} onClick={() => setScopeFlag((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${verdict.color}66`, background: `${verdict.color}10` }}>
        <p style={eyebrowStyle}>Practice statement</p>
        <h3 style={{ margin: "0.15rem 0 0", color: verdict.color, fontSize: "1.12rem", fontWeight: 700 }}>{verdict.label}</h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{statement}</p>
      </section>
    </div>
  );
}

function MarriageCaseSvg({ promiseChecked, dashaYes, transitYes, annualYes, methodOk }: { promiseChecked: boolean; dashaYes: boolean; transitYes: boolean; annualYes: boolean; methodOk: boolean }) {
  const nodes = [
    { label: "Promise", active: promiseChecked, x: 100, color: PURPLE },
    { label: "Venus MD", active: dashaYes, x: 250, color: BLUE },
    { label: "Jupiter", active: transitYes, x: 400, color: GREEN },
    { label: "Annual", active: annualYes, x: 550, color: GOLD },
    { label: "Window", active: methodOk, x: 700, color: VERMILION },
  ];

  return (
    <svg viewBox="0 0 800 390" role="img" aria-label="When will I marry synthesis flow" style={{ width: "100%", minHeight: 300, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="764" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="400" y="52" textAnchor="middle" fill={GOLD} fontSize="15" fontWeight="700">PROMISE FIRST, THEN TIMING CONFIDENCE</text>
      <line x1="100" y1="145" x2="700" y2="145" stroke={HAIRLINE} strokeWidth="4" />
      {nodes.map((node, index) => {
        const stroke = node.active ? node.color : VERMILION;
        return (
          <g key={node.label}>
            {index < nodes.length - 1 ? <path d={`M ${node.x + 46} 145 L ${nodes[index + 1].x - 52} 145`} stroke={stroke} strokeWidth="3" opacity="0.55" /> : null}
            <circle cx={node.x} cy="145" r="42" fill={OPAQUE_LIGHT_FILL[stroke]} stroke={stroke} strokeWidth="2.5" />
            <text x={node.x} y="141" textAnchor="middle" fill={stroke} fontSize="14" fontWeight="700">{node.label}</text>
            <text x={node.x} y="162" textAnchor="middle" fill={INK_MUTED} fontSize="13">{node.active ? "yes" : "no"}</text>
          </g>
        );
      })}
      <rect x="100" y="240" width="250" height="60" rx="8" fill={OPAQUE_LIGHT_FILL[promiseChecked ? GREEN : VERMILION]} stroke={promiseChecked ? GREEN : VERMILION} />
      <text x="225" y="263" textAnchor="middle" fill={promiseChecked ? GREEN : VERMILION} fontSize="15" fontWeight="700">Promise confidence</text>
      <text x="225" y="285" textAnchor="middle" fill={INK_MUTED} fontSize="13">{promiseChecked ? "strong across streams" : "not established"}</text>
      <rect x="455" y="240" width="250" height="60" rx="8" fill={OPAQUE_LIGHT_FILL[methodOk ? GREEN : GOLD]} stroke={methodOk ? GREEN : GOLD} />
      <text x="580" y="263" textAnchor="middle" fill={methodOk ? GREEN : GOLD} fontSize="15" fontWeight="700">Timing confidence</text>
      <text x="580" y="285" textAnchor="middle" fill={INK_MUTED} fontSize="13">{[dashaYes, transitYes, annualYes].filter(Boolean).length} timing confirmation(s)</text>
      <text x="400" y="332" textAnchor="middle" fill={INK_SECONDARY} fontSize="14">A strong promise with fewer timing confirmations becomes a broader window, not a fatalistic answer.</text>
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

function StreamRow({ label, reading, confidence, color }: { label: string; reading: string; confidence: Confidence; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.7rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
        <span style={{ color, fontWeight: 600 }}>{label}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{confidence}</span>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.4 }}>{reading}</p>
    </div>
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
