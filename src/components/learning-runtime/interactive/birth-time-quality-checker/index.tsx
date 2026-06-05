"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AlertTriangle, BadgeCheck, Clock, GitCompare, RotateCcw, ShieldCheck } from "lucide-react";

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

type TimeCase = "rough" | "recorded" | "corroborated" | "rectified";
type EventCase = "none" | "few" | "dated" | "tested";
type CandidateKey = "early" | "middle" | "late";

const TIME_CASES: Record<TimeCase, { label: string; input: string; color: string; summary: string }> = {
  rough: {
    label: "Rough time",
    input: "born in the afternoon",
    color: VERMILION,
    summary: "D60 is not usable. The time can move many shashtyamshas.",
  },
  recorded: {
    label: "Recorded time",
    input: "3:24 pm on a document",
    color: GOLD,
    summary: "Promising, but still not the same as rectified. Treat D60 as tentative.",
  },
  corroborated: {
    label: "Corroborated time",
    input: "3:24 pm plus family/witness support",
    color: BLUE,
    summary: "Good enough to investigate; rectification is still preferred before strong D60 claims.",
  },
  rectified: {
    label: "Rectified time",
    input: "3:24 pm tested against life-events",
    color: GREEN,
    summary: "D60 may be used with humility because the time has passed event testing.",
  },
};

const EVENT_CASES: Record<EventCase, { label: string; summary: string }> = {
  none: { label: "No events", summary: "No dated events are available, so rectification cannot be responsibly tested." },
  few: { label: "Few memories", summary: "Some life data exists, but it is too loose for confident D60 use." },
  dated: { label: "Dated events", summary: "Marriage, career shift, relocation, parent event, or similar dated anchors are available." },
  tested: { label: "Events tested", summary: "Candidate times have been compared against documented events." },
};

const CANDIDATES: Record<CandidateKey, { label: string; time: string; fit: number; d60: string; note: string }> = {
  early: { label: "Candidate A", time: "3:23 pm", fit: 42, d60: "Ghora", note: "D60 tone clashes with event pattern." },
  middle: { label: "Candidate B", time: "3:24 pm", fit: 86, d60: "Deva", note: "D60 and timing cohere with the documented events." },
  late: { label: "Candidate C", time: "3:26 pm", fit: 55, d60: "Kala", note: "Some fit, but fine-varga story is less coherent." },
};

export function BirthTimeQualityChecker() {
  const [timeCase, setTimeCase] = useState<TimeCase>("rough");
  const [eventCase, setEventCase] = useState<EventCase>("few");
  const [candidateKey, setCandidateKey] = useState<CandidateKey>("middle");
  const [invokeD60, setInvokeD60] = useState(true);
  const [showRectification, setShowRectification] = useState(true);

  const verdict = useMemo(() => getVerdict(timeCase, eventCase), [eventCase, timeCase]);
  const activeColor = verdict.color;
  const time = TIME_CASES[timeCase];
  const event = EVENT_CASES[eventCase];
  const candidate = CANDIDATES[candidateKey];

  const reset = () => {
    setTimeCase("rough");
    setEventCase("few");
    setCandidateKey("middle");
    setInvokeD60(true);
    setShowRectification(true);
  };

  return (
    <div data-interactive="birth-time-quality-checker" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>D60 birth-time quality gate</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Rectify first, then read D60</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Decide whether the D60 is usable from the birth-time quality. D60 is both payload and litmus test: it needs rectification, and rectification uses it as a fine filter.
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
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Current intake</p>
              <h3 style={{ margin: "0.2rem 0 0", color: activeColor, fontSize: "1.2rem" }}>{time.label}: {time.input}</h3>
            </div>
            <strong style={{ color: activeColor }}>{verdict.label}</strong>
          </div>

          <BirthTimeGateSvg timeCase={timeCase} eventCase={eventCase} verdictColor={activeColor} />

          <div style={{ border: `1px solid ${activeColor}66`, borderRadius: 8, background: `${activeColor}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>D60 verdict</p>
            <h4 style={{ margin: "0.2rem 0", color: activeColor, fontSize: "1.08rem" }}>{verdict.title}</h4>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{verdict.body}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Birth-time description" icon={<Clock size={18} />} color={time.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))", gap: "0.45rem" }}>
              {(Object.keys(TIME_CASES) as TimeCase[]).map((key) => (
                <button key={key} type="button" onClick={() => setTimeCase(key)} style={buttonStyle(timeCase === key, TIME_CASES[key].color)}>
                  {TIME_CASES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{time.summary}</p>
          </Panel>

          <Panel title="Life-event evidence" icon={<BadgeCheck size={18} />} color={eventCase === "tested" ? GREEN : eventCase === "dated" ? BLUE : GOLD}>
            <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
              {(Object.keys(EVENT_CASES) as EventCase[]).map((key) => (
                <button key={key} type="button" onClick={() => setEventCase(key)} style={buttonStyle(eventCase === key, key === "tested" ? GREEN : key === "dated" ? BLUE : GOLD)}>
                  {EVENT_CASES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{event.summary}</p>
          </Panel>

          <Panel title="False-precision test" icon={<AlertTriangle size={18} />} color={invokeD60 && verdict.status !== "usable" ? VERMILION : GREEN}>
            <button type="button" onClick={() => setInvokeD60((value) => !value)} style={buttonStyle(invokeD60, invokeD60 && verdict.status !== "usable" ? VERMILION : GREEN)}>
              {invokeD60 ? "Trying to invoke D60" : "D60 withheld"}
            </button>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {invokeD60 && verdict.status !== "usable"
                ? "False precision: do not cite the highest division before the time is rectified."
                : invokeD60
                  ? "D60 can be discussed, but still with careful language."
                  : "Correct discipline: withhold D60 until the birth-time quality supports it."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
        <Panel title="Toy rectification preview" icon={<GitCompare size={18} />} color={showRectification ? PURPLE : BLUE}>
          <button type="button" onClick={() => setShowRectification((value) => !value)} style={buttonStyle(showRectification, PURPLE)}>
            {showRectification ? "Rectification shown" : "Show rectification"}
          </button>
          {showRectification ? (
            <>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
                  const item = CANDIDATES[key];
                  const active = candidateKey === key;
                  return (
                    <button key={key} type="button" onClick={() => setCandidateKey(key)} style={{ ...candidateStyle(active, item.fit), textAlign: "left" }}>
                      <strong>{item.label}: {item.time}</strong>
                      <span style={{ display: "block", marginTop: 3, color: INK_MUTED }}>Fit {item.fit}/100 - D60 {item.d60}</span>
                    </button>
                  );
                })}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{candidate.note}</p>
            </>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Rectification preview is hidden. Full rectification belongs to Tier 2.</p>
          )}
        </Panel>

        <Panel title="Professional duty" icon={<ShieldCheck size={18} />} color={activeColor}>
          {[
            "Assess birth-time quality before opening D60.",
            "Use dated life-events to test candidate times.",
            "If quality is uncertain, offer rectification first.",
            "Do not present D60 in the initial consult on rough time.",
          ].map((item) => <DutyRow key={item} active={verdict.status === "usable" || verdict.status === "rectify"}>{item}</DutyRow>)}
        </Panel>
      </div>
    </div>
  );
}

function getVerdict(timeCase: TimeCase, eventCase: EventCase) {
  if (timeCase === "rectified" || (timeCase === "corroborated" && eventCase === "tested")) {
    return {
      status: "usable" as const,
      label: "D60 usable",
      title: "D60 unlocked after time testing",
      body: "The D60 may be used because the birth time has been tested or strongly corroborated. Keep the reading humble.",
      color: GREEN,
    };
  }
  if (timeCase === "rough" || eventCase === "none") {
    return {
      status: "withhold" as const,
      label: "Withhold D60",
      title: "D60 is not usable",
      body: "A rough or unsupported time cannot carry D60 authority. Explain the precision demand and do not interpret the chart.",
      color: VERMILION,
    };
  }
  return {
    status: "rectify" as const,
    label: "Rectify first",
    title: "Offer rectification before D60",
    body: "The time may be close, but the D60 needs event-tested confidence. Defer D60 in the initial reading.",
    color: GOLD,
  };
}

function BirthTimeGateSvg({ timeCase, eventCase, verdictColor }: { timeCase: TimeCase; eventCase: EventCase; verdictColor: string }) {
  const gates = [
    { label: "Time intake", detail: TIME_CASES[timeCase].label, color: TIME_CASES[timeCase].color },
    { label: "Life events", detail: EVENT_CASES[eventCase].label, color: eventCase === "tested" ? GREEN : eventCase === "dated" ? BLUE : GOLD },
    { label: "D60 litmus", detail: "candidate minutes", color: PURPLE },
    { label: "Use or withhold", detail: "duty gate", color: verdictColor },
  ];

  return (
    <svg viewBox="0 0 620 420" role="img" aria-label="Birth-time quality decision tree for D60" style={{ ...svgStyle, maxHeight: 450 }}>
      <rect x="34" y="34" width="552" height="340" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight="800">
        <tspan x="310">D60 is payload and litmus test.</tspan>
        <tspan x="310" dy="21">Gate it behind birth-time quality.</tspan>
      </text>
      {gates.map((gate, index) => {
        const x = 62 + index * 132;
        return (
          <g key={gate.label}>
            {index > 0 ? <line x1={x - 42} y1="196" x2={x - 14} y2="196" stroke={gate.color} strokeWidth="4" strokeLinecap="round" opacity="0.72" /> : null}
            <rect x={x} y="126" width="108" height="140" rx="8" fill={`${gate.color}16`} stroke={gate.color} strokeWidth="2.4" />
            <text x={x + 54} y="158" textAnchor="middle" fill={gate.color} fontSize="13" fontWeight="800">{gate.label}</text>
            <text x={x + 54} y="194" textAnchor="middle" fill={INK_PRIMARY} fontSize="12.5" fontWeight="750">{gate.detail}</text>
            <text x={x + 54} y="230" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="750">{index + 1}</text>
          </g>
        );
      })}
      <text x="310" y="330" textAnchor="middle" fill={verdictColor} fontSize="15" fontWeight="800">
        Judge the time before invoking the highest division.
      </text>
    </svg>
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

function DutyRow({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: INK_SECONDARY, fontWeight: 650 }}>
      <BadgeCheck size={16} color={active ? GREEN : GOLD} aria-hidden="true" />
      {children}
    </div>
  );
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

function candidateStyle(active: boolean, fit: number): CSSProperties {
  const color = fit >= 80 ? GREEN : fit >= 55 ? GOLD : VERMILION;
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem",
    fontWeight: 700,
    cursor: "pointer",
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
