"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Clock,
  GitCompare,
  Landmark,
  MapPin,
  RefreshCcw,
  Search,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "test" | "window" | "events";
type CandidateKey = "A" | "B" | "C";
type EventKey = "marriage" | "career";
type StepKey = "house" | "lord" | "period" | "activation";
type WindowMode = "narrow" | "wide";
type EventCount = 1 | 2;

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const TABS: Record<TabKey, { label: string; icon: typeof Search }> = {
  test: { label: "The precise test", icon: Search },
  window: { label: "Candidate window", icon: Clock },
  events: { label: "Event triangulation", icon: GitCompare },
};

const CANDIDATES: Record<CandidateKey, { time: string; lagna: string; note: string; moonNakshatra: string }> = {
  A: { time: "05:48", lagna: "Virgo", note: "24-min spread", moonNakshatra: "Hasta" },
  B: { time: "06:00", lagna: "Virgo", note: "designed true", moonNakshatra: "Hasta" },
  C: { time: "06:12", lagna: "Libra", note: "sign change", moonNakshatra: "Hasta" },
};

const EVENTS: Record<EventKey, { label: string; age: string; house: number; houseLord: Record<CandidateKey, string>; karaka: string; domain: string }> = {
  marriage: {
    label: "Marriage",
    age: "27–28",
    house: 7,
    houseLord: { A: "Jupiter", B: "Jupiter", C: "Mars" },
    karaka: "Venus / Jupiter",
    domain: "partnership",
  },
  career: {
    label: "Career change",
    age: "32–33",
    house: 10,
    houseLord: { A: "Mercury", B: "Mercury", C: "Moon" },
    karaka: "Sun / Mercury / Saturn",
    domain: "profession",
  },
};

const STEPS: Record<StepKey, { label: string; question: string; color: string }> = {
  house: { label: "House", question: "Which house governs this life domain?", color: BLUE },
  lord: { label: "Lord", question: "Who is that house's lord under this candidate's Lagna?", color: PURPLE },
  period: { label: "Period", question: "Which daśā-antardaśā runs at the event's date?", color: GOLD },
  activation: { label: "Activation", question: "Does the period activate the lord or karaka?", color: GREEN },
};

function FourPartTestSvg({ activeStep }: { activeStep: StepKey }) {
  const order: StepKey[] = ["house", "lord", "period", "activation"];
  return (
    <svg viewBox="0 0 620 140" role="img" aria-label="Four-part events-based rectification test" style={{ width: "100%", maxHeight: 160, display: "block" }}>
      <rect x={10} y={10} width={600} height={120} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      {order.map((step, i) => {
        const x = 70 + i * 140;
        const isPast = order.indexOf(activeStep) >= i;
        return (
          <g key={step}>
            <circle cx={x} cy={70} r={28} fill={isPast ? STEPS[step].color : `${STEPS[step].color}22`} stroke={STEPS[step].color} strokeWidth={3} />
            <text x={x} y={75} textAnchor="middle" fill={isPast ? "#fff" : INK_PRIMARY} fontSize={13} fontWeight={600}>
              {STEPS[step].label}
            </text>
            {i < 3 && (
              <path
                d={`M ${x + 32} 70 L ${x + 108} 70`}
                stroke={isPast && order.indexOf(activeStep) > i ? STEPS[step].color : HAIRLINE}
                strokeWidth={isPast && order.indexOf(activeStep) > i ? 3 : 2}
                strokeDasharray={isPast && order.indexOf(activeStep) > i ? undefined : "6 4"}
                markerEnd={isPast && order.indexOf(activeStep) > i ? `url(#arrow-${step})` : undefined}
              />
            )}
          </g>
        );
      })}
      <defs>
        {(Object.keys(STEPS) as StepKey[]).map((step) => (
          <marker key={step} id={`arrow-${step}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 8 4 L 0 8 z" fill={STEPS[step].color} />
          </marker>
        ))}
      </defs>
    </svg>
  );
}

function CandidateWindowSvg({ mode }: { mode: WindowMode }) {
  return (
    <svg viewBox="0 0 620 220" role="img" aria-label="Candidate window comparison" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={600} height={200} rx={8} fill={mode === "wide" ? `${VERMILION}08` : `${GREEN}08`} stroke={HAIRLINE} />
      <text x={310} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {mode === "narrow" ? "Vikram's narrow window: only the house map changes" : "Wide window: house map AND daśā sequence can change"}
      </text>

      {/* Timeline */}
      <line x1={60} y1={110} x2={560} y2={110} stroke={HAIRLINE} strokeWidth={3} strokeLinecap="round" />
      {mode === "narrow" ? (
        <>
          <circle cx={160} cy={110} r={10} fill={BLUE} />
          <circle cx={310} cy={110} r={10} fill={GREEN} />
          <circle cx={460} cy={110} r={10} fill={VERMILION} />
          <text x={160} y={140} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>A 05:48</text>
          <text x={310} y={140} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>B 06:00</text>
          <text x={460} y={140} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>C 06:12</text>
          <text x={160} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Virgo</text>
          <text x={310} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Virgo</text>
          <text x={460} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Libra</text>
          <rect x={120} y={76} width={400} height={24} rx={6} fill={`${GREEN}18`} stroke={GREEN} />
          <text x={320} y={92} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>Moon stays in Hasta nakṣatra — daśā sequence shared</text>
        </>
      ) : (
        <>
          <circle cx={140} cy={110} r={10} fill={BLUE} />
          <circle cx={310} cy={110} r={10} fill={GREEN} />
          <circle cx={480} cy={110} r={10} fill={VERMILION} />
          <text x={140} y={140} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>A 08:00</text>
          <text x={310} y={140} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>B 10:30</text>
          <text x={480} y={140} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>C 11:45</text>
          <text x={140} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Leo</text>
          <text x={310} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Virgo</text>
          <text x={480} y={158} textAnchor="middle" fill={INK_MUTED} fontSize={10}>Libra</text>
          <rect x={90} y={76} width={150} height={24} rx={6} fill={`${BLUE}18`} stroke={BLUE} />
          <text x={165} y={92} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>Hasta</text>
          <rect x={235} y={76} width={150} height={24} rx={6} fill={`${GOLD}18`} stroke={GOLD} />
          <text x={310} y={92} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Chitrā</text>
          <rect x={380} y={76} width={150} height={24} rx={6} fill={`${VERMILION}18`} stroke={VERMILION} />
          <text x={455} y={92} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>Svātī</text>
          <text x={310} y={188} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={600}>Different nakṣatra → different birth star → different daśā schedule</text>
        </>
      )}
    </svg>
  );
}

function EventDiscriminationSvg({ count, candidate }: { count: EventCount; candidate: CandidateKey }) {
  const fit = {
    A: { marriage: true, career: true },
    B: { marriage: true, career: true },
    C: { marriage: false, career: false },
  };
  const showMarriage = true;
  const showCareer = count === 2;
  return (
    <svg viewBox="0 0 620 200" role="img" aria-label="Event discrimination across candidates" style={{ width: "100%", maxHeight: 240, display: "block" }}>
      <rect x={10} y={10} width={600} height={180} rx={8} fill={`${PURPLE}08`} stroke={HAIRLINE} />
      <text x={310} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {count === 1 ? "One event: several candidates may seem plausible" : "Two independent events: only one candidate explains both"}
      </text>

      {/* Marriage event */}
      <g opacity={showMarriage ? 1 : 0.35}>
        <circle cx={180} cy={90} r={34} fill={`${BLUE}18`} stroke={BLUE} strokeWidth={3} />
        <text x={180} y={84} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>Marriage</text>
        <text x={180} y={100} textAnchor="middle" fill={INK_MUTED} fontSize={10}>7th house</text>
      </g>

      {/* Career event */}
      <g opacity={showCareer ? 1 : 0.35}>
        <circle cx={440} cy={90} r={34} fill={`${GOLD}18`} stroke={GOLD} strokeWidth={3} />
        <text x={440} y={84} textAnchor="middle" fill={INK_PRIMARY} fontSize={11} fontWeight={600}>Career</text>
        <text x={440} y={100} textAnchor="middle" fill={INK_MUTED} fontSize={10}>10th house</text>
      </g>

      {/* Candidate marker */}
      <circle cx={310} cy={90} r={26} fill={fit[candidate].marriage && (count === 1 || fit[candidate].career) ? GREEN : VERMILION} opacity={0.9} />
      <text x={310} y={96} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>{candidate}</text>

      {showMarriage && (
        <line x1={216} y1={90} x2={284} y2={90} stroke={fit[candidate].marriage ? GREEN : VERMILION} strokeWidth={3} strokeDasharray={fit[candidate].marriage ? undefined : "6 4"} />
      )}
      {showCareer && (
        <line x1={336} y1={90} x2={406} y2={90} stroke={fit[candidate].career ? GREEN : VERMILION} strokeWidth={3} strokeDasharray={fit[candidate].career ? undefined : "6 4"} />
      )}

      <text x={310} y={150} textAnchor="middle" fill={count === 1 ? GOLD : fit[candidate].marriage && fit[candidate].career ? GREEN : VERMILION} fontSize={12} fontWeight={600}>
        {count === 1
          ? "With one event, candidate C can still look plausible"
          : fit[candidate].marriage && fit[candidate].career
            ? "Candidate B explains both events"
            : "Candidate C fails the second event"}
      </text>
    </svg>
  );
}

export function EventsBasedRectificationFoundationExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("test");
  const [candidate, setCandidate] = useState<CandidateKey>("B");
  const [event, setEvent] = useState<EventKey>("marriage");
  const [completedSteps, setCompletedSteps] = useState<Record<StepKey, boolean>>({
    house: false,
    lord: false,
    period: false,
    activation: false,
  });
  const [windowMode, setWindowMode] = useState<WindowMode>("narrow");
  const [eventCount, setEventCount] = useState<EventCount>(1);

  const reset = () => {
    setActiveTab("test");
    setCandidate("B");
    setEvent("marriage");
    setCompletedSteps({ house: false, lord: false, period: false, activation: false });
    setWindowMode("narrow");
    setEventCount(1);
  };

  const allStepsDone = Object.values(completedSteps).every(Boolean);

  const synthesis = useMemo(() => {
    const c = CANDIDATES[candidate];
    const e = EVENTS[event];
    const lord = e.houseLord[candidate];
    if (activeTab === "test") {
      if (!allStepsDone) {
        return "Click each of the four steps above to build the precise question events-based rectification asks.";
      }
      return `For Candidate ${candidate} (${c.time}, ${c.lagna} Lagna) and the ${e.label} event at age ${e.age}: the ${e.house}th house governs ${e.domain}; under this Lagna its lord is ${lord}; the test asks whether the running daśā-antardaśā activates ${lord} or the relevant karaka (${e.karaka}).`;
    }
    if (activeTab === "window") {
      return windowMode === "narrow"
        ? "Vikram's 24-minute window keeps the Moon in one nakṣatra, so the daśā sequence is identical across A, B, and C. Only the house map differs."
        : "A wider window can move the Moon across a nakṣatra boundary. The birth star, starting mahādaśā lord, and entire schedule may differ — the method must test both house map and daśā sequence.";
    }
    return eventCount === 1
      ? "One matching event is structurally weak evidence: most charts contain several plausible periods across a lifetime."
      : "Two independent events testing different houses multiply discriminating power. A candidate must explain both coincidences, not just one.";
  }, [activeTab, allStepsDone, candidate, event, eventCount, windowMode]);

  const toggleStep = (step: StepKey) => {
    setCompletedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  return (
    <div data-interactive="events-based-rectification-foundation-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Events-based rectification · Chapter 2</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Foundation explorer
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Test whether a candidate&apos;s house map plus daśā-antardaśā sequence explains dated life events — precisely, not impressionistically.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      {/* Tab navigation */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "test" && (
        <>
          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Event</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Select a dated life event</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem" }}>
                {(Object.keys(EVENTS) as EventKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={event === key}
                    onClick={() => setEvent(key)}
                    style={buttonStyle(event === key, GOLD)}
                  >
                    {EVENTS[key].label}
                  </button>
                ))}
              </div>
              <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                {EVENTS[event].label} at age {EVENTS[event].age} tests the {EVENTS[event].house}th house ({EVENTS[event].domain}).
              </p>
            </section>

            <section style={cardStyle}>
              <p style={eyebrowStyle}>Candidate</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Select a birth-time candidate</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.5rem" }}>
                {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={candidate === key}
                    onClick={() => setCandidate(key)}
                    style={buttonStyle(candidate === key, BLUE)}
                  >
                    {key} {CANDIDATES[key].time}
                  </button>
                ))}
              </div>
              <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                Candidate {candidate}: {CANDIDATES[candidate].lagna} Lagna, {CANDIDATES[candidate].note}.
              </p>
            </section>
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Four-part precise question</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              Build the test, step by step
            </h3>
            <FourPartTestSvg activeStep={
              (Object.keys(completedSteps) as StepKey[]).filter((s) => completedSteps[s]).pop() || "house"
            } />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
              {(Object.keys(STEPS) as StepKey[]).map((step) => {
                const StepIcon = step === "house" ? MapPin : step === "lord" ? Landmark : step === "period" ? Timer : ShieldCheck;
                return (
                  <button
                    key={step}
                    type="button"
                    aria-pressed={completedSteps[step]}
                    onClick={() => toggleStep(step)}
                    style={stepCardStyle(completedSteps[step], STEPS[step].color)}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: STEPS[step].color, fontWeight: 600 }}>
                      <StepIcon size={15} aria-hidden="true" /> {STEPS[step].label}
                    </span>
                    <span style={{ fontSize: "0.9rem", color: INK_SECONDARY, lineHeight: 1.45, display: "block", marginTop: "0.35rem" }}>
                      {step === "house" && `Domain: ${EVENTS[event].house}th house (${EVENTS[event].domain})`}
                      {step === "lord" && `Lord under ${CANDIDATES[candidate].lagna}: ${EVENTS[event].houseLord[candidate]}`}
                      {step === "period" && `Daśā-antardaśā at age ${EVENTS[event].age}`}
                      {step === "activation" && `Does the period trigger the lord or karaka?`}
                    </span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${allStepsDone ? GREEN : GOLD}55`, background: `${allStepsDone ? GREEN : GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
            </div>
          </section>
        </>
      )}

      {activeTab === "window" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Candidate window</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Narrow special case versus wide general case</h3>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" aria-pressed={windowMode === "narrow"} onClick={() => setWindowMode("narrow")} style={buttonStyle(windowMode === "narrow", GREEN)}>
                  Narrow
                </button>
                <button type="button" aria-pressed={windowMode === "wide"} onClick={() => setWindowMode("wide")} style={buttonStyle(windowMode === "wide", VERMILION)}>
                  Wide
                </button>
              </div>
            </div>
            <CandidateWindowSvg mode={windowMode} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${windowMode === "narrow" ? GREEN : VERMILION}55`, background: `${windowMode === "narrow" ? GREEN : VERMILION}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Critical insight</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>Do not assume the daśā sequence is shared</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Vikram&apos;s 24-minute spread is a special case. A client who recalls only &quot;sometime in the morning&quot; can produce a window wide enough to shift the Moon&apos;s nakṣatra. For those clients, check both the house map and the daśā sequence across candidates.
            </p>
          </section>
        </>
      )}

      {activeTab === "events" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Triangulation within the method</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>One event is weak; two multiply discriminating power</h3>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" aria-pressed={eventCount === 1} onClick={() => setEventCount(1)} style={buttonStyle(eventCount === 1, GOLD)}>
                  One event
                </button>
                <button type="button" aria-pressed={eventCount === 2} onClick={() => setEventCount(2)} style={buttonStyle(eventCount === 2, GREEN)}>
                  Two events
                </button>
              </div>
            </div>
            <EventDiscriminationSvg count={eventCount} candidate={candidate} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${eventCount === 1 ? GOLD : GREEN}55`, background: `${eventCount === 1 ? GOLD : GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Candidate fit table</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>How Candidate B and Candidate C compare</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                    <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 600 }}>Candidate</th>
                    <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 600 }}>Marriage (7th)</th>
                    {eventCount === 2 && <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 600 }}>Career (10th)</th>}
                    <th style={{ textAlign: "left", padding: "0.5rem", color: INK_MUTED, fontWeight: 600 }}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
                    const fitsMarriage = EVENTS.marriage.houseLord[key] === EVENTS.marriage.houseLord.B;
                    const fitsCareer = EVENTS.career.houseLord[key] === EVENTS.career.houseLord.B;
                    const verdict = eventCount === 1
                      ? fitsMarriage ? "possible" : "weak"
                      : fitsMarriage && fitsCareer ? "strong" : "ruled out";
                    return (
                      <tr key={key} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                        <td style={{ padding: "0.5rem", color: INK_PRIMARY, fontWeight: 600 }}>{key} {CANDIDATES[key].time}</td>
                        <td style={{ padding: "0.5rem", color: fitsMarriage ? GREEN : VERMILION }}>{fitsMarriage ? "Jupiter trigger" : "Mars trigger"}</td>
                        {eventCount === 2 && <td style={{ padding: "0.5rem", color: fitsCareer ? GREEN : VERMILION }}>{fitsCareer ? "Mercury trigger" : "Moon trigger"}</td>}
                        <td style={{ padding: "0.5rem", color: verdict === "strong" ? GREEN : verdict === "possible" ? GOLD : VERMILION, fontWeight: 600 }}>{verdict}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: "var(--gl-ink-on-cream-muted)",
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: "var(--gl-card-surface-solid)",
  border: "1px solid var(--gl-gold-hairline)",
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}

function stepCardStyle(active: boolean, color: string): CSSProperties {
  return {
    textAlign: "left",
    padding: "0.75rem",
    borderRadius: 8,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}10` : SURFACE,
    cursor: "pointer",
  };
}
