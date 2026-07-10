"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  Clock,
  Gavel,
  GraduationCap,
  LayoutTemplate,
  RefreshCcw,
  Scale,
  ShieldAlert,
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

type SignificationKey = "judge" | "delay" | "structure" | "karma";
type DignityKey = "own" | "debilitated";

const SIGNIFICATIONS: Record<
  SignificationKey,
  { title: string; icon: React.ReactNode; litigation: string; color: string }
> = {
  judge: {
    title: "Judge",
    icon: <Gavel size={18} aria-hidden="true" />,
    litigation:
      "Formal adjudication, court machinery, and the judge as arbiter — a near-literal fit for litigation.",
    color: BLUE,
  },
  delay: {
    title: "Delay",
    icon: <Clock size={18} aria-hidden="true" />,
    litigation:
      "Procedural slowness, scheduled hearings, adjournments, and extended timelines — litigation’s own real-world pace.",
    color: GOLD,
  },
  structure: {
    title: "Structure",
    icon: <LayoutTemplate size={18} aria-hidden="true" />,
    litigation:
      "Formal stages, documentation, rules of procedure, and an orderly process rather than a quick resolution.",
    color: GREEN,
  },
  karma: {
    title: "Karma / due process",
    icon: <Scale size={18} aria-hidden="true" />,
    litigation:
      "Consequence and due process unfolding over time — not a guarantee of a favourable verdict.",
    color: PURPLE,
  },
};

const DIGNITY_CASES: Record<
  DignityKey,
  {
    label: string;
    sign: string;
    delayQuality: string;
    structureQuality: string;
    reading: string;
  }
> = {
  own: {
    label: "Own sign",
    sign: "Aquarius (Chart L1)",
    delayQuality: "Protracted",
    structureQuality: "Well-managed",
    reading:
      "Delay is fully present, but the process is likely to be structurally coherent — slow yet orderly, with persistence paying off.",
  },
  debilitated: {
    label: "Debilitated",
    sign: "Aries (contrast case)",
    delayQuality: "Protracted",
    structureQuality: "Disorderly / poorly managed",
    reading:
      "Delay is still present, but without dignity to support it the protraction is more likely to feel chaotic, stuck, or poorly managed.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "poetic",
    label: "Saturn’s \"judge\" title is only a poetic metaphor with no special litigation relevance.",
    correction:
      "For litigation specifically, the judge correspondence is closer to direct than most kāraka-to-domain fits in this curriculum.",
  },
  {
    key: "verdict-guarantee",
    label: "A well-placed Saturn guarantees a favourable verdict.",
    correction:
      "Karmic justice means due process unfolding over time; it does not guarantee the process resolves in the client’s preferred direction.",
  },
  {
    key: "dignity-presence",
    label: "A debilitated Saturn has no delay signification.",
    correction:
      "Dignity changes how well a signification’s domain is managed, not whether the signification is present. Debilitated Saturn still signals delay, but poorly managed delay.",
  },
] as const;

export function SaturnDelayStructurePersistenceLitigation() {
  const [activeSig, setActiveSig] = useState<SignificationKey>("judge");
  const [dignity, setDignity] = useState<DignityKey>("own");
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    poetic: false,
    "verdict-guarantee": false,
    "dignity-presence": false,
  });

  const caseData = DIGNITY_CASES[dignity];
  const sigData = SIGNIFICATIONS[activeSig];

  const synthesis = useMemo(() => {
    return `Saturn’s ${sigData.title.toLowerCase()} signification reads onto litigation as: ${sigData.litigation} With dignity set to ${caseData.label.toLowerCase()} (${caseData.sign}), the matter is ${caseData.delayQuality.toLowerCase()} and ${caseData.structureQuality.toLowerCase()}. This is a pace-and-character reading, not a verdict prediction.`;
  }, [sigData, caseData]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setActiveSig("judge");
    setDignity("own");
    setMistakes({ poetic: false, "verdict-guarantee": false, "dignity-presence": false });
  }

  return (
    <div
      data-interactive="saturn-delay-structure-persistence-litigation"
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
            <p style={eyebrowStyle}>Chart L1 — Saturn as process and pace</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: PURPLE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Saturn: judge, delay, structure, persistence
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Explore how Saturn&apos;s classical significations map onto litigation&apos;s pace and character, and how dignity changes the quality of delay without removing it.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Saturn significations → litigation mapping</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.55,
          }}
        >
          Click each signification to see how it extends specifically into litigation reading.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
            gap: "0.65rem",
            marginTop: "0.75rem",
          }}
        >
          {(Object.keys(SIGNIFICATIONS) as SignificationKey[]).map((key) => {
            const s = SIGNIFICATIONS[key];
            const active = activeSig === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveSig(key)}
                style={{
                  border: `1px solid ${active ? s.color : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${s.color}${"0A"}` : "transparent",
                  color: active ? s.color : INK_SECONDARY,
                  padding: "0.85rem",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                  {s.icon}
                  {s.title}
                </div>
                {active ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: INK_SECONDARY,
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {s.litigation}
                  </p>
                ) : null}
              </button>
            );
          })}
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Dignity changes the quality, not the presence</p>
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
              aria-pressed={dignity === "own"}
              onClick={() => setDignity("own")}
              style={buttonStyle(dignity === "own", GREEN)}
            >
              <GraduationCap size={15} aria-hidden="true" />
              Chart L1: own sign
            </button>
            <button
              type="button"
              aria-pressed={dignity === "debilitated"}
              onClick={() => setDignity("debilitated")}
              style={buttonStyle(dignity === "debilitated", VERMILION)}
            >
              <ShieldAlert size={15} aria-hidden="true" />
              Contrast: debilitated
            </button>
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${dignity === "own" ? GREEN : VERMILION}`,
              background: `${dignity === "own" ? GREEN : VERMILION}${"0A"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: dignity === "own" ? GREEN : VERMILION,
                fontWeight: 600,
              }}
            >
              {dignity === "own" ? <GraduationCap size={18} /> : <ShieldAlert size={18} />}
              {caseData.label} — {caseData.sign}
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {caseData.reading}
            </p>
            <div
              style={{
                marginTop: "0.65rem",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.55rem",
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
                <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem" }}>Delay</p>
                <p style={{ margin: "0.2rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>
                  {caseData.delayQuality}
                </p>
              </div>
              <div
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 8,
                  padding: "0.55rem",
                  background: SURFACE,
                }}
              >
                <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.75rem" }}>Structure</p>
                <p style={{ margin: "0.2rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>
                  {caseData.structureQuality}
                </p>
              </div>
            </div>
          </div>

          <ProcessGauge dignity={dignity} />
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Worked example — Chart L1</p>
          <ol
            style={{
              margin: "0.55rem 0 0",
              paddingLeft: "1.2rem",
              color: INK_SECONDARY,
              lineHeight: 1.7,
            }}
          >
            <li>
              <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Placement and dignity:</strong>{" "}
              Saturn occupies the 6th house, own sign (Aquarius), and rules that house.
            </li>
            <li>
              <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Delay:</strong> own-sign Saturn&apos;s delay signification is fully active.
            </li>
            <li>
              <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Structure:</strong> full classical strength suggests the delay is well-managed, not chaotic.
            </li>
            <li>
              <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Synthesis:</strong> the process is likely protracted but structurally coherent — a pace-and-character reading, not a verdict claim.
            </li>
          </ol>

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
              <strong style={{ color: PURPLE, fontWeight: 600 }}>Precision check:</strong>{" "}
              Karmic justice means due process over time — never a guarantee that the client will win.
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
          borderColor: `${PURPLE}66`,
          background: `${PURPLE}${"0A"}`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3
          style={{
            margin: "0.15rem 0 0",
            color: PURPLE,
            fontSize: "1.15rem",
            fontWeight: 600,
          }}
        >
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          {sigData.title} × {caseData.label} Saturn
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function ProcessGauge({ dignity }: { dignity: DignityKey }) {
  const ownX = 78; // protracted end
  const ownY = 42; // well-managed top
  const debX = 78;
  const debY = 168; // chaotic bottom

  const marker = dignity === "own" ? { x: ownX, y: ownY, color: GREEN, label: "Chart L1: protracted but well-managed" } : { x: debX, y: debY, color: VERMILION, label: "Debilitated: protracted and disorderly" };

  return (
    <svg
      viewBox="0 0 300 220"
      role="img"
      aria-label="Process gauge plotting delay length against structural quality"
      style={{ width: "100%", maxHeight: 260, display: "block", marginTop: "0.85rem" }}
    >
      <rect x={30} y={24} width={240} height={172} rx={8} fill="transparent" stroke={HAIRLINE} />

      {/* Axis labels */}
      <text x={150} y={14} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={600}>
        Pace →
      </text>
      <text x={14} y={110} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={600} transform="rotate(-90 14 110)">
        Structure →
      </text>

      <text x={46} y={190} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Quick
      </text>
      <text x={254} y={190} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Protracted
      </text>
      <text x={22} y={174} textAnchor="end" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Chaotic
      </text>
      <text x={22} y={34} textAnchor="end" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        Well-managed
      </text>

      {/* Axis lines */}
      <line x1={46} y1={180} x2={254} y2={180} stroke={HAIRLINE} strokeWidth={1.5} />
      <line x1={46} y1={36} x2={46} y2={180} stroke={HAIRLINE} strokeWidth={1.5} />

      {/* Background gradient zones */}
      <rect x={46} y={36} width={104} height={144} fill={`${GREEN}${"08"}`} />
      <rect x={150} y={36} width={104} height={144} fill={`${GOLD}${"08"}`} />

      {/* Marker */}
      <circle cx={marker.x} cy={marker.y} r={8} fill={marker.color} stroke="#fff" strokeWidth={2} />
      <text x={marker.x} y={marker.y + 22} textAnchor="middle" fill={marker.color} fontSize={10} fontWeight={600}>
        {marker.label}
      </text>
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
