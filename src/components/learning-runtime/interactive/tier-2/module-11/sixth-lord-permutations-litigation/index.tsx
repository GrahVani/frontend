"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Layers,
  MapPin,
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
const NEUTRAL = "#8A8578";

const HOUSE_LABELS: Record<number, string> = {
  1: "Lagna",
  2: "2nd",
  3: "3rd",
  4: "4th",
  5: "5th",
  6: "6th",
  7: "7th",
  8: "8th",
  9: "9th",
  10: "10th",
  11: "11th",
  12: "12th",
};

const FAMILIES = {
  neutral: {
    key: "neutral",
    label: "Neutral ground",
    color: NEUTRAL,
    houses: [2],
    reading:
      "Not one of the five named families. Read the occupant strength and the lord’s condition carefully without forcing a family label.",
  },
  own: {
    key: "own",
    label: "Own house (6th)",
    color: PURPLE,
    houses: [6],
    reading:
      "Direct, self-contained governance. The litigation domain is managed by its own natural ruler with no entanglement from another house’s concerns — structurally one of the cleanest permutations.",
  },
  kendra: {
    key: "kendra",
    label: "Kendra",
    color: BLUE,
    houses: [1, 4, 7, 10],
    reading:
      "Contest matters become prominent and active in visible life. The dispute is brought into sharp, public focus rather than staying latent.",
  },
  trikona: {
    key: "trikona",
    label: "Trikona",
    color: GREEN,
    houses: [1, 5, 9],
    reading:
      "Fortune and dharma lend auspiciousness to the contest domain. The native’s own merit and fortune actively support their position.",
  },
  otherDusthana: {
    key: "otherDusthana",
    label: "Another dusthāna",
    color: VERMILION,
    houses: [8, 12],
    reading:
      "The 6th’s difficulties become entangled with a different house’s difficulties. The entanglement’s character differs: 8th brings transformation and shared-resource stress; 12th brings loss, cost, or dissolution themes.",
  },
  otherUpachaya: {
    key: "otherUpachaya",
    label: "Another upachaya",
    color: GOLD,
    houses: [3, 10, 11],
    reading:
      "The growing-with-effort character extends into another domain — courage/effort, career, or gains — potentially resourcing the contest’s resolution.",
  },
} as const;

type FamilyKey = keyof typeof FAMILIES;

const HOUSE_READINGS: Record<
  number,
  { family: FamilyKey; nuance: string }
> = {
  1: {
    family: "kendra",
    nuance:
      "Also counts as trikoṇa: the native’s own body, merit, and fortune all carry the contest forward.",
  },
  2: { family: "neutral", nuance: "Neutral sustaining ground; not one of the five named families, so read occupant + lord condition carefully." },
  3: {
    family: "otherUpachaya",
    nuance: "Courage, effort, and self-help become part of the resolution path.",
  },
  4: {
    family: "kendra",
    nuance: "The matter gains emotional or home-life prominence; contests may touch property or private foundations.",
  },
  5: {
    family: "trikona",
    nuance: "Merit, counsel, and past good karma support the native’s position.",
  },
  6: {
    family: "own",
    nuance: "Chart L1’s case: Saturn in its own house, ruling the house it occupies.",
  },
  7: {
    family: "kendra",
    nuance: "The dispute becomes relational or partnership-oriented, played out in the open with the other party.",
  },
  8: {
    family: "otherDusthana",
    nuance:
      "Transformation, shared resources, and sudden reversals entangle with the contest; more complicating than the own-house case.",
  },
  9: {
    family: "trikona",
    nuance: "Dharma, guru, and fortune lend support; legal counsel and principle matter.",
  },
  10: {
    family: "kendra",
    nuance:
      "Also an upachaya: career and public status become entangled with the contest, but effort over time can convert pressure into drive.",
  },
  11: {
    family: "otherUpachaya",
    nuance: "Gains, networks, and elder allies may resource the resolution.",
  },
  12: {
    family: "otherDusthana",
    nuance:
      "Loss, cost, foreign or institutional distance, or the need to let go become part of the dispute’s character.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "own-best",
    label: "6th lord in its own house is automatically the single best possible placement.",
    correction:
      "Each family describes a different character, not a simple ranking. A trikoṇa placement has its own distinct favourable reading.",
  },
  {
    key: "ignore-occupants",
    label: "The 6th lord’s placement replaces the need to look at the house’s own occupants.",
    correction:
      "A house is read through two channels — occupants and lord placement — layered together, not as alternatives.",
  },
  {
    key: "dusthana-same",
    label: "6th lord in the 8th and 6th lord in the 12th are interchangeable.",
    correction:
      "The 8th entangles the contest with transformation and shared resources; the 12th with loss, cost, and dissolution. The character differs.",
  },
] as const;

export function SixthLordPermutationsLitigation() {
  const [selectedHouse, setSelectedHouse] = useState<number>(6);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "own-best": false,
    "ignore-occupants": false,
    "dusthana-same": false,
  });

  const current = HOUSE_READINGS[selectedHouse];
  const family = FAMILIES[current.family];

  const synthesis = useMemo(() => {
    return `With the 6th lord in the ${HOUSE_LABELS[selectedHouse].toLowerCase()}, the contest domain takes on the ${family.label.toLowerCase()} character: ${family.reading} This is one layer only — read it together with whatever occupies the 6th house itself.`;
  }, [selectedHouse, family]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSelectedHouse(6);
    setMistakes({ "own-best": false, "ignore-occupants": false, "dusthana-same": false });
  }

  return (
    <div
      data-interactive="sixth-lord-permutations-litigation"
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
            <p style={eyebrowStyle}>Chart L1 — 6th lord permutations</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: BLUE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Where the 6th lord goes, the contest changes character
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Click any house on the wheel to place the 6th lord there and see which classical family the placement belongs to — and what that means for litigation.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED }}>
          <Layers size={18} aria-hidden="true" />
          <p style={eyebrowStyle}>Reading method</p>
        </div>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          A house is read through <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>two channels</strong>: what occupies the house (Lessons 11.1.1–11.1.2) and where the house&apos;s own lord has travelled (this lesson). These are layered together, not used as alternatives.
        </p>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Place the 6th lord</p>
          <LordWheel selectedHouse={selectedHouse} onSelect={setSelectedHouse} />
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
              onClick={() => setSelectedHouse(6)}
              style={buttonStyle(selectedHouse === 6, PURPLE)}
            >
              <MapPin size={15} aria-hidden="true" />
              Chart L1: 6th
            </button>
            <button
              type="button"
              onClick={() => setSelectedHouse(8)}
              style={buttonStyle(selectedHouse === 8, VERMILION)}
            >
              <XCircle size={15} aria-hidden="true" />
              Contrast: 8th
            </button>
            <button
              type="button"
              onClick={() => setSelectedHouse(12)}
              style={buttonStyle(selectedHouse === 12, VERMILION)}
            >
              <XCircle size={15} aria-hidden="true" />
              Contrast: 12th
            </button>
            <button
              type="button"
              onClick={() => setSelectedHouse(10)}
              style={buttonStyle(selectedHouse === 10, GOLD)}
            >
              <Scale size={15} aria-hidden="true" />
              Contrast: 10th
            </button>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Placement reading</p>
          <div
            style={{
              marginTop: "0.45rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${family.color}`,
              background: `${family.color}${"0A"}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: family.color }}>
              {current.family === "own" ? (
                <MapPin size={18} aria-hidden="true" />
              ) : current.family === "otherDusthana" ? (
                <XCircle size={18} aria-hidden="true" />
              ) : (
                <CheckCircle2 size={18} aria-hidden="true" />
              )}
              <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                {family.label}
              </span>
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {family.reading}
            </p>
            <p
              style={{
                margin: "0.55rem 0 0",
                color: INK_MUTED,
                fontSize: "0.86rem",
                lineHeight: 1.55,
              }}
            >
              <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Specific nuance:</strong>{" "}
              {current.nuance}
            </p>
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))",
              gap: "0.55rem",
            }}
          >
            {(Object.keys(FAMILIES) as FamilyKey[]).map((key) => {
              const f = FAMILIES[key];
              const active = current.family === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedHouse(f.houses[0])}
                  style={{
                    border: `1px solid ${active ? f.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? `${f.color}${"0A"}` : "transparent",
                    color: active ? f.color : INK_SECONDARY,
                    padding: "0.65rem",
                    textAlign: "left",
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  <span style={{ display: "block", fontSize: "0.78rem", color: INK_MUTED, marginBottom: 2 }}>
                    Family
                  </span>
                  {f.label}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED }}>
          <GraduationCap size={18} aria-hidden="true" />
          <p style={eyebrowStyle}>Family quick reference</p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {(Object.keys(FAMILIES) as FamilyKey[]).map((key) => {
            const f = FAMILIES[key];
            return (
              <div
                key={key}
                style={{
                  border: `1px solid ${f.color}44`,
                  borderRadius: 8,
                  background: `${f.color}${"08"}`,
                  padding: "0.85rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: f.color, fontWeight: 600 }}>
                  {key === "own" ? <MapPin size={16} /> : key === "otherDusthana" ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                  {f.label}
                </div>
                <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  {f.reading}
                </p>
                <p style={{ margin: "0.35rem 0 0", color: INK_MUTED, fontSize: "0.78rem" }}>
                  Houses: {f.houses.map((h) => HOUSE_LABELS[h]).join(", ")}
                </p>
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
          6th lord in the {HOUSE_LABELS[selectedHouse].toLowerCase()}
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function LordWheel({
  selectedHouse,
  onSelect,
}: {
  selectedHouse: number;
  onSelect: (house: number) => void;
}) {
  const cx = 150;
  const cy = 150;
  const r = 100;
  const selectedFamily = HOUSE_READINGS[selectedHouse].family;
  const selectedColor = FAMILIES[selectedFamily].color;

  return (
    <svg
      viewBox="0 0 760 360"
      role="img"
      aria-label="Twelve-house wheel. The 6th house is fixed; click any house to place the 6th lord there."
      style={{ width: "100%", minHeight: 360, display: "block", marginTop: "0.55rem" }}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={2} />
      {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
        const angle = ((house - 1) / 12) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const isSixth = house === 6;
        const isSelected = house === selectedHouse;
        const familyKey = HOUSE_READINGS[house].family;
        const familyColor = FAMILIES[familyKey].color;

        return (
          <g key={house}>
            <line
              x1={cx}
              y1={cy}
              x2={x}
              y2={y}
              stroke={HAIRLINE}
              strokeWidth={1}
            />
            <circle
              cx={cx + (r - 34) * Math.cos(angle)}
              cy={cy + (r - 34) * Math.sin(angle)}
              r={isSelected ? 18 : isSixth ? 14 : 11}
              fill={isSelected ? familyColor : isSixth ? `${VERMILION}${"15"}` : SURFACE}
              stroke={isSelected ? familyColor : isSixth ? VERMILION : HAIRLINE}
              strokeWidth={isSelected ? 3 : isSixth ? 2 : 1}
              style={{ cursor: "pointer" }}
              onClick={() => onSelect(house)}
            />
            <text
              x={cx + (r - 34) * Math.cos(angle)}
              y={cy + (r - 34) * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isSelected ? "#fff" : isSixth ? VERMILION : INK_SECONDARY}
              fontSize={isSelected ? 12 : 10}
              fontWeight={600}
              style={{ pointerEvents: "none" }}
            >
              {house}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={42} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={INK_PRIMARY} fontSize={13} fontWeight={600}>
        6th house
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={600}>
        Aquarius
      </text>

      <rect x="0" y="0" width="760" height="360" fill={SURFACE} />
      <rect x="18" y="18" width="724" height="324" rx="12" fill={`${GOLD}${"06"}`} stroke={HAIRLINE} />

      <text x="380" y="52" textAnchor="middle" fill={INK_MUTED} fontSize="14" fontWeight={700}>
        Place the 6th lord
      </text>

      <rect x="56" y="112" width="190" height="112" rx="14" fill={`${PURPLE}${"10"}`} stroke={PURPLE} strokeWidth="2" />
      <text x="151" y="148" textAnchor="middle" fill={PURPLE} fontSize="16" fontWeight={700}>
        Source house
      </text>
      <text x="151" y="178" textAnchor="middle" fill={INK_PRIMARY} fontSize="24" fontWeight={700}>
        6th house
      </text>
      <text x="151" y="206" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight={600}>
        Aquarius
      </text>

      <line x1="250" y1="168" x2="490" y2="168" stroke={selectedColor} strokeWidth="4" strokeLinecap="round" />
      <path d="M 490 168 L 474 158 L 474 178 Z" fill={selectedColor} />
      <text x="370" y="148" textAnchor="middle" fill={selectedColor} fontSize="15" fontWeight={700}>
        lord travels to
      </text>

      <rect x="500" y="104" width="204" height="128" rx="14" fill={`${selectedColor}${"12"}`} stroke={selectedColor} strokeWidth="2.5" />
      <text x="602" y="140" textAnchor="middle" fill={selectedColor} fontSize="16" fontWeight={700}>
        Selected placement
      </text>
      <text x="602" y="174" textAnchor="middle" fill={INK_PRIMARY} fontSize="28" fontWeight={700}>
        {HOUSE_LABELS[selectedHouse]} house
      </text>
      <text x="602" y="205" textAnchor="middle" fill={INK_SECONDARY} fontSize="15" fontWeight={600}>
        {FAMILIES[selectedFamily].label}
      </text>

      <foreignObject x="60" y="260" width="640" height="58">
        <div
          style={{
            display: "flex",
            gap: "6px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((house) => {
            const familyColor = FAMILIES[HOUSE_READINGS[house].family].color;
            const isSelected = house === selectedHouse;
            return (
              <button
                key={house}
                type="button"
                onClick={() => onSelect(house)}
                style={{
                  width: 42,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${isSelected ? familyColor : HAIRLINE}`,
                  background: isSelected ? `${familyColor}22` : SURFACE,
                  color: isSelected ? familyColor : INK_SECONDARY,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {house}
              </button>
            );
          })}
        </div>
      </foreignObject>

      <g transform={`translate(${cx - 40}, ${cy + 62})`} opacity={0} pointerEvents="none">
        <rect x={0} y={0} width={80} height={22} rx={6} fill={`${FAMILIES[HOUSE_READINGS[selectedHouse].family].color}${"15"}`} stroke={FAMILIES[HOUSE_READINGS[selectedHouse].family].color} />
        <text x={40} y={15} textAnchor="middle" fill={FAMILIES[HOUSE_READINGS[selectedHouse].family].color} fontSize={10} fontWeight={600}>
          lord → {HOUSE_LABELS[selectedHouse]}
        </text>
      </g>
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
