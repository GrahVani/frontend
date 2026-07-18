"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Grid3X3,
  Landmark,
  MapPin,
  RefreshCcw,
  Scale,
  Search,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "matcher" | "matrix" | "verdict";
type CandidateKey = "A" | "B" | "C";
type EventKey = "marriage" | "career";
type StepKey = "house" | "lord" | "period" | "activation";

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
  matcher: { label: "Run the test", icon: Search },
  matrix: { label: "Full match matrix", icon: Grid3X3 },
  verdict: { label: "Honest verdict", icon: Scale },
};

const CANDIDATES: Record<CandidateKey, { time: string; lagna: string; lagnaLord: string; note: string }> = {
  A: { time: "05:48", lagna: "Virgo", lagnaLord: "Mercury", note: "before sunrise" },
  B: { time: "06:00", lagna: "Virgo", lagnaLord: "Mercury", note: "designed true" },
  C: { time: "06:12", lagna: "Libra", lagnaLord: "Venus", note: "sign change" },
};

const EVENTS: Record<EventKey, { label: string; age: string; house: number; domain: string; md: string; ad: string; adAge: string }> = {
  marriage: {
    label: "Marriage",
    age: "27–28",
    house: 7,
    domain: "partnership",
    md: "Mars",
    ad: "Jupiter",
    adAge: "27.46–28.39",
  },
  career: {
    label: "Career change",
    age: "29–30",
    house: 10,
    domain: "profession",
    md: "Mars",
    ad: "Mercury",
    adAge: "29.50–30.49",
  },
};

const HOUSE_DATA: Record<CandidateKey, Record<EventKey, { sign: string; lord: string; adLordHouseFromLagna: string }>> = {
  A: {
    marriage: { sign: "Pisces", lord: "Jupiter", adLordHouseFromLagna: "7th lord" },
    career: { sign: "Gemini", lord: "Mercury", adLordHouseFromLagna: "10th lord" },
  },
  B: {
    marriage: { sign: "Pisces", lord: "Jupiter", adLordHouseFromLagna: "7th lord" },
    career: { sign: "Gemini", lord: "Mercury", adLordHouseFromLagna: "10th lord" },
  },
  C: {
    marriage: { sign: "Aries", lord: "Mars", adLordHouseFromLagna: "6th lord" },
    career: { sign: "Cancer", lord: "Moon", adLordHouseFromLagna: "9th lord" },
  },
};

const FIT: Record<CandidateKey, Record<EventKey, { verdict: "strong" | "weak" | "none"; trigger: string; detail: string }>> = {
  A: {
    marriage: { verdict: "strong", trigger: "AD lord = house lord", detail: "Jupiter antardaśā lord is also 7th lord" },
    career: { verdict: "strong", trigger: "AD lord = house lord", detail: "Mercury antardaśā lord is also 10th lord" },
  },
  B: {
    marriage: { verdict: "strong", trigger: "AD lord = house lord", detail: "Jupiter antardaśā lord is also 7th lord" },
    career: { verdict: "strong", trigger: "AD lord = house lord", detail: "Mercury antardaśā lord is also 10th lord" },
  },
  C: {
    marriage: { verdict: "weak", trigger: "MD lord = house lord", detail: "Mars mahādaśā lord is 7th lord, but Jupiter antardaśā rules 6th" },
    career: { verdict: "none", trigger: "No direct link", detail: "Mercury antardaśā rules 9th, not 10th" },
  },
};

const STEPS: Record<StepKey, { label: string; color: string }> = {
  house: { label: "House", color: BLUE },
  lord: { label: "Lord", color: PURPLE },
  period: { label: "Period", color: GOLD },
  activation: { label: "Activation", color: GREEN },
};

function TriggerStrengthSvg({ strong }: { strong: boolean }) {
  return (
    <svg viewBox="0 0 460 160" role="img" aria-label="Antardasha versus mahadasha trigger strength" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={440} height={140} rx={8} fill={`${strong ? GREEN : VERMILION}08`} stroke={HAIRLINE} />
      <text x={230} y={36} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        {strong ? "Antardaśā lord = house lord" : "Mahādaśā lord = house lord only"}
      </text>

      {/* Period bar */}
      <rect x={50} y={60} width={360} height={24} rx={6} fill={`${HAIRLINE}55`} />
      {strong ? (
        <rect x={130} y={60} width={80} height={24} rx={6} fill={GREEN} />
      ) : (
        <rect x={50} y={60} width={360} height={24} rx={6} fill={`${VERMILION}30`} />
      )}
      <text x={230} y={77} textAnchor="middle" fill={INK_PRIMARY} fontSize={10} fontWeight={600}>
        {strong ? "Narrow dated window explained directly" : "Broad multi-year period explained only"}
      </text>

      <text x={230} y="120" textAnchor="middle" fill={strong ? GREEN : VERMILION} fontSize={12} fontWeight={600}>
        {strong
          ? "Stronger evidence: explains why the event clustered in this sub-window"
          : "Weaker evidence: does not explain why the event landed in this specific sub-window"}
      </text>
    </svg>
  );
}

function VerdictFlowSvg() {
  return (
    <svg viewBox="0 0 620 180" role="img" aria-label="Candidate verdict flow" style={{ width: "100%", maxHeight: 220, display: "block" }}>
      <rect x={10} y={10} width={600} height={160} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />

      {/* Start */}
      <circle cx={80} cy={90} r={32} fill={BLUE} />
      <text x={80} y={84} textAnchor="middle" fill="#fff" fontSize={11} fontWeight={600}>3</text>
      <text x={80} y={98} textAnchor="middle" fill="#fff" fontSize={10}>candidates</text>

      <line x1={116} y1={90} x2={180} y2={90} stroke={HAIRLINE} strokeWidth={3} />

      {/* Candidate A */}
      <circle cx={220} cy={50} r={28} fill={GREEN} />
      <text x={220} y={55} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>A</text>

      {/* Candidate B */}
      <circle cx={220} cy={130} r={28} fill={GREEN} />
      <text x={220} y={135} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>B</text>

      {/* Candidate C */}
      <circle cx={300} cy={90} r={28} fill={VERMILION} />
      <text x={300} y={95} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>C</text>

      <line x1={248} y1={64} x2={272} y2={80} stroke={VERMILION} strokeWidth={3} />
      <line x1={248} y1={116} x2={272} y2={100} stroke={VERMILION} strokeWidth={3} />
      <polygon points="268,78 276,84 266,86" fill={VERMILION} />
      <polygon points="266,94 276,96 268,102" fill={VERMILION} />

      <line x1={330} y1={90} x2={420} y2={90} stroke={VERMILION} strokeWidth={3} strokeDasharray="8 6" />
      <polygon points="410,84 420,90 410,96" fill={VERMILION} />
      <text x={375} y={80} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>excluded</text>

      {/* A/B remain */}
      <rect x={440} y={30} width={140} height={40} rx={6} fill={`${GOLD}18`} stroke={GOLD} />
      <text x={510} y={55} textAnchor="middle" fill={GOLD} fontSize={11} fontWeight={600}>A &amp; B survive</text>
      <rect x={440} y={110} width={140} height={40} rx={6} fill={`${PURPLE}18`} stroke={PURPLE} />
      <text x={510} y={135} textAnchor="middle" fill={PURPLE} fontSize={11} fontWeight={600}>Need D60 / vāra</text>

      <path d="M 220 22 C 220 10, 260 10, 260 30" fill="none" stroke={GOLD} strokeWidth={2} strokeDasharray="4 4" />
      <path d="M 220 158 C 220 170, 260 170, 260 150" fill="none" stroke={GOLD} strokeWidth={2} strokeDasharray="4 4" />
      <text x={260} y={12} textAnchor="middle" fill={GOLD} fontSize={9} fontWeight={600}>undistinguished</text>
    </svg>
  );
}

export function CandidateEventMatchingWorkbench() {
  const [activeTab, setActiveTab] = useState<TabKey>("matcher");
  const [candidate, setCandidate] = useState<CandidateKey>("B");
  const [event, setEvent] = useState<EventKey>("marriage");
  const [completedSteps, setCompletedSteps] = useState<Record<StepKey, boolean>>({
    house: false,
    lord: false,
    period: false,
    activation: false,
  });

  const reset = () => {
    setActiveTab("matcher");
    setCandidate("B");
    setEvent("marriage");
    setCompletedSteps({ house: false, lord: false, period: false, activation: false });
  };

  const toggleStep = (step: StepKey) => {
    setCompletedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const allStepsDone = Object.values(completedSteps).every(Boolean);
  const currentFit = FIT[candidate][event];
  const currentHouse = HOUSE_DATA[candidate][event];
  const currentEvent = EVENTS[event];

  const matcherSynthesis = useMemo(() => {
    if (!allStepsDone) return "Click each step above to see how the four-part test evaluates this candidate and event.";
    const c = CANDIDATES[candidate];
    if (currentFit.verdict === "strong") {
      return `Candidate ${candidate} (${c.time}, ${c.lagna} Lagna) shows a strong fit: the ${currentEvent.house}th house is ${currentHouse.sign} (lord ${currentHouse.lord}), and the running antardaśā lord ${currentEvent.ad} is that same lord.`;
    }
    if (currentFit.verdict === "weak") {
      return `Candidate ${candidate} (${c.time}, ${c.lagna} Lagna) shows only a weak fit: the mahādaśā lord matches the house lord, but the narrower antardaśā lord does not.`;
    }
    return `Candidate ${candidate} (${c.time}, ${c.lagna} Lagna) shows no meaningful fit: the antardaśā lord governs a different house than the ${currentEvent.house}th.`;
  }, [allStepsDone, candidate, currentEvent, currentFit.verdict, currentHouse.lord, currentHouse.sign]);

  return (
    <div data-interactive="candidate-event-matching-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Matching candidates · Chapter 2</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Candidate-event matching workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Run the four-part test on all three of Vikram&apos;s candidates against both documented events, and read the honest combined verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
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

      {activeTab === "matcher" && (
        <>
          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Candidate</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Select a birth-time candidate</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "0.5rem" }}>
                {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={candidate === key} onClick={() => setCandidate(key)} style={buttonStyle(candidate === key, BLUE)}>
                    {key} {CANDIDATES[key].time}
                  </button>
                ))}
              </div>
              <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                {CANDIDATES[candidate].lagna} Lagna · {CANDIDATES[candidate].note}
              </p>
            </section>

            <section style={cardStyle}>
              <p style={eyebrowStyle}>Event</p>
              <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Select a dated event</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.5rem" }}>
                {(Object.keys(EVENTS) as EventKey[]).map((key) => (
                  <button key={key} type="button" aria-pressed={event === key} onClick={() => setEvent(key)} style={buttonStyle(event === key, GOLD)}>
                    {EVENTS[key].label}
                  </button>
                ))}
              </div>
              <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>
                Age {currentEvent.age} · {currentEvent.md} mahādaśā / {currentEvent.ad} antardaśā
              </p>
            </section>
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Four-part test</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
              Step through the evaluation for Candidate {candidate} · {currentEvent.label}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem" }}>
              {(Object.keys(STEPS) as StepKey[]).map((step) => {
                const StepIcon = step === "house" ? MapPin : step === "lord" ? Landmark : step === "period" ? Timer : ShieldCheck;
                return (
                  <button key={step} type="button" aria-pressed={completedSteps[step]} onClick={() => toggleStep(step)} style={stepCardStyle(completedSteps[step], STEPS[step].color)}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: STEPS[step].color, fontWeight: 600 }}>
                      <StepIcon size={15} aria-hidden="true" /> {STEPS[step].label}
                    </span>
                    <span style={{ fontSize: "0.9rem", color: INK_SECONDARY, lineHeight: 1.45, display: "block", marginTop: "0.35rem" }}>
                      {step === "house" && `${currentEvent.house}th house governs ${currentEvent.domain}`}
                      {step === "lord" && `Under ${CANDIDATES[candidate].lagna}: ${currentHouse.sign} · lord ${currentHouse.lord}`}
                      {step === "period" && `${currentEvent.md} MD / ${currentEvent.ad} AD, age ${currentEvent.adAge}`}
                      {step === "activation" && `${currentEvent.ad} antardaśā ${currentHouse.adLordHouseFromLagna === `${currentEvent.house}th lord` ? "is" : "is not"} the ${currentEvent.house}th lord`}
                    </span>
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${allStepsDone ? currentFit.verdict === "strong" ? GREEN : currentFit.verdict === "weak" ? GOLD : VERMILION : GOLD}55`, background: `${allStepsDone ? currentFit.verdict === "strong" ? GREEN : currentFit.verdict === "weak" ? GOLD : VERMILION : GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{matcherSynthesis}</p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Trigger strength</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>{currentFit.trigger}</h3>
            <TriggerStrengthSvg strong={currentFit.verdict === "strong"} />
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{currentFit.detail}</p>
          </section>
        </>
      )}

      {activeTab === "matrix" && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Match matrix</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>All candidates × both events</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                  <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Candidate</th>
                  <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Event 1 · Marriage (7th)</th>
                  <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Event 2 · Career (10th)</th>
                  <th style={{ textAlign: "left", padding: "0.6rem", color: INK_MUTED, fontWeight: 600 }}>Combined</th>
                </tr>
              </thead>
              <tbody>
                {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
                  const m = FIT[key].marriage.verdict;
                  const c = FIT[key].career.verdict;
                  const combined = m === "strong" && c === "strong" ? "strong" : m === "none" || c === "none" ? "excluded" : "weak";
                  return (
                    <tr key={key} style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                      <td style={{ padding: "0.6rem", color: INK_PRIMARY, fontWeight: 600 }}>
                        {key} {CANDIDATES[key].time}
                        <br />
                        <span style={{ color: INK_MUTED, fontWeight: 400, fontSize: "0.85rem" }}>{CANDIDATES[key].lagna} Lagna</span>
                      </td>
                      <td style={{ padding: "0.6rem", color: m === "strong" ? GREEN : m === "weak" ? GOLD : VERMILION }}>
                        {FIT[key].marriage.trigger}
                      </td>
                      <td style={{ padding: "0.6rem", color: c === "strong" ? GREEN : c === "weak" ? GOLD : VERMILION }}>
                        {FIT[key].career.trigger}
                      </td>
                      <td style={{ padding: "0.6rem", color: combined === "strong" ? GREEN : combined === "excluded" ? VERMILION : GOLD, fontWeight: 600 }}>
                        {combined === "strong" ? "Strong on both" : combined === "excluded" ? "Confidently excluded" : "Weak overall"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              The full table is built from already-verified figures in m20_chart_data.md: Mars/Jupiter antardaśā for marriage and Mars/Mercury antardaśā for career, with house lordships derived from each candidate&apos;s Lagna.
            </p>
          </div>
        </section>
      )}

      {activeTab === "verdict" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Honest combined verdict</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Three candidates narrowed to two</h3>
            <VerdictFlowSvg />
            <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Candidate C is excluded.</span>{" "}
                  It fails both independent tests — weak on marriage and no meaningful fit on career.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GOLD, fontWeight: 600 }}>Candidates A and B are not distinguished.</span>{" "}
                  They share Virgo Lagna, so every house-lordship test gives the same result. This is the honest limit of this method on its own.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: PURPLE, fontWeight: 600 }}>The remaining A/B question goes elsewhere.</span>{" "}
                  A signal sensitive to degree within the sign — D60 or vāra — is needed, not more house-lordship events.
                </p>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Critical insight</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>More of the same evidence cannot break the tie</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Any event whose signification is read through house lordship relative to the Lagna <em>sign</em> will produce an identical result for A and B. Only a degree-level signal — such as the D60 index or the vāra/day-lord — can separate them.
            </p>
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
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
