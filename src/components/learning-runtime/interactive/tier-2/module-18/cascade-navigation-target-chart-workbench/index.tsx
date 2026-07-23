"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  MessageCircle,
  RotateCcw,
  Target,
  Timer,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type Depth = "md" | "ad" | "pd" | "stop";
type BirthQuality = "exact" | "approximate";
type QuestionKey = "A" | "B" | "C" | "D";

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

const QUESTIONS: Record<
  QuestionKey,
  { text: string; correct: Depth; answer: string; computation: string }
> = {
  A: {
    text: "What should I broadly expect in my 30s?",
    correct: "md",
    answer:
      "Your thirties are defined almost entirely by Moon mahādaśā (age 30.506–40.506), with only the final six months of Sun MD touching age 30.0–30.506.",
    computation: "Sun MD ends at 30.506; Moon MD covers 9.49 of the 10 years.",
  },
  B: {
    text: "I sense something around age 33 — is that a good general window?",
    correct: "ad",
    answer:
      "Age 33.0 falls in Moon/Rāhu antardaśā, running roughly age 31.923–33.423 — about eighteen months.",
    computation:
      "Forward-lookup inside Moon MD: Moon/Moon, Moon/Mars, then Moon/Rāhu contains age 33.0.",
  },
  C: {
    text: "Can you narrow that further?",
    correct: "pd",
    answer:
      "Inside Moon/Rāhu, age 33.0 falls in Moon/Rāhu/Venus pratyantardaśā, roughly age 32.885–33.135 — about three months.",
    computation:
      "Subdivide Moon/Rāhu AD cyclic from Rāhu; forward-lookup lands in Venus PD.",
  },
  D: {
    text: "Can you give me the exact day, or even the hour?",
    correct: "stop",
    answer:
      "The cascade can compute to the hour, but I would only stand behind that for a birth time verified to the minute and confirmed by rectification. The three-month window is the narrowest I can responsibly deliver here.",
    computation:
      "Lesson 18.1.4 discipline: input uncertainty of a few minutes shifts boundaries by days.",
  },
};

const DEPTHS: Record<
  Depth,
  { label: string; span: string; color: string }
> = {
  md: { label: "Mahādaśā", span: "Years", color: BLUE },
  ad: { label: "Antardaśā", span: "Months", color: GREEN },
  pd: { label: "Pratyantardaśā", span: "Months", color: GOLD },
  stop: { label: "Stop and explain", span: "—", color: VERMILION },
};

export function CascadeNavigationTargetChartWorkbench() {
  const [selectedDepths, setSelectedDepths] = useState<
    Partial<Record<QuestionKey, Depth>>
  >({});
  const [birthQuality, setBirthQuality] = useState<BirthQuality>("exact");
  const [responseDraft, setResponseDraft] = useState<string>(
    "Your thirties are defined almost entirely by Moon mahādaśā. The window around age 33 corresponds to Moon/Rāhu antardaśā, roughly eighteen months. Narrowed further, Moon/Rāhu/Venus pratyantardaśā is about three months. I can compute to the hour, but I would only stand behind that with a minute-verified, rectified birth time; otherwise the three-month window is the honest limit. And this tells us when a tendency is active; what kind of period it is belongs to the next chapter."
  );

  const allAnswered = (Object.keys(QUESTIONS) as QuestionKey[]).every(
    (key) => selectedDepths[key]
  );
  const correctCount = (Object.keys(QUESTIONS) as QuestionKey[]).filter(
    (key) => selectedDepths[key] === QUESTIONS[key].correct
  ).length;

  return (
    <div
      data-interactive="cascade-navigation-target-chart-workbench"
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
            <p style={eyebrowStyle}>Cascade navigation target-chart workbench</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              One conversation, three questions, three appropriate depths
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Kavya asks four escalating questions. Choose the right cascade
              depth for each, see the computed answer, and compose the
              client-facing summary.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedDepths({});
              setBirthQuality("exact");
              setResponseDraft(
                "Your thirties are defined almost entirely by Moon mahādaśā. The window around age 33 corresponds to Moon/Rāhu antardaśā, roughly eighteen months. Narrowed further, Moon/Rāhu/Venus pratyantardaśā is about three months. I can compute to the hour, but I would only stand behind that with a minute-verified, rectified birth time; otherwise the three-month window is the honest limit. And this tells us when a tendency is active; what kind of period it is belongs to the next chapter."
              );
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Question-by-question depth matching</p>
          <h3
            style={{
              margin: "0.15rem 0 0.75rem",
              color: BLUE,
              fontSize: "1.18rem",
              fontWeight: 600,
            }}
          >
            Match each question to the right level
          </h3>
          <div style={{ display: "grid", gap: "0.85rem" }}>
            {(Object.keys(QUESTIONS) as QuestionKey[]).map((key) => {
              const q = QUESTIONS[key];
              const selected = selectedDepths[key];
              const isCorrect = selected === q.correct;
              return (
                <div
                  key={key}
                  style={{
                    border: `1px solid ${
                      selected ? (isCorrect ? GREEN : VERMILION) : HAIRLINE
                    }44`,
                    borderRadius: 8,
                    background: selected
                      ? isCorrect
                        ? `${GREEN}0F`
                        : `${VERMILION}0F`
                      : "transparent",
                    padding: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 26,
                        height: 26,
                        borderRadius: "50%",
                        background: selected
                          ? isCorrect
                            ? GREEN
                            : VERMILION
                          : INK_MUTED,
                        color: "#fff",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      {key}
                    </span>
                    <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>
                      &ldquo;{q.text}&rdquo;
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.4rem",
                    }}
                  >
                    {(Object.keys(DEPTHS) as Depth[]).map((depth) => (
                      <button
                        key={depth}
                        type="button"
                        aria-pressed={selected === depth}
                        onClick={() =>
                          setSelectedDepths((prev) => ({
                            ...prev,
                            [key]: depth,
                          }))
                        }
                        style={smallChipStyle(
                          selected === depth,
                          DEPTHS[depth].color
                        )}
                      >
                        {DEPTHS[depth].label}
                      </button>
                    ))}
                  </div>
                  {selected ? (
                    <div
                      style={{
                        marginTop: "0.6rem",
                        padding: "0.55rem 0.65rem",
                        borderRadius: 6,
                        background: isCorrect ? `${GREEN}0A` : `${VERMILION}0A`,
                        color: INK_SECONDARY,
                        fontSize: "0.9rem",
                        lineHeight: 1.45,
                      }}
                    >
                      <strong
                        style={{
                          color: isCorrect ? GREEN : VERMILION,
                          fontWeight: 700,
                        }}
                      >
                        {isCorrect ? "Correct choice" : "Not the best fit"}
                      </strong>
                      {" — "}
                      {q.answer}
                      <span
                        style={{
                          display: "block",
                          marginTop: "0.3rem",
                          color: INK_MUTED,
                          fontSize: "0.82rem",
                        }}
                      >
                        {q.computation}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          {allAnswered ? (
            <div
              style={{
                marginTop: "0.85rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: correctCount === 4 ? `${GREEN}0F` : `${GOLD}0F`,
                border: `1px solid ${correctCount === 4 ? GREEN : GOLD}44`,
                color: correctCount === 4 ? GREEN : GOLD,
                fontWeight: 700,
              }}
            >
              {correctCount}/4 matched correctly.{" "}
              {correctCount === 4
                ? "You matched depth to the question at every step."
                : "Review the answers above and try again."}
            </div>
          ) : null}
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Chart context</p>
            <h3
              style={{
                margin: "0.15rem 0 0.75rem",
                color: PURPLE,
                fontSize: "1.18rem",
                fontWeight: 600,
              }}
            >
              Kavya&apos;s relevant dasha windows
            </h3>
            <TimelineMini />
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(min(100%, 140px), 1fr))",
                gap: "0.55rem",
                marginTop: "0.75rem",
              }}
            >
              <MiniFact
                icon={<Timer size={16} />}
                title="Sun MD"
                body="age 24.506–30.506"
                color={VERMILION}
              />
              <MiniFact
                icon={<Timer size={16} />}
                title="Moon MD"
                body="age 30.506–40.506"
                color={BLUE}
              />
              <MiniFact
                icon={<Target size={16} />}
                title="Age 33.0"
                body="Moon/Rāhu AD"
                color={GREEN}
              />
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Birth-data contrast</p>
            <h3
              style={{
                margin: "0.15rem 0 0.75rem",
                color: VERMILION,
                fontSize: "1.18rem",
                fontWeight: 600,
              }}
            >
              How would the answers change?
            </h3>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <button
                type="button"
                aria-pressed={birthQuality === "exact"}
                onClick={() => setBirthQuality("exact")}
                style={smallChipStyle(birthQuality === "exact", GREEN)}
              >
                Exact (teaching)
              </button>
              <button
                type="button"
                aria-pressed={birthQuality === "approximate"}
                onClick={() => setBirthQuality("approximate")}
                style={smallChipStyle(birthQuality === "approximate", VERMILION)}
              >
                Approximate
              </button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              {birthQuality === "exact"
                ? "With well-documented birth data, Questions A–C are reportable as above; Question D still stops at the three-month window unless the birth time is minute-verified and rectified."
                : "With only an approximate birth time, Question A is unaffected; Question B is reportable with a wider margin; Question C becomes questionable and should be caveated or withheld; Question D remains no."}
            </p>
          </section>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Client-facing summary composer</p>
        <h3
          style={{
            margin: "0.15rem 0 0.75rem",
            color: GREEN,
            fontSize: "1.18rem",
            fontWeight: 600,
          }}
        >
          Compose the answer this chapter would deliver
        </h3>
        <p style={{ margin: "0 0 0.75rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
          Draft a single response that covers all four questions, stays inside
          this chapter&apos;s scope (when, not what kind), and uses the
          depth-matching discipline.
        </p>
        <textarea
          value={responseDraft}
          onChange={(e) => setResponseDraft(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 8,
            background: "transparent",
            color: INK_PRIMARY,
            fontSize: "0.95rem",
            resize: "vertical",
            lineHeight: 1.55,
          }}
        />
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            background: `${GREEN}0F`,
            border: `1px solid ${GREEN}44`,
          }}
        >
          <p style={{ margin: 0, color: GREEN, fontWeight: 700, marginBottom: "0.35rem" }}>
            <MessageCircle size={16} style={{ marginRight: "0.35rem", verticalAlign: "middle" }} aria-hidden="true" />
            Preview
          </p>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
            {responseDraft}
          </p>
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${BLUE}66`,
          background: `${BLUE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Chapter boundary</p>
        <h3
          style={{
            margin: "0.15rem 0 0.5rem",
            color: BLUE,
            fontSize: "1.1rem",
            fontWeight: 600,
          }}
        >
          What this chapter does and does not yet provide
        </h3>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
          Every answer above addressed <strong style={{ fontWeight: 700 }}>when</strong> — which period, how wide a window, at what confidence. None addressed{" "}
          <strong style={{ fontWeight: 700 }}>what kind</strong> — whether Moon/Rāhu is supportive or challenging. That is Chapter 2&apos;s bhukti-yoga subject, using the mitra/sama/śatru relationship not yet taught.
        </p>
      </section>
    </div>
  );
}

function TimelineMini() {
  return (
    <svg
      viewBox="0 0 560 120"
      role="img"
      aria-label="Kavya dasha timeline around ages 30-34"
      style={{
        width: "100%",
        maxHeight: 160,
        margin: "0.2rem auto 0.2rem",
        display: "block",
      }}
    >
      <rect x="30" y="40" width="500" height="40" rx={8} fill={`${BLUE}12`} stroke={HAIRLINE} />
      <rect x="30" y="40" width={80} height={40} rx={8} fill={`${VERMILION}25`} stroke={VERMILION} />
      <text x="70" y="64" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={700}>
        Sun MD
      </text>
      <text x="70" y="80" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>
        24.5–30.5
      </text>
      <rect x="110" y="40" width={420} height={40} rx={8} fill={`${BLUE}25`} stroke={BLUE} />
      <text x="320" y="64" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={700}>
        Moon MD
      </text>
      <text x="320" y="80" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>
        30.5–40.5
      </text>
      <line x1={190} y1={20} x2={190} y2={100} stroke={GOLD} strokeWidth={3} strokeDasharray="6 4" />
      <polygon points={`${190 - 6},20 ${190 + 6},20 ${190},30`} fill={GOLD} />
      <text x={190} y={16} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight={700}>
        age 33.0
      </text>
      <text x="280" y={112} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={700}>
        The decade question (A) gets MD; the age-33 question (B) gets AD; narrowing (C) gets PD.
      </text>
    </svg>
  );
}

function MiniFact({
  icon,
  title,
  body,
  color,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: `${color}0F`,
        padding: "0.7rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.45rem",
          color,
          fontWeight: 700,
        }}
      >
        {icon}
        {title}
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.35,
        }}
      >
        {body}
      </p>
    </div>
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
