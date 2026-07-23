"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { RotateCcw, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

type Sign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

type Lord =
  | "Sun"
  | "Moon"
  | "Mars"
  | "Mercury"
  | "Jupiter"
  | "Venus"
  | "Saturn"
  | "Rahu"
  | "Ketu";

const SIGNS: Sign[] = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

const LORD_OF_SIGN: Record<Sign, Lord> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const KAVYA_LAGNA: Sign = "Cancer";

const KAVYA_POSITIONS: Record<Lord, Sign> = {
  Sun: "Cancer",
  Moon: "Sagittarius",
  Mars: "Aries",
  Mercury: "Cancer",
  Jupiter: "Pisces",
  Venus: "Leo",
  Saturn: "Libra",
  Rahu: "Gemini",
  Ketu: "Sagittarius",
};

const AD_LORDS: Lord[] = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Rahu",
  "Ketu",
];

const LORD_COLOR: Record<Lord, string> = {
  Sun: "#E8B845",
  Moon: "#5A6B8A",
  Mars: "#C8412E",
  Mercury: "#3A8C5A",
  Jupiter: "#E89E2A",
  Venus: "#4A7AA8",
  Saturn: "#5A5A78",
  Rahu: "#5A5C68",
  Ketu: "#7A3E4A",
};

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "var(--gold-dark, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#B88421";
const GOLD_TINT = "#FFF8E8";
const GREEN_TINT = "#EAF4EE";
const VERMILION_TINT = "#FDEBE6";
const AMBER_TINT = "#FFF4DE";
const BLUE_TINT = "#EAF0F8";
const MUTED_TINT = "#F4EFE4";

const QUESTIONS = [
  { label: "Marriage", house: 7 },
  { label: "Career", house: 10 },
  { label: "Wealth", house: 2 },
  { label: "Gains", house: 11 },
  { label: "Children", house: 5 },
  { label: "Health", house: 1 },
  { label: "Siblings", house: 3 },
];

function signIndex(sign: Sign) {
  return SIGNS.indexOf(sign);
}

function houseToSign(house: number): Sign {
  return SIGNS[(signIndex(KAVYA_LAGNA) + house - 1 + 12) % 12];
}

function signToHouse(sign: Sign): number {
  return ((signIndex(sign) - signIndex(KAVYA_LAGNA) + 12) % 12) + 1;
}

function getAspectTargets(lord: Lord, sign: Sign, includeNodes: boolean): Sign[] {
  if ((lord === "Rahu" || lord === "Ketu") && !includeNodes) return [];
  const idx = signIndex(sign);
  const offsets = [7];
  if (lord === "Mars") offsets.push(4, 8);
  if (lord === "Jupiter") offsets.push(5, 9);
  if (lord === "Saturn") offsets.push(3, 10);
  return offsets.map((o) => SIGNS[(idx + o - 1 + 12) % 12]);
}

function relationshipFor(lord: Lord, house: number, includeNodes: boolean) {
  const cuspSign = houseToSign(house);
  const lordSign = KAVYA_POSITIONS[lord];
  const occupies = lordSign === cuspSign;
  const aspects = getAspectTargets(lord, lordSign, includeNodes).includes(cuspSign);
  const owns = LORD_OF_SIGN[cuspSign] === lord;
  return { occupies, aspects, owns };
}

export function DashaCuspInterplayDoctrineWorkbench() {
  const [house, setHouse] = useState(7);
  const [selectedLord, setSelectedLord] = useState<Lord>("Sun");
  const [includeNodes, setIncludeNodes] = useState(false);
  const [showRule, setShowRule] = useState(false);
  const [saturnChoice, setSaturnChoice] = useState<string | null>(null);

  const cuspSign = houseToSign(house);
  const rel = relationshipFor(selectedLord, house, includeNodes);

  function reset() {
    setHouse(7);
    setSelectedLord("Sun");
    setIncludeNodes(false);
    setShowRule(false);
    setSaturnChoice(null);
  }

  const matrix = useMemo(
    () =>
      AD_LORDS.map((lord) => ({
        lord,
        sign: KAVYA_POSITIONS[lord],
        house: signToHouse(KAVYA_POSITIONS[lord]),
        ...relationshipFor(lord, house, includeNodes),
      })),
    [house, includeNodes]
  );

  return (
    <div
      data-interactive="dasha-cusp-interplay-doctrine-workbench"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY, fontFamily: "var(--font-family-sans)" }}
    >
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chapter 3 lens</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Dasha-Cusp Interplay Workbench
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Check whether a running sub-period lord reaches the house a question is actually about —
              through occupation, aspect, or ownership.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Pick the question to set the relevant cusp</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
          {QUESTIONS.map((q) => (
            <button
              key={q.house}
              type="button"
              onClick={() => {
                setHouse(q.house);
                setSaturnChoice(null);
              }}
              style={chipStyle(house === q.house)}
            >
              {q.label} <span style={{ color: INK_MUTED, fontSize: "0.75em" }}>(h{q.house})</span>
            </button>
          ))}
        </div>
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem" }}>
          Current relevant cusp: <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{cuspSign}</span> — the {house}th house.
        </p>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={eyebrowStyle}>Kavya’s whole-sign chart</p>
          <HouseWheel house={house} selectedLord={selectedLord} />
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.75rem", justifyContent: "center" }}>
            {AD_LORDS.map((lord) => {
              const inSign = KAVYA_POSITIONS[lord];
              const isSelected = selectedLord === lord;
              return (
                <button
                  key={lord}
                  type="button"
                  onClick={() => {
                    setSelectedLord(lord);
                    setSaturnChoice(null);
                  }}
                  title={`${lord} in ${inSign}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.6rem",
                    borderRadius: "6px",
                    border: `1px solid ${isSelected ? LORD_COLOR[lord] : HAIRLINE}`,
                    background: isSelected ? tintForLord(lord) : SURFACE,
                    color: isSelected ? LORD_COLOR[lord] : INK_PRIMARY,
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: LORD_COLOR[lord],
                      display: "inline-block",
                    }}
                  />
                  {lord}
                </button>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Relationship panel — {selectedLord} and the {house}th cusp</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <RelCard
              title="Occupation"
              isActive={rel.occupies}
              activeText={`${selectedLord} is placed in ${KAVYA_POSITIONS[selectedLord]}, which is the ${house}th house.`}
              inactiveText={`${selectedLord} is in ${KAVYA_POSITIONS[selectedLord]}, not in the ${house}th house.`}
            />
            <RelCard
              title="Aspect"
              isActive={rel.aspects}
              activeText={`${selectedLord} casts graha dṛṣṭi onto ${cuspSign} from ${KAVYA_POSITIONS[selectedLord]}.`}
              inactiveText={`${selectedLord} does not aspect ${cuspSign} from ${KAVYA_POSITIONS[selectedLord]}.`}
            />
            <RelCard
              title="Ownership"
              isActive={rel.owns}
              activeText={`${selectedLord} rules ${cuspSign}, the sign on the ${house}th cusp.`}
              inactiveText={`${selectedLord} does not rule ${cuspSign}.`}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowRule((v) => !v)}
            style={{ ...buttonStyle(showRule, GOLD), marginTop: "1rem" }}
          >
            <Info size={15} aria-hidden="true" /> {showRule ? "Hide" : "Show"} aspect rule for {selectedLord}
          </button>

          {showRule && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.9rem",
                borderRadius: "8px",
                background: GOLD_TINT,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.9rem" }}>
                {selectedLord === "Mars" && "Mars aspects the 4th, 7th, and 8th from its sign."}
                {selectedLord === "Jupiter" && "Jupiter aspects the 5th, 7th, and 9th from its sign."}
                {selectedLord === "Saturn" && "Saturn aspects the 3rd, 7th, and 10th from its sign."}
                {!["Mars", "Jupiter", "Saturn"].includes(selectedLord) &&
                  `${selectedLord} has only the universal 7th-house aspect from its sign.`}
              </p>
            </div>
          )}
        </section>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setIncludeNodes((v) => !v)}
          style={pillStyle(includeNodes)}
        >
          {includeNodes ? "Hide nodal aspects" : "Include Rāhu/Ketu aspects"}
        </button>
        {includeNodes && (
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: VERMILION, fontSize: "0.85rem" }}>
            <AlertTriangle size={16} /> Nodal aspect rules are disputed — not the lesson default.
          </span>
        )}
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Full matrix for the {house}th cusp</p>
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", minWidth: 480 }}>
            <thead>
              <tr style={{ background: GOLD_TINT }}>
                <th style={thStyle}>AD lord</th>
                <th style={thStyle}>Sign / House</th>
                <th style={thStyle}>Occupies</th>
                <th style={thStyle}>Aspects</th>
                <th style={thStyle}>Owns</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => {
                const isSelected = row.lord === selectedLord;
                return (
                  <tr
                    key={row.lord}
                    onClick={() => {
                      setSelectedLord(row.lord);
                      setSaturnChoice(null);
                    }}
                    style={{
                      background: isSelected ? tintForLord(row.lord) : "transparent",
                      cursor: "pointer",
                    }}
                  >
                    <td style={tdStyle}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: isSelected ? 600 : 400 }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: LORD_COLOR[row.lord] }} />
                        {row.lord}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {row.sign} <span style={{ color: INK_MUTED }}>(h{row.house})</span>
                    </td>
                    <td style={tdStyle}>{row.occupies ? <Yes /> : <No />}</td>
                    <td style={tdStyle}>{row.aspects ? <Yes /> : <No />}</td>
                    <td style={tdStyle}>{row.owns ? <Yes /> : <No />}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {house === 7 && selectedLord === "Saturn" && (
        <section style={{ ...cardStyle, borderColor: AMBER, background: AMBER_TINT }}>
          <p style={eyebrowStyle}>Precision check</p>
          <p style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Saturn rules Kavya’s 7th cusp (Capricorn) but sits in Libra, neither occupying nor aspecting it.
            Does this count as “dasha-cusp interplay” in this chapter’s specific sense?
          </p>
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
            {[
              { id: "yes", text: "Yes — ownership is itself a form of cusp-interplay." },
              { id: "separate", text: "Ownership is a real, separate classical principle, but it is not aspect-or-occupation interplay." },
              { id: "no", text: "No — Saturn has no relationship to the 7th cusp at all." },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSaturnChoice(opt.id)}
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  border: `1px solid ${HAIRLINE}`,
                  background: saturnChoice === opt.id ? (opt.id === "separate" ? GREEN_TINT : VERMILION_TINT) : SURFACE,
                  color: INK_PRIMARY,
                  cursor: "pointer",
                }}
              >
                {opt.text}
              </button>
            ))}
          </div>
          {saturnChoice === "separate" && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
              <CheckCircle2 size={20} color={GREEN} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Correct. Ownership is classical and meaningful, but this chapter’s cusp-interplay lens
                specifically tracks whether the running lord reaches the house through aspect or occupation.
              </p>
            </div>
          )}
          {saturnChoice && saturnChoice !== "separate" && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", alignItems: "start" }}>
              <AlertTriangle size={20} color={VERMILION} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                This matches Common Mistake #2. Do not collapse the three relationships into one question.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function HouseWheel({ house, selectedLord }: { house: number; selectedLord: Lord }) {
  const cx = 140;
  const cy = 140;
  const rOut = 100;
  const rIn = 55;
  const lagnaIndex = signIndex(KAVYA_LAGNA);

  function polar(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function sectorPath(startAngle: number, endAngle: number) {
    const a1 = polar(startAngle, rOut);
    const a2 = polar(endAngle, rOut);
    const b1 = polar(startAngle, rIn);
    const b2 = polar(endAngle, rIn);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${b1.x} ${b1.y} L ${a1.x} ${a1.y} A ${rOut} ${rOut} 0 ${largeArc} 1 ${a2.x} ${a2.y} L ${b2.x} ${b2.y} A ${rIn} ${rIn} 0 ${largeArc} 0 ${b1.x} ${b1.y}`;
  }

  const selectedSign = houseToSign(house);
  const selectedLordSign = KAVYA_POSITIONS[selectedLord];

  return (
    <svg viewBox="0 0 280 280" style={{ width: "100%", maxWidth: 360, marginTop: "0.75rem", overflow: "visible" }}>
      {SIGNS.map((sign, i) => {
        const houseNum = ((i - lagnaIndex + 12) % 12) + 1;
        const startAngle = i * 30;
        const endAngle = (i + 1) * 30;
        const midAngle = startAngle + 15;
        const isSelected = sign === selectedSign;
        const isLordSign = sign === selectedLordSign;
        const outerLabel = polar(midAngle, rOut - 12);
        const innerLabel = polar(midAngle, rIn + 14);

        return (
          <g key={sign}>
            <path
              d={sectorPath(startAngle, endAngle)}
              fill={isSelected ? GOLD_TINT : isLordSign ? tintForLord(selectedLord) : SURFACE}
              stroke={isSelected ? GOLD : HAIRLINE}
              strokeWidth={isSelected ? 2 : 1}
            />
            <text
              x={outerLabel.x}
              y={outerLabel.y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "7px", fill: INK_MUTED, fontWeight: 600 }}
            >
              {sign.slice(0, 3)}
            </text>
            <text
              x={innerLabel.x}
              y={innerLabel.y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "8px", fill: INK_PRIMARY, fontWeight: 700 }}
            >
              h{houseNum}
            </text>
          </g>
        );
      })}

      {/* Planet glyphs placed in their signs */}
      {AD_LORDS.map((lord) => {
        const sign = KAVYA_POSITIONS[lord];
        const i = signIndex(sign);
        const angle = i * 30 + 15 + (lord === selectedLord ? 0 : (AD_LORDS.indexOf(lord) % 3) * 8);
        const pos = polar(angle, rOut + 18);
        const isSelected = lord === selectedLord;
        return (
          <g key={lord}>
            <circle cx={pos.x} cy={pos.y} r={7} fill={LORD_COLOR[lord]} opacity={isSelected ? 1 : 0.85} />
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "6px", fill: "#fff", fontWeight: 700 }}
            >
              {lord[0]}
            </text>
          </g>
        );
      })}

      {/* Lagna marker */}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: GOLD, fontWeight: 700 }}>
        Asc
      </text>
    </svg>
  );
}

function RelCard({
  title,
  isActive,
  activeText,
  inactiveText,
}: {
  title: string;
  isActive: boolean;
  activeText: string;
  inactiveText: string;
}) {
  return (
    <div
      style={{
        padding: "0.9rem",
        borderRadius: "8px",
        border: `1px solid ${isActive ? GREEN : HAIRLINE}`,
        background: isActive ? `${GREEN}0C` : SURFACE,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, color: INK_MUTED }}>
          {title}
        </p>
        {isActive ? <Yes /> : <No />}
      </div>
      <p style={{ margin: "0.4rem 0 0", color: isActive ? INK_PRIMARY : INK_SECONDARY, lineHeight: 1.5, fontSize: "0.92rem" }}>
        {isActive ? activeText : inactiveText}
      </p>
    </div>
  );
}

function Yes() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.25rem",
        color: GREEN,
        fontSize: "0.8rem",
        fontWeight: 600,
      }}
    >
      <CheckCircle2 size={14} /> Yes
    </span>
  );
}

function No() {
  return (
    <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 500 }}>No</span>
  );
}

function tintForLord(lord: Lord): string {
  switch (lord) {
    case "Sun":
    case "Jupiter":
      return GOLD_TINT;
    case "Mercury":
      return GREEN_TINT;
    case "Mars":
    case "Ketu":
      return VERMILION_TINT;
    case "Moon":
    case "Venus":
      return BLUE_TINT;
    case "Saturn":
    case "Rahu":
      return MUTED_TINT;
    default:
      return MUTED_TINT;
  }
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "8px",
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  fontWeight: 700,
  color: INK_MUTED,
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.45rem 0.9rem",
    borderRadius: "8px",
    border: `1px solid ${color}`,
    background: active ? color : "transparent",
    color: active ? "#fff" : color,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: "0.35rem 0.75rem",
    borderRadius: "6px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? GOLD_TINT : SURFACE,
    color: active ? GOLD : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function pillStyle(active: boolean): CSSProperties {
  return {
    padding: "0.4rem 0.85rem",
    borderRadius: "9999px",
    border: `1px solid ${active ? GOLD : HAIRLINE}`,
    background: active ? GOLD_TINT : "transparent",
    color: active ? GOLD : INK_SECONDARY,
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const thStyle: CSSProperties = {
  padding: "0.6rem 0.75rem",
  textAlign: "left",
  fontWeight: 600,
  color: INK_MUTED,
  borderBottom: `1px solid ${HAIRLINE}`,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.75rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
};
