"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Eye,
  HeartHandshake,
  RefreshCcw,
  Scale,
  ShieldAlert,
  Swords,
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

type Layer = "aspect" | "attitude";

const DISCIPLINE_STATEMENTS = [
  {
    key: "mutual-aspect-friendship",
    label: "A mutual aspect means the two grahas regard each other with mutual friendship or hostility.",
    correction:
      "Aspect geometry and natural-friendship attitude are two separate facts. A mutual aspect does not imply a mutual attitude.",
  },
  {
    key: "mutual-enmity",
    label: "Mars and Saturn are mutual enemies in the natural-friendship grid.",
    correction:
      "The grid is asymmetric: Mars → Saturn is neutral; Saturn → Mars is enemy. It is not a mutual enmity.",
  },
  {
    key: "verdict",
    label: "The Mars-Saturn asymmetry tells us Saturn’s domain will lose to Mars in the dispute.",
    correction:
      "The asymmetry is a colouring tool — it describes how the relationship may be experienced, not a verdict for a specific outcome.",
  },
] as const;

const SCENARIO_OPTIONS = [
  {
    label: "Since the aspect is mutual, the two planets must regard each other as mutual enemies.",
    verdict: "wrong",
    feedback:
      "This conflates the two layers. The aspect is mutual, but the natural-friendship attitude is asymmetric: Mars → Saturn neutral, Saturn → Mars enemy.",
  },
  {
    label: "The aspect is mutual, and the attitude is asymmetric: Saturn regards Mars as enemy while Mars regards Saturn as neutral.",
    verdict: "right",
    feedback:
      "Correct. Geometric mutuality and attitudinal asymmetry are held separately; each is a confirmed fact from a different doctrinal layer.",
  },
  {
    label: "Because Saturn regards Mars as enemy, Mars will defeat Saturn in the litigation.",
    verdict: "wrong",
    feedback:
      "This overreads the asymmetry into a directional verdict. The attitude colours the relationship; it does not decide a specific dispute outcome.",
  },
];

export function MarsSaturnDynamicExplorer() {
  const [layer, setLayer] = useState<Layer>("aspect");
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "mutual-aspect-friendship": false,
    "mutual-enmity": false,
    verdict: false,
  });

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setLayer("aspect");
    setScenarioChoice(null);
    setMistakes({
      "mutual-aspect-friendship": false,
      "mutual-enmity": false,
      verdict: false,
    });
  }

  return (
    <div
      data-interactive="mars-saturn-dynamic-explorer"
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
            <p style={eyebrowStyle}>Chart L1 — Mars-Saturn dynamic</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Geometry vs. attitude: two separate facts
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Toggle between the aspect-geometry layer and the natural-friendship layer to see why Chart L1&apos;s Mars-Saturn relationship is geometrically mutual but attitudinally asymmetric.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Why this pairing matters for conflict</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.55rem",
          }}
        >
          <MiniFact
            icon={<Swords size={16} />}
            title="Mars"
            body="Fast, assertive, immediate directed action under conflict."
            color={VERMILION}
          />
          <MiniFact
            icon={<Scale size={16} />}
            title="Saturn"
            body="Slow, patient, structural persistence and formal process."
            color={PURPLE}
          />
          <MiniFact
            icon={<ArrowLeftRight size={16} />}
            title="Tension"
            body="Two opposite tempos brought into relationship — the reason this pair is flagged."
            color={GOLD}
          />
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Layer selector</p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.55rem",
            }}
          >
            <button
              type="button"
              aria-pressed={layer === "aspect"}
              onClick={() => setLayer("aspect")}
              style={buttonStyle(layer === "aspect", BLUE)}
            >
              <Eye size={15} aria-hidden="true" />
              Aspect geometry
            </button>
            <button
              type="button"
              aria-pressed={layer === "attitude"}
              onClick={() => setLayer("attitude")}
              style={buttonStyle(layer === "attitude", VERMILION)}
            >
              <HeartHandshake size={15} aria-hidden="true" />
              Natural friendship
            </button>
          </div>

          <MarsSaturnDiagram layer={layer} />

          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${layer === "aspect" ? BLUE : VERMILION}`,
              background: layer === "aspect" ? `${BLUE}${"0A"}` : `${VERMILION}${"0A"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              {layer === "aspect"
                ? "Chart L1: Mars occupies the 12th house and Saturn occupies the 6th house. These are exactly opposite houses, so each casts the universal 7th-house drishti on the other. This mutuality is a geometric, symmetric fact — it says nothing by itself about how the two grahas feel about each other."
                : "Per T1-05 8.3’s natural-friendship grid: Mars regards Saturn as neutral, while Saturn regards Mars as enemy. This is an asymmetric attitudinal fact. It colours how each planet’s domain may experience the other, but it is not a verdict."}
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Natural-friendship grid excerpt</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.55rem",
              marginTop: "0.55rem",
            }}
          >
            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: SURFACE,
              }}
            >
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem" }}>From</p>
            </div>
            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: SURFACE,
              }}
            >
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem" }}>Toward Saturn</p>
            </div>
            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: SURFACE,
              }}
            >
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem" }}>Toward Mars</p>
            </div>

            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: SURFACE,
              }}
            >
              <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>Mars</p>
            </div>
            <div
              style={{
                border: `1px solid ${GREEN}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: `${GREEN}${"0A"}`,
              }}
            >
              <p style={{ margin: 0, color: GREEN, fontWeight: 600, fontSize: "0.9rem" }}>Neutral</p>
            </div>
            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: SURFACE,
              }}
            >
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.9rem" }}>—</p>
            </div>

            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: SURFACE,
              }}
            >
              <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>Saturn</p>
            </div>
            <div
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: SURFACE,
              }}
            >
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.9rem" }}>—</p>
            </div>
            <div
              style={{
                border: `1px solid ${VERMILION}`,
                borderRadius: 8,
                padding: "0.55rem",
                background: `${VERMILION}${"0A"}`,
              }}
            >
              <p style={{ margin: 0, color: VERMILION, fontWeight: 600, fontSize: "0.9rem" }}>Enemy</p>
            </div>
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px dashed ${GOLD}`,
              background: `${GOLD}${"08"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.55 }}>
              <ArrowRight size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
              <strong style={{ color: GOLD, fontWeight: 600 }}>Analogy:</strong> T1-05 8.3 flags the same structural trap for Mars-Mercury. The same discipline — separate aspect geometry from natural-friendship attitude — applies here.
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Spot the error</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          A learner looks at Chart L1&apos;s confirmed Mars-Saturn mutual aspect and says: “Since the aspect is mutual, the two planets must regard each other as mutual enemies, making this an especially hostile combination.” Which correction is precise?
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
                      isRight ? (
                        <Scale size={16} />
                      ) : (
                        <ShieldAlert size={16} />
                      )
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
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}${"0A"}` : "transparent",
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
                    checked={active}
                    onChange={() => toggleMistake(s.key)}
                  />
                  <span>{s.label}</span>
                </label>
                {active ? (
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
          borderColor: `${BLUE}66`,
          background: `${BLUE}${"0A"}`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3
          style={{
            margin: "0.15rem 0 0",
            color: BLUE,
            fontSize: "1.15rem",
            fontWeight: 600,
          }}
        >
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          Chart L1: mutual aspect, asymmetric attitude
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          Mars (12th) and Saturn (6th) aspect each other mutually through the 7th-house drishti — a symmetric geometric fact. Separately, the natural-friendship grid shows an asymmetric attitude: Saturn regards Mars as enemy, while Mars regards Saturn as neutral. Hold both facts precisely: the relationship is geometrically mutual but attitudinally asymmetric. This is a colouring tool, not a verdict-generator.
        </p>
      </section>
    </div>
  );
}

function MarsSaturnDiagram({ layer }: { layer: Layer }) {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={
        layer === "aspect"
          ? "Mars in the 12th and Saturn in the 6th, connected by a mutual 7th-house aspect arrow"
          : "Mars regards Saturn as neutral, while Saturn regards Mars as enemy"
      }
      style={{ width: "100%", maxHeight: 240, display: "block", marginTop: "0.75rem" }}
    >
      <rect x={16} y={18} width={288} height={144} rx={8} fill="transparent" stroke={HAIRLINE} />

      {/* Mars circle */}
      <circle cx={70} cy={90} r={34} fill={`${VERMILION}${"15"}`} stroke={VERMILION} strokeWidth={3} />
      <text x={70} y={86} textAnchor="middle" fill={VERMILION} fontSize={13} fontWeight={600}>
        Mars
      </text>
      <text x={70} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        12th house
      </text>

      {/* Saturn circle */}
      <circle cx={250} cy={90} r={34} fill={`${PURPLE}${"15"}`} stroke={PURPLE} strokeWidth={3} />
      <text x={250} y={86} textAnchor="middle" fill={PURPLE} fontSize={13} fontWeight={600}>
        Saturn
      </text>
      <text x={250} y={102} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        6th house
      </text>

      {layer === "aspect" ? (
        <>
          {/* Mutual aspect arrow */}
          <path
            d="M 104 90 L 216 90"
            fill="none"
            stroke={BLUE}
            strokeWidth={4}
            strokeLinecap="round"
            markerStart="url(#arrowStart)"
            markerEnd="url(#arrowEnd)"
          />
          <defs>
            <marker id="arrowStart" markerWidth={10} markerHeight={10} refX={8} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M8,0 L0,3 L8,6 L8,0" fill={BLUE} transform="rotate(180 4 3)" />
            </marker>
            <marker id="arrowEnd" markerWidth={10} markerHeight={10} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,3 L0,6 L0,0" fill={BLUE} />
            </marker>
          </defs>
          <text x={160} y={78} textAnchor="middle" fill={BLUE} fontSize={11} fontWeight={600}>
            mutual 7th-house drishti
          </text>
        </>
      ) : (
        <>
          {/* Mars -> Saturn neutral arrow */}
          <path
            d="M 100 74 C 140 50, 180 50, 220 74"
            fill="none"
            stroke={GREEN}
            strokeWidth={3}
            strokeLinecap="round"
            markerEnd="url(#neutralArrow)"
          />
          <text x={160} y={52} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>
            Mars → Saturn: neutral
          </text>

          {/* Saturn -> Mars enemy arrow */}
          <path
            d="M 220 106 C 180 130, 140 130, 100 106"
            fill="none"
            stroke={VERMILION}
            strokeWidth={3}
            strokeLinecap="round"
            markerEnd="url(#enemyArrow)"
          />
          <text x={160} y={146} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
            Saturn → Mars: enemy
          </text>

          <defs>
            <marker id="neutralArrow" markerWidth={10} markerHeight={10} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,3 L0,6 L0,0" fill={GREEN} />
            </marker>
            <marker id="enemyArrow" markerWidth={10} markerHeight={10} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,3 L0,6 L0,0" fill={VERMILION} />
            </marker>
          </defs>
        </>
      )}
    </svg>
  );
}

function MiniFact({
  icon,
  title,
  body,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      style={{
        border: `1px solid ${color}44`,
        borderRadius: 8,
        background: `${color}${"08"}`,
        padding: "0.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
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
