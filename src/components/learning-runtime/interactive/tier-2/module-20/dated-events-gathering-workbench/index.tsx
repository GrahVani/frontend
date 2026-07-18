"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  Clock,
  Compass,
  Filter,
  MessageCircleQuestion,
  Mic,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Target,
  XCircle,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "screener" | "precision" | "interview";
type QualityKey = "precise" | "houseMapped" | "independent" | "corroborated";

type EventSample = {
  id: string;
  statement: string;
  domain: string;
  ideal: Record<QualityKey, boolean>;
  note: string;
};

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

const TABS: Record<TabKey, { label: string; icon: typeof Filter }> = {
  screener: { label: "Usability screener", icon: Filter },
  precision: { label: "Precision vs period", icon: Clock },
  interview: { label: "Interview discipline", icon: Mic },
};

const QUALITIES: Record<QualityKey, { label: string; question: string; color: string }> = {
  precise: { label: "Precise enough", question: "Is the date or age range narrow enough?", color: BLUE },
  houseMapped: { label: "Clear house", question: "Does it map to a specific house?", color: PURPLE },
  independent: { label: "Independent", question: "Does it test a different house than events already gathered?", color: GOLD },
  corroborated: { label: "Corroborated", question: "Can it be checked externally?", color: GREEN },
};

const EVENT_SAMPLES: EventSample[] = [
  {
    id: "marriage",
    statement: "I got married in my 28th year.",
    domain: "7th house · partnership",
    ideal: { precise: true, houseMapped: true, independent: true, corroborated: true },
    note: "Pins to one year, maps cleanly to marriage, is independent, and is usually certifiable.",
  },
  {
    id: "career",
    statement: "I changed jobs a couple of years after marriage.",
    domain: "10th house · profession",
    ideal: { precise: false, houseMapped: true, independent: true, corroborated: true },
    note: "Less precise, but still usable if the range stays inside one antardaśā window.",
  },
  {
    id: "unsettled",
    statement: "I felt unsettled through most of my thirties.",
    domain: "No clear house",
    ideal: { precise: false, houseMapped: false, independent: false, corroborated: false },
    note: "No specific event, no house signification, and a decade-wide range — unusable as-is.",
  },
  {
    id: "childsame",
    statement: "My first child was born the same year I married.",
    domain: "5th house · children",
    ideal: { precise: true, houseMapped: true, independent: false, corroborated: true },
    note: "Correlates with the marriage year; useful for corroboration, but adds little independent discrimination.",
  },
];

const LEADING_QUESTIONS = [
  {
    bad: "Your career change — that would have been right around when things were going really well with Mercury, wouldn't you say, maybe age 30?",
    good: "Tell me about your career. Were there any major changes? Roughly how old were you?",
    flaw: "Names a planet (Mercury) and a suspected age (30) inside the question.",
  },
  {
    bad: "You married around 28, but was it closer to 27, when Jupiter was especially active?",
    good: "You mentioned marrying around 28. Do you remember whether that was closer to 27 or 28?",
    flaw: "Implies a preferred answer by mentioning Jupiter and steering toward 27.",
  },
  {
    bad: "Did your health crisis happen during the Saturn period, around age 36?",
    good: "Can you tell me about any serious health events, and roughly when they occurred?",
    flaw: "Names both a period (Saturn) and an age before the client has described the event.",
  },
];

function QualityScreenerSvg({ counts }: { counts: { met: number; total: number } }) {
  const ratio = counts.total === 0 ? 0 : counts.met / counts.total;
  const color = ratio >= 0.75 ? GREEN : ratio >= 0.5 ? GOLD : VERMILION;
  return (
    <svg viewBox="0 0 260 120" role="img" aria-label="Event usability quality meter" style={{ width: "100%", maxHeight: 120, display: "block" }}>
      <rect x={10} y={10} width={240} height={100} rx={8} fill={`${color}08`} stroke={HAIRLINE} />
      <text x={130} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>Usability quality meter</text>
      <rect x={30} y={55} width={200} height={18} rx={9} fill={`${HAIRLINE}55`} />
      <rect x={30} y={55} width={200 * ratio} height={18} rx={9} fill={color} />
      <text x={130} y={92} textAnchor="middle" fill={color} fontSize={13} fontWeight={600}>
        {counts.met} of {counts.total} qualities met
      </text>
    </svg>
  );
}

function PrecisionVsWindowSvg({ uncertainty }: { uncertainty: number }) {
  const rangeLow = 29;
  const rangeHigh = 30 + uncertainty;
  const windowLow = 29.5;
  const windowHigh = 30.49;
  const fits = rangeLow >= windowLow - 0.05 && rangeHigh <= windowHigh + 0.05;
  return (
    <svg viewBox="0 0 620 220" role="img" aria-label="Career change uncertainty versus antardasha window" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      <rect x={10} y={10} width={600} height={200} rx={8} fill={fits ? `${GREEN}08` : `${VERMILION}08`} stroke={HAIRLINE} />
      <text x={310} y={38} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        Is the stated range inside one antardaśā window?
      </text>

      {/* Age axis */}
      <line x1={60} y1={110} x2={560} y2={110} stroke={HAIRLINE} strokeWidth={3} strokeLinecap="round" />
      {[28, 29, 30, 31, 32].map((age) => {
        const x = 60 + (age - 28) * 125;
        return (
          <g key={age}>
            <line x1={x} y1={102} x2={x} y2={118} stroke={HAIRLINE} strokeWidth={2} />
            <text x={x} y={138} textAnchor="middle" fill={INK_MUTED} fontSize={12} fontWeight={600}>age {age}</text>
          </g>
        );
      })}

      {/* Antardasha window */}
      <rect x={60 + (29.5 - 28) * 125} y={70} width={(30.49 - 29.5) * 125} height={28} rx={6} fill={`${GOLD}22`} stroke={GOLD} strokeWidth={2} />
      <text x={60 + (29.995 - 28) * 125} y={88} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={600}>Mars/Mercury antardaśā</text>

      {/* Event range */}
      <rect x={60 + (rangeLow - 28) * 125} y={150} width={(rangeHigh - rangeLow) * 125} height={24} rx={6} fill={`${BLUE}30`} stroke={BLUE} strokeWidth={2} />
      <text x={60 + ((rangeLow + rangeHigh) / 2 - 28) * 125} y={166} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>client range</text>

      <text x={310} y={190} textAnchor="middle" fill={fits ? GREEN : VERMILION} fontSize={12} fontWeight={600}>
        {fits
          ? "Range stays inside one antardaśā window — usable despite looser phrasing"
          : "Range crosses a period boundary — too vague to discriminate"}
      </text>
    </svg>
  );
}

function InterviewFlowSvg({ step }: { step: number }) {
  const stages = [
    { label: "Open question", detail: "What happened?" },
    { label: "Narrow timing", detail: "Roughly when?" },
    { label: "Record as given", detail: "Client's own words" },
    { label: "Interpret later", detail: "Against candidates" },
  ];
  return (
    <svg viewBox="0 0 620 150" role="img" aria-label="Interview protocol flow" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={600} height={130} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      {stages.map((s, i) => {
        const x = 85 + i * 150;
        const active = i <= step;
        return (
          <g key={s.label}>
            <circle cx={x} cy={60} r={28} fill={active ? BLUE : `${INK_MUTED}33`} stroke={active ? BLUE : HAIRLINE} strokeWidth={3} />
            <text x={x} y={66} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>{i + 1}</text>
            <text x={x} y={105} textAnchor="middle" fill={active ? INK_PRIMARY : INK_MUTED} fontSize={11} fontWeight={600}>{s.label}</text>
            <text x={x} y={120} textAnchor="middle" fill={INK_MUTED} fontSize={10}>{s.detail}</text>
            {i < 3 && (
              <line x1={x + 32} y1={60} x2={x + 118} y2={60} stroke={active ? BLUE : HAIRLINE} strokeWidth={active ? 3 : 2} strokeDasharray={active ? undefined : "6 4"} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

function LeadingQuestionSvg({ mode }: { mode: "bad" | "good" }) {
  return (
    <svg viewBox="0 0 460 160" role="img" aria-label="Leading versus neutral question flow" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x={10} y={10} width={440} height={140} rx={8} fill={`${mode === "bad" ? VERMILION : GREEN}08`} stroke={HAIRLINE} />
      <circle cx={80} cy={80} r={30} fill={mode === "bad" ? VERMILION : GREEN} />
      <text x={80} y={86} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>Question</text>
      {mode === "bad" ? (
        <>
          <path d="M 115 80 C 170 50, 220 50, 275 80" fill="none" stroke={VERMILION} strokeWidth={4} strokeDasharray="8 6" />
          <polygon points="265,72 275,80 265,88" fill={VERMILION} />
          <circle cx={330} cy={80} r={30} fill={`${VERMILION}22`} stroke={VERMILION} strokeWidth={3} />
          <text x={330} y={76} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>Biased</text>
          <text x={330} y={90} textAnchor="middle" fill={VERMILION} fontSize={10}>memory</text>
        </>
      ) : (
        <>
          <path d="M 115 80 C 170 110, 220 110, 275 80" fill="none" stroke={GREEN} strokeWidth={4} />
          <polygon points="265,72 275,80 265,88" fill={GREEN} />
          <circle cx={330} cy={80} r={30} fill={`${GREEN}22`} stroke={GREEN} strokeWidth={3} />
          <text x={330} y={76} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>Independent</text>
          <text x={330} y={90} textAnchor="middle" fill={GREEN} fontSize={10}>report</text>
        </>
      )}
      <text x={230} y={135} textAnchor="middle" fill={mode === "bad" ? VERMILION : GREEN} fontSize={12} fontWeight={600}>
        {mode === "bad" ? "Question plants the answer" : "Question leaves the answer to the client"}
      </text>
    </svg>
  );
}

export function DatedEventsGatheringWorkbench() {
  const [activeTab, setActiveTab] = useState<TabKey>("screener");
  const [assessments, setAssessments] = useState<Record<string, Record<QualityKey, boolean>>>(
    Object.fromEntries(EVENT_SAMPLES.map((e) => [e.id, { precise: false, houseMapped: false, independent: false, corroborated: false }]))
  );
  const [uncertainty, setUncertainty] = useState<number>(1);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [questionVerdict, setQuestionVerdict] = useState<"leading" | "neutral" | null>(null);
  const [protocolStep, setProtocolStep] = useState<number>(0);

  const reset = () => {
    setActiveTab("screener");
    setAssessments(Object.fromEntries(EVENT_SAMPLES.map((e) => [e.id, { precise: false, houseMapped: false, independent: false, corroborated: false }])));
    setUncertainty(1);
    setQuestionIndex(0);
    setQuestionVerdict(null);
    setProtocolStep(0);
  };

  const toggleQuality = (eventId: string, quality: QualityKey) => {
    setAssessments((prev) => ({
      ...prev,
      [eventId]: { ...prev[eventId], [quality]: !prev[eventId][quality] },
    }));
  };

  const qualityCounts = useMemo(() => {
    let met = 0;
    let total = 0;
    Object.values(assessments).forEach((eventQs) => {
      Object.values(eventQs).forEach((v) => {
        total += 1;
        if (v) met += 1;
      });
    });
    return { met, total };
  }, [assessments]);

  const screenerSynthesis = useMemo(() => {
    const allAssessed = EVENT_SAMPLES.every((e) => Object.values(assessments[e.id]).some(Boolean));
    if (!allAssessed) return "Toggle each quality for the sample events above. The meter shows how many of the four usability qualities are currently marked.";
    const marriage = assessments.marriage;
    const allMarriageMet = Object.values(marriage).every(Boolean);
    const unsettled = assessments.unsettled;
    const allUnsettledMissed = Object.values(unsettled).every((v) => !v);
    if (allMarriageMet && allUnsettledMissed) {
      return "Good discrimination: the precise, well-mapped marriage event scores highly, while the vague 'felt unsettled' statement scores low — exactly the gap events-based rectification depends on.";
    }
    return "A usable event needs precise timing, clear house signification, independence from other events, and external corroboration where possible. Not every event needs all four at full strength, but missing several weakens it sharply.";
  }, [assessments]);

  const currentQuestion = LEADING_QUESTIONS[questionIndex];

  return (
    <div data-interactive="dated-events-gathering-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Gathering dated events · Chapter 2</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Dated events gathering workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Practise the interview skill the whole method depends on: screen events for usability, check imprecision against the local daśā window, and avoid leading questions.
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

      {activeTab === "screener" && (
        <>
          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Four usability qualities</p>
              <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>What makes an event usable</h3>
              <div style={{ display: "grid", gap: "0.5rem" }}>
                {(Object.keys(QUALITIES) as QualityKey[]).map((q) => {
                  const QualityIcon = q === "precise" ? Clock : q === "houseMapped" ? Target : q === "independent" ? Scale : ShieldCheck;
                  return (
                    <div key={q} style={{ display: "flex", gap: "0.65rem", padding: "0.55rem", borderRadius: 6, border: `1px solid ${QUALITIES[q].color}44`, background: `${QUALITIES[q].color}10` }}>
                      <QualityIcon size={18} color={QUALITIES[q].color} aria-hidden="true" />
                      <div>
                        <p style={{ margin: 0, color: QUALITIES[q].color, fontWeight: 600, fontSize: "0.92rem" }}>{QUALITIES[q].label}</p>
                        <p style={{ margin: "0.15rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.4 }}>{QUALITIES[q].question}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section style={cardStyle}>
              <p style={eyebrowStyle}>Overall meter</p>
              <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>How the sample events score</h3>
              <QualityScreenerSvg counts={qualityCounts} />
              <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.92rem" }}>{screenerSynthesis}</p>
              </div>
            </section>
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Sample events</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Mark the qualities each statement satisfies</h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {EVENT_SAMPLES.map((event) => {
                const metCount = Object.values(assessments[event.id]).filter(Boolean).length;
                return (
                  <div key={event.id} style={{ padding: "0.85rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                      <div>
                        <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600 }}>“{event.statement}”</p>
                        <p style={{ margin: "0.2rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>{event.domain}</p>
                      </div>
                      <span style={{ color: metCount >= 3 ? GREEN : metCount >= 1 ? GOLD : VERMILION, fontWeight: 600, fontSize: "0.9rem" }}>
                        {metCount}/4 qualities
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {(Object.keys(QUALITIES) as QualityKey[]).map((q) => (
                        <button
                          key={q}
                          type="button"
                          aria-pressed={assessments[event.id][q]}
                          onClick={() => toggleQuality(event.id, q)}
                          style={qualityChipStyle(assessments[event.id][q], QUALITIES[q].color)}
                        >
                          {assessments[event.id][q] ? <CheckCircle2 size={13} aria-hidden="true" /> : <XCircle size={13} aria-hidden="true" />}
                          {QUALITIES[q].label}
                        </button>
                      ))}
                    </div>
                    <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{event.note}</p>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {activeTab === "precision" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Relative precision</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Vikram&apos;s career-change uncertainty</h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ color: INK_SECONDARY, fontSize: "0.9rem" }}>Uncertainty:</span>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={1}
                  value={uncertainty}
                  onChange={(e) => setUncertainty(Number(e.target.value))}
                  style={{ width: 140 }}
                />
                <span style={{ color: GOLD, fontWeight: 600, minWidth: 90 }}>±{uncertainty} year{uncertainty === 1 ? "" : "s"}</span>
              </div>
            </div>
            <PrecisionVsWindowSvg uncertainty={uncertainty} />
            <div style={{ marginTop: "0.85rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${uncertainty <= 1 ? GREEN : uncertainty === 2 ? GOLD : VERMILION}55`, background: `${uncertainty <= 1 ? GREEN : uncertainty === 2 ? GOLD : VERMILION}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {uncertainty <= 1
                  ? "'A couple of years after marriage' lands inside the Mars/Mercury antardaśā window — usable despite looser phrasing."
                  : uncertainty === 2
                    ? "The range is getting wider; it still may fit, but the discrimination weakens."
                    : "A ±3-year range easily straddles into a different antardaśā lord's territory — too vague to use."}
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Critical insight</p>
            <h3 style={{ margin: "0.15rem 0 0.5rem", color: GREEN, fontSize: "1.15rem", fontWeight: 600 }}>Precision is relative to the local daśā structure</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              An event does not need date-level precision. It needs its stated age-range to stay inside a single antardaśā window. Straddling two windows means the event cannot discriminate which lord is the better fit.
            </p>
          </section>
        </>
      )}

      {activeTab === "interview" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Leading-question detector</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Spot the bias</h3>
              </div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {LEADING_QUESTIONS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={questionIndex === i}
                    onClick={() => { setQuestionIndex(i); setQuestionVerdict(null); }}
                    style={dotChipStyle(questionIndex === i, GOLD)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: "0.75rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.85rem", fontWeight: 600 }}>Practitioner asks:</p>
              <p style={{ margin: "0.35rem 0 0", color: INK_PRIMARY, lineHeight: 1.55, fontStyle: "italic" }}>“{currentQuestion.bad}”</p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button type="button" aria-pressed={questionVerdict === "leading"} onClick={() => setQuestionVerdict("leading")} style={buttonStyle(questionVerdict === "leading", VERMILION)}>
                <MessageCircleQuestion size={15} aria-hidden="true" /> Leading
              </button>
              <button type="button" aria-pressed={questionVerdict === "neutral"} onClick={() => setQuestionVerdict("neutral")} style={buttonStyle(questionVerdict === "neutral", GREEN)}>
                <ShieldCheck size={15} aria-hidden="true" /> Neutral
              </button>
            </div>

            {questionVerdict && (
              <div style={{ marginTop: "0.75rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${questionVerdict === "leading" ? GREEN : VERMILION}55`, background: `${questionVerdict === "leading" ? GREEN : VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  {questionVerdict === "leading"
                    ? `Correct. ${currentQuestion.flaw} The neutral version is: “${currentQuestion.good}”`
                    : `Not neutral. ${currentQuestion.flaw} The neutral version is: “${currentQuestion.good}”`}
                </p>
              </div>
            )}

            <LeadingQuestionSvg mode={questionVerdict === "leading" ? "bad" : questionVerdict === "neutral" ? "good" : "bad"} />
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Protocol flow</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>Step through the interview</h3>
              </div>
              <button type="button" onClick={() => setProtocolStep((s) => (s + 1) % 4)} style={buttonStyle(false, BLUE)}>
                <Compass size={15} aria-hidden="true" /> Next step
              </button>
            </div>
            <InterviewFlowSvg step={protocolStep} />
            <div style={{ marginTop: "0.75rem", padding: "0.85rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                {protocolStep === 0 && "Start open: 'Tell me about significant milestones in your life.' No candidates, planets, or periods are mentioned yet."}
                {protocolStep === 1 && "Narrow only on timing: 'Do you remember roughly how old you were?' Keep the question free of astrological content."}
                {protocolStep === 2 && "Record the client's account exactly as given, before any candidate comparison. This preserves independence."}
                {protocolStep === 3 && "Interpret later, privately, against the candidates. The question that produced the evidence must remain clean."}
              </p>
            </div>
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

function qualityChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.35rem 0.55rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.85rem",
  };
}

function dotChipStyle(active: boolean, color: string): CSSProperties {
  return {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
  };
}
