"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  GraduationCap,
  Info,
  MapPin,
  RefreshCcw,
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

const HOUSE_LABELS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"];

const HOUSE_COLOURING = [
  "Direct, visible, personally embodied assertion — the native’s own self becomes the front line of contest.",
  "Assertion tied to speech, family, or accumulated resources; disputes may carry a personal or financial edge.",
  "Courageous self-effort and short journeys; energy channels through initiative, siblings, or communications.",
  "Emotionally or domestically coloured; contests may touch home, property, or private foundations.",
  "Intelligent, strategic, merit-based assertion; counsel, creativity, and past good karma shape the approach.",
  "The contest domain itself — energy is aimed directly at disputes, obstacles, and rivalries.",
  "Relational and partnership-oriented; the other party is directly in view, often played out openly.",
  "Hidden, transformative, or shared-resource pressure; energy works beneath the surface or through sudden turns.",
  "Principled, far-reaching, or guru-guided; legal/dharmic frameworks colour the contest approach.",
  "Public, career, and status-oriented; energy is visible in professional or authority arenas.",
  "Network and gains-oriented; allies, elder siblings, and income goals resource the contest.",
  "Indirect, institutionally mediated, or behind-the-scenes; energy moves through hidden channels, institutions, or necessary surrender.",
];

type DignityKey = "debilitated" | "enemy" | "neutral" | "friend" | "own" | "exalted";

const DIGNITIES: Record<
  DignityKey,
  { label: string; sign: string; color: string; reading: string }
> = {
  debilitated: {
    label: "Debilitated",
    sign: "Cancer",
    color: VERMILION,
    reading:
      "Energy is blocked or easily misdirected; assertive engagement may be frustrated, timid, or poorly timed.",
  },
  enemy: {
    label: "Enemy sign",
    sign: "Gemini / Virgo",
    color: VERMILION,
    reading:
      "Energy is strained; assertion meets resistance and may feel forced or conflicted.",
  },
  neutral: {
    label: "Neutral sign",
    sign: "Taurus / Libra",
    color: GOLD,
    reading:
      "Energy is functional but unremarkable; contest capacity works at an ordinary level.",
  },
  friend: {
    label: "Friend sign",
    sign: "Leo",
    color: BLUE,
    reading:
      "Energy is reasonably well-supported — available and effective without being maximally forceful.",
  },
  own: {
    label: "Own sign",
    sign: "Aries / Scorpio",
    color: GREEN,
    reading:
      "Energy is strong and self-directed; the native can assert and defend with natural confidence.",
  },
  exalted: {
    label: "Exalted",
    sign: "Capricorn",
    color: GREEN,
    reading:
      "Energy is at peak classical strength; directed action under conflict is highly effective and disciplined.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "fixed-meaning",
    label: "Mars signifies contest in the same way regardless of house or dignity.",
    correction:
      "A kāraka’s manifestation is shaped by house placement and dignity. The same Mars can be constructive or escalatory depending on context.",
  },
  {
    key: "twelfth-weak",
    label: "Mars in the 12th house is simply weak or bad for contest capacity.",
    correction:
      "12th-house Mars colours the character of contest-energy toward indirect or institutionally mediated channels; dignity is read separately.",
  },
  {
    key: "mars-saturn-here",
    label: "This lesson should fully analyse Chart L1’s Mars-Saturn mutual aspect.",
    correction:
      "The Mars-Saturn relationship is deliberately reserved for Chapter 2; this lesson scopes to Mars alone.",
  },
] as const;

export function MarsContestKarakaLitigation() {
  const [house, setHouse] = useState<number>(11); // 0-based; 11 = 12th
  const [dignity, setDignity] = useState<DignityKey>("friend");
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "fixed-meaning": false,
    "twelfth-weak": false,
    "mars-saturn-here": false,
  });

  const dignityData = DIGNITIES[dignity];

  const synthesis = useMemo(() => {
    return `Mars in the ${HOUSE_LABELS[house].toLowerCase()}, in a ${dignityData.label.toLowerCase()} (${dignityData.sign}): ${dignityData.reading} The house colours this as ${HOUSE_COLOURING[house].toLowerCase()} This is a character reading, not an outcome prediction.`;
  }, [house, dignityData]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setHouse(11);
    setDignity("friend");
    setMistakes({ "fixed-meaning": false, "twelfth-weak": false, "mars-saturn-here": false });
  }

  function applyPreset(key: "chartL1" | "contrast") {
    if (key === "chartL1") {
      setHouse(11);
      setDignity("friend");
    } else {
      setHouse(0);
      setDignity("exalted");
    }
  }

  return (
    <div
      data-interactive="mars-contest-karaka-litigation"
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
            <p style={eyebrowStyle}>Chart L1 — Mars as contest kāraka</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              The chart&apos;s instrument of directed action under conflict
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Mars is read for the native&apos;s own capacity to engage a contest. Click any house to place Mars there, then change its dignity to see how the same kāraka produces a different character.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>From general valour to litigation contest capacity</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          <MiniFact icon={<Swords size={16} />} title="Valour" body="Courage, directed action, and the will to engage." color={VERMILION} />
          <MiniFact icon={<MapPin size={16} />} title="House placement" body="Colours where and how the energy expresses itself." color={BLUE} />
          <MiniFact icon={<GraduationCap size={16} />} title="Dignity" body="Shapes whether the energy is supported, strained, or at peak." color={GREEN} />
        </div>
        <p
          style={{
            margin: "0.75rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.6,
          }}
        >
          For litigation, the relevant Mars thread is <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>valour and directed action under conflict</strong>. The 6th house describes the terrain of the dispute; Mars describes the native&apos;s own instrument for engaging it.
        </p>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Place Mars and set its dignity</p>
          <MarsWheel house={house} onSelect={setHouse} />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.65rem",
            }}
          >
            <button
              type="button"
              onClick={() => applyPreset("chartL1")}
              style={buttonStyle(house === 11 && dignity === "friend", BLUE)}
            >
              <MapPin size={15} aria-hidden="true" />
              Chart L1: 12th, friend
            </button>
            <button
              type="button"
              onClick={() => applyPreset("contrast")}
              style={buttonStyle(house === 0 && dignity === "exalted", GREEN)}
            >
              <Swords size={15} aria-hidden="true" />
              Contrast: 1st, exalted
            </button>
          </div>

          <div style={{ marginTop: "0.85rem" }}>
            <p style={{ ...eyebrowStyle, marginBottom: "0.55rem" }}>Dignity</p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={dignity === key}
                  onClick={() => setDignity(key)}
                  style={smallChipStyle(dignity === key, DIGNITIES[key].color)}
                >
                  {DIGNITIES[key].label}
                </button>
              ))}
            </div>
            <p
              style={{
                margin: "0.65rem 0 0",
                color: INK_MUTED,
                fontSize: "0.82rem",
                lineHeight: 1.5,
              }}
            >
              Example sign shown for each dignity is illustrative; select the level that matches the chart you are reading.
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading</p>
          <div
            style={{
              marginTop: "0.45rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${dignityData.color}`,
              background: `${dignityData.color}${"0A"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: dignityData.color }}>
              <Swords size={18} aria-hidden="true" />
              <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                {dignityData.label} — {dignityData.sign}
              </span>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {dignityData.reading}
            </p>
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${BLUE}`,
              background: `${BLUE}${"0A"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: BLUE }}>
              <MapPin size={18} aria-hidden="true" />
              <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                {HOUSE_LABELS[house]} house colouring
              </span>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {HOUSE_COLOURING[house]}
            </p>
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
              <strong style={{ color: PURPLE, fontWeight: 600 }}>Forward pointer:</strong>{" "}
              Chart L1&apos;s Mars and Saturn share a genuine mutual 7th-house aspect. The full Mars-Saturn dynamic is reserved for Chapter 2.
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED }}>
          <Info size={18} aria-hidden="true" />
          <p style={eyebrowStyle}>Worked example — Chart L1</p>
        </div>
        <ol
          style={{
            margin: "0.65rem 0 0",
            paddingLeft: "1.2rem",
            color: INK_SECONDARY,
            lineHeight: 1.7,
          }}
        >
          <li>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Placement:</strong> Mars occupies the 12th house.
          </li>
          <li>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Dignity:</strong> Mars is in Leo, a friend&apos;s sign — reasonably supported.
          </li>
          <li>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>House colouring:</strong> The 12th colours contest-energy toward indirect, hidden, or institutionally mediated channels.
          </li>
          <li>
            <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Synthesis:</strong> Reasonably well-supported contest-energy, but not open confrontation; a character reading, not an outcome prediction.
          </li>
        </ol>
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
          borderColor: `${VERMILION}66`,
          background: `${VERMILION}${"0A"}`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3
          style={{
            margin: "0.15rem 0 0",
            color: VERMILION,
            fontSize: "1.15rem",
            fontWeight: 600,
          }}
        >
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          Mars in the {HOUSE_LABELS[house].toLowerCase()}, {dignityData.label.toLowerCase()}
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function MarsWheel({ house, onSelect }: { house: number; onSelect: (house: number) => void }) {
  const cx = 150;
  const cy = 150;
  const r = 95;

  return (
    <svg
      viewBox="0 0 300 300"
      role="img"
      aria-label="Twelve-house wheel with Mars placed in the selected house"
      style={{ width: "100%", maxHeight: 300, display: "block", marginTop: "0.55rem" }}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => i).map((h) => {
        const angle = (h / 12) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const selected = h === house;
        return (
          <g key={h}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke={HAIRLINE} strokeWidth={1} />
            <circle
              cx={cx + (r - 32) * Math.cos(angle)}
              cy={cy + (r - 32) * Math.sin(angle)}
              r={selected ? 17 : 11}
              fill={selected ? VERMILION : SURFACE}
              stroke={selected ? VERMILION : HAIRLINE}
              strokeWidth={selected ? 3 : 1}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(h)}
            />
            <text
              x={cx + (r - 32) * Math.cos(angle)}
              y={cy + (r - 32) * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={selected ? "#fff" : INK_SECONDARY}
              fontSize={selected ? 12 : 10}
              fontWeight={600}
              style={{ pointerEvents: "none" }}
            >
              {h + 1}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={44} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={INK_PRIMARY} fontSize={13} fontWeight={600}>
        Mars
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={600}>
        {HOUSE_LABELS[house]}
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

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
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
