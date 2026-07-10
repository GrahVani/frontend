"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  RefreshCcw,
  ShieldAlert,
  XCircle,
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

const FINDINGS = [
  {
    key: "sixth-terrain",
    lesson: "11.1.1",
    label: "6th-house terrain",
    color: BLUE,
    detail: "Aquarius, Saturn as lord and sole whole-sign occupant, own sign — a clean, strong litigation-terrain signal.",
    clientPhrase: "the house governing this domain is ruled by, and occupied by, its own natural governor",
  },
  {
    key: "dusthana-upachaya",
    lesson: "11.1.2",
    label: "Dusthāna/upachaya paradox",
    color: GREEN,
    detail: "Own-sign Saturn in the 6th converges three structural factors, supporting a genuine (non-guaranteed) capacity for early difficulty to convert into hard-won strength.",
    clientPhrase: "you’re structurally well-equipped to see a difficult process through with discipline rather than chaos",
  },
  {
    key: "lord-permutation",
    lesson: "11.1.3",
    label: "6th-lord permutation",
    color: BLUE,
    detail: "Saturn occupying its own house — direct, self-contained governance of the litigation domain.",
    clientPhrase: "the litigation domain is governed directly by its own natural ruler",
  },
  {
    key: "mars-karaka",
    lesson: "11.1.4",
    label: "Mars as contest kāraka",
    color: VERMILION,
    detail: "Mars in the 12th house, friend’s sign — reasonably well-supported contest capacity, expressed through indirect/institutional channels.",
    clientPhrase: "your own capacity to engage a dispute tends to work through less visible, more behind-the-scenes channels rather than open confrontation",
  },
  {
    key: "saturn-karaka",
    lesson: "11.2.1",
    label: "Saturn as process/pace",
    color: PURPLE,
    detail: "Own-sign Saturn suggests a protracted but structurally well-managed process.",
    clientPhrase: "the process is likely to take real time, but is likely to be handled with structural coherence",
  },
  {
    key: "mars-saturn-relationship",
    lesson: "11.2.2-3",
    label: "Mars-Saturn relationship",
    color: GOLD,
    detail: "Mutual aspect (not conjunction, not mutual reception) with asymmetric friendship: Saturn hostile toward Mars, Mars neutral toward Saturn.",
    clientPhrase: "these two forces are in active relationship, though not fused into a single volatile point — each retains its own space to operate",
  },
] as const;

const DISCIPLINE_STATEMENTS = [
  {
    key: "double-benefit",
    label: "The double-aspected 3rd house doubles the upachaya benefit numerically.",
    correction:
      "Two independent signals pointing the same direction are reported together, not multiplied. The benefit is not ‘twice as strong’.",
  },
  {
    key: "complete-answer",
    label: "This chapter-internal synthesis is enough to answer whether the client will win the case.",
    correction:
      "Timing, KP cuspal reading, and multi-causal real-world factors are not yet addressed; Chapter 4 closes these gaps.",
  },
  {
    key: "script",
    label: "The client-facing template should be recited exactly as written.",
    correction:
      "The template is meant to be adapted to the actual client and question, not repeated verbatim.",
  },
] as const;

const SCENARIO_OPTIONS = [
  {
    label: "Yes — the synthesis shows you are likely to win.",
    verdict: "wrong",
    feedback:
      "This overstates the synthesis. It describes structural capacity and character, not a verdict. Timing, KP cuspal reading, and real-world factors still matter.",
  },
  {
    label: "The chart shows real structural strength for handling the dispute, but it cannot promise a specific verdict from this chapter alone.",
    verdict: "right",
    feedback:
      "Correct. The synthesis is honestly shareable as capacity, pace, and character, while the specific win/lose question requires material not yet covered.",
  },
  {
    label: "No — because Mars is in the 12th house, the case is weak.",
    verdict: "wrong",
    feedback:
      "This misreads 12th-house Mars as simple weakness. It is a colouring of character, not a verdict; Mars is in a friend’s sign and reasonably supported.",
  },
];

export function MarsSaturnLitigationSynthesis() {
  const [active, setActive] = useState<string[]>(FINDINGS.map((f) => f.key));
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "double-benefit": false,
    "complete-answer": false,
    script: false,
  });

  const activeFindings = useMemo(
    () => FINDINGS.filter((f) => active.includes(f.key)),
    [active]
  );

  function toggleFinding(key: string) {
    setActive((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setActive(FINDINGS.map((f) => f.key));
    setScenarioChoice(null);
    setMistakes({ "double-benefit": false, "complete-answer": false, script: false });
  }

  return (
    <div
      data-interactive="mars-saturn-litigation-synthesis"
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
            <p style={eyebrowStyle}>Chart L1 — Chapter 2 capstone</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: GOLD,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Mars-Saturn litigation synthesis
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Assemble the six prior lessons into one coherent reading, surface the double-aspected 3rd house, and practise the honest scope limit.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Build the synthesis</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            Toggle each finding to include it in the assembled picture.
          </p>
          <div
            style={{
              display: "grid",
              gap: "0.55rem",
              marginTop: "0.65rem",
            }}
          >
            {FINDINGS.map((f) => {
              const included = active.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  aria-pressed={included}
                  onClick={() => toggleFinding(f.key)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "24px 1fr",
                    gap: "0.55rem",
                    alignItems: "start",
                    textAlign: "left",
                    border: `1px solid ${included ? f.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: included ? `${f.color}${"0A"}` : "transparent",
                    color: included ? f.color : INK_SECONDARY,
                    padding: "0.75rem",
                    cursor: "pointer",
                  }}
                >
                  <span style={{ marginTop: 2 }}>
                    {included ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                  </span>
                  <span>
                    <span style={{ fontWeight: 600, display: "block" }}>
                      {f.label}{" "}
                      <span style={{ color: INK_MUTED, fontSize: "0.78rem" }}>(Lesson {f.lesson})</span>
                    </span>
                    <span
                      style={{
                        fontSize: "0.84rem",
                        color: included ? INK_SECONDARY : INK_MUTED,
                        lineHeight: 1.5,
                      }}
                    >
                      {f.detail}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Aspect web</p>
          <AspectWeb />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${GREEN}`,
              background: `${GREEN}${"0A"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              <strong style={{ color: GREEN, fontWeight: 600 }}>Bonus finding:</strong> Mars&apos;s 4th special aspect and Saturn&apos;s 10th special aspect both land on the 3rd house — ruled by Mars and occupied by the Sun. This is two independent signals pointing the same direction, not a doubled benefit.
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE }}>
          <MessageCircle size={18} aria-hidden="true" />
          <p style={eyebrowStyle}>Client-facing template</p>
        </div>
        <p
          style={{
            margin: "0.55rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          “Your chart shows real strength for handling contest and dispute —{" "}
          {activeFindings.find((f) => f.key === "sixth-terrain")?.clientPhrase ?? "…"}.{" "}
          {activeFindings.find((f) => f.key === "dusthana-upachaya")?.clientPhrase ?? "…"}.{" "}
          {activeFindings.find((f) => f.key === "mars-karaka")?.clientPhrase ?? "…"}.{" "}
          {activeFindings.find((f) => f.key === "saturn-karaka")?.clientPhrase ?? "…"}.{" "}
          {activeFindings.find((f) => f.key === "mars-saturn-relationship")?.clientPhrase ?? "…"}. And your own courage and communication (house 3) show a doubled kind of pressure that tends to convert into real growth rather than mere strain.”
        </p>
        <p
          style={{
            margin: "0.55rem 0 0",
            color: INK_MUTED,
            fontSize: "0.82rem",
            lineHeight: 1.5,
          }}
        >
          This is a template to adapt, not a script to recite. Toggle findings above to see how each piece maps into the language.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scope-limit trainer</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          A client asks: “So, based on all this, will I win my case?” Which response honours the synthesis while staying honest?
        </p>
        <div
          style={{
            display: "grid",
            gap: "0.6rem",
            marginTop: "0.75rem",
          }}
        >
          {SCENARIO_OPTIONS.map((option, index) => {
            const chosen = scenarioChoice === index;
            const isRight = option.verdict === "right";
            const color = chosen ? (isRight ? GREEN : VERMILION) : INK_SECONDARY;
            return (
              <div key={index}>
                <button
                  type="button"
                  aria-pressed={chosen}
                  onClick={() => setScenarioChoice(index)}
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    width: "100%",
                    textAlign: "left",
                    border: `1px solid ${chosen ? color : HAIRLINE}`,
                    borderRadius: 8,
                    background: chosen ? `${color}${"0A"}` : "transparent",
                    color,
                    padding: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ marginTop: 2 }}>
                    {chosen ? (
                      isRight ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />
                    ) : (
                      <span
                        style={{
                          display: "inline-block",
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          border: `1px solid ${HAIRLINE}`,
                        }}
                      />
                    )}
                  </span>
                  {option.label}
                </button>
                {chosen ? (
                  <p
                    style={{
                      margin: "0.45rem 0 0",
                      paddingLeft: "1.4rem",
                      color,
                      fontSize: "0.86rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {option.feedback}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px dashed ${PURPLE}`,
            background: `${PURPLE}${"08"}`,
          }}
        >
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.55 }}>
            <ArrowRight size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
            <strong style={{ color: PURPLE, fontWeight: 600 }}>Forward pointer:</strong> Chapter 3 will test this whole-sign picture under KP cuspal reckoning; Chapter 4 will add daśā timing and multi-causal real-world factors.
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const activeM = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${activeM ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: activeM ? `${VERMILION}${"0A"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={activeM}
                    onChange={() => toggleMistake(s.key)}
                  />
                  <span>{s.label}</span>
                </label>
                {activeM ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: VERMILION,
                      fontSize: "0.86rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${GOLD}66`,
          background: `${GOLD}${"0A"}`,
        }}
      >
        <p style={eyebrowStyle}>Assembled synthesis</p>
        <h3
          style={{
            margin: "0.15rem 0 0",
            color: GOLD,
            fontSize: "1.15rem",
            fontWeight: 600,
          }}
        >
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          {activeFindings.length} of {FINDINGS.length} findings included
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {activeFindings.length === 0
            ? "No findings selected. Toggle cards above to assemble the synthesis."
            : activeFindings.map((f) => f.detail).join(" ")}
        </p>
      </section>
    </div>
  );
}

function AspectWeb() {
  return (
    <svg
      viewBox="0 0 300 220"
      role="img"
      aria-label="Aspect web: Mars in the 12th and Saturn in the 6th aspect each other mutually, and both special-aspect the 3rd house"
      style={{ width: "100%", maxHeight: 240, display: "block", marginTop: "0.55rem" }}
    >
      <rect x={16} y={16} width={268} height={188} rx={8} fill="transparent" stroke={HAIRLINE} />

      {/* 12th house / Mars */}
      <circle cx={70} cy={110} r={32} fill={`${VERMILION}${"15"}`} stroke={VERMILION} strokeWidth={3} />
      <text x={70} y={106} textAnchor="middle" fill={VERMILION} fontSize={12} fontWeight={600}>
        Mars
      </text>
      <text x={70} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={9} fontWeight={600}>
        12th house
      </text>

      {/* 6th house / Saturn */}
      <circle cx={230} cy={110} r={32} fill={`${PURPLE}${"15"}`} stroke={PURPLE} strokeWidth={3} />
      <text x={230} y={106} textAnchor="middle" fill={PURPLE} fontSize={12} fontWeight={600}>
        Saturn
      </text>
      <text x={230} y={120} textAnchor="middle" fill={INK_SECONDARY} fontSize={9} fontWeight={600}>
        6th house
      </text>

      {/* 3rd house */}
      <circle cx={150} cy={48} r={26} fill={`${GREEN}${"15"}`} stroke={GREEN} strokeWidth={3} />
      <text x={150} y={44} textAnchor="middle" fill={GREEN} fontSize={11} fontWeight={600}>
        3rd house
      </text>
      <text x={150} y={58} textAnchor="middle" fill={INK_SECONDARY} fontSize={9} fontWeight={600}>
        double aspect
      </text>

      {/* Mutual aspect arrow */}
      <path
        d="M 102 110 L 198 110"
        fill="none"
        stroke={BLUE}
        strokeWidth={3}
        strokeLinecap="round"
        markerStart="url(#webMutualStart)"
        markerEnd="url(#webMutualEnd)"
      />
      <text x={150} y={132} textAnchor="middle" fill={BLUE} fontSize={9} fontWeight={600}>
        mutual 7th drishti
      </text>

      {/* Mars 4th aspect to 3rd */}
      <path
        d="M 88 86 C 100 60, 130 48, 124 48"
        fill="none"
        stroke={VERMILION}
        strokeWidth={2.5}
        strokeDasharray="4 3"
        markerEnd="url(#webMars3)"
      />
      <text x={96} y={58} textAnchor="middle" fill={VERMILION} fontSize={8} fontWeight={600}>
        Mars 4th
      </text>

      {/* Saturn 10th aspect to 3rd */}
      <path
        d="M 212 86 C 200 60, 170 48, 176 48"
        fill="none"
        stroke={PURPLE}
        strokeWidth={2.5}
        strokeDasharray="4 3"
        markerEnd="url(#webSaturn3)"
      />
      <text x={204} y={58} textAnchor="middle" fill={PURPLE} fontSize={8} fontWeight={600}>
        Saturn 10th
      </text>

      <defs>
        <marker id="webMutualStart" markerWidth={9} markerHeight={9} refX={7} refY={3} orient="auto" markerUnits="strokeWidth">
          <path d="M7,0 L0,3 L7,6 L7,0" fill={BLUE} transform="rotate(180 3.5 3)" />
        </marker>
        <marker id="webMutualEnd" markerWidth={9} markerHeight={9} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L7,3 L0,6 L0,0" fill={BLUE} />
        </marker>
        <marker id="webMars3" markerWidth={8} markerHeight={8} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 L0,0" fill={VERMILION} />
        </marker>
        <marker id="webSaturn3" markerWidth={8} markerHeight={8} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 L0,0" fill={PURPLE} />
        </marker>
      </defs>
    </svg>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
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
