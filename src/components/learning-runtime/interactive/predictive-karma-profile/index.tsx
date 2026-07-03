"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BriefcaseBusiness,
  Compass,
  RotateCcw,
  ShieldCheck,
  UsersRound,
  MessageCircle,
} from "lucide-react";

// Theme and color constants matching the application styling
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

const PREDICTIVE_KARMA_QUESTIONS = {
  type: {
    label: "Profession type",
    clientQuestion: "What work suits me?",
    color: GREEN,
    short: "Field and style",
    answer:
      "Read the sign on the 10th, planets in the 10th, the 10th lord, and later the navamsha/D10 refinement.",
    features: ["10th sign", "Occupants", "10th lord", "Navamsha"],
    trap: "Do not infer status only from the sign flavor.",
  },
  status: {
    label: "Status / elevation",
    clientQuestion: "Will I rise?",
    color: GOLD,
    short: "Standing level",
    answer:
      "Read the strength, dignity, placement, and support of the 10th and its lord.",
    features: ["10th lord", "Strength", "Dignity", "Support"],
    trap: "Do not read rank from sign symbolism alone.",
  },
  independent: {
    label: "Employed vs independent",
    clientQuestion: "Should I stay employed or go independent?",
    color: BLUE,
    short: "Work orientation",
    answer:
      "Read the 10th lord's orientation: service links such as the 6th versus business or public-dealing links such as the 7th.",
    features: ["10th lord", "6th link", "7th link", "Self houses"],
    trap: "Do not decide this from one occupant without the lord's direction.",
  },
  stability: {
    label: "Stability vs change",
    clientQuestion: "Will I ever settle?",
    color: VERMILION,
    short: "Change pressure",
    answer:
      "Read the 10th lord's placement, dusthana links, affliction, and timing through dasha in later lessons.",
    features: ["10th lord", "Dusthana links", "Affliction", "Dasha"],
    trap: "Do not answer this with a profession-type reading.",
  },
} as const;

const PREDICTIVE_KARMA_AXES = [
  {
    key: "sign",
    label: "10th sign",
    color: GREEN,
    map: "Field and style",
    note: "Element and nature hint at the kind of work: earth is practical, air is communicative, fire is directive, water is adaptive.",
    questions: ["type"],
  },
  {
    key: "occupants",
    label: "Planets in 10th",
    color: BLUE,
    map: "Vocational signature",
    note: "Occupants strongly flavor the work: Sun for authority, Mercury for commerce, Venus for arts, Saturn for duty and structure.",
    questions: ["type"],
  },
  {
    key: "lord",
    label: "10th lord",
    color: GOLD,
    map: "Delivery and direction",
    note: "Placement, dignity, and strength show how well the career promise delivers and where the career energy flows.",
    questions: ["type", "status", "independent", "stability"],
  },
  {
    key: "navamsha",
    label: "Lord's navamsha",
    color: PURPLE,
    map: "Inner refinement",
    note: "The navamsha of the 10th lord refines type and inner quality; the D10 comes later as a refinement, not a replacement.",
    questions: ["type"],
  },
] as const;

const PREDICTIVE_REFERENCES = {
  lagna: {
    label: "From Lagna",
    color: GOLD,
    focus: "Career proper",
    note: "Start here: the D1 10th from Lagna is the foundation for the professional promise.",
  },
  moon: {
    label: "From Moon",
    color: BLUE,
    focus: "Public and mental feel",
    note: "Shows how work is experienced, how public life feels, and whether the mind can inhabit the role.",
  },
  sun: {
    label: "From Sun",
    color: VERMILION,
    focus: "Authority and vocation",
    note: "Shows authority, purpose in action, and the solar dimension of public role.",
  },
} as const;

type PredictiveKarmaQuestionKey = keyof typeof PREDICTIVE_KARMA_QUESTIONS;
type PredictiveReferenceKey = keyof typeof PREDICTIVE_REFERENCES;

export function PredictiveKarmaProfile() {
  const [question, setQuestion] = useState<PredictiveKarmaQuestionKey>("type");
  const [reference, setReference] = useState<PredictiveReferenceKey>("lagna");
  const [showD1, setShowD1] = useState(true);
  const [showAgreement, setShowAgreement] = useState(true);
  const questionState = PREDICTIVE_KARMA_QUESTIONS[question];
  const referenceState = PREDICTIVE_REFERENCES[reference];
  const activeAxes = PREDICTIVE_KARMA_AXES.filter((axis) =>
    axis.questions.some((item) => item === question),
  );

  const synthesis = useMemo(() => {
    const agreement = showAgreement
      ? " Compare Lagna, Moon, and Sun: agreement makes the career signature consistent; divergence makes the picture mixed."
      : "";
    const anchor = showD1
      ? " The D1 stays primary here; the D10 refines only after this foundation is read."
      : " Turn the D1 anchor back on before moving to divisional refinement.";
    return `${questionState.answer} ${questionState.trap}${agreement}${anchor}`;
  }, [questionState.answer, questionState.trap, showAgreement, showD1]);

  return (
    <div
      data-interactive="predictive-karma-profile"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section
        style={{
          border: `1px solid ${HAIRLINE}`,
          borderRadius: 8,
          background: SURFACE,
          padding: "1rem",
        }}
      >
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
            <p style={eyebrowStyle}>Tier 2 predictive 10th profile</p>
            <h2
              style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}
            >
              Karma-bhava as a career question instrument
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 850,
              }}
            >
              Choose the client&apos;s career sub-question, then watch the
              relevant 10th-house axes, reference frame, and D1-first discipline
              come forward.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQuestion("type");
              setReference("lagna");
              setShowD1(true);
              setShowAgreement(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1.05fr) minmax(320px, 0.95fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={eyebrowStyle}>Sub-question first</p>
              <h3
                style={{
                  margin: "0.15rem 0 0",
                  color: questionState.color,
                  fontSize: "1.2rem",
                }}
              >
                {questionState.label}
              </h3>
            </div>
            <strong style={{ color: referenceState.color }}>
              {referenceState.label}
            </strong>
          </div>
          <PredictiveKarmaSvg
            question={question}
            reference={reference}
            showD1={showD1}
            showAgreement={showAgreement}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "0.65rem",
            }}
          >
            <MiniFact
              icon={<BriefcaseBusiness size={16} />}
              title="Client asks"
              body={questionState.clientQuestion}
              color={questionState.color}
            />
            <MiniFact
              icon={<Compass size={16} />}
              title="Reference"
              body={referenceState.focus}
              color={referenceState.color}
            />
            <MiniFact
              icon={<ShieldCheck size={16} />}
              title="Discipline"
              body={showD1 ? "D1 before D10" : "D1 anchor hidden"}
              color={showD1 ? GREEN : VERMILION}
            />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel
            title="Career sub-question"
            icon={<MessageCircle size={18} />}
            color={questionState.color}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.65rem",
              }}
            >
              {(
                Object.keys(
                  PREDICTIVE_KARMA_QUESTIONS,
                ) as PredictiveKarmaQuestionKey[]
              ).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={question === key}
                  onClick={() => setQuestion(key)}
                  style={smallChipStyle(
                    question === key,
                    PREDICTIVE_KARMA_QUESTIONS[key].color,
                  )}
                >
                  {PREDICTIVE_KARMA_QUESTIONS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {questionState.answer}
            </p>
          </Panel>

          <Panel
            title="Reference frame"
            icon={<Compass size={18} />}
            color={referenceState.color}
          >
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                flexWrap: "wrap",
                marginBottom: "0.65rem",
              }}
            >
              {(
                Object.keys(PREDICTIVE_REFERENCES) as PredictiveReferenceKey[]
              ).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={reference === key}
                  onClick={() => setReference(key)}
                  style={smallChipStyle(
                    reference === key,
                    PREDICTIVE_REFERENCES[key].color,
                  )}
                >
                  {PREDICTIVE_REFERENCES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              {referenceState.note}
            </p>
          </Panel>
        </section>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.95fr)",
          gap: "1rem",
          alignItems: "start",
        }}
      >
        <section
          style={{
            border: `1px solid ${HAIRLINE}`,
            borderRadius: 8,
            background: SURFACE,
            padding: "1rem",
          }}
        >
          <p style={eyebrowStyle}>Reading axes</p>
          <h3
            style={{
              margin: "0.15rem 0 0.8rem",
              color: GOLD,
              fontSize: "1.18rem",
            }}
          >
            What gets weighted for this question
          </h3>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {PREDICTIVE_KARMA_AXES.map((axis) => {
              const active = activeAxes.some((item) => item.key === axis.key);
              return (
                <div
                  key={axis.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(120px, 0.35fr) minmax(0, 1fr)",
                    gap: "0.7rem",
                    border: `1px solid ${active ? axis.color : HAIRLINE}`,
                    borderRadius: 8,
                    padding: "0.7rem",
                    background: active
                      ? `${axis.color}14`
                      : "rgba(255,251,241,0.58)",
                  }}
                >
                  <div>
                    <strong style={{ color: active ? axis.color : INK_MUTED }}>
                      {axis.label}
                    </strong>
                    <p
                      style={{
                        margin: "0.25rem 0 0",
                        color: INK_MUTED,
                        fontSize: "0.78rem",
                        fontWeight: 850,
                      }}
                    >
                      {axis.map}
                    </p>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: INK_SECONDARY,
                      lineHeight: 1.45,
                    }}
                  >
                    {axis.note}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel
            title="D1-first guard"
            icon={<ShieldCheck size={18} />}
            color={showD1 ? GREEN : VERMILION}
          >
            <button
              type="button"
              aria-pressed={showD1}
              onClick={() => setShowD1((value) => !value)}
              style={smallChipStyle(showD1, GREEN)}
            >
              {showD1 ? "D1 anchor visible" : "Show D1 anchor"}
            </button>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              Read the rashi chart&apos;s 10th, its lord, and occupants before
              any divisional layer. The D10 refines the promise; it does not
              replace it.
            </p>
          </Panel>

          <Panel
            title="Reference agreement"
            icon={<UsersRound size={18} />}
            color={showAgreement ? BLUE : GOLD}
          >
            <button
              type="button"
              aria-pressed={showAgreement}
              onClick={() => setShowAgreement((value) => !value)}
              style={smallChipStyle(showAgreement, BLUE)}
            >
              {showAgreement ? "Agreement visible" : "Show agreement"}
            </button>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.5,
              }}
            >
              Lagna, Moon, and Sun agreeing gives a cleaner career signature.
              Differing references show mixed profession, feeling, or authority
              layers.
            </p>
          </Panel>

          <section
            style={{
              border: `1px solid ${questionState.color}66`,
              borderRadius: 8,
              background: `${questionState.color}14`,
              padding: "1rem",
            }}
          >
            <strong style={{ color: questionState.color }}>
              Predictive synthesis
            </strong>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
              }}
            >
              {synthesis}
            </p>
          </section>
        </section>
      </div>
    </div>
  );
}

function PredictiveKarmaSvg({
  question,
  reference,
  showD1,
  showAgreement,
}: {
  question: PredictiveKarmaQuestionKey;
  reference: PredictiveReferenceKey;
  showD1: boolean;
  showAgreement: boolean;
}) {
  const center = 170;
  const questionState = PREDICTIVE_KARMA_QUESTIONS[question];
  const referenceState = PREDICTIVE_REFERENCES[reference];

  // Coordinates mapping a 12-house North Indian chart in a 340x340 space
  const HOUSE_POLYGONS: Record<number, string> = {
    1: "170,10 90,90 170,170 250,90",
    2: "10,10 170,10 90,90",
    3: "10,10 90,90 10,170",
    4: "10,170 90,90 170,170 90,250",
    5: "10,170 90,250 10,330",
    6: "10,330 90,250 170,330",
    7: "170,330 90,250 170,170 250,250",
    8: "170,330 250,250 330,330",
    9: "330,170 250,250 330,330",
    10: "330,170 250,90 170,170 250,250",
    11: "330,10 250,90 330,170",
    12: "170,10 330,10 250,90",
  };

  const HOUSE_CENTERS: Record<number, { x: number; y: number }> = {
    1: { x: 170, y: 90 },
    2: { x: 90, y: 40 },
    3: { x: 40, y: 90 },
    4: { x: 90, y: 170 },
    5: { x: 40, y: 250 },
    6: { x: 90, y: 300 },
    7: { x: 170, y: 250 },
    8: { x: 250, y: 300 },
    9: { x: 300, y: 250 },
    10: { x: 250, y: 170 },
    11: { x: 300, y: 90 },
    12: { x: 250, y: 40 },
  };

  const activeAxes = PREDICTIVE_KARMA_AXES.filter((axis) =>
    axis.questions.some((item) => item === question),
  );
  const activeAxisLabels = activeAxes.map((axis) => axis.label).join(" + ");
  const topLabelParts = activeAxisLabels.split(" + ");
  const topLabelMulti = topLabelParts.length > 2;
  const topLabelLine1 = topLabelParts.slice(0, 2).join(" + ").toUpperCase();
  const topLabelLine2 = topLabelParts.slice(2).join(" + ").toUpperCase();

  return (
    <>
      <div
        style={{
          textAlign: "center",
          color: INK_MUTED,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          lineHeight: 1.35,
          marginBottom: "0.2rem",
        }}
      >
        {topLabelMulti ? (
          <>
            {topLabelLine1}
            <br />
            {topLabelLine2}
          </>
        ) : (
          activeAxisLabels.toUpperCase()
        )}
      </div>
      <svg
        viewBox="0 0 340 340"
        role="img"
        aria-label="Predictive tenth-house career sub-question diagram"
        style={{
          width: "100%",
          maxHeight: 430,
          margin: "0 auto",
          display: "block",
        }}
      >
        {/* Outer chart border */}
        <rect
          x="10"
          y="10"
          width="320"
          height="320"
          fill={`${GOLD}05`}
          stroke={HAIRLINE}
          strokeWidth="1.5"
        />

        {/* Background North Indian Chart Grid Lines for clean overlapping */}
        <line
          x1="10"
          y1="10"
          x2="330"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <line
          x1="330"
          y1="10"
          x2="10"
          y2="330"
          stroke={HAIRLINE}
          strokeWidth="1"
        />
        <polygon
          points="170,10 10,170 170,330 330,170"
          fill="none"
          stroke={HAIRLINE}
          strokeWidth="1"
        />

        {/* Render Houses (polygons) */}
        {Array.from({ length: 12 }, (_, idx) => {
          const h = idx + 1;
          const active = h === 10;
          const service = question === "independent" && h === 6;
          const business = question === "independent" && h === 7;
          const dusthana =
            question === "stability" && (h === 6 || h === 8 || h === 12);
          const typeSupport = question === "type" && (h === 2 || h === 6);

          const polyFill = active
            ? `${questionState.color}25`
            : service
              ? `${BLUE}20`
              : business
                ? `${GREEN}20`
                : dusthana
                  ? `${VERMILION}20`
                  : typeSupport
                    ? `${GOLD}20`
                    : "transparent";

          const strokeColor = active
            ? questionState.color
            : service
              ? BLUE
              : business
                ? GREEN
                : dusthana
                  ? VERMILION
                  : typeSupport
                    ? GOLD
                    : "rgba(168, 120, 48, 0.4)";

          const centerPt = HOUSE_CENTERS[h];

          return (
            <g key={h}>
              <polygon
                points={HOUSE_POLYGONS[h]}
                fill={polyFill}
                stroke={strokeColor}
                strokeWidth={
                  active || service || business || dusthana ? 2.5 : 1
                }
                style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }}
              />
              {/* House Number Badge */}
              <circle
                cx={centerPt.x}
                cy={centerPt.y}
                r={active ? 13 : 11}
                fill={active ? questionState.color : "#fff"}
                stroke={strokeColor}
                strokeWidth="1"
              />
              <text
                x={centerPt.x}
                y={centerPt.y + 4}
                textAnchor="middle"
                fill={active ? "#fff" : INK_SECONDARY}
                fontSize="12"
                fontWeight="400"
              >
                {h}
              </text>

              {/* Labels offset from centers */}
              {active ? (
                <text
                  x={centerPt.x}
                  y={centerPt.y - 18}
                  textAnchor="middle"
                  fill={questionState.color}
                  fontSize="10"
                  fontWeight="400"
                >
                  10th
                </text>
              ) : null}
              {service ? (
                <text
                  x={centerPt.x}
                  y={centerPt.y + 24}
                  textAnchor="middle"
                  fill={BLUE}
                  fontSize="9"
                  fontWeight="400"
                >
                  service
                </text>
              ) : null}
              {business ? (
                <text
                  x={centerPt.x}
                  y={centerPt.y + 24}
                  textAnchor="middle"
                  fill={GREEN}
                  fontSize="9"
                  fontWeight="400"
                >
                  business
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Agreement lines connecting 10th to 1st and 10th to 4th */}
        {showAgreement ? (
          <g>
            <line
              x1={HOUSE_CENTERS[10].x}
              y1={HOUSE_CENTERS[10].y}
              x2={HOUSE_CENTERS[1].x}
              y2={HOUSE_CENTERS[1].y}
              stroke={`${BLUE}77`}
              strokeWidth="2.5"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />
            <line
              x1={HOUSE_CENTERS[10].x}
              y1={HOUSE_CENTERS[10].y}
              x2={HOUSE_CENTERS[4].x}
              y2={HOUSE_CENTERS[4].y}
              stroke={`${BLUE}55`}
              strokeWidth="2.5"
              strokeDasharray="4 2"
              strokeLinecap="round"
            />
          </g>
        ) : null}

        {/* Center Circle Overlay */}
        <circle
          cx={center}
          cy={center}
          r={38}
          fill="#FFF9EA"
          stroke={referenceState.color}
          strokeWidth="2.5"
        />
        <text
          x={center}
          y={center - 14}
          textAnchor="middle"
          fill={INK_MUTED}
          fontSize="8"
          fontWeight="400"
        >
          READ FROM
        </text>
        <text
          x={center}
          y={center + 2}
          textAnchor="middle"
          fill={referenceState.color}
          fontSize="13"
          fontWeight="400"
        >
          {referenceState.label.replace("From ", "")}
        </text>
        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          fill={questionState.color}
          fontSize="9"
          fontWeight="400"
        >
          {questionState.short}
        </text>
      </svg>
      {showD1 ? (
        <div
          style={{
            textAlign: "center",
            color: GREEN,
            fontSize: "0.78rem",
            lineHeight: 1.35,
            marginTop: "0.2rem",
          }}
        >
          D1 foundation before D10 refinement
        </div>
      ) : null}
    </>
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
          fontWeight: 600,
        }}
      >
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
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
          fontWeight: 600,
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

function buttonStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): React.CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.62rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
