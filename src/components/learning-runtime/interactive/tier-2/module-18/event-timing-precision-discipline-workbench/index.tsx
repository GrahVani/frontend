"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CalendarClock,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  Scale,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import {
  workbenchDiagramLayoutStyle,
  workbenchTwoColumnStyle,
} from "@/components/learning-runtime/interactive/lib/layouts";

type BirthQuality = "approximate" | "rounded" | "recorded" | "rectified";
type ScenarioType = "predict" | "select";
type DisciplineStep = "acknowledge" | "explain" | "deliver" | "redirect";

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

const BIRTH_QUALITY: Record<
  BirthQuality,
  { label: string; maxDepth: string; description: string; color: string }
> = {
  approximate: {
    label: "Approximate",
    maxDepth: "Mahādaśā",
    description: "Family recollection or broad time range; no reliable record.",
    color: VERMILION,
  },
  rounded: {
    label: "Rounded record",
    maxDepth: "Antardaśā",
    description: "Hospital record rounded to 5–15 minutes; unverified.",
    color: GOLD,
  },
  recorded: {
    label: "Minute-recorded",
    maxDepth: "Pratyantardaśā",
    description: "Documented to the minute; plausible but not cross-checked.",
    color: BLUE,
  },
  rectified: {
    label: "Rectified",
    maxDepth: "Sūkṣma-daśā",
    description: "Verified against known life events; strongest support.",
    color: GREEN,
  },
};

const SCENARIOS: Array<{
  text: string;
  correct: ScenarioType;
  explanation: string;
}> = [
  {
    text: "When should I sign the contract?",
    correct: "select",
    explanation:
      "The client controls the signing moment — this is a muhūrta selection question.",
  },
  {
    text: "When will a job offer arrive?",
    correct: "predict",
    explanation:
      "The client does not control when the offer arrives — this is a daśā prediction window.",
  },
  {
    text: "What hour should we hold the wedding?",
    correct: "select",
    explanation:
      "The ceremony time is chosen — muhūrta can give clock-time precision.",
  },
  {
    text: "When am I likely to meet a partner?",
    correct: "predict",
    explanation:
      "Meeting another person is not controlled by the client — only a tendency window is honest.",
  },
  {
    text: "When should I launch my business?",
    correct: "select",
    explanation:
      "Launch timing is a controlled action — muhūrta is the right precision tool.",
  },
];

const DISCIPLINE_STEPS: Record<
  DisciplineStep,
  { label: string; prompt: string; placeholder: string }
> = {
  acknowledge: {
    label: "Acknowledge",
    prompt: "Name the client's wish without condescension.",
    placeholder: "It makes sense that you want a precise date...",
  },
  explain: {
    label: "Explain honestly",
    prompt: "Briefly state why clock-time precision is not available.",
    placeholder:
      "Even a small birth-time uncertainty shifts narrow dasha windows...",
  },
  deliver: {
    label: "Deliver the tier",
    prompt: "Give the best-supported window with its confidence tier.",
    placeholder: "What I can say with moderate confidence is...",
  },
  redirect: {
    label: "Redirect if relevant",
    prompt: "Offer muhūrta for any genuine scheduling decision.",
    placeholder: "If you are deciding when to act, we can use muhūrta...",
  },
};

export function EventTimingPrecisionDisciplineWorkbench() {
  const [minutesError, setMinutesError] = useState<number>(5);
  const [birthQuality, setBirthQuality] = useState<BirthQuality>("rounded");
  const [scenarioAnswers, setScenarioAnswers] = useState<
    Partial<Record<number, ScenarioType>>
  >({});
  const [disciplineInputs, setDisciplineInputs] = useState<
    Record<DisciplineStep, string>
  >({
    acknowledge: "It makes sense that you want a precise date.",
    explain:
      "A small birth-time uncertainty shifts narrow dasha windows by days, so I can only give you a responsible window, not a clock-time moment.",
    deliver:
      "With moderate confidence, the active tendency runs roughly [window].",
    redirect:
      "If you need to choose exactly when to act once things move, that's what muhūrta is for.",
  });

  const daysShift = useMemo(() => minutesError * 1.758, [minutesError]);

  const windows = [
    { label: "Antardaśā", minDays: 183, maxDays: 609, color: BLUE },
    { label: "Pratyantardaśā", minDays: 11, maxDays: 36, color: GREEN },
    { label: "Sūkṣma-daśā", minDays: 1.7, maxDays: 5.6, color: GOLD },
    { label: "Prāṇa-daśā", minDays: 0.25, maxDays: 0.88, color: VERMILION },
  ];

  return (
    <div
      data-interactive="event-timing-precision-discipline-workbench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Precision vs false precision</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              When flawless arithmetic is still a false promise
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              The cascade computes exactly, but its inputs are not exact. Match
              depth to data quality, distinguish predicting from selecting, and
              respond honestly to clock-time requests.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setMinutesError(5);
              setBirthQuality("rounded");
              setScenarioAnswers({});
              setDisciplineInputs({
                acknowledge: "It makes sense that you want a precise date.",
                explain:
                  "A small birth-time uncertainty shifts narrow dasha windows by days, so I can only give you a responsible window, not a clock-time moment.",
                deliver:
                  "With moderate confidence, the active tendency runs roughly [window].",
                redirect:
                  "If you need to choose exactly when to act once things move, that's what muhūrta is for.",
              });
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Birth-time sensitivity</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: VERMILION,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            A few minutes of recording error shifts every boundary
          </h3>
          <SensitivitySvg minutesError={minutesError} daysShift={daysShift} />
          <div style={{ marginTop: "0.75rem" }}>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={minutesError}
              onChange={(e) => setMinutesError(parseInt(e.target.value, 10))}
              style={{ width: "100%" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.35rem",
                color: INK_MUTED,
                fontSize: "0.78rem",
              }}
            >
              <span>1 min</span>
              <span style={{ color: VERMILION, fontWeight: 700 }}>
                {minutesError} minute{minutesError === 1 ? "" : "s"} error
              </span>
              <span>15 min</span>
            </div>
          </div>
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: `${VERMILION}0F`,
              border: `1px solid ${VERMILION}33`,
              color: INK_SECONDARY,
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: VERMILION, fontWeight: 700 }}>Result:</strong>{" "}
            A {minutesError}-minute birth-time recording error shifts every
            downstream dasha boundary by approximately{" "}
            <strong style={{ color: VERMILION, fontWeight: 700 }}>
              {daysShift.toFixed(2)} days
            </strong>
            .
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Compared to cascade windows" icon={<Scale size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {windows.map((w) => {
                const swamped = daysShift > w.maxDays;
                return (
                  <div
                    key={w.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.55rem 0.65rem",
                      borderRadius: 8,
                      border: `1px solid ${swamped ? VERMILION : w.color}44`,
                      background: swamped ? `${VERMILION}0F` : "transparent",
                    }}
                  >
                    <span style={{ color: w.color, fontWeight: 700 }}>
                      {w.label}
                    </span>
                    <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>
                      {w.minDays}–{w.maxDays} d
                    </span>
                    {swamped ? (
                      <span
                        style={{
                          color: VERMILION,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                        }}
                      >
                        swamped
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
            <p style={bodyTextStyle}>
              &ldquo;Swamped&rdquo; means the ordinary birth-time error is larger than the
              entire window, making that level unreliable for this data.
            </p>
          </Panel>

          <Panel title="Birth-data quality" icon={<SlidersHorizontal size={18} />} color={GREEN}>
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {(Object.keys(BIRTH_QUALITY) as BirthQuality[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={birthQuality === key}
                  onClick={() => setBirthQuality(key)}
                  style={{
                    textAlign: "left",
                    border: `1px solid ${birthQuality === key ? BIRTH_QUALITY[key].color : HAIRLINE}`,
                    borderRadius: 8,
                    background:
                      birthQuality === key
                        ? `${BIRTH_QUALITY[key].color}12`
                        : "transparent",
                    color:
                      birthQuality === key
                        ? BIRTH_QUALITY[key].color
                        : INK_SECONDARY,
                    padding: "0.55rem 0.65rem",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontWeight: 700 }}>
                    {BIRTH_QUALITY[key].label}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      marginTop: "0.15rem",
                      color: INK_MUTED,
                    }}
                  >
                    Max depth: {BIRTH_QUALITY[key].maxDepth}
                  </span>
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{BIRTH_QUALITY[birthQuality].description}</p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Predicting vs selecting</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: PURPLE,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Sort each question by its epistemic type
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            Muhūrta selects a controlled moment; daśā predicts an uncontrolled
            window. Click the right category for each question.
          </p>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {SCENARIOS.map((scenario, index) => {
              const answer = scenarioAnswers[index];
              const isCorrect = answer === scenario.correct;
              return (
                <div
                  key={index}
                  style={{
                    border: `1px solid ${
                      answer ? (isCorrect ? GREEN : VERMILION) : HAIRLINE
                    }44`,
                    borderRadius: 8,
                    background: answer
                      ? isCorrect
                        ? `${GREEN}0F`
                        : `${VERMILION}0F`
                      : "transparent",
                    padding: "0.75rem",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 0.5rem",
                      color: INK_PRIMARY,
                      fontWeight: 600,
                    }}
                  >
                    &ldquo;{scenario.text}&rdquo;
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      aria-pressed={answer === "predict"}
                      onClick={() =>
                        setScenarioAnswers((prev) => ({
                          ...prev,
                          [index]: "predict",
                        }))
                      }
                      style={smallChipStyle(
                        answer === "predict",
                        BLUE
                      )}
                    >
                      Predict window
                    </button>
                    <button
                      type="button"
                      aria-pressed={answer === "select"}
                      onClick={() =>
                        setScenarioAnswers((prev) => ({
                          ...prev,
                          [index]: "select",
                        }))
                      }
                      style={smallChipStyle(
                        answer === "select",
                        GREEN
                      )}
                    >
                      Select moment
                    </button>
                  </div>
                  {answer ? (
                    <p
                      style={{
                        margin: "0.5rem 0 0",
                        color: isCorrect ? GREEN : VERMILION,
                        fontSize: "0.85rem",
                        lineHeight: 1.45,
                      }}
                    >
                      {isCorrect ? (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.35rem",
                          }}
                        >
                          <CheckCircle2 size={14} aria-hidden="true" />
                          {scenario.explanation}
                        </span>
                      ) : (
                        scenario.explanation
                      )}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Client response builder</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: GREEN,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Practise the four-step discipline
          </h3>
          <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            Draft each part of an honest, non-dismissive response to a
            clock-time request.
          </p>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {(
              ["acknowledge", "explain", "deliver", "redirect"] as DisciplineStep[]
            ).map((step) => (
              <div key={step}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: GREEN,
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  {step === "acknowledge" ? (
                    <MessageCircle size={14} />
                  ) : step === "explain" ? (
                    <Scale size={14} />
                  ) : step === "deliver" ? (
                    <Target size={14} />
                  ) : (
                    <CalendarClock size={14} />
                  )}
                  {DISCIPLINE_STEPS[step].label}
                </label>
                <p
                  style={{
                    margin: "0 0 0.35rem",
                    color: INK_MUTED,
                    fontSize: "0.78rem",
                  }}
                >
                  {DISCIPLINE_STEPS[step].prompt}
                </p>
                <textarea
                  value={disciplineInputs[step]}
                  onChange={(e) =>
                    setDisciplineInputs((prev) => ({
                      ...prev,
                      [step]: e.target.value,
                    }))
                  }
                  placeholder={DISCIPLINE_STEPS[step].placeholder}
                  rows={2}
                  style={{
                    width: "100%",
                    padding: "0.55rem",
                    border: `1px solid ${HAIRLINE}`,
                    borderRadius: 8,
                    background: "transparent",
                    color: INK_PRIMARY,
                    fontSize: "0.9rem",
                    resize: "vertical",
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              background: `${GREEN}0F`,
              border: `1px solid ${GREEN}44`,
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <p style={{ margin: 0, color: GREEN, fontWeight: 700, marginBottom: "0.35rem" }}>
              Full response preview
            </p>
            <p style={{ margin: 0 }}>
              {disciplineInputs.acknowledge} {disciplineInputs.explain}{" "}
              {disciplineInputs.deliver} {disciplineInputs.redirect}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function SensitivitySvg({
  minutesError,
  daysShift,
}: {
  minutesError: number;
  daysShift: number;
}) {
  const width = 520;
  const height = 180;
  const barY = 80;
  const barHeight = 36;
  const maxDays = 30;
  const barWidth = (daysShift / maxDays) * 400;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Birth-time error mapped to dasha boundary shift"
      style={{
        width: "100%",
        maxHeight: 220,
        margin: "0.4rem auto 0.85rem",
        display: "block",
      }}
    >
      <rect x="40" y={barY} width="400" height={barHeight} rx={8} fill={`${VERMILION}12`} stroke={HAIRLINE} />
      <rect x="40" y={barY} width={Math.min(400, barWidth)} height={barHeight} rx={8} fill={`${VERMILION}40`} stroke={VERMILION} strokeWidth={2} />
      <text x="40" y={barY - 14} fill={INK_MUTED} fontSize="12" fontWeight={700}>
        Boundary shift in days
      </text>
      <text x={40 + Math.min(400, barWidth) / 2} y={barY + barHeight / 2 + 5} textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight={700}>
        {daysShift.toFixed(2)} d
      </text>
      <text x="40" y={barY + barHeight + 24} fill={INK_MUTED} fontSize="11" fontWeight={700}>
        0 d
      </text>
      <text x="440" y={barY + barHeight + 24} textAnchor="end" fill={INK_MUTED} fontSize="11" fontWeight={700}>
        {maxDays} d
      </text>
      <text x="240" y={barY + barHeight + 46} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={700}>
        {minutesError}-minute error → Moon moves ~{minutesError * 0.55} arc-min
      </text>
    </svg>
  );
}

function Panel({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: ReactNode;
  color: string;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: SURFACE,
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color,
          fontWeight: 700,
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.85rem",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
