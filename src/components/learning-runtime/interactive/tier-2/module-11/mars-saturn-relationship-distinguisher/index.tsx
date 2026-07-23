"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  RefreshCcw,
  Scale,
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

type ModeKey = "conjunction" | "mutualAspect" | "mutualReception";

const MODES: Record<
  ModeKey,
  {
    label: string;
    short: string;
    color: string;
    structure: string;
    reading: string;
    marsSaturnReading: string;
  }
> = {
  conjunction: {
    label: "Conjunction",
    short: "Same house / sign",
    color: VERMILION,
    structure: "The two grahas occupy the same immediate space; their energies are fused, not merely related.",
    reading:
      "Most intense mode. Each graha’s tempo is forced into constant contact with the other, leaving little independent operational room.",
    marsSaturnReading:
      "For Mars-Saturn, conjunction concentrates the underlying friendship asymmetry into a single shared stage — potentially the most volatile expression, with both contest-energy and structural process competing in the same house.",
  },
  mutualAspect: {
    label: "Mutual aspect",
    short: "Each aspects the other",
    color: BLUE,
    structure:
      "The two grahas influence each other from separate houses, most cleanly via the universal 7th-house drishti when opposite.",
    reading:
      "Active relationship at a distance. Each graha retains its own operational independence while still shaping the other’s domain.",
    marsSaturnReading:
      "For Mars-Saturn, mutual aspect carries the same underlying asymmetry but with each graha keeping its own house-domain — generally more manageable than conjunction.",
  },
  mutualReception: {
    label: "Mutual reception",
    short: "Parivartana / exchange",
    color: PURPLE,
    structure:
      "Each graha occupies the other’s own sign — an exchange of domains rather than shared space or distant influence.",
    reading:
      "A structural alliance or interdependence. Even naturally tense grahas become invested in each other’s territory.",
    marsSaturnReading:
      "For Mars-Saturn, mutual reception is genuinely complex: each planet governs from the other’s home despite the underlying friendship tension. It is neither automatically resolved nor automatically hostile.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "collapse",
    label: "Any Mars-Saturn relationship — conjunction, aspect, or reception — can be read the same way.",
    correction:
      "Each mode has a distinct interpretive character: conjunction is fused and most volatile; mutual aspect is active at a distance; mutual reception is an exchange of domains.",
  },
  {
    key: "assume-conjunction",
    label: "Chart L1 must have a Mars-Saturn conjunction because the dynamic is discussed in depth.",
    correction:
      "Chart L1’s Mars (12th) and Saturn (6th) are in different houses. They are in mutual aspect, not conjunction.",
  },
  {
    key: "reception-harmony",
    label: "Mutual reception between Mars and Saturn would automatically be more favourable than conjunction or aspect.",
    correction:
      "Mutual reception is a distinct, complex signal. Between naturally tense grahas it is not automatically harmonious or resolved.",
  },
] as const;

export function MarsSaturnRelationshipDistinguisher() {
  const [mode, setMode] = useState<ModeKey>("mutualAspect");
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    collapse: false,
    "assume-conjunction": false,
    "reception-harmony": false,
  });

  const modeData = MODES[mode];

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setMode("mutualAspect");
    setMistakes({ collapse: false, "assume-conjunction": false, "reception-harmony": false });
  }

  return (
    <div
      data-interactive="mars-saturn-relationship-distinguisher"
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
            <p style={eyebrowStyle}>Chart L1 — Mars-Saturn relationship modes</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Conjunction, mutual aspect, mutual reception: distinguished
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Toggle the three structural modes to see how each carries the same Mars-Saturn tension with a different interpretive character.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select a relationship mode</p>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "0.55rem",
          }}
        >
          {(Object.keys(MODES) as ModeKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
              style={buttonStyle(mode === key, MODES[key].color)}
            >
              {mode === key ? <CircleDot size={15} aria-hidden="true" /> : null}
              {MODES[key].label}
            </button>
          ))}
        </div>

        <RelationshipDiagram mode={mode} />

        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.85rem",
            borderRadius: 8,
            border: `1px solid ${modeData.color}`,
            background: `${modeData.color}${"0A"}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: modeData.color }}>
            <Scale size={18} aria-hidden="true" />
            <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>{modeData.label}</span>
            <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>({modeData.short})</span>
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Structure:</strong>{" "}
            {modeData.structure}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>General character:</strong>{" "}
            {modeData.reading}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Mars-Saturn specifically:</strong>{" "}
            {modeData.marsSaturnReading}
          </p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Chart L1 verification by elimination</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            Mars occupies the 12th house (Leo). Saturn occupies the 6th house (Aquarius). Which mode(s) apply?
          </p>
          <div
            style={{
              display: "grid",
              gap: "0.55rem",
              marginTop: "0.65rem",
            }}
          >
            <VerificationRow
              label="Conjunction"
              applies={false}
              reason="Mars and Saturn are in different houses."
            />
            <VerificationRow
              label="Mutual aspect"
              applies={true}
              reason="Opposite houses ⇒ each casts the universal 7th-house drishti on the other."
            />
            <VerificationRow
              label="Mutual reception"
              applies={false}
              reason="Mars is not in Saturn’s signs (Capricorn/Aquarius) and Saturn is not in Mars’s signs (Aries/Scorpio)."
            />
          </div>
          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${BLUE}`,
              background: `${BLUE}${"0A"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              <strong style={{ color: BLUE, fontWeight: 600 }}>Result:</strong> Chart L1 presents{" "}
              <strong style={{ color: BLUE, fontWeight: 600 }}>mutual aspect</strong> — an active
              relationship at a distance, with each graha retaining its own operational domain.
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Contrasting case — conjunction in the 6th</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            A hypothetical chart has Mars and Saturn both in the 6th house, conjunct. Saturn is in its own sign; Mars is in a neutral sign.
          </p>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${VERMILION}`,
              background: `${VERMILION}${"0A"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              This is the <strong style={{ color: VERMILION, fontWeight: 600 }}>conjunction</strong>{" "}
              mode — more intense than Chart L1&apos;s mutual aspect. Both contest-energy and
              structural process share the same house, concentrating the underlying asymmetry into a
              single stage rather than distributing it across two separate domains.
            </p>
          </div>
        </section>
      </div>

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
          Chart L1: mutual aspect mode
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          By elimination, Chart L1 presents mutual aspect: Mars and Saturn influence each other from opposite houses, but neither is conjunct nor in mutual reception. This mode is genuinely active yet more manageable than conjunction, because each graha keeps its own independent domain. The underlying friendship asymmetry still applies, but it is expressed across a distance rather than fused in a single space.
        </p>
      </section>
    </div>
  );
}

function VerificationRow({
  label,
  applies,
  reason,
}: {
  label: string;
  applies: boolean;
  reason: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        gap: "0.65rem",
        padding: "0.65rem",
        border: `1px solid ${applies ? GREEN : HAIRLINE}`,
        borderRadius: 8,
        background: applies ? `${GREEN}${"08"}` : "transparent",
      }}
    >
      <span style={{ color: applies ? GREEN : VERMILION, marginTop: 2 }}>
        {applies ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      </span>
      <div>
        <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 600, fontSize: "0.92rem" }}>
          {label}
        </p>
        <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.84rem", lineHeight: 1.5 }}>
          {reason}
        </p>
      </div>
    </div>
  );
}

function RelationshipDiagram({ mode }: { mode: ModeKey }) {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={`Diagram of ${MODES[mode].label} relationship between Mars and Saturn`}
      style={{ width: "100%", maxHeight: 240, display: "block", marginTop: "0.75rem" }}
    >
      <rect x={16} y={16} width={288} height={148} rx={8} fill="transparent" stroke={HAIRLINE} />

      {mode === "conjunction" ? (
        <>
          <rect x={110} y={46} width={100} height={88} rx={8} fill={`${VERMILION}${"08"}`} stroke={VERMILION} />
          <text x={160} y={66} textAnchor="middle" fill={VERMILION} fontSize={11} fontWeight={600}>
            6th house
          </text>
          <circle cx={142} cy={102} r={22} fill={`${VERMILION}${"15"}`} stroke={VERMILION} strokeWidth={2} />
          <text x={142} y={106} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
            Mars
          </text>
          <circle cx={178} cy={102} r={22} fill={`${PURPLE}${"15"}`} stroke={PURPLE} strokeWidth={2} />
          <text x={178} y={106} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>
            Saturn
          </text>
          <text x={160} y={152} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
            fused in the same space
          </text>
        </>
      ) : mode === "mutualAspect" ? (
        <>
          <rect x={46} y={46} width={76} height={76} rx={8} fill={`${VERMILION}${"08"}`} stroke={VERMILION} />
          <text x={84} y={70} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
            12th
          </text>
          <circle cx={84} cy={98} r={20} fill={`${VERMILION}${"15"}`} stroke={VERMILION} strokeWidth={2} />
          <text x={84} y={102} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
            Mars
          </text>

          <rect x={198} y={46} width={76} height={76} rx={8} fill={`${PURPLE}${"08"}`} stroke={PURPLE} />
          <text x={236} y={70} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>
            6th
          </text>
          <circle cx={236} cy={98} r={20} fill={`${PURPLE}${"15"}`} stroke={PURPLE} strokeWidth={2} />
          <text x={236} y={102} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>
            Saturn
          </text>

          <path
            d="M 108 126 C 142 150, 178 150, 212 126"
            fill="none"
            stroke={BLUE}
            strokeWidth={4}
            strokeLinecap="round"
            markerStart="url(#mutualStart)"
            markerEnd="url(#mutualEnd)"
          />
          <rect x={104} y={22} width={112} height={24} rx={6} fill={SURFACE} stroke={`${BLUE}${"55"}`} />
          <text x={160} y={38} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>
            mutual 7th drishti
          </text>
          <defs>
            <marker id="mutualStart" markerWidth={10} markerHeight={10} refX={8} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M8,0 L0,3 L8,6 L8,0" fill={BLUE} transform="rotate(180 4 3)" />
            </marker>
            <marker id="mutualEnd" markerWidth={10} markerHeight={10} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,3 L0,6 L0,0" fill={BLUE} />
            </marker>
          </defs>
          <text x={160} y={150} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
            active relationship at a distance
          </text>
        </>
      ) : (
        <>
          <rect x={46} y={46} width={76} height={76} rx={8} fill={`${VERMILION}${"08"}`} stroke={VERMILION} />
          <text x={84} y={70} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
            Mars in ♒
          </text>
          <text x={84} y={88} textAnchor="middle" fill={INK_MUTED} fontSize={9} fontWeight={600}>
            Saturn&apos;s sign
          </text>
          <circle cx={84} cy={110} r={18} fill={`${VERMILION}${"15"}`} stroke={VERMILION} strokeWidth={2} />
          <text x={84} y={114} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
            Mars
          </text>

          <rect x={198} y={46} width={76} height={76} rx={8} fill={`${PURPLE}${"08"}`} stroke={PURPLE} />
          <text x={236} y={70} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>
            Saturn in ♈
          </text>
          <text x={236} y={88} textAnchor="middle" fill={INK_MUTED} fontSize={9} fontWeight={600}>
            Mars&apos;s sign
          </text>
          <circle cx={236} cy={110} r={18} fill={`${PURPLE}${"15"}`} stroke={PURPLE} strokeWidth={2} />
          <text x={236} y={114} textAnchor="middle" fill={PURPLE} fontSize={10} fontWeight={600}>
            Saturn
          </text>

          <path
            d="M 104 74 C 130 50, 190 50, 216 74"
            fill="none"
            stroke={PURPLE}
            strokeWidth={3}
            strokeLinecap="round"
            markerEnd="url(#exchange1)"
          />
          <path
            d="M 216 126 C 190 150, 130 150, 104 126"
            fill="none"
            stroke={VERMILION}
            strokeWidth={3}
            strokeLinecap="round"
            markerEnd="url(#exchange2)"
          />
          <defs>
            <marker id="exchange1" markerWidth={10} markerHeight={10} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,3 L0,6 L0,0" fill={PURPLE} />
            </marker>
            <marker id="exchange2" markerWidth={10} markerHeight={10} refX={0} refY={3} orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L8,3 L0,6 L0,0" fill={VERMILION} />
            </marker>
          </defs>
          <text x={160} y={154} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
            exchange of domains
          </text>
        </>
      )}
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
