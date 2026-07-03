"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";

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

type ScenarioKey = "example1" | "example2";

interface Finding {
  register: string;
  stress: string;
  relief: string;
}

interface Sentence {
  id: string;
  text: string;
  required: boolean;
}

interface ActionOption {
  id: string;
  label: string;
  type: "required" | "wrong";
  explain: string;
}

interface Scenario {
  key: ScenarioKey;
  title: string;
  clientQuote: string;
  defaults: {
    twoYears: boolean;
    priorDelay: boolean;
    distress: boolean;
  };
  findings: Finding[];
  actions: ActionOption[];
  sentences: Sentence[];
}

const SCENARIOS: Scenario[] = [
  {
    key: "example1",
    title: "Mixed chart + disclosed struggle",
    clientQuote:
      "We&apos;ve been trying for a little over two years now. We haven&apos;t seen a fertility specialist yet — honestly, another astrologer told us a few years back that our &apos;timing wasn&apos;t right&apos; and we&apos;ve been sort of waiting for that to pass. What does your reading show?",
    defaults: { twoYears: true, priorDelay: true, distress: false },
    findings: [
      {
        register: "5th house / lord",
        stress: "5th lord Saturn in the 8th house (dusthāna)",
        relief: "aspected by Jupiter",
      },
      {
        register: "D7 Saptāṁśa",
        stress: "D7 5th afflicted by malefic occupants",
        relief: "D7 Jupiter moderate",
      },
      {
        register: "D1 Jupiter",
        stress: "Combust, neutral sign",
        relief: "aspects the 5th directly",
      },
      {
        register: "Jaimini PK",
        stress: "Debilitated in D1",
        relief: "exalted in navāṁśa",
      },
      {
        register: "KP 5th CSL",
        stress: "Signifies 6 and 8 primarily",
        relief: "secondary connection to 11",
      },
    ],
    actions: [
      {
        id: "foreground-fertility",
        label: "Foreground fertility-specialist routing",
        type: "required",
        explain:
          "Two years of trying crosses the medical threshold; the specialist must be named before or alongside the chart.",
      },
      {
        id: "correct-prior-belief",
        label: "Correct the prior medical-avoidance belief",
        type: "required",
        explain:
          "The client was told to wait by another astrologer; that substitution of astrology for medical care must be named and corrected.",
      },
      {
        id: "deliver-mixed-synthesis",
        label: "Deliver the mixed technical synthesis",
        type: "required",
        explain:
          "Every register shows stress and relief; the net verdict is difficulty-and-delay, capped honestly.",
      },
      {
        id: "closing-courtesy",
        label: "Treat routing as a closing courtesy",
        type: "wrong",
        explain:
          "Once the threshold is crossed, routing is part of the direct answer, not a final sentence.",
      },
      {
        id: "pause-mental-health",
        label: "Pause and name a mental-health professional",
        type: "wrong",
        explain:
          "Example 1 has distress but not the acute strain that triggers a pause; the priority is fertility routing.",
      },
      {
        id: "continue-on-schedule",
        label: "Continue the chart on schedule",
        type: "wrong",
        explain:
          "The routing must interrupt the normal order; the technical synthesis is delivered alongside it, not before it.",
      },
    ],
    sentences: [
      {
        id: "e1-a",
        text: "Before I say anything about the chart, two years of trying without success is exactly the kind of situation where a fertility specialist should be involved now, not after astrology settles anything.",
        required: true,
      },
      {
        id: "e1-b",
        text: "I also want to gently push back on what you were told before — astrology can&apos;t and shouldn&apos;t be a reason to delay a medical consultation for something in this range.",
        required: true,
      },
      {
        id: "e1-c",
        text: "As for the chart itself: it shows real difficulty-and-delay factors — I won&apos;t pretend otherwise — but also real, consistent relief alongside every one of them.",
        required: true,
      },
      {
        id: "e1-d",
        text: "I&apos;d read this as a genuine challenge, not a closed door, and honestly, the most useful next step isn&apos;t more astrology — it&apos;s an appointment with a fertility specialist, this month if you can manage it.",
        required: true,
      },
      {
        id: "e1-e",
        text: "I&apos;d also encourage you to talk to a mental-health professional about how heavy this has gotten.",
        required: false,
      },
      {
        id: "e1-f",
        text: "Let&apos;s keep going with the chart as the main answer, and I&apos;ll mention the specialist at the end.",
        required: false,
      },
    ],
  },
  {
    key: "example2",
    title: "Acute distress + same struggle",
    clientQuote:
      "Partway through the conversation, one of the clients adds, quietly: &apos;Honestly, it&apos;s been affecting everything — we barely talk about anything else anymore, and some days I just feel like giving up on the whole idea, on us, on everything.&apos;",
    defaults: { twoYears: true, priorDelay: true, distress: true },
    findings: [
      {
        register: "5th house / lord",
        stress: "5th lord Saturn in the 8th house (dusthāna)",
        relief: "aspected by Jupiter",
      },
      {
        register: "D7 Saptāṁśa",
        stress: "D7 5th afflicted by malefic occupants",
        relief: "D7 Jupiter moderate",
      },
      {
        register: "D1 Jupiter",
        stress: "Combust, neutral sign",
        relief: "aspects the 5th directly",
      },
      {
        register: "Jaimini PK",
        stress: "Debilitated in D1",
        relief: "exalted in navāṁśa",
      },
      {
        register: "KP 5th CSL",
        stress: "Signifies 6 and 8 primarily",
        relief: "secondary connection to 11",
      },
    ],
    actions: [
      {
        id: "pause-synthesis",
        label: "Pause the technical synthesis",
        type: "required",
        explain:
          "The client has disclosed emotional strain that outweighs the technical schedule; the chart is set aside.",
      },
      {
        id: "maintain-fertility",
        label: "Maintain the fertility-specialist routing",
        type: "required",
        explain:
          "The pause does not cancel the medical routing; the specialist remains important and is named again.",
      },
      {
        id: "name-mental-health",
        label: "Name a mental-health professional",
        type: "required",
        explain:
          "The specific category of professional must be offered — counsellor or therapist — for the individual and the couple.",
      },
      {
        id: "chart-optional",
        label: "Make the chart genuinely optional",
        type: "required",
        explain:
          "Resuming the reading later is the client&apos;s choice; the practitioner does not resume by default.",
      },
      {
        id: "deliver-technical-synthesis",
        label: "Deliver the technical synthesis now",
        type: "wrong",
        explain:
          "The disclosed distress means the technical answer must wait; respond to the person first.",
      },
      {
        id: "continue-on-schedule",
        label: "Continue the chart on schedule",
        type: "wrong",
        explain:
          "The schedule is subordinate to the client&apos;s state once acute distress is disclosed.",
      },
    ],
    sentences: [
      {
        id: "e2-a",
        text: "I want to stop and check in with you, because what you just said sounds like it&apos;s carrying a lot of weight beyond the fertility question itself.",
        required: true,
      },
      {
        id: "e2-b",
        text: "I&apos;m not going to just carry on with the chart right now — that doesn&apos;t feel right given what you&apos;ve shared.",
        required: true,
      },
      {
        id: "e2-c",
        text: "The fertility specialist is still important, and I&apos;ll come back to that.",
        required: true,
      },
      {
        id: "e2-d",
        text: "But I&apos;d also really encourage you to talk to a mental-health professional — a counsellor or therapist — about how heavy this has gotten, for you individually and for the two of you together.",
        required: true,
      },
      {
        id: "e2-e",
        text: "We can come back to the chart another day, or later today if you&apos;d genuinely like to — but only if it still feels right to you after this.",
        required: true,
      },
      {
        id: "e2-f",
        text: "The chart itself shows real difficulty-and-delay, but also real relief, so let me finish that part quickly before we address how you&apos;re feeling.",
        required: false,
      },
    ],
  },
];

const THRESHOLDS = [
  {
    key: "courtesy",
    label: "Courtesy mention",
    color: BLUE,
    note: "No disclosed medical threshold crossed.",
  },
  {
    key: "mandatory",
    label: "Mandatory foregrounded routing",
    color: VERMILION,
    note: "Disclosed duration or prior avoidance triggers named referral.",
  },
  {
    key: "pause",
    label: "Pause + route",
    color: PURPLE,
    note: "Acute emotional strain sets the chart aside; both referrals stand.",
  },
];

export function FertilityStruggleRoutingTrainer() {
  const [scenario, setScenario] = useState<ScenarioKey>("example1");
  const current = SCENARIOS.find((s) => s.key === scenario) ?? SCENARIOS[0];

  const [disclosures, setDisclosures] = useState(current.defaults);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [selectedSentences, setSelectedSentences] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const thresholdLevel = useMemo(() => {
    if (disclosures.distress) return 2;
    if (disclosures.twoYears || disclosures.priorDelay) return 1;
    return 0;
  }, [disclosures]);

  const requiredActionIds = useMemo(
    () => current.actions.filter((a) => a.type === "required").map((a) => a.id),
    [current.actions],
  );
  const wrongActionIds = useMemo(
    () => current.actions.filter((a) => a.type === "wrong").map((a) => a.id),
    [current.actions],
  );
  const requiredSentenceIds = useMemo(
    () => current.sentences.filter((s) => s.required).map((s) => s.id),
    [current.sentences],
  );

  const actionFeedback = useMemo(() => {
    const missing = requiredActionIds.filter((id) => !selectedActions.includes(id));
    const wrongSelected = wrongActionIds.filter((id) => selectedActions.includes(id));
    const correctSelected = requiredActionIds.filter((id) => selectedActions.includes(id));
    return { missing, wrongSelected, correctSelected };
  }, [requiredActionIds, wrongActionIds, selectedActions]);

  const sentenceFeedback = useMemo(() => {
    const missing = requiredSentenceIds.filter((id) => !selectedSentences.includes(id));
    const wrongSelected = current.sentences
      .filter((s) => !s.required)
      .map((s) => s.id)
      .filter((id) => selectedSentences.includes(id));
    return { missing, wrongSelected };
  }, [current.sentences, requiredSentenceIds, selectedSentences]);

  const allCorrect = useMemo(() => {
    return (
      actionFeedback.missing.length === 0 &&
      actionFeedback.wrongSelected.length === 0 &&
      sentenceFeedback.missing.length === 0 &&
      sentenceFeedback.wrongSelected.length === 0
    );
  }, [actionFeedback, sentenceFeedback]);

  function toggleAction(id: string) {
    setSelectedActions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setShowFeedback(false);
  }

  function toggleSentence(id: string) {
    setSelectedSentences((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setShowFeedback(false);
  }

  function moveSentence(id: string, direction: "up" | "down") {
    setSelectedSentences((prev) => {
      const index = prev.indexOf(id);
      if (index < 0) return prev;
      const next = [...prev];
      if (direction === "up" && index > 0) {
        [next[index - 1], next[index]] = [next[index], next[index - 1]];
      } else if (direction === "down" && index < next.length - 1) {
        [next[index], next[index + 1]] = [next[index + 1], next[index]];
      }
      return next;
    });
  }

  function switchScenario(key: ScenarioKey) {
    const next = SCENARIOS.find((s) => s.key === key) ?? SCENARIOS[0];
    setScenario(key);
    setDisclosures(next.defaults);
    setSelectedActions([]);
    setSelectedSentences([]);
    setShowFeedback(false);
  }

  function resetScenario() {
    setDisclosures(current.defaults);
    setSelectedActions([]);
    setSelectedSentences([]);
    setShowFeedback(false);
  }

  return (
    <div
      data-interactive="fertility-struggle-routing-trainer"
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
            <p style={eyebrowStyle}>Fertility-struggle synthesis trainer</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Mandatory routing and pause-for-distress decisions
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Work through two disclosures and decide what must happen before any technical synthesis is delivered. Routing is triggered by what the client says, not by the chart.
            </p>
          </div>
          <button type="button" onClick={resetScenario} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset scenario
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Choose scenario</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.55rem",
            marginTop: "0.65rem",
          }}
        >
          {SCENARIOS.map((s) => (
            <button
              key={s.key}
              type="button"
              aria-pressed={scenario === s.key}
              onClick={() => switchScenario(s.key)}
              style={scenarioButtonStyle(scenario === s.key, VERMILION)}
            >
              <span style={{ display: "block", fontWeight: 600 }}>{s.title}</span>
              <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>
                {s.key === "example1"
                  ? "Mandatory fertility routing"
                  : "Pause + both referrals"}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Client disclosure</p>
          <blockquote
            style={{
              margin: "0.55rem 0 0",
              padding: "0.85rem",
              borderLeft: `4px solid ${VERMILION}`,
              background: `${VERMILION}${"0A"}`,
              color: INK_SECONDARY,
              lineHeight: 1.6,
              borderRadius: 8,
            }}
            dangerouslySetInnerHTML={{ __html: current.clientQuote }}
          />
          <p style={{ margin: "0.85rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
            Toggle disclosure facts to see how each threshold changes the required response.
          </p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            <DisclosureToggle
              active={disclosures.twoYears}
              onClick={() =>
                setDisclosures((prev) => ({ ...prev, twoYears: !prev.twoYears }))
              }
              title="Trying for over two years"
              body="Crosses the ordinary medical threshold for fertility evaluation."
            />
            <DisclosureToggle
              active={disclosures.priorDelay}
              onClick={() =>
                setDisclosures((prev) => ({
                  ...prev,
                  priorDelay: !prev.priorDelay,
                }))
              }
              title="Prior astrologer advised waiting"
              body="Medical-domain-absorption trap; must be named and corrected."
            />
            <DisclosureToggle
              active={disclosures.distress}
              onClick={() =>
                setDisclosures((prev) => ({ ...prev, distress: !prev.distress }))
              }
              title="Acute emotional strain"
              body="Language like &apos;giving up on everything&apos; triggers pause-for-distress."
            />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Response threshold</p>
          <ThresholdLadderSvg level={thresholdLevel} />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${THRESHOLDS[thresholdLevel].color}${"44"}`,
              background: `${THRESHOLDS[thresholdLevel].color}${"0A"}`,
            }}
          >
            <p
              style={{
                margin: 0,
                color: THRESHOLDS[thresholdLevel].color,
                fontWeight: 600,
              }}
            >
              {THRESHOLDS[thresholdLevel].label}
            </p>
            <p
              style={{
                margin: "0.3rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.86rem",
              }}
            >
              {THRESHOLDS[thresholdLevel].note}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Chart findings grid (Example 1 picture)</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.9rem",
          }}
        >
          Every register shows real stress and real relief. The net verdict is difficulty-and-delay, honestly capped — not a foreclosure and not false reassurance.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
            gap: "0.55rem",
            marginTop: "0.75rem",
          }}
        >
          {current.findings.map((f) => (
            <div
              key={f.register}
              style={{
                border: `1px solid ${GOLD}${"44"}`,
                borderRadius: 8,
                background: SURFACE,
                padding: "0.7rem",
              }}
            >
              <p style={{ margin: 0, color: GOLD, fontWeight: 600 }}>{f.register}</p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  color: VERMILION,
                  fontSize: "0.85rem",
                }}
              >
                Stress: {f.stress}
              </p>
              <p
                style={{
                  margin: "0.25rem 0 0",
                  color: GREEN,
                  fontSize: "0.85rem",
                }}
              >
                Relief: {f.relief}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Select the practitioner actions</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.9rem",
            }}
          >
            Choose every action that fits this scenario. There may be more than one required response.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.75rem",
            }}
          >
            {current.actions.map((a) => {
              const selected = selectedActions.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleAction(a.id)}
                  style={actionChipStyle(selected, a.type)}
                >
                  {selected ? <CheckCircle2 size={14} aria-hidden="true" /> : null}
                  {a.label}
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Build the response</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.9rem",
            }}
          >
            Click sentences to include them. Use the arrows to set the order you would say them.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "0.75rem",
            }}
          >
            {current.sentences.map((s) => {
              const selected = selectedSentences.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleSentence(s.id)}
                  style={sentenceChipStyle(selected)}
                >
                  {selected ? <CheckCircle2 size={14} aria-hidden="true" /> : null}
                  {s.text}
                </button>
              );
            })}
          </div>
          {selectedSentences.length > 0 ? (
            <div
              style={{
                marginTop: "0.85rem",
                display: "grid",
                gap: "0.45rem",
              }}
            >
              {selectedSentences.map((id) => {
                const text = current.sentences.find((s) => s.id === id)?.text ?? id;
                return (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      alignItems: "start",
                      padding: "0.55rem",
                      borderRadius: 8,
                      border: `1px solid ${HAIRLINE}`,
                      background: `${BLUE}${"0A"}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => moveSentence(id, "up")}
                      style={arrowButtonStyle()}
                      aria-label="Move up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSentence(id, "down")}
                      style={arrowButtonStyle()}
                      aria-label="Move down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <p
                      style={{
                        flex: 1,
                        margin: 0,
                        color: INK_SECONDARY,
                        fontSize: "0.86rem",
                        lineHeight: 1.4,
                      }}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                    <button
                      type="button"
                      onClick={() => toggleSentence(id)}
                      style={arrowButtonStyle()}
                      aria-label="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <p style={{ ...eyebrowStyle, margin: 0 }}>Check your response</p>
          <button
            type="button"
            onClick={() => setShowFeedback(true)}
            style={buttonStyle(false, GREEN)}
          >
            Check response
          </button>
        </div>
        {showFeedback ? (
          <FeedbackPanel
            scenario={current}
            actionFeedback={actionFeedback}
            sentenceFeedback={sentenceFeedback}
            allCorrect={allCorrect}
          />
        ) : null}
      </section>
    </div>
  );
}

function DisclosureToggle({
  active,
  onClick,
  title,
  body,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={toggleStyle(active, active ? VERMILION : INK_MUTED)}
    >
      <span style={{ color: active ? VERMILION : INK_MUTED }}>
        {active ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
      </span>
      <span style={{ textAlign: "left" }}>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>{body}</span>
      </span>
    </button>
  );
}

function ThresholdLadderSvg({ level }: { level: number }) {
  const colors = [BLUE, VERMILION, PURPLE];
  return (
    <svg
      viewBox="0 0 340 220"
      role="img"
      aria-label="Disclosure response threshold ladder"
      style={{
        width: "100%",
        maxHeight: 260,
        margin: "0.4rem auto 0",
        display: "block",
      }}
    >
      <rect
        x="10"
        y="10"
        width="320"
        height="200"
        rx="10"
        fill={`${GOLD}${"05"}`}
        stroke={HAIRLINE}
      />
      {THRESHOLDS.map((t, index) => {
        const y = 45 + index * 55;
        const isActive = index <= level;
        return (
          <g key={t.key}>
            <rect
              x="30"
              y={y - 18}
              width="280"
              height="36"
              rx="8"
              fill={isActive ? `${colors[index]}${"18"}` : `${INK_MUTED}11`}
              stroke={isActive ? colors[index] : HAIRLINE}
              strokeWidth={isActive ? 2.5 : 1}
            />
            <text
              x="48"
              y={y + 4}
              fill={isActive ? colors[index] : INK_MUTED}
              fontSize="12"
              fontWeight="600"
            >
              {t.label}
            </text>
            {isActive && index === level ? (
              <text
                x="300"
                y={y + 4}
                textAnchor="end"
                fill={colors[index]}
                fontSize="16"
              >
                ●
              </text>
            ) : null}
          </g>
        );
      })}
      <line
        x1="30"
        y1="45"
        x2="30"
        y2={45 + (THRESHOLDS.length - 1) * 55}
        stroke={HAIRLINE}
        strokeWidth="2"
        strokeDasharray="4 3"
      />
    </svg>
  );
}

function FeedbackPanel({
  scenario,
  actionFeedback,
  sentenceFeedback,
  allCorrect,
}: {
  scenario: Scenario;
  actionFeedback: {
    missing: string[];
    wrongSelected: string[];
    correctSelected: string[];
  };
  sentenceFeedback: { missing: string[]; wrongSelected: string[] };
  allCorrect: boolean;
}) {
  return (
    <div
      style={{
        marginTop: "0.85rem",
        padding: "0.85rem",
        borderRadius: 8,
        border: `1px solid ${allCorrect ? GREEN : VERMILION}${"66"}`,
        background: `${allCorrect ? GREEN : VERMILION}${"0A"}`,
      }}
    >
      <p
        style={{
          margin: 0,
          color: allCorrect ? GREEN : VERMILION,
          fontWeight: 600,
          fontSize: "1.05rem",
        }}
      >
        {allCorrect
          ? "All required actions and response sentences are in place."
          : "Some required pieces are missing or a wrong choice was made."}
      </p>

      {actionFeedback.correctSelected.length > 0 ? (
        <FeedbackList
          title="Correct actions selected"
          color={GREEN}
          items={actionFeedback.correctSelected.map((id) =>
            scenario.actions.find((a) => a.id === id)?.label ?? id,
          )}
        />
      ) : null}

      {actionFeedback.missing.length > 0 ? (
        <FeedbackList
          title="Missing required actions"
          color={VERMILION}
          items={actionFeedback.missing.map((id) => {
            const a = scenario.actions.find((x) => x.id === id);
            return a ? `${a.label} — ${a.explain}` : id;
          })}
        />
      ) : null}

      {actionFeedback.wrongSelected.length > 0 ? (
        <FeedbackList
          title="Actions that do not fit"
          color={VERMILION}
          items={actionFeedback.wrongSelected.map((id) => {
            const a = scenario.actions.find((x) => x.id === id);
            return a ? `${a.label} — ${a.explain}` : id;
          })}
        />
      ) : null}

      {sentenceFeedback.missing.length > 0 ? (
        <FeedbackList
          title="Missing response sentences"
          color={VERMILION}
          items={sentenceFeedback.missing.map((id) =>
            scenario.sentences.find((s) => s.id === id)?.text ?? id,
          )}
        />
      ) : null}

      {sentenceFeedback.wrongSelected.length > 0 ? (
        <FeedbackList
          title="Sentences that do not fit"
          color={VERMILION}
          items={sentenceFeedback.wrongSelected.map((id) =>
            scenario.sentences.find((s) => s.id === id)?.text ?? id,
          )}
        />
      ) : null}
    </div>
  );
}

function FeedbackList({
  title,
  color,
  items,
}: {
  title: string;
  color: string;
  items: string[];
}) {
  return (
    <div style={{ marginTop: "0.75rem" }}>
      <p style={{ margin: 0, color, fontWeight: 600 }}>{title}</p>
      <ul
        style={{
          margin: "0.35rem 0 0",
          paddingLeft: "1.2rem",
          color: INK_SECONDARY,
          fontSize: "0.9rem",
          lineHeight: 1.55,
        }}
      >
        {items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    </div>
  );
}

function actionChipStyle(active: boolean, type: "required" | "wrong"): CSSProperties {
  const baseColor = type === "required" ? BLUE : VERMILION;
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? baseColor : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${baseColor}${"16"}` : "transparent",
    color: active ? baseColor : INK_SECONDARY,
    padding: "0.5rem 0.7rem",
    fontSize: "0.86rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "left",
  };
}

function sentenceChipStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    border: `1px solid ${active ? GREEN : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${GREEN}${"12"}` : "transparent",
    color: active ? GREEN : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    fontSize: "0.86rem",
    fontWeight: 400,
    cursor: "pointer",
    textAlign: "left",
    lineHeight: 1.35,
  };
}

function arrowButtonStyle(): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    border: `1px solid ${HAIRLINE}`,
    borderRadius: 6,
    background: "transparent",
    color: INK_SECONDARY,
    cursor: "pointer",
    flexShrink: 0,
  };
}

function scenarioButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"10"}` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
    textAlign: "left",
  };
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

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"0A"}` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    cursor: "pointer",
    fontWeight: 400,
    width: "100%",
  };
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
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
